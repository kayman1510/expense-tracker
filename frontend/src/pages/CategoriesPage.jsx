import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config/api'
import '../App.css'

/* ── Style tokens (mirrors ExpensesPage) ─────────────────────────── */

const tableCardStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  minWidth: 0,
  overflow: 'hidden',
}

const panelStyle = {
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  background: '#f8fafc',
  overflow: 'hidden',
}

const thStyle = {
  padding: '9px 14px',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#64748b',
  whiteSpace: 'nowrap',
  background: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
  textAlign: 'left',
}

const tdStyle = {
  padding: '9px 14px',
  fontSize: '13px',
  color: '#334155',
  borderBottom: '1px solid #f1f5f9',
  verticalAlign: 'middle',
}

const editBtnBase = {
  padding: '3px 10px',
  fontSize: '11px',
  fontWeight: '500',
  borderRadius: '5px',
  cursor: 'pointer',
  lineHeight: '1.7',
  letterSpacing: '0.01em',
  transition: 'background 0.12s, color 0.12s',
}

/* ── Component ───────────────────────────────────────────────────── */

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [editingCategory, setEditingCategory] = useState(null)
  const [formName, setFormName]     = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError]   = useState('')
  const [notification, setNotification] = useState('')
  const [hoveredRow, setHoveredRow] = useState(null)
  const [hoveredBtn, setHoveredBtn] = useState(null)

  const fetchCategories = () => {
    setLoading(true)
    setError('')
    fetch(`${API_BASE_URL}/categories`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch categories')
        return r.json()
      })
      .then(data => {
        setCategories(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => { fetchCategories() }, [])

  useEffect(() => {
    if (!notification) return
    const t = setTimeout(() => setNotification(''), 3000)
    return () => clearTimeout(t)
  }, [notification])

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormName(category.name)
    setFormError('')
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setFormName('')
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = formName.trim()
    if (!name) { setFormError('Name is required'); return }

    setSubmitting(true)
    setFormError('')

    const url    = editingCategory
      ? `${API_BASE_URL}/categories/${editingCategory.id}`
      : `${API_BASE_URL}/categories`
    const method = editingCategory ? 'PUT' : 'POST'

    try {
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.detail || 'Request failed')

      setNotification(editingCategory ? 'Category updated' : 'Category added')
      setEditingCategory(null)
      setFormName('')
      fetchCategories()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      const r = await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' })
      const data = await r.json()
      if (!r.ok) throw new Error(data.detail || 'Failed to delete category')
      setNotification('Category deleted')
      if (editingCategory?.id === id) handleCancelEdit()
      fetchCategories()
    } catch (err) {
      setError(err.message)
    }
  }

  /* ── Button styles with hover tint ──────────────────────────────── */

  const editBtn = (id) => ({
    ...editBtnBase,
    border: '1px solid #e2e8f0',
    background: hoveredBtn === id ? '#f1f5f9' : 'transparent',
    color: '#475569',
  })

  const deleteBtn = (id) => ({
    ...editBtnBase,
    border: '1px solid #fecaca',
    background: hoveredBtn === id ? '#fff1f2' : 'transparent',
    color: '#dc2626',
  })

  /* ── Render ──────────────────────────────────────────────────────── */

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100%' }}>

      <style>{`
        .cp-panel input {
          height: 36px;
          padding: 0 10px;
          font-size: 13px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: #ffffff;
          width: 100%;
          box-sizing: border-box;
          color: #1e293b;
        }
        .cp-panel input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        }
        .cp-panel label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .cp-panel button[type="submit"] {
          width: 100%;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          background: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: background 0.15s;
          margin-top: 12px;
        }
        .cp-panel button[type="submit"]:hover {
          background: #1e293b;
        }
        .cp-panel button[type="submit"]:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
      `}</style>

      {/* ── Header band ──────────────────────────────────────────────── */}
      <div style={{
        background: '#ffffff',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        padding: '15px 36px',
      }}>
        <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.02em' }}>
          Categories
        </h1>
        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8', fontWeight: '400', letterSpacing: '0.01em' }}>
          Manage expense and budget categories
        </p>
      </div>

      {/* ── Page body ────────────────────────────────────────────────── */}
      <div style={{ padding: '24px 36px 56px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {notification && <p className="notification" style={{ margin: 0 }}>{notification}</p>}
        {error         && <p style={{ margin: 0, color: '#dc2626', fontSize: '13px' }}>Error: {error}</p>}

        {/* ── Primary workspace ────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '20px', alignItems: 'start' }}>

          {/* ── Category table — hero ─────────────────────────────── */}
          <section style={tableCardStyle}>

            <div style={{
              padding: '16px 20px 13px',
              borderBottom: '1px solid #f1f5f9',
            }}>
              <h3 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
                All Categories
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '400' }}>
                {categories.length > 0
                  ? `${categories.length} categor${categories.length !== 1 ? 'ies' : 'y'}`
                  : 'No categories yet'}
              </p>
            </div>

            {loading && (
              <p style={{ color: '#64748b', margin: 0, fontSize: '13px', padding: '16px 20px' }}>Loading...</p>
            )}
            {!loading && categories.length === 0 && (
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px', padding: '16px 20px' }}>No categories yet. Add one using the form.</p>
            )}

            {!loading && categories.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: '40px', paddingRight: '8px' }}>#</th>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Created</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat, i) => {
                      const isLast    = i === categories.length - 1
                      const isHovered = hoveredRow === cat.id
                      const rowBg = isHovered ? '#f9fafb' : i % 2 === 0 ? '#ffffff' : '#fafbfc'
                      const rowTd = { ...tdStyle, borderBottom: isLast ? 'none' : '1px solid #f1f5f9' }

                      return (
                        <tr
                          key={cat.id}
                          style={{ background: rowBg, transition: 'background 0.1s' }}
                          onMouseEnter={() => setHoveredRow(cat.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td style={{ ...rowTd, color: '#94a3b8', fontVariantNumeric: 'tabular-nums', paddingRight: '8px' }}>
                            {cat.id}
                          </td>
                          <td style={{ ...rowTd, fontWeight: '500', color: '#0f172a' }}>
                            {cat.name}
                          </td>
                          <td style={{ ...rowTd, color: '#64748b', whiteSpace: 'nowrap' }}>
                            {new Date(cat.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td style={{ ...rowTd, textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                              <button
                                style={editBtn(`${cat.id}-edit`)}
                                onMouseEnter={() => setHoveredBtn(`${cat.id}-edit`)}
                                onMouseLeave={() => setHoveredBtn(null)}
                                onClick={() => handleEdit(cat)}
                              >
                                Edit
                              </button>
                              <button
                                style={deleteBtn(`${cat.id}-delete`)}
                                onMouseEnter={() => setHoveredBtn(`${cat.id}-delete`)}
                                onMouseLeave={() => setHoveredBtn(null)}
                                onClick={() => handleDelete(cat.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </section>

          {/* ── Control panel — sticky, secondary ────────────────── */}
          <div style={{ position: 'sticky', top: '24px', minWidth: 0 }}>
            <section style={panelStyle}>

              <div style={{ padding: '13px 16px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                <h3 style={{ margin: '0 0 1px 0', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '400' }}>
                  {editingCategory ? `Editing: ${editingCategory.name}` : 'Add a new category'}
                </p>
              </div>

              <div className="cp-panel" style={{ padding: '16px', boxSizing: 'border-box' }}>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '4px' }}>
                    <label htmlFor="cat-name">Category Name</label>
                    <input
                      id="cat-name"
                      type="text"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      placeholder="e.g. Groceries"
                      disabled={submitting}
                    />
                  </div>

                  {formError && (
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#dc2626' }}>{formError}</p>
                  )}

                  <button type="submit" disabled={submitting}>
                    {submitting
                      ? (editingCategory ? 'Updating...' : 'Adding...')
                      : (editingCategory ? 'Update Category' : 'Add Category')}
                  </button>

                  {editingCategory && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      style={{
                        width: '100%',
                        marginTop: '6px',
                        padding: '7px 16px',
                        fontSize: '13px',
                        fontWeight: '500',
                        background: 'transparent',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>

            </section>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CategoriesPage
