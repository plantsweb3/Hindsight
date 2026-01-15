import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { isValidSolanaAddress } from '../services/solana'

// Modal shown when user's Pro status has expired and they need to top up
export default function ProExpiredModal({ isOpen, onClose, onSuccess }) {
  const { token, refreshUser } = useAuth()
  const [walletAddress, setWalletAddress] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleVerify = async (e) => {
    e.preventDefault()

    if (!walletAddress.trim()) {
      setError('Please enter a wallet address')
      return
    }

    if (!isValidSolanaAddress(walletAddress.trim())) {
      setError('Invalid Solana wallet address')
      return
    }

    setError('')
    setIsVerifying(true)

    try {
      const res = await fetch('/api/auth/verify-sight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ walletAddress: walletAddress.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.insufficientBalance) {
          setError(`Insufficient $SIGHT balance. You need ${data.requiredBalance} SOL worth to maintain Pro status.`)
        } else {
          setError(data.error || 'Verification failed')
        }
        return
      }

      // Success! User is Pro again
      setSuccess(true)
      await refreshUser()

      setTimeout(() => {
        onClose()
        onSuccess?.()
      }, 2000)
    } catch (err) {
      console.error('Verification error:', err)
      setError('Failed to verify wallet. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleClose = () => {
    setWalletAddress('')
    setError('')
    setSuccess(false)
    onClose()
  }

  return (
    <div className="upgrade-modal-overlay" onClick={handleClose}>
      <div className="upgrade-modal glass-card pro-expired-modal" onClick={e => e.stopPropagation()}>
        <button className="upgrade-modal-close" onClick={handleClose} aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {success ? (
          <div className="verify-success">
            <div className="verify-success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="verify-success-title">Pro Status Restored!</h2>
            <p className="verify-success-text">Welcome back to Hindsight Pro.</p>
          </div>
        ) : (
          <>
            <div className="upgrade-modal-header">
              <div className="upgrade-modal-icon pro-expired-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h2 className="upgrade-modal-title">Pro Status Expired</h2>
              <p className="upgrade-modal-subtitle">
                Your $SIGHT balance has fallen below the required threshold.
                Top up your holdings to restore Pro access.
              </p>
            </div>

            <div className="pro-expired-info">
              <div className="pro-expired-requirement">
                <span className="requirement-label">Required:</span>
                <span className="requirement-value">0.25 SOL worth of $SIGHT</span>
              </div>
            </div>

            <form onSubmit={handleVerify} className="verify-form">
              <div className="verify-input-wrapper">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter wallet with $SIGHT"
                  className="verify-input"
                  disabled={isVerifying}
                />
              </div>

              {error && (
                <div className="verify-error">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="verify-submit-btn"
                disabled={isVerifying || !walletAddress.trim()}
              >
                {isVerifying ? (
                  <>
                    <span className="btn-spinner" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Verify & Restore Pro
                  </>
                )}
              </button>
            </form>

            <div className="verify-footer">
              <a
                href="https://pump.fun/coin/DWxk2VaurkbvFGK8cQ15BHf7ene38ngXaMy5K38ipump"
                target="_blank"
                rel="noopener noreferrer"
                className="verify-buy-link"
              >
                Buy more $SIGHT on pump.fun
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
