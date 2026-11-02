export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const PRIMARY_BIN = "https://extendsclass.com/api/json-storage/bin/fbcbeeb";

  if (req.method === 'GET') {
    try {
      const response = await fetch(PRIMARY_BIN);
      if (!response.ok) {
        return res.status(200).json({ leads: [], properties: [] });
      }
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      console.error("API Sync GET Error:", err);
      return res.status(200).json({ leads: [], properties: [] });
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
        headers: { 'Content-Type': 'application/json' },
        body: payloadStr
      });

      if (!response.ok) {
        console.warn("Upstream storage returned status:", response.status);
      }

      return res.status(200).json({ success: true, timestamp: new Date().toISOString() });
    } catch (err) {
      console.error("API Sync POST Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
