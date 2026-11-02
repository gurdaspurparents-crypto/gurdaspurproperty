export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const { phone, otp, apiKey } = body || {};

    if (!phone || !otp) {
      return res.status(400).json({ success: false, error: 'Phone and OTP required' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const activeApiKey = apiKey || process.env.FAST2SMS_API_KEY || '';

    // If an SMS Gateway API Key is configured, dispatch real SMS via Fast2SMS
    if (activeApiKey) {
      try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': activeApiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'otp',
            variables_values: String(otp),
            numbers: cleanPhone
          })
        });

        const data = await response.json();

        if (data.return) {
          return res.status(200).json({ 
            success: true, 
            realSmsSent: true, 
            provider: 'fast2sms',
            message: `Real SMS successfully dispatched to +91 ${cleanPhone}` 
          });
        } else {
          return res.status(200).json({ 
            success: false, 
            realSmsSent: false, 
            providerError: data.message || 'Fast2SMS dispatch failed',
            simulated: true,
            otp: String(otp)
          });
        }
      } catch (smsErr) {
        console.error("Fast2SMS API dispatch error:", smsErr);
        return res.status(200).json({
          success: false,
          realSmsSent: false,
          simulated: true,
          otp: String(otp),
          error: smsErr.message
        });
      }
    }

    // Default: Return simulated indicator when no SMS gateway key is configured
    return res.status(200).json({
      success: true,
      realSmsSent: false,
      simulated: true,
      otp: String(otp),
      note: 'No SMS Gateway API Key configured in Portal Settings. In development mode, code is displayed on screen.'
    });

  } catch (err) {
    console.error("send-otp handler error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
