import { useEffect, useMemo, useState } from 'react'
import { API_BASE_URL } from '../config/api'
import { formatCurrency } from '../utils/formatCurrency'
import '../App.css'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/* ── Style tokens — identical to ExpensesPage ────────────────────── */

const supportCardStyle = {
  background: '#ffffff',
  borderRadius: '10px',
  padding: '16px 20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
  color: '#64748b',
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
  color: '#94a3b8',
  marginBottom: '6px',
}

const deleteBtnBase = {
  padding: '3px 10px',
  fontSize: '11px',
  fontWeight: '500',
  borderRadius: '5px',
  cursor: 'pointer',
  lineHeight: '1.7',
  letterSpacing: '0.01em',
  transition: 'background 0.12s',
}

/* ── Component ───────────────────────────────────────────────────── */

function IncomePage() {
  const now = new Date()

  const [incomeItems, setIncomeItems]   = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [notification, setNotification] = useState('')
  const [submitting, setSubmitting]     = useState(false)

  // Form fields
  const [source, setSource]         = useState('')
  const [amount, setAmount]         = useState('')
  const [incomeDate, setIncomeDate] = useState('')
  const [notes, setNotes]           = useState('')

  // Period filter
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear]   = useState(now.getFullYear())

  // Hover state
  const [hoveredRow, setHoveredRow] = useState(null)
  const [hoveredBtn, setHoveredBtn] = useState(null)
  const [hoveredKpi, setHoveredKpi] = useState(null)

  /* ── Data fetching ─────────────────────────────────────────────── */

  const fetchIncome = () => {
    setLoading(true)
    setError('')
    fetch(`${API_BASE_URL}/income`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch income')
        return r.json()
      })
      .then(data => {
        setIncomeItems(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => { fetchIncome() }, [])

  useEffect(() => {
    if (!notification) return
    const t = setTimeout(() => setNotification(''), 3000)
    return () => clearTimeout(t)
  }, [notification])

  /* ── Handlers ──────────────────────────────────────────────────── */

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/income`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          amount: Number(amount),
          income_date: incomeDate,
          notes: notes || null,
        }),
      })
      if (!response.ok) throw new Error('Failed to create income')
      setNotification('Income added successfully')
      setSource('')
      setAmount('')
      setIncomeDate('')
      setNotes('')
      fetchIncome()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (incomeId) => {
    if (!window.confirm('Are you sure you want to delete this income entry?')) return
    try {
      const response = await fetch(`${API_BASE_URL}/income/${incomeId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete income')
      setNotification('Income deleted successfully')
      fetchIncome()
    } catch (err) {
      setError(err.message)
    }
  }

  /* ── Derived data ──────────────────────────────────────────────── */

  const filteredIncome = useMemo(() => incomeItems.filter(item => {
    const d = new Date(item.income_date)
    return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear
  }), [incomeItems, selectedMonth, selectedYear])

  const totalIncome = useMemo(
    () => filteredIncome.reduce((sum, item) => sum + Number(item.amount), 0),
    [filteredIncome]
  )

  const topSource = useMemo(() => {
    const map = {}
    filteredIncome.forEach(item => {
      map[item.source] = (map[item.source] || 0) + Number(item.amount)
    })
    const entries = Object.entries(map)
    return entries.length > 0 ? entries.reduce((a, b) => b[1] > a[1] ? b : a) : null
  }, [filteredIncome])

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

  const deleteBtn = (id) => ({
    ...deleteBtnBase,
    border: '1px solid #fecaca',
    background: hoveredBtn === id ? '#fff1f2' : 'transparent',
    color: '#dc2626',
  })

  /* ── Render ────────────────────────────────────────────────────── */

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100%' }}>

      {/* Scoped styles for panel inputs — mirrors ExpensesPage .ep-panel */}
      <style>{`
        .ip-panel input,
        .ip-panel select {
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
        .ip-panel input:focus,
        .ip-panel select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        }
        .ip-panel label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .ip-panel .ip-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 12px;
          margin-bottom: 12px;
        }
        .ip-panel button[type="submit"] {
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
        .ip-panel button[type="submit"]:hover {
          background: #1e293b;
        }
        .ip-panel button[type="submit"]:disabled {
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
              Income
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
        {error         && <p style={{ margin: 0, color: '#dc2626', fontSize: '13px' }}>Error: {error}</p>}

        {/* ── 2. KPI tiles ──────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>

          <div
            style={kpiCard('income', '#059669')}
            onMouseEnter={() => setHoveredKpi('income')}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <span style={kpiLabelStyle}>Total Income</span>
            <span style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>
              {formatCurrency(totalIncome)}
            </span>
          </div>

          <div
            style={kpiCard('entries', '#7c3aed')}
            onMouseEnter={() => setHoveredKpi('entries')}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <span style={kpiLabelStyle}>Entries</span>
            <span style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>
              {filteredIncome.length}
            </span>
          </div>

          <div
            style={kpiCard('source', '#2563eb')}
            onMouseEnter={() => setHoveredKpi('source')}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <span style={kpiLabelStyle}>Top Source</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', lineHeight: 1.3 }}>
              {topSource ? topSource[0] : '—'}
            </span>
          </div>

        </div>

        {/* ── 3. PRIMARY WORKSPACE ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '20px', alignItems: 'start' }}>

          {/* ── 3a. Income table — primary hero ───────────────────── */}
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
                  Income Records
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '400' }}>
                  {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                  {filteredIncome.length > 0 && ` · ${filteredIncome.length} record${filteredIncome.length !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>

            {/* States */}
            {loading && (
              <p style={{ color: '#64748b', margin: 0, fontSize: '13px', padding: '16px 20px' }}>Loading...</p>
            )}
            {!loading && filteredIncome.length === 0 && (
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px', padding: '16px 20px' }}>No income records for this period.</p>
            )}

            {/* Data table */}
            {!loading && filteredIncome.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: '40px', paddingRight: '8px' }}>#</th>
                      <th style={thStyle}>Source</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Notes</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncome.map((item, i) => {
                      const isLast    = i === filteredIncome.length - 1
                      const isHovered = hoveredRow === item.id
                      const rowBg     = isHovered ? '#f9fafb' : i % 2 === 0 ? '#ffffff' : '#fafbfc'
                      const rowTd     = {
                        ...tdStyle,
                        borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                      }

                      return (
                        <tr
                          key={item.id}
                          style={{ background: rowBg, transition: 'background 0.1s' }}
                          onMouseEnter={() => setHoveredRow(item.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          {/* ID — muted metadata */}
                          <td style={{ ...rowTd, color: '#94a3b8', fontVariantNumeric: 'tabular-nums', paddingRight: '8px' }}>
                            {item.id}
                          </td>

                          {/* Source — primary text */}
                          <td style={{ ...rowTd, fontWeight: '500', color: '#0f172a' }}>
                            {item.source}
                          </td>

                          {/* Amount — emphasized, right-aligned */}
                          <td style={{ ...rowTd, textAlign: 'right', fontWeight: '600', color: '#059669', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                            {formatCurrency(Number(item.amount))}
                          </td>

                          {/* Date — muted */}
                          <td style={{ ...rowTd, color: '#64748b', whiteSpace: 'nowrap' }}>
                            {new Date(item.income_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>

                          {/* Notes — secondary, truncated if long */}
                          <td style={{ ...rowTd, color: '#94a3b8', fontSize: '12px', maxWidth: '180px' }}>
                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.notes || '—'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td style={{ ...rowTd, textAlign: 'right' }}>
                            <button
                              style={deleteBtn(`${item.id}-delete`)}
                              onMouseEnter={() => setHoveredBtn(`${item.id}-delete`)}
                              onMouseLeave={() => setHoveredBtn(null)}
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </section>

          {/* ── 3b. Add income panel — sticky, secondary ──────────── */}
          <div style={{ position: 'sticky', top: '24px', minWidth: 0 }}>
            <section style={panelStyle}>

              {/* Panel header */}
              <div style={{
                padding: '13px 16px',
                borderBottom: '1px solid #e2e8f0',
                background: '#ffffff',
              }}>
                <h3 style={{ margin: '0 0 1px 0', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  New Income
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '400' }}>
                  Record a new income entry
                </p>
              </div>

              {/* Panel body */}
              <div className="ip-panel" style={{ padding: '16px', boxSizing: 'border-box' }}>
                <form onSubmit={handleSubmit}>
                  <div className="ip-form-grid">

                    <div>
                      <label>Source</label>
                      <input
                        type="text"
                        placeholder="e.g. Salary"
                        value={source}
                        onChange={e => setSource(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label>Amount</label>
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
                      <label>Date</label>
                      <input
                        type="date"
                        value={incomeDate}
                        onChange={e => setIncomeDate(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label>Notes</label>
                      <input
                        type="text"
                        placeholder="Optional"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                      />
                    </div>

                  </div>

                  <button type="submit" disabled={submitting}>
                    {submitting ? 'Adding...' : 'Add Income'}
                  </button>
                </form>
              </div>

            </section>
          </div>

        </div>
      </div>
    </div>
  )
}

export default IncomePage
