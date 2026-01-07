import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ARCHETYPES } from '../data/quizData'
import { isValidSolanaAddress } from '../services/solana'
import { ProBadge } from './ProBadge'
import UpgradeModal from './UpgradeModal'
import WalletLabelBadge, { LABEL_COLORS } from './WalletLabelBadge'

// Available wallet labels
const WALLET_LABELS = ['Main', 'Long Hold', 'Gamble', 'Sniper', 'Unlabeled']

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
  const [pendingLabels, setPendingLabels] = useState({}) // Track unsaved label changes

  const maxWallets = isPro ? 10 : (limits?.MAX_WALLETS || 1)
  const isAtFreeLimit = !isPro && wallets.length >= maxWallets

  // Normalize wallets to handle both string[] and {address, label}[] formats
  const normalizedWallets = wallets.map(w =>
    typeof w === 'string' ? { address: w, label: 'Unlabeled' } : w
  )

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
      // Handle limit reached error
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
      // Clear any pending label for this wallet
      setPendingLabels(prev => {
        const updated = { ...prev }
        delete updated[walletAddress]
        return updated
      })
    } catch (err) {
      console.error('Failed to remove wallet:', err)
    }
  }

  const handleLabelChange = (walletAddress, newLabel) => {
    // Track the pending label change
    setPendingLabels(prev => ({
      ...prev,
      [walletAddress]: newLabel
    }))
  }

  const handleLabelSave = async (walletAddress) => {
    const newLabel = pendingLabels[walletAddress]
    if (!newLabel) return

    // Pro gate on save
    if (!isPro) {
      setShowUpgradeModal(true)
      return
    }

    try {
      await onUpdateLabel(walletAddress, newLabel)
      // Clear the pending label after successful save
      setPendingLabels(prev => {
        const updated = { ...prev }
        delete updated[walletAddress]
        return updated
      })
    } catch (err) {
      if (err.code === 'PRO_REQUIRED') {
        setShowUpgradeModal(true)
      } else {
        setError(err.message || 'Failed to update label')
      }
    }
  }

  const truncateWallet = (addr) => `${addr.slice(0, 4)}...${addr.slice(-4)}`

  const getDisplayLabel = (wallet) => {
    // Show pending label if exists, otherwise show saved label
    return pendingLabels[wallet.address] || wallet.label || 'Unlabeled'
  }

  const hasPendingChange = (walletAddress) => {
    return pendingLabels[walletAddress] !== undefined
  }

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
              const displayLabel = getDisplayLabel(wallet)
              const hasPending = hasPendingChange(wallet.address)
              const labelColors = LABEL_COLORS[displayLabel] || LABEL_COLORS['Unlabeled']

              return (
                <div key={i} className="wallet-item wallet-item-with-label">
                  <div className="wallet-info">
                    <span className="wallet-address" title={wallet.address}>
                      {truncateWallet(wallet.address)}
                    </span>
                    <WalletLabelBadge label={wallet.label} size="small" />
                  </div>
                  <div className="wallet-actions">
                    <div className="wallet-label-control">
                      <select
                        className="wallet-label-select"
                        value={displayLabel}
                        onChange={(e) => handleLabelChange(wallet.address, e.target.value)}
                        style={{
                          borderColor: labelColors.border,
                          color: labelColors.text,
                        }}
                      >
                        {WALLET_LABELS.map(label => (
                          <option key={label} value={label}>{label}</option>
                        ))}
                      </select>
                      {hasPending && (
                        <button
                          className="wallet-label-save-btn"
                          onClick={() => handleLabelSave(wallet.address)}
                          title={isPro ? 'Save label' : 'Pro feature - click to upgrade'}
                        >
                          {isPro ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                          )}
                        </button>
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
