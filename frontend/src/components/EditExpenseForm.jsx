import { useEffect, useState } from 'react'

function EditExpenseForm({ expense, categories, onExpenseUpdated, onCancelEdit }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [expenseDate, setExpenseDate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (expense) {
      setTitle(expense.title)
      setAmount(expense.amount)
      setExpenseDate(expense.expense_date)
      setCategoryId(expense.category_id)
    }
  }, [expense])

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSubmitting(true)

    const updatedExpense = {
      title: title,
      amount: parseFloat(amount),
      expense_date: expenseDate,
      category_id: parseInt(categoryId),
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/expenses/${expense.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExpense),
      })

      if (!response.ok) {
        throw new Error('Failed to update expense')
      }

      onExpenseUpdated()
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!expense) {
    return null
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label>Title:</label>
            <input
              type="text"
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

        <div className="form-actions action-buttons">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Expense'}
          </button>
          <button type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        </div>
      </form>

      {error && <p>Error: {error}</p>}
    </div>
  )
}

export default EditExpenseForm