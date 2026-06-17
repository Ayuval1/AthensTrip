import { useState } from 'react'
import { ATTRACTIONS, APARTMENT } from '../data/athens'
import { streetRoute, formatDistance, formatDuration } from '../lib/routing'

const MODES = [
  { id: 'foot', label: 'הליכה', icon: '🚶', color: '#27AE60' },
  { id: 'car', label: 'מונית', icon: '🚕', color: '#C9A84C' },
  { id: 'transit', label: 'תחב"צ', icon: '🚇', color: '#1B4F8C' },
]

const LOCATION_OPTIONS = [
  { id: 'apartment', name: '🏠 הדירה שלנו', coords: APARTMENT.coords, category: 'בסיס' },
  ...ATTRACTIONS.filter(a => !['metro-evangelismos', 'metro-syntagma', 'metro-monastiraki', 'bus-evangelismos', 'bus-kolonaki'].includes(a.id))
    .map(a => ({ id: a.id, name: a.name, coords: a.coords, category: a.category })),
]

const CAT_LABELS = {
  בסיס: '🏠',
  historical: '🏛️',
  nature: '🌿',
  food: '🍽️',
  shopping: '🛍️',
  fun: '🎉',
  supermarket: '🛒',
}

export default function RoutePlanner({ onRoute, onClear }) {
  const [open, setOpen] = useState(false)
  const [stops, setStops] = useState(['apartment', ''])
  const [mode, setMode] = useState('foot')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  function addStop() {
    if (stops.length < 5) setStops([...stops, ''])
  }

  function removeStop(idx) {
    if (stops.length <= 2) return
    setStops(stops.filter((_, i) => i !== idx))
  }

  function setStop(idx, val) {
    setStops(stops.map((s, i) => i === idx ? val : s))
  }

  async function calculate() {
    const selected = stops.map(id => LOCATION_OPTIONS.find(o => o.id === id)).filter(Boolean)
    if (selected.length < 2) { setError('בחר לפחות 2 עצירות'); return }
    setError(null)

    if (mode === 'transit') {
      const origin = selected[0]
      const dest = selected[selected.length - 1]
      let url = `https://www.google.com/maps/dir/?api=1&origin=${origin.coords[0]},${origin.coords[1]}&destination=${dest.coords[0]},${dest.coords[1]}&travelmode=transit`
      if (selected.length > 2) {
        const mid = selected.slice(1, -1).map(s => `${s.coords[0]},${s.coords[1]}`).join('|')
        url += `&waypoints=${encodeURIComponent(mid)}`
      }
      window.open(url, '_blank')
      return
    }

    setLoading(true)
    try {
      const waypoints = selected.map(s => ({ lat: s.coords[0], lng: s.coords[1] }))
      const route = await streetRoute(waypoints, mode)
      setResult({ ...route, stops: selected })
      onRoute(route.geometry)
    } catch {
      setError('לא ניתן לחשב מסלול — בדוק חיבור אינטרנט')
    } finally {
      setLoading(false)
    }
  }

  function clear() {
    setResult(null)
    setStops(['apartment', ''])
    setError(null)
    onClear()
  }

  function toggle() {
    if (open) { clear(); setOpen(false) }
    else setOpen(true)
  }

  const readyToCalc = stops.filter(id => LOCATION_OPTIONS.find(o => o.id === id)).length >= 2

  // Group options by category for display
  const grouped = {}
  LOCATION_OPTIONS.forEach(opt => {
    const cat = CAT_LABELS[opt.category] || '📍'
    const key = `${cat} ${opt.category}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(opt)
  })

  return (
    <>
      {/* Floating trigger button */}
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <button
          onClick={toggle}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium"
          style={{
            background: open ? '#DC2626' : '#C9A84C',
            color: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {open ? '✕ סגור' : '🗺️ מסלול'}
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: '56px',
            left: '8px',
            right: '8px',
            zIndex: 1000,
            background: 'rgba(245,240,232,0.98)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '14px',
            boxShadow: '0 -4px 24px rgba(13,38,68,0.18)',
            direction: 'rtl',
            maxHeight: '65vh',
            overflowY: 'auto',
          }}
        >
          <p className="text-sm font-medium mb-3" style={{ fontFamily: 'Rubik', color: '#0D2644' }}>
            🗺️ תכנן מסלול
          </p>

          {/* Waypoints */}
          <div className="flex flex-col gap-2 mb-3">
            {stops.map((stopId, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold w-4 text-center flex-shrink-0"
                  style={{ color: idx === 0 ? '#27AE60' : idx === stops.length - 1 ? '#DC2626' : '#C9A84C' }}>
                  {idx === 0 ? 'A' : idx === stops.length - 1 ? String.fromCharCode(64 + stops.length) : String.fromCharCode(65 + idx)}
                </span>
                <select
                  value={stopId}
                  onChange={e => setStop(idx, e.target.value)}
                  className="flex-1 px-2 py-2 rounded-xl text-sm outline-none"
                  style={{
                    border: '1px solid rgba(27,79,140,0.2)',
                    color: stopId ? '#0D2644' : '#999',
                    background: 'white',
                    fontFamily: 'Heebo',
                    direction: 'rtl',
                    maxWidth: '100%',
                  }}
                >
                  <option value="">— בחר מיקום —</option>
                  {Object.entries(grouped).map(([catLabel, opts]) => (
                    <optgroup key={catLabel} label={catLabel}>
                      {opts.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {stops.length > 2 && (
                  <button
                    onClick={() => removeStop(idx)}
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                    style={{ background: '#FEE2E2', color: '#DC2626' }}
                  >✕</button>
                )}
              </div>
            ))}
          </div>

          {stops.length < 5 && (
            <button
              onClick={addStop}
              className="text-xs mb-3 flex items-center gap-1"
              style={{ color: '#1B4F8C', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ＋ הוסף עצירה
            </button>
          )}

          {/* Mode selector */}
          <div className="flex gap-1.5 mb-3">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: mode === m.id ? m.color : 'white',
                  color: mode === m.id ? 'white' : '#666',
                  border: `1px solid ${mode === m.id ? m.color : 'rgba(27,79,140,0.12)'}`,
                }}
              >
                <span style={{ fontSize: '16px' }}>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>

          {mode === 'transit' && (
            <p className="text-xs mb-2 px-1" style={{ color: '#666' }}>
              יפתח Google Maps עם ניווט תחבורה ציבורית
            </p>
          )}

          {error && (
            <p className="text-xs mb-2 px-1" style={{ color: '#DC2626' }}>{error}</p>
          )}

          {/* Calculate button */}
          <button
            onClick={calculate}
            disabled={loading || (!readyToCalc && mode !== 'transit')}
            className="w-full py-2.5 rounded-xl text-sm font-medium mb-2"
            style={{
              background: readyToCalc ? '#1B4F8C' : 'rgba(27,79,140,0.2)',
              color: readyToCalc ? 'white' : '#999',
              cursor: readyToCalc ? 'pointer' : 'default',
            }}
          >
            {loading ? '⏳ מחשב...' : mode === 'transit' ? '🚇 פתח ב-Google Maps' : '📍 חשב מסלול'}
          </button>

          {/* Result */}
          {result && (
            <div
              className="rounded-xl p-3 flex items-center justify-between"
              style={{ background: 'rgba(27,79,140,0.08)' }}
            >
              <div className="flex gap-4">
                <div>
                  <p className="text-xs" style={{ color: '#666' }}>מרחק</p>
                  <p className="text-sm font-medium" style={{ color: '#0D2644' }}>
                    {formatDistance(result.distance)}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#666' }}>זמן משוער</p>
                  <p className="text-sm font-medium" style={{ color: '#0D2644' }}>
                    {formatDuration(result.duration)}
                  </p>
                </div>
              </div>
              <button
                onClick={clear}
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{ background: '#FEE2E2', color: '#DC2626' }}
              >
                נקה
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
