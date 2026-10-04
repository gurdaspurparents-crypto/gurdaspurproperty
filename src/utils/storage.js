import { initialProperties } from "../data/initialProperties";

const PROPERTIES_KEY = "gp_properties_v2";
const LEADS_KEY = "gp_seller_leads_v1";
const INQUIRIES_KEY = "gp_inquiries_v1";
const SETTINGS_KEY = "gp_settings_v1";

export const defaultSettings = {
  consultantName: "Gurdaspur Property Consultants",
  primaryPhone: "+91 81465 26257",
  whatsappNumber: "918146526257",
  officeAddress: "Travelx, Batala Road, Gurdaspur (Near Vishal Mega Mart), Punjab 143521",
  email: "contact@gurdaspurproperty.in",
  workingHours: "9:00 AM - 8:00 PM (Monday - Sunday)",
  adminPin: "1234"
};

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
      localStorage.setItem(PROPERTIES_KEY, JSON.stringify(merged));
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
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
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
      !parsed.officeAddress?.includes("Travelx")
    ) {
      parsed.primaryPhone = defaultSettings.primaryPhone;
      parsed.whatsappNumber = defaultSettings.whatsappNumber;
      parsed.officeAddress = defaultSettings.officeAddress;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
    }
    return { ...defaultSettings, ...parsed };
  } catch (e) {
    return defaultSettings;
  }
};

export const saveSettings = (newSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
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

export const addLead = (lead) => {
  try {
    const leads = getLeads();
    const newLead = {
      ...lead,
      id: "LEAD-" + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString(),
      status: "new"
    };
    leads.unshift(newLead);
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    return newLead;
  } catch (e) {
    console.error("Error adding lead", e);
  }
};

export const deleteLead = (leadId) => {
  try {
    const leads = getLeads().filter((l) => l.id !== leadId);
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error("Error deleting lead", e);
  }
};

export const resetToDefault = () => {
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(initialProperties));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
};
