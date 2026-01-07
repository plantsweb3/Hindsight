import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { analyzeWallet, convertTradesToJournalEntries, createJournalEntriesBatch } from '../services/solana'

const API_URL = '/api/journal'

const MOODS = ['Confident', 'Uncertain', 'FOMO', 'Revenge Trade']
const RESEARCH_LEVELS = ['Deep Dive', 'Quick Look', 'Blind Ape']

// Shared Wave Background
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

// Header with Navigation
function Header({ user, onDashboard, onLogout }) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <a href="#" className="header-logo" onClick={(e) => { e.preventDefault(); onDashboard(); }}>
          <img src="/hindsightlogo.png" alt="Hindsight" className="header-logo-img" />
          <span className="header-title">hindsight</span>
        </a>
        <nav className="header-nav">
          <button className="nav-link" onClick={onDashboard}>
            Dashboard
          </button>
          <button className="nav-link active">
            Journal
          </button>
        </nav>
      </div>
      <div className="header-right">
        <button className="profile-btn" onClick={onLogout}>
          <span className="profile-avatar">{user?.username?.[0]?.toUpperCase() || '?'}</span>
          <span className="profile-name">{user?.username}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  )
}

// Filter Bar
function FilterBar({ filters, onFilterChange, onClearFilters }) {
  return (
    <div className="journal-filters glass-card">
      <div className="filter-row">
        <div className="filter-group">
          <label>Outcome</label>
          <select
            value={filters.outcome || ''}
            onChange={(e) => onFilterChange('outcome', e.target.value || null)}
          >
            <option value="">All Trades</option>
            <option value="winners">Winners Only</option>
            <option value="losers">Losers Only</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Mood</label>
          <select
            value={filters.mood || ''}
            onChange={(e) => onFilterChange('mood', e.target.value || null)}
          >
            <option value="">All Moods</option>
            {MOODS.map(mood => (
              <option key={mood} value={mood}>{mood}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Research</label>
          <select
            value={filters.researchLevel || ''}
            onChange={(e) => onFilterChange('researchLevel', e.target.value || null)}
          >
            <option value="">All Levels</option>
            {RESEARCH_LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Token</label>
          <input
            type="text"
            placeholder="Search token..."
            value={filters.token || ''}
            onChange={(e) => onFilterChange('token', e.target.value || null)}
          />
        </div>

        <div className="filter-group filter-dates">
          <label>Date Range</label>
          <div className="date-inputs">
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange('startDate', e.target.value || null)}
            />
            <span>to</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onFilterChange('endDate', e.target.value || null)}
            />
          </div>
        </div>

        {Object.values(filters).some(v => v) && (
          <button className="clear-filters-btn" onClick={onClearFilters}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}

// Trade Card
function TradeCard({ entry, onSave }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    thesis: entry.thesis || '',
    execution: entry.execution || '',
    mood: entry.mood || '',
    researchLevel: entry.researchLevel || '',
    exitReasoning: entry.exitReasoning || '',
    lessonLearned: entry.lessonLearned || '',
  })
  const [isSaving, setIsSaving] = useState(false)

  const isWinner = entry.pnlSol > 0
  const hasJournaled = entry.thesis || entry.mood || entry.researchLevel
  const hasATH = entry.athPrice !== null && entry.athPrice !== undefined
  const isNearATH = hasATH && entry.exitVsAthPercent !== null && entry.exitVsAthPercent >= -10
  const soldBeforeATH = entry.athTiming === 'before_ath'

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPnl = (value, isPercent = false) => {
    if (value === null || value === undefined) return 'N/A'
    const prefix = value >= 0 ? '+' : ''
    if (isPercent) {
      return `${prefix}${value.toFixed(1)}%`
    }
    return `${prefix}${value.toFixed(4)} SOL`
  }

  const formatMarketCap = (value) => {
    if (!value) return 'N/A'
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
    return `$${value.toFixed(0)}`
  }

  const formatPrice = (value) => {
    if (!value) return 'N/A'
    if (value < 0.00001) return `$${value.toExponential(2)}`
    if (value < 0.01) return `$${value.toFixed(6)}`
    if (value < 1) return `$${value.toFixed(4)}`
    return `$${value.toFixed(2)}`
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(entry.id, formData)
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to save:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={`trade-card glass-card ${isWinner ? 'trade-winner' : 'trade-loser'}`}>
      {/* Collapsed View */}
      <div className="trade-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="trade-token">
          <span className="token-name">{entry.tokenName || entry.tokenAddress?.slice(0, 8)}</span>
          {hasJournaled && <span className="journaled-badge">Journaled</span>}
          {isNearATH && <span className="ath-badge ath-near" title="Sold within 10% of ATH">Near ATH</span>}
          {soldBeforeATH && !isNearATH && <span className="ath-badge ath-early" title="Sold before ATH">Early Exit</span>}
        </div>
        <div className="trade-pnl">
          <span className={`pnl-value ${isWinner ? 'pnl-positive' : 'pnl-negative'}`}>
            {formatPnl(entry.pnlPercent, true)}
          </span>
          <span className="pnl-sol">{formatPnl(entry.pnlSol)}</span>
        </div>
        {hasATH && entry.exitVsAthPercent !== null && (
          <div className={`trade-ath-indicator ${isNearATH ? 'ath-good' : 'ath-missed'}`}>
            <span className="ath-vs">{entry.exitVsAthPercent >= 0 ? '+' : ''}{entry.exitVsAthPercent.toFixed(0)}% vs ATH</span>
          </div>
        )}
        <div className="trade-date">{formatDate(entry.exitTime)}</div>
        <div className="trade-expand-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="trade-card-body">
          {/* Trade Data */}
          <div className="trade-data-grid">
            <div className="trade-data-item">
              <span className="data-label">Entry Price</span>
              <span className="data-value">{entry.entryPrice?.toFixed(10) || 'N/A'}</span>
            </div>
            <div className="trade-data-item">
              <span className="data-label">Exit Price</span>
              <span className="data-value">{entry.exitPrice?.toFixed(10) || 'N/A'}</span>
            </div>
            <div className="trade-data-item">
              <span className="data-label">Position Size</span>
              <span className="data-value">{entry.positionSize?.toFixed(4) || 'N/A'} SOL</span>
            </div>
            <div className="trade-data-item">
              <span className="data-label">Hold Duration</span>
              <span className="data-value">{entry.holdDuration || 'N/A'}</span>
            </div>
            <div className="trade-data-item">
              <span className="data-label">Entry Time</span>
              <span className="data-value">{formatDate(entry.entryTime)}</span>
            </div>
            <div className="trade-data-item">
              <span className="data-label">Exit Time</span>
              <span className="data-value">{formatDate(entry.exitTime)}</span>
            </div>
          </div>

          {/* Contract Address */}
          <div className="trade-contract">
            <span className="data-label">Contract</span>
            <a
              href={`https://solscan.io/token/${entry.tokenAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contract-link"
            >
              {entry.tokenAddress}
            </a>
          </div>

          {/* ATH Section */}
          {hasATH && (
            <div className="trade-ath-section">
              <h4 className="ath-section-title">
                Price Context
                {isNearATH && <span className="ath-flame" title="Excellent exit!">Peak Exit</span>}
              </h4>
              <div className="ath-data-grid">
                <div className="ath-data-item">
                  <span className="data-label">ATH Price</span>
                  <span className="data-value">{formatPrice(entry.athPrice)}</span>
                </div>
                <div className="ath-data-item">
                  <span className="data-label">ATH Market Cap</span>
                  <span className="data-value">{formatMarketCap(entry.athMarketCap)}</span>
                </div>
                <div className="ath-data-item">
                  <span className="data-label">ATH Time</span>
                  <span className="data-value">{formatDate(entry.athTime)}</span>
                </div>
                <div className="ath-data-item">
                  <span className="data-label">Exit Timing</span>
                  <span className={`data-value ath-timing-value ${soldBeforeATH ? 'timing-early' : 'timing-late'}`}>
                    {soldBeforeATH ? 'Before Peak' : 'After Peak'}
                  </span>
                </div>
              </div>
              <div className={`ath-result-banner ${isNearATH ? 'ath-result-good' : entry.exitVsAthPercent < -50 ? 'ath-result-bad' : 'ath-result-neutral'}`}>
                <span className="ath-result-label">Exit vs ATH:</span>
                <span className="ath-result-value">
                  {entry.exitVsAthPercent >= 0 ? '+' : ''}{entry.exitVsAthPercent?.toFixed(1)}%
                </span>
                <span className="ath-result-context">
                  {isNearATH && 'Excellent timing!'}
                  {!isNearATH && soldBeforeATH && entry.exitVsAthPercent < -50 && 'Could have waited for the peak'}
                  {!isNearATH && !soldBeforeATH && entry.exitVsAthPercent < -50 && 'Held too long after the peak'}
                  {!isNearATH && entry.exitVsAthPercent >= -50 && entry.exitVsAthPercent < -10 && 'Decent exit timing'}
                </span>
              </div>
            </div>
          )}

          {/* Journal Fields */}
          <div className="trade-journal-section">
            <div className="journal-header">
              <h4>Trade Journal</h4>
              {!isEditing && (
                <button className="edit-journal-btn" onClick={() => setIsEditing(true)}>
                  {hasJournaled ? 'Edit' : 'Add Notes'}
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="journal-form">
                <div className="journal-field">
                  <label>Thesis - Why did you enter this trade?</label>
                  <textarea
                    value={formData.thesis}
                    onChange={(e) => setFormData({ ...formData, thesis: e.target.value })}
                    placeholder="What was your reasoning for entering?"
                  />
                </div>

                <div className="journal-row">
                  <div className="journal-field">
                    <label>Mood</label>
                    <select
                      value={formData.mood}
                      onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                    >
                      <option value="">Select mood...</option>
                      {MOODS.map(mood => (
                        <option key={mood} value={mood}>{mood}</option>
                      ))}
                    </select>
                  </div>

                  <div className="journal-field">
                    <label>Research Level</label>
                    <select
                      value={formData.researchLevel}
                      onChange={(e) => setFormData({ ...formData, researchLevel: e.target.value })}
                    >
                      <option value="">Select level...</option>
                      {RESEARCH_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="journal-field">
                  <label>Execution - Did you follow your plan?</label>
                  <textarea
                    value={formData.execution}
                    onChange={(e) => setFormData({ ...formData, execution: e.target.value })}
                    placeholder="Did you stick to your entry/exit plan?"
                  />
                </div>

                <div className="journal-field">
                  <label>Exit Reasoning - Why did you sell?</label>
                  <textarea
                    value={formData.exitReasoning}
                    onChange={(e) => setFormData({ ...formData, exitReasoning: e.target.value })}
                    placeholder="What triggered your exit?"
                  />
                </div>

                <div className="journal-field">
                  <label>Lesson Learned - What would you do differently?</label>
                  <textarea
                    value={formData.lessonLearned}
                    onChange={(e) => setFormData({ ...formData, lessonLearned: e.target.value })}
                    placeholder="Key takeaway from this trade..."
                  />
                </div>

                <div className="journal-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : hasJournaled ? (
              <div className="journal-display">
                {formData.mood && (
                  <div className="journal-tag mood-tag">{formData.mood}</div>
                )}
                {formData.researchLevel && (
                  <div className="journal-tag research-tag">{formData.researchLevel}</div>
                )}
                {formData.thesis && (
                  <div className="journal-item">
                    <span className="journal-label">Thesis:</span>
                    <p>{formData.thesis}</p>
                  </div>
                )}
                {formData.execution && (
                  <div className="journal-item">
                    <span className="journal-label">Execution:</span>
                    <p>{formData.execution}</p>
                  </div>
                )}
                {formData.exitReasoning && (
                  <div className="journal-item">
                    <span className="journal-label">Exit Reasoning:</span>
                    <p>{formData.exitReasoning}</p>
                  </div>
                )}
                {formData.lessonLearned && (
                  <div className="journal-item">
                    <span className="journal-label">Lesson Learned:</span>
                    <p>{formData.lessonLearned}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="no-journal-text">No journal notes yet. Click "Add Notes" to reflect on this trade.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Stats Card
function StatsCard({ stats }) {
  return (
    <div className="journal-stats glass-card">
      <div className="stat-item">
        <span className="stat-value">{stats.totalTrades}</span>
        <span className="stat-label">Trades</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{stats.winRate}</span>
        <span className="stat-label">Win Rate</span>
      </div>
      <div className="stat-item">
        <span className={`stat-value ${stats.totalPnl >= 0 ? 'pnl-positive' : 'pnl-negative'}`}>
          {stats.totalPnl >= 0 ? '+' : ''}{stats.totalPnl?.toFixed(2) || 0} SOL
        </span>
        <span className="stat-label">Total P&L</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{stats.journaledCount || 0}</span>
        <span className="stat-label">Journaled</span>
      </div>
    </div>
  )
}

// Insights Panel
function InsightsPanel({ patterns }) {
  if (!patterns || !patterns.hasEnoughData) {
    return (
      <div className="journal-insights glass-card">
        <h3>AI Insights</h3>
        <p className="insights-prompt">
          Journal {10 - (patterns?.journaledCount || 0)} more trades to unlock AI pattern analysis.
        </p>
        <div className="insights-progress">
          <div
            className="insights-progress-bar"
            style={{ width: `${((patterns?.journaledCount || 0) / 10) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="journal-insights glass-card">
      <h3>AI Insights</h3>
      {patterns.insights.length > 0 ? (
        <ul className="insights-list">
          {patterns.insights.map((insight, i) => (
            <li key={i} className={`insight-item insight-${insight.severity}`}>
              {insight.text}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-insights">Keep journaling to discover patterns in your trading.</p>
      )}
    </div>
  )
}

// Summary View
function SummaryView({ type, data }) {
  if (!data || data.length === 0) {
    return (
      <div className="summary-empty glass-card">
        <p>No data available for this time period.</p>
      </div>
    )
  }

  const formatPeriod = (period) => {
    if (type === 'weekly') {
      const [year, week] = period.split('-')
      return `Week ${week}, ${year}`
    }
    const date = new Date(period + '-01')
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="summary-grid">
      {data.map((item) => (
        <div key={item.week || item.month} className="summary-card glass-card">
          <div className="summary-period">{formatPeriod(item.week || item.month)}</div>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="summary-value">{item.totalTrades}</span>
              <span className="summary-label">Trades</span>
            </div>
            <div className="summary-stat">
              <span className="summary-value">{item.winRate}</span>
              <span className="summary-label">Win Rate</span>
            </div>
            <div className="summary-stat">
              <span className={`summary-value ${item.totalPnl >= 0 ? 'pnl-positive' : 'pnl-negative'}`}>
                {item.totalPnl >= 0 ? '+' : ''}{item.totalPnl?.toFixed(2) || 0}
              </span>
              <span className="summary-label">P&L (SOL)</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Empty State - checks for saved wallets
function EmptyState({ onAnalyze, savedWallets, onRefreshWallet, isRefreshing, refreshError, refreshProgress }) {
  console.log('[EmptyState] Props:', { hasSavedWallets: savedWallets?.length > 0, onRefreshWallet: typeof onRefreshWallet })
  const hasSavedWallets = savedWallets && savedWallets.length > 0

  if (hasSavedWallets) {
    return (
      <div className="journal-empty glass-card">
        <div className="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </div>
        <h3>Refresh your trades</h3>
        <p>Pull the latest trades from your saved wallet to update your journal.</p>

        {refreshError && (
          <p className="refresh-error">{refreshError}</p>
        )}

        {isRefreshing && (
          <div className="refresh-progress">
            <span className="spinner" />
            <span>{refreshProgress || 'Fetching trades...'}</span>
          </div>
        )}

        <div className="saved-wallets-list">
          {savedWallets.map((wallet, i) => (
            <button
              key={i}
              type="button"
              className="saved-wallet-btn glass-button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('[EmptyState] Button clicked for wallet:', wallet)
                onRefreshWallet(wallet)
              }}
              disabled={isRefreshing}
            >
              <span className="wallet-address">{wallet.slice(0, 4)}...{wallet.slice(-4)}</span>
              <span className="refresh-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
              </span>
              {isRefreshing ? 'Refreshing...' : 'Refresh Trades'}
            </button>
          ))}
        </div>
        <p className="or-divider">or</p>
        <button className="secondary-action" onClick={onAnalyze} disabled={isRefreshing}>
          Analyze a different wallet
        </button>
      </div>
    )
  }

  return (
    <div className="journal-empty glass-card">
      <div className="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="12" y1="6" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3>No trades journaled yet</h3>
      <p>Run a wallet analysis to import your trades and start building self-awareness.</p>
      <button className="glass-button cta-button" onClick={onAnalyze}>
        Analyze a Wallet
      </button>
    </div>
  )
}

// Main Journal Component
export default function Journal({ onBack, onAnalyze, onOpenDashboard }) {
  const { token, logout, user } = useAuth()
  const [entries, setEntries] = useState([])
  const [stats, setStats] = useState(null)
  const [patterns, setPatterns] = useState(null)
  const [weeklySummary, setWeeklySummary] = useState([])
  const [monthlySummary, setMonthlySummary] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState('trades') // 'trades' | 'weekly' | 'monthly'
  const [filters, setFilters] = useState({})

  // Refresh wallet state
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState('')
  const [refreshProgress, setRefreshProgress] = useState('')

  // Get saved wallets from user
  const savedWallets = user?.savedWallets || []

  // Handler to refresh trades from a saved wallet - stays on journal page
  const handleRefreshWallet = async (walletAddress) => {
    console.log('[Refresh] handleRefreshWallet called with:', walletAddress)
    setIsRefreshing(true)
    setRefreshError('')
    setRefreshProgress('Fetching transactions...')

    try {
      // Fetch wallet trades from Helius
      console.log('[Refresh] Calling analyzeWallet...')
      const walletData = await analyzeWallet(walletAddress, setRefreshProgress)
      console.log('[Refresh] analyzeWallet returned:', walletData?.trades?.length, 'trades')

      if (!walletData.trades || walletData.trades.length === 0) {
        setRefreshError('No trades found for this wallet')
        return
      }

      // Convert trades to journal entries
      setRefreshProgress('Creating journal entries...')
      const journalEntries = convertTradesToJournalEntries(walletData.trades)
      console.log('[Refresh] Converted to', journalEntries.length, 'journal entries')

      if (journalEntries.length > 0) {
        console.log('[Refresh] Creating batch entries with token:', token ? 'present' : 'MISSING')
        const result = await createJournalEntriesBatch(journalEntries, token)
        console.log('[Refresh] Batch result:', result)

        if (result?.created === 0 && result?.skipped > 0) {
          setRefreshError(`All ${result.skipped} trades already exist in your journal`)
        }
      }

      // Reload journal data to show new entries
      setRefreshProgress('Loading journal...')
      console.log('[Refresh] Reloading journal data...')
      await loadData()
      console.log('[Refresh] Complete!')

    } catch (err) {
      console.error('[Refresh] Error:', err)
      setRefreshError(err.message || 'Failed to fetch trades')
    } finally {
      setIsRefreshing(false)
      setRefreshProgress('')
    }
  }

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Build query params
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const [entriesRes, statsRes, patternsRes, weeklyRes, monthlyRes] = await Promise.all([
        fetch(`${API_URL}?${params}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/patterns`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/weekly`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/monthly`, { headers: { Authorization: `Bearer ${token}` } }),
      ])

      if (entriesRes.ok) setEntries(await entriesRes.json())
      if (statsRes.ok) setStats(await statsRes.json())
      if (patternsRes.ok) setPatterns(await patternsRes.json())
      if (weeklyRes.ok) setWeeklySummary(await weeklyRes.json())
      if (monthlyRes.ok) setMonthlySummary(await monthlyRes.json())
    } catch (err) {
      console.error('Failed to load journal data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  const handleSaveEntry = async (entryId, updates) => {
    const res = await fetch(`${API_URL}/${entryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })

    if (!res.ok) {
      throw new Error('Failed to save')
    }

    // Reload data to get updated stats
    loadData()
  }

  const handleLogout = () => {
    logout()
    onBack()
  }

  const handleDashboard = () => {
    if (onOpenDashboard) {
      onOpenDashboard()
    } else {
      onBack()
    }
  }

  return (
    <div className="journal-page">
      <WaveBackground />
      <Header user={user} onDashboard={handleDashboard} onLogout={handleLogout} />

      <main className="journal-content">
        {/* Mobile back link */}
        <button className="mobile-back-link" onClick={handleDashboard}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <section className="journal-header-section">
          <h1 className="journal-title">Trading Journal</h1>
          <p className="journal-subtitle">Track your trades and build self-awareness</p>
        </section>

        {isLoading ? (
          <div className="loading-state">Loading journal...</div>
        ) : entries.length === 0 && !Object.values(filters).some(v => v) ? (
          <EmptyState
            onAnalyze={onAnalyze}
            savedWallets={savedWallets}
            onRefreshWallet={handleRefreshWallet}
            isRefreshing={isRefreshing}
            refreshError={refreshError}
            refreshProgress={refreshProgress}
          />
        ) : (
          <>
            {stats && <StatsCard stats={stats} />}

            <InsightsPanel patterns={patterns} />

            {/* View Tabs */}
            <div className="journal-tabs">
              <button
                className={`tab-btn ${view === 'trades' ? 'active' : ''}`}
                onClick={() => setView('trades')}
              >
                All Trades
              </button>
              <button
                className={`tab-btn ${view === 'weekly' ? 'active' : ''}`}
                onClick={() => setView('weekly')}
              >
                Weekly
              </button>
              <button
                className={`tab-btn ${view === 'monthly' ? 'active' : ''}`}
                onClick={() => setView('monthly')}
              >
                Monthly
              </button>
            </div>

            {view === 'trades' && (
              <>
                <FilterBar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />

                <div className="trades-list">
                  {entries.length === 0 ? (
                    <div className="no-results glass-card">
                      <p>No trades match your filters.</p>
                    </div>
                  ) : (
                    entries.map(entry => (
                      <TradeCard
                        key={entry.id}
                        entry={entry}
                        onSave={handleSaveEntry}
                      />
                    ))
                  )}
                </div>
              </>
            )}

            {view === 'weekly' && <SummaryView type="weekly" data={weeklySummary} />}
            {view === 'monthly' && <SummaryView type="monthly" data={monthlySummary} />}
          </>
        )}
      </main>
    </div>
  )
}
