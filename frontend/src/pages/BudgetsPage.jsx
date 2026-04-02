import { useEffect, useMemo, useState } from 'react'
import { API_BASE_URL } from '../config/api'
import { formatCurrency } from '../utils/formatCurrency'
import { formatToday } from '../utils/date'
import '../App.css'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/* ── Style tokens — identical to ExpensesPage / IncomePage ─────────── */

const supportCardStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '16px 20px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  border: '1px solid #e2e8f0',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
}

const tableCardStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  minWidth: 0,
  overflow: 'hidden',
}

const panelStyle = {
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  background: '#f8fafc',
  overflow: 'hidden',
}

const thStyle = {
  padding: '9px 14px',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#475569',
  whiteSpace: 'nowrap',
  background: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
  textAlign: 'left',
}

const tdStyle = {
  padding: '9px 14px',
  fontSize: '13px',
  color: '#334155',
  borderBottom: '1px solid #f1f5f9',
  verticalAlign: 'middle',
}

const kpiLabelStyle = {
  display: 'block',
  fontSize: '10px',
  fontWeight: '600',
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: '#64748b',
  marginBottom: '6px',
}

const editBtnBase = {
  padding: '3px 10px',
  fontSize: '11px',
  fontWeight: '500',
  borderRadius: '6px',
  cursor: 'pointer',
  lineHeight: '1.7',
  letterSpacing: '0.01em',
  transition: 'background 0.12s, color 0.12s',
}

/* ── Component ───────────────────────────────────────────────────── */

function BudgetsPage() {
  const now = new Date()

  // budgets: used only to resolve IDs for edit/delete
  const [budgets, setBudgets]               = useState([])
  // budgetVsActual: primary dataset for table and KPIs
  const [budgetVsActual, setBudgetVsActual] = useState([])
  const [categories, setCategories]         = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState('')
  const [notification, setNotification]     = useState('')
  const [submitting, setSubmitting]         = useState(false)

  // Period selector
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear]   = useState(now.getFullYear())

  // Form state
  const [editingBudget, setEditingBudget] = useState(null)
  const [categoryId, setCategoryId]       = useState('')
  const [amount, setAmount]               = useState('')
  const [formMonth, setFormMonth]         = useState(now.getMonth() + 1)
  const [formYear, setFormYear]           = useState(now.getFullYear())

  // Hover states
  const [hoveredRow, setHoveredRow] = useState(null)
  const [hoveredKpi, setHoveredKpi] = useState(null)
  const [hoveredBtn, setHoveredBtn] = useState(null)

  /* ── Data fetching ─────────────────────────────────────────────── */

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(r => r.json())
      .then(data => setCategories(data))
  }, [])

  const fetchBudgets = () => {
    fetch(`${API_BASE_URL}/budgets`)
      .then(r => {
        if (!r.ok) throw new Error("Couldn't load budgets. Please refresh.")
        return r.json()
      })
      .then(data => setBudgets(data))
      .catch(err => setError(err.message))
  }

  const fetchBudgetVsActual = () => {
    setLoading(true)
    setError('')
    fetch(`${API_BASE_URL}/analytics/budget-vs-actual?month=${selectedMonth}&year=${selectedYear}`)
      .then(r => {
        if (!r.ok) throw new Error("Couldn't load budget data. Please refresh.")
        return r.json()
      })
      .then(data => {
        setBudgetVsActual(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => { fetchBudgets() }, [])
  useEffect(() => { fetchBudgetVsActual() }, [selectedMonth, selectedYear])

  useEffect(() => {
    if (!notification) return
    const t = setTimeout(() => setNotification(''), 3000)
    return () => clearTimeout(t)
  }, [notification])

  /* ── KPI derived values — computed directly from budgetVsActual ── */

  const totalBudget = useMemo(
    () => budgetVsActual.reduce((sum, r) => sum + Number(r.budget_amount), 0),
    [budgetVsActual]
  )
  const totalSpent = useMemo(
    () => budgetVsActual.reduce((sum, r) => sum + Number(r.actual_spent), 0),
    [budgetVsActual]
  )
  const totalRemaining  = useMemo(() => totalBudget - totalSpent, [totalBudget, totalSpent])
  const overBudgetCount = useMemo(() => budgetVsActual.filter(r => r.over_budget).length, [budgetVsActual])

  /* ── Handlers ──────────────────────────────────────────────────── */

  const resetForm = () => {
    setEditingBudget(null)
    setCategoryId('')
    setAmount('')
    setFormMonth(selectedMonth)
    setFormYear(selectedYear)
  }

  const handleEdit = (row) => {
    const b = budgets.find(bud => bud.category_id === row.category_id)
    setEditingBudget({ ...row, id: b?.id ?? null })
    setCategoryId(String(row.category_id))
    setAmount(String(row.budget_amount))
    setFormMonth(b ? b.period_month : selectedMonth)
    setFormYear(b ? b.period_year : selectedYear)
  }

  const handleDelete = async (row) => {
    const b = budgets.find(bud => bud.category_id === row.category_id)
    if (!b) return
    if (!window.confirm('Delete this budget? This action cannot be undone.')) return
    try {
      const r = await fetch(`${API_BASE_URL}/budgets/${b.id}`, { method: 'DELETE' })
      if (!r.ok) throw new Error("Couldn't delete this budget. Please try again.")
      setNotification('Budget deleted.')
      fetchBudgets()
      fetchBudgetVsActual()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const payload = {
      category_id: Number(categoryId),
      amount: Number(amount),
      period_month: Number(formMonth),
      period_year: Number(formYear),
    }

    try {
      if (editingBudget) {
        const r = await fetch(`${API_BASE_URL}/budgets/${editingBudget.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!r.ok) {
          const err = await r.json()
          throw new Error(err.detail || "Couldn't update this budget. Please try again.")
        }
        setNotification('Budget updated.')
      } else {
        const r = await fetch(`${API_BASE_URL}/budgets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!r.ok) {
          const err = await r.json()
          throw new Error(err.detail || "Couldn't save this budget. Please try again.")
        }
        setNotification('Budget added.')
      }
      resetForm()
      fetchBudgets()
      fetchBudgetVsActual()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Style helpers ─────────────────────────────────────────────── */

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

  const kpiCard = (id, accentColor) => ({
    ...supportCardStyle,
    borderLeft: `3px solid ${accentColor}`,
    transform: hoveredKpi === id ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: hoveredKpi === id
      ? '0 4px 12px rgba(0,0,0,0.09)'
      : '0 1px 3px rgba(0,0,0,0.05)',
    cursor: 'default',
  })

  const editBtn = (id) => ({
    ...editBtnBase,
    border: '1px solid #e2e8f0',
    background: hoveredBtn === id ? '#f1f5f9' : 'transparent',
    color: '#475569',
  })

  const deleteBtn = (id) => ({
    ...editBtnBase,
    border: '1px solid #fecaca',
    background: hoveredBtn === id ? '#fff1f2' : 'transparent',
    color: '#dc2626',
  })

  /* ── Status badge ──────────────────────────────────────────────── */

  const statusBadge = (row) => {
    if (row.over_budget) {
      return (
        <span style={{
          display: 'inline-block',
          fontSize: '11px', fontWeight: '600',
          letterSpacing: '0.04em',
          padding: '2px 8px',
          borderRadius: '999px',
          background: '#fef2f2',
          color: '#dc2626',
          whiteSpace: 'nowrap',
        }}>Over Budget</span>
      )
    }
    if (Number(row.actual_spent) === 0) {
      return (
        <span style={{
          display: 'inline-block',
          fontSize: '11px', fontWeight: '600',
          padding: '2px 8px',
          borderRadius: '999px',
          background: '#f1f5f9',
          color: '#94a3b8',
          whiteSpace: 'nowrap',
        }}>No Spend Yet</span>
      )
    }
    return (
      <span style={{
        display: 'inline-block',
        fontSize: '11px', fontWeight: '600',
        letterSpacing: '0.04em',
        padding: '2px 8px',
        borderRadius: '999px',
        background: '#f0fdf4',
        color: '#16a34a',
        whiteSpace: 'nowrap',
      }}>On Track</span>
    )
  }

  /* ── Render ────────────────────────────────────────────────────── */

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100%' }}>

      {/*
        Scoped styles for the panel — mirrors .ep-panel and .ip-panel pattern.
        Targets only .bp-panel descendants to avoid global side-effects.
      */}
      <style>{`
        .bp-panel input,
        .bp-panel select {
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
        .bp-panel input:focus,
        .bp-panel select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        }
        .bp-panel label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .bp-panel .bp-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 12px;
          margin-bottom: 12px;
        }
        .bp-panel button[type="submit"] {
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
          margin-bottom: 8px;
        }
        .bp-panel button[type="submit"]:hover {
          background: #1e293b;
        }
        .bp-panel button[type="submit"]:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .bp-panel .bp-cancel-btn {
          width: 100%;
          padding: 7px 16px;
          font-size: 13px;
          font-weight: 500;
          background: transparent;
          color: #64748b;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .bp-panel .bp-cancel-btn:hover {
          background: #f1f5f9;
        }
      `}</style>

      {/* ── 1. Header band ─────────────────────────────────────────── */}
      <div className="page-header-band" style={{
        background: '#ffffff',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.02em' }}>
              Budgets
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '400', letterSpacing: '0.01em' }}>
              Viewing {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </p>
          </div>

          <div className="period-controls" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <div className="period-selector" style={{
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
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
              Today: {formatToday()}
            </p>
          </div>

        </div>
      </div>

      {/* ── Page body ──────────────────────────────────────────────── */}
      <div className="page-body">

        {notification && <p className="notification" style={{ margin: 0 }}>{notification}</p>}
        {error         && <p style={{ margin: 0, color: '#dc2626', fontSize: '13px' }}>Something went wrong. Please try again.</p>}

        {/* ── 2. KPI tiles ──────────────────────────────────────────── */}
        <div className="kpi-grid-4">

          <div
            style={kpiCard('total-budget', '#2563eb')}
            onMouseEnter={() => setHoveredKpi('total-budget')}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <span style={kpiLabelStyle}>Total Budget</span>
            <span style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>
              {formatCurrency(totalBudget)}
            </span>
          </div>

          <div
            style={kpiCard('actual-spend', '#ea580c')}
            onMouseEnter={() => setHoveredKpi('actual-spend')}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <span style={kpiLabelStyle}>Actual Spending</span>
            <span style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>
              {formatCurrency(totalSpent)}
            </span>
          </div>

          <div
            style={kpiCard('remaining', totalRemaining >= 0 ? '#059669' : '#dc2626')}
            onMouseEnter={() => setHoveredKpi('remaining')}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <span style={kpiLabelStyle}>Remaining</span>
            <span style={{ fontSize: '26px', fontWeight: '700', color: totalRemaining >= 0 ? '#0f172a' : '#dc2626', lineHeight: 1 }}>
              {formatCurrency(totalRemaining)}
            </span>
          </div>

          <div
            style={kpiCard('over-budget', overBudgetCount > 0 ? '#dc2626' : '#7c3aed')}
            onMouseEnter={() => setHoveredKpi('over-budget')}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <span style={kpiLabelStyle}>Over Budget</span>
            <span style={{ fontSize: '26px', fontWeight: '700', color: overBudgetCount > 0 ? '#dc2626' : '#0f172a', lineHeight: 1 }}>
              {overBudgetCount}
            </span>
            {budgetVsActual.length > 0 && (
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                of {budgetVsActual.length} categor{budgetVsActual.length !== 1 ? 'ies' : 'y'}
              </span>
            )}
          </div>

        </div>

        {/* ── 3. PRIMARY WORKSPACE ─────────────────────────────────── */}
        <div className="page-workspace-grid">

          {/* ── 3a. Budget overview table — hero ──────────────────── */}
          <section style={tableCardStyle}>

            {/* Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '16px 20px 13px',
              borderBottom: '1px solid #f1f5f9',
            }}>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
                  Budget Overview
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '400' }}>
                  {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                  {budgetVsActual.length > 0 && ` · ${budgetVsActual.length} categor${budgetVsActual.length !== 1 ? 'ies' : 'y'}`}
                </p>
              </div>
            </div>

            {/* States */}
            {loading && (
              <p style={{ color: '#64748b', margin: 0, fontSize: '13px', padding: '16px 20px' }}>Loading...</p>
            )}
            {!loading && budgetVsActual.length === 0 && (
              <p style={{ color: '#64748b', margin: 0, fontSize: '13px', padding: '32px 20px', textAlign: 'center' }}>No budgets set for this period. Add one using the form.</p>
            )}

            {/* Data table */}
            {!loading && budgetVsActual.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Category</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Budget</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Spent</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Remaining</th>
                      <th style={thStyle}>Status</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetVsActual.map((row, i) => {
                      const isLast    = i === budgetVsActual.length - 1
                      const isHovered = hoveredRow === row.category_id
                      const rowBg     = isHovered ? '#f9fafb' : i % 2 === 0 ? '#ffffff' : '#fafbfc'
                      const rowTd     = {
                        ...tdStyle,
                        borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                      }
                      const remaining = Number(row.remaining_amount)

                      return (
                        <tr
                          key={row.category_id}
                          style={{ background: rowBg, transition: 'background 0.1s' }}
                          onMouseEnter={() => setHoveredRow(row.category_id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td style={{ ...rowTd, fontWeight: '500', color: '#0f172a' }}>
                            {row.category_name}
                          </td>
                          <td style={{ ...rowTd, textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                            {formatCurrency(Number(row.budget_amount))}
                          </td>
                          <td style={{ ...rowTd, textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                            {formatCurrency(Number(row.actual_spent))}
                          </td>
                          <td style={{
                            ...rowTd,
                            textAlign: 'right',
                            fontWeight: '600',
                            fontVariantNumeric: 'tabular-nums',
                            whiteSpace: 'nowrap',
                            color: remaining < 0 ? '#dc2626' : '#0f172a',
                          }}>
                            {formatCurrency(remaining)}
                          </td>
                          <td style={rowTd}>
                            {statusBadge(row)}
                          </td>
                          <td style={{ ...rowTd, textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                              <button
                                style={editBtn(`${row.category_id}-edit`)}
                                onMouseEnter={() => setHoveredBtn(`${row.category_id}-edit`)}
                                onMouseLeave={() => setHoveredBtn(null)}
                                onClick={() => handleEdit(row)}
                              >
                                Edit
                              </button>
                              <button
                                style={deleteBtn(`${row.category_id}-delete`)}
                                onMouseEnter={() => setHoveredBtn(`${row.category_id}-delete`)}
                                onMouseLeave={() => setHoveredBtn(null)}
                                onClick={() => handleDelete(row)}
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

          {/* ── 3b. Add / edit panel — sticky, secondary ────────────── */}
          <div style={{ position: 'sticky', top: '24px', minWidth: 0 }}>
            <section style={panelStyle}>

              {/* Panel header */}
              <div style={{
                padding: '13px 16px',
                borderBottom: '1px solid #e2e8f0',
                background: '#ffffff',
              }}>
                <h3 style={{ margin: '0 0 1px 0', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {editingBudget ? 'Edit Budget' : 'New Budget'}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '400' }}>
                  {editingBudget ? `Editing: ${editingBudget.category_name}` : 'Set a monthly spending limit'}
                </p>
              </div>

              {/* Panel body */}
              <div className="bp-panel" style={{ padding: '16px', boxSizing: 'border-box' }}>
                <form onSubmit={handleSubmit}>
                  <div className="bp-form-grid">

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label>Category</label>
                      <select
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label>Budget Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label>Month</label>
                      <select value={formMonth} onChange={e => setFormMonth(Number(e.target.value))} required>
                        {MONTH_NAMES.map((name, i) => (
                          <option key={name} value={i + 1}>{name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label>Year</label>
                      <select value={formYear} onChange={e => setFormYear(Number(e.target.value))} required>
                        <option value={2025}>2025</option>
                        <option value={2026}>2026</option>
                      </select>
                    </div>

                  </div>

                  <button type="submit" disabled={submitting}>
                    {submitting
                      ? (editingBudget ? 'Saving...' : 'Adding...')
                      : (editingBudget ? 'Save Changes' : 'Add Budget')
                    }
                  </button>

                  {editingBudget && (
                    <button type="button" className="bp-cancel-btn" onClick={resetForm}>
                      Cancel
                    </button>
                  )}

                </form>
              </div>

            </section>
          </div>

        </div>
      </div>
    </div>
  )
}

export default BudgetsPage
