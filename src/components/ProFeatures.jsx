import { useState } from 'react'
import VerifySightModal from './VerifySightModal'

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

// Feature Card
function FeatureCard({ icon, title, description, note, comingSoon }) {
  return (
    <div className={`pro-feature-card glass-card ${comingSoon ? 'coming-soon' : ''}`}>
      <div className="pro-feature-icon">{icon}</div>
      <h3 className="pro-feature-title">
        {title}
        {comingSoon && <span className="coming-soon-badge">Coming Soon</span>}
      </h3>
      <p className="pro-feature-description">{description}</p>
      {note && <p className="pro-feature-note">{note}</p>}
    </div>
  )
}

// Main Pro Features Component
export default function ProFeatures({ onBack, onVerifySuccess }) {
  const [showVerifyModal, setShowVerifyModal] = useState(false)

  const handleVerifySuccess = () => {
    setShowVerifyModal(false)
    onVerifySuccess?.()
  }

  const features = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
          <path d="M7 8h2" />
          <path d="M7 12h4" />
        </svg>
      ),
      title: 'Unlimited Wallets',
      description: 'Track all your wallets in one place. Most traders use 3-5 wallets for different strategies — now you can analyze them all.',
      note: 'All tracked wallets are included in your cross-wallet analysis, so only add wallets you actually trade from.',
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
      title: 'Wallet Labels',
      description: 'Tag wallets as Main, Long Hold, Gamble, Sniper, or custom labels. Your AI coaching understands the difference between your degen plays and your conviction holds.',
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      title: 'Cross-Wallet Insights',
      description: '"Your Gamble wallet is killing it but your Main wallet shows FOMO patterns." Get analysis that sees your full trading picture.',
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M8 7h8" />
          <path d="M8 11h8" />
          <path d="M8 15h4" />
        </svg>
      ),
      title: 'Unlimited Journal Entries',
      description: 'Document every trade. Build a dataset of your own psychology. The more you journal, the smarter your coaching gets.',
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      title: 'ATH Tracking',
      description: 'See exactly how much you left on the table — or celebrate when you nail the exit. Know your timing on every trade.',
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      title: 'Daily Analysis',
      description: 'Wake up to fresh insights on yesterday\'s trades. AI reviews your activity and surfaces what matters.',
      comingSoon: true,
    },
  ]

  return (
    <div className="pro-page">
      <WaveBackground />

      {/* Header */}
      <header className="pro-header">
        <button className="pro-back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="pro-header-logo">
          <img src="/hindsightlogo.png" alt="Hindsight" className="header-logo-img" />
          <span className="header-title">hindsight</span>
        </div>
      </header>

      <main className="pro-content">
        {/* Hero */}
        <section className="pro-hero">
          <div className="pro-badge-large">PRO</div>
          <h1 className="pro-headline">Pro Features</h1>
          <p className="pro-subheadline">For serious traders who want every edge.</p>
        </section>

        {/* Features Grid */}
        <section className="pro-features-grid">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} />
          ))}
        </section>

        {/* Divider */}
        <div className="pro-divider" />

        {/* How to Unlock */}
        <section className="pro-unlock-section">
          <h2 className="pro-unlock-title">How to Unlock</h2>
          <p className="pro-unlock-description">
            Hold <span className="highlight">0.25 SOL</span> worth of <span className="highlight">$SIGHT</span> in any tracked wallet.
          </p>

          <div className="pro-unlock-actions">
            <a
              href="https://pump.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="pro-btn pro-btn-primary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Buy $SIGHT on pump.fun
            </a>
            <button className="pro-btn pro-btn-secondary" onClick={() => setShowVerifyModal(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
              </svg>
              I already hold — Verify wallet
            </button>
          </div>
        </section>

        {/* Token Info */}
        <section className="pro-token-info glass-card">
          <div className="token-info-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <p>
            $SIGHT token powers the Hindsight ecosystem. Pro status is verified when you add a wallet containing $SIGHT.
          </p>
        </section>
      </main>

      <VerifySightModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onSuccess={handleVerifySuccess}
      />
    </div>
  )
}
