import { useState, useEffect } from 'react'
import { Link, useOutletContext, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

// Tab configuration
const ACADEMY_TABS = [
  { id: 'trading-101', label: 'Trading 101' },
  { id: 'by-archetype', label: 'Learn by Archetype' }
]

// Daily XP goal
const DAILY_XP_GOAL = 30

// Achievement definitions
const ACHIEVEMENTS = {
  'first_lesson': { id: 'first_lesson', name: 'First Steps', icon: '👣', description: 'Complete your first lesson' },
  'streak_3': { id: 'streak_3', name: 'On Fire', icon: '🔥', description: '3-day learning streak' },
  'streak_7': { id: 'streak_7', name: 'Week Warrior', icon: '⚔️', description: '7-day learning streak' },
  'streak_30': { id: 'streak_30', name: 'Monthly Master', icon: '🏆', description: '30-day learning streak' },
  'perfect_quiz': { id: 'perfect_quiz', name: 'Perfect Score', icon: '💯', description: 'Get 100% on any quiz' },
  'module_complete': { id: 'module_complete', name: 'Module Master', icon: '📚', description: 'Complete a full module' },
  'level_5': { id: 'level_5', name: 'Rising Star', icon: '⭐', description: 'Reach Level 5' },
  'level_10': { id: 'level_10', name: 'Expert Trader', icon: '🎯', description: 'Reach Level 10' },
  'xp_500': { id: 'xp_500', name: 'Knowledge Seeker', icon: '🧠', description: 'Earn 500 total XP' },
  'xp_1000': { id: 'xp_1000', name: 'Dedicated Learner', icon: '📖', description: 'Earn 1,000 total XP' },
}

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

// Stats Bar Component
function StatsBar({ xpProgress, levelInfo }) {
  const isStreakActive = xpProgress?.lastActivity === new Date().toISOString().split('T')[0]

  return (
    <div className="stats-bar">
      <div className="stat-item streak-stat">
        <div className={`stat-icon ${isStreakActive ? 'streak-active' : ''}`}>🔥</div>
        <div className="stat-content">
          <span className="stat-value">{xpProgress?.streak || 0}</span>
          <span className="stat-label">Day Streak</span>
        </div>
      </div>

      <div className="stat-item level-stat">
        <div className="stat-icon">🏆</div>
        <div className="stat-content">
          <span className="stat-value">Level {levelInfo?.level || 1}</span>
          <span className="stat-label">{levelInfo?.title || 'Newcomer'}</span>
        </div>
      </div>

      <div className="stat-item xp-stat">
        <div className="stat-icon">⚡</div>
        <div className="stat-content">
          <div className="xp-progress-container">
            <div className="xp-progress-bar">
              <div
                className="xp-progress-fill"
                style={{ width: `${levelInfo?.progressPercent || 0}%` }}
              />
            </div>
            <span className="xp-progress-text">
              {levelInfo?.xpInCurrentLevel || 0} / {levelInfo?.xpForNextLevel || 0} XP
            </span>
          </div>
        </div>
      </div>

      <div className="stat-item total-xp-stat">
        <div className="stat-icon">💎</div>
        <div className="stat-content">
          <span className="stat-value">{xpProgress?.total?.toLocaleString() || 0}</span>
          <span className="stat-label">Total XP</span>
        </div>
      </div>
    </div>
  )
}

// Daily Goal Widget
function DailyGoalWidget({ dailyXp = 0 }) {
  const progress = Math.min((dailyXp / DAILY_XP_GOAL) * 100, 100)
  const isComplete = dailyXp >= DAILY_XP_GOAL
  const circumference = 2 * Math.PI * 36

  return (
    <div className={`daily-goal-widget ${isComplete ? 'goal-complete' : ''}`}>
      <div className="goal-ring-container">
        <svg viewBox="0 0 80 80" className="goal-ring">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={isComplete ? '#22c55e' : '#8b5cf6'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            transform="rotate(-90 40 40)"
            className="goal-progress-ring"
          />
        </svg>
        <div className="goal-ring-content">
          {isComplete ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <span className="goal-xp">{dailyXp}</span>
          )}
        </div>
      </div>
      <div className="goal-text">
        <span className="goal-title">Daily Goal</span>
        <span className="goal-progress">{dailyXp}/{DAILY_XP_GOAL} XP</span>
      </div>
    </div>
  )
}

// Welcome Banner Component
function WelcomeBanner({ user, xpProgress, levelInfo, completedLessons, totalLessons, nextLesson }) {
  const getEncouragementMessage = () => {
    const streak = xpProgress?.streak || 0
    const xpToNext = levelInfo?.xpToNextLevel || 0

    if (streak >= 7) {
      return `Amazing! You're on a ${streak}-day streak! Keep the momentum going!`
    } else if (streak >= 3) {
      return `Welcome back! You're on a ${streak}-day streak 🔥`
    } else if (xpToNext > 0 && xpToNext <= 50) {
      return `You're only ${xpToNext} XP away from Level ${(levelInfo?.level || 1) + 1}!`
    } else if (completedLessons > 0 && totalLessons > 0) {
      const percent = Math.round((completedLessons / totalLessons) * 100)
      if (percent >= 50) {
        return `You've completed ${percent}% of the Academy - you're crushing it!`
      }
      return `Keep going! You've completed ${completedLessons} lessons so far.`
    }
    return "Ready to level up your trading knowledge? Let's go!"
  }

  return (
    <div className="welcome-banner glass-card">
      <div className="welcome-content">
        <h2 className="welcome-title">
          {user?.username ? `Welcome back, ${user.username}!` : 'Welcome to Hindsight Academy!'}
        </h2>
        <p className="welcome-message">{getEncouragementMessage()}</p>
      </div>
      {nextLesson && (
        <Link to={`/academy/${nextLesson.module_slug}/${nextLesson.slug}`} className="continue-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Continue Learning
        </Link>
      )}
    </div>
  )
}

// Achievement Showcase Component
function AchievementShowcase({ earnedAchievements = [] }) {
  const allAchievements = Object.values(ACHIEVEMENTS)

  return (
    <div className="achievement-showcase">
      <h3 className="achievement-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
        Your Achievements
      </h3>
      <div className="achievement-scroll">
        {allAchievements.length === 0 ? (
          <p className="achievement-empty">Complete lessons to earn badges!</p>
        ) : (
          allAchievements.map(achievement => {
            const isEarned = earnedAchievements.includes(achievement.id)
            return (
              <div
                key={achievement.id}
                className={`achievement-badge ${isEarned ? 'earned' : 'locked'}`}
                title={`${achievement.name}: ${achievement.description}`}
              >
                <span className="achievement-icon">{achievement.icon}</span>
                <span className="achievement-name">{achievement.name}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// Enhanced Module Card Component
function ModuleCard({ module, completedLessons = 0, isLocked = false, isActive = false, lessonProgress = [] }) {
  const navigate = useNavigate()
  const totalLessons = module.lesson_count || 0
  const progress = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0
  const isComplete = progress === 100

  const isPro = module.is_pro === 1

  // Find next incomplete lesson
  const getNextLessonSlug = () => {
    if (!module.lessons || module.lessons.length === 0) return null
    const completedSlugs = lessonProgress.map(l => l.lesson_id)
    const nextLesson = module.lessons.find(l => !completedSlugs.includes(l.id))
    return nextLesson?.slug || module.lessons[0]?.slug
  }

  const handleContinue = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const nextSlug = getNextLessonSlug()
    if (nextSlug) {
      navigate(`/academy/${module.slug}/${nextSlug}`)
    } else {
      navigate(`/academy/${module.slug}`)
    }
  }

  return (
    <div className={`module-card glass-card ${isPro ? 'module-pro' : ''} ${isActive ? 'module-active' : ''} ${isLocked ? 'module-locked' : ''}`}>
      {isLocked && (
        <div className="module-lock-overlay">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          <span>Complete previous module</span>
        </div>
      )}
      {isPro && (
        <div className="module-pro-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          Pro
        </div>
      )}
      <Link to={`/academy/${module.slug}`} className="module-card-link">
        <div className="module-card-header">
          <div className="module-card-icon">
            <span>{module.icon || '📚'}</span>
            {isComplete && (
              <div className="module-complete-check">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
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
      </Link>

      <div className="module-card-footer">
        {/* Lesson completion indicators */}
        <div className="module-lesson-dots">
          {Array.from({ length: Math.min(totalLessons, 8) }).map((_, i) => (
            <span
              key={i}
              className={`lesson-dot ${i < completedLessons ? 'completed' : ''}`}
            />
          ))}
          {totalLessons > 8 && <span className="lesson-dot-more">+{totalLessons - 8}</span>}
        </div>

        {/* Progress bar */}
        <div className="module-progress-section">
          <div className="module-progress-bar">
            <div className="module-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="module-progress-text">
            {completedLessons}/{totalLessons} lessons
          </span>
        </div>

        {/* Continue button */}
        {!isLocked && completedLessons > 0 && !isComplete && (
          <button onClick={handleContinue} className="module-continue-btn">
            Continue
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
        {isComplete && (
          <div className="module-complete-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Complete
          </div>
        )}
      </div>
    </div>
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
  const [lessonProgress, setLessonProgress] = useState([])
  const [xpProgress, setXpProgress] = useState(null)
  const [levelInfo, setLevelInfo] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [dailyXp, setDailyXp] = useState(0)
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

      // If authenticated, fetch all progress data
      if (token) {
        const headers = { 'Authorization': `Bearer ${token}` }

        const [progressRes, recommendedRes, xpProgressRes, achievementsRes] = await Promise.all([
          fetch('/api/academy/progress', { headers }),
          fetch('/api/academy/recommended', { headers }),
          fetch('/api/academy/xp-progress', { headers }),
          fetch('/api/academy/achievements', { headers })
        ])

        if (progressRes.ok) {
          const progressData = await progressRes.json()
          // The API returns { moduleProgress: [...], totalLessons, completedLessons, recentlyCompleted }
          const progressMap = {}
          const moduleProgressArray = progressData.progress?.moduleProgress || []
          moduleProgressArray.forEach(m => {
            progressMap[m.id] = m.completed_lessons || 0
          })
          setProgress(progressMap)
          setLessonProgress(progressData.progress?.recentlyCompleted || [])
        }

        if (recommendedRes.ok) {
          const recommendedData = await recommendedRes.json()
          setRecommended(recommendedData.lessons || [])
        }

        if (xpProgressRes.ok) {
          const xpData = await xpProgressRes.json()
          setXpProgress(xpData.xp)
          setLevelInfo(xpData.levelInfo)

          // Calculate daily XP (simplified - based on today's activity)
          const today = new Date().toISOString().split('T')[0]
          if (xpData.xp?.lastActivity === today) {
            // Estimate daily XP from recent activity
            setDailyXp(Math.min(xpData.xp.total % 100, DAILY_XP_GOAL))
          }
        }

        if (achievementsRes.ok) {
          const achievementsData = await achievementsRes.json()
          setAchievements(achievementsData.achievements || [])
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

  // Find next incomplete lesson for "Continue Learning"
  const findNextLesson = () => {
    for (const module of modules) {
      const moduleProgress = progress[module.id] || 0
      if (moduleProgress < (module.lesson_count || 0)) {
        // This module has incomplete lessons
        return {
          module_slug: module.slug,
          slug: module.lessons?.[moduleProgress]?.slug || module.slug
        }
      }
    }
    return recommended[0] || null
  }

  const nextLesson = findNextLesson()

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
      {/* Welcome Banner (authenticated users) */}
      {isAuthenticated && (
        <WelcomeBanner
          user={user}
          xpProgress={xpProgress}
          levelInfo={levelInfo}
          completedLessons={completedLessons}
          totalLessons={totalLessons}
          nextLesson={nextLesson}
        />
      )}

      {/* Stats Bar (authenticated users) */}
      {isAuthenticated && (
        <div className="gamification-row">
          <StatsBar xpProgress={xpProgress} levelInfo={levelInfo} />
          <DailyGoalWidget dailyXp={dailyXp} />
        </div>
      )}

      {/* Hero Section (non-authenticated) */}
      {!isAuthenticated && (
        <section className="academy-hero">
          <h1 className="academy-title">Hindsight Academy</h1>
          <p className="academy-subtitle">
            Master the psychology and strategy of trading with personalized lessons tailored to your archetype.
          </p>
        </section>
      )}

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
                {modules.map((module, index) => {
                  // Determine if module should be locked (requires previous completion)
                  // For now, only first module is always unlocked
                  const prevModuleComplete = index === 0 ||
                    (progress[modules[index - 1]?.id] || 0) >= (modules[index - 1]?.lesson_count || 0)
                  const isLocked = false // Disabled locking for now - can enable later

                  // Check if this is the "active" module (first incomplete)
                  const isActive = !isLocked &&
                    (progress[module.id] || 0) < (module.lesson_count || 0) &&
                    modules.slice(0, index).every(m => (progress[m.id] || 0) >= (m.lesson_count || 0))

                  return (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      completedLessons={progress[module.id] || 0}
                      isLocked={isLocked}
                      isActive={isActive}
                      lessonProgress={lessonProgress.filter(l => l.module_id === module.id)}
                    />
                  )
                })}
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

      {/* Achievement Showcase (authenticated users) */}
      {isAuthenticated && (
        <AchievementShowcase earnedAchievements={achievements} />
      )}

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
