import { useState, useEffect } from 'react'
import { ITINERARY, ATTRACTIONS, APARTMENT } from '../data/athens'
import WeatherWidget from './WeatherWidget'
import AttractionModal from './AttractionModal'

export default function DayItinerary() {
  const [itinerary, setItinerary] = useState(ITINERARY)
  const [selectedDay, setSelectedDay] = useState(0)
  const [modalId, setModalId] = useState(null)
  const [showApartment, setShowApartment] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [editForm, setEditForm] = useState({ time: '', title: '', important: false })
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // 'ok' | 'error' | null

  useEffect(() => {
    fetch('/itinerary.json?v=' + Date.now())
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length) setItinerary(data) })
      .catch(() => {})
  }, [])

  const day = itinerary[selectedDay]

  function openEdit(dayIdx, eventIdx) {
    const event = itinerary[dayIdx].events[eventIdx]
    setEditForm({ time: event.time, title: event.title, important: event.important || false })
    setEditingEvent({ dayIdx, eventIdx })
    setSaveStatus(null)
  }

  function openAddEvent(dayIdx) {
    setEditForm({ time: '', title: '', important: false })
    setEditingEvent({ dayIdx, eventIdx: -1 })
    setSaveStatus(null)
  }

  async function saveEdit() {
    if (!editingEvent) return
    const { dayIdx, eventIdx } = editingEvent

    const newItinerary = itinerary.map((d, di) => {
      if (di !== dayIdx) return d
      let newEvents
      if (eventIdx === -1) {
        newEvents = [...d.events, {
          time: editForm.time,
          title: editForm.title,
          ...(editForm.important ? { important: true } : {}),
        }]
        newEvents.sort((a, b) => a.time.localeCompare(b.time))
      } else {
        newEvents = d.events.map((ev, ei) =>
          ei === eventIdx
            ? { ...ev, time: editForm.time, title: editForm.title, ...(editForm.important ? { important: true } : { important: undefined }) }
            : ev
        )
      }
      return { ...d, events: newEvents }
    })

    setSaving(true)
    setSaveStatus(null)
    try {
      const r = await fetch('/api/update-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItinerary),
      })
      if (r.ok) {
        setItinerary(newItinerary)
        setEditingEvent(null)
        setSaveStatus('ok')
        setTimeout(() => setSaveStatus(null), 6000)
      } else {
        setSaveStatus('error')
      }
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  async function deleteEvent() {
    if (!editingEvent || editingEvent.eventIdx === -1) return
    const { dayIdx, eventIdx } = editingEvent

    const newItinerary = itinerary.map((d, di) =>
      di !== dayIdx ? d : { ...d, events: d.events.filter((_, ei) => ei !== eventIdx) }
    )

    setSaving(true)
    try {
      const r = await fetch('/api/update-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItinerary),
      })
      if (r.ok) {
        setItinerary(newItinerary)
        setEditingEvent(null)
        setSaveStatus('ok')
        setTimeout(() => setSaveStatus(null), 6000)
      } else {
        setSaveStatus('error')
      }
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {modalId && <AttractionModal attractionId={modalId} onClose={() => setModalId(null)} />}

      {/* Edit modal */}
      {editingEvent && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setEditingEvent(null)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-t-2xl p-6 pb-10"
            style={{ direction: 'rtl' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-base font-medium mb-4" style={{ fontFamily: 'Rubik', color: '#0D2644' }}>
              {editingEvent.eventIdx === -1 ? '➕ פעילות חדשה' : '✏️ עריכת פעילות'}
            </div>

            <input
              type="text"
              value={editForm.time}
              onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))}
              placeholder="שעה (למשל 10:00)"
              className="w-full px-3 py-2.5 rounded-xl text-sm mb-3 outline-none"
              style={{ border: '1px solid rgba(27,79,140,0.2)', color: '#0D2644', fontFamily: 'Heebo' }}
            />
            <textarea
              value={editForm.title}
              onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
              placeholder="תיאור הפעילות"
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl text-sm mb-3 outline-none resize-none"
              style={{ border: '1px solid rgba(27,79,140,0.2)', color: '#0D2644', fontFamily: 'Heebo' }}
            />
            <label className="flex items-center gap-2 mb-4 text-sm cursor-pointer" style={{ color: '#555' }}>
              <input
                type="checkbox"
                checked={editForm.important}
                onChange={e => setEditForm(f => ({ ...f, important: e.target.checked }))}
                className="w-4 h-4"
              />
              חשוב (מסמן בזהב)
            </label>

            {saveStatus === 'error' && (
              <p className="text-xs mb-3" style={{ color: '#DC2626' }}>שגיאה — בדקו הגדרות GitHub</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={saveEdit}
                disabled={saving || !editForm.title.trim()}
                className="flex-1 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: saving || !editForm.title.trim() ? 'rgba(27,79,140,0.3)' : '#1B4F8C',
                  color: 'white',
                }}
              >
                {saving ? 'שומר...' : 'שמור'}
              </button>
              {editingEvent.eventIdx !== -1 && (
                <button
                  onClick={deleteEvent}
                  disabled={saving}
                  className="px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ background: '#FEE2E2', color: '#DC2626' }}
                >
                  מחק
                </button>
              )}
              <button
                onClick={() => setEditingEvent(null)}
                className="px-4 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(0,0,0,0.06)', color: '#666' }}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apartment modal */}
      {showApartment && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowApartment(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-t-2xl p-6 pb-10"
            style={{ direction: 'rtl' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-xl mb-1" style={{ fontFamily: 'Rubik', color: '#0D2644' }}>🏠 הדירה שלנו</div>
            <div className="text-sm mb-1" style={{ color: '#4A90D9' }}>{APARTMENT.neighborhood}</div>
            <div className="text-sm font-medium mb-4" style={{ color: '#0D2644' }}>{APARTMENT.address}</div>
            <ul className="text-sm mb-5 flex flex-col gap-1.5" style={{ color: '#555' }}>
              {APARTMENT.notes.map((n, i) => <li key={i}>• {n}</li>)}
            </ul>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(APARTMENT.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-3 rounded-xl text-sm font-medium"
              style={{ background: '#1B4F8C', color: 'white', textDecoration: 'none' }}
            >
              📍 ניווט ב-Google Maps
            </a>
          </div>
        </div>
      )}

      <div className="px-4 pt-4 pb-2">
        <WeatherWidget />
      </div>

      {/* Save success banner */}
      {saveStatus === 'ok' && (
        <div className="mx-4 mb-2 px-3 py-2 rounded-xl text-xs text-center" style={{ background: '#D1FAE5', color: '#065F46' }}>
          ✅ נשמר! שינויים יעלו לכולם תוך ~60 שניות
        </div>
      )}

      <div className="meander mx-4 my-3" />

      <div className="flex gap-2 px-4 overflow-x-auto pb-2">
        {itinerary.map((d, i) => (
          <button
            key={d.date}
            onClick={() => setSelectedDay(i)}
            className="flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: selectedDay === i ? '#1B4F8C' : 'rgba(27,79,140,0.08)',
              color: selectedDay === i ? 'white' : '#1B4F8C',
              minWidth: '64px',
            }}
          >
            <span style={{ fontSize: '18px' }}>{d.emoji}</span>
            <span className="font-semibold">{d.day}</span>
            <span style={{ opacity: 0.7, fontSize: '10px' }}>{d.date}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <h2 className="text-lg font-medium mt-3 mb-4" style={{ fontFamily: 'Rubik', color: '#0D2644' }}>
          {day.emoji} {day.day} — {day.title}
        </h2>

        <div className="relative">
          <div className="absolute right-4 top-0 bottom-0 w-0.5" style={{ background: 'rgba(27,79,140,0.15)' }} />

          {day.events.map((event, i) => {
            const attraction = event.attractionId ? ATTRACTIONS.find(a => a.id === event.attractionId) : null
            return (
              <div key={i} className="flex gap-4 mb-5 relative">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 text-xs font-medium"
                  style={{
                    background: event.important ? '#C9A84C' : '#1B4F8C',
                    color: 'white',
                  }}
                >
                  {event.time.slice(0, 2)}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-xs mb-0.5" style={{ color: '#4A90D9' }}>{event.time}</p>
                  <p className="text-sm font-medium leading-snug" style={{ color: '#0D2644' }}>
                    {event.title}
                  </p>
                  {attraction && (
                    <button
                      onClick={() => setModalId(attraction.id)}
                      className="text-xs mt-1 px-2 py-0.5 rounded-lg"
                      style={{ background: 'rgba(27,79,140,0.1)', color: '#1B4F8C' }}
                    >
                      פרטים על {attraction.name} ←
                    </button>
                  )}
                  {!attraction && (event.title.includes('דירה') || event.title.includes('קולונקי')) && (
                    <button
                      onClick={() => setShowApartment(true)}
                      className="text-xs mt-1 px-2 py-0.5 rounded-lg"
                      style={{ background: 'rgba(27,79,140,0.1)', color: '#1B4F8C' }}
                    >
                      כתובת הדירה ←
                    </button>
                  )}
                </div>
                <button
                  onClick={() => openEdit(selectedDay, i)}
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs mt-1"
                  style={{ background: 'rgba(27,79,140,0.07)', color: '#9BA8BE' }}
                  title="עריכה"
                >
                  ✏️
                </button>
              </div>
            )
          })}

          <button
            onClick={() => openAddEvent(selectedDay)}
            className="flex items-center gap-2 text-sm px-3 py-3 rounded-xl mt-1 w-full justify-center"
            style={{
              color: '#1B4F8C',
              background: 'rgba(27,79,140,0.04)',
              border: '1px dashed rgba(27,79,140,0.25)',
            }}
          >
            ＋ הוסף פעילות
          </button>
        </div>
      </div>
    </div>
  )
}
