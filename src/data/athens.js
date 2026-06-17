export const FAMILY = {
  adults: 2,
  children: [
    { name: 'יובל', age: 14 },
    { name: 'נעמה', age: 10 },
    { name: 'הילה', age: 7 },
  ],
}

export const FLIGHT_INFO = {
  outbound: {
    date: '19/6/2026',
    from: 'חיפה',
    to: 'אתונה',
    departure: '07:30',
    arrival: '10:25',
    note: 'לצאת מהבית לפחות בשעה 05:30',
  },
  return: {
    date: '23/6/2026',
    from: 'אתונה',
    to: 'חיפה',
    departure: '18:05',
    arrival: '20:50',
    note: 'לצאת לנמל התעופה לפחות בשעה 15:00',
  },
}

export const APARTMENT = {
  neighborhood: 'קולונקי (Kolonaki)',
  address: 'Alopekis 20, אתונה 10675, יוון',
  coords: [37.9763, 23.7398],
  notes: [
    'Alopekis 20, Athens 10675',
    'סופר Sporo — 6 דקות הליכה',
    'פוניקולר ליקאביטוס — 8 דקות הליכה',
    'קרוב לאקרופוליס ושכונת פלאקה',
  ],
}

export const TRANSPORT = {
  metro: {
    title: 'מטרו',
    tips: [
      'כרטיס נסיעה: ~1.4 יורו לנסיעה, כרטיס יומי ~4.5 יורו',
      'מסינטגמה (Syntagma) או מונסטיראקי (Monastiraki) → פיראוס (Piraeus) לאוניות',
      'האפליקציה: Google Maps מנווט היטב',
    ],
  },
  taxi: {
    title: 'מונית',
    tips: [
      'האפליקציה: Bolt או FreeNow — זול יותר מהזמנה ברחוב',
      'מהנמל התעופה לאתונה: ~35-40 יורו',
      'לפארק מים: להזמין מונית, לא אוטובוס',
    ],
  },
  ferry: {
    title: 'מעבורת לאיים',
    tips: [
      'נמל פיראוס (Piraeus) — מטרו ישיר מסינטגמה',
      'לאגינה: ~1 שעה, כ-9 יורו לכיוון',
      'לאגיסטרי: ~1.5 שעות, כ-12 יורו לכיוון',
      'לבדוק שעות ב: ferryhopper.com',
    ],
  },
}

function calcFamilyPrice(adult, child12to18, childUnder12) {
  const { adults, children } = FAMILY
  let total = adults * adult
  children.forEach(c => {
    if (c.age >= 12) total += child12to18
    else total += childUnder12
  })
  return total
}

export const ATTRACTIONS = [
  {
    id: 'acropolis',
    name: 'אקרופוליס',
    nameEl: 'Acropolis',
    coords: [37.9715, 23.7267],
    category: 'historical',
    description: 'אחד ממבנה העתיקים המרשימים בעולם — מקדש הפרתנון על הגבעה המפורסמת. תצפית מדהימה על כל אתונה.',
    hours: 'פתוח 08:00–20:00 (בקיץ)',
    price: {
      adult: 20,
      child12to18: 10,
      childUnder12: 0,
      get familyTotal() { return calcFamilyPrice(20, 10, 0) },
    },
    tips: '⚠️ להזמין כרטיסים מראש! מאוד חם — להביא כובע, קרם ומים. ללכת מוקדם בבוקר לפני שעות השיא.',
    googleMapsUrl: 'https://maps.google.com/?q=Acropolis+Athens',
    bookUrl: 'https://eshop.culture.gr',
    mustBook: true,
  },
  {
    id: 'lycabettus',
    name: 'גבעת ליקאביטוס + פוניקולר',
    nameEl: 'Lycabettus Hill',
    coords: [37.9793, 23.7436],
    category: 'nature',
    description: 'הגבעה הגבוהה ביותר באתונה (300 מ\'). תצפית מרהיבה על העיר כולה, במיוחד בשקיעה. הפוניקולר הוא אטרקציה בפני עצמה לילדים.',
    hours: 'פוניקולר פתוח 09:00–22:00',
    price: {
      adult: 8,
      child12to18: 4,
      childUnder12: 4,
      get familyTotal() { return calcFamilyPrice(8, 4, 4) },
    },
    tips: 'לעלות בפוניקולר ולרדת ברגל — הדרך למטה נעימה ולא קשה. להביא שתייה ונשנושים.',
    googleMapsUrl: 'https://maps.google.com/?q=Lycabettus+Hill+Athens',
    mustBook: false,
    walkFromApartment: '8 דקות הליכה',
  },
  {
    id: 'syntagma',
    name: 'כיכר סינטגמה + חילופי משמר',
    nameEl: 'Syntagma Square',
    coords: [37.9753, 23.7355],
    category: 'historical',
    description: 'הכיכר המרכזית של אתונה. בכל שעה עגולה יש חילופי משמר של החיילים האוויזונים עם המדים המסורתיים. ביום ראשון ב-11:00 — הטקס המלא עם תזמורת!',
    hours: 'חילופי משמר: כל שעה עגולה. טקס מלא: ראשון 11:00',
    price: { adult: 0, child12to18: 0, childUnder12: 0, familyTotal: 0 },
    tips: 'הטקס המלא ביום ראשון בשעה 11:00 — לא לפספס! לעמוד בצד שמול הבניין.',
    googleMapsUrl: 'https://maps.google.com/?q=Syntagma+Square+Athens',
    mustBook: false,
  },
  {
    id: 'kallimarmaro',
    name: 'אצטדיון קלימרמרו',
    nameEl: 'Panathenaic Stadium',
    coords: [37.9688, 23.7412],
    category: 'historical',
    description: 'האצטדיון שבו נערכו המשחקים האולימפיים הראשונים בהיסטוריה המודרנית (1896). בנוי כולו משיש לבן. אפשר לרוץ בו!',
    hours: 'פתוח 08:00–19:00',
    price: {
      adult: 10,
      child12to18: 5,
      childUnder12: 0,
      get familyTotal() { return calcFamilyPrice(10, 5, 0) },
    },
    tips: 'מדהים לרוץ/ללכת על המסלול! בדרך מהגנים — לקחת דרך גנים הזאפיו.',
    googleMapsUrl: 'https://maps.google.com/?q=Panathenaic+Stadium+Athens',
    mustBook: false,
  },
  {
    id: 'zappeion',
    name: 'גנים זאפיו',
    nameEl: 'Zappeion Gardens',
    coords: [37.9715, 23.7381],
    category: 'nature',
    description: 'פארק ירוק גדול בלב אתונה, בין כיכר סינטגמה לאצטדיון. גני שעשועים, בריכות דגים, בתי קפה ושבילים נעימים.',
    hours: 'פתוח כל היום',
    price: { adult: 0, child12to18: 0, childUnder12: 0, familyTotal: 0 },
    tips: 'מקום מצוין לאכול בצל ולנוח בין אטרקציות. ילדים יכולים לרוץ חופשי.',
    googleMapsUrl: 'https://maps.google.com/?q=Zappeion+Gardens+Athens',
    mustBook: false,
  },
  {
    id: 'plaka',
    name: 'שכונת פלאקה',
    nameEl: 'Plaka',
    coords: [37.9744, 23.7290],
    category: 'fun',
    description: 'שכונה ציורית בצל האקרופוליס, עם סמטאות צרות, חנויות מזכרות, מסעדות וגלידריות. מקום מושלם לשוטט ולאכול.',
    hours: 'פתוח כל היום, ערב נעים במיוחד',
    price: { adult: 0, child12to18: 0, childUnder12: 0, familyTotal: 0 },
    tips: 'לאכול גירוס וסובלאקי! להיזהר ממסעדות "מלכודות תיירים" — לחפש מקום עם תפריט ביוונית.',
    googleMapsUrl: 'https://maps.google.com/?q=Plaka+Athens',
    mustBook: false,
  },
  {
    id: 'monastiraki',
    name: 'מונסטיראקי',
    nameEl: 'Monastiraki',
    coords: [37.9756, 23.7237],
    category: 'shopping',
    description: 'שוק אנטיקים, רחובות קניות וקפהאים נהדרים. אחת הנקודות הכי תוססות באתונה, עם תצפית על האקרופוליס.',
    hours: 'רוב החנויות: 09:00–21:00',
    price: { adult: 0, child12to18: 0, childUnder12: 0, familyTotal: 0 },
    tips: 'שוק הפשפשים פתוח בעיקר בסופ"ש בבוקר. לאכול בקפהאים על הכיכר.',
    googleMapsUrl: 'https://maps.google.com/?q=Monastiraki+Athens',
    mustBook: false,
  },
  {
    id: 'ermou',
    name: 'רחוב ארמו — קניות',
    nameEl: 'Ermou Street',
    coords: [37.9766, 23.7298],
    category: 'shopping',
    description: 'מדרחוב הקניות הראשי של אתונה עם כל הרשתות הגדולות. מחירים זולים יותר מישראל!',
    hours: 'חנויות פתוחות 09:00–21:00',
    price: { adult: 0, child12to18: 0, childUnder12: 0, familyTotal: 0 },
    tips: 'לשמור חצי יום מיוחד לקניות. זאפ הציג טוב לפני.',
    googleMapsUrl: 'https://maps.google.com/?q=Ermou+Street+Athens',
    mustBook: false,
  },
  {
    id: 'psirri',
    name: 'שכונת פסירי — אוכל וערב',
    nameEl: 'Psirri',
    coords: [37.9775, 23.7220],
    category: 'food',
    description: 'שכונה עם טברנות, מסעדות צבעוניות ומקומות מושלמים לארוחת ערב. בכלל זה Little Kook — קפה מעוצב מאגדות!',
    hours: 'ערב — מ-18:00',
    price: { adult: 0, child12to18: 0, childUnder12: 0, familyTotal: 0 },
    tips: 'Little Kook — קינוחים מושגעים ועיצוב שהילדים יעופו עליו. Instagram לפני האכילה!',
    googleMapsUrl: 'https://maps.google.com/?q=Psirri+Athens',
    mustBook: false,
  },
  {
    id: 'niarchos',
    name: 'מרכז תרבות ניארחוס',
    nameEl: 'Stavros Niarchos Foundation',
    coords: [37.9450, 23.6966],
    category: 'nature',
    description: 'פארק ענק עם תצפית, טלסקופים, משחקים לכל הגילאים, מזרקות (אפשר לרוץ בהן!), ובריכת נוי עם מופע אור כל חצי שעה.',
    hours: 'פתוח כל היום',
    price: { adult: 0, child12to18: 0, childUnder12: 0, familyTotal: 0 },
    tips: 'ממש ליד — מרינת פליסבוס עם מסעדות וטיילת ארוכה. לקחת מגבת לילדים לאזור המזרקות.',
    googleMapsUrl: 'https://maps.google.com/?q=Stavros+Niarchos+Foundation+Athens',
    mustBook: false,
  },
  {
    id: 'vouliagmeni',
    name: 'אגם ווליאגמני + חוף בוליבר',
    nameEl: 'Vouliagmeni Lake & Bolivar Beach',
    coords: [37.8125, 23.7820],
    category: 'fun',
    description: 'אגם עם מים בטמפרטורה קבועה של 26° ודגיגים שמכרסמים בעדינות את כפות הרגליים. ממש צמוד — חוף בוליבר עם מתנפחים, בר ומוסיקה.',
    hours: 'פתוח 07:00–20:00',
    price: {
      adult: 15,
      child12to18: 8,
      childUnder12: 5,
      get familyTotal() { return calcFamilyPrice(15, 8, 5) },
    },
    tips: '40 דקות מהעיר. לשלב עם חוף בוליבר ביום שלם על הים.',
    googleMapsUrl: 'https://maps.google.com/?q=Vouliagmeni+Lake+Athens',
    mustBook: false,
  },
  {
    id: 'aegina',
    name: 'איה אגינה / אגיסטרי',
    nameEl: 'Aegina / Agistri Island',
    coords: [37.7480, 23.4310],
    category: 'fun',
    description: 'איים קרובים לאתונה — מעבורת מפיראוס. אגינה: 1 שעה. אגיסטרי: 1.5 שעות. חופים מדהימים, אווירת כיף ורוגע.',
    hours: 'מעבורות מפיראוס — לבדוק שעות ב-ferryhopper.com',
    price: {
      adult: 18,
      child12to18: 9,
      childUnder12: 9,
      get familyTotal() { return calcFamilyPrice(18, 9, 9) },
    },
    tips: 'ללכת בבוקר מוקדם! לבדוק שעות חזרה מראש. לקחת אוכל מהדירה. מעבורת מהירה (flying dolphin) = פחות זמן, יותר יקר.',
    googleMapsUrl: 'https://maps.google.com/?q=Piraeus+Port+Athens',
    mustBook: false,
    bookUrl: 'https://www.ferryhopper.com',
  },
  {
    id: 'little-kook',
    name: 'Little Kook',
    nameEl: 'Little Kook',
    coords: [37.9782, 23.7228],
    category: 'food',
    description: 'קפה אגדי ומשוגע — עיצוב בנושאי ילדים ואגדות, קינוחים מיוחדים שהילדים יעופו עליהם. הכי אינסטגרמי באתונה.',
    hours: '11:00–24:00',
    price: { adult: 0, child12to18: 0, childUnder12: 0, familyTotal: 0 },
    tips: 'בשכונת פסירי. אל תבואו רעבים — זה בית קפה לקינוחים, לא מסעדה.',
    googleMapsUrl: 'https://maps.google.com/?q=Little+Kook+Athens',
    mustBook: false,
  },
  {
    id: 'sporo',
    name: 'סופר Sporo',
    nameEl: 'Sporo Supermarket',
    coords: [37.9782, 23.7355],
    category: 'supermarket',
    description: 'סופרמרקט קרוב לדירה — 6 דקות הליכה. מתאים לקניות יומיומיות: אוכל, שתייה, חטיפים.',
    hours: 'ב-ש 08:00–21:00, א 09:00–20:00',
    price: { adult: 0, child12to18: 0, childUnder12: 0, familyTotal: 0 },
    tips: 'הכי קרוב לדירה — לקנות כאן ביום הגעה לצרכי הלילה הראשון.',
    googleMapsUrl: 'https://maps.google.com/?q=Sporo+supermarket+Kolonaki+Athens',
    mustBook: false,
    walkFromApartment: '6 דקות הליכה',
  },
  {
    id: 'ab-vassilopoulos',
    name: 'AB Vassilopoulos',
    nameEl: 'AB Vassilopoulos',
    coords: [37.9748, 23.7372],
    category: 'supermarket',
    description: 'רשת סופרמרקטים גדולה ומוכרת ביוון — מגוון רחב, מחירים סבירים.',
    hours: 'ב-ש 08:00–21:00, א 09:00–20:00',
    price: { adult: 0, child12to18: 0, childUnder12: 0, familyTotal: 0 },
    tips: 'יש כאן הכל — מזון, קרם שמש, תרופות בסיסיות.',
    googleMapsUrl: 'https://maps.google.com/?q=AB+Vassilopoulos+Kolonaki+Athens',
    mustBook: false,
  },
  {
    id: 'souvlaki',
    name: 'מקומות גירוס וסובלאקי',
    nameEl: 'Souvlaki & Gyros',
    coords: [37.9760, 23.7260],
    category: 'food',
    description: 'אכלו גירוס וסובלאקי — זה אוכל הרחוב הטעים, הזול והמהיר של אתונה. מחפשים מקומות עם תפריט ביוונית — שם אוכלים המקומיים.',
    hours: 'כל היום',
    price: { adult: 0, child12to18: 0, childUnder12: 0, familyTotal: 0 },
    tips: 'מחיר גירוס: 3-4 יורו. סובלאקי: 1-2 יורו לשיפוד. טעים ולא יקר בכלל.',
    googleMapsUrl: 'https://maps.google.com/?q=souvlaki+Athens',
    mustBook: false,
  },
]

export const ITINERARY = [
  {
    date: '19/6',
    day: 'שישי',
    emoji: '✈️',
    title: 'הגעה',
    events: [
      { time: '07:30', title: 'המראה מחיפה' },
      { time: '10:25', title: 'נחיתה באתונה ✅' },
      { time: '12:00', title: 'הגעה לדירה בקולונקי — השאירו מזוודות' },
      { time: '13:00', title: 'צהריים + קניות ב-Sporo (6 דקות הליכה)', attractionId: 'souvlaki' },
      { time: '15:00', title: 'מנוחה בדירה' },
      { time: '19:00', title: 'פוניקולר לגבעת ליקאביטוס — תצפית שקיעה', attractionId: 'lycabettus' },
      { time: '21:00', title: 'שיטוט בשכונת קולונקי + ארוחת ערב' },
    ],
  },
  {
    date: '20/6',
    day: 'שבת',
    emoji: '🏛️',
    title: 'אקרופוליס ופלאקה',
    events: [
      { time: '08:00', title: '⚠️ אקרופוליס — מוקדם לפני החום!', attractionId: 'acropolis', important: true },
      { time: '11:00', title: 'שיטוט בשכונת פלאקה', attractionId: 'plaka' },
      { time: '13:00', title: 'צהריים בפלאקה — גירוס וסובלאקי', attractionId: 'souvlaki' },
      { time: '15:00', title: 'מנוחה / שופינג ראשוני' },
      { time: '18:00', title: 'ערב במונסטיראקי', attractionId: 'monastiraki' },
      { time: '20:00', title: 'ארוחת ערב בפסירי', attractionId: 'psirri' },
    ],
  },
  {
    date: '21/6',
    day: 'ראשון',
    emoji: '🏟️',
    title: 'סינטגמה + אצטדיון',
    events: [
      { time: '09:00', title: 'קלימרמרו — אצטדיון אולימפי, לרוץ שם!', attractionId: 'kallimarmaro' },
      { time: '10:30', title: 'הליכה דרך גנים זאפיו', attractionId: 'zappeion' },
      { time: '11:00', title: '🎖️ טקס חילופי משמר המלא — כיכר סינטגמה', attractionId: 'syntagma', important: true },
      { time: '13:00', title: 'צהריים ליד סינטגמה' },
      { time: '15:00', title: 'מוזיאון / מרכז ניארחוס', attractionId: 'niarchos' },
      { time: '19:00', title: 'ארוחת ערב + Little Kook', attractionId: 'little-kook' },
    ],
  },
  {
    date: '22/6',
    day: 'שני',
    emoji: '⛵',
    title: 'יום באי',
    events: [
      { time: '07:30', title: 'יציאה לפיראוס במטרו' },
      { time: '08:30', title: '⛴️ מעבורת לאגינה / אגיסטרי', attractionId: 'aegina' },
      { time: '10:00', title: 'הגעה לאי — חוף ים!' },
      { time: '13:00', title: 'צהריים דגים בנמל' },
      { time: '16:00', title: 'מעבורת חזרה' },
      { time: '18:30', title: 'הגעה לאתונה, מנוחה' },
    ],
  },
  {
    date: '23/6',
    day: 'שלישי',
    emoji: '🛍️',
    title: 'קניות + טיסה',
    events: [
      { time: '09:00', title: 'ארוחת בוקר נינוחה' },
      { time: '10:00', title: 'קניות ברחוב ארמו', attractionId: 'ermou' },
      { time: '13:00', title: 'צהריים + קפה אחרון' },
      { time: '15:00', title: '🚕 יציאה לנמל התעופה (מונית)' },
      { time: '18:05', title: '✈️ המראה חזרה לחיפה' },
    ],
  },
]

export const FOOD_TIPS = [
  { name: 'Little Kook', type: 'קפה וקינוחים', desc: 'עיצוב אגדי, קינוחים מושגעים לילדים' },
  { name: 'Fairytale', type: 'קינוחים', desc: 'קינוחים אינסטגרמיים' },
  { name: 'Ellyz', type: 'קינוחים', desc: 'מקום מיוחד לעוגות ומתוקים' },
  { name: 'גירוס / סובלאקי', type: 'אוכל רחוב', desc: '3-4 יורו לגירוס, הכי טעים ומהיר' },
  { name: 'טברנות בפסירי', type: 'ארוחות ערב', desc: 'שכונה תוססת עם מסעדות ביתיות' },
]

export const ATHENS_SYSTEM_PROMPT = `אתה מדריך טיול ייעודי לטיול משפחתי לאתונה. ענה תמיד בעברית, בצורה חמה וידידותית.
מידע על הטיול:
- משפחה: 2 הורים + יובל (14), נעמה (10), הילה (7)
- תאריכים: 19-23 יוני 2026
- דירה: Alopekis 20, קולונקי, אתונה 10675
- טיסה הלוך: חיפה 07:30 → אתונה 10:25
- טיסה חזור: אתונה 18:05 → חיפה 20:50

תוכנית יומית:
- שישי 19/6: הגעה, ליקאביטוס ערב
- שבת 20/6: אקרופוליס (להזמין!), פלאקה, מונסטיראקי
- ראשון 21/6: קלימרמרו, גנים זאפיו, טקס חילופי משמר 11:00, ניארחוס
- שני 22/6: הפלגה לאגינה/אגיסטרי מפיראוס
- שלישי 23/6: קניות ארמו, טיסה 18:05

אטרקציות עיקריות: אקרופוליס (להזמין ב-eshop.culture.gr), ליקאביטוס + פוניקולר, סינטגמה + טקס ראשון 11:00, קלימרמרו, פלאקה, מונסטיראקי, פסירי, Little Kook, גנים זאפיו, Stavros Niarchos, מעבורת מפיראוס לאיים.

תחבורה: מטרו (~1.4 יורו נסיעה), Bolt/FreeNow למוניות, מעבורת מפיראוס לאיים.
אוכל: גירוס 3-4 יורו, סובלאקי 1-2 יורו, מסעדות בפסירי לערב.
קניות: ארמו Street — זול יותר מישראל.

ענה בקצרה ובמידת הצורך. אל תמציא מידע שלא קיים כאן.`
