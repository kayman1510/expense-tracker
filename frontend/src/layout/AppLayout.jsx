import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function AppLayout() {
  const [hoveredNav, setHoveredNav] = useState(null)

  const getNavLinkStyle = (id) => ({ isActive }) => ({
    padding: '6px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: isActive ? '600' : '400',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    color: isActive
      ? '#ffffff'
      : hoveredNav === id ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.42)',
    backgroundColor: isActive
      ? 'rgba(255,255,255,0.12)'
      : hoveredNav === id ? 'rgba(255,255,255,0.06)' : 'transparent',
    transition: 'color 0.15s, background-color 0.15s',
  })

  const navLinks = [
    { to: '/',            label: 'Dashboard',  id: 'dashboard',  end: true },
    { to: '/expenses',    label: 'Expenses',   id: 'expenses'  },
    { to: '/categories',  label: 'Categories', id: 'categories' },
    { to: '/budgets',     label: 'Budgets',    id: 'budgets'   },
    { to: '/income',      label: 'Income',     id: 'income'    },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>

      {/*
        [CHANGED] Responsive nav styles:
        - Desktop: single row, 48px height, 36px horizontal padding
        - <=640px: column layout, brand on first row, nav on second row,
          reduced padding, auto height
      */}
      <style>{`
        .app-nav-bar {
          padding: 0 36px;
          height: 48px;
          flex-direction: row;
          align-items: center;
        }
        .app-nav-bar .app-nav-links {
          width: auto;
        }
        @media (max-width: 640px) {
          .app-nav-bar {
            padding: 10px 16px;
            height: auto;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
          .app-nav-bar .app-nav-links {
            width: 100%;
          }
        }
      `}</style>

      {/* Top navigation bar */}
      <div className="app-nav-bar" style={{
        background: '#0f172a',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '8px',
      }}>

        {/* Brand wordmark */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: '4px',
          letterSpacing: '-0.02em',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9' }}>Expense</span>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6' }}>Tracker</span>
        </span>

        {/* Nav links */}
        <nav className="app-nav-links" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2px',
        }}>
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
