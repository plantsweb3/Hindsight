import { useState } from 'react'

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

// Strength/Weakness List
function TraitList({ items, type }) {
  return (
    <ul className={`trait-list trait-list-${type}`}>
      {items.map((item, i) => (
        <li key={i} className="trait-item">
          <span className={`trait-icon trait-icon-${type}`}>
            {type === 'strength' ? '+' : '-'}
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

// Main Quiz Result Component
export default function QuizResult({ results, onAnalyze, onRetake, onBack }) {
  const [walletAddress, setWalletAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { primaryData, secondaryData, primary, secondary } = results

  const handleSubmit = (e) => {
    e.preventDefault()
    if (walletAddress.trim()) {
      setIsLoading(true)
      onAnalyze(walletAddress.trim(), results)
    }
  }

  return (
    <div className="quiz-result-page">
      <WaveBackground />

      <header className="quiz-header">
        <a href="/" className="header-logo" onClick={(e) => { e.preventDefault(); onBack(); }}>
          <img src="/hindsightlogo.png" alt="Hindsight" className="header-logo-img" />
          <span className="header-title">hindsight</span>
        </a>
        <button onClick={onRetake} className="header-action">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
          Retake quiz
        </button>
      </header>

      <main className="quiz-result-content">
        {/* Primary Archetype Hero */}
        <section className="archetype-hero">
          <div className="archetype-badge">YOUR TRADER TYPE</div>
          <div className="archetype-emoji">{primaryData.emoji}</div>
          <h1 className="archetype-name">{primaryData.name}</h1>
          <p className="archetype-secondary">
            with a hint of <span className="secondary-highlight">{secondaryData.emoji} {secondaryData.name}</span>
          </p>
        </section>

        {/* Description */}
        <section className="archetype-description glass-card">
          <p>{primaryData.description}</p>
        </section>

        {/* Strengths & Weaknesses */}
        <section className="archetype-traits">
          <div className="trait-card glass-card">
            <h3 className="trait-title">
              <span className="trait-title-icon">+</span>
              Strengths
            </h3>
            <TraitList items={primaryData.strengths} type="strength" />
          </div>

          <div className="trait-card glass-card">
            <h3 className="trait-title">
              <span className="trait-title-icon trait-title-icon-weak">-</span>
              Weaknesses
            </h3>
            <TraitList items={primaryData.weaknesses} type="weakness" />
          </div>
        </section>

        {/* Coaching */}
        <section className="archetype-coaching glass-card">
          <div className="coaching-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h3 className="coaching-title">Coaching Focus</h3>
          <p className="coaching-text">{primaryData.coaching}</p>
        </section>

        {/* CTA Section */}
        <section className="archetype-cta glass-card">
          <h3 className="cta-heading">Ready to see the data?</h3>
          <p className="cta-description">{primaryData.cta}</p>

          <form onSubmit={handleSubmit} className="cta-form">
            <div className="cta-input-wrapper">
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter your Solana wallet address"
                className="cta-input"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="cta-submit btn-primary"
              disabled={!walletAddress.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="btn-spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze my wallet
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Secondary Archetype Teaser */}
        <section className="secondary-archetype">
          <h4 className="secondary-title">Your secondary tendency</h4>
          <div className="secondary-card glass-card">
            <div className="secondary-header">
              <span className="secondary-emoji">{secondaryData.emoji}</span>
              <span className="secondary-name">{secondaryData.name}</span>
            </div>
            <p className="secondary-description">{secondaryData.description}</p>
          </div>
        </section>
      </main>
    </div>
  )
}
