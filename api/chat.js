import { GoogleGenerativeAI } from '@google/generative-ai'
import { ATHENS_SYSTEM_PROMPT } from '../src/data/athens.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY לא מוגדר' })
  }

  const { messages } = req.body
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages חסר' })
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: ATHENS_SYSTEM_PROMPT,
    })

    const history = messages.slice(0, -1).map(m => ({
      role: m.role,
      parts: m.parts,
    }))

    const lastMessage = messages[messages.length - 1].parts[0].text

    const chat = model.startChat({ history })
    const result = await chat.sendMessage(lastMessage)
    const text = result.response.text()

    res.status(200).json({ text })
  } catch (err) {
    console.error('Gemini error:', err)
    res.status(500).json({ error: 'שגיאה בשרת, נסו שוב' })
  }
}
