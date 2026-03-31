import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config/api'
import '../App.css'

const sectionStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '28px 32px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
}

const sectionHeadingStyle = {
  margin: '0 0 20px 0',
  fontSize: '16px',
  fontWeight: '600',
  color: '#0f172a',
}

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

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

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

  useEffect(() => { fetchBudgets() }, [])

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
      setAmount('')
      setCategoryId('')
      setMonth('')
      setYear('')
      fetchBudgets()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return

    try {
      await fetch(`${API_BASE_URL}/budgets/${id}`, { method: 'DELETE' })
      fetchBudgets()
    } catch (err) {
      setError('Failed to delete budget')
    }
  }

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100%' }}>

      {/* Dark header band */}
      <div style={{ background: '#0f172a', padding: '20px 36px' }}>
        <h1 style={{ margin: '0 0 3px 0', fontSize: '20px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.01em' }}>
          Budgets
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.38)', fontWeight: '400' }}>
          Set and track monthly spending limits
        </p>
      </div>

      {/* Content area */}
      <div style={{ padding: '32px 36px 48px', display: 'grid', gap: '24px' }}>

        {message && <p className="notification">{message}</p>}
        {error && <p style={{ margin: 0, color: '#dc2626', fontSize: '14px' }}>Error: {error}</p>}

        {/* Add budget form */}
        <section style={sectionStyle}>
          <h3 style={sectionHeadingStyle}>Add Budget</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label>Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Month (1–12)</label>
                <input
                  type="number"
                  placeholder="e.g. 3"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Year</label>
                <input
                  type="number"
                  placeholder="e.g. 2026"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit">Add Budget</button>
            </div>
          </form>
        </section>

        {/* Budget list */}
        <section style={sectionStyle}>
          <h3 style={sectionHeadingStyle}>Budget List</h3>

          {loading && <p style={{ color: '#64748b' }}>Loading...</p>}

          {!loading && budgets.length === 0 && (
            <p style={{ color: '#94a3b8', margin: 0 }}>No budgets found.</p>
          )}

          {!loading && budgets.length > 0 && (
            <div className="table-container">
              <table>
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
                        <button className="delete-button" onClick={() => handleDelete(b.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

export default BudgetsPage
