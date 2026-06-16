import { ATTRACTIONS, ITINERARY, TRANSPORT, FOOD_TIPS, APARTMENT, FLIGHT_INFO } from '../data/athens.js'

function findAttraction(q) {
  const map = [
    { keys: ['אקרופוליס', 'acropolis', 'פרתנון', 'parthenon'], id: 'acropolis' },
    { keys: ['ליקאביטוס', 'lycabettus', 'פוניקולר', 'funicular'], id: 'lycabettus' },
    { keys: ['סינטגמה', 'syntagma', 'חילופי משמר', 'משמר'], id: 'syntagma' },
    { keys: ['קלימרמרו', 'kallimarmaro', 'אצטדיון', 'panathenaic', 'אולימפי'], id: 'kallimarmaro' },
    { keys: ['זאפיו', 'zappeion', 'גן זאפיו'], id: 'zappeion' },
    { keys: ['פלאקה', 'plaka'], id: 'plaka' },
    { keys: ['מונסטיראקי', 'monastiraki'], id: 'monastiraki' },
    { keys: ['ארמו', 'ermou'], id: 'ermou' },
    { keys: ['פסירי', 'psirri'], id: 'psirri' },
    { keys: ['ניארחוס', 'niarchos', 'stavros'], id: 'niarchos' },
    { keys: ['ווליאגמני', 'vouliagmeni'], id: 'vouliagmeni' },
    { keys: ['little kook', 'ליטל קוק', 'קוק'], id: 'little-kook' },
    { keys: ['סובלאקי', 'souvlaki', 'גירוס', 'gyros'], id: 'souvlaki' },
    { keys: ['אגינה', 'aegina', 'אגיסטרי', 'agistri'], id: 'aegina' },
  ]
  for (const { keys, id } of map) {
    if (keys.some(k => q.includes(k))) return ATTRACTIONS.find(a => a.id === id)
  }
  return null
}

function formatAttraction(a) {
  const price = a.price.familyTotal === 0 ? '💰 כניסה חינם!' : `💰 משפחה: ${a.price.familyTotal}€`
  const walk = a.walkFromApartment ? `\n🚶 ${a.walkFromApartment} מהדירה` : ''
  const book = a.mustBook ? '\n⚠️ נדרשת הזמנה מראש!' : ''
  return {
    text: `${a.name}\n\n${a.description}\n\n⏰ ${a.hours}\n${price}${walk}${book}\n\n💡 ${a.tips}`,
    links: [
      { label: '📍 ניווט ב-Google Maps', url: a.googleMapsUrl },
      ...(a.bookUrl ? [{ label: '🎫 הזמן כרטיסים', url: a.bookUrl }] : []),
    ],
  }
}

function formatDay(day) {
  const events = day.events.map(e => `${e.time} — ${e.title}`).join('\n')
  return {
    text: `${day.emoji} ${day.day} ${day.date} — ${day.title}\n\n${events}`,
    links: [],
  }
}

export function getResponse(rawInput) {
  const q = rawInput.toLowerCase()

  // 1. אטרקציה ספציפית
  const attraction = findAttraction(q)
  if (attraction) return formatAttraction(attraction)

  // 2. טיסות
  if (q.includes('טיסה') || q.includes('חיפה') || q.includes('המראה') || q.includes('נחיתה') || q.includes('שדה תעופה') || q.includes('מטוס')) {
    const { outbound, return: ret } = FLIGHT_INFO
    return {
      text: `✈️ טיסות:\n\n🛫 הלוך — ${outbound.date}\n${outbound.from} ${outbound.departure} → ${outbound.to} ${outbound.arrival}\n📌 ${outbound.note}\n\n🛬 חזור — ${ret.date}\n${ret.from} ${ret.departure} → ${ret.to} ${ret.arrival}\n📌 ${ret.note}`,
      links: [],
    }
  }

  // 3. מעבורת
  if (q.includes('מעבורת') || q.includes('פיראוס') || q.includes('ferry') || q.includes('ספינה') || q.includes('אוניה')) {
    const tips = TRANSPORT.ferry.tips.map(t => `• ${t}`).join('\n')
    return {
      text: `⛴️ מעבורת לאיים:\n\n${tips}`,
      links: [{ label: '🔗 ferryhopper.com', url: 'https://www.ferryhopper.com' }],
    }
  }

  // 4. מונית
  if (q.includes('מונית') || q.includes('טקסי') || q.includes('bolt') || q.includes('freenom')) {
    const tips = TRANSPORT.taxi.tips.map(t => `• ${t}`).join('\n')
    return { text: `🚕 מוניות:\n\n${tips}`, links: [] }
  }

  // 5. מטרו / תחבורה
  if (q.includes('מטרו') || q.includes('תחבורה') || q.includes('אוטובוס') || q.includes('metro') || q.includes('כרטיס נסיעה')) {
    const tips = TRANSPORT.metro.tips.map(t => `• ${t}`).join('\n')
    return { text: `🚇 מטרו ותחבורה:\n\n${tips}`, links: [] }
  }

  // 6. אוכל / מסעדות
  if (q.includes('אוכל') || q.includes('מסעדה') || q.includes('לאכול') || q.includes('מסעדות') || q.includes('קפה') || q.includes('ארוחה')) {
    const tips = FOOD_TIPS.map(f => `🍽️ ${f.name} (${f.type})\n${f.desc}`).join('\n\n')
    return { text: `🍴 המלצות אוכל:\n\n${tips}`, links: [] }
  }

  // 7. דירה / כתובת
  if (q.includes('דירה') || q.includes('כתובת') || q.includes('גרים') || q.includes('kolonaki') || q.includes('קולונקי') || q.includes('לינה') || q.includes('alopekis')) {
    const notes = APARTMENT.notes.map(n => `• ${n}`).join('\n')
    return { text: `🏠 הדירה — ${APARTMENT.neighborhood}\n${APARTMENT.address}\n\n${notes}`, links: [] }
  }

  // 8. הזמנות
  if (q.includes('להזמין') || q.includes('הזמנה') || q.includes('כרטיסים') || q.includes('book') || q.includes('מראש')) {
    const mustBook = ATTRACTIONS.filter(a => a.mustBook)
    return {
      text: `🎫 חובה להזמין מראש:\n\n${mustBook.map(a => `⚠️ ${a.name}`).join('\n')}\n\nאל תשכחו לקנות לפני הטיול!`,
      links: mustBook.map(a => ({ label: `🎫 הזמן — ${a.name}`, url: a.bookUrl })),
    }
  }

  // 9. מחירים
  if (q.includes('כמה') || q.includes('מחיר') || q.includes('עולה') || q.includes('יורו') || q.includes('כסף') || q.includes('מחירים') || q === 'מחירים') {
    const paid = ATTRACTIONS.filter(a => a.price.familyTotal > 0)
    const list = paid.map(a => `• ${a.name}: ${a.price.familyTotal}€`).join('\n')
    return { text: `💰 מחירים למשפחה (5 נפשות):\n\n${list}\n\nשאר האטרקציות — חינם!`, links: [] }
  }

  // 10. שעות
  if (q.includes('שעות') || q.includes('פתוח') || q.includes('סגור') || q === 'שעות') {
    const withHours = ATTRACTIONS.filter(a => a.hours && !a.hours.includes('כל היום'))
    const list = withHours.map(a => `• ${a.name}: ${a.hours}`).join('\n')
    return { text: `⏰ שעות פתיחה:\n\n${list}`, links: [] }
  }

  // 11. לוח יומי ספציפי
  if (q.includes('שישי') || q.includes('19/6') || (q.includes('19') && (q.includes('יוני') || q.includes('הגעה')))) return formatDay(ITINERARY[0])
  if (q.includes('שבת') || q.includes('20/6') || (q.includes('20') && q.includes('יוני'))) return formatDay(ITINERARY[1])
  if (q.includes('ראשון') || q.includes('21/6') || (q.includes('21') && q.includes('יוני'))) return formatDay(ITINERARY[2])
  if (q.includes('שני') || q.includes('22/6') || (q.includes('22') && q.includes('יוני'))) return formatDay(ITINERARY[3])
  if (q.includes('שלישי') || q.includes('23/6') || (q.includes('23') && q.includes('יוני'))) return formatDay(ITINERARY[4])

  // 12. לוח יומי כללי
  if (q.includes('לוח') || q.includes('תוכנית') || q.includes('מה יש') || q.includes('יומי') || q === 'לוח יומי') {
    const summary = ITINERARY.map(d => `${d.emoji} ${d.day} ${d.date}: ${d.title}`).join('\n')
    return { text: `📅 לוח הטיול:\n\n${summary}\n\nשאלו על יום ספציפי לפרטים!`, links: [] }
  }

  // 13. מה לעשות / אטרקציות
  if (q.includes('מה לעשות') || q.includes('אטרקציות') || q.includes('המלצות') || q.includes('מה לראות') || q.includes('רשימה')) {
    const cats = { historical: '🏛️ היסטורי', nature: '🌿 טבע', fun: '🎉 כיף', shopping: '🛍️ קניות', food: '🍴 אוכל' }
    let text = '📍 כל האטרקציות:\n\n'
    for (const [cat, label] of Object.entries(cats)) {
      const items = ATTRACTIONS.filter(a => a.category === cat)
      if (items.length) text += `${label}:\n${items.map(a => `• ${a.name}`).join('\n')}\n\n`
    }
    return { text: text.trim(), links: [] }
  }

  // 14. fallback
  return {
    text: 'לא מצאתי תשובה 😅\n\nנסו לשאול על:\n• אקרופוליס, ליקאביטוס, פלאקה...\n• לוח יומי (שישי, שבת, ראשון...)\n• מחירים / שעות\n• תחבורה (מטרו, מונית, מעבורת)\n• מסעדות, כתובת הדירה, טיסות',
    links: [],
  }
}
