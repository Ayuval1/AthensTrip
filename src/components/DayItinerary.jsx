import { useState } from 'react'
import { ITINERARY, ATTRACTIONS } from '../data/athens'
import WeatherWidget from './WeatherWidget'
import AttractionModal from './AttractionModal'

export default function DayItinerary() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [modalId, setModalId] = useState(null)

  const day = ITINERARY[selectedDay]

  return (
    <div className="flex flex-col h-full">
      {modalId && <AttractionModal attractionId={modalId} onClose={() => setModalId(null)} />}

      <div className="px-4 pt-4 pb-2">
        <WeatherWidget />
      </div>

      <div className="meander mx-4 my-3" />

      <div className="flex gap-2 px-4 overflow-x-auto pb-2">
        {ITINERARY.map((d, i) => (
          <button
            key={d.date}
            onClick={() => setSelectedDay(i)}
            className="flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: selectedDay === i ? '#1B4F8C' : 'rgba(27,79,140,0.08)',
              color: selectedDay === i ? 'white' : '#1B4F8C',
              minWidth: '60px',
            }}
          >
            <span>{d.emoji}</span>
            <span>{d.day}</span>
            <span style={{ opacity: 0.8 }}>{d.date}</span>
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
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
