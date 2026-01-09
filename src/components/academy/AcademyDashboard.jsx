import { useState, useEffect } from 'react'
import { Link, useOutletContext, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useAchievements } from '../../contexts/AchievementContext'
import { getArchetypeModule, hasArchetypeModule } from '../../data/academy/archetypes'
import { hasLocalModule, getTrading101Module } from '../../data/academy/modules'
import { ACHIEVEMENTS, getLocalAchievements } from '../../services/achievements'

// Helper for local progress tracking (same as LessonView/ModuleView)
const LOCAL_PROGRESS_KEY = 'hindsight_academy_progress'

function getLocalProgress() {
  try {
    const data = localStorage.getItem(LOCAL_PROGRESS_KEY)
    return data ? JSON.parse(data) : { completedLessons: [] }
  } catch {
    return { completedLessons: [] }
  }
}

function getCompletedCountForModule(moduleSlug) {
  const progress = getLocalProgress()
  const prefix = `${moduleSlug}/`
  return progress.completedLessons.filter(key => key.startsWith(prefix)).length
}

// Tab configuration
const ACADEMY_TABS = [
  { id: 'trading-101', label: 'Trading 101', subtitle: 'Structured path from beginner to pro' },
  { id: 'by-archetype', label: 'Learn by Archetype', subtitle: 'Personalized for your style' }
]

// Daily XP goal
const DAILY_XP_GOAL = 30

// Archetype display name formatting
const ARCHETYPE_DISPLAY_NAMES = {
  'diamond-hands': 'Diamond Hands',
  'diamondhands': 'Diamond Hands',
  'DiamondHands': 'Diamond Hands',
  'narrative-front-runner': 'Narrative Front Runner',
  'narrativefrontrunner': 'Narrative Front Runner',
  'NarrativeFrontRunner': 'Narrative Front Runner',
  'loss-averse': 'Loss Averse',
  'lossaverse': 'Loss Averse',
  'LossAverse': 'Loss Averse',
  'copy-trader': 'Copy Trader',
  'copytrader': 'Copy Trader',
  'CopyTrader': 'Copy Trader',
  'technical-analyst': 'Technical Analyst',
  'technicalanalyst': 'Technical Analyst',
  'TechnicalAnalyst': 'Technical Analyst',
  'fomo-trader': 'FOMO Trader',
  'fomotrader': 'FOMO Trader',
  'FOMOTrader': 'FOMO Trader',
  'FOMO': 'FOMO Trader',
  'impulse-trader': 'Impulse Trader',
  'impulsetrader': 'Impulse Trader',
  'ImpulseTrader': 'Impulse Trader',
  'scalper': 'Scalper',
  'Scalper': 'Scalper',
}

function formatArchetypeName(archetype) {
  if (!archetype) return null
  return ARCHETYPE_DISPLAY_NAMES[archetype] ||
    archetype.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()
}

// Archetype modules data
const ARCHETYPE_MODULES = [
  {
    id: 'diamond-hands',
    title: 'Diamond Hands',
    subtitle: 'CONVICTION TRADING',
    tagline: 'Patient entries, conviction holds',
    description: 'Master the art of holding through volatility and knowing when conviction is justified',
    icon: '💎',
    lessonCount: 8
  },
  {
    id: 'narrative-front-runner',
    title: 'Narrative Front Runner',
    subtitle: 'TREND PREDICTION',
    tagline: 'Early narratives, calculated timing',
    description: 'Spot narratives early and time your entries for maximum upside',
    icon: '🔮',
    lessonCount: 8
  },
  {
    id: 'loss-averse',
    title: 'Loss Averse',
    subtitle: 'CAPITAL PROTECTION',
    tagline: 'Preserve capital, controlled risk',
    description: 'Protect your capital while learning to let winners run',
    icon: '🛡️',
    lessonCount: 8
  },
  {
    id: 'copy-trader',
    title: 'Copy Trader',
    subtitle: 'SMART MONEY FOLLOWING',
    tagline: 'Follow smart money, build independence',
    description: 'Level up from follower to independent thinker with your own edge',
    icon: '👀',
    lessonCount: 8
  },
  {
    id: 'technical-analyst',
    title: 'Technical Analyst',
    subtitle: 'CHART MASTERY',
    tagline: 'Data-driven, systematic approach',
    description: 'Blend TA with memecoin dynamics for better entries and exits',
    icon: '📊',
    lessonCount: 8
  },
  {
    id: 'fomo-trader',
    title: 'FOMO Trader',
    subtitle: 'IMPULSE CONTROL',
    tagline: 'Channel urgency into discipline',
    description: 'Transform fear of missing out into disciplined opportunity selection',
    icon: '😰',
    lessonCount: 8
  },
  {
    id: 'impulse-trader',
    title: 'Impulse Trader',
    subtitle: 'STRUCTURED INTUITION',
    tagline: 'Trust instincts with guardrails',
    description: 'Channel your gut instincts into a systematic edge',
    icon: '⚡',
    lessonCount: 8
  },
  {
    id: 'scalper',
    title: 'Scalper',
    subtitle: 'HIGH FREQUENCY',
    tagline: 'Quick moves, disciplined exits',
    description: 'Maximize your quick-trade edge while avoiding overtrading',
    icon: '⚔️',
    lessonCount: 8
  }
]

// Map archetype names to module IDs
function normalizeArchetypeId(archetype) {
  if (!archetype) return null
  const normalized = archetype.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

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

// Hero Stats Grid Component
function HeroStats({ xpProgress, levelInfo, totalLessons, completedLessons }) {
  const completionPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const hasStreak = (xpProgress?.streak || 0) > 0

  return (
    <div className="hero-stats-grid">
      <div className="hero-stat">
        <span className={`hero-stat-icon ${hasStreak ? 'streak-active' : ''}`}>🔥</span>
        <div className="hero-stat-content">
          <span className="hero-stat-value">{xpProgress?.streak || 0}</span>
          <span className="hero-stat-label">Day Streak</span>
        </div>
      </div>
      <div className="hero-stat">
        <span className="hero-stat-icon">⚡</span>
        <div className="hero-stat-content">
          <span className="hero-stat-value">{xpProgress?.total?.toLocaleString() || 0}</span>
          <span className="hero-stat-label">Total XP</span>
        </div>
      </div>
      <div className="hero-stat">
        <span className="hero-stat-icon">🏆</span>
        <div className="hero-stat-content">
          <span className="hero-stat-value">Level {levelInfo?.level || 1}</span>
          <span className="hero-stat-label">{levelInfo?.title || 'Newcomer'}</span>
        </div>
      </div>
      <div className="hero-stat">
        <span className="hero-stat-icon">📊</span>
        <div className="hero-stat-content">
          <span className="hero-stat-value">{completionPercent}%</span>
          <span className="hero-stat-label">Complete</span>
        </div>
      </div>
    </div>
  )
}

// Daily Goal Ring Component
function DailyGoalRing({ dailyXp = 0 }) {
  const progress = Math.min((dailyXp / DAILY_XP_GOAL) * 100, 100)
  const isComplete = dailyXp >= DAILY_XP_GOAL
  const circumference = 2 * Math.PI * 40

  return (
    <div className={`daily-goal-ring ${isComplete ? 'complete' : ''}`}>
      <svg viewBox="0 0 100 100" className="goal-svg">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={isComplete ? '#22c55e' : '#8b5cf6'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
          transform="rotate(-90 50 50)"
          className="goal-progress-circle"
        />
      </svg>
      <div className="goal-ring-inner">
        {isComplete ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <>
            <span className="goal-current">{dailyXp}</span>
            <span className="goal-target">/{DAILY_XP_GOAL}</span>
          </>
        )}
      </div>
      <span className="goal-label">Daily XP</span>
    </div>
  )
}

// Hero Section Component
function HeroSection({ user, xpProgress, levelInfo, totalLessons, completedLessons, dailyXp, nextLesson, openAuthModal }) {
  const navigate = useNavigate()

  const getMotivationalText = () => {
    const streak = xpProgress?.streak || 0
    const xpToNext = levelInfo?.xpToNextLevel || 0
    const level = levelInfo?.level || 1

    if (streak >= 7) return `You're on a ${streak}-day streak! Keep it going! 🔥`
    if (streak >= 3) return `${streak}-day streak! You're building momentum! 🔥`
    if (xpToNext > 0 && xpToNext <= 30) return `Just ${xpToNext} XP to Level ${level + 1}!`
    if (completedLessons === 0) return "Ready to start your trading journey?"
    if (completedLessons > 0 && totalLessons > 0) {
      const percent = Math.round((completedLessons / totalLessons) * 100)
      if (percent >= 80) return "You're almost done! Finish strong! 💪"
      if (percent >= 50) return "Halfway there! Keep the momentum!"
    }
    return "Continue where you left off"
  }

  const handleContinue = () => {
    if (nextLesson) {
      navigate(`/academy/${nextLesson.module_slug}/${nextLesson.slug}`)
    }
  }

  if (!user) {
    return (
      <section className="hero-section hero-unauthenticated">
        <div className="hero-content">
          <h1 className="hero-title">Hindsight Academy</h1>
          <p className="hero-subtitle">
            Master the psychology and strategy of trading with lessons tailored to your style.
          </p>
          <button onClick={() => openAuthModal('signup')} className="hero-cta-btn">
            Sign In to Track Progress
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="hero-section">
      <div className="hero-left">
        <h1 className="hero-welcome">Welcome back, {user.username}!</h1>
        <p className="hero-motivational">{getMotivationalText()}</p>
        {nextLesson && (
          <button onClick={handleContinue} className="hero-cta-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Continue Learning
          </button>
        )}
      </div>
      <div className="hero-right">
        <HeroStats
          xpProgress={xpProgress}
          levelInfo={levelInfo}
          totalLessons={totalLessons}
          completedLessons={completedLessons}
        />
        <DailyGoalRing dailyXp={dailyXp} />
      </div>
    </section>
  )
}

// Locked Module Popup Component
function LockedModulePopup({ module, onClose, onGoToNextLesson, onPlacementTest }) {
  return (
    <div className="locked-popup-overlay" onClick={onClose}>
      <div className="locked-popup glass-card" onClick={e => e.stopPropagation()}>
        <button className="locked-popup-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="locked-popup-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h3 className="locked-popup-title">Module Locked</h3>
        <p className="locked-popup-message">
          Complete <strong>{module?.prevModuleTitle || 'previous modules'}</strong> to unlock <strong>{module?.title}</strong>
        </p>
        <div className="locked-popup-actions">
          <button className="locked-popup-btn primary" onClick={onGoToNextLesson}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Continue Learning
          </button>
          <button className="locked-popup-btn secondary" onClick={onPlacementTest}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Take Placement Test
          </button>
        </div>
      </div>
    </div>
  )
}

// Enhanced Module Card Component
function ModuleCard({ module, completedLessons = 0, isLocked = false, isCurrent = false, isComplete = false, onLockedClick }) {
  const navigate = useNavigate()
  const totalLessons = module.lesson_count || 0
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const cardClasses = [
    'module-card',
    'glass-card',
    isCurrent && 'module-current',
    isComplete && 'module-complete',
    isLocked && 'module-locked',
    module.is_pro === 1 && 'module-pro'
  ].filter(Boolean).join(' ')

  const handleClick = (e) => {
    if (isLocked) {
      e.preventDefault()
      if (onLockedClick) onLockedClick(module)
      return
    }
    navigate(`/academy/${module.slug}`)
  }

  const getBadgeText = () => {
    if (isComplete) return 'COMPLETE'
    if (isCurrent) return 'CONTINUE'
    if (isLocked) return 'LOCKED'
    return null
  }

  const badge = getBadgeText()

  return (
    <div className={cardClasses} onClick={handleClick}>
      {isLocked && (
        <div className="module-lock-overlay">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
        </div>
      )}

      {badge && (
        <div className={`module-badge module-badge-${badge.toLowerCase()}`}>
          {isComplete && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {badge}
        </div>
      )}

      <div className="module-card-header">
        <div className="module-icon-wrapper">
          <span className="module-icon">{module.icon || '📚'}</span>
          {isComplete && (
            <div className="module-complete-check">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </div>
        <span className={`module-difficulty difficulty-${module.difficulty || 'beginner'}`}>
          {module.difficulty || 'beginner'}
        </span>
      </div>

      <h3 className="module-title">{module.title}</h3>
      {module.subtitle && (
        <p className="module-subtitle">{module.subtitle}</p>
      )}
      <p className="module-description">{module.description}</p>

      <div className="module-footer">
        <div className="module-dots">
          {Array.from({ length: Math.min(totalLessons, 6) }).map((_, i) => (
            <span key={i} className={`module-dot ${i < completedLessons ? 'filled' : ''}`} />
          ))}
          {totalLessons > 6 && <span className="module-dot-more">+{totalLessons - 6}</span>}
        </div>
        <div className="module-progress-row">
          <div className="module-progress-track">
            <div className="module-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="module-progress-label">{completedLessons}/{totalLessons}</span>
        </div>
      </div>
    </div>
  )
}

// Achievement Badge Component
function AchievementBadge({ achievement, isEarned, isNew }) {
  return (
    <div
      className={`achievement-badge ${isEarned ? 'earned' : 'locked'} ${isNew ? 'new' : ''}`}
      title={`${achievement.name}: ${achievement.description}`}
    >
      {isNew && <span className="achievement-new-tag">NEW</span>}
      <span className="achievement-icon">{achievement.icon}</span>
      <span className="achievement-name">{achievement.name}</span>
    </div>
  )
}

// Achievement Showcase Component
function AchievementShowcase({ earnedAchievements = [] }) {
  const allAchievements = Object.values(ACHIEVEMENTS)

  return (
    <div className="achievement-showcase">
      <h3 className="achievement-header">
        <span className="achievement-header-icon">🏆</span>
        Your Achievements
      </h3>
      <div className="achievement-scroll">
        {allAchievements.map(achievement => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            isEarned={earnedAchievements.includes(achievement.id)}
            isNew={false}
          />
        ))}
      </div>
    </div>
  )
}

// Archetype Profile Card
function ArchetypeProfileCard({ archetype, onRetakeQuiz }) {
  const archetypeData = ARCHETYPE_MODULES.find(a => a.id === archetype)
  if (!archetypeData) return null

  return (
    <div className="archetype-profile-card glass-card">
      <div className="archetype-profile-icon">{archetypeData.icon}</div>
      <div className="archetype-profile-content">
        <h2 className="archetype-profile-name">{archetypeData.title}</h2>
        <p className="archetype-profile-tagline">{archetypeData.tagline}</p>
        <p className="archetype-profile-desc">{archetypeData.description}</p>
        <button onClick={onRetakeQuiz} className="archetype-retake-btn">
          Retake Quiz
        </button>
      </div>
    </div>
  )
}

// Archetype Lesson Card (no module tag since they're all from same module)
function ArchetypeLessonCard({ lesson, moduleSlug }) {
  return (
    <Link to={`/academy/${moduleSlug}/${lesson.slug}`} className="archetype-lesson-card glass-card">
      <div className="archetype-lesson-header">
        <span className={`archetype-lesson-difficulty difficulty-${lesson.difficulty}`}>
          {lesson.difficulty}
        </span>
        <span className="archetype-lesson-xp">+10 XP</span>
      </div>
      <h4 className="archetype-lesson-title">{lesson.title}</h4>
      <p className="archetype-lesson-desc">{lesson.description}</p>
      <div className="archetype-lesson-footer">
        <span className="archetype-lesson-time">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {lesson.reading_time || 5} min read
        </span>
      </div>
    </Link>
  )
}

// View All Lessons Card
function ViewAllLessonsCard({ moduleSlug, moduleTitle, lessonCount, icon, isArchetype = false }) {
  const linkPath = isArchetype ? `/academy/archetype/${moduleSlug}` : `/academy/${moduleSlug}`
  return (
    <Link to={linkPath} className="view-all-lessons-card glass-card">
      <div className="view-all-icon">{icon}</div>
      <div className="view-all-content">
        <span className="view-all-label">See all {lessonCount} lessons</span>
        <span className="view-all-module">in the {moduleTitle} track</span>
      </div>
      <svg className="view-all-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

// Expandable Archetype Card
function ExpandableArchetypeCard({ archetype, isExpanded, onToggle, userArchetype }) {
  return (
    <div className={`expandable-archetype ${isExpanded ? 'expanded' : ''}`}>
      <button className="expandable-archetype-header" onClick={onToggle}>
        <span className="expandable-archetype-icon">{archetype.icon}</span>
        <div className="expandable-archetype-info">
          <span className="expandable-archetype-name">{archetype.title}</span>
          <span className="expandable-archetype-tagline">{archetype.tagline}</span>
        </div>
        <span className="expandable-archetype-count">{archetype.lessonCount} lessons</span>
        <svg
          className="expandable-archetype-chevron"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points={isExpanded ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
        </svg>
      </button>
      {isExpanded && (
        <div className="expandable-archetype-content">
          <p className="expandable-archetype-context">
            These strategies can complement your {formatArchetypeName(userArchetype) || 'trading'} style
          </p>
          <Link to={`/academy/archetype/${archetype.id}`} className="expandable-archetype-cta">
            Explore {archetype.title} Lessons
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}

// Main Dashboard Component
export default function AcademyDashboard() {
  const { isAuthenticated, user, openAuthModal } = useOutletContext()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [modules, setModules] = useState([])
  const [archetypeModule, setArchetypeModule] = useState(null)
  const [recommendedLessons, setRecommendedLessons] = useState([])
  const [progress, setProgress] = useState({})
  const [xpProgress, setXpProgress] = useState(null)
  const [levelInfo, setLevelInfo] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [dailyXp, setDailyXp] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedArchetype, setExpandedArchetype] = useState(null)
  const [lockedModulePopup, setLockedModulePopup] = useState(null)

  // Tab state with localStorage persistence
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('academy_active_tab')
    return saved && ACADEMY_TABS.some(t => t.id === saved) ? saved : 'trading-101'
  })

  useEffect(() => {
    localStorage.setItem('academy_active_tab', activeTab)
  }, [activeTab])

  useEffect(() => {
    fetchData()
  }, [token])

  // Get user's archetype for fetching
  const userArchetypeSlug = normalizeArchetypeId(user?.primaryArchetype || user?.primary_archetype)

  const fetchData = async () => {
    setIsLoading(true)
    setError('')

    try {
      const modulesRes = await fetch('/api/academy/modules')
      if (!modulesRes.ok) throw new Error('Failed to fetch modules')
      const modulesData = await modulesRes.json()
      setModules(modulesData.modules || [])

      // Always load localStorage progress for local modules (works without auth)
      const localProgressMap = {}
      const allModules = modulesData.modules || []
      allModules.forEach(m => {
        if (hasLocalModule(m.slug)) {
          localProgressMap[m.id] = getCompletedCountForModule(m.slug)
        }
      })

      if (token) {
        const headers = { 'Authorization': `Bearer ${token}` }

        const fetchPromises = [
          fetch('/api/academy/progress', { headers }),
          fetch('/api/academy/xp-progress', { headers }),
          fetch('/api/academy/achievements', { headers }),
          fetch('/api/academy/recommended', { headers })
        ]

        // Fetch archetype module if user has an archetype
        if (userArchetypeSlug) {
          fetchPromises.push(fetch(`/api/academy/modules/${userArchetypeSlug}`))
        }

        const results = await Promise.all(fetchPromises)
        const [progressRes, xpProgressRes, achievementsRes, recommendedRes, archetypeModuleRes] = results

        if (progressRes.ok) {
          const progressData = await progressRes.json()
          const progressMap = { ...localProgressMap } // Start with local progress
          const moduleProgressArray = progressData.progress?.moduleProgress || []
          moduleProgressArray.forEach(m => {
            // Only use API progress for non-local modules
            if (!hasLocalModule(allModules.find(mod => mod.id === m.id)?.slug)) {
              progressMap[m.id] = m.completed_lessons || 0
            }
          })
          setProgress(progressMap)
        } else {
          // If API fails, still use local progress
          setProgress(localProgressMap)
        }

        if (xpProgressRes.ok) {
          const xpData = await xpProgressRes.json()
          setXpProgress(xpData.xp)
          setLevelInfo(xpData.levelInfo)

          const today = new Date().toISOString().split('T')[0]
          if (xpData.xp?.lastActivity === today) {
            setDailyXp(Math.min(xpData.xp.total % 100, DAILY_XP_GOAL))
          }
        }

        if (achievementsRes.ok) {
          const achievementsData = await achievementsRes.json()
          // Merge server achievements with local achievements
          const serverAchievements = achievementsData.achievements || []
          const localAchievements = getLocalAchievements()
          const mergedAchievements = [...new Set([...serverAchievements, ...localAchievements])]
          setAchievements(mergedAchievements)
        } else {
          // Use only local achievements if API fails
          setAchievements(getLocalAchievements())
        }

        if (recommendedRes.ok) {
          const recommendedData = await recommendedRes.json()
          setRecommendedLessons(recommendedData.lessons || [])
        }

        // Set archetype module data from local files first, fallback to API
        if (userArchetypeSlug && hasArchetypeModule(userArchetypeSlug)) {
          const localModule = getArchetypeModule(userArchetypeSlug)
          if (localModule) {
            // Transform local module format to match API format
            setArchetypeModule({
              ...localModule,
              title: localModule.name,
              lessons: localModule.lessons.map(lesson => ({
                ...lesson,
                reading_time: lesson.readTime,
                difficulty: 'beginner' // Default difficulty for archetype lessons
              }))
            })
          }
        } else if (archetypeModuleRes?.ok) {
          const archetypeData = await archetypeModuleRes.json()
          setArchetypeModule(archetypeData.module || null)
        }
      } else {
        // Not authenticated - still use local progress for local modules
        setProgress(localProgressMap)
        // Also load local achievements
        setAchievements(getLocalAchievements())
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
  const userArchetypeDisplay = formatArchetypeName(user?.primaryArchetype || user?.primary_archetype)

  // Calculate overall progress
  const totalLessons = modules.reduce((sum, m) => sum + (m.lesson_count || 0), 0)
  const completedLessons = Object.values(progress).reduce((sum, count) => sum + count, 0)

  // Find next incomplete lesson
  const findNextLesson = () => {
    for (const module of modules) {
      const moduleProgress = progress[module.id] || 0
      if (moduleProgress < (module.lesson_count || 0)) {
        return { module_slug: module.slug, slug: module.slug }
      }
    }
    // Fall back to first archetype lesson if available
    if (archetypeModule?.lessons?.[0]) {
      return { module_slug: archetypeModule.slug, slug: archetypeModule.lessons[0].slug }
    }
    // Fall back to recommended lessons
    if (recommendedLessons?.[0]) {
      return { module_slug: recommendedLessons[0].module_slug, slug: recommendedLessons[0].slug }
    }
    return null
  }

  const nextLesson = findNextLesson()

  // Determine module states
  const getModuleState = (module, index) => {
    const moduleCompleted = progress[module.id] || 0
    const total = module.lesson_count || 0
    const isComplete = moduleCompleted >= total && total > 0

    // Check if previous modules are complete for locking
    let prevComplete = true
    let prevModuleTitle = null
    for (let i = 0; i < index; i++) {
      const prevModule = modules[i]
      const prevProgress = progress[prevModule.id] || 0
      if (prevProgress < (prevModule.lesson_count || 0)) {
        prevComplete = false
        prevModuleTitle = prevModule.title
        break
      }
    }

    const isLocked = index > 0 && !prevComplete && !isComplete
    const isCurrent = !isComplete && !isLocked && prevComplete

    return { isComplete, isLocked, isCurrent, prevModuleTitle }
  }

  // Handle locked module click
  const handleLockedModuleClick = (module, prevModuleTitle) => {
    setLockedModulePopup({ ...module, prevModuleTitle })
  }

  // Handle "Continue Learning" from popup
  const handleContinueLearning = () => {
    setLockedModulePopup(null)
    if (nextLesson) {
      navigate(`/academy/${nextLesson.module_slug}/${nextLesson.slug}`)
    }
  }

  // Handle "Take Placement Test" from popup
  const handlePlacementTest = () => {
    setLockedModulePopup(null)
    // TODO: Implement placement test - for now navigate to quiz or first module
    navigate('/academy')
  }

  // Filter archetypes for "Explore Other Archetypes" section
  const otherArchetypes = ARCHETYPE_MODULES.filter(a => a.id !== userArchetypeId)

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
        <button onClick={fetchData} className="academy-retry-btn">Try Again</button>
      </div>
    )
  }

  return (
    <div className="academy-dashboard">
      {/* Hero Section */}
      <HeroSection
        user={user}
        xpProgress={xpProgress}
        levelInfo={levelInfo}
        totalLessons={totalLessons}
        completedLessons={completedLessons}
        dailyXp={dailyXp}
        nextLesson={nextLesson}
        openAuthModal={openAuthModal}
      />

      {/* Tab Navigation */}
      <div className="academy-tabs">
        {ACADEMY_TABS.map(tab => (
          <button
            key={tab.id}
            className={`academy-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-label">{tab.label}</span>
            <span className="tab-subtitle">{tab.subtitle}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="academy-tab-content">
        {/* Trading 101 Tab */}
        {activeTab === 'trading-101' && (
          <>
            {/* Module Grid - PRIMARY CONTENT */}
            <section className="modules-section">
              <div className="modules-grid">
                {modules.map((module, index) => {
                  const { isComplete, isLocked, isCurrent, prevModuleTitle } = getModuleState(module, index)
                  return (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      completedLessons={progress[module.id] || 0}
                      isComplete={isComplete}
                      isLocked={isLocked}
                      isCurrent={isCurrent}
                      onLockedClick={() => handleLockedModuleClick(module, prevModuleTitle)}
                    />
                  )
                })}
              </div>
            </section>

            {/* Achievements - show for authenticated users or anyone with local achievements */}
            {(isAuthenticated || achievements.length > 0) && (
              <AchievementShowcase earnedAchievements={achievements} />
            )}
          </>
        )}

        {/* Learn by Archetype Tab */}
        {activeTab === 'by-archetype' && (
          <>
            {/* Archetype Profile Card */}
            {isAuthenticated && userArchetypeId ? (
              <>
                <ArchetypeProfileCard
                  archetype={userArchetypeId}
                  onRetakeQuiz={() => navigate('/')}
                />

                {/* Recommended for Your Archetype */}
                {archetypeModule && archetypeModule.lessons?.length > 0 ? (
                  <section className="archetype-recommended-section">
                    <h3 className="section-header">
                      Recommended for {userArchetypeDisplay}s
                    </h3>
                    <div className="archetype-lessons-grid">
                      {archetypeModule.lessons.slice(0, 2).map(lesson => (
                        <ArchetypeLessonCard
                          key={lesson.id}
                          lesson={lesson}
                          moduleSlug={`archetype/${archetypeModule.slug}`}
                        />
                      ))}
                      <ViewAllLessonsCard
                        moduleSlug={archetypeModule.slug}
                        moduleTitle={archetypeModule.title}
                        lessonCount={archetypeModule.lessons.length}
                        icon={archetypeModule.icon || '📚'}
                        isArchetype={true}
                      />
                    </div>
                  </section>
                ) : recommendedLessons.length > 0 && (
                  <section className="archetype-recommended-section">
                    <h3 className="section-header">
                      Recommended for {userArchetypeDisplay}s
                    </h3>
                    <div className="archetype-lessons-grid">
                      {recommendedLessons.slice(0, 3).map(lesson => (
                        <ArchetypeLessonCard
                          key={lesson.id}
                          lesson={lesson}
                          moduleSlug={lesson.module_slug}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Explore Other Archetypes */}
                <section className="explore-archetypes-section">
                  <h3 className="section-header">Want to step outside your comfort zone?</h3>
                  <p className="section-subheader">Learn strategies from other trading styles</p>
                  <div className="expandable-archetypes">
                    {otherArchetypes.map(archetype => (
                      <ExpandableArchetypeCard
                        key={archetype.id}
                        archetype={archetype}
                        isExpanded={expandedArchetype === archetype.id}
                        onToggle={() => setExpandedArchetype(
                          expandedArchetype === archetype.id ? null : archetype.id
                        )}
                        userArchetype={userArchetypeId}
                      />
                    ))}
                  </div>
                </section>
              </>
            ) : (
              /* No archetype / not logged in */
              <div className="archetype-cta-section">
                <div className="archetype-cta-card glass-card">
                  <span className="archetype-cta-icon">🎯</span>
                  <h2 className="archetype-cta-title">
                    {isAuthenticated ? 'Discover Your Trading Personality' : 'Get Personalized Recommendations'}
                  </h2>
                  <p className="archetype-cta-desc">
                    {isAuthenticated
                      ? 'Take the archetype quiz to unlock personalized lessons tailored to your trading style'
                      : 'Sign in and take the personality quiz to get recommendations for your trading style'
                    }
                  </p>
                  {isAuthenticated ? (
                    <Link to="/" className="archetype-cta-btn">Take the Quiz</Link>
                  ) : (
                    <button onClick={() => openAuthModal('signup')} className="archetype-cta-btn">
                      Sign In
                    </button>
                  )}
                </div>

                {/* Show all archetypes as browsable */}
                <section className="browse-archetypes-section">
                  <h3 className="section-header">Browse All Archetypes</h3>
                  <div className="archetype-browse-grid">
                    {ARCHETYPE_MODULES.map(archetype => (
                      <Link
                        key={archetype.id}
                        to={`/academy/archetype/${archetype.id}`}
                        className="archetype-browse-card glass-card"
                      >
                        <span className="archetype-browse-icon">{archetype.icon}</span>
                        <h4 className="archetype-browse-name">{archetype.title}</h4>
                        <p className="archetype-browse-tagline">{archetype.tagline}</p>
                        <span className="archetype-browse-count">{archetype.lessonCount} lessons</span>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </div>

      {/* Locked Module Popup */}
      {lockedModulePopup && (
        <LockedModulePopup
          module={lockedModulePopup}
          onClose={() => setLockedModulePopup(null)}
          onGoToNextLesson={handleContinueLearning}
          onPlacementTest={handlePlacementTest}
        />
      )}
    </div>
  )
}
