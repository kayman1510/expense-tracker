import { useEffect, useState } from 'react'
import SummaryCards from './SummaryCards'
import CategorySpendingSection from './CategorySpendingSection'
import BudgetStatusSection from './BudgetStatusSection'
import MonthComparisonSection from './MonthComparisonSection'
import { API_BASE_URL } from '../config/api'

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

  if (loading) {
    return <p>Loading dashboard...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  if (!dashboardData) {
    return <p>No dashboard data available.</p>
  }

  return (
    <div
      style={{
        padding: '0 20px',
      }}
    >
      <h1
        style={{
          marginBottom: '24px',
          fontWeight: '700',
          letterSpacing: '0.3px',
        }}
      >
        Financial Dashboard
      </h1>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '30px',
          background: '#ffffff',
          padding: '14px 18px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <div>
          <label htmlFor="month-select">Month: </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(Number(event.target.value))}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
            <option value={11}>11</option>
            <option value={12}>12</option>
          </select>
        </div>

        <div>
          <label htmlFor="year-select">Year: </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(event) => setSelectedYear(Number(event.target.value))}
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '28px' }}>
        <SummaryCards summary={dashboardData.summary} />
        <CategorySpendingSection
          categorySpending={dashboardData.category_spending}
        />
        <BudgetStatusSection budgetStatus={dashboardData.budget_status} />
        <MonthComparisonSection
          monthComparison={dashboardData.month_comparison}
        />
      </div>
    </div>
  )
}

export default Dashboard