import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

// Header with back button
function AdminHeader({ onBack }) {
  return (
    <header className="admin-header">
      <button onClick={onBack} className="admin-back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <div className="admin-header-title">
        <img src="/hindsightlogo.png" alt="Hindsight" className="admin-logo" />
        <span>Admin Panel</span>
      </div>
    </header>
  )
}

// Status badge component
function StatusBadge({ status }) {
  const statusColors = {
    new: 'status-new',
    reviewing: 'status-reviewing',
    resolved: 'status-resolved',
  }

  return (
    <span className={`status-badge ${statusColors[status] || 'status-new'}`}>
      {status || 'new'}
    </span>
  )
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Truncate text
function truncate(text, maxLength = 100) {
  if (!text) return '-'
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const ADMIN_PASSWORD = 'DeusVult777!'

export default function Admin({ onBack, isHiddenRoute = false }) {
  const { token } = useAuth()
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [filter, setFilter] = useState('all')
  const [passwordInput, setPasswordInput] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(!isHiddenRoute) // Already unlocked if not hidden route
  const [passwordError, setPasswordError] = useState('')

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) {
      setIsUnlocked(true)
      setPasswordError('')
      // Fetch reports immediately after unlocking
      setIsLoading(true)
      try {
        const response = await fetch('/api/admin/bugs', {
          headers: { 'X-Admin-Password': ADMIN_PASSWORD }
        })
        if (response.ok) {
          const data = await response.json()
          setReports(data.reports || [])
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err)
      } finally {
        setIsLoading(false)
      }
    } else {
      setPasswordError('Incorrect password')
      setPasswordInput('')
    }
  }

  useEffect(() => {
    // Fetch when: logged in with token, OR hidden route is unlocked
    if (token || (isHiddenRoute && isUnlocked)) {
      fetchReports()
    }
  }, [token, isUnlocked, isHiddenRoute])

  const fetchReports = async () => {
    // For hidden route, use password auth; otherwise use token
    if (!token && !isUnlocked) return

    setIsLoading(true)
    setError('')

    try {
      const headers = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      } else if (isHiddenRoute && isUnlocked) {
        headers['X-Admin-Password'] = ADMIN_PASSWORD
      }

      const response = await fetch('/api/admin/bugs', { headers })

      if (!response.ok) {
        throw new Error('Failed to fetch reports')
      }

      const data = await response.json()
      setReports(data.reports || [])
    } catch (err) {
      console.error('Failed to fetch bug reports:', err)
      setError('Failed to load bug reports')
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (reportId, newStatus) => {
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      } else if (isHiddenRoute && isUnlocked) {
        headers['X-Admin-Password'] = ADMIN_PASSWORD
      }

      const response = await fetch('/api/admin/bugs', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ id: reportId, status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      // Update local state
      setReports(reports.map(r =>
        r.id === reportId ? { ...r, status: newStatus } : r
      ))

      // Update selected report if it's the one being changed
      if (selectedReport?.id === reportId) {
        setSelectedReport({ ...selectedReport, status: newStatus })
      }
    } catch (err) {
      console.error('Failed to update status:', err)
      setError('Failed to update status')
    }
  }

  const filteredReports = filter === 'all'
    ? reports
    : reports.filter(r => (r.status || 'new') === filter)

  const counts = {
    all: reports.length,
    new: reports.filter(r => !r.status || r.status === 'new').length,
    reviewing: reports.filter(r => r.status === 'reviewing').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  }

  // Password gate for hidden route
  if (!isUnlocked) {
    return (
      <div className="admin-page">
        <AdminHeader onBack={onBack} />
        <main className="admin-content">
          <div className="admin-password-gate">
            <div className="password-card glass-card">
              <div className="password-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2 className="password-title">Admin Access Required</h2>
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  className="password-input"
                  autoFocus
                />
                {passwordError && (
                  <div className="password-error">{passwordError}</div>
                )}
                <button type="submit" className="password-submit">
                  Unlock
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <AdminHeader onBack={onBack} />

      <main className="admin-content">
        <div className="admin-section">
          <div className="admin-section-header">
            <h1 className="admin-title">Bug Reports</h1>
            <button onClick={fetchReports} className="admin-refresh-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh
            </button>
          </div>

          {/* Filter tabs */}
          <div className="admin-filters">
            {['all', 'new', 'reviewing', 'resolved'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`admin-filter-btn ${filter === f ? 'active' : ''}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="filter-count">{counts[f]}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="admin-loading">
              <div className="spinner" />
              Loading reports...
            </div>
          ) : error ? (
            <div className="admin-error">{error}</div>
          ) : filteredReports.length === 0 ? (
            <div className="admin-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="2" />
                <path d="M9 12h6M9 16h6" />
              </svg>
              <p>No {filter === 'all' ? '' : filter} bug reports</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Email</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map(report => (
                    <tr key={report.id}>
                      <td className="col-id">#{report.id}</td>
                      <td className="col-date">{formatDate(report.created_at)}</td>
                      <td className="col-email">{report.email || '-'}</td>
                      <td className="col-desc">{truncate(report.description, 60)}</td>
                      <td className="col-status"><StatusBadge status={report.status} /></td>
                      <td className="col-actions">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="admin-view-btn"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="admin-modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Bug Report #{selectedReport.id}</h2>
              <button onClick={() => setSelectedReport(null)} className="admin-modal-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="admin-modal-content">
              <div className="admin-detail-row">
                <span className="detail-label">Status:</span>
                <StatusBadge status={selectedReport.status} />
              </div>
              <div className="admin-detail-row">
                <span className="detail-label">Submitted:</span>
                <span>{formatDate(selectedReport.created_at)}</span>
              </div>
              <div className="admin-detail-row">
                <span className="detail-label">Email:</span>
                <span>{selectedReport.email || 'Not provided'}</span>
              </div>
              <div className="admin-detail-row">
                <span className="detail-label">User Agent:</span>
                <span className="detail-ua">{selectedReport.user_agent || 'Not captured'}</span>
              </div>
              <div className="admin-detail-section">
                <span className="detail-label">Description:</span>
                <p className="detail-text">{selectedReport.description}</p>
              </div>
              {selectedReport.steps && (
                <div className="admin-detail-section">
                  <span className="detail-label">Steps to Reproduce:</span>
                  <p className="detail-text">{selectedReport.steps}</p>
                </div>
              )}
              {/* Status Actions */}
              <div className="admin-status-actions">
                <span className="detail-label">Change Status:</span>
                <div className="status-buttons">
                  <button
                    onClick={() => updateStatus(selectedReport.id, 'new')}
                    className={`status-btn status-btn-new ${(selectedReport.status || 'new') === 'new' ? 'active' : ''}`}
                    disabled={(selectedReport.status || 'new') === 'new'}
                  >
                    New
                  </button>
                  <button
                    onClick={() => updateStatus(selectedReport.id, 'reviewing')}
                    className={`status-btn status-btn-reviewing ${selectedReport.status === 'reviewing' ? 'active' : ''}`}
                    disabled={selectedReport.status === 'reviewing'}
                  >
                    Reviewing
                  </button>
                  <button
                    onClick={() => updateStatus(selectedReport.id, 'resolved')}
                    className={`status-btn status-btn-resolved ${selectedReport.status === 'resolved' ? 'active' : ''}`}
                    disabled={selectedReport.status === 'resolved'}
                  >
                    Resolved
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
