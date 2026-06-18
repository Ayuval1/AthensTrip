import { FLIGHT_INFO, APARTMENT, TRANSPORT, FOOD_TIPS } from '../data/athens'

function Card({ title, children }) {
  return (
    <div className="rounded-2xl p-4 mb-4" style={{ background: 'white', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
      <h3 className="text-base font-medium mb-3" style={{ fontFamily: 'Rubik', color: '#0D2644' }}>{title}</h3>
      {children}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: 'rgba(27,79,140,0.08)' }}>
      <span className="text-sm" style={{ color: '#4A90D9' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: '#0D2644' }}>{value}</span>
    </div>
  )
}

export default function PracticalInfo() {
  return (
    <div className="overflow-y-auto px-4 pt-4 pb-24">

      <div className="rounded-2xl p-4 mb-4" style={{ background: '#FFF3CD', border: '1px solid #C9A84C66' }}>
        <p className="text-sm font-medium" style={{ color: '#8B6914' }}>
          ⚠️ להזמין כרטיסים לאקרופוליס לפני 19/6!
        </p>
        <a
          href="https://eshop.culture.gr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs mt-1 inline-block underline"
          style={{ color: '#8B6914' }}
        >
          eshop.culture.gr ←
        </a>
      </div>

      <Card title="✈️ פרטי טיסות">
        <div className="mb-3 pb-3 border-b" style={{ borderColor: 'rgba(27,79,140,0.1)' }}>
          <p className="text-xs mb-1" style={{ color: '#4A90D9' }}>הלוך — {FLIGHT_INFO.outbound.date}</p>
          <p className="text-sm font-medium" style={{ color: '#0D2644' }}>
            {FLIGHT_INFO.outbound.from} {FLIGHT_INFO.outbound.departure} → {FLIGHT_INFO.outbound.to} {FLIGHT_INFO.outbound.arrival}
          </p>
          <p className="text-xs mt-1" style={{ color: '#888' }}>{FLIGHT_INFO.outbound.note}</p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: '#4A90D9' }}>חזור — {FLIGHT_INFO.return.date}</p>
          <p className="text-sm font-medium" style={{ color: '#0D2644' }}>
            {FLIGHT_INFO.return.from} {FLIGHT_INFO.return.departure} → {FLIGHT_INFO.return.to} {FLIGHT_INFO.return.arrival}
          </p>
          <p className="text-xs mt-1" style={{ color: '#888' }}>{FLIGHT_INFO.return.note}</p>
        </div>
      </Card>

      <Card title="🏠 הדירה">
        <Row label="שכונה" value={APARTMENT.neighborhood} />
        {APARTMENT.notes.map((note, i) => (
          <Row key={i} label="📍" value={note} />
        ))}
      </Card>

      <Card title="🚇 תחבורה">
        {Object.values(TRANSPORT).map(t => (
          <div key={t.title} className="mb-3 last:mb-0">
            <p className="text-sm font-medium mb-1" style={{ color: '#1B4F8C' }}>{t.title}</p>
            <ul className="space-y-1">
              {t.tips.map((tip, i) => (
                <li key={i} className="text-sm" style={{ color: '#0D2644' }}>• {tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </Card>

      <Card title="🍽️ אוכל — מה לא לפספס">
        {FOOD_TIPS.map((f, i) => (
          <div key={i} className="py-2 border-b last:border-0" style={{ borderColor: 'rgba(27,79,140,0.08)' }}>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium" style={{ color: '#0D2644' }}>{f.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(27,79,140,0.08)', color: '#1B4F8C' }}>{f.type}</span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: '#666' }}>{f.desc}</p>
          </div>
        ))}
      </Card>

      <Card title="💡 טיפים כלליים">
        {[
          'מטבע: יורו (€). כספומטים בכל מקום.',
          'חום: ביוני ~30-35°. כובע, קרם ומים — חובה.',
          'שפה: מספיק אנגלית לכל מקום תיירותי.',
          'WiFi: בדרך כלל יש בכל בית קפה.',
          'מוניות: Bolt וFreeNow — זול ואמין.',
          'ב-Sporo קונים אוכל לדרך לאי — כלכלי יותר.',
        ].map((tip, i) => (
          <p key={i} className="text-sm py-1.5 border-b last:border-0" style={{ color: '#0D2644', borderColor: 'rgba(27,79,140,0.08)' }}>
            • {tip}
          </p>
        ))}
      </Card>
    </div>
  )
}
