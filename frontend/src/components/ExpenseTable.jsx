function ExpenseTable({ expenses, onDeleteExpense, onEditExpense }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th className="amount-column">Amount</th>
          <th>Expense Date</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td>{expense.id}</td>
            <td>{expense.title}</td>
            <td className="amount-column">{Number(expense.amount).toFixed(2)}</td>
            <td>{expense.expense_date}</td>
            <td>{expense.category_name}</td>

            <td>
              <div className="action-buttons">
                <button onClick={() => onEditExpense(expense)}>
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() => onDeleteExpense(expense.id)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ExpenseTable