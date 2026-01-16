import { useState } from 'react'
import VerifySightModal from './VerifySightModal'

// Upgrade Modal - Shows when user hits free tier limit
export default function UpgradeModal({ isOpen, onClose, onSuccess }) {
  const [showVerifyModal, setShowVerifyModal] = useState(false)

  if (!isOpen && !showVerifyModal) return null

  const handleVerifyClick = () => {
    setShowVerifyModal(true)
  }

  const handleVerifyClose = () => {
    setShowVerifyModal(false)
  }

  const handleVerifySuccess = () => {
    setShowVerifyModal(false)
    onClose()
    onSuccess?.()
  }

  // Show verify modal if open
  if (showVerifyModal) {
    return (
      <VerifySightModal
        isOpen={true}
        onClose={handleVerifyClose}
        onSuccess={handleVerifySuccess}
      />
    )
  }

  if (!isOpen) return null

  return (
    <div className="upgrade-modal-overlay" onClick={onClose}>
      <div className="upgrade-modal glass-card" onClick={e => e.stopPropagation()}>
        <button className="upgrade-modal-close" onClick={onClose} aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="upgrade-modal-header">
          <div className="upgrade-modal-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="upgrade-modal-title">Unlock Pro Features</h2>
          <p className="upgrade-modal-subtitle">You've reached your free limit.</p>
          <p className="upgrade-modal-subtitle">Hold $SIGHT to unlock unlimited access.</p>
        </div>

        <div className="upgrade-modal-features">
          <p className="features-label">Pro includes:</p>
          <ul className="features-list">
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Unlimited wallet tracking
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Unlimited journal entries
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Wallet labels (Main, Gamble, Long Hold)
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Cross-wallet pattern analysis
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              ATH tracking on every trade
            </li>
          </ul>
        </div>

        <div className="upgrade-modal-actions">
          <button className="upgrade-modal-btn primary" onClick={handleVerifyClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
            </svg>
            I already hold $SIGHT
            <span className="btn-hint">Verify wallet to unlock</span>
          </button>

          <a
            href="https://pump.fun"
            target="_blank"
            rel="noopener noreferrer"
            className="upgrade-modal-btn secondary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Get $SIGHT
            <span className="btn-hint">Buy on pump.fun</span>
          </a>
        </div>

        <p className="upgrade-modal-requirement">
          Requirement: 0.25 SOL worth of $SIGHT
        </p>
      </div>
    </div>
  )
}
