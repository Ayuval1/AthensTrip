import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'athens-packing-v2'

const PEOPLE = [
  { id: 'family', label: 'משפחה', emoji: '👨‍👩‍👧‍👦' },
  { id: 'אמא', label: 'אמא', emoji: '👩' },
  { id: 'אבא', label: 'אבא', emoji: '👨' },
  { id: 'יובל', label: 'יובל', emoji: '🏃' },
  { id: 'נעמה', label: 'נעמה', emoji: '👧' },
  { id: 'הילה', label: 'הילה', emoji: '🧒' },
]

const CATEGORIES = ['בגדים', 'היגיינה', 'מסמכים', 'טכנולוגיה', 'כללי']
const CATEGORY_ICONS = { בגדים: '👕', היגיינה: '🧴', מסמכים: '📄', טכנולוגיה: '🔌', כללי: '🎒' }

function makePersonItems(personId) {
  const base = (id, label, category) => ({ id, label, category, checked: false })
  const uid = () => Math.random()

  if (personId === 'family') return [
    base(1, 'דרכון (לכולם!)', 'מסמכים'),
    base(2, 'כרטיסי טיסה (מודפסים / בנייד)', 'מסמכים'),
    base(3, 'ביטוח נסיעות', 'מסמכים'),
    base(4, 'כרטיסי אשראי', 'מסמכים'),
    base(5, 'מזומן יורו', 'מסמכים'),
    base(6, 'קרם שמש גבוה (SPF 50)', 'היגיינה'),
    base(7, 'תרופות בסיסיות (כאבי ראש, בטן)', 'היגיינה'),
    base(8, 'חומר נגד יתושים', 'היגיינה'),
    base(9, 'פאוורבנק', 'טכנולוגיה'),
    base(10, 'מתאם חשמל / שקע', 'טכנולוגיה'),
    base(11, 'מצלמה', 'טכנולוגיה'),
    base(12, 'מגבות (לחוף)', 'כללי'),
    base(13, 'בקבוק מים (לכל אחד)', 'כללי'),
    base(14, 'חטיפים לדרך', 'כללי'),
    base(15, 'תיק גב קטן לטיולים יומיים', 'כללי'),
  ]

  if (personId === 'אמא') return [
    base(uid(), 'חולצות (4)', 'בגדים'),
    base(uid(), 'מכנסיים קצרים (2)', 'בגדים'),
    base(uid(), 'מכנסיים ארוכים (1)', 'בגדים'),
    base(uid(), 'שמלה / חצאית', 'בגדים'),
    base(uid(), 'בגד ים', 'בגדים'),
    base(uid(), 'כובע / מצחייה', 'בגדים'),
    base(uid(), 'נעלי הליכה נוחות', 'בגדים'),
    base(uid(), 'כפכפים', 'בגדים'),
    base(uid(), 'גרביים', 'בגדים'),
    base(uid(), 'לבנים (5)', 'בגדים'),
    base(uid(), 'משקפי שמש', 'בגדים'),
    base(uid(), 'שמפו + סבון', 'היגיינה'),
    base(uid(), 'מברשת שיניים + משחה', 'היגיינה'),
    base(uid(), 'דאודורנט', 'היגיינה'),
    base(uid(), 'קוסמטיקה', 'היגיינה'),
    base(uid(), 'מטען טלפון', 'טכנולוגיה'),
    base(uid(), 'אוזניות', 'טכנולוגיה'),
  ]

  if (personId === 'אבא') return [
    base(uid(), 'חולצות (4)', 'בגדים'),
    base(uid(), 'מכנסיים קצרים (2)', 'בגדים'),
    base(uid(), 'מכנסיים ארוכים (1)', 'בגדים'),
    base(uid(), 'בגד ים', 'בגדים'),
    base(uid(), 'כובע / מצחייה', 'בגדים'),
    base(uid(), 'נעלי הליכה נוחות', 'בגדים'),
    base(uid(), 'כפכפים', 'בגדים'),
    base(uid(), 'גרביים (5)', 'בגדים'),
    base(uid(), 'לבנים (5)', 'בגדים'),
    base(uid(), 'משקפי שמש', 'בגדים'),
    base(uid(), 'שמפו + סבון', 'היגיינה'),
    base(uid(), 'מברשת שיניים + משחה', 'היגיינה'),
    base(uid(), 'דאודורנט', 'היגיינה'),
    base(uid(), 'מטען טלפון', 'טכנולוגיה'),
    base(uid(), 'אוזניות', 'טכנולוגיה'),
  ]

  if (personId === 'יובל') return [
    base(uid(), 'חולצות (4)', 'בגדים'),
    base(uid(), 'חולצת ריצה', 'בגדים'),
    base(uid(), 'מכנסיים קצרים (2)', 'בגדים'),
    base(uid(), 'מכנסי ריצה', 'בגדים'),
    base(uid(), 'בגד ים', 'בגדים'),
    base(uid(), 'כובע / מצחייה', 'בגדים'),
    base(uid(), 'נעלי הליכה נוחות', 'בגדים'),
    base(uid(), 'נעלי ריצה', 'בגדים'),
    base(uid(), 'כפכפים', 'בגדים'),
    base(uid(), 'גרביים (5)', 'בגדים'),
    base(uid(), 'לבנים (5)', 'בגדים'),
    base(uid(), 'משקפי שמש', 'בגדים'),
    base(uid(), 'מברשת שיניים + משחה', 'היגיינה'),
    base(uid(), 'דאודורנט', 'היגיינה'),
    base(uid(), 'מטען טלפון', 'טכנולוגיה'),
    base(uid(), 'אוזניות', 'טכנולוגיה'),
  ]

  if (personId === 'נעמה') return [
    base(uid(), 'חולצות (4)', 'בגדים'),
    base(uid(), 'מכנסיים קצרים (2)', 'בגדים'),
    base(uid(), 'שמלה (1)', 'בגדים'),
    base(uid(), 'בגד ים', 'בגדים'),
    base(uid(), 'כובע / מצחייה', 'בגדים'),
    base(uid(), 'נעלי הליכה נוחות', 'בגדים'),
    base(uid(), 'כפכפים', 'בגדים'),
    base(uid(), 'גרביים (5)', 'בגדים'),
    base(uid(), 'לבנים (5)', 'בגדים'),
    base(uid(), 'משקפי שמש', 'בגדים'),
    base(uid(), 'מברשת שיניים + משחה', 'היגיינה'),
    base(uid(), 'מטען טלפון / טאבלט', 'טכנולוגיה'),
    base(uid(), 'ספר / משחק לדרך', 'כללי'),
  ]

  if (personId === 'הילה') return [
    base(uid(), 'חולצות (4)', 'בגדים'),
    base(uid(), 'מכנסיים קצרים (2)', 'בגדים'),
    base(uid(), 'שמלה (1)', 'בגדים'),
    base(uid(), 'בגד ים', 'בגדים'),
    base(uid(), 'כובע / מצחייה', 'בגדים'),
    base(uid(), 'נעלי הליכה נוחות', 'בגדים'),
    base(uid(), 'כפכפים', 'בגדים'),
    base(uid(), 'גרביים (5)', 'בגדים'),
    base(uid(), 'לבנים (5)', 'בגדים'),
    base(uid(), 'מברשת שיניים + משחה', 'היגיינה'),
    base(uid(), 'בובה / ממולא קטן', 'כללי'),
    base(uid(), 'ספר / משחק לדרך', 'כללי'),
  ]

  return []
}

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  const initial = {}
  PEOPLE.forEach(p => { initial[p.id] = makePersonItems(p.id) })
  return initial
}

export default function PackingList() {
  const [allLists, setAllLists] = useState(loadAll)
  const [selectedPerson, setSelectedPerson] = useState('family')
  const [showAdd, setShowAdd] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newCat, setNewCat] = useState('בגדים')
  const [editId, setEditId] = useState(null)
  const [editLabel, setEditLabel] = useState('')
  const personBarRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allLists))
  }, [allLists])

  const items = allLists[selectedPerson] || []

  function updateItems(fn) {
    setAllLists(prev => ({ ...prev, [selectedPerson]: fn(prev[selectedPerson] || []) }))
  }

  const checked = items.filter(i => i.checked).length
  const pct = items.length ? checked / items.length : 0
  const barColor = pct >= 1 ? '#059669' : pct >= 0.5 ? '#2563EB' : '#C9A84C'

  function toggle(id) {
    updateItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  function addItem() {
    if (!newLabel.trim()) return
    updateItems(prev => [...prev, { id: Date.now(), label: newLabel.trim(), category: newCat, checked: false }])
    setNewLabel('')
    setShowAdd(false)
  }

  function deleteItem(id) {
    updateItems(prev => prev.filter(i => i.id !== id))
  }

  function saveEdit(id) {
    if (!editLabel.trim()) return
    updateItems(prev => prev.map(i => i.id === id ? { ...i, label: editLabel.trim() } : i))
    setEditId(null)
  }

  function resetPerson() {
    if (confirm(`לאפס את הסימונים של ${PEOPLE.find(p => p.id === selectedPerson)?.label}?`)) {
      updateItems(prev => prev.map(i => ({ ...i, checked: false })))
    }
  }

  const currentPerson = PEOPLE.find(p => p.id === selectedPerson)

  return (
    <div className="flex flex-col h-full" style={{ direction: 'rtl' }}>
      {/* Person selector */}
      <div
        ref={personBarRef}
        className="flex gap-1.5 px-3 pt-3 pb-2 overflow-x-auto flex-shrink-0"
        style={{ scrollbarWidth: 'none' }}
      >
        {PEOPLE.map(p => {
          const pItems = allLists[p.id] || []
          const pChecked = pItems.filter(i => i.checked).length
          const isSelected = selectedPerson === p.id
          return (
            <button
              key={p.id}
              onClick={() => { setSelectedPerson(p.id); setShowAdd(false); setEditId(null) }}
              className="flex-shrink-0 flex flex-col items-center gap-0.5 px-2 py-2 rounded-2xl transition-all"
              style={{
                background: isSelected ? '#1B4F8C' : 'white',
                border: `1px solid ${isSelected ? '#1B4F8C' : 'rgba(27,79,140,0.15)'}`,
                minWidth: '52px',
              }}
            >
              <span style={{ fontSize: '20px' }}>{p.emoji}</span>
              <span className="text-xs font-medium" style={{ color: isSelected ? 'white' : '#0D2644' }}>
                {p.label}
              </span>
              {pItems.length > 0 && (
                <span className="text-xs" style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#999' }}>
                  {pChecked}/{pItems.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2">
        {/* Header + progress */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-medium" style={{ fontFamily: 'Rubik', color: '#0D2644' }}>
            {currentPerson?.emoji} {currentPerson?.label}
          </h2>
          <button
            onClick={resetPerson}
            className="text-xs px-2.5 py-1 rounded-lg"
            style={{ background: 'rgba(27,79,140,0.07)', color: '#9BA8BE' }}
          >
            איפוס
          </button>
        </div>

        <div className="rounded-2xl p-4 mb-4" style={{ background: '#0D2644' }}>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>ארזת</span>
            <span className="text-2xl font-medium" style={{ fontFamily: 'Rubik', color: 'white' }}>
              {checked}<span className="text-base" style={{ opacity: 0.5 }}>/{items.length}</span>
            </span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${pct * 100}%`, background: barColor }}
            />
          </div>
          {pct === 1 && items.length > 0 && (
            <p className="text-xs mt-2 text-center" style={{ color: '#6EE7B7' }}>
              ✅ {currentPerson?.label} ארז/ה הכל!
            </p>
          )}
        </div>

        {/* Items by category */}
        {CATEGORIES.map(cat => {
          const catItems = items.filter(i => i.category === cat)
          if (!catItems.length) return null
          return (
            <div key={cat} className="mb-4">
              <p className="text-xs font-medium mb-2" style={{ color: '#999' }}>
                {CATEGORY_ICONS[cat]} {cat}
              </p>
              <div className="flex flex-col gap-1.5">
                {catItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{
                      background: item.checked ? 'rgba(5,150,105,0.07)' : 'white',
                      border: '1px solid rgba(27,79,140,0.08)',
                    }}
                  >
                    <button
                      onClick={() => toggle(item.id)}
                      className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all"
                      style={{
                        borderColor: item.checked ? '#059669' : 'rgba(27,79,140,0.5)',
                        background: item.checked ? '#059669' : 'transparent',
                      }}
                    >
                      {item.checked && <span style={{ color: 'white', fontSize: '11px', lineHeight: 1 }}>✓</span>}
                    </button>

                    {editId === item.id ? (
                      <input
                        autoFocus
                        value={editLabel}
                        onChange={e => setEditLabel(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(item.id); if (e.key === 'Escape') setEditId(null) }}
                        onBlur={() => saveEdit(item.id)}
                        className="flex-1 text-sm outline-none bg-transparent"
                        style={{ color: '#0D2644', fontFamily: 'Heebo' }}
                      />
                    ) : (
                      <span
                        className="flex-1 text-sm"
                        style={{
                          color: item.checked ? '#6B7280' : '#0D2644',
                          textDecoration: item.checked ? 'line-through' : 'none',
                        }}
                        onDoubleClick={() => { setEditId(item.id); setEditLabel(item.label) }}
                      >
                        {item.label}
                      </span>
                    )}

                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => { setEditId(item.id); setEditLabel(item.label) }}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                        style={{ background: 'rgba(27,79,140,0.07)', color: '#9BA8BE' }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                        style={{ background: '#FEE2E2', color: '#DC2626' }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Uncategorized */}
        {items.filter(i => !CATEGORIES.includes(i.category)).map(item => (
          <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1.5"
            style={{ background: item.checked ? 'rgba(5,150,105,0.07)' : 'white', border: '1px solid rgba(27,79,140,0.08)' }}>
            <button onClick={() => toggle(item.id)}
              className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: item.checked ? '#059669' : 'rgba(27,79,140,0.5)', background: item.checked ? '#059669' : 'transparent' }}>
              {item.checked && <span style={{ color: 'white', fontSize: '11px' }}>✓</span>}
            </button>
            <span className="flex-1 text-sm" style={{ color: item.checked ? '#6B7280' : '#0D2644', textDecoration: item.checked ? 'line-through' : 'none' }}>{item.label}</span>
            <button onClick={() => deleteItem(item.id)} className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: '#FEE2E2', color: '#DC2626' }}>✕</button>
          </div>
        ))}

        {/* Empty state */}
        {items.length === 0 && (
          <div className="text-center py-10" style={{ color: '#BBB' }}>
            <p style={{ fontSize: '32px' }}>{currentPerson?.emoji}</p>
            <p className="text-sm mt-2">רשימה ריקה — הוסף פריטים</p>
          </div>
        )}

        {/* Add item */}
        {showAdd ? (
          <div className="rounded-2xl p-4 mb-4 mt-2" style={{ background: 'white', border: '1px solid rgba(27,79,140,0.12)' }}>
            <p className="text-sm font-medium mb-3" style={{ color: '#0D2644', fontFamily: 'Rubik' }}>
              ➕ פריט חדש — {currentPerson?.label}
            </p>
            <input
              autoFocus
              type="text"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              placeholder="שם הפריט..."
              className="w-full px-3 py-2.5 rounded-xl text-sm mb-2 outline-none"
              style={{ border: '1px solid rgba(27,79,140,0.2)', color: '#0D2644', fontFamily: 'Heebo' }}
            />
            <select
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm mb-3 outline-none"
              style={{ border: '1px solid rgba(27,79,140,0.2)', color: '#0D2644', fontFamily: 'Heebo', background: 'white', direction: 'rtl' }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={addItem} disabled={!newLabel.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: newLabel.trim() ? '#1B4F8C' : 'rgba(27,79,140,0.2)', color: newLabel.trim() ? 'white' : '#999' }}>
                הוסף
              </button>
              <button onClick={() => { setShowAdd(false); setNewLabel('') }}
                className="px-4 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgba(0,0,0,0.06)', color: '#666' }}>
                ביטול
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl w-full justify-center mt-2 mb-4"
            style={{ color: '#1B4F8C', background: 'rgba(27,79,140,0.04)', border: '1px dashed rgba(27,79,140,0.25)' }}
          >
            ＋ הוסף פריט ל{currentPerson?.label}
          </button>
        )}
      </div>
    </div>
  )
}
