import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { fetchLeaderboard, syncXpToServer } from '../../services/achievements'
import { getLevelInfo } from '../../config/xpConfig'

function RippleBackground() {
  return (
    <div className="ripple-background">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="ripple-ring"
          style={{ '--ring-index': i, '--ring-delay': `${i * 0.8}s` }}
        />
      ))}
    </div>
  )
}

export default function LeaderboardPage() {
  const { token, user } = useAuth()
  const [leaderboardData, setLeaderboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadLeaderboard()
  }, [token])

  const loadLeaderboard = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Sync local XP to server first
      if (token) {
        await syncXpToServer(token)
      }

      // Fetch top 50 for the full leaderboard page
      const data = await fetchLeaderboard(token, 50)
      if (data) {
        setLeaderboardData(data)
      } else {
        setError('Failed to load leaderboard')
      }
    } catch (err) {
      setError('Failed to load leaderboard')
    } finally {
      setIsLoading(false)
    }
  }

  const userLevelInfo = user ? getLevelInfo(leaderboardData?.userRank?.totalXp || 0) : null

  return (
    <div className="leaderboard-page">
      <RippleBackground />

      {/* Header */}
      <header className="leaderboard-page-header">
        <div className="leaderboard-page-header-left">
          <Link to="/academy" className="leaderboard-back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Academy
          </Link>
        </div>
        <div className="leaderboard-page-title">
          <span className="leaderboard-page-icon">🏆</span>
          <h1>XP Leaderboard</h1>
        </div>
        <div className="leaderboard-page-header-right">
          <button className="leaderboard-refresh-btn" onClick={loadLeaderboard} disabled={isLoading}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Refresh
          </button>
        </div>
      </header>

      <main className="leaderboard-page-content">
        {/* User's rank card */}
        {leaderboardData?.userRank && (
          <div className="leaderboard-your-rank glass-card">
            <div className="your-rank-position">
              <span className="your-rank-number">#{leaderboardData.userRank.rank}</span>
              <span className="your-rank-percentile">Top {leaderboardData.userRank.percentile}%</span>
            </div>
            <div className="your-rank-info">
              <span className="your-rank-name">{user?.username || 'You'}</span>
              <span className="your-rank-level">Level {userLevelInfo?.level || 1} - {userLevelInfo?.title || 'Newcomer'}</span>
            </div>
            <div className="your-rank-xp">
              <span className="your-rank-xp-value">{leaderboardData.userRank.totalXp.toLocaleString()}</span>
              <span className="your-rank-xp-label">XP</span>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="leaderboard-loading-state glass-card">
            <div className="spinner" />
            <p>Loading leaderboard...</p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="leaderboard-error-state glass-card">
            <p>{error}</p>
            <button onClick={loadLeaderboard}>Try Again</button>
          </div>
        )}

        {/* Leaderboard table */}
        {!isLoading && !error && leaderboardData && (
          <div className="leaderboard-table glass-card">
            <div className="leaderboard-table-header">
              <span className="col-rank">Rank</span>
              <span className="col-user">Trader</span>
              <span className="col-level">Level</span>
              <span className="col-xp">XP</span>
              <span className="col-streak">Streak</span>
            </div>
            <div className="leaderboard-table-body">
              {leaderboardData.leaderboard.length === 0 ? (
                <div className="leaderboard-empty-state">
                  <p>No rankings yet</p>
                  <p className="hint">Be the first to earn XP!</p>
                </div>
              ) : (
                leaderboardData.leaderboard.map((entry) => (
                  <div
                    key={entry.id}
                    className={`leaderboard-row ${entry.id === user?.id ? 'is-you' : ''} ${entry.rank <= 3 ? `rank-${entry.rank}` : ''}`}
                  >
                    <span className="col-rank">
                      {entry.rank === 1 && <span className="rank-medal">🥇</span>}
                      {entry.rank === 2 && <span className="rank-medal">🥈</span>}
                      {entry.rank === 3 && <span className="rank-medal">🥉</span>}
                      {entry.rank > 3 && <span className="rank-number">#{entry.rank}</span>}
                    </span>
                    <span className="col-user">
                      <span className="user-name">{entry.username}</span>
                      {entry.id === user?.id && <span className="you-badge">You</span>}
                    </span>
                    <span className="col-level">Lv.{entry.level}</span>
                    <span className="col-xp">{entry.totalXp.toLocaleString()}</span>
                    <span className="col-streak">
                      {entry.streak > 0 ? (
                        <span className="streak-badge">🔥 {entry.streak}</span>
                      ) : (
                        <span className="no-streak">-</span>
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
