import { useState } from 'react'
import { ATTRACTIONS, APARTMENT } from '../data/athens'
import { streetRoute, formatDistance, formatDuration } from '../lib/routing'

const MODES = [
  { id: 'foot', label: 'הליכה', icon: '🚶', color: '#27AE60' },
  { id: 'car', label: 'מונית', icon: '🚕', color: '#C9A84C' },
  { id: 'transit', label: 'תחב"צ', icon: '🚇', color: '#1B4F8C' },
]

const PRESETS = [
  { id: 'apartment', name: '🏠 הדירה שלנו', coords: APARTMENT.coords, cat: 'בסיס' },
  ...ATTRACTIONS
    .filter(a => !['metro-evangelismos','metro-syntagma','metro-monastiraki','bus-evangelismos','bus-kolonaki'].includes(a.id))
    .map(a => ({ id: a.id, name: a.name, coords: a.coords, cat: a.category }))
]

const CAT_LABEL = {
  בסיס: '🏠 הדירה', historical: '🏛️ היסטורי', nature: '🌿 טבע',
  food: '🍽️ אוכל', shopping: '🛍️ קניות', fun: '🎉 בילוי', supermarket: '🛒 סופרים',
}

let customIdx = 0

function emptyStop() { return { id: null, name: null, coords: null } }

export default function RoutePlanner({ onRoute, onClear, setMapClickHandler }) {
  const [open, setOpen] = useState(false)
  const [stops, setStops] = useState([
    { id: 'apartment', name: '🏠 הדירה שלנו', coords: APARTMENT.coords },
    emptyStop(),
  ])
  const [legModes, setLegModes] = useState(['foot'])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [pickingIdx, setPickingIdx] = useState(null)

  // ---- helpers ----
  function updateStop(idx, val) {
    const preset = PRESETS.find(p => p.id === val)
    setStops(prev => prev.map((s, i) => i === idx
      ? preset ? { id: preset.id, name: preset.name, coords: preset.coords } : emptyStop()
      : s
    ))
  }

  function addStop() {
    if (stops.length >= 5) return
    setStops(prev => [...prev, emptyStop()])
    setLegModes(prev => [...prev, 'foot'])
  }

  function removeStop(idx) {
    if (stops.length <= 2) return
    setStops(prev => prev.filter((_, i) => i !== idx))
    setLegModes(prev => {
      const copy = [...prev]
      copy.splice(Math.max(0, idx - 1), 1)
      return copy
    })
  }

  function setLegMode(legIdx, mode) {
    setLegModes(prev => prev.map((m, i) => i === legIdx ? mode : m))
  }

  // ---- pick from map ----
  function startPicking(idx) {
    setPickingIdx(idx)
    setMapClickHandler(() => (latlng) => {
      customIdx++
      const label = `📍 נקודה ${customIdx}`
      setStops(prev => prev.map((s, i) => i === idx
        ? { id: `custom-${customIdx}`, name: label, coords: [latlng.lat, latlng.lng] }
        : s
      ))
      setPickingIdx(null)
      setMapClickHandler(null)
    })
  }

  function cancelPicking() {
    setPickingIdx(null)
    setMapClickHandler(null)
  }

  // ---- calculate ----
  async function calculate() {
    const valid = stops.filter(s => s.coords)
    if (valid.length < 2) { setError('בחר לפחות 2 עצירות'); return }
    setError(null)
    setLoading(true)

    try {
      const geometries = []
      let totalDist = 0, totalDur = 0

      for (let i = 0; i < valid.length - 1; i++) {
        const mode = legModes[i] || 'foot'
        const from = valid[i]
        const to = valid[i + 1]

        if (mode === 'transit') {
          const url = `https://www.google.com/maps/dir/?api=1&origin=${from.coords[0]},${from.coords[1]}&destination=${to.coords[0]},${to.coords[1]}&travelmode=transit`
          window.open(url, '_blank')
          // straight line placeholder for transit leg
          geometries.push([from.coords, to.coords])
          continue
        }

        const leg = await streetRoute(
          [{ lat: from.coords[0], lng: from.coords[1] }, { lat: to.coords[0], lng: to.coords[1] }],
          mode
        )
        geometries.push(...leg.geometry)
        totalDist += leg.distance
        totalDur += leg.duration
      }

      const flatGeom = geometries.flat(1)
      onRoute(flatGeom)
      setResult({ distance: totalDist, duration: totalDur })
    } catch {
      setError('לא ניתן לחשב מסלול — בדוק חיבור')
    } finally {
      setLoading(false)
    }
  }

  function clear() {
    setResult(null)
    setStops([{ id: 'apartment', name: '🏠 הדירה שלנו', coords: APARTMENT.coords }, emptyStop()])
    setLegModes(['foot'])
    setError(null)
    cancelPicking()
    onClear()
  }

  function toggle() {
    if (open) { clear(); setOpen(false) }
    else setOpen(true)
  }

  const canCalc = stops.filter(s => s.coords).length >= 2
  const grouped = {}
  PRESETS.forEach(p => {
    const k = CAT_LABEL[p.cat] || '📍 אחר'
    if (!grouped[k]) grouped[k] = []
    grouped[k].push(p)
  })

  return (
    <>
      {/* Trigger button */}
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <button onClick={toggle} className="text-xs px-3 py-2 rounded-xl font-medium flex items-center gap-1.5"
          style={{ background: open ? '#DC2626' : '#C9A84C', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', border: 'none', cursor: 'pointer' }}>
          {open ? '✕ סגור' : '🗺️ מסלול'}
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div style={{ position: 'absolute', bottom: '56px', left: '8px', right: '8px', zIndex: 1000, background: 'rgba(245,240,232,0.98)', backdropFilter: 'blur(12px)', borderRadius: '16px', padding: '14px', boxShadow: '0 -4px 24px rgba(13,38,68,0.18)', direction: 'rtl', maxHeight: '65vh', overflowY: 'auto' }}>
          <p className="text-sm font-medium mb-3" style={{ fontFamily: 'Rubik', color: '#0D2644' }}>🗺️ תכנן מסלול</p>

          {/* Stops + leg modes */}
          {stops.map((stop, idx) => (
            <div key={idx}>
              {/* Stop row */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-xs font-bold w-4 text-center flex-shrink-0"
                  style={{ color: idx === 0 ? '#27AE60' : idx === stops.length - 1 ? '#DC2626' : '#C9A84C' }}>
                  {String.fromCharCode(65 + idx)}
                </span>

                {/* Value display / select */}
                {stop.id?.startsWith('custom-') ? (
                  <div className="flex-1 px-2 py-2 rounded-xl text-sm flex items-center justify-between"
                    style={{ border: '1px solid rgba(27,79,140,0.3)', background: 'rgba(27,79,140,0.06)', color: '#0D2644' }}>
                    <span>{stop.name}</span>
                    <button onClick={() => updateStop(idx, null)} className="text-xs" style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                  </div>
                ) : (
                  <select value={stop.id || ''} onChange={e => updateStop(idx, e.target.value)}
                    className="flex-1 px-2 py-2 rounded-xl text-sm outline-none"
                    style={{ border: `1px solid ${pickingIdx === idx ? '#1B4F8C' : 'rgba(27,79,140,0.2)'}`, color: stop.id ? '#0D2644' : '#999', background: 'white', fontFamily: 'Heebo', direction: 'rtl' }}>
                    <option value="">— בחר מיקום —</option>
                    {Object.entries(grouped).map(([grpLabel, opts]) => (
                      <optgroup key={grpLabel} label={grpLabel}>
                        {opts.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                      </optgroup>
                    ))}
                  </select>
                )}

                {/* Pick from map button */}
                {pickingIdx === idx ? (
                  <button onClick={cancelPicking} className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ background: '#1B4F8C', color: 'white' }}>✕</button>
                ) : (
                  <button onClick={() => startPicking(idx)} className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ background: 'rgba(27,79,140,0.1)', color: '#1B4F8C' }}>📍</button>
                )}

                {stops.length > 2 && (
                  <button onClick={() => removeStop(idx)} className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ background: '#FEE2E2', color: '#DC2626' }}>✕</button>
                )}
              </div>

              {/* Leg mode between stops */}
              {idx < stops.length - 1 && (
                <div className="flex items-center gap-1 mb-1.5 pr-6">
                  <div className="w-px h-4 flex-shrink-0" style={{ background: 'rgba(27,79,140,0.2)', marginRight: '2px' }} />
                  {MODES.map(m => (
                    <button key={m.id} onClick={() => setLegMode(idx, m.id)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all"
                      style={{ background: legModes[idx] === m.id ? m.color : 'rgba(0,0,0,0.06)', color: legModes[idx] === m.id ? 'white' : '#666', border: 'none', cursor: 'pointer' }}>
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {stops.length < 5 && (
            <button onClick={addStop} className="text-xs mb-3 flex items-center gap-1"
              style={{ color: '#1B4F8C', background: 'none', border: 'none', cursor: 'pointer' }}>
              ＋ הוסף עצירה
            </button>
          )}

          {error && <p className="text-xs mb-2" style={{ color: '#DC2626' }}>{error}</p>}

          <button onClick={calculate} disabled={loading || !canCalc}
            className="w-full py-2.5 rounded-xl text-sm font-medium mb-2"
            style={{ background: canCalc ? '#1B4F8C' : 'rgba(27,79,140,0.2)', color: canCalc ? 'white' : '#999', cursor: canCalc ? 'pointer' : 'default' }}>
            {loading ? '⏳ מחשב...' : '📍 חשב מסלול'}
          </button>

          {result && (
            <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: 'rgba(27,79,140,0.08)' }}>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs" style={{ color: '#666' }}>מרחק</p>
                  <p className="text-sm font-medium" style={{ color: '#0D2644' }}>{formatDistance(result.distance)}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#666' }}>זמן משוער</p>
                  <p className="text-sm font-medium" style={{ color: '#0D2644' }}>{formatDuration(result.duration)}</p>
                </div>
              </div>
              <button onClick={clear} className="text-xs px-2.5 py-1 rounded-lg" style={{ background: '#FEE2E2', color: '#DC2626' }}>נקה</button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
