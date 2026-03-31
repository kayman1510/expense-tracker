import { NavLink, Outlet } from 'react-router-dom'

function AppLayout() {
  const getNavLinkStyle = ({ isActive }) => ({
    padding: '6px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: isActive ? '600' : '400',
    color: isActive ? '#f1f5f9' : 'rgba(255,255,255,0.42)',
    backgroundColor: isActive ? 'rgba(255,255,255,0.09)' : 'transparent',
    letterSpacing: isActive ? '0' : '0.01em',
    transition: 'color 0.15s, background-color 0.15s',
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>

      {/* Top navigation bar */}
      <div
        style={{
          background: '#0f172a',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '48px',
        }}
      >
        {/* Brand */}
        <span
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#f1f5f9',
            letterSpacing: '-0.01em',
          }}
        >
          Expense Tracker
        </span>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: '2px' }}>
          <NavLink to="/" end style={getNavLinkStyle}>Dashboard</NavLink>
          <NavLink to="/expenses" style={getNavLinkStyle}>Expenses</NavLink>
          <NavLink to="/budgets" style={getNavLinkStyle}>Budgets</NavLink>
          <NavLink to="/income" style={getNavLinkStyle}>Income</NavLink>
        </nav>
      </div>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
