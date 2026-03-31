const BAR_COLORS = [
  '#2563eb',
  '#0d9488',
  '#7c3aed',
  '#ea580c',
  '#059669',
  '#be185d',
]

function CategorySpendingSection({ categorySpending }) {
  const totalSpent = categorySpending.reduce((sum, item) => sum + item.total_spent, 0)

  const maxSpent =
    categorySpending.length > 0
      ? Math.max(...categorySpending.map((item) => item.total_spent))
      : 1

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
          Category Spending
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', fontWeight: '400' }}>
          Breakdown by category for the selected period
        </p>
      </div>

      {categorySpending.length === 0 ? (
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
          No spending data available for this period.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {categorySpending.map((item, index) => {
            const widthPercent = (item.total_spent / maxSpent) * 100
            const sharePercent = totalSpent > 0
              ? ((item.total_spent / totalSpent) * 100).toFixed(1)
              : '0.0'
            const color = BAR_COLORS[index % BAR_COLORS.length]

            return (
              <div key={item.category_id}>
                {/* Label row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e293b',
                    }}
                  >
                    {item.category_name}
                  </span>
                  <span style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                      {item.total_spent}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#94a3b8' }}>
                      {sharePercent}%
                    </span>
                  </span>
                </div>

                {/* Bar track */}
                <div
                  style={{
                    width: '100%',
                    height: '10px',
                    background: '#f1f5f9',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${widthPercent}%`,
                      height: '100%',
                      borderRadius: '999px',
                      background: color,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default CategorySpendingSection
