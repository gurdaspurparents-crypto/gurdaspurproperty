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
