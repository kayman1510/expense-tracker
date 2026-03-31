import { useEffect, useMemo, useState } from 'react'
import ExpenseTable from '../components/ExpenseTable'
import AddExpenseForm from '../components/AddExpenseForm'
import EditExpenseForm from '../components/EditExpenseForm'
import { API_BASE_URL } from '../config/api'
import '../App.css'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const BAR_COLORS = ['#2563eb', '#0d9488', '#7c3aed', '#ea580c', '#059669', '#be185d']

const cardStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px 28px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
}

const headingStyle = {
  margin: '0 0 16px 0',
  fontSize: '15px',
  fontWeight: '600',
  color: '#0f172a',
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

function ExpensesPage() {
  const now = new Date()

  const [categories, setCategories] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingExpenses, setLoadingExpenses] = useState(true)
  const [categoryError, setCategoryError] = useState('')
  const [expenseError, setExpenseError] = useState('')
  const [editingExpense, setEditingExpense] = useState(null)
  const [notification, setNotification] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())

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

  const handleEditExpense = (expense) => setEditingExpense(expense)
  const handleCancelEdit = () => setEditingExpense(null)
  const handleExpenseAdded = () => { setNotification('Expense added successfully'); fetchExpenses() }
  const handleExpenseUpdated = () => { setEditingExpense(null); setNotification('Expense updated successfully'); fetchExpenses() }

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = new Date(e.expense_date)
      return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear
    })
  }, [expenses, selectedMonth, selectedYear])

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

  const hasChartData = categoryBreakdown.length > 0 || dailySpend.length > 0

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100%' }}>

      {/* Header band */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '14px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '1px' }}>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.01em' }}>
              Expenses
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '400' }}>
              Viewing {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <span style={{ padding: '0 10px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8', borderRight: '1px solid #e2e8f0', whiteSpace: 'nowrap', lineHeight: '30px' }}>
              Period
            </span>
            <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} style={{ ...selectStyle, borderRight: '1px solid #e2e8f0' }}>
              {MONTH_NAMES.map((name, i) => <option key={name} value={i + 1}>{name}</option>)}
            </select>
            <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} style={selectStyle}>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '28px 36px 48px', display: 'grid', gap: '20px' }}>

        {notification && <p className="notification" style={{ margin: 0 }}>{notification}</p>}
        {expenseError && <p style={{ margin: 0, color: '#dc2626', fontSize: '14px' }}>Error: {expenseError}</p>}

        {/* Row 1: KPI tiles — summary layer */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: '3px solid #2563eb' }}>
            <span style={kpiLabelStyle}>Total Spent</span>
            <span style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>{totalSpent.toFixed(2)}</span>
          </div>
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: '3px solid #7c3aed' }}>
            <span style={kpiLabelStyle}>Transactions</span>
            <span style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>{filteredExpenses.length}</span>
          </div>
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: '3px solid #0d9488' }}>
            <span style={kpiLabelStyle}>Top Category</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', lineHeight: 1.2 }}>
              {topCategory ? topCategory[0] : '—'}
            </span>
          </div>
        </div>

        {/* Row 2: Charts — summary layer, only when data exists */}
        {hasChartData && (
          <div style={{ display: 'grid', gridTemplateColumns: categoryBreakdown.length > 0 && dailySpend.length > 0 ? '1fr 1fr' : '1fr', gap: '20px', alignItems: 'start' }}>

            {categoryBreakdown.length > 0 && (
              <section style={cardStyle}>
                <h3 style={headingStyle}>By Category</h3>
                <div style={{ display: 'grid', gap: '14px' }}>
                  {categoryBreakdown.map((item, index) => {
                    const widthPct = (item.total / categoryBreakdown[0].total) * 100
                    const sharePct = totalSpent > 0 ? ((item.total / totalSpent) * 100).toFixed(1) : '0.0'
                    const color = BAR_COLORS[index % BAR_COLORS.length]
                    return (
                      <div key={item.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{item.name}</span>
                          <span style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{item.total.toFixed(2)}</span>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>{sharePct}%</span>
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${widthPct}%`, height: '100%', borderRadius: '999px', background: color }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {dailySpend.length > 0 && (
              <section style={cardStyle}>
                <h3 style={headingStyle}>
                  Daily Spending
                  <span style={{ marginLeft: '8px', fontSize: '12px', fontWeight: '400', color: '#94a3b8' }}>
                    {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                  </span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dailySpend.map(({ date, total }) => {
                    const widthPct = (total / maxDailySpend) * 100
                    const label = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    return (
                      <div key={date} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', width: '52px', flexShrink: 0, textAlign: 'right' }}>
                          {label}
                        </span>
                        <div style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${widthPct}%`, height: '100%', borderRadius: '999px', background: '#2563eb' }} />
                        </div>
                        <span style={{ fontSize: '12px', color: '#475569', fontWeight: '600', width: '60px', flexShrink: 0 }}>
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

        {/* Row 3: Table (primary) + Form panel (secondary) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', alignItems: 'start' }}>

          {/* Transactions table — primary */}
          <section style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ ...headingStyle, margin: 0 }}>Transactions</h3>
              {!loadingCategories && !categoryError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Category</span>
                  <select
                    value={selectedCategoryId}
                    onChange={e => setSelectedCategoryId(e.target.value)}
                    style={{ padding: '5px 8px', fontSize: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#f8fafc', color: '#1e293b', outline: 'none' }}
                  >
                    <option value="">All</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
            </div>
            {loadingExpenses && <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Loading...</p>}
            {!loadingExpenses && filteredExpenses.length === 0 && (
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>No transactions for this period.</p>
            )}
            {!loadingExpenses && filteredExpenses.length > 0 && (
              <ExpenseTable
                expenses={filteredExpenses}
                onDeleteExpense={handleDeleteExpense}
                onEditExpense={handleEditExpense}
              />
            )}
          </section>

          {/* Add / Edit form — secondary panel */}
          {/* minWidth: 0 prevents the grid column from overflowing its track */}
          <section style={{ ...cardStyle, minWidth: 0, overflow: 'hidden' }}>
            {editingExpense ? (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ ...headingStyle, margin: '0 0 2px 0' }}>Edit Expense</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Editing: {editingExpense.title}</p>
                </div>
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
                <h3 style={headingStyle}>Add Expense</h3>
                {loadingCategories && <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Loading categories...</p>}
                {categoryError && <p style={{ color: '#dc2626', margin: 0, fontSize: '14px' }}>Could not load categories.</p>}
                {!loadingCategories && !categoryError && (
                  <AddExpenseForm categories={categories} onExpenseAdded={handleExpenseAdded} />
                )}
              </>
            )}
          </section>

        </div>
      </div>
    </div>
  )
}

export default ExpensesPage
