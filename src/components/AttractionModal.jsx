import { ATTRACTIONS } from '../data/athens'

const CATEGORY_LABELS = {
  historical: 'היסטורי',
  nature: 'טבע ופארקים',
  food: 'אוכל וקפה',
  shopping: 'קניות',
  fun: 'בילוי',
}

export default function AttractionModal({ attractionId, onClose }) {
  const attraction = ATTRACTIONS.find(a => a.id === attractionId)
  if (!attraction) return null

  const familyTotal = attraction.price.familyTotal
  const isFree = familyTotal === 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(13,38,68,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-2xl p-5 pb-8"
        style={{ background: '#FAFAF7', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(27,79,140,0.1)', color: '#1B4F8C' }}>
                {CATEGORY_LABELS[attraction.category]}
              </span>
              {attraction.mustBook && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: '#C9A84C22', color: '#8B6914' }}>
                  ⚠️ הזמן מראש
                </span>
              )}
            </div>
            <h2 className="text-xl font-medium" style={{ fontFamily: 'Rubik', color: '#0D2644' }}>
              {attraction.name}
            </h2>
            <p className="text-sm" style={{ color: '#4A90D9' }}>{attraction.nameEl}</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl leading-none p-1"
            style={{ color: '#1B4F8C' }}
          >×</button>
        </div>

        <div className="meander mb-4" />

        <p className="text-sm leading-relaxed mb-4" style={{ color: '#0D2644' }}>
          {attraction.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl p-3" style={{ background: 'rgba(27,79,140,0.06)' }}>
            <p className="text-xs mb-1" style={{ color: '#4A90D9' }}>שעות פעילות</p>
            <p className="text-sm font-medium" style={{ color: '#0D2644' }}>{attraction.hours}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(201,168,76,0.1)' }}>
            <p className="text-xs mb-1" style={{ color: '#8B6914' }}>עלות למשפחה</p>
            <p className="text-sm font-medium" style={{ color: '#0D2644' }}>
              {isFree ? 'כניסה חופשית' : `~${familyTotal} יורו`}
            </p>
            {!isFree && (
              <p className="text-xs mt-0.5" style={{ color: '#8B6914' }}>
                (2 מבוגרים + 3 ילדים)
              </p>
            )}
          </div>
        </div>

        {attraction.tips && (
          <div className="rounded-xl p-3 mb-4" style={{ background: '#FFF8E8', border: '1px solid #C9A84C44' }}>
            <p className="text-xs mb-1 font-medium" style={{ color: '#8B6914' }}>💡 טיפ</p>
            <p className="text-sm" style={{ color: '#0D2644' }}>{attraction.tips}</p>
          </div>
        )}

        {attraction.walkFromApartment && (
          <p className="text-xs mb-4" style={{ color: '#4A90D9' }}>
            🚶 {attraction.walkFromApartment} מהדירה
          </p>
        )}

        <div className="flex gap-2">
          <a
            href={attraction.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-3 rounded-xl text-sm font-medium"
            style={{ background: '#1B4F8C', color: 'white' }}
          >
            🗺️ נווט ב-Google Maps
          </a>
          {attraction.bookUrl && (
            <a
              href={attraction.bookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-3 rounded-xl text-sm font-medium"
              style={{ background: '#C9A84C', color: 'white' }}
            >
              🎫 הזמן כרטיסים
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
