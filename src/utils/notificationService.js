/**
 * Notification Service for Gurdaspur Property Portal
 * Dispatches instant email alerts to navkiransharma@gmail.com whenever a seller posts a property.
 */

export const NOTIFICATION_EMAIL = "navkiransharma@gmail.com";

export async function sendPropertyPostNotification(lead, targetEmail = NOTIFICATION_EMAIL) {
  const recipient = targetEmail || NOTIFICATION_EMAIL;

  const payload = {
    _subject: `🏡 New Property Posted: ${lead.size || ''} in ${lead.locality || 'Gurdaspur'} (₹${lead.price || ''})`,
    _template: "table",
    _captcha: "false",
    "Seller / Owner Name": lead.name || 'Anonymous',
    "Mobile Number": lead.phone || 'N/A',
    "Role": lead.ownerRole || 'Owner',
    "Listing Type": lead.purpose === 'sell' ? 'For Sale (Sell)' : 'For Rent',
    "Property Category": (lead.category || 'Residential').toUpperCase(),
    "Locality / Area": lead.locality || 'Gurdaspur',
    "Colony / Landmark": lead.subArea || 'N/A',
    "Exact Address / Khasra No.": lead.exactLocation || 'Shared on Call/WhatsApp',
    "Property Size": lead.size || 'N/A',
    "Dimensions": lead.dimensions || 'N/A',
    "Road Width": lead.roadWidth || 'N/A',
    "Facing Direction": lead.facing || 'N/A',
    "Registry / Title Status": lead.registryStatus || 'N/A',
    "Expected Demand / Price": `₹${lead.price || ''} ${lead.isNegotiable ? '(Negotiable)' : '(Fixed)'}`,
    "Photos Attached": `${lead.images ? lead.images.length : 0} Photos`,
    "Video Walkthrough": lead.videoUrl || (lead.videoFile ? lead.videoFile.name : 'None'),
    "Additional Notes": lead.notes || 'None',
    "Submission Timestamp": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    "Origin Portal": "https://www.gurdaspurproperty.in"
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to dispatch email notification:", error);
    return { success: false, error };
  }
}

export async function sendFieldSurveyNotification(survey, targetEmail = NOTIFICATION_EMAIL) {
  const recipient = targetEmail || NOTIFICATION_EMAIL;

  const payload = {
    _subject: `📍 [FIELD SURVEY] ${survey.surveyorName || 'Executive'} surveyed ${survey.purpose === 'rent' ? 'Rental' : 'Sale'} in ${survey.locality || 'Gurdaspur'} (₹${survey.price || ''})`,
    _template: "table",
    _captcha: "false",
    "Surveyor Name / ID": survey.surveyorName || 'Field Executive',
    "Status": "PENDING OWNER APPROVAL",
    "Survey Date & Time": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    "Live GPS Coordinates": survey.gpsCoordinates ? `${survey.gpsCoordinates.latitude}, ${survey.gpsCoordinates.longitude}` : 'Not Tagged',
    "Google Maps Link": survey.googleMapsUrl || 'N/A',
    "Landlord / Owner Name": survey.name || 'N/A',
    "Landlord Phone": survey.phone || 'N/A',
    "Listing Type": survey.purpose === 'rent' ? 'For Rent' : 'For Sale',
    "Category": (survey.category || 'residential').toUpperCase(),
    "Locality": survey.locality || 'Gurdaspur',
    "House / Landmark Address": survey.subArea || survey.exactLocation || 'N/A',
    "Property Size": survey.size || 'N/A',
    "Expected Rent / Price": `₹${survey.price || ''} ${survey.isNegotiable ? '(Negotiable)' : '(Fixed)'}`,
    "Security Deposit (Rent)": survey.securityDeposit || 'N/A',
    "Electricity Meter": survey.electricityMeter || 'Separate Sub-Meter',
    "Tenant Preference": survey.tenantPreference || 'Family or Working Professionals',
    "Water Supply": survey.waterSupply || '24x7 Available',
    "Parking": survey.parking || 'Available',
    "Photos Uploaded": `${survey.images ? survey.images.length : 0} Photos from Field`,
    "Field Notes": survey.notes || 'None',
    "Admin Action Required": "Please log into https://www.gurdaspurproperty.in with PIN 4051# to Approve & Publish live."
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to dispatch field survey email:", error);
    return { success: false, error };
  }
}

