import '../App.css'

function LoginPage() {
  return (
    <>
      <style>{`
        .lp-input {
          width: 100%;
          height: 40px;
          padding: 0 12px;
          font-size: 13px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #ffffff;
          color: #1e293b;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .lp-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 130, 246, 0.12);
        }
        .lp-submit {
          width: 100%;
          padding: 10px 0;
          font-size: 14px;
          font-weight: 600;
          background: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: background 0.15s;
        }
        .lp-submit:hover {
          background: #1e293b;
        }
        .lp-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
          font-size: 13px;
        }
        .lp-link:hover {
          text-decoration: underline;
        }
        .lp-checkbox-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .lp-checkbox-label {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
          user-select: none;
        }
        .lp-checkbox-label input[type="checkbox"] {
          width: 15px;
          height: 15px;
          accent-color: #2563eb;
          cursor: pointer;
          flex-shrink: 0;
          margin: 0;
          padding: 0;
        }
        .lp-divider {
          border: none;
          border-top: 1px solid #e2e8f0;
          margin: 0;
        }
      `}</style>

      <div className="lp-layout">

        {/* ── LEFT: Form panel ──────────────────────────────────────── */}
        <div className="lp-form-panel">
          <div className="lp-form-inner">

            {/* App name */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '28px' }}>
                <div style={{
                  width: '32px', height: '32px',
                  background: '#0f172a',
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: '15px', color: '#ffffff', fontWeight: '700', lineHeight: 1 }}>E</span>
                </div>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.01em' }}>
                  Expense Tracker
                </span>
              </div>

              <h1 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.02em' }}>
                Log in to your account
              </h1>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '400' }}>
                Welcome back. Enter your details to continue.
              </p>
            </div>

            {/* Form */}
            <form style={{ display: 'flex', flexDirection: 'column', gap: '0', margin: 0 }} onSubmit={e => e.preventDefault()}>

              {/* Email */}
              <div style={{ marginBottom: '14px' }}>
                <label
                  htmlFor="lp-email"
                  style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}
                >
                  Email address
                </label>
                <input
                  id="lp-email"
                  className="lp-input"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '16px' }}>
                <label
                  htmlFor="lp-password"
                  style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}
                >
                  Password
                </label>
                <input
                  id="lp-password"
                  className="lp-input"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              {/* Remember me + Forgot password */}
              <div className="lp-checkbox-row" style={{ marginBottom: '22px' }}>
                <label className="lp-checkbox-label">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="#" className="lp-link">Forgot password?</a>
              </div>

              {/* Submit */}
              <button type="submit" className="lp-submit">
                Log in
              </button>

            </form>

            {/* Divider */}
            <hr className="lp-divider" style={{ margin: '24px 0' }} />

            {/* Sign up link */}
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
              Don't have an account?{' '}
              <a href="#" className="lp-link">Sign up</a>
            </p>

          </div>
        </div>

        {/* ── RIGHT: Branding panel ─────────────────────────────────── */}
        <div className="lp-brand-panel">

          {/* ── Floating depth layers (z-index 0) ─────────────────── */}
          {/* Large orb — top right */}
          <div style={{
            position: 'absolute', top: '-90px', right: '-90px',
            width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 65%)',
            borderRadius: '50%', filter: 'blur(48px)', pointerEvents: 'none',
          }} />
          {/* Large orb — bottom left */}
          <div style={{
            position: 'absolute', bottom: '-70px', left: '-70px',
            width: '360px', height: '360px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.28) 0%, transparent 65%)',
            borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none',
          }} />
          {/* Accent orb — mid right edge */}
          <div style={{
            position: 'absolute', top: '42%', right: '-40px',
            width: '180px', height: '180px',
            background: 'radial-gradient(circle, rgba(79,209,197,0.1) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(28px)', pointerEvents: 'none',
          }} />

          {/* ── Main content ──────────────────────────────────────── */}
          <div className="lp-brand-inner">

            {/* Eyebrow label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '20px' }}>
              <div style={{ width: '22px', height: '2px', background: '#818cf8', borderRadius: '1px', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Financial clarity
              </span>
            </div>

            {/* Headline — with soft glow behind it */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '50%', left: '-24px',
                transform: 'translateY(-50%)',
                width: '280px', height: '120px',
                background: 'radial-gradient(ellipse, rgba(129,140,248,0.14) 0%, transparent 70%)',
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }} />
              <h2 style={{ position: 'relative', margin: '0 0 20px 0', fontSize: '36px', fontWeight: '700', color: 'rgba(255,255,255,0.97)', letterSpacing: '-0.03em', lineHeight: 1.13 }}>
                Take control of<br />your finances
              </h2>
            </div>

            {/* Supporting text */}
            <p style={{ margin: '0 0 36px 0', fontSize: '15px', color: 'rgba(255,255,255,0.52)', fontWeight: '400', lineHeight: 1.65, maxWidth: '340px' }}>
              Track income, expenses, and budgets with clarity and confidence.
            </p>

            {/* ── Mock UI preview card ─────────────────────────────── */}
            <div style={{
              background: 'rgba(255,255,255,0.055)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderTop: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '18px',
              padding: '26px',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.38), 0 6px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)',
              textAlign: 'left',
              position: 'relative',
              zIndex: 1,
            }}>

              {/* Card header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px' }}>
                <div>
                  <p style={{ margin: '0 0 3px 0', fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                    Financial Overview
                  </p>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.01em' }}>
                    April 2026
                  </p>
                </div>
                <div style={{
                  padding: '4px 12px',
                  background: 'rgba(99,102,241,0.18)',
                  border: '1px solid rgba(99,102,241,0.32)',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'rgba(165,180,252,0.9)',
                  letterSpacing: '0.02em',
                }}>
                  Monthly
                </div>
              </div>

              {/* Mini stat strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '26px' }}>
                {[
                  { label: 'Income',   value: '$4,200', trend: '↑', color: '#4ade80', accent: 'rgba(74,222,128,0.22)'  },
                  { label: 'Expenses', value: '$2,750', trend: '↓', color: '#f87171', accent: 'rgba(248,113,113,0.22)' },
                  { label: 'Savings',  value: '$1,450', trend: '↑', color: '#60a5fa', accent: 'rgba(96,165,250,0.22)'  },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${stat.accent}`,
                    borderRadius: '12px',
                    padding: '13px 14px',
                  }}>
                    <p style={{ margin: '0 0 7px 0', fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {stat.label}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: stat.color, lineHeight: 1 }}>
                        {stat.value}
                      </p>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: stat.color, opacity: 0.65 }}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini category bars */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <p style={{ margin: 0, fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Top categories
                  </p>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontWeight: '500' }}>Apr 2026</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { name: 'Housing',   amt: '$1,100', pct: 88, color: '#818cf8' },
                    { name: 'Groceries', amt: '$720',   pct: 57, color: '#34d399' },
                    { name: 'Transport', amt: '$450',   pct: 36, color: '#a78bfa' },
                    { name: 'Dining',    amt: '$275',   pct: 22, color: '#fb923c' },
                  ].map(cat => (
                    <div key={cat.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                          <span style={{ fontSize: '11px', fontWeight: '500', color: 'rgba(255,255,255,0.65)' }}>
                            {cat.name}
                          </span>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.4)' }}>
                          {cat.amt}
                        </span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${cat.pct}%`, height: '100%', background: cat.color, borderRadius: '999px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
            {/* ── end mock card ─────────────────────────────────────── */}

          </div>
        </div>

      </div>
    </>
  )
}

export default LoginPage
