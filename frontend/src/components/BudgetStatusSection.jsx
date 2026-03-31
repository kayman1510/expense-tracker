function BudgetStatusSection({ budgetStatus }) {
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
          Budget Status
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', fontWeight: '400' }}>
          Spend against budget for the selected period
        </p>
      </div>

      {budgetStatus.length === 0 ? (
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
          No budget data available for this period.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '14px' }}>
          {budgetStatus.map((item) => {
            const fillPercent = item.budget_amount > 0
              ? Math.min((item.actual_spent / item.budget_amount) * 100, 100)
              : 0
            const statusColor = item.over_budget ? '#dc2626' : '#16a34a'
            const statusBg = item.over_budget ? '#fef2f2' : '#f0fdf4'
            const barColor = item.over_budget ? '#dc2626' : '#16a34a'

            return (
              <div
                key={item.category_id}
                style={{
                  borderRadius: '10px',
                  padding: '16px 20px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderLeft: `4px solid ${statusColor}`,
                }}
              >
                {/* Top row: name left, badge right */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                    {item.category_name}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: statusBg,
                      color: statusColor,
                    }}
                  >
                    {item.over_budget ? 'Over Budget' : 'Within Budget'}
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    background: '#f1f5f9',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: `${fillPercent}%`,
                      height: '100%',
                      borderRadius: '999px',
                      background: barColor,
                    }}
                  />
                </div>

                {/* Stat strip: Budget | Spent | Remaining */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                  }}
                >
                  {[
                    { label: 'Budget', value: item.budget_amount },
                    { label: 'Spent', value: item.actual_spent },
                    { label: 'Remaining', value: item.remaining_amount },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '10px',
                          fontWeight: '600',
                          letterSpacing: '0.07em',
                          textTransform: 'uppercase',
                          color: '#94a3b8',
                          marginBottom: '3px',
                        }}
                      >
                        {stat.label}
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1e293b',
                        }}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default BudgetStatusSection
