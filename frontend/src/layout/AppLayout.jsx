import { NavLink, Outlet } from 'react-router-dom'

function AppLayout() {
  const getNavLinkStyle = ({ isActive }) => {
    return {
      padding: '10px 16px',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: '600',
      color: isActive ? '#ffffff' : '#1f2937',
      backgroundColor: isActive ? '#2563eb' : '#e5e7eb',
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <header
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '24px' }}>Expense Tracker</h1>
      </header>

      <nav
        style={{
          display: 'flex',
          gap: '12px',
          padding: '16px 24px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <NavLink to="/" end style={getNavLinkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/expenses" style={getNavLinkStyle}>
          Expenses
        </NavLink>
        <NavLink to="/budgets" style={getNavLinkStyle}>
          Budgets
        </NavLink>
        <NavLink to="/income" style={getNavLinkStyle}>
          Income
        </NavLink>
      </nav>

      <main style={{ padding: '24px' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout