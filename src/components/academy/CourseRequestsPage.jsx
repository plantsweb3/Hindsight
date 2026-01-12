import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function CourseRequestsPage() {
  const { isAuthenticated, token } = useAuth()
  const [requests, setRequests] = useState([])
  const [userVotes, setUserVotes] = useState(() => {
    try {
      const saved = localStorage.getItem('courseRequestVotes')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isVoting, setIsVoting] = useState(false)
  const [sortBy, setSortBy] = useState('votes') // 'votes' or 'recent'

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/academy/course-requests/all')
      if (res.ok) {
        const data = await res.json()
        setRequests(data.requests || [])
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (requestId) => {
    if (!isAuthenticated) {
      return // Could show auth modal here
    }
    if (userVotes.includes(requestId) || isVoting) return

    setIsVoting(true)
    try {
      const res = await fetch(`/api/academy/course-requests/${requestId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      })

      if (res.ok) {
        const newVotes = [...userVotes, requestId]
        setUserVotes(newVotes)
        localStorage.setItem('courseRequestVotes', JSON.stringify(newVotes))
        // Update local count
        setRequests(prev => prev.map(r =>
          r.id === requestId ? { ...r, votes: r.votes + 1 } : r
        ))
      }
    } catch (err) {
      console.error('Failed to vote:', err)
    } finally {
      setIsVoting(false)
    }
  }

  const sortedRequests = [...requests].sort((a, b) => {
    if (sortBy === 'votes') {
      return b.votes - a.votes
    }
    return new Date(b.created_at) - new Date(a.created_at)
  })

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getExperienceLabel = (level) => {
    const labels = {
      'beginner': 'Beginner',
      'basics': 'Knows basics',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced'
    }
    return labels[level] || level
  }

  return (
    <div className="course-requests-page">
      <div className="course-requests-container">
        {/* Header */}
        <div className="course-requests-header">
          <Link to="/academy" className="course-requests-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Academy
          </Link>

          <div className="course-requests-title-section">
            <h1>
              <span className="course-requests-icon">🗳️</span>
              Course Requests
            </h1>
            <p>Vote on topics you want us to create courses for</p>
          </div>

          <div className="course-requests-controls">
            <div className="course-requests-sort">
              <span>Sort by:</span>
              <button
                className={`sort-btn ${sortBy === 'votes' ? 'active' : ''}`}
                onClick={() => setSortBy('votes')}
              >
                Most Votes
              </button>
              <button
                className={`sort-btn ${sortBy === 'recent' ? 'active' : ''}`}
                onClick={() => setSortBy('recent')}
              >
                Recent
              </button>
            </div>
          </div>
        </div>

        {/* Auth Notice */}
        {!isAuthenticated && (
          <div className="course-requests-auth-notice">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span>Sign in to vote on course requests</span>
          </div>
        )}

        {/* Requests List */}
        {isLoading ? (
          <div className="course-requests-loading">
            <div className="spinner" />
            <p>Loading requests...</p>
          </div>
        ) : sortedRequests.length === 0 ? (
          <div className="course-requests-empty">
            <span className="empty-icon">📭</span>
            <h3>No requests yet</h3>
            <p>Be the first to suggest a course topic!</p>
            <Link to="/academy" className="empty-cta">
              Submit a Request
            </Link>
          </div>
        ) : (
          <div className="course-requests-list">
            {sortedRequests.map((request, index) => {
              const hasVoted = userVotes.includes(request.id)
              const isTopThree = index < 3 && sortBy === 'votes'

              return (
                <div
                  key={request.id}
                  className={`course-request-card ${isTopThree ? 'top-request' : ''}`}
                >
                  {isTopThree && (
                    <span className="request-rank">#{index + 1}</span>
                  )}

                  <div className="request-content">
                    <h3 className="request-topic">{request.topic}</h3>
                    {request.reason && (
                      <p className="request-reason">{request.reason}</p>
                    )}
                    <div className="request-meta">
                      <span className="request-level">
                        {getExperienceLabel(request.experience_level)}
                      </span>
                      <span className="request-date">
                        {formatDate(request.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="request-vote-section">
                    <button
                      className={`vote-btn ${hasVoted ? 'voted' : ''}`}
                      onClick={() => handleVote(request.id)}
                      disabled={!isAuthenticated || hasVoted || isVoting}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={hasVoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                    </button>
                    <span className="vote-count">{request.votes}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Stats */}
        {requests.length > 0 && (
          <div className="course-requests-stats">
            <div className="stat">
              <span className="stat-value">{requests.length}</span>
              <span className="stat-label">Total Requests</span>
            </div>
            <div className="stat">
              <span className="stat-value">{requests.reduce((sum, r) => sum + r.votes, 0)}</span>
              <span className="stat-label">Total Votes</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
