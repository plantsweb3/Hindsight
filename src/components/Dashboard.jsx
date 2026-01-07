import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ARCHETYPES } from '../data/quizData'
import { ProBadge } from './ProBadge'
import WalletLabelBadge, { LABEL_COLORS } from './WalletLabelBadge'

// Wave Background
function WaveBackground() {
  return (
    <div className="wave-background">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="wave-ring"
          style={{
            '--ring-index': i,
            '--ring-delay': `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  )
}

// Dashboard Header with Nav Links and Profile Dropdown
function DashboardHeader({ user, currentPage, onNavigate, onLogout, onSettings }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <a href="#" className="header-logo" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>
          <img src="/hindsightlogo.png" alt="Hindsight" className="header-logo-img" />
          <span className="header-title">hindsight</span>
        </a>
        <nav className="header-nav">
          <button
            className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => onNavigate('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-link ${currentPage === 'journal' ? 'active' : ''}`}
            onClick={() => onNavigate('journal')}
          >
            Journal
          </button>
        </nav>
      </div>
      <div className="header-right" ref={dropdownRef}>
        <button
          className="profile-btn"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className="profile-avatar">{user?.username?.[0]?.toUpperCase() || '?'}</span>
          <span className="profile-name">{user?.username}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {showDropdown && (
          <div className="profile-dropdown">
            <button className="dropdown-item" onClick={() => { setShowDropdown(false); onSettings(); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Settings
            </button>
            <button className="dropdown-item danger" onClick={onLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

// Stats Bar Component
function StatsBar({ stats }) {
  const formatPnl = (value) => {
    if (value === null || value === undefined) return '0.00'
    return value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2)
  }

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-label">Total P&L</span>
        <span className={`stat-value ${stats.totalPnl >= 0 ? 'positive' : 'negative'}`}>
          {formatPnl(stats.totalPnl)} SOL
        </span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-label">Win Rate</span>
        <span className="stat-value">{stats.winRate || '0%'}</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-label">Total Trades</span>
        <span className="stat-value">{stats.totalTrades || 0}</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-label">Best Trade</span>
        <span className="stat-value positive">
          {stats.bestTrade ? `${stats.bestTrade.token} +${stats.bestTrade.pnlPercent?.toFixed(0)}%` : '-'}
        </span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-label">Worst Trade</span>
        <span className="stat-value negative">
          {stats.worstTrade ? `${stats.worstTrade.token} ${stats.worstTrade.pnlPercent?.toFixed(0)}%` : '-'}
        </span>
      </div>
    </div>
  )
}

// Usage Limits Bar (for free users)
function UsageLimitsBar({ user, onOpenPro }) {
  const isPro = user?.isPro || false
  const walletCount = user?.walletCount ?? (user?.savedWallets?.length || 0)
  const journalCount = user?.journalEntryCount || 0
  const limits = user?.limits || { MAX_WALLETS: 1, MAX_JOURNAL_ENTRIES: 1 }

  if (isPro) {
    return (
      <div className="usage-limits-bar glass-card pro-user">
        <div className="usage-limits-content">
          <ProBadge />
          <span className="pro-status-text">Unlimited access active</span>
        </div>
      </div>
    )
  }

  return (
    <div className="usage-limits-bar glass-card">
      <div className="usage-limits-content">
        <div className="usage-item">
          <span className="usage-label">Wallets</span>
          <span className={`usage-value ${walletCount >= limits.MAX_WALLETS ? 'at-limit' : ''}`}>
            {walletCount}/{limits.MAX_WALLETS}
          </span>
        </div>
        <div className="usage-divider" />
        <div className="usage-item">
          <span className="usage-label">Journal Entries</span>
          <span className={`usage-value ${journalCount >= limits.MAX_JOURNAL_ENTRIES ? 'at-limit' : ''}`}>
            {journalCount}/{limits.MAX_JOURNAL_ENTRIES}
          </span>
        </div>
        <span className="usage-free-tag">Free Tier</span>
        <button className="usage-upgrade-btn" onClick={onOpenPro}>
          Upgrade to Pro
        </button>
      </div>
    </div>
  )
}

// Compact Horizontal Trader Profile Card
function TraderProfileCard({ user, onRetakeQuiz }) {
  console.log('[Dashboard] TraderProfileCard user:', user)
  console.log('[Dashboard] primaryArchetype:', user?.primaryArchetype)
  console.log('[Dashboard] ARCHETYPES keys:', Object.keys(ARCHETYPES))

  if (!user?.primaryArchetype || !ARCHETYPES[user.primaryArchetype]) {
    return (
      <div className="archetype-bar glass-card">
        <div className="archetype-bar-content">
          <span className="archetype-bar-empty">Take the quiz to discover your trading personality</span>
          <button className="archetype-bar-btn" onClick={onRetakeQuiz}>Take Quiz</button>
        </div>
      </div>
    )
  }

  const primary = ARCHETYPES[user.primaryArchetype]
  const secondary = user.secondaryArchetype ? ARCHETYPES[user.secondaryArchetype] : null

  return (
    <div className="archetype-bar glass-card">
      <div className="archetype-bar-top">
        <div className="archetype-bar-types">
          <div className="archetype-bar-primary">
            <span className="archetype-bar-emoji">{primary.emoji}</span>
            <span className="archetype-bar-name">{primary.name}</span>
          </div>
          {secondary && (
            <>
              <span className="archetype-bar-divider">|</span>
              <div className="archetype-bar-secondary">
                <span className="archetype-bar-emoji">{secondary.emoji}</span>
                <span className="archetype-bar-name secondary">{secondary.name}</span>
                <span className="archetype-bar-label">(secondary)</span>
              </div>
            </>
          )}
        </div>
        <button className="archetype-bar-btn" onClick={onRetakeQuiz}>Retake Quiz</button>
      </div>
      <p className="archetype-bar-coaching">{primary.coaching}</p>
    </div>
  )
}

// Recent Activity Feed
function RecentActivityFeed({ activities }) {
  const formatRelativeTime = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'analysis':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )
      case 'journal':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        )
      case 'quiz':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        )
      default:
        return null
    }
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="activity-card glass-card">
        <h3 className="activity-title">Recent Activity</h3>
        <p className="activity-empty">No recent activity yet.</p>
      </div>
    )
  }

  return (
    <div className="activity-card glass-card">
      <h3 className="activity-title">Recent Activity</h3>
      <div className="activity-list">
        {activities.slice(0, 8).map((activity, i) => (
          <div key={i} className="activity-item">
            <span className="activity-icon">{getActivityIcon(activity.type)}</span>
            <span className="activity-text">{activity.text}</span>
            <span className="activity-time">{formatRelativeTime(activity.date)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Quick Actions Row
function QuickActions({ onAnalyze, onOpenJournal, onAddWallet }) {
  return (
    <div className="quick-actions">
      <button className="quick-action-btn glass-button" onClick={onAnalyze}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Analyze Wallet
      </button>
      <button className="quick-action-btn glass-button" onClick={onOpenJournal}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        Open Journal
      </button>
      <button className="quick-action-btn glass-button" onClick={onAddWallet}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Wallet
      </button>
    </div>
  )
}

// Label options with emojis and colors
const LABEL_OPTIONS = [
  { label: 'Main', emoji: '🏠', color: '#a855f7' },
  { label: 'Gamble', emoji: '🎰', color: '#ef4444' },
  { label: 'Long Hold', emoji: '💎', color: '#3b82f6' },
  { label: 'Sniper', emoji: '⚡', color: '#eab308' },
  { label: 'Test', emoji: '🧪', color: '#71717a' },
]

// Pro Feature Popup for label selection
function ProFeaturePopup({ onLearnMore, onClose }) {
  return (
    <div className="pro-feature-popup-overlay" onClick={onClose}>
      <div className="pro-feature-popup" onClick={(e) => e.stopPropagation()}>
        <div className="pro-feature-popup-icon">✨</div>
        <h4 className="pro-feature-popup-title">Pro Feature</h4>
        <p className="pro-feature-popup-text">
          Wallet labels help organize your trading strategy and unlock smarter AI insights.
        </p>
        <div className="pro-feature-popup-actions">
          <button className="pro-feature-learn-btn" onClick={onLearnMore}>
            Learn more →
          </button>
          <button className="pro-feature-later-btn" onClick={onClose}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}

// Success Toast
function SuccessToast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="success-toast">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" />
      </svg>
      {message}
    </div>
  )
}

// Tracked Wallets Section with label management
function WalletsSection({ user, onOpenSettings, onOpenPro, onRefresh }) {
  const { token } = useAuth()
  const [expandedWallet, setExpandedWallet] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(null)
  const [showProPopup, setShowProPopup] = useState(false)
  const [successToast, setSuccessToast] = useState(null)

  const isPro = user?.isPro || false
  const limits = user?.limits || { MAX_WALLETS: 1 }
  const wallets = (user?.savedWallets || []).map(w =>
    typeof w === 'string' ? { address: w, label: 'Unlabeled' } : w
  )
  const walletCount = wallets.length
  const atLimit = walletCount >= limits.MAX_WALLETS && !isPro

  const truncateAddr = (addr) => `${addr.slice(0, 4)}...${addr.slice(-4)}`

  const handleCopyAddress = async (address) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopyFeedback(address)
      setTimeout(() => setCopyFeedback(null), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleLabelSelect = async (address, newLabel) => {
    if (!isPro) {
      // Show Pro feature popup instead of redirecting
      setExpandedWallet(null)
      setShowProPopup(true)
      return
    }

    // Pro user - save the label
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/auth/wallets/${address}/label`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ label: newLabel }),
      })

      if (response.ok) {
        setSuccessToast('Label saved!')
        onRefresh?.()
      }
    } catch (err) {
      console.error('Failed to update label:', err)
    } finally {
      setIsUpdating(false)
      setExpandedWallet(null)
    }
  }

  const handleProLearnMore = () => {
    setShowProPopup(false)
    onOpenPro?.()
  }

  // Close expanded wallet when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (expandedWallet && !e.target.closest('.wallet-label-area')) {
        setExpandedWallet(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [expandedWallet])

  return (
    <div className="wallets-section glass-card">
      <div className="wallets-section-header">
        <h3 className="wallets-section-title">Tracked Wallets</h3>
        <span className="wallets-count">
          {walletCount}/{isPro ? 'Unlimited' : limits.MAX_WALLETS}
          {!isPro && <span className="free-tag">Free</span>}
          {isPro && <ProBadge className="count-badge" />}
        </span>
      </div>

      <div className="wallets-list">
        {wallets.length === 0 ? (
          <div className="wallets-empty">
            <p>No wallets tracked yet</p>
          </div>
        ) : (
          wallets.map((wallet, i) => {
            const isExpanded = expandedWallet === wallet.address
            const hasLabel = wallet.label && wallet.label !== 'Unlabeled'

            return (
              <div key={i} className="wallet-item">
                <div className="wallet-item-left">
                  <button
                    className="wallet-address-btn"
                    onClick={() => handleCopyAddress(wallet.address)}
                    title="Copy address"
                  >
                    <span className="wallet-address">{truncateAddr(wallet.address)}</span>
                    {copyFeedback === wallet.address ? (
                      <svg className="copy-icon copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg className="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="wallet-item-right wallet-label-area">
                  {hasLabel ? (
                    // Has a label - show badge, click to change
                    <button
                      className="wallet-label-badge-btn"
                      onClick={() => setExpandedWallet(isExpanded ? null : wallet.address)}
                      disabled={isUpdating}
                    >
                      <WalletLabelBadge label={wallet.label} size="small" />
                    </button>
                  ) : (
                    // No label - show "Add Label" button
                    <button
                      className="add-label-btn"
                      onClick={() => setExpandedWallet(isExpanded ? null : wallet.address)}
                      disabled={isUpdating}
                    >
                      <span className="add-label-icon">🏷️</span>
                      <span>Add Label</span>
                    </button>
                  )}

                  {/* Floating label options */}
                  {isExpanded && (
                    <div className="label-options-popup">
                      {LABEL_OPTIONS.map((opt) => (
                        <button
                          key={opt.label}
                          className="label-option-pill"
                          style={{ '--pill-color': opt.color }}
                          onClick={() => handleLabelSelect(wallet.address, opt.label)}
                          disabled={isUpdating}
                        >
                          <span className="label-option-emoji">{opt.emoji}</span>
                          <span className="label-option-name">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="wallets-section-footer">
        <button
          className="add-wallet-btn glass-button"
          onClick={onOpenSettings}
          disabled={atLimit}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Wallet
          {atLimit && !isPro && <ProBadge className="btn-badge" />}
        </button>
        <button className="manage-wallets-link" onClick={onOpenSettings}>
          Manage in Settings
        </button>
      </div>

      {/* Pro Feature Popup */}
      {showProPopup && (
        <ProFeaturePopup
          onLearnMore={handleProLearnMore}
          onClose={() => setShowProPopup(false)}
        />
      )}

      {/* Success Toast */}
      {successToast && (
        <SuccessToast
          message={successToast}
          onClose={() => setSuccessToast(null)}
        />
      )}
    </div>
  )
}

// Wallet Performance Breakdown (Pro users with 2+ labeled wallets)
function WalletPerformance({ walletStats }) {
  if (!walletStats || walletStats.length < 2) return null

  const truncateAddr = (addr) => `${addr.slice(0, 4)}...${addr.slice(-4)}`

  return (
    <div className="wallet-performance glass-card">
      <h3 className="wallet-performance-title">
        Wallet Performance
        <ProBadge className="title-badge" />
      </h3>
      <div className="wallet-performance-list">
        {walletStats.map((wallet, i) => {
          const isPositive = wallet.totalPnlSol >= 0
          const labelColors = LABEL_COLORS[wallet.label] || LABEL_COLORS['Unlabeled']

          return (
            <div key={i} className="wallet-performance-item">
              <div className="wallet-perf-info">
                <WalletLabelBadge label={wallet.label} size="small" />
                <span className="wallet-perf-address">{truncateAddr(wallet.address)}</span>
              </div>
              <div className="wallet-perf-stats">
                <span className={`wallet-perf-pnl ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? '+' : ''}{wallet.totalPnlSol} SOL
                </span>
                <span className="wallet-perf-winrate">{wallet.winRate}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Expandable Trade Row
function TradeRow({ trade, isExpanded, onToggle, onJournal }) {
  const isPositive = trade.pnlPercent >= 0

  return (
    <div className={`trade-row ${isExpanded ? 'expanded' : ''}`}>
      <div className="trade-row-header" onClick={onToggle}>
        <div className="trade-col-token">
          <span className="trade-token">{trade.tokenName || trade.token}</span>
        </div>
        <div className="trade-col-pnl-percent">
          <span className={`trade-pnl-percent ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}{trade.pnlPercent?.toFixed(1)}%
          </span>
        </div>
        <div className="trade-col-pnl-sol">
          <span className={`trade-pnl-sol ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}{trade.pnlSol?.toFixed(3)} SOL
          </span>
        </div>
        <div className="trade-col-date">
          <span className="trade-date">
            {new Date(trade.exitTime || trade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div className="trade-col-expand">
          <span className="trade-expand-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={isExpanded ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
            </svg>
          </span>
        </div>
      </div>
      {isExpanded && (
        <div className="trade-row-details">
          {trade.verdict && (
            <div className="trade-verdict">"{trade.verdict}"</div>
          )}
          {trade.patterns && trade.patterns.length > 0 && (
            <div className="trade-patterns">
              {trade.patterns.map((p, i) => (
                <div key={i} className="trade-pattern">
                  <span className="pattern-name">{p.name}</span>
                  <span className="pattern-desc">{p.description}</span>
                </div>
              ))}
            </div>
          )}
          <div className="trade-row-actions">
            <button className="trade-action-btn" onClick={(e) => { e.stopPropagation(); onJournal(trade); }}>
              View in Journal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Trade History Table
function TradeHistory({ trades, onJournal }) {
  const [expandedId, setExpandedId] = useState(null)

  if (!trades || trades.length === 0) {
    return (
      <div className="trade-history glass-card">
        <h3 className="trade-history-title">Trade History</h3>
        <div className="trade-history-empty">
          <p>No trades recorded yet. Analyze a wallet to import your trading history.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="trade-history glass-card">
      <h3 className="trade-history-title">Trade History</h3>
      <div className="trade-table">
        <div className="trade-table-header">
          <div className="trade-col-token">Token</div>
          <div className="trade-col-pnl-percent">P&L %</div>
          <div className="trade-col-pnl-sol">P&L SOL</div>
          <div className="trade-col-date">Date</div>
          <div className="trade-col-expand"></div>
        </div>
        <div className="trade-table-body">
          {trades.map((trade) => (
            <TradeRow
              key={trade.id}
              trade={trade}
              isExpanded={expandedId === trade.id}
              onToggle={() => setExpandedId(expandedId === trade.id ? null : trade.id)}
              onJournal={onJournal}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function Dashboard({ onBack, onAnalyze, onRetakeQuiz, onOpenJournal, onOpenSettings, onOpenPro }) {
  const { user, token, logout, getAnalyses, refreshUser } = useAuth()
  const [stats, setStats] = useState({
    totalPnl: 0,
    winRate: '0%',
    totalTrades: 0,
    bestTrade: null,
    worstTrade: null,
  })
  const [activities, setActivities] = useState([])
  const [trades, setTrades] = useState([])
  const [walletStats, setWalletStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Refresh user data to get latest archetype info
      console.log('[Dashboard] Refreshing user data...')
      await refreshUser()

      // Load journal stats
      const statsRes = await fetch('/api/journal/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats({
          totalPnl: statsData.totalPnl || 0,
          winRate: statsData.winRate || '0%',
          totalTrades: statsData.totalTrades || 0,
          bestTrade: null,
          worstTrade: null,
        })
      }

      // Load journal entries for trade history
      const entriesRes = await fetch('/api/journal?limit=50', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (entriesRes.ok) {
        const entriesData = await entriesRes.json()

        // Deduplicate by token + exit time (within 1 minute)
        const deduped = deduplicateTrades(entriesData)
        setTrades(deduped)

        // Find best and worst trades
        if (deduped.length > 0) {
          const sorted = [...deduped].sort((a, b) => (b.pnlPercent || 0) - (a.pnlPercent || 0))
          setStats(prev => ({
            ...prev,
            bestTrade: sorted[0]?.pnlPercent > 0 ? { token: sorted[0].tokenName, pnlPercent: sorted[0].pnlPercent } : null,
            worstTrade: sorted[sorted.length - 1]?.pnlPercent < 0 ? { token: sorted[sorted.length - 1].tokenName, pnlPercent: sorted[sorted.length - 1].pnlPercent } : null,
          }))
        }

        // Build activity feed from entries
        const activityItems = deduped.slice(0, 10).map(entry => ({
          type: 'journal',
          text: `Traded ${entry.tokenName || 'token'}`,
          date: entry.exitTime || entry.createdAt,
        }))
        setActivities(activityItems)

        // Calculate wallet performance stats for Pro users with 2+ wallets
        if (user?.isPro && user?.savedWallets?.length >= 2) {
          const walletStatsMap = new Map()

          // Normalize saved wallets
          const wallets = (user.savedWallets || []).map(w =>
            typeof w === 'string' ? { address: w, label: 'Unlabeled' } : w
          )

          // Initialize stats for each wallet
          wallets.forEach(w => {
            walletStatsMap.set(w.address, {
              address: w.address,
              label: w.label,
              trades: 0,
              wins: 0,
              losses: 0,
              totalPnlSol: 0,
            })
          })

          // Aggregate stats from journal entries
          entriesData.forEach(entry => {
            if (!entry.walletAddress) return
            const stats = walletStatsMap.get(entry.walletAddress)
            if (!stats) return

            stats.trades++
            if (entry.pnlSol > 0) stats.wins++
            else if (entry.pnlSol < 0) stats.losses++
            stats.totalPnlSol += entry.pnlSol || 0
          })

          // Build wallet stats array
          const walletStatsArray = []
          walletStatsMap.forEach(stats => {
            if (stats.trades === 0) return
            walletStatsArray.push({
              ...stats,
              totalPnlSol: Math.round(stats.totalPnlSol * 1000) / 1000,
              winRate: stats.trades > 0
                ? `${Math.round((stats.wins / stats.trades) * 100)}%`
                : '0%',
            })
          })

          if (walletStatsArray.length >= 2) {
            setWalletStats(walletStatsArray)
          }
        }
      }

      // Load analyses and add to activities
      const analyses = await getAnalyses()
      if (analyses.length > 0) {
        const analysisActivities = analyses.slice(0, 5).map(a => ({
          type: 'analysis',
          text: `Analyzed ${a.walletAddress?.slice(0, 4)}...${a.walletAddress?.slice(-4)}`,
          date: a.createdAt,
        }))
        setActivities(prev => {
          const combined = [...prev, ...analysisActivities]
          combined.sort((a, b) => new Date(b.date) - new Date(a.date))
          // Deduplicate activities by text + minute
          const deduped = deduplicateActivities(combined)
          return deduped.slice(0, 10)
        })
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Deduplicate trades by token + exit time
  const deduplicateTrades = (trades) => {
    const seen = new Map()

    for (const trade of trades) {
      const exitTime = new Date(trade.exitTime).getTime()
      // Round to nearest minute for deduplication
      const roundedTime = Math.floor(exitTime / 60000) * 60000
      const key = `${trade.tokenAddress}-${roundedTime}`

      if (!seen.has(key) || new Date(trade.createdAt) > new Date(seen.get(key).createdAt)) {
        seen.set(key, trade)
      }
    }

    return Array.from(seen.values()).sort((a, b) =>
      new Date(b.exitTime) - new Date(a.exitTime)
    )
  }

  // Deduplicate activities by text + minute
  const deduplicateActivities = (activities) => {
    const seen = new Map()

    for (const activity of activities) {
      const time = new Date(activity.date).getTime()
      // Round to nearest minute
      const roundedTime = Math.floor(time / 60000) * 60000
      const key = `${activity.text}-${roundedTime}`

      if (!seen.has(key)) {
        seen.set(key, activity)
      }
    }

    return Array.from(seen.values()).sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    )
  }

  const handleLogout = () => {
    logout()
    onBack()
  }

  const handleNavigate = (page) => {
    if (page === 'journal') {
      onOpenJournal()
    }
    // dashboard is current page
  }

  const handleJournalTrade = (trade) => {
    onOpenJournal()
    // Could pass trade ID to scroll to specific entry
  }

  const handleAddWallet = () => {
    // Navigate to Settings page where wallet management is
    if (onOpenSettings) {
      onOpenSettings()
    }
  }

  return (
    <div className="dashboard-page">
      <WaveBackground />
      <DashboardHeader
        user={user}
        currentPage="dashboard"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onSettings={onOpenSettings}
      />

      <main className="dashboard-main">
        {isLoading ? (
          <div className="dashboard-loading">Loading...</div>
        ) : (
          <>
            {/* Row 1: Stats Bar */}
            <StatsBar stats={stats} />

            {/* Row 1.5: Usage Limits (Free/Pro) */}
            <UsageLimitsBar user={user} onOpenPro={onOpenPro} />

            {/* Row 2: Archetype Bar (compact horizontal) */}
            <TraderProfileCard user={user} onRetakeQuiz={onRetakeQuiz} />

            {/* Row 2.5: Tracked Wallets */}
            <WalletsSection
              user={user}
              onOpenSettings={onOpenSettings}
              onOpenPro={onOpenPro}
              onRefresh={refreshUser}
            />

            {/* Row 3: Quick Actions */}
            <QuickActions
              onAnalyze={onAnalyze}
              onOpenJournal={onOpenJournal}
              onAddWallet={handleAddWallet}
            />

            {/* Row 3.5: Wallet Performance (Pro users with 2+ wallets) */}
            <WalletPerformance walletStats={walletStats} />

            {/* Row 4: Two Column Layout - Activity + Trade History */}
            <div className="dashboard-columns">
              <RecentActivityFeed activities={activities} />
              <TradeHistory trades={trades} onJournal={handleJournalTrade} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
