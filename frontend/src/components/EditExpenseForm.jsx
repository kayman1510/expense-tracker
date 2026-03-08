import { useEffect, useState } from 'react'

function EditExpenseForm({ expense, categories, onExpenseUpdated, onCancelEdit }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [expenseDate, setExpenseDate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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

    setMessage('')
    setError('')

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

      setMessage('Expense updated successfully')
      onExpenseUpdated()
    } catch (error) {
      setError(error.message)
    }
  }

  if (!expense) {
    return null
  }

  return (
    <div>
      

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div>
          <label>Amount:</label>
          <br />
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
          <br />
          <input
            type="date"
            value={expenseDate}
            onChange={(event) => setExpenseDate(event.target.value)}
            required
          />
        </div>

        <div>
          <label>Category:</label>
          <br />
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

        <br />
        <button type="submit">Update Expense</button>
        <button type="button" onClick={onCancelEdit}>
          Cancel
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  )
}

export default EditExpenseForm