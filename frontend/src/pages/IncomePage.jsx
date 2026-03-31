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
        if (!response.ok) throw new Error('Failed to fetch income')
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

  useEffect(() => { fetchIncome() }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/income`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          amount: Number(amount),
          income_date: incomeDate,
          notes: notes || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to create income')

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
      const response = await fetch(`${API_BASE_URL}/income/${incomeId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete income')
      setMessage('Income deleted successfully')
      fetchIncome()
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100%' }}>

      {/* Dark header band */}
      <div style={{ background: '#0f172a', padding: '20px 36px' }}>
        <h1 style={{ margin: '0 0 3px 0', fontSize: '20px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.01em' }}>
          Income
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.38)', fontWeight: '400' }}>
          Track salary, freelance work, and other inflows
        </p>
      </div>

      {/* Content area */}
      <div style={{ padding: '32px 36px 48px', display: 'grid', gap: '24px' }}>

        {message && <p className="notification">{message}</p>}
        {error && <p style={{ margin: 0, color: '#dc2626', fontSize: '14px' }}>Error: {error}</p>}

        {/* Add income form */}
        <section style={sectionStyle}>
          <h3 style={sectionHeadingStyle}>Add Income</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label>Source</label>
                <input
                  type="text"
                  placeholder="e.g. Salary, Freelance"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Date</label>
                <input
                  type="date"
                  value={incomeDate}
                  onChange={(e) => setIncomeDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Notes (optional)</label>
                <input
                  type="text"
                  placeholder="Any additional notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit">Add Income</button>
            </div>
          </form>
        </section>

        {/* Income list */}
        <section style={sectionStyle}>
          <h3 style={sectionHeadingStyle}>Income List</h3>

          {loading && <p style={{ color: '#64748b' }}>Loading...</p>}

          {!loading && incomeItems.length === 0 && (
            <p style={{ color: '#94a3b8', margin: 0 }}>No income entries found.</p>
          )}

          {!loading && incomeItems.length > 0 && (
            <div className="table-container">
              <table>
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
                        <button className="delete-button" onClick={() => handleDelete(item.id)}>
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

export default IncomePage
