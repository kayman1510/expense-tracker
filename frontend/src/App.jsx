import { useEffect, useMemo, useRef, useState } from 'react'
import ExpenseTable from './components/ExpenseTable'
import AddExpenseForm from './components/AddExpenseForm'
import EditExpenseForm from './components/EditExpenseForm'
import './App.css'

function App() {
  const [categories, setCategories] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingExpenses, setLoadingExpenses] = useState(true)
  const [categoryError, setCategoryError] = useState('')
  const [expenseError, setExpenseError] = useState('')
  const [editingExpense, setEditingExpense] = useState(null)
  const [notification, setNotification] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const formSectionRef = useRef(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/categories')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        return response.json()
      })
      .then((data) => {
        setCategories(data)
        setLoadingCategories(false)
      })
      .catch((error) => {
        setCategoryError(error.message)
        setLoadingCategories(false)
      })
  }, [])

  const fetchExpenses = () => {
    setLoadingExpenses(true)
    setExpenseError('')

    let url = 'http://127.0.0.1:8000/expenses'

    if (selectedCategoryId) {
      url += `?category_id=${selectedCategoryId}`
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch expenses')
        }
        return response.json()
      })
      .then((data) => {
        setExpenses(data)
        setLoadingExpenses(false)
      })
      .catch((error) => {
        setExpenseError(error.message)
        setLoadingExpenses(false)
      })
  }

  useEffect(() => {
    fetchExpenses()
  }, [selectedCategoryId])

  useEffect(() => {
    if (!notification) return

    const timer = setTimeout(() => {
      setNotification('')
    }, 3000)

    return () => clearTimeout(timer)
  }, [notification])

  useEffect(() => {
    if (editingExpense && formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [editingExpense])

  const handleDeleteExpense = async (expenseId) => {
    const confirmed = window.confirm('Are you sure you want to delete this expense?')
    if (!confirmed) return

    try {
      const response = await fetch(`http://127.0.0.1:8000/expenses/${expenseId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete expense')
      }

      setNotification('Expense deleted successfully')
      fetchExpenses()
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (error) {
      setExpenseError(error.message)
    }
  }

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
  }

  const handleExpenseAdded = () => {
    setNotification('Expense added successfully')
    fetchExpenses()
  }

  const handleExpenseUpdated = () => {
    setEditingExpense(null)
    setNotification('Expense updated successfully')
    fetchExpenses()
  }

  const handleCancelEdit = () => {
    setEditingExpense(null)
  }

  const filteredExpenses = useMemo(() => {
    if (selectedPeriod === 'all') return expenses
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return expenses.filter((expense) => {
      const d = new Date(expense.expense_date)
      const expDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      if (selectedPeriod === 'month') {
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      }
      if (selectedPeriod === 'week') {
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        return expDate >= weekStart && expDate <= weekEnd
      }
      return true
    })
  }, [expenses, selectedPeriod])

  const totalExpenses = filteredExpenses.reduce((sum, expense) => {
    return sum + Number(expense.amount)
  }, 0)

  const expensesByCategory = useMemo(() => {
    const byName = {}
    filteredExpenses.forEach((expense) => {
      const name = expense.category_name || 'Uncategorized'
      byName[name] = (byName[name] || 0) + Number(expense.amount)
    })
    return Object.entries(byName)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
  }, [filteredExpenses])

  const maxCategoryTotal = useMemo(() => {
    if (expensesByCategory.length === 0) return 1
    return Math.max(...expensesByCategory.map((d) => d.total))
  }, [expensesByCategory])

  const periodLabel = { all: 'All time', month: 'This month', week: 'This week' }[selectedPeriod]

  return (
    <div className="app-container">
      <header className="hero">
        <div className="hero-text">
          <h1 className="hero-title">Expense Tracker</h1>
          <p className="hero-subtitle">Track spending and see where your money goes</p>
        </div>
        <div className="hero-graphic" aria-hidden="true">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="18" width="56" height="44" rx="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.95"/>
            <path d="M12 32h56" stroke="currentColor" strokeWidth="2" opacity="0.95"/>
            <circle cx="22" cy="25" r="2.5" fill="currentColor" opacity="0.9"/>
            <circle cx="32" cy="25" r="2.5" fill="currentColor" opacity="0.6"/>
            <circle cx="42" cy="25" r="2.5" fill="currentColor" opacity="0.4"/>
            <rect x="16" y="38" width="14" height="18" rx="3" fill="currentColor" opacity="0.35"/>
            <rect x="34" y="34" width="14" height="22" rx="3" fill="currentColor" opacity="0.5"/>
            <rect x="52" y="36" width="14" height="20" rx="3" fill="currentColor" opacity="0.25"/>
          </svg>
        </div>
      </header>

      <div className="app-content">
      {notification && <p className="notification">{notification}</p>}

      <div className="period-row">
        <label htmlFor="periodFilter">Showing:</label>
        <select
          id="periodFilter"
          className="period-select"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="all">All time</option>
          <option value="month">This month</option>
          <option value="week">This week</option>
        </select>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total Expenses</span>
          <span className="stat-value">{totalExpenses.toFixed(2)}</span>
          <span className="stat-meta">{periodLabel}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Top Category</span>
          <span className="stat-value">
            {expensesByCategory.length > 0 ? expensesByCategory[0].name : '—'}
          </span>
          <span className="stat-meta">{periodLabel}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Transactions</span>
          <span className="stat-value">{filteredExpenses.length}</span>
          <span className="stat-meta">{periodLabel}</span>
        </div>
      </div>

      <section className="section-card insights-section">
        <h2>Spending by category</h2>
        <p className="section-period">{periodLabel}</p>
        {expensesByCategory.length === 0 ? (
          <p className="insights-empty">Add expenses to see your spending by category.</p>
        ) : (
          <div className="chart-bars">
            {expensesByCategory.map(({ name, total }, index) => {
              const pct = maxCategoryTotal > 0 ? (total / maxCategoryTotal) * 100 : 0
              return (
                <div key={name} className="chart-row">
                  <div className="chart-label">
                    <span className={`chart-name chart-name--${index % 6}`}>{name}</span>
                    <span className="chart-value">
                      {total.toFixed(2)} <span className="chart-pct">{pct.toFixed(0)}%</span>
                    </span>
                  </div>
                  <div className="chart-track">
                    <div
                      className={`chart-bar chart-bar--${index % 6}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="section-card">
        <h2>Transactions</h2>
        <p className="section-subtitle">View and manage your expenses.</p>
        {loadingExpenses && <p>Loading expenses...</p>}
        {expenseError && <p>Error: {expenseError}</p>}
        {!loadingCategories && !categoryError && (
          <div className="filter-row">
            <label htmlFor="categoryFilter">Filter by Category: </label>
            <select
              id="categoryFilter"
              value={selectedCategoryId}
              onChange={(event) => setSelectedCategoryId(event.target.value)}
            >
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {!loadingExpenses && !expenseError && selectedCategoryId && (
          <p className="total-expenses total-expenses--filtered">
            Filtered total: {totalExpenses.toFixed(2)} ({periodLabel})
          </p>
        )}
        {!loadingExpenses && !expenseError && filteredExpenses.length === 0 && (
          <p>No expenses in this period{selectedCategoryId ? ' for this category' : ''}.</p>
        )}
        {!loadingExpenses && !expenseError && filteredExpenses.length > 0 && (
          <div className="table-container">
            <ExpenseTable
              expenses={filteredExpenses}
              onDeleteExpense={handleDeleteExpense}
              onEditExpense={handleEditExpense}
            />
          </div>
        )}
      </section>

      <section className="section-card categories-section">
        <h2>Your categories</h2>
        <p className="section-subtitle">Used when adding expenses.</p>
        {loadingCategories && <p>Loading categories...</p>}
        {categoryError && <p>Error: {categoryError}</p>}
        {!loadingCategories && !categoryError && (
          <div className="category-list">
            {categories.map((category) => (
              <span key={category.id} className="category-tag">
                {category.name}
              </span>
            ))}
          </div>
        )}
      </section>

      <div
        ref={formSectionRef}
        className={
          editingExpense
            ? 'expense-form-section editing'
            : 'expense-form-section'
        }
      >
        {editingExpense && (
          <div className="edit-section-header">
            <span className="edit-section-label">
              Editing: {editingExpense.title}
            </span>
            <button
              type="button"
              className="cancel-editing-button"
              onClick={handleCancelEdit}
            >
              Cancel editing
            </button>
          </div>
        )}
        <h2>{editingExpense ? 'Edit expense' : 'Add expense'}</h2>
        <p className="form-section-desc">
          {editingExpense ? 'Update the details and save.' : 'Record a new expense below.'}
        </p>
        {!loadingCategories && !categoryError &&
          (editingExpense ? (
            <EditExpenseForm
              expense={editingExpense}
              categories={categories}
              onExpenseUpdated={handleExpenseUpdated}
              onCancelEdit={handleCancelEdit}
            />
          ) : (
            <AddExpenseForm
              categories={categories}
              onExpenseAdded={handleExpenseAdded}
            />
          ))}
      </div>
      </div>
    </div>
  )
}

export default App