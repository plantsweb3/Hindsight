import { useState, useEffect, useRef } from 'react'

// Optimized CSS-only Wave Background
function RippleBackground() {
  return (
    <div className="wave-background">
      {/* Multiple wave rings using CSS only */}
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

// Optimized Cursor Trail with throttling
function CursorTrail() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isVisible, setIsVisible] = useState(false)
  const lastUpdate = useRef(0)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Throttle to ~60fps (16ms)
      const now = Date.now()
      if (now - lastUpdate.current < 16) return
      lastUpdate.current = now

      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)

      // Fade out when mouse stops
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
function Header({ onLogoClick, onShowAuth, onOpenDashboard, onOpenJournal, isAuthenticated, user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavAction = (action) => {
    setMobileMenuOpen(false)
    action()
  }

  return (
    <header className="site-header">
      <a href="/" onClick={onLogoClick} className="header-logo">
        <img src="/hindsightlogo.png" alt="Hindsight" className="header-logo-img" />
        <span className="header-title">hindsight</span>
      </a>

      {/* Desktop nav */}
      <div className="header-nav header-nav-desktop">
        {isAuthenticated ? (
          <>
            <button onClick={onOpenJournal} className="nav-link-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Journal
            </button>
            <button onClick={onOpenDashboard} className="nav-user-btn">
              <span className="nav-user-avatar">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
              <span className="nav-user-name">{user?.username}</span>
            </button>
          </>
        ) : (
          <div className="nav-auth-buttons">
            <button onClick={() => onShowAuth('login')} className="nav-auth-btn nav-login">
              Log in
            </button>
            <button onClick={() => onShowAuth('signup')} className="nav-auth-btn nav-signup">
              Sign up
            </button>
          </div>
        )}
      </div>

      {/* Mobile hamburger button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {mobileMenuOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <path d="M3 12h18" />
              <path d="M3 6h18" />
              <path d="M3 18h18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav-drawer" onClick={e => e.stopPropagation()}>
            <div className="mobile-nav-header">
              <span className="mobile-nav-title">Menu</span>
              <button className="mobile-nav-close" onClick={() => setMobileMenuOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="mobile-nav-links">
              {isAuthenticated ? (
                <>
                  <button onClick={() => handleNavAction(onOpenDashboard)} className="mobile-nav-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="9" />
                      <rect x="14" y="3" width="7" height="5" />
                      <rect x="14" y="12" width="7" height="9" />
                      <rect x="3" y="16" width="7" height="5" />
                    </svg>
                    Dashboard
                  </button>
                  <button onClick={() => handleNavAction(onOpenJournal)} className="mobile-nav-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    Journal
                  </button>
                  <div className="mobile-nav-user">
                    <span className="mobile-nav-avatar">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                    <span className="mobile-nav-username">{user?.username}</span>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => handleNavAction(() => onShowAuth('login'))} className="mobile-nav-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Log in
                  </button>
                  <button onClick={() => handleNavAction(() => onShowAuth('signup'))} className="mobile-nav-link mobile-nav-signup">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    Sign up
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

// Hero Section
function HeroSection({ onScrollDown }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-logo">
          <img src="/hindsightlogo.png" alt="Hindsight" className="hero-logo-img" />
        </div>

        <h1 className="hero-headline">
          See the behavioral patterns <span className="text-gradient-purple">draining</span> your PnL.
        </h1>

        <p className="hero-subheadline">
          Hindsight analyzes your Solana wallet and shows you exactly why you keep losing—with brutal honesty and specific fixes.
        </p>

        <button className="hero-cta glass-button" onClick={onScrollDown}>
          Analyze my trading
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>
  )
}

// Comparison Section
function ComparisonSection() {
  const otherTools = [
    'Generic advice that doesn\'t stick',
    'No accountability or tracking',
    'Hype-driven, not data-driven',
    'One-size-fits-all insights',
    'No behavioral analysis',
  ]

  const hindsight = [
    'Brutal truth with specific fixes',
    'Track if corrections actually work',
    'Pure behavioral pattern detection',
    'Personalized to your wallet + style',
    'AI analyzes every trade',
  ]

  return (
    <section className="comparison-section">
      <div className="section-container">
        <h2 className="section-headline">Other Tools vs <span className="text-gradient-purple">Hindsight</span></h2>

        <div className="comparison-grid">
          <div className="comparison-card glass-card comparison-other">
            <h3 className="comparison-title">Other Tools</h3>
            <ul className="comparison-list">
              {otherTools.map((item, i) => (
                <li key={i} className="comparison-item comparison-item-bad">
                  <span className="comparison-icon">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="comparison-card glass-card comparison-hindsight">
            <h3 className="comparison-title">Hindsight</h3>
            <ul className="comparison-list">
              {hindsight.map((item, i) => (
                <li key={i} className="comparison-item comparison-item-good">
                  <span className="comparison-icon">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// Features Section
function FeaturesSection({ onOpenPro }) {
  const features = [
    {
      title: 'Behavioral Patterns',
      items: ['FOMO detection', 'Panic sell identification', 'Revenge trading alerts'],
      pro: false,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      ),
    },
    {
      title: 'Specific Corrections',
      items: ['Not generic advice', 'Rules tailored to your patterns', 'Track if they work'],
      pro: false,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      title: 'Open Position Analysis',
      items: ['Diamond handing winners?', 'Bagholding losers?', 'Real-time context'],
      pro: false,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      title: 'Win Rate Reality',
      items: ['Not what you think', 'Backed by on-chain data', 'Can\'t lie to yourself'],
      pro: false,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 20V10" />
          <path d="M12 20V4" />
          <path d="M6 20v-6" />
        </svg>
      ),
    },
    {
      title: 'Progress Tracking',
      items: ['Are you improving?', 'Historical comparisons', 'Accountability loop'],
      pro: true,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
    {
      title: 'Trading Journal',
      items: ['Add context to trades', 'AI detects patterns in notes', 'Build discipline'],
      pro: true,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
  ]

  return (
    <section className="features-section">
      <div className="section-container">
        <h2 className="section-headline">What You Get</h2>

        <div className="features-grid">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`feature-card glass-card ${feature.pro ? 'feature-card-pro' : ''}`}
              onClick={feature.pro ? onOpenPro : undefined}
              style={feature.pro ? { cursor: 'pointer' } : undefined}
            >
              {feature.pro && <span className="pro-badge">Pro</span>}
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <ul className="feature-list">
                {feature.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
              {feature.pro && (
                <span className="feature-pro-hint">Click to learn more</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Choice Section
function ChoiceSection({ onQuickAnalyze, onDigDeep }) {
  return (
    <section className="choice-section" id="choice-section">
      <div className="section-container">
        <div className="choice-cards">
          <div className="choice-card glass-card choice-primary">
            <div className="choice-badge">Recommended</div>
            <h3 className="choice-title">Dig Deep</h3>
            <p className="choice-subtitle">
              Build awareness. Track progress. Change behavior.
            </p>
            <ul className="choice-features">
              <li>Take 60-second trader quiz</li>
              <li>Save your analysis</li>
              <li>Track if corrections work</li>
              <li>Get ongoing insights</li>
            </ul>
            <button className="choice-btn btn-primary" onClick={onDigDeep}>
              Start building discipline
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="choice-card glass-card">
            <h3 className="choice-title">Quick Analyze</h3>
            <p className="choice-subtitle">
              Just show me what I'm doing wrong.
            </p>
            <ul className="choice-features">
              <li>Paste any Solana wallet</li>
              <li>Instant analysis</li>
              <li>No quiz required</li>
              <li>Pure brutal truth</li>
            </ul>
            <button className="choice-btn btn-secondary" onClick={onQuickAnalyze}>
              Analyze wallet
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'How does it work?',
      answer: 'Hindsight reads your public on-chain transaction history, identifies DEX trades, calculates your actual PnL, and uses AI to detect behavioral patterns like FOMO entries, panic sells, and revenge trading. Everything is read-only—we never touch your funds.',
    },
    {
      question: 'Is my wallet data safe?',
      answer: 'Yes. We only read publicly available blockchain data. No wallet connection required, no private keys, no permissions. Your transaction history is already public on Solana—we just analyze it.',
    },
    {
      question: 'What\'s the difference between Quick Analyze and Dig Deep?',
      answer: 'Quick Analyze gives you instant insights on any wallet. Dig Deep adds a personality quiz for better context, saves your analysis history, tracks whether corrections actually improve your trading, and provides ongoing accountability.',
    },
    {
      question: 'What do token holders get?',
      answer: 'Token holders get access to Pro features: Progress Tracking to see if you\'re improving over time, Trading Journal to add context and let AI find patterns in your notes, and priority access to new features.',
    },
    {
      question: 'How accurate is the analysis?',
      answer: 'The PnL calculations are 100% accurate—they\'re based on actual on-chain data. The behavioral analysis uses AI pattern matching which is highly accurate for common patterns, though interpretation may vary for edge cases.',
    },
  ]

  return (
    <section className="faq-section">
      <div className="section-container">
        <h2 className="section-headline">Frequently Asked Questions</h2>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item glass-card ${openIndex === i ? 'faq-open' : ''}`}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="faq-question">
                <span>{faq.question}</span>
                <svg
                  className="faq-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-container">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/hindsightlogo.png" alt="Hindsight" />
            <span>hindsight</span>
          </div>
          <p className="footer-tagline">See clearly. Trade better.</p>
        </div>
      </div>
    </footer>
  )
}

// Wallet Input Modal
function WalletInputModal({ isOpen, onClose, onAnalyze, isLoading, progress, error }) {
  const [walletAddress, setWalletAddress] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onAnalyze(walletAddress.trim())
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <h2 className="modal-title">Quick Analysis</h2>
        <p className="modal-subtitle">Paste any Solana wallet to see trading patterns</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Solana wallet address"
            disabled={isLoading}
            className="wallet-input"
          />
          {error && <p className="input-error">{error}</p>}
          <button type="submit" disabled={isLoading} className="choice-btn btn-primary full-width">
            {isLoading ? (
              <>
                <span className="spinner" />
                {progress || 'Analyzing...'}
              </>
            ) : (
              'Analyze wallet'
            )}
          </button>
        </form>
        <p className="modal-footer">Read-only. No wallet connection required.</p>
      </div>
    </div>
  )
}

// Main Landing Page
export default function LandingPage({
  onAnalyze,
  onStartQuiz,
  onShowAuth,
  onOpenDashboard,
  onOpenJournal,
  onOpenPro,
  isLoading,
  progress,
  error,
  isAuthenticated,
  user,
}) {
  const [showWalletModal, setShowWalletModal] = useState(false)

  const handleLogoClick = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToChoice = () => {
    document.getElementById('choice-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleQuickAnalyze = () => {
    setShowWalletModal(true)
  }

  const handleDigDeep = () => {
    onStartQuiz?.()
  }

  const handleWalletSubmit = (wallet) => {
    onAnalyze(wallet)
  }

  return (
    <main className="landing-page">
      <RippleBackground />
      <CursorTrail />
      <Header
        onLogoClick={handleLogoClick}
        onShowAuth={onShowAuth}
        onOpenDashboard={onOpenDashboard}
        onOpenJournal={onOpenJournal}
        isAuthenticated={isAuthenticated}
        user={user}
      />
      <HeroSection onScrollDown={scrollToChoice} />
      <ComparisonSection />
      <FeaturesSection onOpenPro={onOpenPro} />
      <ChoiceSection onQuickAnalyze={handleQuickAnalyze} onDigDeep={handleDigDeep} />
      <FAQSection />
      <Footer />
      <WalletInputModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onAnalyze={handleWalletSubmit}
        isLoading={isLoading}
        progress={progress}
        error={error}
      />
    </main>
  )
}
