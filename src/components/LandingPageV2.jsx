import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Optimized CSS-only Wave Background (reused from original)
function RippleBackground() {
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

// Optimized Cursor Trail with throttling (reused from original)
function CursorTrail() {
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

// Header (reused from original)
function Header({ onLogoClick, onShowAuth, onOpenDashboard, onOpenJournal, onOpenSettings, onOpenContact, isAuthenticated, user }) {
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
        <a href="/academy" className="nav-link-btn">Academy</a>
        <button onClick={isAuthenticated ? onOpenDashboard : () => onShowAuth('login')} className="nav-link-btn">Copilot</button>
        <button onClick={onOpenContact} className="nav-link-btn">Contact</button>
        {isAuthenticated ? (
          <>
            <button onClick={onOpenJournal} className="nav-link-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Journal
            </button>
            <button onClick={onOpenSettings} className="nav-user-btn">
              <span className="nav-user-avatar">{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
              <span className="nav-user-name">{user?.username}</span>
            </button>
          </>
        ) : (
          <div className="nav-auth-buttons">
            <button onClick={() => onShowAuth('login')} className="nav-auth-btn nav-login">Log in</button>
            <button onClick={() => onShowAuth('signup')} className="nav-auth-btn nav-signup">Sign up</button>
          </div>
        )}
      </div>

      {/* Mobile hamburger button */}
      <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {mobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <><path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" /></>}
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
              <a href="/academy" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                Academy
              </a>
              <button onClick={() => handleNavAction(isAuthenticated ? onOpenDashboard : () => onShowAuth('login'))} className="mobile-nav-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
                  <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
                </svg>
                Copilot
              </button>
              <button onClick={() => handleNavAction(onOpenContact)} className="mobile-nav-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Contact
              </button>
              {isAuthenticated ? (
                <>
                  <button onClick={() => handleNavAction(onOpenJournal)} className="mobile-nav-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    Journal
                  </button>
                  <button onClick={() => handleNavAction(onOpenSettings)} className="mobile-nav-user">
                    <span className="mobile-nav-avatar">{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
                    <span className="mobile-nav-username">{user?.username}</span>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleNavAction(() => onShowAuth('login'))} className="mobile-nav-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Log in
                  </button>
                  <button onClick={() => handleNavAction(() => onShowAuth('signup'))} className="mobile-nav-link mobile-nav-signup">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
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

// SECTION 1: Updated Hero Section
function HeroSection({ onScrollDown, onAnalyze, onStartQuiz, isLoading, progress, error }) {
  const [walletAddress, setWalletAddress] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (walletAddress.trim()) {
      onAnalyze(walletAddress.trim())
    }
  }

  return (
    <section className="hero-section hero-section-v2">
      <div className="hero-content">
        <div className="hero-logo">
          <img src="/hindsightlogo.png" alt="Hindsight" className="hero-logo-img" />
        </div>

        <h1 className="hero-headline hero-headline-compact">
          The trading improvement system<br className="hero-line-break" />
          for Solana <span className="text-gradient-purple">traders</span>
        </h1>

        <p className="hero-subheadline">
          Analyze your trades. Learn from your mistakes. Level up with likeminded traders.
        </p>

        {/* Wallet Input */}
        <form className="hero-wallet-form" onSubmit={handleSubmit}>
          <p className="hero-wallet-label">Paste a wallet to analyze instantly</p>
          <div className="hero-input-wrapper">
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Paste any Solana wallet address"
              disabled={isLoading}
              className="hero-wallet-input"
            />
            <button type="submit" disabled={isLoading || !walletAddress.trim()} className="hero-analyze-btn">
              {isLoading ? (
                <><span className="spinner" />{progress || 'Analyzing...'}</>
              ) : (
                <>Analyze<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
              )}
            </button>
          </div>
          {error && <p className="hero-error">{error}</p>}
        </form>

        <button className="hero-learn-more" onClick={onScrollDown}>
          <span>Learn more</span>
          <svg className="hero-learn-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </section>
  )
}

// SECTION 2: Credibility Bar
function CredibilityBar() {
  const [isVisible, setIsVisible] = useState(false)
  const [counts, setCounts] = useState({ wallets: 0, lessons: 0, quizzes: 0 })
  const sectionRef = useRef(null)

  const targets = { wallets: 847, lessons: 432, quizzes: 291 }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCounts({
        wallets: Math.floor(targets.wallets * eased),
        lessons: Math.floor(targets.lessons * eased),
        quizzes: Math.floor(targets.quizzes * eased),
      })
      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible])

  return (
    <section className="credibility-bar" ref={sectionRef} id="credibility-section">
      <div className="credibility-stats">
        <div className="credibility-stat">
          <span className="credibility-number">{counts.wallets.toLocaleString()}</span>
          <span className="credibility-label">wallets analyzed</span>
        </div>
        <div className="credibility-divider" />
        <div className="credibility-stat">
          <span className="credibility-number">{counts.lessons.toLocaleString()}</span>
          <span className="credibility-label">lessons completed</span>
        </div>
        <div className="credibility-divider" />
        <div className="credibility-stat">
          <span className="credibility-number">{counts.quizzes.toLocaleString()}</span>
          <span className="credibility-label">quizzes passed</span>
        </div>
      </div>
    </section>
  )
}

// SECTION 3: The Loop - How It Works
function TheLoopSection() {
  return (
    <section className="loop-section" id="loop-section">
      <div className="section-container">
        <h2 className="section-headline">
          Most traders repeat the same mistakes forever. <span className="text-gradient-purple">Hindsight breaks the cycle.</span>
        </h2>

        {/* 2x2 Grid Layout */}
        <div className="loop-diagram-v2">
          {/* Top Row */}
          <div className="loop-step-v2 loop-step-tl">
            <div className="loop-step-circle" style={{ borderColor: '#8b5cf6' }}>
              <span className="loop-step-icon">🔍</span>
            </div>
            <div className="loop-step-label">ANALYZE</div>
            <div className="loop-step-desc">Copilot</div>
          </div>

          <div className="loop-arrow-h">
            <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
              <path d="M2 12h50M46 6l6 6-6 6" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="loop-step-v2 loop-step-tr">
            <div className="loop-step-circle" style={{ borderColor: '#22c55e' }}>
              <span className="loop-step-icon">📚</span>
            </div>
            <div className="loop-step-label">LEARN</div>
            <div className="loop-step-desc">Academy</div>
          </div>

          {/* Vertical Arrows */}
          <div className="loop-arrow-v loop-arrow-v-left">
            <svg width="24" height="60" viewBox="0 0 24 60" fill="none">
              <path d="M12 58V8M6 14l6-6 6 6" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="loop-arrow-v loop-arrow-v-right">
            <svg width="24" height="60" viewBox="0 0 24 60" fill="none">
              <path d="M12 2v50M6 46l6 6 6-6" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Bottom Row */}
          <div className="loop-step-v2 loop-step-bl">
            <div className="loop-step-circle" style={{ borderColor: '#f59e0b' }}>
              <span className="loop-step-icon">📊</span>
            </div>
            <div className="loop-step-label">TRACK</div>
            <div className="loop-step-desc">Journal</div>
          </div>

          <div className="loop-arrow-h loop-arrow-h-bottom">
            <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
              <path d="M58 12H8M14 6l-6 6 6 6" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="loop-step-v2 loop-step-br">
            <div className="loop-step-circle" style={{ borderColor: '#06b6d4' }}>
              <span className="loop-step-icon">💬</span>
            </div>
            <div className="loop-step-label">PRACTICE</div>
            <div className="loop-step-desc">Community</div>
          </div>
        </div>

        <p className="loop-description">
          Other tools show you data. Hindsight shows you <em>why</em> you're losing — then teaches you how to stop.
          Your Copilot analysis recommends specific Academy lessons. The community helps you implement.
          The Journal tracks if it's working. Rinse and repeat until profitable.
        </p>

        <div className="loop-cta-wrapper">
          <Link to="/quiz" className="loop-cta">
            Enter the loop
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

// SECTION 4: Copilot Deep Dive
function CopilotSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const competitors = [
    { name: 'Cielo', limitation: 'Trade history only' },
    { name: 'Birdeye', limitation: 'Portfolio tracking' },
    { name: 'GMGN', limitation: 'Data dumps, no insights' },
    { name: 'Trading Terminals', limitation: 'Execution only, no reflection' },
    { name: 'Dexscreener', limitation: 'Charts without context' },
  ]

  const hindsightFeatures = [
    'AI behavioral coaching',
    'Personalized pattern detection',
    'Brutally honest feedback',
    'Trading journal with context',
    'Tracks if you\'re actually improving',
    'Recommends lessons to fix weaknesses',
  ]

  const detections = [
    { name: 'FOMO Entries', desc: 'Buying tops after watching others win' },
    { name: 'Panic Sells', desc: 'Dumping at the bottom, right before recovery' },
    { name: 'Revenge Trading', desc: 'Chasing losses with bigger, dumber bets' },
    { name: 'Diamond Hand Delusion', desc: 'Holding losers, selling winners' },
    { name: 'Position Sizing Chaos', desc: 'No consistency, no edge' },
  ]

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="copilot-section" id="copilot-section" ref={sectionRef}>
      <div className="section-container">
        <h2 className="section-headline">Other Tools vs <span className="text-gradient-purple">Hindsight</span></h2>

        <div className="comparison-grid">
          <div className="comparison-card glass-card comparison-other">
            <h3 className="comparison-title">Other Tools</h3>
            <ul className="comparison-list">
              {competitors.map((comp, i) => (
                <li key={i} className="comparison-item comparison-item-bad">
                  <span className="comparison-icon">✗</span>
                  <span className="competitor-inline">
                    <span className="competitor-name">{comp.name}</span>
                    <span className="competitor-separator"> — </span>
                    <span className="competitor-limitation">{comp.limitation}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="comparison-card glass-card comparison-hindsight">
            <div className="comparison-hindsight-header">
              <img src="/hindsightlogo.png" alt="" className="comparison-logo" />
              <h3 className="comparison-title">Hindsight</h3>
            </div>
            <ul className="comparison-list">
              {hindsightFeatures.map((feature, i) => (
                <li
                  key={i}
                  className={`comparison-item comparison-item-good ${isVisible ? 'animate' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="comparison-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* What Copilot Detects */}
        <div className="copilot-detects">
          <h3 className="copilot-detects-title">What Copilot Detects:</h3>
          <div className="copilot-detects-grid">
            {detections.map((d, i) => (
              <div key={i} className="copilot-detect-item">
                <span className="copilot-detect-name">{d.name}</span>
                <span className="copilot-detect-desc">{d.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="copilot-cta-wrapper">
          <button onClick={scrollToHero} className="copilot-cta">
            Analyze any wallet
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

// SECTION 5: Academy Deep Dive
function AcademySection() {
  const features = [
    {
      icon: '📖',
      title: 'Structured Curriculum',
      items: [
        'Trading 101: 25 lessons across 5 modules',
        'Topics: Wallets → Entries → Risk → Psychology → Mastery',
        'Take a placement test to skip what you know',
        'Complete quizzes to prove understanding',
      ],
    },
    {
      icon: '🎯',
      title: 'Personalized Paths',
      items: [
        'Take the quiz to discover your trader archetype',
        '9 types: Diamond Hands, FOMO Trader, Scalper, and more',
        'Each archetype has 8 targeted lessons',
        'Learn to play to your strengths, mitigate weaknesses',
      ],
    },
    {
      icon: '🏆',
      title: 'Gamified Progress',
      items: [
        'Earn XP from lessons and quizzes',
        '15 levels: Newcomer → Legend',
        'Daily goals and streak bonuses',
        'Compete on the leaderboard',
        'Unlock achievement badges',
      ],
    },
  ]

  return (
    <section className="academy-section" id="academy-section">
      <div className="section-container">
        <h2 className="section-headline">Learn to trade, not just execute</h2>
        <p className="section-subheadline">70+ lessons. 9 trading archetypes. One system to master the trenches.</p>

        <div className="academy-grid">
          {features.map((f, i) => (
            <div key={i} className="academy-card glass-card">
              <span className="academy-card-icon">{f.icon}</span>
              <h3 className="academy-card-title">{f.title}</h3>
              <ul className="academy-card-list">
                {f.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="academy-cta-wrapper">
          <Link to="/academy" className="academy-cta">
            Start Learning
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

// SECTION 6: Archetypes Preview
function ArchetypesSection() {
  const archetypes = [
    { name: 'Diamond Hands', focus: 'Conviction trading', color: '#3b82f6', emoji: '💎' },
    { name: 'FOMO Trader', focus: 'Impulse control', color: '#f97316', emoji: '🚀' },
    { name: 'Narrative Front Runner', focus: 'Trend prediction', color: '#a855f7', emoji: '🔮' },
    { name: 'Scalper', focus: 'High frequency', color: '#6b7280', emoji: '⚡' },
    { name: 'Loss Averse', focus: 'Capital protection', color: '#ef4444', emoji: '🛡️' },
    { name: 'Technical Analyst', focus: 'Chart mastery', color: '#22c55e', emoji: '📊' },
    { name: 'Copy Trader', focus: 'Following winners', color: '#06b6d4', emoji: '👀' },
    { name: 'Impulse Trader', focus: 'Quick decisions', color: '#eab308', emoji: '💥' },
    { name: 'Contrarian', focus: 'Against the crowd', color: '#ec4899', emoji: '🔄' },
  ]

  return (
    <section className="archetypes-section" id="archetypes-section">
      <div className="section-container">
        <h2 className="section-headline">What kind of trader are you?</h2>
        <p className="section-subheadline">Take the 60-second quiz. Get a personalized learning path.</p>

        <div className="archetypes-grid archetypes-grid-3x3">
          {archetypes.map((a, i) => (
            <div key={i} className="archetype-preview-card glass-card" style={{ '--archetype-color': a.color }}>
              <span className="archetype-preview-emoji">{a.emoji}</span>
              <h3 className="archetype-preview-name">{a.name}</h3>
              <p className="archetype-preview-focus">{a.focus}</p>
            </div>
          ))}
        </div>

        <p className="archetypes-description">
          Your archetype isn't a label — it's a starting point. Each type has specific strengths to leverage and blind spots to fix.
          The quiz takes 60 seconds. The insights last forever.
        </p>

        <div className="archetypes-cta-wrapper">
          <Link to="/quiz" className="archetypes-cta">
            Discover your archetype
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

// SECTION 7: Community Deep Dive
function CommunitySection({ onOpenPro }) {
  const features = [
    {
      icon: '💬',
      title: 'Real Conversations',
      items: [
        'Share trades and get feedback',
        'Ask questions, get answers from other traders',
        'Talk through setups before you ape',
      ],
    },
    {
      icon: '✓',
      title: 'Accountability',
      items: [
        'Post your corrections publicly',
        'Track if you\'re actually improving',
        'Celebrate wins with people who get it',
      ],
    },
    {
      icon: '🤝',
      title: 'Network',
      items: [
        'Meet other serious traders',
        'Learn what\'s working in real-time',
        'Community calls and AMAs',
      ],
    },
  ]

  return (
    <section className="community-section" id="community-section">
      <div className="section-container">
        <h2 className="section-headline">Trading alone is a losing strategy</h2>
        <p className="section-subheadline">Connect with likeminded traders implementing what they learn.</p>

        <div className="community-grid">
          {features.map((f, i) => (
            <div key={i} className="community-card glass-card">
              <span className="community-card-icon">{f.icon}</span>
              <h3 className="community-card-title">{f.title}</h3>
              <ul className="community-card-list">
                {f.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="community-pro-notice">
          <span className="pro-lock-icon">🔒</span>
          <span>Pro Feature — $SIGHT holders only</span>
        </div>

        <div className="community-cta-wrapper">
          <button onClick={onOpenPro} className="community-cta community-cta-purple">
            Learn about Pro
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

// SECTION 8: $SIGHT Token
function SightSection({ onOpenPro }) {
  const [copied, setCopied] = useState(false)
  const contractAddress = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const freeTier = [
    '1 wallet analysis',
    '1 journal entry',
    'Trading 101 basics',
    'Archetype quiz',
  ]

  const proTier = [
    'Unlimited wallet tracking',
    'Unlimited journal entries',
    'Wallet labels (Main / Gamble / Sniper / etc.)',
    'Cross-wallet analysis',
    'ATH tracking on all positions',
    'Full Academy access',
    'Leaderboard eligibility',
    'Token-gated Discord community',
    'Priority new features',
  ]

  return (
    <section className="sight-section" id="sight-section">
      <div className="section-container">
        <div className="sight-card glass-card">
          {/* Spinning 3D Coin */}
          <div className="sight-coin-wrapper">
            <div className="sight-coin">
              <div className="sight-coin-edge">
                {[...Array(21)].map((_, i) => <span key={i} style={{ transform: `translateZ(${10 - i}px)` }} />)}
              </div>
              <div className="sight-coin-front">
                <img src="/hindsightlogo.png" alt="" className="sight-coin-logo" />
              </div>
              <div className="sight-coin-back">
                <img src="/hindsightlogo.png" alt="" className="sight-coin-logo" />
              </div>
            </div>
            <div className="sight-coin-shadow" />
          </div>

          <h2 className="sight-title">
            <span className="sight-token">$SIGHT</span> = Pro Access
          </h2>

          {/* Tier Comparison */}
          <div className="sight-tiers">
            <div className="sight-tier sight-tier-free">
              <h3 className="sight-tier-title">Free</h3>
              <ul className="sight-tier-list">
                {freeTier.map((item, i) => (
                  <li key={i}><span className="tier-check">✓</span>{item}</li>
                ))}
              </ul>
            </div>
            <div className="sight-tier sight-tier-pro">
              <h3 className="sight-tier-title">Pro <span className="sight-tier-badge">$SIGHT holders</span></h3>
              <ul className="sight-tier-list">
                {proTier.map((item, i) => (
                  <li key={i}><span className="tier-check tier-check-pro">✓</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="sight-requirement">Hold at least 0.25 SOL worth of $SIGHT to unlock Pro features</p>

          {/* Contract Address Box */}
          <div className="sight-ca-box">
            <code className="sight-ca-text">{contractAddress}</code>
            <button className="sight-ca-copy" onClick={handleCopy}>
              {copied ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
            {copied && <span className="sight-ca-tooltip">Copied!</span>}
          </div>

          {/* Buttons */}
          <div className="sight-buttons">
            <a href="https://pump.fun" target="_blank" rel="noopener noreferrer" className="sight-btn sight-btn-primary">
              Buy on Pump.fun
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <button onClick={onOpenPro} className="sight-btn sight-btn-secondary">
              See Pro Features
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// SECTION 9: Social Proof / Testimonials
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Copilot told me I revenge trade after every loss. I didn't believe it until I saw the receipts. Now I wait 30 minutes before my next trade.",
      name: 'Marcus',
      badge: 'Holder',
    },
    {
      quote: "The Academy is actually good. Not generic 'buy low sell high' BS. Real lessons about pump.fun mechanics and when to take profits.",
      name: 'Devon',
      badge: 'Holder',
    },
    {
      quote: "I went from losing 60% of my trades to 48% in two weeks just by following my archetype corrections. Still not profitable but actually improving.",
      name: 'Kenji',
      badge: 'Holder',
    },
    {
      quote: "I thought I was up 40%. Copilot showed me I was down 12%. That hurt — but I needed to see it.",
      name: 'Aaliyah',
      badge: 'Holder',
    },
  ]

  return (
    <section className="testimonials-section" id="testimonials-section">
      <div className="section-container">
        <h2 className="section-headline">What traders are saying</h2>

        <div className="testimonials-grid testimonials-grid-2x2">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card glass-card">
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {t.name.charAt(0)}
                </div>
                <span className="testimonial-name">{t.name}</span>
                <span className="testimonial-badge">{t.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// SECTION 10: Entry Points / Choose Your Path
function EntryPointsSection({ onAnalyze }) {
  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="entry-section" id="entry-section">
      <div className="section-container">
        <h2 className="section-headline">Ready to stop losing money the same way twice?</h2>

        <div className="entry-grid">
          <div className="entry-card glass-card">
            <span className="entry-icon">🎯</span>
            <h3 className="entry-title">Take the Quiz</h3>
            <p className="entry-desc">Find your trader archetype and get a personalized improvement plan.</p>
            <Link to="/quiz" className="entry-btn">
              Start Quiz
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="entry-card glass-card">
            <span className="entry-icon">🔍</span>
            <h3 className="entry-title">Analyze a Wallet</h3>
            <p className="entry-desc">Paste any Solana wallet for instant behavioral analysis.</p>
            <button onClick={scrollToHero} className="entry-btn">
              Analyze Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="entry-card glass-card">
            <span className="entry-icon">📚</span>
            <h3 className="entry-title">Browse Academy</h3>
            <p className="entry-desc">Explore 70+ lessons on memecoin trading fundamentals.</p>
            <Link to="/academy" className="entry-btn">
              View Curriculum
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// SECTION 11: FAQ
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'How does the wallet analysis work?',
      answer: 'Hindsight reads your public on-chain transaction history from pump.fun, Raydium, Jupiter, and other Solana DEXs. We analyze your last 1,000 trades, calculate actual PnL, and use AI to detect behavioral patterns like FOMO entries and panic sells. Everything is read-only — we never touch your funds.',
    },
    {
      question: 'What is the Academy?',
      answer: 'A structured curriculum of 70+ lessons covering everything from setting up a wallet to advanced position management. Includes Trading 101 (5 modules, 25 lessons) plus 9 archetype-specific tracks (8 lessons each). Take quizzes, earn XP, level up, and compete on the leaderboard.',
    },
    {
      question: 'What\'s my "trader archetype"?',
      answer: 'Your archetype is your natural trading style — how you make decisions, what mistakes you\'re prone to, and where your edge might be. Take the 60-second quiz to discover yours and get a personalized learning path designed for your specific patterns.',
    },
    {
      question: 'What do $SIGHT token holders get?',
      answer: 'Hold 0.25 SOL worth of $SIGHT in any tracked wallet to unlock Pro: unlimited wallet analyses, unlimited journal entries, wallet labels, cross-wallet insights, ATH tracking, full Academy access, token-gated Discord access, and leaderboard eligibility. Your Pro status is verified automatically.',
    },
    {
      question: 'Is my wallet data safe?',
      answer: 'All wallet data is public on-chain anyway — we\'re just reading it. We don\'t store private keys, can\'t access your funds, and don\'t sell your data. Your analysis is tied to your account, not shared publicly unless you choose to share it.',
    },
    {
      question: 'How accurate is the analysis?',
      answer: 'The analysis is accurate for your last 1,000 transactions, pulling real data directly from the blockchain. We calculate actual realized and unrealized PnL. Pro users have their data saved continuously after each trade, building a complete historical record over time.',
    },
  ]

  return (
    <section className="faq-section" id="faq-section">
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
                <svg className="faq-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

// SECTION 12: Final CTA
function FinalCTASection({ isAuthenticated, onOpenDashboard, onShowAuth }) {
  const handleLaunch = () => {
    if (isAuthenticated) {
      onOpenDashboard()
    } else {
      onShowAuth('signup')
    }
  }

  return (
    <section className="final-cta-section">
      <div className="section-container">
        <div className="final-cta-content">
          <h2 className="final-cta-title">Your next trade is coming. Will you make the same mistake?</h2>
          <button onClick={handleLaunch} className="final-cta-btn btn-primary">
            Launch Hindsight
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

// SECTION 13: Footer
function Footer({ onOpenContact }) {
  return (
    <footer className="site-footer">
      <div className="section-container">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <img src="/hindsightlogo.png" alt="Hindsight" />
              <span>hindsight</span>
            </div>
            <p className="footer-copyright">© 2026 Hindsight. All rights reserved.</p>
          </div>

          <div className="footer-right">
            <a href="/academy" className="footer-link">Hindsight Academy</a>
            <button onClick={onOpenContact} className="footer-link footer-link-btn">Contact</button>
            <a href="https://twitter.com/tradehindsight" target="_blank" rel="noopener noreferrer" className="footer-link footer-icon-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://discord.gg/fQjx6NBHTz" target="_blank" rel="noopener noreferrer" className="footer-link footer-icon-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@tradehindsight" target="_blank" rel="noopener noreferrer" className="footer-link footer-icon-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <a href="https://pump.fun" target="_blank" rel="noopener noreferrer" className="footer-link">Pump.fun</a>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main Landing Page V2
export default function LandingPageV2({
  onAnalyze,
  onStartQuiz,
  onShowAuth,
  onOpenDashboard,
  onOpenJournal,
  onOpenSettings,
  onOpenPro,
  onOpenContact,
  isLoading,
  progress,
  error,
  isAuthenticated,
  user,
}) {
  const handleLogoClick = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToNextSection = () => {
    document.getElementById('credibility-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="landing-page landing-page-v2">
      <RippleBackground />
      <CursorTrail />
      <Header
        onLogoClick={handleLogoClick}
        onShowAuth={onShowAuth}
        onOpenDashboard={onOpenDashboard}
        onOpenJournal={onOpenJournal}
        onOpenSettings={onOpenSettings}
        onOpenContact={onOpenContact}
        isAuthenticated={isAuthenticated}
        user={user}
      />
      <HeroSection
        onScrollDown={scrollToNextSection}
        onAnalyze={onAnalyze}
        onStartQuiz={onStartQuiz}
        isLoading={isLoading}
        progress={progress}
        error={error}
      />
      <CredibilityBar />
      <TheLoopSection />
      <CopilotSection />
      <AcademySection />
      <ArchetypesSection />
      <CommunitySection onOpenPro={onOpenPro} />
      <SightSection onOpenPro={onOpenPro} />
      <TestimonialsSection />
      <EntryPointsSection onAnalyze={onAnalyze} />
      <FAQSection />
      <FinalCTASection
        isAuthenticated={isAuthenticated}
        onOpenDashboard={onOpenDashboard}
        onShowAuth={onShowAuth}
      />
      <Footer onOpenContact={onOpenContact} />
    </main>
  )
}
