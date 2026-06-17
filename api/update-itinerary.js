export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO

  if (!token || !owner || !repo) {
    return res.status(500).json({ error: 'GitHub config missing' })
  }

  const path = 'public/itinerary.json'
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'athens-trip-dashboard',
  }

  // Get current file SHA (required for update)
  let sha = null
  try {
    const getRes = await fetch(apiUrl, { headers })
    if (getRes.ok) {
      const data = await getRes.json()
      sha = data.sha
    }
  } catch {}

  // Push new content to GitHub
  const content = Buffer.from(JSON.stringify(req.body, null, 2)).toString('base64')
  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: 'update: itinerary via dashboard',
      content,
      branch: 'main',
      ...(sha ? { sha } : {}),
    }),
  })

  if (!putRes.ok) {
    const err = await putRes.json()
    return res.status(500).json({ error: err.message || 'GitHub update failed' })
  }

  return res.status(200).json({ ok: true })
}
