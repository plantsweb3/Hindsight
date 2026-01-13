import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LOADING_MESSAGES } from '../data/loadingMessages'
import { analyzeWallet, analyzeBehavior, isValidSolanaAddress, convertTradesToJournalEntries, createJournalEntriesBatch, getJournalPatterns, getCrossWalletStats } from '../services/solana'
import { getUserFriendlyError } from '../utils/helpers'

export default function WalletAnalysisModal({
  isOpen,
  onClose,
  onAnalysisComplete,
  onOpenProVerify
}) {
  const { user, token, saveAnalysis, addWallet, refreshUser } = useAuth()
  const [walletAddress, setWalletAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [messageIndex, setMessageIndex] = useState(0)
  const [isMessageVisible, setIsMessageVisible] = useState(true)
  const abortControllerRef = useRef(null)
  const fadeTimeoutRef = useRef(null)

  const isPro = user?.isPro || false
  const walletCount = user?.savedWallets?.length || 0
  const limits = user?.limits || { MAX_WALLETS: 1 }
  const atLimit = walletCount >= limits.MAX_WALLETS && !isPro

  // Cycle through loading messages with loop behavior for last 10 messages
  useEffect(() => {
    if (!isLoading) {
      setMessageIndex(0)
      return
    }

    const interval = setInterval(() => {
      // Fade out
      setIsMessageVisible(false)

      // After fade out, change message and fade in
      fadeTimeoutRef.current = setTimeout(() => {
        setMessageIndex((prev) => {
          // If we've hit the end, cycle through last 10 messages
          if (prev >= LOADING_MESSAGES.length - 1) {
            const cycleStart = LOADING_MESSAGES.length - 10
            const cyclePosition = (prev - cycleStart + 1) % 10
            return cycleStart + cyclePosition
          }
          return prev + 1
        })
        setIsMessageVisible(true)
      }, 300)
    }, 3500)

    return () => {
      clearInterval(interval)
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current)
      }
    }
  }, [isLoading])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setWalletAddress('')
      setError('')
      setIsLoading(false)
      setMessageIndex(0)
    }
  }, [isOpen])

  const handleAnalyze = async (e) => {
    e.preventDefault()

    const trimmedAddress = walletAddress.trim()
    if (!trimmedAddress) {
      setError('Please enter a wallet address')
      return
    }

    if (!isValidSolanaAddress(trimmedAddress)) {
      setError('Invalid Solana wallet address')
      return
    }

    setError('')
    setIsLoading(true)
    abortControllerRef.current = new AbortController()

    try {
      // Step 1: Get wallet trades and open positions
      const walletData = await analyzeWallet(
        trimmedAddress,
        () => {}, // Progress callback (we use messages instead)
        abortControllerRef.current.signal
      )

      if (!walletData.trades.length) {
        throw new Error('No trades found for this wallet')
      }

      // Step 2: Fetch journal patterns if authenticated
      let journalPatterns = null
      let crossWalletStats = null
      if (token) {
        journalPatterns = await getJournalPatterns(token)

        // For Pro users with multiple wallets, get cross-wallet comparison data
        if (isPro && user?.savedWallets?.length >= 2) {
          crossWalletStats = await getCrossWalletStats(token, user.savedWallets)
        }
      }

      // Step 3: Analyze behavior with AI
      const analysis = await analyzeBehavior(
        walletData.trades,
        walletData.stats,
        walletData.openPositions,
        () => {}, // Progress callback
        null, // userArchetype - not needed here
        journalPatterns,
        crossWalletStats
      )

      // Step 4: Save analysis (this also adds wallet to savedWallets)
      await saveAnalysis(trimmedAddress, analysis, walletData.stats)

      // Step 5: Also explicitly add wallet if saveAnalysis didn't
      try {
        await addWallet(trimmedAddress)
      } catch (err) {
        // Ignore if wallet already added or limit error (saveAnalysis should have handled it)
        if (err.code !== 'LIMIT_REACHED') {
          console.log('Wallet may already be added:', err.message)
        }
      }

      // Step 6: Create journal entries from trades
      const journalEntries = convertTradesToJournalEntries(walletData.trades, trimmedAddress)
      if (journalEntries.length > 0 && token) {
        try {
          await createJournalEntriesBatch(journalEntries, token)
        } catch (err) {
          console.error('Failed to create journal entries:', err)
        }
      }

      // Step 7: Refresh user data to get updated wallet list
      await refreshUser()

      // Step 8: Callback to parent and close
      onAnalysisComplete?.(trimmedAddress, analysis)
      onClose()
    } catch (err) {
      if (err.name === 'AbortError') {
        return // Cancelled by user
      }
      console.error('Analysis failed:', err)
      setError(getUserFriendlyError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    abortControllerRef.current?.abort()
    setIsLoading(false)
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose()
    }
  }

  if (!isOpen) return null

  // If at wallet limit, show Pro upgrade prompt
  if (atLimit) {
    return (
      <div className="wallet-analysis-modal-overlay" onClick={handleOverlayClick}>
        <div className="wallet-analysis-modal glass-card" onClick={e => e.stopPropagation()}>
          <button className="wallet-analysis-modal-close" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="wallet-analysis-pro-prompt">
            <div className="pro-prompt-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 className="pro-prompt-title">Upgrade to Pro</h2>
            <p className="pro-prompt-text">
              You've reached your free wallet limit ({limits.MAX_WALLETS} wallet).
              Verify $SIGHT holdings to track unlimited wallets.
            </p>
            <div className="pro-prompt-actions">
              <button
                className="pro-prompt-verify-btn"
                onClick={() => {
                  onClose()
                  onOpenProVerify?.()
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
                </svg>
                Verify $SIGHT
              </button>
              <button className="pro-prompt-later-btn" onClick={onClose}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wallet-analysis-modal-overlay" onClick={handleOverlayClick}>
      <div className="wallet-analysis-modal" onClick={e => e.stopPropagation()}>
        {!isLoading && (
          <button className="wallet-analysis-modal-close" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {!isLoading ? (
          // Input state with breathing glow
          <div className="wallet-analysis-input-state">
            <div className="wallet-analysis-logo">
              <img src="/hindsightlogo.png" alt="Hindsight" />
            </div>
            <h2 className="wallet-analysis-title">Analyze Your Wallet</h2>
            <p className="wallet-analysis-subtitle">
              Paste your Solana wallet address to get personalized trading insights
            </p>

            <form className="wallet-analysis-form" onSubmit={handleAnalyze}>
              <div className="hero-input-wrapper hero-input-breathing">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Paste any Solana wallet address"
                  className="hero-wallet-input"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!walletAddress.trim()}
                  className="hero-analyze-btn"
                >
                  Analyze
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              {error && (
                <div className="wallet-analysis-error">
                  <span>{error}</span>
                  <button className="error-dismiss" onClick={() => setError('')} type="button" aria-label="Dismiss error">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </form>
          </div>
        ) : (
          // Loading state with spinning glow + messages
          <div className="hero-loading-card">
            <div className="hero-loading-glow"></div>
            <div className="hero-loading-content">
              {/* Animated Logo */}
              <div className="hero-loading-logo">
                <img src="/hindsightlogo.png" alt="Hindsight" />
              </div>

              {/* Loading Message */}
              <div className="hero-loading-message-container">
                <p className={`hero-loading-message ${isMessageVisible ? 'visible' : ''}`}>
                  {LOADING_MESSAGES[messageIndex]}
                </p>
              </div>

              {/* Bouncing Dots */}
              <div className="hero-loading-dots">
                <span style={{ animationDelay: '0ms' }}></span>
                <span style={{ animationDelay: '150ms' }}></span>
                <span style={{ animationDelay: '300ms' }}></span>
              </div>

              {/* Cancel Button */}
              <button onClick={handleCancel} className="hero-loading-cancel">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
