import { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

// Tab configuration
const ACADEMY_TABS = [
  { id: 'trading-101', label: 'Trading 101' },
  { id: 'by-archetype', label: 'Learn by Archetype' }
]

// Archetype modules data (ordered by trading frequency, low to high)
const ARCHETYPE_MODULES = [
  {
    id: 'diamond-hands',
    title: 'Diamond Hands',
    subtitle: 'CONVICTION TRADING',
    description: 'Master the art of holding through volatility and knowing when conviction is justified',
    icon: '💎',
    lessonCount: 8
  },
  {
    id: 'narrative-front-runner',
    title: 'Narrative Front-Runner',
    subtitle: 'TREND PREDICTION',
    description: 'Spot narratives early and time your entries for maximum upside',
    icon: '🔮',
    lessonCount: 8
  },
  {
    id: 'loss-averse',
    title: 'Loss Averse',
    subtitle: 'CAPITAL PROTECTION',
    description: 'Protect your capital while learning to let winners run',
    icon: '🛡️',
    lessonCount: 8
  },
  {
    id: 'copy-trader',
    title: 'Copy Trader',
    subtitle: 'SMART MONEY FOLLOWING',
    description: 'Level up from follower to independent thinker with your own edge',
    icon: '👀',
    lessonCount: 8
  },
  {
    id: 'technical-analyst',
    title: 'Technical Analyst',
    subtitle: 'CHART MASTERY',
    description: 'Blend TA with memecoin dynamics for better entries and exits',
    icon: '📊',
    lessonCount: 8
  },
  {
    id: 'fomo-trader',
    title: 'FOMO Trader',
    subtitle: 'IMPULSE CONTROL',
    description: 'Transform fear of missing out into disciplined opportunity selection',
    icon: '😰',
    lessonCount: 8
  },
  {
    id: 'impulse-trader',
    title: 'Impulse Trader',
    subtitle: 'STRUCTURED INTUITION',
    description: 'Channel your gut instincts into a systematic edge',
    icon: '⚡',
    lessonCount: 8
  },
  {
    id: 'scalper',
    title: 'Scalper',
    subtitle: 'HIGH FREQUENCY',
    description: 'Maximize your quick-trade edge while avoiding overtrading',
    icon: '⚔️',
    lessonCount: 8
  }
]

// Map archetype names to module IDs (handle variations)
function normalizeArchetypeId(archetype) {
  if (!archetype) return null
  const normalized = archetype.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  // Handle common variations
  const mapping = {
    'diamondhands': 'diamond-hands',
    'narrativefrontrunner': 'narrative-front-runner',
    'lossaverse': 'loss-averse',
    'copytrader': 'copy-trader',
    'technicalanalyst': 'technical-analyst',
    'fomotrader': 'fomo-trader',
    'impulsetrader': 'impulse-trader',
    'fomo': 'fomo-trader',
    'impulse': 'impulse-trader'
  }

  return mapping[normalized.replace(/-/g, '')] || normalized
}

function ModuleCard({ module, completedLessons = 0 }) {
  const progress = module.lesson_count > 0
    ? Math.round((completedLessons / module.lesson_count) * 100)
    : 0

  const isPro = module.is_pro === 1

  return (
    <Link to={`/academy/${module.slug}`} className={`module-card glass-card ${isPro ? 'module-pro' : ''}`}>
      {isPro && (
        <div className="module-pro-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          Pro
        </div>
      )}
      <div className="module-card-header">
        <div className="module-card-icon">
          <span>{module.icon || '📚'}</span>
        </div>
        <span className={`module-difficulty difficulty-${module.difficulty || 'beginner'}`}>
          {module.difficulty || 'beginner'}
        </span>
      </div>
      <h3 className="module-card-title">{module.title}</h3>
      {module.subtitle && (
        <p className="module-card-subtitle">{module.subtitle}</p>
      )}
      <p className="module-card-desc">{module.description}</p>
      <div className="module-card-meta">
        <span className="module-lesson-count">{module.lesson_count} lessons</span>
        {progress > 0 && (
          <div className="module-progress">
            <div className="module-progress-bar">
              <div className="module-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="module-progress-text">{progress}%</span>
          </div>
        )}
      </div>
    </Link>
  )
}

function ArchetypeCard({ archetype, isUserArchetype = false }) {
  return (
    <Link
      to={`/academy/archetype/${archetype.id}`}
      className={`module-card archetype-card glass-card ${isUserArchetype ? 'user-archetype' : ''}`}
    >
      {isUserArchetype && (
        <div className="user-archetype-badge">
          YOUR ARCHETYPE
        </div>
      )}
      <div className="module-card-header">
        <div className="module-card-icon">
          <span>{archetype.icon}</span>
        </div>
      </div>
      <h3 className="module-card-title">{archetype.title}</h3>
      <p className="archetype-card-subtitle">{archetype.subtitle}</p>
      <p className="module-card-desc">{archetype.description}</p>
      <div className="module-card-meta">
        <span className="module-lesson-count">{archetype.lessonCount} lessons</span>
      </div>
    </Link>
  )
}

function RecommendedLesson({ lesson }) {
  return (
    <Link
      to={`/academy/${lesson.module_slug}/${lesson.slug}`}
      className="recommended-card glass-card"
    >
      <div className="recommended-badge">Recommended</div>
      <h4 className="recommended-title">{lesson.title}</h4>
      <p className="recommended-desc">{lesson.description}</p>
      <div className="recommended-meta">
        <span className="recommended-time">{lesson.reading_time} min read</span>
        <span className={`recommended-difficulty difficulty-${lesson.difficulty}`}>
          {lesson.difficulty}
        </span>
      </div>
    </Link>
  )
}

export default function AcademyDashboard() {
  const { isAuthenticated, user, openAuthModal } = useOutletContext()
  const { token } = useAuth()
  const [modules, setModules] = useState([])
  const [recommended, setRecommended] = useState([])
  const [progress, setProgress] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Tab state with localStorage persistence
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('academy_active_tab')
    return saved && ACADEMY_TABS.some(t => t.id === saved) ? saved : 'trading-101'
  })

  // Update localStorage when tab changes
  useEffect(() => {
    localStorage.setItem('academy_active_tab', activeTab)
  }, [activeTab])

  useEffect(() => {
    fetchData()
  }, [token])

  const fetchData = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Fetch modules
      const modulesRes = await fetch('/api/academy/modules')
      if (!modulesRes.ok) throw new Error('Failed to fetch modules')
      const modulesData = await modulesRes.json()
      setModules(modulesData.modules || [])

      // If authenticated, fetch progress and recommendations
      if (token) {
        const headers = { 'Authorization': `Bearer ${token}` }

        const [progressRes, recommendedRes] = await Promise.all([
          fetch('/api/academy/progress', { headers }),
          fetch('/api/academy/recommended', { headers })
        ])

        if (progressRes.ok) {
          const progressData = await progressRes.json()
          // Convert to map of moduleId -> completed count
          const progressMap = {}
          progressData.progress?.forEach(p => {
            if (!progressMap[p.module_id]) {
              progressMap[p.module_id] = 0
            }
            progressMap[p.module_id]++
          })
          setProgress(progressMap)
        }

        if (recommendedRes.ok) {
          const recommendedData = await recommendedRes.json()
          setRecommended(recommendedData.lessons || [])
        }
      }
    } catch (err) {
      console.error('Failed to fetch academy data:', err)
      setError('Failed to load academy content')
    } finally {
      setIsLoading(false)
    }
  }

  // Get user's archetype
  const userArchetypeId = normalizeArchetypeId(user?.primaryArchetype || user?.primary_archetype)

  // Reorder archetype modules to put user's archetype first
  const orderedArchetypeModules = [...ARCHETYPE_MODULES]
  if (userArchetypeId) {
    const userIndex = orderedArchetypeModules.findIndex(m => m.id === userArchetypeId)
    if (userIndex > 0) {
      const [userModule] = orderedArchetypeModules.splice(userIndex, 1)
      orderedArchetypeModules.unshift(userModule)
    }
  }

  // Calculate overall progress
  const totalLessons = modules.reduce((sum, m) => sum + (m.lesson_count || 0), 0)
  const completedLessons = Object.values(progress).reduce((sum, count) => sum + count, 0)
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  if (isLoading) {
    return (
      <div className="academy-loading">
        <div className="spinner" />
        <p>Loading Academy...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="academy-error">
        <p>{error}</p>
        <button onClick={fetchData} className="academy-retry-btn">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="academy-dashboard">
      {/* Hero Section */}
      <section className="academy-hero">
        <h1 className="academy-title">Hindsight Academy</h1>
        <p className="academy-subtitle">
          Master the psychology and strategy of trading with personalized lessons tailored to your archetype.
        </p>
        {isAuthenticated && overallProgress > 0 && (
          <div className="academy-overall-progress">
            <div className="overall-progress-bar">
              <div className="overall-progress-fill" style={{ width: `${overallProgress}%` }} />
            </div>
            <span className="overall-progress-text">
              {completedLessons} of {totalLessons} lessons completed ({overallProgress}%)
            </span>
          </div>
        )}
      </section>

      {/* Tab Navigation */}
      <div className="academy-tabs">
        {ACADEMY_TABS.map(tab => (
          <button
            key={tab.id}
            className={`academy-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="academy-tab-content">
        {/* Trading 101 Tab */}
        {activeTab === 'trading-101' && (
          <>
            {/* Recommended Section (if authenticated with recommendations) */}
            {isAuthenticated && recommended.length > 0 && (
              <section className="academy-section">
                <h2 className="academy-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Recommended for You
                </h2>
                <p className="academy-section-desc">
                  Based on your {user?.primaryArchetype || user?.primary_archetype ? `${user.primaryArchetype || user.primary_archetype} archetype` : 'trading style'}
                </p>
                <div className="recommended-grid">
                  {recommended.slice(0, 3).map(lesson => (
                    <RecommendedLesson key={lesson.id} lesson={lesson} />
                  ))}
                </div>
              </section>
            )}

            {/* Trading 101 Modules */}
            <section className="academy-section">
              <div className="modules-grid">
                {modules.map(module => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    completedLessons={progress[module.id] || 0}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* Learn by Archetype Tab */}
        {activeTab === 'by-archetype' && (
          <section className="academy-section">
            {/* Quiz CTA for users without archetype */}
            {isAuthenticated && !userArchetypeId && (
              <div className="archetype-quiz-cta glass-card">
                <div className="quiz-cta-content">
                  <span className="quiz-cta-icon">🎯</span>
                  <div className="quiz-cta-text">
                    <h3>Discover Your Trading Personality</h3>
                    <p>Take the archetype quiz to get personalized learning recommendations</p>
                  </div>
                </div>
                <Link to="/" className="quiz-cta-btn">
                  Take the Quiz
                </Link>
              </div>
            )}

            {!isAuthenticated && (
              <div className="archetype-quiz-cta glass-card">
                <div className="quiz-cta-content">
                  <span className="quiz-cta-icon">🎯</span>
                  <div className="quiz-cta-text">
                    <h3>Get Personalized Recommendations</h3>
                    <p>Sign in and take the personality quiz to highlight your archetype</p>
                  </div>
                </div>
                <button onClick={() => openAuthModal('signup')} className="quiz-cta-btn">
                  Sign In
                </button>
              </div>
            )}

            {/* Archetype description */}
            <p className="archetype-section-desc">
              Deep-dive lessons tailored to your trading personality. Each archetype module addresses specific strengths to leverage and weaknesses to overcome.
            </p>

            {/* Archetype Modules Grid */}
            <div className="modules-grid archetype-grid">
              {orderedArchetypeModules.map(archetype => (
                <ArchetypeCard
                  key={archetype.id}
                  archetype={archetype}
                  isUserArchetype={archetype.id === userArchetypeId}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* CTA for non-authenticated users */}
      {!isAuthenticated && (
        <section className="academy-cta glass-card">
          <h3 className="cta-title">Track Your Progress</h3>
          <p className="cta-desc">
            Sign in to save your progress, get personalized recommendations based on your trading archetype, and unlock your full learning potential.
          </p>
          <button onClick={() => openAuthModal('signup')} className="cta-btn">
            Sign In to Get Started
          </button>
        </section>
      )}
    </div>
  )
}
