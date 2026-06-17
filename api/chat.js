import { ATHENS_SYSTEM_PROMPT } from '../src/data/athens.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY לא מוגדר' })

  const { messages } = req.body
  if (!messages?.length) return res.status(400).json({ error: 'messages חסר' })

  try {
    const openaiMessages = [
      { role: 'system', content: ATHENS_SYSTEM_PROMPT },
      ...messages.map(m => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.parts[0].text,
      })),
    ]

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(response.status).json({ error: err.error?.message || 'שגיאה מ-Groq' })
    }

    const data = await response.json()
    res.status(200).json({ text: data.choices[0].message.content })
  } catch (err) {
    console.error('Groq error:', err)
    res.status(500).json({ error: err.message || 'שגיאה בשרת' })
  }
}
