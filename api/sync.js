export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const PRIMARY_BIN = "https://extendsclass.com/api/json-storage/bin/fbcbeeb";

  if (req.method === 'GET') {
    try {
      const response = await fetch(PRIMARY_BIN, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!response.ok) {
        return res.status(200).json({ leads: [], properties: [], _error: `Upstream GET status ${response.status}` });
      }
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      console.error("API Sync GET Error:", err);
      return res.status(200).json({ leads: [], properties: [], _error: err.message });
    }
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      let bodyData = req.body;
      if (typeof bodyData === 'string') {
        try { bodyData = JSON.parse(bodyData); } catch (e) {}
      }

      // Safeguard size for upstream storage
      const payloadStr = JSON.stringify(bodyData);
      
      const response = await fetch(PRIMARY_BIN, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        body: payloadStr
      });

      const responseText = await response.text();

      if (!response.ok) {
        return res.status(502).json({ 
          success: false, 
          status: response.status, 
          upstreamError: responseText 
        });
      }

      return res.status(200).json({ 
        success: true, 
        upstreamStatus: response.status,
        upstreamBody: responseText.slice(0, 100),
        timestamp: new Date().toISOString() 
      });
    } catch (err) {
      console.error("API Sync POST Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
