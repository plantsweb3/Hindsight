import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ARCHETYPES } from '../data/quizData'
import { isValidSolanaAddress } from '../services/solana'
import { ProBadge } from './ProBadge'
import UpgradeModal from './UpgradeModal'
import WalletLabelBadge, { LABEL_COLORS } from './WalletLabelBadge'

// Label options with emojis and colors (matches Dashboard)
const LABEL_OPTIONS = [
  { label: 'Main', emoji: '🏠', color: '#a855f7' },
  { label: 'Gamble', emoji: '🎰', color: '#ef4444' },
  { label: 'Long Hold', emoji: '💎', color: '#3b82f6' },
  { label: 'Sniper', emoji: '⚡', color: '#eab308' },
  { label: 'Test', emoji: '🧪', color: '#22c55e' },
]

// Pro Feature Popup - reusable for different features
function ProFeaturePopup({ title = 'Pro Feature', text, onLearnMore, onClose }) {
  return (
    <div className="pro-feature-popup-overlay" onClick={onClose}>
      <div className="pro-feature-popup" onClick={(e) => e.stopPropagation()}>
        <div className="pro-feature-popup-icon">✨</div>
        <h4 className="pro-feature-popup-title">{title}</h4>
        <p className="pro-feature-popup-text">{text}</p>
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

// Settings Header
function SettingsHeader({ user, onNavigate, onLogout }) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <a href="#" className="header-logo" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>
          <img src="/hindsightlogo.png" alt="Hindsight" className="header-logo-img" />
          <span className="header-title">hindsight</span>
        </a>
        <nav className="header-nav">
          <button className="nav-link" onClick={() => onNavigate('dashboard')}>
            Dashboard
          </button>
          <button className="nav-link" onClick={() => onNavigate('journal')}>
            Journal
          </button>
        </nav>
      </div>
      <div className="header-right">
        <button className="profile-btn" onClick={() => onNavigate('dashboard')}>
          <span className="profile-avatar">{user?.username?.[0]?.toUpperCase() || '?'}</span>
          <span className="profile-name">{user?.username}</span>
        </button>
      </div>
    </header>
  )
}

// Account Section
function AccountSection({ user, onLogout }) {
  return (
    <section className="settings-section">
      <h2 className="settings-section-title">Account</h2>
      <div className="settings-card glass-card">
        <div className="settings-row">
          <span className="settings-label">Username</span>
          <span className="settings-value">{user?.username}</span>
        </div>
        <div className="settings-row">
          <span className="settings-label">Member since</span>
          <span className="settings-value">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
          </span>
        </div>
        <div className="settings-actions">
          <button className="settings-btn danger" onClick={onLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </section>
  )
}

// Saved Wallets Section
function SavedWalletsSection({ wallets = [], onAdd, onRemove, onUpdateLabel, isPro, limits, onOpenPro }) {
  const [newWallet, setNewWallet] = useState('')
  const [error, setError] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [expandedWallet, setExpandedWallet] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showProPopup, setShowProPopup] = useState(false)
  const [successToast, setSuccessToast] = useState(null)

  const maxWallets = isPro ? 10 : (limits?.MAX_WALLETS || 1)
  const isAtFreeLimit = !isPro && wallets.length >= maxWallets

  // Normalize wallets to handle both string[] and {address, label}[] formats
  const normalizedWallets = wallets.map(w =>
    typeof w === 'string' ? { address: w, label: 'Unlabeled' } : w
  )

  const truncateWallet = (addr) => `${addr.slice(0, 4)}...${addr.slice(-4)}`

  const handleAdd = async () => {
    if (!newWallet.trim()) {
      setError('Please enter a wallet address')
      return
    }

    if (!isValidSolanaAddress(newWallet.trim())) {
      setError('Invalid Solana wallet address')
      return
    }

    if (normalizedWallets.some(w => w.address === newWallet.trim())) {
      setError('Wallet already saved')
      return
    }

    setError('')
    setIsAdding(true)

    try {
      await onAdd(newWallet.trim())
      setNewWallet('')
    } catch (err) {
      if (err.code === 'LIMIT_REACHED') {
        setShowUpgradeModal(true)
      } else {
        setError(err.message || 'Failed to add wallet')
      }
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemove = async (walletAddress) => {
    try {
      await onRemove(walletAddress)
    } catch (err) {
      console.error('Failed to remove wallet:', err)
    }
  }

  const handleLabelSelect = async (walletAddress, newLabel) => {
    if (!isPro) {
      setExpandedWallet(null)
      setShowProPopup(true)
      return
    }

    setIsUpdating(true)
    try {
      await onUpdateLabel(walletAddress, newLabel)
      setSuccessToast('Label saved!')
    } catch (err) {
      if (err.code === 'PRO_REQUIRED') {
        setShowProPopup(true)
      } else {
        setError(err.message || 'Failed to update label')
      }
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
    <section className="settings-section">
      <h2 className="settings-section-title">Saved Wallets</h2>
      <div className="settings-card glass-card">
        <div className="wallet-counter">
          <span>
            {normalizedWallets.length}/{isPro ? 'Unlimited' : maxWallets} wallets
            {!isPro && <span className="free-tag">(Free)</span>}
            {isPro && <ProBadge className="counter-badge" />}
          </span>
        </div>

        {normalizedWallets.length > 0 ? (
          <div className="wallet-list">
            {normalizedWallets.map((wallet, i) => {
              const isExpanded = expandedWallet === wallet.address
              const hasLabel = wallet.label && wallet.label !== 'Unlabeled'

              return (
                <div key={i} className="wallet-item wallet-item-with-label">
                  <div className="wallet-info">
                    <span className="wallet-address" title={wallet.address}>
                      {truncateWallet(wallet.address)}
                    </span>
                  </div>
                  <div className="wallet-actions">
                    <div className="wallet-label-area">
                      {hasLabel ? (
                        <button
                          className="wallet-label-badge-btn"
                          onClick={() => setExpandedWallet(isExpanded ? null : wallet.address)}
                          disabled={isUpdating}
                        >
                          <WalletLabelBadge label={wallet.label} size="small" />
                        </button>
                      ) : (
                        <button
                          className="add-label-btn"
                          onClick={() => setExpandedWallet(isExpanded ? null : wallet.address)}
                          disabled={isUpdating}
                        >
                          <span className="add-label-icon">🏷️</span>
                          <span>Add Label</span>
                        </button>
                      )}

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
                    <button
                      className="wallet-remove-btn"
                      onClick={() => handleRemove(wallet.address)}
                      title="Remove wallet"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="wallet-empty">No wallets saved yet</p>
        )}

        {isAtFreeLimit ? (
          <div className="wallet-limit-section">
            <p className="wallet-limit-msg">
              You've reached your free wallet limit.
            </p>
            <button className="upgrade-link" onClick={() => setShowUpgradeModal(true)}>
              Upgrade to Pro for unlimited wallets
            </button>
          </div>
        ) : (
          <>
            <div className="wallet-add">
              <input
                type="text"
                placeholder="Enter Solana wallet address"
                value={newWallet}
                onChange={(e) => setNewWallet(e.target.value)}
                className="wallet-input"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <button
                className="wallet-add-btn glass-button"
                onClick={handleAdd}
                disabled={isAdding}
              >
                {isAdding ? 'Adding...' : 'Add'}
              </button>
            </div>
            <p className="wallet-add-notice">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              All wallets you add will be included in your trading analysis and coaching. Adding wallets you don't control will make your insights inaccurate.
            </p>
          </>
        )}

        {error && <p className="wallet-error">{error}</p>}
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSuccess={() => setShowUpgradeModal(false)}
      />

      {/* Pro Feature Popup */}
      {showProPopup && (
        <ProFeaturePopup
          text="Wallet labels help organize your trading strategy and unlock smarter AI insights."
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
    </section>
  )
}

// Trader Profile Section
function TraderProfileSection({ user, onRetakeQuiz }) {
  const primary = user?.primaryArchetype ? ARCHETYPES[user.primaryArchetype] : null
  const secondary = user?.secondaryArchetype ? ARCHETYPES[user.secondaryArchetype] : null

  return (
    <section className="settings-section">
      <h2 className="settings-section-title">Trader Profile</h2>
      <div className="settings-card glass-card">
        {primary ? (
          <>
            <div className="profile-archetypes">
              <div className="profile-archetype-display">
                <span className="archetype-emoji-lg">{primary.emoji}</span>
                <div className="archetype-details">
                  <span className="archetype-type">Primary</span>
                  <span className="archetype-name-lg">{primary.name}</span>
                </div>
              </div>
              {secondary && (
                <div className="profile-archetype-display secondary">
                  <span className="archetype-emoji-lg">{secondary.emoji}</span>
                  <div className="archetype-details">
                    <span className="archetype-type">Secondary</span>
                    <span className="archetype-name-lg">{secondary.name}</span>
                  </div>
                </div>
              )}
            </div>
            <p className="profile-description">{primary.description}</p>
          </>
        ) : (
          <p className="profile-empty-msg">You haven't taken the trader personality quiz yet.</p>
        )}
        <div className="settings-actions">
          <button className="settings-btn" onClick={onRetakeQuiz}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {primary ? 'Retake Quiz' : 'Take Quiz'}
          </button>
        </div>
      </div>
    </section>
  )
}

// Help & Docs Section
function HelpDocsSection() {
  return (
    <section className="settings-section">
      <h2 className="settings-section-title">Help & Docs</h2>
      <div className="settings-card glass-card">
        <div className="help-links">
          <a href="#faq" className="help-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            <span>FAQ</span>
          </a>
          <a href="#how-to-use" className="help-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>How to use Hindsight</span>
          </a>
          <a href="#docs" className="help-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Documentation</span>
          </a>
        </div>
      </div>
    </section>
  )
}

// Main Settings Component
export default function Settings({ onNavigate, onRetakeQuiz, onOpenPro }) {
  const { user, logout, addWallet, removeWallet, updateWalletLabel } = useAuth()

  const handleLogout = () => {
    logout()
    onNavigate('landing')
  }

  const handleRetakeQuiz = () => {
    onRetakeQuiz()
  }

  const handleOpenPro = () => {
    if (onOpenPro) {
      onOpenPro()
    } else {
      onNavigate('pro')
    }
  }

  return (
    <div className="settings-page">
      <WaveBackground />
      <SettingsHeader
        user={user}
        onNavigate={onNavigate}
        onLogout={handleLogout}
      />

      <main className="settings-main">
        <h1 className="settings-title">Settings</h1>

        <AccountSection user={user} onLogout={handleLogout} />
        <SavedWalletsSection
          wallets={user?.savedWallets || []}
          onAdd={addWallet}
          onRemove={removeWallet}
          onUpdateLabel={updateWalletLabel}
          isPro={user?.isPro || false}
          limits={user?.limits}
          onOpenPro={handleOpenPro}
        />
        <TraderProfileSection user={user} onRetakeQuiz={handleRetakeQuiz} />
        <HelpDocsSection />
      </main>
    </div>
  )
}
