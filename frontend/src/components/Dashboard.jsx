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
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(3)
  const [selectedYear, setSelectedYear] = useState(2026)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_BASE_URL}/analytics/dashboard?month=${selectedMonth}&year=${selectedYear}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

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

      {/* Header band */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '14px 36px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          {/* Left: title + period label */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '1px' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '700',
                color: '#0f172a',
                letterSpacing: '-0.01em',
              }}
            >
              Financial Dashboard
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '400' }}>
              Viewing {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </p>
          </div>

          {/* Right: period control + today date */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '6px',
            }}
          >
            {/* Period pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <span
                style={{
                  padding: '0 10px',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#94a3b8',
                  borderRight: '1px solid #e2e8f0',
                  whiteSpace: 'nowrap',
                  lineHeight: '30px',
                }}
              >
                Period
              </span>
              <select
                id="month-select"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(Number(event.target.value))}
                style={{ ...selectStyle, borderRight: '1px solid #e2e8f0' }}
              >
                {MONTH_NAMES.map((name, i) => (
                  <option key={name} value={i + 1}>{name}</option>
                ))}
              </select>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
                style={selectStyle}
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>

            {/* Today date — right-aligned, below the pill */}
            <p
              style={{
                margin: 0,
                fontSize: '12px',
                color: '#94a3b8',
                fontWeight: '400',
              }}
            >
              Today: {formatToday()}
            </p>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div style={{ padding: '32px 36px 48px' }}>
        {loading && (
          <p style={{ color: '#64748b' }}>Loading dashboard...</p>
        )}

        {error && (
          <p style={{ color: '#dc2626' }}>Error: {error}</p>
        )}

        {!loading && !error && !dashboardData && (
          <p style={{ color: '#64748b' }}>No dashboard data available.</p>
        )}

        {!loading && !error && dashboardData && (
          <div style={{ display: 'grid', gap: '24px' }}>

            {/* Row 1: Summary cards — full width */}
            <SummaryCards summary={dashboardData.summary} />

            {/* Row 2: Category spending + Budget status — side by side */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                alignItems: 'start',
              }}
            >
              <CategorySpendingSection
                categorySpending={dashboardData.category_spending}
              />
              <BudgetStatusSection budgetStatus={dashboardData.budget_status} />
            </div>

            {/* Row 3: Month comparison — full width */}
            <MonthComparisonSection
              monthComparison={dashboardData.month_comparison}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
