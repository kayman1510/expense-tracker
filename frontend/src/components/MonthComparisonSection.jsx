function MonthComparisonSection({ monthComparison }) {
  const comparisonCards = [
    {
      title: 'Income',
      current: monthComparison.current_month_income,
      previous: monthComparison.previous_month_income,
      change: monthComparison.income_change,
    },
    {
      title: 'Expenses',
      current: monthComparison.current_month_expenses,
      previous: monthComparison.previous_month_expenses,
      change: monthComparison.expense_change,
    },
    {
      title: 'Savings',
      current: monthComparison.current_month_savings,
      previous: monthComparison.previous_month_savings,
      change: monthComparison.savings_change,
    },
  ]

  return (
    <section
      style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '22px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '18px' }}>Month Comparison</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}
      >
        {comparisonCards.map((card) => {
          const isPositive = card.change >= 0

          return (
            <div
              key={card.title}
              style={{
                border: '1px solid #e9ecef',
                borderRadius: '12px',
                padding: '18px',
                background: '#fafbfc',
              }}
            >
              <h4 style={{ marginTop: 0, marginBottom: '14px' }}>{card.title}</h4>

              <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                <p style={{ margin: 0 }}>
                  <strong>Current:</strong> {card.current}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Previous:</strong> {card.previous}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontWeight: '600',
                    color: isPositive ? '#2b8a3e' : '#c92a2a',
                  }}
                >
                  <strong>Change:</strong> {card.change}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default MonthComparisonSection