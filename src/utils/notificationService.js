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
    "Property Title": lead.title || `${lead.size || ''} ${lead.category || 'Property'}`,
    "Locality / Area": lead.locality || 'Gurdaspur',
    "Colony / Landmark": lead.subArea || 'N/A',
    "Exact Address / Khasra No.": lead.exactLocation || 'Shared on Call/WhatsApp',
    "Property Size": `${lead.size || ''} ${lead.unit || 'Marla'}`,
    "Dimensions (Front x Depth)": lead.frontWidth && lead.depth ? `${lead.frontWidth} Front × ${lead.depth} Depth` : (lead.dimensions || 'N/A'),
    "Covered / Open Area": `${lead.coveredArea ? lead.coveredArea + ' Sq Ft' : 'N/A'} / ${lead.openArea ? lead.openArea + ' Sq Ft' : 'N/A'}`,
    "Rooms & Layout": lead.bedrooms ? `${lead.bedrooms} Bed, ${lead.bathrooms || '3'} Bath, ${lead.kitchen || 'Kitchen'}, ${lead.drawingRoom || 'Drawing'}` : 'N/A',
    "Floors & Parking": `${lead.floors || 'N/A'} • ${lead.parking || 'Parking Available'}`,
    "Road Width / Facing": `${lead.roadWidth || '30 Ft'} • ${lead.facing || 'East'} Facing ${lead.isCorner ? '(Corner 2-Side Open)' : ''}`,
    "Infrastructure": `Water: ${lead.waterSupply || 'Submersible'} • Power: ${lead.electricity || '24x7'} • Sewerage: ${lead.sewerage || 'Underground'}`,
    "Boundary Wall / Gated": `${lead.boundaryWall || 'Constructed'} • Gated Society: ${lead.gatedSociety ? 'Yes' : 'No'}`,
    "Legal Documents Status": lead.documents ? 
      `Registry: ${lead.documents.registry || 'N/A'}, Fard/Mutation: ${lead.documents.ownershipProof || 'N/A'}, Map: ${lead.documents.approvedMap || 'N/A'}, NOC: ${lead.documents.noc || 'N/A'}, Tax: ${lead.documents.propertyTax || 'N/A'}, Loan: ${lead.documents.bankLoan || 'N/A'}, Dispute: ${lead.documents.legalDispute || 'Clear'}` : (lead.registryStatus || 'Clear Title'),
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
    "Surveyor Phone": survey.surveyorPhone || 'N/A',
    "Status": "PENDING OWNER APPROVAL",
    "Survey Date & Time": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    "Live GPS Coordinates": survey.gpsCoordinates ? `${survey.gpsCoordinates.latitude}, ${survey.gpsCoordinates.longitude}` : 'Not Tagged',
    "Google Maps Link": survey.googleMapsUrl || 'N/A',
    "Landlord / Owner Name": survey.name || 'N/A',
    "Landlord Phone": survey.phone || 'N/A',
    "Alternate / WhatsApp Phone": survey.alternatePhone || 'N/A',
    "Owner Type": survey.ownerRole || 'Landlord',
    "Listing Type": survey.purpose === 'rent' ? 'For Rent' : 'For Sale',
    "Category": (survey.category || 'residential').toUpperCase(),
    "Property Title": survey.title || `${survey.size || ''} in ${survey.locality || 'Gurdaspur'}`,
    "Locality": survey.locality || 'Gurdaspur',
    "House / Landmark Address": survey.subArea || survey.exactLocation || 'N/A',
    "Property Size": `${survey.size || ''} ${survey.unit || ''}`,
    "Dimensions (Front x Depth)": survey.frontWidth && survey.depth ? `${survey.frontWidth} Front × ${survey.depth} Depth` : (survey.dimensions || 'N/A'),
    "Covered / Open Area": `${survey.coveredArea ? survey.coveredArea + ' Sq Ft' : 'N/A'} / ${survey.openArea ? survey.openArea + ' Sq Ft' : 'N/A'}`,
    "Rooms & Layout": survey.bedrooms ? `${survey.bedrooms} Bed, ${survey.bathrooms || '3'} Bath, ${survey.kitchen || 'Kitchen'}, ${survey.drawingRoom || 'Drawing'}` : 'N/A',
    "Floors & Parking": `${survey.floors || 'N/A'} • ${survey.parking || 'Parking Available'}`,
    "Road Width / Facing": `${survey.roadWidth || '30 Ft'} / ${survey.facing || 'East'} Facing ${survey.isCorner ? '(Corner 2-Side Open)' : ''}`,
    "Infrastructure": `Water: ${survey.waterSupply || 'Submersible'} • Power: ${survey.electricity || '24x7'} • Sewerage: ${survey.sewerage || 'Underground'}`,
    "Boundary Wall / Gated": `${survey.boundaryWall || 'Constructed'} • Gated Society: ${survey.gatedSociety ? 'Yes' : 'No'}`,
    "Legal Documents Status": survey.documents ? 
      `Registry: ${survey.documents.registry || 'N/A'}, Fard/Mutation: ${survey.documents.ownershipProof || 'N/A'}, Map: ${survey.documents.approvedMap || 'N/A'}, NOC: ${survey.documents.noc || 'N/A'}, Tax: ${survey.documents.propertyTax || 'N/A'}, Loan: ${survey.documents.bankLoan || 'N/A'}, Dispute: ${survey.documents.legalDispute || 'Clear'}` : 'Not Checked',
    "Expected Rent / Price": `₹${survey.price || ''} ${survey.isNegotiable ? '(Negotiable)' : '(Fixed)'}`,
    "Security Deposit (Rent)": survey.securityDeposit || 'N/A',
    "Electricity Meter": survey.electricityMeter || 'Separate Sub-Meter',
    "Tenant Preference": survey.tenantPreference || 'Family or Working Professionals',
    "Water Supply": survey.waterSupply || '24x7 Available',
    "Parking": survey.parking || 'Available',
    "Kitchen & Washroom": survey.kitchenWashroom || 'Attached',
    "Available From": survey.availableFrom || 'Immediate',
    "Photos Uploaded": `${survey.images ? survey.images.length : 0} Photos from Field`,
    "Video Walkthrough Link": survey.videoUrl || 'None',
    "Video File Attached": survey.videoFile ? `${survey.videoFile.name} (${survey.videoFile.size})` : 'None',
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

export async function sendCustomerInquiryNotification(inquiry, targetEmail = NOTIFICATION_EMAIL) {
  const recipient = targetEmail || NOTIFICATION_EMAIL;

  const payload = {
    _subject: `🔔 [BUYER INQUIRY] Customer inquiry for ${inquiry.propertyTitle || inquiry.propertyId || 'Listing'}`,
    _template: "table",
    _captcha: "false",
    "Customer Name": inquiry.name || 'Website Inquirer',
    "Customer Phone / WhatsApp": inquiry.phone || 'N/A',
    "Interested Property ID": inquiry.propertyId || 'N/A',
    "Property Title": inquiry.propertyTitle || 'N/A',
    "Location": inquiry.location || 'Gurdaspur',
    "Price / Rent Demand": inquiry.price ? `₹${inquiry.price}` : 'N/A',
    "Customer Note": inquiry.notes || 'Interested in property',
    "Inquiry Date & Time": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    "Action Required": "Please contact customer via Call or WhatsApp directly."
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
    console.error("Failed to dispatch customer inquiry email:", error);
    return { success: false, error };
  }
}

