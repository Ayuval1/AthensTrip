export default async function handler(req, res) {
  const secret = process.env.JSONBIN_SECRET
  const binId = process.env.JSONBIN_BIN_ID

  if (!secret || !binId) {
    return res.status(200).json([])
  }

  if (req.method === 'GET') {
    try {
      const r = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
        headers: { 'X-Master-Key': secret },
      })
      if (!r.ok) return res.status(200).json([])
      const data = await r.json()
      return res.status(200).json(data.record || [])
    } catch {
      return res.status(200).json([])
    }
  }

  if (req.method === 'POST') {
    try {
      const r = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: 'PUT',
        headers: {
          'X-Master-Key': secret,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      })
      const data = await r.json()
      return res.status(200).json(data.record || req.body)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
