import { useState } from 'react'

function AddExpenseForm({ categories, onExpenseAdded }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [expenseDate, setExpenseDate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSubmitting(true)

    const expenseData = {
      title: title,
      amount: parseFloat(amount),
      expense_date: expenseDate,
      category_id: parseInt(categoryId),
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      })

      if (!response.ok) {
        throw new Error('Failed to add expense')
      }

      onExpenseAdded()

      setTitle('')
      setAmount('')
      setExpenseDate('')
      setCategoryId('')
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label>Title:</label>
            <input
              type="text"
              placeholder="Enter expense title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div>
            <label>Amount:</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
          </div>

          <div>
            <label>Expense Date:</label>
            <input
              type="date"
              value={expenseDate}
              onChange={(event) => setExpenseDate(event.target.value)}
              required
            />
          </div>

          <div>
            <label>Category:</label>
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </form>

      {error && <p>{error}</p>}
    </div>
  )
}

export default AddExpenseForm