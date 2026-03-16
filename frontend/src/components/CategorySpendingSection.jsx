function CategorySpendingSection({ categorySpending }) {
  const maxSpent =
    categorySpending.length > 0
      ? Math.max(...categorySpending.map((item) => item.total_spent))
      : 1

  return (
    <section
      style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '22px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '18px' }}>Category Spending</h3>

      {categorySpending.length === 0 ? (
        <p>No category spending data available.</p>
      ) : (
        <div style={{ display: 'grid', gap: '14px' }}>
          {categorySpending.map((item, index) => {
            const widthPercent = (item.total_spent / maxSpent) * 100

            return (
              <div key={item.category_id}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  <span>{item.category_name}</span>
                  <span>{item.total_spent}</span>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '12px',
                    background: '#f1f3f5',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${widthPercent}%`,
                      height: '100%',
                      borderRadius: '999px',
                      background:
                        index % 3 === 0
                          ? 'linear-gradient(135deg, #f6d365, #fda085)'
                          : index % 3 === 1
                          ? 'linear-gradient(135deg, #84fab0, #8fd3f4)'
                          : 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
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