import { useState, useEffect, useRef, useCallback } from 'react'
import html2canvas from 'html2canvas'

// Shared Wave Background (same as landing page)
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

// Shared Cursor Glow (same as landing page)
function CursorGlow() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isVisible, setIsVisible] = useState(false)
  const lastUpdate = useRef(0)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now()
      if (now - lastUpdate.current < 16) return
      lastUpdate.current = now

      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setIsVisible(false), 150)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      className="cursor-glow"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        opacity: isVisible ? 1 : 0,
      }}
    />
  )
}

// Header
function Header({ onReset }) {
  return (
    <header className="results-header">
      <a href="/" className="header-logo" onClick={(e) => { e.preventDefault(); onReset(); }}>
        <img src="/hindsightlogo.png" alt="Hindsight" className="header-logo-img" />
        <span className="header-title">hindsight</span>
      </a>
      <button onClick={onReset} className="header-action">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Analyze another
      </button>
    </header>
  )
}

// Stat Card with glassmorphism
function StatCard({ label, value, highlight }) {
  return (
    <div className={`stat-card glass-card ${highlight ? 'stat-highlight' : ''}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

// Pattern Card with glassmorphism
function PatternCard({ pattern }) {
  return (
    <div className="pattern-card glass-card">
      <div className="pattern-header">
        <div className="pattern-dot" />
        <h3 className="pattern-name">{pattern.name}</h3>
      </div>
      <p className="pattern-description">{pattern.description}</p>
      <div className="pattern-fix">
        <div className="fix-label">Correction</div>
        <p className="fix-text">{pattern.correction}</p>
      </div>
    </div>
  )
}

// Share Card Component with Image Generation
function ShareCard({ analysis, stats }) {
  const cardRef = useRef(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [imageGenerated, setImageGenerated] = useState(false)

  // Parse win rate to determine color
  const winRateNum = parseInt(analysis.winRate)
  const isWinning = winRateNum >= 50

  // Get top pattern
  const topPattern = analysis.patterns?.[0]?.name || 'Unknown Pattern'

  const [showToast, setShowToast] = useState(false)
  const [clipboardSupported, setClipboardSupported] = useState(false)

  // Check clipboard support on mount
  useEffect(() => {
    setClipboardSupported('clipboard' in navigator && 'write' in navigator.clipboard)
  }, [])

  const generateAndShare = useCallback(async (openTwitter = true) => {
    if (!cardRef.current || isGenerating) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      })

      // Create and trigger download
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'hindsight-analysis.png'
      link.href = dataUrl
      link.click()

      setImageGenerated(true)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 4000)

      // Open Twitter with pre-filled text (simplified - no verdict)
      if (openTwitter) {
        const tweetText = encodeURIComponent(
          `Just got my trading patterns analyzed by @tradehindsight\n\nAnalyze yours: tradehindsight.com`
        )
        setTimeout(() => {
          window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank')
        }, 500)
      }
    } catch (err) {
      console.error('Failed to generate image:', err)
    } finally {
      setIsGenerating(false)
    }
  }, [isGenerating])

  const copyImageToClipboard = useCallback(async () => {
    if (!cardRef.current) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      })

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])

      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (err) {
      console.error('Failed to copy image:', err)
    } finally {
      setIsGenerating(false)
    }
  }, [])

  return (
    <div className="share-section">
      <h3 className="share-title">Share your results</h3>

      {/* Card preview for image generation */}
      <div className="share-card-wrapper">
        <div ref={cardRef} className="share-card-canvas">
          {/* Subtle wave rings background */}
          <div className="share-card-bg">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="share-ring"
                style={{
                  width: `${300 + i * 120}px`,
                  height: `${300 + i * 120}px`,
                  opacity: 0.12 - i * 0.015,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="share-card-content">
            {/* Header - actual logo + text */}
            <div className="share-card-header">
              <img src="/hindsightlogo.png" alt="" className="share-card-logo" />
              <span className="share-card-brand">hindsight</span>
            </div>

            {/* Verdict */}
            <div className="share-card-verdict-section">
              <div className="share-card-verdict-label">THE VERDICT</div>
              <div className="share-card-verdict">"{analysis.verdict}"</div>
            </div>

            {/* Stats in glassmorphic boxes */}
            <div className="share-card-stats">
              <div className={`share-card-stat ${!isWinning ? 'stat-box-red' : 'stat-box-green'}`}>
                <div className={`share-card-stat-value ${isWinning ? 'stat-green' : 'stat-red'}`}>
                  {analysis.winRate}
                </div>
                <div className="share-card-stat-label">WIN RATE</div>
              </div>
              <div className="share-card-stat">
                <div className="share-card-stat-value stat-purple">{stats.dexTrades}</div>
                <div className="share-card-stat-label">TRADES</div>
              </div>
              <div className="share-card-stat">
                <div className="share-card-stat-value stat-purple">{analysis.avgHoldTime}</div>
                <div className="share-card-stat-label">AVG HOLD</div>
              </div>
            </div>

            {/* Top Pattern */}
            <div className="share-card-pattern">
              <span className="share-card-pattern-dot" />
              <span className="share-card-pattern-text">Top Pattern: {topPattern.toUpperCase()}</span>
            </div>

            {/* CTA */}
            <div className="share-card-cta">
              Analyze yours → tradehindsight.com
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="share-buttons">
        <button
          onClick={() => generateAndShare(true)}
          disabled={isGenerating}
          className="share-btn share-btn-twitter"
        >
          {isGenerating ? (
            <>
              <span className="share-spinner" />
              Generating...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </>
          )}
        </button>
        {clipboardSupported && (
          <button
            onClick={copyImageToClipboard}
            disabled={isGenerating}
            className="share-btn share-btn-copy"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy image
          </button>
        )}
        <button
          onClick={() => generateAndShare(false)}
          disabled={isGenerating}
          className="share-btn share-btn-download"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="share-toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Image ready! Attach it to your tweet.
        </div>
      )}
    </div>
  )
}

// Progress CTA Section
function ProgressCTA({ isAuthenticated, onStartTracking }) {
  return (
    <div className="progress-cta glass-card">
      <div className="cta-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>
      <h3 className="cta-title">Want to track your progress?</h3>
      <p className="cta-description">
        Save your analysis, get weekly insights, and see if your corrections are actually working.
      </p>
      <button className="cta-btn btn-primary" onClick={onStartTracking}>
        Start tracking
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
      {!isAuthenticated && <p className="cta-note">Sign up to start tracking your trades</p>}
    </div>
  )
}

// Main Results Component
export default function Results({ analysis, stats, onReset, isAuthenticated, onShowAuth, onOpenJournal }) {
  const handleStartTracking = () => {
    if (isAuthenticated) {
      onOpenJournal()
    } else {
      onShowAuth('signup')
    }
  }

  return (
    <div className="results-page">
      <WaveBackground />
      <CursorGlow />
      <Header onReset={onReset} />

      <main className="results-content">
        {/* Verdict Section */}
        <section className="verdict-section">
          <div className="verdict-label">The Verdict</div>
          <h1 className="verdict-text">{analysis.verdict}</h1>
        </section>

        {/* Stats Grid */}
        <section className="stats-section">
          <div className="stats-grid">
            <StatCard label="Total Trades" value={stats.dexTrades} />
            <StatCard label="Buys" value={stats.buys} />
            <StatCard label="Sells" value={stats.sells} />
            <StatCard label="Win Rate" value={analysis.winRate} highlight />
          </div>
          {/* History Depth Indicator */}
          {stats.historyDays > 0 && (
            <div className="history-indicator">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Analyzed {stats.totalTransactions} transactions from {stats.historyDays} days of history
            </div>
          )}
        </section>

        {/* Hold Time Card */}
        <section className="holdtime-section">
          <div className="holdtime-card glass-card">
            <div className="holdtime-content">
              <div className="holdtime-label">Average Hold Time</div>
              <div className="holdtime-value">{analysis.avgHoldTime}</div>
            </div>
            <div className="holdtime-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
          </div>
        </section>

        {/* Patterns Section */}
        <section className="patterns-section">
          <h2 className="section-title">Behavioral Patterns</h2>
          <div className="patterns-grid">
            {analysis.patterns.map((pattern, i) => (
              <PatternCard key={i} pattern={pattern} />
            ))}
          </div>
        </section>

        {/* Share Section */}
        <ShareCard analysis={analysis} stats={stats} />

        {/* Progress CTA */}
        <ProgressCTA isAuthenticated={isAuthenticated} onStartTracking={handleStartTracking} />

        {/* Footer CTA */}
        <section className="footer-cta">
          <p className="footer-message">Your patterns are fixable. Awareness is the first step.</p>
          <button onClick={onReset} className="analyze-btn btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Analyze another wallet
          </button>
        </section>
      </main>
    </div>
  )
}
