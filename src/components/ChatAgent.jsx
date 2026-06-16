import { useState, useRef, useEffect } from 'react'

export default function ChatAgent() {
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: 'שלום! אני המדריך שלכם לאתונה 🏛️\nשאלו אותי כל שאלה על הטיול — לוחות זמנים, מקומות, תחבורה, מה לאכול... אני כאן!' }] },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const newMessages = [...messages, { role: 'user', parts: [{ text }] }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.text }] }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: 'אופס, משהו לא עבד. נסו שוב.' }],
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className="max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
              style={{
                background: msg.role === 'user' ? '#1B4F8C' : 'white',
                color: msg.role === 'user' ? 'white' : '#0D2644',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: msg.role === 'model' ? '4px' : '16px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {msg.parts[0].text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end">
            <div className="px-4 py-3 rounded-2xl text-sm" style={{ background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#1B4F8C', animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#1B4F8C', animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#1B4F8C', animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div
        className="flex gap-2 px-4 py-3 border-t"
        style={{ borderColor: 'rgba(27,79,140,0.12)', background: '#FAFAF7' }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="שאלו על הטיול..."
          className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{
            background: 'white',
            border: '1px solid rgba(27,79,140,0.2)',
            color: '#0D2644',
            direction: 'rtl',
          }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{
            background: loading || !input.trim() ? 'rgba(27,79,140,0.3)' : '#1B4F8C',
            color: 'white',
          }}
        >
          שלח
        </button>
      </div>
    </div>
  )
}
