import { useEffect, useState } from 'react'
import SummaryCards from './SummaryCards'
import CategorySpendingSection from './CategorySpendingSection'
import BudgetStatusSection from './BudgetStatusSection'
import MonthComparisonSection from './MonthComparisonSection'
import { API_BASE_URL } from '../config/api'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function formatToday() {
  const d = new Date()
  return `${SHORT_MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function Dashboard() {
  const now = new Date()

  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear]   = useState(now.getFullYear())

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(
          `${API_BASE_URL}/analytics/dashboard?month=${selectedMonth}&year=${selectedYear}`
        )
        if (!response.ok) throw new Error('Failed to fetch dashboard data')
        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [selectedMonth, selectedYear])

  const selectStyle = {
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

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100%' }}>

      {/* ── Header band ─────────────────────────────────────────────── */}
      <div className="page-header-band" style={{
        background: '#ffffff',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>

          {/* Left: title + period subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '1px' }}>
            <h1 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '700',
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}>
              Financial Dashboard
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '400' }}>
              Viewing {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </p>
          </div>

          {/* Right: period pill + today date */}
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
              <select
                id="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                style={{ ...selectStyle, borderRight: '1px solid #dde3ec' }}
              >
                {MONTH_NAMES.map((name, i) => (
                  <option key={name} value={i + 1}>{name}</option>
                ))}
              </select>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                style={selectStyle}
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>

            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '400' }}>
              As of {formatToday()}
            </p>
          </div>

        </div>
      </div>

      {/* ── Content area ────────────────────────────────────────────── */}
      <div style={{ padding: '24px 36px 56px' }}>

        {loading && (
          <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>Loading...</p>
        )}
        {error && (
          <p style={{ color: '#dc2626', margin: 0, fontSize: '13px' }}>Something went wrong. Please try again.</p>
        )}
        {!loading && !error && !dashboardData && (
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px' }}>No data available for this period.</p>
        )}

        {!loading && !error && dashboardData && (
          <div className="dashboard-content-grid">

            {/* Row 1: Summary cards */}
            <SummaryCards summary={dashboardData.summary} />

            {/* Row 2: Category spending */}
            <CategorySpendingSection categorySpending={dashboardData.category_spending} />

            {/* Row 3: Budget status */}
            <BudgetStatusSection budgetStatus={dashboardData.budget_status} />

            {/* Row 3: Month comparison */}
            <MonthComparisonSection monthComparison={dashboardData.month_comparison} />

          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
