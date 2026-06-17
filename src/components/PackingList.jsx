import { useState, useEffect } from 'react'

const STORAGE_KEY = 'athens-packing'

const DEFAULT_ITEMS = [
  // בגדים
  { id: 1, label: 'חולצות (5)', category: 'בגדים', checked: false },
  { id: 2, label: 'מכנסיים קצרים (3)', category: 'בגדים', checked: false },
  { id: 3, label: 'מכנסיים ארוכים (1)', category: 'בגדים', checked: false },
  { id: 4, label: 'בגד ים לכולם', category: 'בגדים', checked: false },
  { id: 5, label: 'כובע / מצחייה', category: 'בגדים', checked: false },
  { id: 6, label: 'נעלי הליכה נוחות', category: 'בגדים', checked: false },
  { id: 7, label: 'נעלי גומי / כפכפים', category: 'בגדים', checked: false },
  { id: 8, label: 'גרביים', category: 'בגדים', checked: false },
  { id: 9, label: 'לבנים', category: 'בגדים', checked: false },
  { id: 10, label: 'חליפת ים / גלישה', category: 'בגדים', checked: false },
  // היגיינה
  { id: 11, label: 'קרם שמש גבוה (SPF 50)', category: 'היגיינה', checked: false },
  { id: 12, label: 'שמפו + סבון', category: 'היגיינה', checked: false },
  { id: 13, label: 'מברשת שיניים + משחה', category: 'היגיינה', checked: false },
  { id: 14, label: 'דאודורנט', category: 'היגיינה', checked: false },
  { id: 15, label: 'תרופות בסיסיות (כאבי ראש, בטן)', category: 'היגיינה', checked: false },
  { id: 16, label: 'חומר נגד יתושים', category: 'היגיינה', checked: false },
  // מסמכים
  { id: 17, label: 'דרכון (לכולם!)', category: 'מסמכים', checked: false },
  { id: 18, label: 'כרטיסי טיסה (מודפסים / בנייד)', category: 'מסמכים', checked: false },
  { id: 19, label: 'ביטוח נסיעות', category: 'מסמכים', checked: false },
  { id: 20, label: 'כרטיסי אשראי', category: 'מסמכים', checked: false },
  { id: 21, label: 'מזומן יורו', category: 'מסמכים', checked: false },
  // טכנולוגיה
  { id: 22, label: 'מטען טלפון (לכולם)', category: 'טכנולוגיה', checked: false },
  { id: 23, label: 'פאוורבנק', category: 'טכנולוגיה', checked: false },
  { id: 24, label: 'אוזניות', category: 'טכנולוגיה', checked: false },
  { id: 25, label: 'מתאם חשמל / שקע', category: 'טכנולוגיה', checked: false },
  { id: 26, label: 'מצלמה', category: 'טכנולוגיה', checked: false },
  // כללי
  { id: 27, label: 'מגבות (לחוף)', category: 'כללי', checked: false },
  { id: 28, label: 'תיק גב קטן לטיולים יומיים', category: 'כללי', checked: false },
  { id: 29, label: 'בקבוק מים (לכל אחד)', category: 'כללי', checked: false },
  { id: 30, label: 'חטיפים לדרך', category: 'כללי', checked: false },
]

const CATEGORIES = ['בגדים', 'היגיינה', 'מסמכים', 'טכנולוגיה', 'כללי']
const CATEGORY_ICONS = { בגדים: '👕', היגיינה: '🧴', מסמכים: '📄', טכנולוגיה: '🔌', כללי: '🎒' }

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : DEFAULT_ITEMS
  } catch {
    return DEFAULT_ITEMS
  }
}

export default function PackingList() {
  const [items, setItems] = useState(load)
  const [showAdd, setShowAdd] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newCat, setNewCat] = useState('כללי')
  const [editId, setEditId] = useState(null)
  const [editLabel, setEditLabel] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const checked = items.filter(i => i.checked).length
  const pct = items.length ? checked / items.length : 0
  const barColor = pct >= 1 ? '#059669' : pct >= 0.5 ? '#2563EB' : '#C9A84C'

  function toggle(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  function addItem() {
    if (!newLabel.trim()) return
    setItems(prev => [...prev, { id: Date.now(), label: newLabel.trim(), category: newCat, checked: false }])
    setNewLabel('')
    setShowAdd(false)
  }

  function deleteItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function saveEdit(id) {
    if (!editLabel.trim()) return
    setItems(prev => prev.map(i => i.id === id ? { ...i, label: editLabel.trim() } : i))
    setEditId(null)
  }

  function resetAll() {
    if (confirm('לאפס את כל הסימונים?')) {
      setItems(prev => prev.map(i => ({ ...i, checked: false })))
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pb-24 pt-4" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium" style={{ fontFamily: 'Rubik', color: '#0D2644' }}>
          🧳 מה לוקחים לאתונה
        </h2>
        <button
          onClick={resetAll}
          className="text-xs px-2.5 py-1 rounded-lg"
          style={{ background: 'rgba(27,79,140,0.07)', color: '#9BA8BE' }}
        >
          איפוס
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: '#0D2644' }}
      >
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
        {pct === 1 && (
          <p className="text-xs mt-2 text-center" style={{ color: '#6EE7B7' }}>✅ הכל ארוז! כיף גדול!</p>
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
                  style={{ background: item.checked ? 'rgba(5,150,105,0.07)' : 'white', border: '1px solid rgba(27,79,140,0.08)' }}
                >
                  <button
                    onClick={() => toggle(item.id)}
                    className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: item.checked ? '#059669' : 'rgba(27,79,140,0.25)',
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

      {/* Uncategorized items */}
      {items.filter(i => !CATEGORIES.includes(i.category)).length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium mb-2" style={{ color: '#999' }}>🗂️ אחר</p>
          {items.filter(i => !CATEGORIES.includes(i.category)).map(item => (
            <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1.5"
              style={{ background: item.checked ? 'rgba(5,150,105,0.07)' : 'white', border: '1px solid rgba(27,79,140,0.08)' }}>
              <button onClick={() => toggle(item.id)}
                className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: item.checked ? '#059669' : 'rgba(27,79,140,0.25)', background: item.checked ? '#059669' : 'transparent' }}>
                {item.checked && <span style={{ color: 'white', fontSize: '11px' }}>✓</span>}
              </button>
              <span className="flex-1 text-sm" style={{ color: item.checked ? '#6B7280' : '#0D2644', textDecoration: item.checked ? 'line-through' : 'none' }}>{item.label}</span>
              <button onClick={() => deleteItem(item.id)} className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: '#FEE2E2', color: '#DC2626' }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Add item */}
      {showAdd ? (
        <div className="rounded-2xl p-4 mb-4" style={{ background: 'white', border: '1px solid rgba(27,79,140,0.12)' }}>
          <p className="text-sm font-medium mb-3" style={{ color: '#0D2644', fontFamily: 'Rubik' }}>➕ פריט חדש</p>
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
          className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl w-full justify-center mb-4"
          style={{ color: '#1B4F8C', background: 'rgba(27,79,140,0.04)', border: '1px dashed rgba(27,79,140,0.25)' }}
        >
          ＋ הוסף פריט
        </button>
      )}
    </div>
  )
}
