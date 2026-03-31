import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config/api'
import '../App.css'

function BudgetsPage() {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])

  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Fetch categories
  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  // Fetch budgets
  const fetchBudgets = () => {
    setLoading(true)
    fetch(`${API_BASE_URL}/budgets`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch budgets')
        return res.json()
      })
      .then(data => {
        setBudgets(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  // Create budget
  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: Number(categoryId),
          amount: Number(amount),
          period_month: Number(month),
          period_year: Number(year),
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || 'Failed to create budget')
      }

      setMessage('Budget created successfully')

      // reset form
      setAmount('')
      setCategoryId('')
      setMonth('')
      setYear('')

      fetchBudgets()

    } catch (err) {
      setError(err.message)
    }
  }

  // Delete budget
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return

    try {
      await fetch(`${API_BASE_URL}/budgets/${id}`, {
        method: 'DELETE',
      })
      fetchBudgets()
    } catch (err) {
      setError('Failed to delete budget')
    }
  }

  return (
    <div className="app-container">
      <header className="hero">
        <h1 className="hero-title">Budgets</h1>
        <p className="hero-subtitle">Set and track monthly limits</p>
      </header>

      {message && <p className="notification">{message}</p>}
      {error && <p>Error: {error}</p>}

      {/* Form */}
      <section className="section-card">
        <h2>Add Budget</h2>

        <form onSubmit={handleSubmit} className="form-row">

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Month (1-12)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Year (2026)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />

          <button type="submit">Add</button>
        </form>
      </section>

      {/* Table */}
      <section className="section-card">
        <h2>Budget List</h2>

        {loading && <p>Loading...</p>}

        {!loading && budgets.length === 0 && (
          <p>No budgets found</p>
        )}

        {!loading && budgets.length > 0 && (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Month</th>
                <th>Year</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map(b => (
                <tr key={b.id}>
                  <td>{b.category_name}</td>
                  <td>{b.amount}</td>
                  <td>{b.period_month}</td>
                  <td>{b.period_year}</td>
                  <td>
                    <button onClick={() => handleDelete(b.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

export default BudgetsPage