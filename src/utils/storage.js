import { initialProperties } from "../data/initialProperties";
import { saveMediaItem } from "./mediaDb";

const PROPERTIES_KEY = "gp_properties_v2";
const LEADS_KEY = "gp_seller_leads_v1";
const SETTINGS_KEY = "gp_settings_v1";
const CLOUD_SYNC_BIN = "https://extendsclass.com/api/json-storage/bin/fbcbeeb";

export const defaultSettings = {
  consultantName: "Gurdaspur Property Consultants",
  primaryPhone: "+91 81465 26257",
  whatsappNumber: "918146526257",
  officeAddress: "Travelx, Batala Road, Gurdaspur (Near Vishal Mega Mart), Punjab 143521",
  email: "navkiransharma@gmail.com",
  workingHours: "9:00 AM - 8:00 PM (Monday - Sunday)",
  adminPin: "4051#",
  surveyorPin: "2026#",
  autoPublishSurveys: false
};

// Safe storage wrapper to prevent quota exceeded crashes
function safeSetLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn(`localStorage quota exceeded for ${key}. Mitigating...`, e);
    if (key === LEADS_KEY) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          // Keep newest 10 leads, truncate large image arrays
          const lightLeads = parsed.slice(0, 10).map(l => ({
            ...l,
            images: (l.images || []).slice(0, 2)
          }));
          localStorage.setItem(key, JSON.stringify(lightLeads));
          return true;
        }
      } catch (err2) {
        console.error("Secondary storage error:", err2);
      }
    }
    return false;
  }
}

export const getProperties = () => {
  try {
    const data = localStorage.getItem(PROPERTIES_KEY);
    if (!data) {
      const oldData = localStorage.getItem("gp_properties_v1");
      let customProps = [];
      if (oldData) {
        try {
          const parsedOld = JSON.parse(oldData);
          customProps = parsedOld.filter(p => !initialProperties.some(ip => ip.id === p.id));
        } catch (err) {
          console.error(err);
        }
      }
      const merged = [...initialProperties, ...customProps];
      safeSetLocalStorage(PROPERTIES_KEY, JSON.stringify(merged));
      return merged;
    }
    const parsed = JSON.parse(data);
    const updated = parsed.map(p => {
      const initMatch = initialProperties.find(ip => ip.id === p.id);
      if (initMatch) {
        return { ...p, images: initMatch.images };
      }
      return p;
    });
    return updated;
  } catch (e) {
    console.error("Error reading properties from storage", e);
    return initialProperties;
  }
};

export const saveProperties = (properties) => {
  try {
    safeSetLocalStorage(PROPERTIES_KEY, JSON.stringify(properties));
    // Asynchronously sync custom properties to cloud
    pushCloudData(null, properties);
  } catch (e) {
    console.error("Error saving properties", e);
  }
};

export const getSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return defaultSettings;
    const parsed = JSON.parse(data);
    if (
      parsed.primaryPhone?.includes("98888") || 
      parsed.whatsappNumber?.includes("98888") ||
      !parsed.officeAddress?.includes("Travelx") ||
      parsed.adminPin === "1234" ||
      parsed.adminPin === "4051" ||
      !parsed.email || parsed.email.includes("contact@gurdaspurproperty.in")
    ) {
      parsed.primaryPhone = defaultSettings.primaryPhone;
      parsed.whatsappNumber = defaultSettings.whatsappNumber;
      parsed.officeAddress = defaultSettings.officeAddress;
      parsed.email = "navkiransharma@gmail.com";
      if (parsed.adminPin === "1234" || parsed.adminPin === "4051") {
        parsed.adminPin = "4051#";
      }
      if (!parsed.surveyorPin) {
        parsed.surveyorPin = "2026#";
      }
      safeSetLocalStorage(SETTINGS_KEY, JSON.stringify(parsed));
    }
    return { ...defaultSettings, ...parsed, surveyorPin: parsed.surveyorPin || "2026#" };
  } catch (e) {
    return defaultSettings;
  }
};

export const saveSettings = (newSettings) => {
  try {
    safeSetLocalStorage(SETTINGS_KEY, JSON.stringify(newSettings));
  } catch (e) {
    console.error("Error saving settings", e);
  }
};

export const getLeads = () => {
  try {
    const data = localStorage.getItem(LEADS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// Push leads & custom properties to cloud storage bin for cross-device sync
export async function pushCloudData(leadsToPush, propertiesToPush) {
  try {
    const rawLeads = leadsToPush || getLeads();
    const sanitizedLeads = rawLeads.slice(0, 30).map(l => {
      const copy = { ...l };
      if (copy.videoFile && copy.videoFile.dataUrl) {
        copy.videoFile = {
          name: copy.videoFile.name,
          size: copy.videoFile.size,
          hasVideo: true,
          mediaId: copy.id + '_video'
        };
      }
      if (copy.images && copy.images.length > 4) {
        copy.images = copy.images.slice(0, 4);
      }
      return copy;
    });

    const allProps = propertiesToPush || getProperties();
    const customProps = allProps.filter(
      p => !initialProperties.some(ip => ip.id === p.id)
    );

    const payload = {
      leads: sanitizedLeads,
      properties: customProps,
      updatedAt: new Date().toISOString()
    };

    await fetch(CLOUD_SYNC_BIN, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn("Failed pushing cloud update:", err);
  }
}

// Sync latest leads & properties from cloud bin across all devices
export async function syncCloudData() {
  try {
    const res = await fetch(CLOUD_SYNC_BIN, {
      method: "GET",
      headers: { "Cache-Control": "no-cache" }
    });
    if (!res.ok) return { leads: getLeads(), properties: getProperties() };
    const cloudData = await res.json();

    // 1. Merge Cloud Leads with Local Leads
    const localLeads = getLeads();
    const cloudLeads = Array.isArray(cloudData.leads) ? cloudData.leads : [];
    
    const mergedLeadsMap = new Map();
    localLeads.forEach(l => mergedLeadsMap.set(l.id, l));
    cloudLeads.forEach(cl => {
      if (!mergedLeadsMap.has(cl.id)) {
        mergedLeadsMap.set(cl.id, cl);
      } else {
        const existing = mergedLeadsMap.get(cl.id);
        mergedLeadsMap.set(cl.id, { ...existing, ...cl });
      }
    });

    const mergedLeads = Array.from(mergedLeadsMap.values()).sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
    safeSetLocalStorage(LEADS_KEY, JSON.stringify(mergedLeads));

    // 2. Merge Cloud Properties with Local Properties
    let currentProps = getProperties();
    if (Array.isArray(cloudData.properties) && cloudData.properties.length > 0) {
      const propMap = new Map();
      currentProps.forEach(p => propMap.set(p.id, p));
      cloudData.properties.forEach(cp => {
        if (!propMap.has(cp.id)) {
          propMap.set(cp.id, cp);
        }
      });
      currentProps = Array.from(propMap.values());
      safeSetLocalStorage(PROPERTIES_KEY, JSON.stringify(currentProps));
    }

    return { leads: mergedLeads, properties: currentProps };
  } catch (err) {
    console.warn("Cloud sync failed or offline:", err);
    return { leads: getLeads(), properties: getProperties() };
  }
}

// Helper to auto-publish a survey lead as a live property
export function autoPublishSurvey(survey) {
  try {
    const priceNum = parseFloat(survey.price) || 0;
    const isRent = survey.purpose === 'rent';
    const sizeStr = survey.size || (survey.category === 'room' ? '1 Room Set' : '10 Marla');
    const newId = `GP-${Math.floor(100 + Math.random() * 900)}`;

    const defaultCover = survey.category === 'room'
      ? '/images/properties/gurdaspur_real_kothi.jpg'
      : survey.category === 'kothi'
      ? '/images/properties/gurdaspur_real_kothi.jpg'
      : survey.category === 'commercial'
      ? '/images/properties/gurdaspur_commercial_sco.jpg'
      : survey.category === 'land'
      ? '/images/properties/punjab_tubewell_farm.jpg'
      : '/images/properties/gurdaspur_plotted_colony.jpg';

    const images = (survey.images && survey.images.length > 0) ? survey.images : [defaultCover];

    const newProp = {
      id: newId,
      title: `${sizeStr} for ${isRent ? 'Rent' : 'Sale'} in ${survey.locality}`,
      category: survey.category || (isRent ? 'rent' : 'kothi'),
      purpose: survey.purpose || 'rent',
      price: priceNum,
      pricePerUnit: isRent 
        ? `₹${priceNum.toLocaleString('en-IN')}/mo` 
        : (priceNum >= 10000000 ? `₹${(priceNum / 10000000).toFixed(2)} Cr` : `₹${(priceNum / 100000).toFixed(2)} Lakh`),
      size: survey.size || '10 Marla',
      unit: survey.category === 'land' ? 'Kanal' : 'Marla',
      sqft: (parseFloat(survey.size) || 10) * 225,
      location: survey.locality || 'Gurdaspur',
      cityArea: survey.subArea ? `${survey.subArea}, ${survey.locality}` : survey.locality,
      description: `${sizeStr} available in ${survey.locality}. Road width: ${survey.roadWidth || '30 Ft'}. ${survey.notes || ''} Direct owner verified by Gurdaspur Property field team.`,
      amenities: [
        survey.parking || 'Parking Available',
        survey.waterSupply || 'Water Supply',
        'Physical GPS Verified',
        'Direct Landlord Deal'
      ],
      imageUrl: images[0],
      images: images,
      videoUrl: survey.videoUrl || '',
      badge: 'Verified Field Survey',
      verified: true,
      facing: survey.facing || 'East',
      status: 'available',
      dateAdded: new Date().toISOString().split('T')[0]
    };

    const currentProps = getProperties();
    const updatedProps = [newProp, ...currentProps];
    saveProperties(updatedProps);
    return newProp;
  } catch (err) {
    console.error("Auto publish error:", err);
    return null;
  }
}

export const addLead = async (lead) => {
  try {
    const leads = getLeads();
    const newId = "LEAD-" + Date.now().toString().slice(-6);

    // Save video in IndexedDB to prevent localStorage quota crash
    let sanitizedVideoFile = null;
    if (lead.videoFile) {
      if (lead.videoFile.dataUrl) {
        await saveMediaItem(newId + '_video', lead.videoFile.dataUrl, {
          name: lead.videoFile.name,
          size: lead.videoFile.size
        });
      }
      sanitizedVideoFile = {
        name: lead.videoFile.name,
        size: lead.videoFile.size,
        hasVideo: true,
        mediaId: newId + '_video',
        dataUrl: lead.videoFile.dataUrl
      };
    }

    const newLead = {
      ...lead,
      id: newId,
      videoFile: sanitizedVideoFile,
      createdAt: new Date().toISOString(),
      status: "new"
    };

    const currentSettings = getSettings();
    if (currentSettings.autoPublishSurveys && (newLead.isSurvey || newLead.type === 'field_survey')) {
      autoPublishSurvey(newLead);
      newLead.surveyStatus = 'approved';
    }

    leads.unshift(newLead);
    safeSetLocalStorage(LEADS_KEY, JSON.stringify(leads));

    // Asynchronously push to cloud for cross-device visibility
    pushCloudData(leads);

    return newLead;
  } catch (e) {
    console.error("Error adding lead", e);
    return lead;
  }
};

export const saveLeads = (leads) => {
  try {
    safeSetLocalStorage(LEADS_KEY, JSON.stringify(leads));
    pushCloudData(leads);
  } catch (e) {
    console.error("Error saving leads", e);
  }
};

export const updateLead = (leadId, updatedFields) => {
  try {
    const leads = getLeads().map((l) => {
      if (l.id === leadId) {
        return { ...l, ...updatedFields };
      }
      return l;
    });
    safeSetLocalStorage(LEADS_KEY, JSON.stringify(leads));
    pushCloudData(leads);
    return leads;
  } catch (e) {
    console.error("Error updating lead", e);
    return getLeads();
  }
};

export const deleteLead = (leadId) => {
  try {
    const leads = getLeads().filter((l) => l.id !== leadId);
    safeSetLocalStorage(LEADS_KEY, JSON.stringify(leads));
    pushCloudData(leads);
  } catch (e) {
    console.error("Error deleting lead", e);
  }
};

export const resetToDefault = () => {
  safeSetLocalStorage(PROPERTIES_KEY, JSON.stringify(initialProperties));
  safeSetLocalStorage(SETTINGS_KEY, JSON.stringify(defaultSettings));
};
