import { useEffect, useMemo, useState } from 'react'
import AddExpenseForm from '../components/AddExpenseForm'
import EditExpenseForm from '../components/EditExpenseForm'
import { API_BASE_URL } from '../config/api'
import '../App.css'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const BAR_COLORS = ['#2563eb', '#0d9488', '#7c3aed', '#ea580c', '#059669', '#be185d']

/* ── Style tokens ────────────────────────────────────────────────── */

// Supporting cards (KPI tiles, charts) — lighter than the table hero
const supportCardStyle = {
  background: '#ffffff',
  borderRadius: '10px',
  padding: '16px 20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
}

// Table section — visual hero; heavier than support cards
const tableCardStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  minWidth: 0,
  overflow: 'hidden',
}

// Right panel — secondary; no shadow, tinted bg
const panelStyle = {
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  background: '#f8fafc',
  overflow: 'hidden',
}

// Table column headers
const thStyle = {
  padding: '9px 14px',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#64748b',
  whiteSpace: 'nowrap',
  background: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
  textAlign: 'left',
}

// Table body cells
const tdStyle = {
  padding: '9px 14px',
  fontSize: '13px',
  color: '#334155',
  borderBottom: '1px solid #f1f5f9',
  verticalAlign: 'middle',
}

// Action buttons — ghost, low noise
const editBtnBase = {
  padding: '3px 10px',
  fontSize: '11px',
  fontWeight: '500',
  borderRadius: '5px',
  cursor: 'pointer',
  lineHeight: '1.7',
  letterSpacing: '0.01em',
  transition: 'background 0.12s, color 0.12s',
}

const kpiLabelStyle = {
  display: 'block',
  fontSize: '10px',
  fontWeight: '600',
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: '#94a3b8',
  marginBottom: '6px',
}

const headingStyle = {
  margin: '0 0 14px 0',
  fontSize: '14px',
  fontWeight: '600',
  color: '#0f172a',
}

/* ── Component ───────────────────────────────────────────────────── */

function ExpensesPage() {
  const now = new Date()

  const [categories, setCategories]               = useState([])
  const [expenses, setExpenses]                   = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingExpenses, setLoadingExpenses]     = useState(true)
  const [categoryError, setCategoryError]         = useState('')
  const [expenseError, setExpenseError]           = useState('')
  const [editingExpense, setEditingExpense]       = useState(null)
  const [notification, setNotification]           = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedMonth, setSelectedMonth]         = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear]           = useState(now.getFullYear())
  const [hoveredRow, setHoveredRow]               = useState(null)
  const [hoveredKpi, setHoveredKpi]               = useState(null)
  const [hoveredBtn, setHoveredBtn]               = useState(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch categories')
        return r.json()
      })
      .then(data => {
        setCategories(data)
        setLoadingCategories(false)
      })
      .catch(err => {
        setCategoryError(err.message)
        setLoadingCategories(false)
      })
  }, [])

  const fetchExpenses = () => {
    setLoadingExpenses(true)
    setExpenseError('')
    let url = `${API_BASE_URL}/expenses?limit=100`
    if (selectedCategoryId) url += `&category_id=${selectedCategoryId}`
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch expenses')
        return r.json()
      })
      .then(data => {
        setExpenses(data)
        setLoadingExpenses(false)
      })
      .catch(err => {
        setExpenseError(err.message)
        setLoadingExpenses(false)
      })
  }

  useEffect(() => { fetchExpenses() }, [selectedCategoryId])

  useEffect(() => {
    if (!notification) return
    const t = setTimeout(() => setNotification(''), 3000)
    return () => clearTimeout(t)
  }, [notification])

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Delete this expense?')) return
    try {
      const r = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, { method: 'DELETE' })
      if (!r.ok) throw new Error('Failed to delete expense')
      setNotification('Expense deleted successfully')
      fetchExpenses()
    } catch (err) {
      setExpenseError(err.message)
    }
  }

  const handleEditExpense    = (expense) => setEditingExpense(expense)
  const handleCancelEdit     = () => setEditingExpense(null)
  const handleExpenseAdded   = () => { setNotification('Expense added successfully');   fetchExpenses() }
  const handleExpenseUpdated = () => { setEditingExpense(null); setNotification('Expense updated successfully'); fetchExpenses() }

  /* ── Derived data ──────────────────────────────────────────────── */

  const filteredExpenses = useMemo(() => expenses.filter(e => {
    const d = new Date(e.expense_date)
    return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear
  }), [expenses, selectedMonth, selectedYear])

  const totalSpent = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [filteredExpenses]
  )

  const topCategory = useMemo(() => {
    const map = {}
    filteredExpenses.forEach(e => { map[e.category_name] = (map[e.category_name] || 0) + Number(e.amount) })
    const entries = Object.entries(map)
    return entries.length > 0 ? entries.reduce((a, b) => b[1] > a[1] ? b : a) : null
  }, [filteredExpenses])

  const categoryBreakdown = useMemo(() => {
    const map = {}
    filteredExpenses.forEach(e => { map[e.category_name] = (map[e.category_name] || 0) + Number(e.amount) })
    return Object.entries(map).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total)
  }, [filteredExpenses])

  const dailySpend = useMemo(() => {
    const map = {}
    filteredExpenses.forEach(e => {
      const day = e.expense_date.slice(0, 10)
      map[day] = (map[day] || 0) + Number(e.amount)
    })
    return Object.entries(map).map(([date, total]) => ({ date, total })).sort((a, b) => a.date.localeCompare(b.date))
  }, [filteredExpenses])

  const maxDailySpend = useMemo(
    () => dailySpend.length > 0 ? Math.max(...dailySpend.map(d => d.total)) : 1,
    [dailySpend]
  )

  const hasChartData = categoryBreakdown.length > 0 || dailySpend.length > 0

  const periodSelectStyle = {
    padding: '6px 8px',
    fontSize: '13px',
    fontWeight: '500',
    border: 'none',
    background: 'transparent',
    color: '#1e293b',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'auto',
  }

  // KPI card style with hover lift
  const kpiCard = (id, accentColor) => ({
    ...supportCardStyle,
    borderLeft: `3px solid ${accentColor}`,
    transform: hoveredKpi === id ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: hoveredKpi === id
      ? '0 4px 12px rgba(0,0,0,0.09)'
      : '0 1px 3px rgba(0,0,0,0.05)',
    cursor: 'default',
  })

  // Action button styles with hover tint
  const editBtn = (id) => ({
    ...editBtnBase,
    border: '1px solid #e2e8f0',
    background: hoveredBtn === id ? '#f1f5f9' : 'transparent',
    color: '#475569',
  })

  const deleteBtn = (id) => ({
    ...editBtnBase,
    border: '1px solid #fca5a5',
    background: hoveredBtn === id ? '#fff1f2' : 'transparent',
    color: '#ef4444',
  })

  /* ── Render ────────────────────────────────────────────────────── */

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100%' }}>

      {/*
        Scoped styles injected for pseudo-selectors (:focus) that inline styles
        cannot express. Targets only .ep-panel descendants — no global side-effects.
      */}
      <style>{`
        .ep-panel input,
        .ep-panel select {
          height: 36px;
          padding: 0 10px;
          font-size: 13px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: #ffffff;
          width: 100%;
          box-sizing: border-box;
          color: #1e293b;
        }
        .ep-panel input:focus,
        .ep-panel select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        }
        .ep-panel label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .ep-panel .form-grid {
          gap: 10px 12px;
          margin-bottom: 12px;
        }
        .ep-panel button[type="submit"] {
          width: 100%;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          background: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: background 0.15s;
        }
        .ep-panel button[type="submit"]:hover {
          background: #1e293b;
        }
        .ep-panel button[type="submit"]:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
      `}</style>

      {/* ── 1. Header band ─────────────────────────────────────────── */}
      <div style={{
        background: '#ffffff',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        padding: '15px 36px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.02em' }}>
              Expenses
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '400', letterSpacing: '0.01em' }}>
              Viewing {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}>
            <span style={{
              padding: '0 11px',
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#64748b',
              borderRight: '1px solid #dde3ec',
              whiteSpace: 'nowrap',
              lineHeight: '32px',
            }}>
              Period
            </span>
            <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} style={{ ...periodSelectStyle, borderRight: '1px solid #dde3ec' }}>
              {MONTH_NAMES.map((name, i) => <option key={name} value={i + 1}>{name}</option>)}
            </select>
            <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} style={periodSelectStyle}>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>

        </div>
      </div>

      {/* ── Page body ──────────────────────────────────────────────── */}
      <div style={{ padding: '24px 36px 56px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {notification && <p className="notification" style={{ margin: 0 }}>{notification}</p>}
        {expenseError  && <p style={{ margin: 0, color: '#dc2626', fontSize: '13px' }}>Error: {expenseError}</p>}

        {/* ── 2. KPI tiles ──────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>

          <div
            style={kpiCard('spent', '#2563eb')}
            onMouseEnter={() => setHoveredKpi('spent')}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <span style={kpiLabelStyle}>Total Spent</span>
            <span style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>
              {totalSpent.toFixed(2)}
            </span>
          </div>

          <div
            style={kpiCard('count', '#7c3aed')}
            onMouseEnter={() => setHoveredKpi('count')}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <span style={kpiLabelStyle}>Transactions</span>
            <span style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>
              {filteredExpenses.length}
            </span>
          </div>

          <div
            style={kpiCard('top', '#0d9488')}
            onMouseEnter={() => setHoveredKpi('top')}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <span style={kpiLabelStyle}>Top Category</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', lineHeight: 1.3 }}>
              {topCategory ? topCategory[0] : '—'}
            </span>
          </div>

        </div>

        {/* ── 3. Charts (conditional) ───────────────────────────────── */}
        {hasChartData && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: categoryBreakdown.length > 0 && dailySpend.length > 0 ? '1fr 1fr' : '1fr',
            gap: '16px',
            alignItems: 'start',
          }}>

            {categoryBreakdown.length > 0 && (
              <section style={supportCardStyle}>
                <h3 style={headingStyle}>By Category</h3>
                <div style={{ display: 'grid', gap: '11px' }}>
                  {categoryBreakdown.map((item, index) => {
                    const widthPct = (item.total / categoryBreakdown[0].total) * 100
                    const sharePct = totalSpent > 0 ? ((item.total / totalSpent) * 100).toFixed(1) : '0.0'
                    const color = BAR_COLORS[index % BAR_COLORS.length]
                    return (
                      <div key={item.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>{item.name}</span>
                          <span style={{ display: 'flex', gap: '5px', alignItems: 'baseline' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>{item.total.toFixed(2)}</span>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>{sharePct}%</span>
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${widthPct}%`, height: '100%', borderRadius: '999px', background: color }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {dailySpend.length > 0 && (
              <section style={supportCardStyle}>
                <h3 style={headingStyle}>
                  Daily Spending
                  <span style={{ marginLeft: '8px', fontSize: '11px', fontWeight: '400', color: '#94a3b8' }}>
                    {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                  </span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {dailySpend.map(({ date, total }) => {
                    const widthPct = (total / maxDailySpend) * 100
                    const label = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    return (
                      <div key={date} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', width: '48px', flexShrink: 0, textAlign: 'right' }}>
                          {label}
                        </span>
                        <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${widthPct}%`, height: '100%', borderRadius: '999px', background: '#2563eb' }} />
                        </div>
                        <span style={{ fontSize: '11px', color: '#475569', fontWeight: '600', width: '56px', flexShrink: 0 }}>
                          {total.toFixed(2)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

          </div>
        )}

        {/* ── 4. PRIMARY WORKSPACE ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '20px', alignItems: 'start' }}>

          {/* ── 4a. Transactions table — hero ─────────────────────── */}
          <section style={tableCardStyle}>

            {/* Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px 13px',
              borderBottom: '1px solid #f1f5f9',
            }}>
              <div>
                <h3 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
                  Transactions
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '400' }}>
                  {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                  {filteredExpenses.length > 0 && ` · ${filteredExpenses.length} record${filteredExpenses.length !== 1 ? 's' : ''}`}
                </p>
              </div>

              {!loadingCategories && !categoryError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Filter
                  </span>
                  <select
                    value={selectedCategoryId}
                    onChange={e => setSelectedCategoryId(e.target.value)}
                    style={{ padding: '5px 8px', fontSize: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#f8fafc', color: '#1e293b', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="">All categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* States */}
            {loadingExpenses && (
              <p style={{ color: '#64748b', margin: 0, fontSize: '13px', padding: '16px 20px' }}>Loading...</p>
            )}
            {!loadingExpenses && filteredExpenses.length === 0 && (
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px', padding: '16px 20px' }}>No transactions for this period.</p>
            )}

            {/* Data table */}
            {!loadingExpenses && filteredExpenses.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: '40px', paddingRight: '8px' }}>#</th>
                      <th style={thStyle}>Title</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Category</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((expense, i) => {
                      const isLast   = i === filteredExpenses.length - 1
                      const isHovered = hoveredRow === expense.id
                      const rowBg = isHovered ? '#f9fafb' : i % 2 === 0 ? '#ffffff' : '#fafbfc'
                      const rowTd = {
                        ...tdStyle,
                        borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                      }

                      return (
                        <tr
                          key={expense.id}
                          style={{ background: rowBg, transition: 'background 0.1s' }}
                          onMouseEnter={() => setHoveredRow(expense.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td style={{ ...rowTd, color: '#94a3b8', fontVariantNumeric: 'tabular-nums', paddingRight: '8px' }}>
                            {expense.id}
                          </td>
                          <td style={{ ...rowTd, fontWeight: '500', color: '#0f172a' }}>
                            {expense.title}
                          </td>
                          <td style={{ ...rowTd, textAlign: 'right', fontWeight: '600', color: '#0f172a', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                            {Number(expense.amount).toFixed(2)}
                          </td>
                          <td style={{ ...rowTd, color: '#64748b', whiteSpace: 'nowrap' }}>
                            {new Date(expense.expense_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td style={rowTd}>
                            <span style={{
                              display: 'inline-block',
                              fontSize: '11px',
                              fontWeight: '500',
                              color: '#475569',
                              background: '#eef2f7',
                              borderRadius: '5px',
                              padding: '2px 8px',
                              whiteSpace: 'nowrap',
                            }}>
                              {expense.category_name}
                            </span>
                          </td>
                          <td style={{ ...rowTd, textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                              <button
                                style={editBtn(`${expense.id}-edit`)}
                                onMouseEnter={() => setHoveredBtn(`${expense.id}-edit`)}
                                onMouseLeave={() => setHoveredBtn(null)}
                                onClick={() => handleEditExpense(expense)}
                              >
                                Edit
                              </button>
                              <button
                                style={deleteBtn(`${expense.id}-delete`)}
                                onMouseEnter={() => setHoveredBtn(`${expense.id}-delete`)}
                                onMouseLeave={() => setHoveredBtn(null)}
                                onClick={() => handleDeleteExpense(expense.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </section>

          {/* ── 4b. Control panel — sticky, secondary ─────────────── */}
          <div style={{ position: 'sticky', top: '24px', minWidth: 0 }}>
            <section style={panelStyle}>

              {/* Panel header */}
              <div style={{
                padding: '13px 16px',
                borderBottom: '1px solid #e2e8f0',
                background: '#ffffff',
              }}>
                <h3 style={{ margin: '0 0 1px 0', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {editingExpense ? 'Edit Expense' : 'New Expense'}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '400' }}>
                  {editingExpense ? `Editing: ${editingExpense.title}` : 'Record a new transaction'}
                </p>
              </div>

              {/*
                .ep-panel scopes the injected <style> block above.
                Overrides App.css input/label/button styles within the panel only.
              */}
              <div className="ep-panel" style={{ padding: '16px', boxSizing: 'border-box' }}>
                {editingExpense ? (
                  <>
                    {!loadingCategories && !categoryError && (
                      <EditExpenseForm
                        expense={editingExpense}
                        categories={categories}
                        onExpenseUpdated={handleExpenseUpdated}
                        onCancelEdit={handleCancelEdit}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {loadingCategories && <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>Loading categories...</p>}
                    {categoryError    && <p style={{ color: '#dc2626', margin: 0, fontSize: '13px' }}>Could not load categories.</p>}
                    {!loadingCategories && !categoryError && (
                      <AddExpenseForm categories={categories} onExpenseAdded={handleExpenseAdded} />
                    )}
                  </>
                )}
              </div>

            </section>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ExpensesPage
