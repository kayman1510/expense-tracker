import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function AppLayout() {
  const [hoveredNav, setHoveredNav] = useState(null)

  // Curried: getNavLinkStyle(id) returns the function NavLink expects
  const getNavLinkStyle = (id) => ({ isActive }) => ({
    padding: '6px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: isActive ? '600' : '400',
    color: isActive
      ? '#ffffff'
      : hoveredNav === id ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.42)',
    backgroundColor: isActive
      ? 'rgba(255,255,255,0.12)'
      : hoveredNav === id ? 'rgba(255,255,255,0.06)' : 'transparent',
    transition: 'color 0.15s, background-color 0.15s',
  })

  const navLinks = [
    { to: '/',         label: 'Dashboard', id: 'dashboard', end: true },
    { to: '/expenses', label: 'Expenses',  id: 'expenses' },
    { to: '/budgets',  label: 'Budgets',   id: 'budgets'  },
    { to: '/income',   label: 'Income',    id: 'income'   },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>

      {/* Top navigation bar */}
      <div style={{
        background: '#0f172a',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '48px',
      }}>

        {/* Brand wordmark — "Expense" white 700, "Tracker" blue 700 */}
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '4px', letterSpacing: '-0.02em' }}>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9' }}>Expense</span>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6' }}>Tracker</span>
        </span>

        {/* Nav links with hover */}
        <nav style={{ display: 'flex', gap: '2px' }}>
          {navLinks.map(({ to, label, id, end }) => (
            <NavLink
              key={id}
              to={to}
              end={end}
              style={getNavLinkStyle(id)}
              onMouseEnter={() => setHoveredNav(id)}
              onMouseLeave={() => setHoveredNav(null)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

      </div>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
