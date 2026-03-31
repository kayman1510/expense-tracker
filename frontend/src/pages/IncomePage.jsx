import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config/api'
import '../App.css'

function IncomePage() {
  const [incomeItems, setIncomeItems] = useState([])

  const [source, setSource] = useState('')
  const [amount, setAmount] = useState('')
  const [incomeDate, setIncomeDate] = useState('')
  const [notes, setNotes] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const fetchIncome = () => {
    setLoading(true)
    setError('')

    fetch(`${API_BASE_URL}/income`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch income')
        }
        return response.json()
      })
      .then((data) => {
        setIncomeItems(data)
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchIncome()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/income`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source,
          amount: Number(amount),
          income_date: incomeDate,
          notes: notes || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create income')
      }

      setMessage('Income added successfully')
      setSource('')
      setAmount('')
      setIncomeDate('')
      setNotes('')
      fetchIncome()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleDelete = async (incomeId) => {
    const confirmed = window.confirm('Are you sure you want to delete this income entry?')
    if (!confirmed) return

    try {
      const response = await fetch(`${API_BASE_URL}/income/${incomeId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete income')
      }

      setMessage('Income deleted successfully')
      fetchIncome()
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="app-container">
      <header className="hero">
        <h1 className="hero-title">Income</h1>
        <p className="hero-subtitle">Track salary, freelance work, and other inflows</p>
      </header>

      {message && <p className="notification">{message}</p>}
      {error && <p>Error: {error}</p>}

      <section className="section-card">
        <h2>Add Income</h2>

        <form onSubmit={handleSubmit} className="form-row">
          <input
            type="text"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
          />

          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <input
            type="date"
            value={incomeDate}
            onChange={(e) => setIncomeDate(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button type="submit">Add</button>
        </form>
      </section>

      <section className="section-card">
        <h2>Income List</h2>

        {loading && <p>Loading...</p>}

        {!loading && incomeItems.length === 0 && <p>No income entries found.</p>}

        {!loading && incomeItems.length > 0 && (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {incomeItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.source}</td>
                  <td>{item.amount}</td>
                  <td>{item.income_date}</td>
                  <td>{item.notes || '—'}</td>
                  <td>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
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

export default IncomePage