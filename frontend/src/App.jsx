import { useEffect, useState } from 'react'
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

  const totalExpenses = expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount)
  }, 0)

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Expense Tracker</h1>
        <p className="app-subtitle">React + FastAPI Full Stack App</p>
      </div>

      <h2>Categories</h2>

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

      {notification && <p className="notification">{notification}</p>}

      <div
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
      </div>

      <h2>Expenses</h2>

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

      {!loadingExpenses && !expenseError && (
        <p className="total-expenses">
          Total Expenses: {totalExpenses.toFixed(2)}
        </p>
      )}

      {!loadingExpenses && !expenseError && expenses.length === 0 && (
        <p>No expenses found for this category.</p>
      )}

      {!loadingExpenses && !expenseError && expenses.length > 0 && (
        <ExpenseTable
          expenses={expenses}
          onDeleteExpense={handleDeleteExpense}
          onEditExpense={handleEditExpense}
        />
      )}
    </div>
  )
}

export default App