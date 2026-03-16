function BudgetStatusSection({ budgetStatus }) {
  return (
    <section
      style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '22px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '18px' }}>Budget Status</h3>

      {budgetStatus.length === 0 ? (
        <p>No budget status data available.</p>
      ) : (
        <div style={{ display: 'grid', gap: '14px' }}>
          {budgetStatus.map((item) => (
            <div
              key={item.category_id}
              style={{
                border: '1px solid #e9ecef',
                borderRadius: '12px',
                padding: '16px 18px',
                background: item.over_budget ? '#fff5f5' : '#f8fff9',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <h4 style={{ margin: 0 }}>{item.category_name}</h4>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    padding: '6px 10px',
                    borderRadius: '999px',
                    background: item.over_budget ? '#ffe3e3' : '#d3f9d8',
                    color: item.over_budget ? '#c92a2a' : '#2b8a3e',
                  }}
                >
                  {item.over_budget ? 'Over Budget' : 'Within Budget'}
                </span>
              </div>

              <div style={{ display: 'grid', gap: '6px', fontSize: '14px' }}>
                <p style={{ margin: 0 }}>
                  <strong>Budget:</strong> {item.budget_amount}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Actual Spent:</strong> {item.actual_spent}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Remaining:</strong> {item.remaining_amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default BudgetStatusSection