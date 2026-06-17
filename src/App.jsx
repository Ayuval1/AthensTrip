import { useState } from 'react'
import DayItinerary from './components/DayItinerary'
import InteractiveMap from './components/InteractiveMap'
import PracticalInfo from './components/PracticalInfo'
import ChatAgent from './components/ChatAgent'
import './index.css'

const TABS = [
  { id: 'itinerary', label: 'לוח יומי', icon: '📅' },
  { id: 'map', label: 'מפה', icon: '🗺️' },
  { id: 'info', label: 'מידע', icon: 'ℹ️' },
  { id: 'chat', label: "צ'אט", icon: '💬' },
]

export default function App() {
  const [tab, setTab] = useState('itinerary')

  return (
    <div style={{ background: '#F5F0E8', maxWidth: '480px', margin: '0 auto', minHeight: '100svh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <header style={{ padding: '20px 16px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🏛️</span>
          <div>
            <h1 style={{ fontFamily: 'Rubik', color: '#0D2644', fontSize: '20px', fontWeight: 500, margin: 0, lineHeight: 1.2 }}>
              אתונה 2026
            </h1>
            <p style={{ color: '#4A90D9', fontSize: '12px', margin: 0 }}>19–23 יוני • משפחת עמר</p>
          </div>
        </div>
        <div className="meander" style={{ marginTop: '12px' }} />
      </header>

      <main style={{ flex: 1, overflow: 'hidden', paddingBottom: '72px', display: 'flex', flexDirection: 'column' }}>
        {tab === 'itinerary' && <DayItinerary />}
        {tab === 'map' && (
          <div style={{ height: 'calc(100svh - 160px)', display: 'flex', flexDirection: 'column' }}>
            <InteractiveMap />
          </div>
        )}
        {tab === 'info' && <PracticalInfo />}
        {tab === 'chat' && (
          <div style={{ height: 'calc(100svh - 160px)', display: 'flex', flexDirection: 'column' }}>
            <ChatAgent />
          </div>
        )}
      </main>

      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '480px',
        background: 'rgba(245,240,232,0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(27,79,140,0.12)',
        display: 'flex',
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '10px 0 8px', gap: '2px', border: 'none', background: 'transparent',
              color: tab === t.id ? '#1B4F8C' : '#999', cursor: 'pointer',
              transition: 'color 0.2s',
            }}
          >
            <span style={{ fontSize: '20px' }}>{t.icon}</span>
            <span style={{ fontSize: '11px', fontWeight: 500 }}>{t.label}</span>
            {tab === t.id && (
              <div style={{ width: '16px', height: '2px', borderRadius: '2px', background: '#1B4F8C', marginTop: '2px' }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
