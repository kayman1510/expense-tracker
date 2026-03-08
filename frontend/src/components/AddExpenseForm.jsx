import { useState } from 'react'

function AddExpenseForm({ categories, onExpenseAdded }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [expenseDate, setExpenseDate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

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
    }
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
        <button type="submit">Add Expense</button>
      </form>

      {error && <p>Error: {error}</p>}
    </div>
  )
}

export default AddExpenseForm