import { formatCurrency } from '../utils/formatCurrency'

function SummaryCards({ summary }) {
  const cards = [
    {
      label: 'Total Income',
      value: summary.total_income,
      accent: '#16a34a',
      icon: '↑',
      iconColor: '#16a34a',
    },
    {
      label: 'Total Expenses',
      value: summary.total_expenses,
      accent: '#dc2626',
      icon: '↓',
      iconColor: '#dc2626',
    },
    {
      label: 'Net Savings',
      value: summary.net_savings,
      accent: '#2563eb',
      icon: '◈',
      iconColor: '#2563eb',
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
      }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '28px 24px',
            borderLeft: `4px solid ${card.accent}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#94a3b8',
            }}
          >
            {card.label}
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '10px',
            }}
          >
            <span
              style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#0f172a',
                lineHeight: 1,
              }}
            >
              {formatCurrency(card.value)}
            </span>
            <span
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: card.iconColor,
                lineHeight: 1,
              }}
            >
              {card.icon}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards
