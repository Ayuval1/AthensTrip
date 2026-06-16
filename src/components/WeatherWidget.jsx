import { useEffect, useState } from 'react'

const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
const TRIP_DATES = ['2026-06-19', '2026-06-20', '2026-06-21', '2026-06-22', '2026-06-23']

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=37.98&longitude=23.73&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=Europe%2FAthens&forecast_days=14'
    )
      .then(r => r.json())
      .then(data => {
        const days = TRIP_DATES.map(date => {
          const i = data.daily.time.indexOf(date)
          if (i === -1) return null
          return {
            date,
            max: Math.round(data.daily.temperature_2m_max[i]),
            min: Math.round(data.daily.temperature_2m_min[i]),
            rain: data.daily.precipitation_probability_max[i],
            code: data.daily.weathercode[i],
          }
        }).filter(Boolean)
        setWeather(days)
      })
      .catch(() => setError(true))
  }, [])

  function weatherIcon(code) {
    if (code === 0) return '☀️'
    if (code <= 3) return '⛅'
    if (code <= 67) return '🌧️'
    return '☁️'
  }

  function dayLabel(dateStr) {
    const d = new Date(dateStr)
    return DAYS[d.getDay()]
  }

  function shortDate(dateStr) {
    const [, , day] = dateStr.split('-')
    return `${parseInt(day)}/6`
  }

  if (error) return null
  if (!weather) return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {TRIP_DATES.map(d => (
        <div key={d} className="flex-shrink-0 w-16 h-20 rounded-xl animate-pulse" style={{ background: 'rgba(27,79,140,0.1)' }} />
      ))}
    </div>
  )

  return (
    <div>
      <p className="text-xs mb-2" style={{ color: '#4A90D9' }}>מזג אוויר — אתונה</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {weather.map(day => (
          <div
            key={day.date}
            className="flex-shrink-0 flex flex-col items-center rounded-xl px-3 py-2 text-center"
            style={{ background: 'rgba(27,79,140,0.08)', minWidth: '60px' }}
          >
            <span className="text-xs font-medium" style={{ color: '#1B4F8C' }}>{dayLabel(day.date)}</span>
            <span className="text-xs" style={{ color: '#4A90D9' }}>{shortDate(day.date)}</span>
            <span className="text-xl my-1">{weatherIcon(day.code)}</span>
            <span className="text-sm font-medium" style={{ color: '#0D2644' }}>{day.max}°</span>
            <span className="text-xs" style={{ color: '#4A90D9' }}>{day.min}°</span>
            {day.rain > 20 && (
              <span className="text-xs mt-1" style={{ color: '#4A90D9' }}>💧{day.rain}%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
