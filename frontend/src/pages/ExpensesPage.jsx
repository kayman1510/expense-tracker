import { useEffect, useMemo, useRef, useState } from 'react'
import ExpenseTable from '../components/ExpenseTable'
import AddExpenseForm from '../components/AddExpenseForm'
import EditExpenseForm from '../components/EditExpenseForm'
import { API_BASE_URL } from '../config/api'
import '../App.css'

function ExpensesPage() {
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
    fetch(`${API_BASE_URL}/categories`)
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

    let url = `${API_BASE_URL}/expenses`

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
    const timer = setTimeout(() => setNotification(''), 3000)
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
      const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
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

  const handleEditExpense = (expense) => setEditingExpense(expense)

  const handleExpenseAdded = () => {
    setNotification('Expense added successfully')
    fetchExpenses()
  }

  const handleExpenseUpdated = () => {
    setEditingExpense(null)
    setNotification('Expense updated successfully')
    fetchExpenses()
  }

  const handleCancelEdit = () => setEditingExpense(null)

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

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  )

  return (
    <div className="app-container">
      <header className="hero">
        <h1 className="hero-title">Expenses</h1>
        <p className="hero-subtitle">Manage and track your spending</p>
      </header>

      {notification && <p className="notification">{notification}</p>}

      <section className="section-card">
        <h2>Transactions</h2>

        {loadingExpenses && <p>Loading expenses...</p>}
        {expenseError && <p>Error: {expenseError}</p>}

        {!loadingCategories && !categoryError && (
          <div className="filter-row">
            <label>Filter by Category: </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {!loadingExpenses && !expenseError && filteredExpenses.length === 0 && (
          <p>No expenses found.</p>
        )}

        {!loadingExpenses && !expenseError && filteredExpenses.length > 0 && (
          <ExpenseTable
            expenses={filteredExpenses}
            onDeleteExpense={handleDeleteExpense}
            onEditExpense={handleEditExpense}
          />
        )}
      </section>

      <section ref={formSectionRef} className="expense-form-section">
        <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>

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
      </section>
    </div>
  )
}

export default ExpensesPage