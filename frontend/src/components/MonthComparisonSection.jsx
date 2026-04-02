import { formatCurrency } from '../utils/formatCurrency'

function MonthComparisonSection({ monthComparison }) {
  const cards = [
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
        borderRadius: '12px',
        padding: '28px 32px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
          Month Comparison
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', fontWeight: '400' }}>
          Current month vs previous month
        </p>
      </div>

      <div className="month-comparison-grid">
        {cards.map((card) => {
          const isPositive = card.change >= 0
          const statusColor = isPositive ? '#16a34a' : '#dc2626'
          const topBorderColor = isPositive ? '#16a34a' : '#dc2626'
          const changeBg = isPositive ? '#f0fdf4' : '#fef2f2'
          const arrow = isPositive ? '↑' : '↓'

          return (
            <div
              key={card.title}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderTop: `3px solid ${topBorderColor}`,
                borderRadius: '10px',
                padding: '20px 22px',
              }}
            >
              {/* Card title */}
              <span
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: '#94a3b8',
                  marginBottom: '12px',
                }}
              >
                {card.title}
              </span>

              {/* Change hero */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: changeBg,
                  borderRadius: '6px',
                  padding: '5px 10px',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: '700', color: statusColor }}>
                  {arrow}
                </span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: statusColor }}>
                  {formatCurrency(Math.abs(card.change))}
                </span>
              </div>

              {/* Current + Previous values */}
              <div style={{ display: 'grid', gap: '10px' }}>
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: '600',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      color: '#94a3b8',
                      marginBottom: '2px',
                    }}
                  >
                    Current
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>
                    {formatCurrency(card.current)}
                  </span>
                </div>

                <div>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: '600',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      color: '#94a3b8',
                      marginBottom: '2px',
                    }}
                  >
                    Previous
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', lineHeight: 1 }}>
                    {formatCurrency(card.previous)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default MonthComparisonSection
