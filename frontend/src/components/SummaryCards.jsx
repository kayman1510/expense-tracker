function SummaryCards({ summary }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '18px',
        marginBottom: '10px'
      }}
    >
      {/* Total Income */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f6d365, #fda085)',
          borderRadius: '12px',
          padding: '20px',
          color: '#1a1a1a',
          boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}
      >
        <h4 style={{ marginBottom: '6px', opacity: 0.9 }}>Total Income</h4>
        <p style={{ fontSize: '26px', fontWeight: '600', margin: 0 }}>
          {summary.total_income}
        </p>
      </div>

      {/* Total Expenses */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
          borderRadius: '12px',
          padding: '20px',
          color: '#1a1a1a',
          boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}
      >
        <h4 style={{ marginBottom: '6px', opacity: 0.9 }}>Total Expenses</h4>
        <p style={{ fontSize: '26px', fontWeight: '600', margin: 0 }}>
          {summary.total_expenses}
        </p>
      </div>

      {/* Net Savings */}
      <div
        style={{
          background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
          borderRadius: '12px',
          padding: '20px',
          color: '#1a1a1a',
          boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}
      >
        <h4 style={{ marginBottom: '6px', opacity: 0.9 }}>Net Savings</h4>
        <p style={{ fontSize: '26px', fontWeight: '600', margin: 0 }}>
          {summary.net_savings}
        </p>
      </div>
    </div>
  )
}

export default SummaryCards