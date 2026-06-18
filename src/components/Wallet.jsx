import { useState, useEffect } from 'react'

const STORAGE_KEY = 'athens-wallet'

const DEFAULT_STATE = { budget: 0, expenses: [] }

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : DEFAULT_STATE
  } catch {
    return DEFAULT_STATE
  }
}

export default function Wallet() {
  const [data, setData] = useState(loadFromStorage)
  const [form, setForm] = useState({ label: '', amount: '' })
  const [editingBudget, setEditingBudget] = useState(false)
  const [budgetInput, setBudgetInput] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const totalSpent = data.expenses.reduce((sum, e) => sum + e.amount, 0)
  const remaining = data.budget - totalSpent
  const pct = data.budget > 0 ? totalSpent / data.budget : 0
  const balanceColor = pct >= 0.9 ? '#DC2626' : pct >= 0.7 ? '#D97706' : '#059669'

  function saveBudget() {
    const val = parseFloat(budgetInput)
    if (!isNaN(val) && val > 0) {
      setData(d => ({ ...d, budget: val }))
    }
    setEditingBudget(false)
    setBudgetInput('')
  }

  function addExpense() {
    const amount = parseFloat(form.amount)
    if (!form.label.trim() || isNaN(amount) || amount <= 0) return
    setData(d => ({
      ...d,
      expenses: [{ id: Date.now(), label: form.label.trim(), amount }, ...d.expenses],
    }))
    setForm({ label: '', amount: '' })
  }

  function deleteExpense(id) {
    setData(d => ({ ...d, expenses: d.expenses.filter(e => e.id !== id) }))
  }

  function reset() {
    setData(DEFAULT_STATE)
    setConfirmReset(false)
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pb-24 pt-4" style={{ direction: 'rtl' }}>
      <h2 className="text-lg font-medium mb-4" style={{ fontFamily: 'Rubik', color: '#0D2644' }}>
        💰 הארנק שלנו
      </h2>

      {/* Balance card */}
      <div
        className="rounded-2xl p-5 mb-4"
        style={{ background: '#0D2644', color: 'white' }}
      >
        <p className="text-sm mb-1" style={{ opacity: 0.7 }}>תקציב כולל</p>
        {editingBudget ? (
          <div className="flex gap-2 items-center mb-3">
            <input
              type="number"
              value={budgetInput}
              onChange={e => setBudgetInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveBudget()}
              placeholder="הכנס תקציב ב-€"
              autoFocus
              className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
              style={{ color: '#0D2644', fontFamily: 'Heebo' }}
            />
            <button
              onClick={saveBudget}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: '#C9A84C', color: 'white' }}
            >
              שמור
            </button>
          </div>
        ) : (
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-medium" style={{ fontFamily: 'Rubik' }}>
              {data.budget > 0 ? `€${data.budget.toLocaleString()}` : '—'}
            </span>
            <button
              onClick={() => { setBudgetInput(data.budget || ''); setEditingBudget(true) }}
              className="text-xs px-2 py-0.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              ✏️ {data.budget > 0 ? 'שנה' : 'הגדר'}
            </button>
          </div>
        )}

        <div className="flex justify-between text-sm mb-2">
          <span style={{ opacity: 0.7 }}>הוצאות: €{totalSpent.toFixed(0)}</span>
          <span style={{ color: balanceColor, fontWeight: 600 }}>
            נשאר: €{remaining.toFixed(0)}
          </span>
        </div>

        {data.budget > 0 && (
          <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${Math.min(pct * 100, 100)}%`, background: balanceColor }}
            />
          </div>
        )}
      </div>

      {/* Add expense form */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: 'white', border: '1px solid rgba(27,79,140,0.1)' }}
      >
        <p className="text-sm font-medium mb-3" style={{ color: '#0D2644', fontFamily: 'Rubik' }}>
          ➕ הוסף הוצאה
        </p>
        <input
          type="text"
          value={form.label}
          onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
          placeholder="מה קנית / לאן שילמת?"
          className="w-full px-3 py-2.5 rounded-xl text-sm mb-2 outline-none"
          style={{ border: '1px solid rgba(27,79,140,0.2)', color: '#0D2644', fontFamily: 'Heebo' }}
        />
        <div className="flex gap-2">
          <input
            type="number"
            value={form.amount}
            onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && addExpense()}
            placeholder="סכום ב-€"
            className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
            style={{ border: '1px solid rgba(27,79,140,0.2)', color: '#0D2644', fontFamily: 'Heebo' }}
          />
          <button
            onClick={addExpense}
            disabled={!form.label.trim() || !form.amount}
            className="px-5 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: form.label.trim() && form.amount ? '#1B4F8C' : 'rgba(27,79,140,0.2)',
              color: form.label.trim() && form.amount ? 'white' : '#999',
            }}
          >
            הוסף
          </button>
        </div>
      </div>

      {/* Expense list */}
      {data.expenses.length > 0 ? (
        <div className="flex flex-col gap-2 mb-4">
          <p className="text-xs font-medium mb-1" style={{ color: '#999' }}>הוצאות ({data.expenses.length})</p>
          {data.expenses.map(e => (
            <div
              key={e.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'white', border: '1px solid rgba(27,79,140,0.08)' }}
            >
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: '#0D2644' }}>{e.label}</p>
              </div>
              <span className="text-sm font-medium" style={{ color: '#1B4F8C' }}>€{e.amount}</span>
              <button
                onClick={() => deleteExpense(e.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                style={{ background: '#FEE2E2', color: '#DC2626' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8" style={{ color: '#BBB' }}>
          <p className="text-3xl mb-2">🧾</p>
          <p className="text-sm">עדיין לא הוספתם הוצאות</p>
        </div>
      )}

      {/* Reset */}
      {(data.budget > 0 || data.expenses.length > 0) && (
        <div className="mt-2 text-center">
          {confirmReset ? (
            <div className="flex gap-2 justify-center">
              <button
                onClick={reset}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: '#DC2626', color: 'white' }}
              >
                כן, מאפס הכל
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-4 py-2 rounded-xl text-sm"
                style={{ background: 'rgba(0,0,0,0.06)', color: '#666' }}
              >
                ביטול
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-xs px-3 py-2 rounded-xl"
              style={{ color: '#DC2626', background: '#FEE2E2' }}
            >
              🗑️ איפוס ארנק
            </button>
          )}
        </div>
      )}
    </div>
  )
}
