import { useState, useEffect } from 'react'
import { Link, useOutletContext, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useAchievements } from '../../contexts/AchievementContext'
import { getArchetypeModule, hasArchetypeModule, getArchetypeDotClass, ARCHETYPE_DOT_COLORS } from '../../data/academy/archetypes'
import { isMasterExamUnlocked, hasMasterExamQuestions } from '../../data/academy/masterExam'
import { hasLocalModule, getTrading101Module } from '../../data/academy/modules'
import { ACHIEVEMENTS, getLocalAchievements, getLocalStats, getDailyGoalProgress, setDailyGoal, calculateOverallMastery, getLessonMastery, getAllLessonScores, calculateTotalXP, getPlacementBestScores, getPlacementLatestScores, getModuleLessonMasteries, getModuleLessonDotStatuses, getArchetypeLessonDotStatuses } from '../../services/achievements'
import { getLevelInfo, DAILY_GOALS, DEFAULT_DAILY_GOAL } from '../../config/xpConfig'
import { getArchetypeRecommendations, getWalletAnalysisInsights, ARCHETYPE_DEFAULTS } from '../../data/academy/archetypeRecommendations'
import PlacementTest from './PlacementTest'

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

// Hero Stats Grid Component - Level-first display
function HeroStats({ xpProgress, levelInfo, totalLessons, completedLessons, dailyGoalProgress, earnedAchievements, onDailyGoalClick, onAchievementsClick, masteryStats }) {
  const hasStreak = (xpProgress?.streak || 0) > 0

  // Use mastery stats for the percentage display
  const masteryPercent = masteryStats?.percentage || 0
  const quizzesAttempted = masteryStats?.quizzesAttempted || 0

  // Use level info for progress bar
  const level = levelInfo?.level || 1
  const title = levelInfo?.title || 'Newcomer'
  const progressPercent = levelInfo?.progressPercent || 0
  const xpToNext = levelInfo?.xpToNextLevel || 0
  const isMaxLevel = levelInfo?.isMaxLevel || false

  // Daily goal info
  const dailyXpEarned = dailyGoalProgress?.dailyXpEarned || 0
  const goalXp = dailyGoalProgress?.goalXp || 100
  const dailyGoalComplete = dailyGoalProgress?.isComplete || false
  const dailyProgressPercent = dailyGoalProgress?.progressPercent || 0

  // Achievement count
  const earnedCount = earnedAchievements?.length || 0
  const totalAchievements = Object.keys(ACHIEVEMENTS).length

  return (
    <div className="hero-stats-container">
      {/* Primary: Level Badge + Progress */}
      <div className="hero-level-display">
        <div className="hero-level-badge">
          <span className="hero-level-number">{level}</span>
        </div>
        <div className="hero-level-info">
          <span className="hero-level-title">{title}</span>
          <div className="hero-level-progress">
            <div className="hero-level-progress-track">
              <div
                className="hero-level-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="hero-level-progress-text">
              {isMaxLevel ? 'Max Level!' : `${xpToNext} XP to Level ${level + 1}`}
            </span>
          </div>
        </div>
      </div>

      {/* Secondary: Quick Stats Row 1 */}
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
            <span className="hero-stat-value">{(levelInfo?.totalXp || 0).toLocaleString()}</span>
            <span className="hero-stat-label">Total XP</span>
          </div>
        </div>
        <div className="hero-stat" title={quizzesAttempted > 0 ? `${quizzesAttempted} quizzes attempted` : 'Take quizzes to track mastery'}>
          <span className="hero-stat-icon">📊</span>
          <div className="hero-stat-content">
            <span className="hero-stat-value">{masteryPercent}%</span>
            <span className="hero-stat-label">Mastery</span>
          </div>
        </div>
      </div>

      {/* Tertiary: Daily Goal + Achievements Row */}
      <div className="hero-stats-grid hero-stats-row-2">
        {/* Daily Goal Card */}
        <div
          className={`hero-stat hero-stat-clickable daily-goal-stat ${dailyGoalComplete ? 'complete' : ''}`}
          onClick={onDailyGoalClick}
        >
          <div className="hero-stat-header">
            <span className="hero-stat-icon">🎯</span>
            <span className="hero-stat-value">
              {dailyGoalComplete ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </>
              ) : (
                `${dailyXpEarned} / ${goalXp}`
              )}
            </span>
          </div>
          <span className="hero-stat-label">
            {dailyGoalComplete ? 'Goal Complete!' : 'Daily Goal'}
          </span>
          <div className="daily-goal-progress-bar">
            <div
              className="daily-goal-progress-fill"
              style={{ width: `${dailyProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Achievements Card */}
        <div
          className="hero-stat hero-stat-clickable achievement-stat"
          onClick={onAchievementsClick}
        >
          <div className="hero-stat-header">
            <span className="hero-stat-icon">🏆</span>
            <span className="hero-stat-value">{earnedCount} / {totalAchievements}</span>
          </div>
          <span className="hero-stat-label">Achievements</span>
        </div>
      </div>
    </div>
  )
}

// Daily Goal Selection Modal
function DailyGoalModal({ isOpen, onClose, currentGoalId, onSave }) {
  const [selectedGoal, setSelectedGoal] = useState(currentGoalId || DEFAULT_DAILY_GOAL)

  if (!isOpen) return null

  const handleSave = () => {
    onSave(selectedGoal)
    onClose()
  }

  return (
    <div className="daily-goal-modal-overlay" onClick={onClose}>
      <div className="daily-goal-modal glass-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="daily-goal-modal-title">Set Your Daily Goal</h2>
        <p className="daily-goal-modal-subtitle">
          How much time can you dedicate to learning each day?
        </p>

        <div className="daily-goal-options">
          {Object.values(DAILY_GOALS).map(goal => (
            <button
              key={goal.id}
              className={`daily-goal-option ${selectedGoal === goal.id ? 'selected' : ''} ${currentGoalId === goal.id ? 'current' : ''}`}
              onClick={() => setSelectedGoal(goal.id)}
            >
              {currentGoalId === goal.id && (
                <span className="current-badge">Current</span>
              )}
              <div className="goal-option-header">
                <span className="goal-option-name">{goal.name}</span>
                <span className="goal-option-xp">{goal.xp} XP</span>
              </div>
              <span className="goal-option-time">{goal.time}</span>
              <span className="goal-option-desc">{goal.description}</span>
              {selectedGoal === goal.id && (
                <div className="goal-option-check">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <button className="daily-goal-save-btn" onClick={handleSave}>
          Save Goal
        </button>
      </div>
    </div>
  )
}

// Hero Section Component
function HeroSection({ user, xpProgress, levelInfo, totalLessons, completedLessons, dailyGoalProgress, earnedAchievements, nextLesson, openAuthModal, onDailyGoalClick, onAchievementsClick, masteryStats }) {
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
          dailyGoalProgress={dailyGoalProgress}
          earnedAchievements={earnedAchievements}
          onDailyGoalClick={onDailyGoalClick}
          onAchievementsClick={onAchievementsClick}
          masteryStats={masteryStats}
        />
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
          Complete <strong>{module?.prevModuleTitle || 'the previous module'}</strong> to unlock this one.
        </p>
        <div className="locked-popup-actions">
          <button className="locked-popup-btn primary" onClick={onGoToNextLesson}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Continue Learning
          </button>

          <div className="locked-popup-divider">
            <span>or</span>
          </div>

          <button className="locked-popup-btn secondary" onClick={onPlacementTest}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Take Placement Test to Skip Ahead
          </button>
          <p className="locked-popup-hint">
            Prove your knowledge and unlock higher levels instantly
          </p>
        </div>
      </div>
    </div>
  )
}

// Helper to get dot color class based on difficulty level
function getDifficultyDotClass(difficulty) {
  switch (difficulty) {
    case 'beginner': return 'dot-beginner'      // green
    case 'beginner+': return 'dot-beginner-plus' // blue
    case 'intermediate': return 'dot-intermediate' // yellow
    case 'advanced': return 'dot-advanced'      // orange
    case 'expert': return 'dot-expert'          // red/pink
    default: return 'dot-beginner'
  }
}

// Enhanced Module Card Component
function ModuleCard({ module, completedLessons = 0, isLocked = false, isCurrent = false, isComplete = false, isTestedOut = false, needsReview = false, onLockedClick, lessonMasteries = [], lessonDotStatuses = [] }) {
  const navigate = useNavigate()
  const totalLessons = module.lesson_count || 0

  // Calculate progress from dot statuses (filled = passed)
  const passedLessons = lessonDotStatuses.filter(d => d?.filled === true).length
  const hasAnyProgress = passedLessons > 0 || lessonDotStatuses.some(d => d?.source && d.source !== 'not-started')

  // Calculate percentage based on passed lessons
  const progressPercent = totalLessons > 0 ? Math.round((passedLessons / totalLessons) * 100) : 0

  // Use this for both progress bar and display
  const progressBarPercent = progressPercent

  const cardClasses = [
    'module-card',
    'glass-card',
    isCurrent && 'module-current',
    isComplete && 'module-complete',
    isTestedOut && !isComplete && 'module-tested-out',
    needsReview && !isComplete && !isTestedOut && 'module-needs-review',
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
    if (isTestedOut && !isComplete) return 'SKIPPED'
    if (needsReview && !isComplete && !isTestedOut) return 'REVIEW'
    if (isCurrent) return 'CONTINUE'
    if (isLocked) return 'LOCKED'
    return null
  }

  const badge = getBadgeText()

  return (
    <div className={cardClasses} onClick={handleClick}>
      {/* Badge stack in top-right corner */}
      <div className="module-badge-stack">
        {/* Difficulty badge always shows */}
        <span className={`module-difficulty difficulty-${module.difficulty || 'beginner'}`}>
          {module.difficulty || 'beginner'}
        </span>

        {/* Status badge below difficulty */}
        {badge && (
          <div className={`module-badge module-badge-${badge.toLowerCase()}`}>
            {isComplete && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {isLocked && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            )}
            {badge}
          </div>
        )}
      </div>

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
      </div>

      <h3 className="module-title">{module.title}</h3>
      {module.subtitle && (
        <p className="module-subtitle">{module.subtitle}</p>
      )}
      <p className="module-description">{module.description}</p>

      <div className="module-footer">
        {/* Progress dots - color = difficulty, fill = passed/failed */}
        <div className="module-dots">
          {Array.from({ length: Math.min(totalLessons, 6) }).map((_, i) => {
            const dotStatus = lessonDotStatuses[i]
            const difficultyClass = getDifficultyDotClass(module.difficulty)
            const isFilled = dotStatus?.filled === true

            // Build tooltip based on source
            let tooltip = 'Not started'
            if (dotStatus?.source === 'quiz-passed') {
              tooltip = `${dotStatus.percentage}% - Passed`
            } else if (dotStatus?.source === 'quiz-failed') {
              tooltip = `${dotStatus.percentage}% - Needs review`
            } else if (dotStatus?.source === 'placement-passed') {
              tooltip = 'Tested out'
            } else if (dotStatus?.source === 'placement-failed') {
              tooltip = 'Needs review'
            }

            return (
              <span
                key={i}
                className={`module-dot ${isFilled ? 'filled' : 'hollow'} ${difficultyClass}`}
                title={tooltip}
              />
            )
          })}
          {totalLessons > 6 && <span className="module-dot-more">+{totalLessons - 6}</span>}
        </div>
        <div className="module-progress-row">
          <div className="module-progress-track">
            <div className="module-progress-fill" style={{ width: `${progressBarPercent}%` }} />
          </div>
          {/* Always show purple glowing percentage */}
          <span className="module-mastery-label">{progressPercent}%</span>
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

// Archetype Lesson Card with optional recommendation reason badge
function ArchetypeLessonCard({ lesson, moduleSlug, reason }) {
  const difficulty = lesson.difficulty || 'beginner'
  const readTime = lesson.reading_time || lesson.readTime || 5
  const xp = lesson.xp || 25

  return (
    <Link to={`/academy/${moduleSlug}/${lesson.slug}`} className="archetype-lesson-card glass-card">
      {reason && (
        <div className="archetype-lesson-reason">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {reason}
        </div>
      )}
      <div className="archetype-lesson-header">
        <span className={`archetype-lesson-difficulty difficulty-${difficulty}`}>
          {difficulty}
        </span>
        <span className="archetype-lesson-xp">+{xp} XP</span>
      </div>
      <h4 className="archetype-lesson-title">{lesson.title}</h4>
      <p className="archetype-lesson-desc">{lesson.description}</p>
      <div className="archetype-lesson-footer">
        <span className="archetype-lesson-time">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {readTime} min read
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

// Compact Hero for Archetype Section
function ArchetypeHeroCompact({ archetype, onRetakeQuiz }) {
  const archetypeData = ARCHETYPE_MODULES.find(a => a.id === archetype)
  if (!archetypeData) return null

  return (
    <div className="archetype-hero-compact">
      <span className="archetype-icon">{archetypeData.icon}</span>
      <div className="archetype-info">
        <h2 className="archetype-title">{archetypeData.title}</h2>
        <p className="archetype-tagline">{archetypeData.subtitle}</p>
        <p className="archetype-desc">{archetypeData.description}</p>
        <button onClick={onRetakeQuiz} className="retake-quiz-btn">
          Retake Quiz
        </button>
      </div>
    </div>
  )
}

// Lesson Recommendation Card for "Play to strength" and "Recommended" sections
function LessonRecommendationCard({ lesson, moduleSlug, badge, badgeType }) {
  if (!lesson) return null

  const readTime = lesson.reading_time || lesson.readTime || 5

  return (
    <Link to={`/academy/archetype/${moduleSlug}/${lesson.slug}`} className="lesson-recommendation-card">
      <span className={`recommendation-badge badge-${badgeType}`}>
        {badgeType === 'strength' && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        )}
        {badge}
      </span>
      <h4 className="recommendation-lesson-title">{lesson.title}</h4>
      <p className="recommendation-lesson-desc">{lesson.description}</p>
      <div className="recommendation-lesson-meta">
        <span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {readTime} min
        </span>
      </div>
    </Link>
  )
}

// Archetype Module Card - Same style as Trading 101 modules
function ArchetypeModuleCard({ archetype, isUserArchetype = false, onClick }) {
  const navigate = useNavigate()
  const dotClass = getArchetypeDotClass(archetype.id)
  const dotColor = ARCHETYPE_DOT_COLORS[archetype.id] || { filled: '#a855f7', hollow: '#a855f7' }

  // Get archetype module data for lesson slugs
  const archetypeModuleData = getArchetypeModule(archetype.id)
  const lessonSlugs = archetypeModuleData?.lessons?.map(l => l.slug) || []

  // Get dot statuses for progress
  const dotStatuses = getArchetypeLessonDotStatuses(archetype.id, lessonSlugs)
  const completedCount = dotStatuses.filter(d => d.filled).length
  const totalLessons = archetype.lessonCount || 8
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const isMastered = completedCount === totalLessons && totalLessons > 0

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(`/academy/archetype/${archetype.id}`)
    }
  }

  return (
    <div
      className={`archetype-module-card ${isUserArchetype ? 'is-user-archetype' : ''}`}
      onClick={handleClick}
    >
      {/* Badges */}
      <div className="archetype-module-badges">
        <span className={`archetype-badge-type ${dotClass}`}>Archetype</span>
        {isMastered && <span className="archetype-badge-mastered">Mastered</span>}
        {isUserArchetype && <span className="archetype-badge-yours">Your Type</span>}
      </div>

      {/* Icon */}
      <span className="archetype-module-icon">{archetype.icon}</span>

      {/* Name & Tagline */}
      <h3 className="archetype-module-name">{archetype.title}</h3>
      <p className="archetype-module-tagline">{archetype.subtitle}</p>

      {/* Description */}
      <p className="archetype-module-desc">{archetype.description}</p>

      {/* 8 Dots */}
      <div className="archetype-module-dots">
        {Array.from({ length: Math.min(totalLessons, 8) }).map((_, index) => {
          const status = dotStatuses[index]
          const isFilled = status?.filled || false
          return (
            <div
              key={index}
              className={`module-dot ${isFilled ? 'filled' : 'hollow'} ${dotClass}`}
              style={{
                background: isFilled ? dotColor.filled : 'transparent',
                borderColor: !isFilled ? dotColor.hollow : 'transparent',
                borderWidth: !isFilled ? '2px' : '0',
                borderStyle: 'solid'
              }}
            />
          )
        })}
      </div>

      {/* Progress Bar */}
      <div className="archetype-module-progress">
        <div className="archetype-progress-track">
          <div
            className="archetype-progress-fill"
            style={{
              width: `${progressPercent}%`,
              background: dotColor.filled
            }}
          />
        </div>
        <span className="module-mastery-label">{progressPercent}%</span>
      </div>
    </div>
  )
}

// Master Exam Card with fire emoji, red glow, and bounce animation
function MasterExamCard() {
  const navigate = useNavigate()
  const isUnlocked = isMasterExamUnlocked()
  const hasQuestions = hasMasterExamQuestions()

  const handleClick = () => {
    if (isUnlocked) {
      navigate('/academy/archetype-master-exam')
    }
  }

  return (
    <div
      className={`master-exam-card ${isUnlocked ? '' : 'locked'}`}
      onClick={handleClick}
    >
      {/* Red glow background */}
      <div className="master-exam-glow" />

      {/* Badge */}
      <span className="master-exam-badge">Final Exam</span>

      {/* Fire Icon with bounce */}
      <span className={`master-exam-icon ${isUnlocked ? 'animate-bounce-subtle' : ''}`}>🔥</span>

      {/* Title & Tagline */}
      <h3 className="master-exam-title">Master Exam</h3>
      <p className="master-exam-tagline">Prove Your Mastery</p>

      {/* Description */}
      <p className="master-exam-desc">
        {isUnlocked
          ? 'Test your knowledge across all trading styles'
          : 'Complete Trading 101 to unlock'}
      </p>

      {/* Lock info or exam info */}
      {!isUnlocked ? (
        <div className="master-exam-lock-info">
          <span>🔒</span>
          <span>Requires: Trading 101 Master</span>
        </div>
      ) : (
        <div className="master-exam-info">
          64 questions • Skip ahead on any archetype
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
  const [dailyGoalProgress, setDailyGoalProgress] = useState(null)
  const [masteryStats, setMasteryStats] = useState({ percentage: 0, quizzesAttempted: 0, quizzesMastered: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedArchetype, setExpandedArchetype] = useState(null)
  const [lockedModulePopup, setLockedModulePopup] = useState(null)
  const [showDailyGoalModal, setShowDailyGoalModal] = useState(false)
  const [showPlacementTest, setShowPlacementTest] = useState(false)

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

  // Listen for progress and XP updates from other components
  useEffect(() => {
    const handleProgressUpdate = () => {
      // Refresh mastery stats when progress changes
      const mastery = calculateOverallMastery()
      setMasteryStats(mastery)
    }

    const handleXpUpdate = () => {
      // Refresh XP and level info when XP changes - ALWAYS calculate from progress
      const calculatedXp = calculateTotalXP()
      const localStats = getLocalStats()
      const calculatedLevelInfo = getLevelInfo(calculatedXp)
      setXpProgress(prev => ({ ...prev, total: calculatedXp }))
      setLevelInfo(calculatedLevelInfo)
      // Also refresh daily goal progress
      const dailyProgress = getDailyGoalProgress()
      setDailyGoalProgress(dailyProgress)
    }

    window.addEventListener('progressUpdated', handleProgressUpdate)
    window.addEventListener('xpUpdated', handleXpUpdate)

    return () => {
      window.removeEventListener('progressUpdated', handleProgressUpdate)
      window.removeEventListener('xpUpdated', handleXpUpdate)
    }
  }, [])

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

        // Always load local stats for local module XP
        const localStats = getLocalStats()
        const localXp = localStats.totalXp || 0

        // Load daily goal progress
        const dailyProgress = getDailyGoalProgress()
        setDailyGoalProgress(dailyProgress)

        // Load mastery stats
        const mastery = calculateOverallMastery()
        setMasteryStats(mastery)

        // ALWAYS calculate XP from actual progress - never use stored total
        const calculatedXp = calculateTotalXP()
        const calculatedLevelInfo = getLevelInfo(calculatedXp)
        setXpProgress({ total: calculatedXp, streak: localStats.currentStreak || 0 })
        setLevelInfo(calculatedLevelInfo)

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
        // ALWAYS calculate XP from actual progress - never use stored total
        const calculatedXp = calculateTotalXP()
        const localStats = getLocalStats()
        const calculatedLevelInfo = getLevelInfo(calculatedXp)
        setXpProgress({ total: calculatedXp, streak: localStats.currentStreak || 0 })
        setLevelInfo(calculatedLevelInfo)
        // Load daily goal progress
        const dailyProgress = getDailyGoalProgress()
        setDailyGoalProgress(dailyProgress)
        // Load mastery stats
        const mastery = calculateOverallMastery()
        setMasteryStats(mastery)
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

    // Check if module was tested out via placement test
    const localProgress = getLocalProgress()
    const testedOutModules = localProgress.testedOutModules || []
    const unlockedForReview = localProgress.unlockedForReview || []
    const isTestedOut = testedOutModules.includes(module.slug)
    const isUnlockedForReview = unlockedForReview.includes(module.slug)

    // Check if previous modules are complete or tested out for locking
    let prevComplete = true
    let prevModuleTitle = null
    for (let i = 0; i < index; i++) {
      const prevModule = modules[i]
      const prevProgress = progress[prevModule.id] || 0
      const prevTestedOut = testedOutModules.includes(prevModule.slug)
      const prevUnlockedForReview = unlockedForReview.includes(prevModule.slug)
      if (prevProgress < (prevModule.lesson_count || 0) && !prevTestedOut && !prevUnlockedForReview) {
        prevComplete = false
        prevModuleTitle = prevModule.title
        break
      }
    }

    // A module is unlocked if: tested out, unlocked for review, complete, or previous complete
    const isUnlocked = isTestedOut || isUnlockedForReview || isComplete || prevComplete
    const isLocked = index > 0 && !isUnlocked
    const isCurrent = !isComplete && !isLocked && (prevComplete || isTestedOut || isUnlockedForReview)
    const needsReview = isUnlockedForReview && !isTestedOut && !isComplete

    return { isComplete, isLocked, isCurrent, isTestedOut, isUnlockedForReview, needsReview, prevModuleTitle }
  }

  // Check if all modules are complete (for showing "Refine Your Edge" card)
  const isAllModulesComplete = () => {
    const localProgress = getLocalProgress()
    const testedOutModules = localProgress.testedOutModules || []

    return modules.every((module, index) => {
      const moduleCompleted = progress[module.id] || 0
      const total = module.lesson_count || 0
      const isComplete = moduleCompleted >= total && total > 0
      const isTestedOut = testedOutModules.includes(module.slug)
      return isComplete || isTestedOut
    })
  }

  const allModulesComplete = modules.length > 0 && isAllModulesComplete()

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
    setShowPlacementTest(true)
  }

  // Handle placement test completion
  const handlePlacementComplete = (placementLevel, rewards) => {
    setShowPlacementTest(false)
    // Apply placement results - unlock modules based on section scores
    if (rewards?.sectionScores) {
      applyPlacementResult(placementLevel, rewards.sectionScores)
    } else {
      applyPlacementResult(placementLevel)
    }

    // Update local state with new achievements if any were awarded
    if (rewards?.achievements?.length > 0) {
      setAchievements(prev => [...new Set([...prev, ...rewards.achievements])])
    }

    // Refresh data to show updated unlocks and XP
    fetchData()
  }

  // Navigate to module from placement results
  const handleNavigateToModule = (moduleSlug) => {
    setShowPlacementTest(false)
    navigate(`/academy/${moduleSlug}`)
  }

  // Apply placement test results - unlock modules based on scores
  //
  // IMPORTANT LOGIC:
  // - testedOutModules: Based on BEST scores (can only go up, never lose access)
  // - unlockedForReview: Based on LATEST scores (reflects current knowledge gaps)
  //
  // This allows users to retake the test to get better review recommendations
  // without losing XP or module access from previous better scores
  const applyPlacementResult = (placementLevel, sectionScores = null) => {
    const UNLOCK_ORDER = ['newcomer', 'apprentice', 'trader', 'specialist', 'master']
    const passThreshold = 0.75

    // Get scores from the separate tracking system
    const bestScores = getPlacementBestScores()
    const latestScores = getPlacementLatestScores()

    // Use provided scores if available (for immediate update), otherwise use stored
    const currentLatestScores = sectionScores || latestScores

    // Get local progress
    const localProgress = getLocalProgress()

    // testedOutModules is based on BEST scores - you never lose access
    const testedOut = []
    UNLOCK_ORDER.forEach(level => {
      const bestScore = bestScores[level] || 0
      if (bestScore >= passThreshold) {
        testedOut.push(level)
      }
    })

    // unlockedForReview is based on LATEST scores - reflects current knowledge gaps
    const unlockedForReview = []
    UNLOCK_ORDER.forEach(level => {
      const latestScore = currentLatestScores[level] || 0
      // Module is unlocked for review if:
      // 1. User attempted it (score > 0) but didn't pass this time
      // 2. OR if they previously tested out but did poorly on retake (needs brushing up)
      if (latestScore > 0 && latestScore < passThreshold) {
        unlockedForReview.push(level)
      }
    })

    // Save to localStorage
    const newProgress = {
      ...localProgress,
      testedOutModules: testedOut,
      unlockedForReview: unlockedForReview,
      moduleScores: bestScores, // Keep best scores in moduleScores for compatibility
      latestModuleScores: currentLatestScores, // Also track latest for review recommendations
      placementLevel,
      placementDate: new Date().toISOString()
    }
    localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(newProgress))

    // Dispatch event to notify all components of the update
    window.dispatchEvent(new Event('progressUpdated'))
  }

  // Handle daily goal modal
  const handleDailyGoalClick = () => {
    setShowDailyGoalModal(true)
  }

  const handleSaveDailyGoal = (goalId) => {
    setDailyGoal(goalId)
    // Refresh daily goal progress
    const newProgress = getDailyGoalProgress()
    setDailyGoalProgress(newProgress)
  }

  // Handle scroll to achievements section
  const handleAchievementsClick = () => {
    const achievementsSection = document.querySelector('.achievement-showcase')
    if (achievementsSection) {
      achievementsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Filter archetypes for "Explore Other Archetypes" section
  const otherArchetypes = ARCHETYPE_MODULES.filter(a => a.id !== userArchetypeId)

  // Render Placement Test if active
  if (showPlacementTest) {
    return (
      <PlacementTest
        onComplete={handlePlacementComplete}
        onCancel={() => setShowPlacementTest(false)}
        onNavigateToModule={handleNavigateToModule}
      />
    )
  }

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
        dailyGoalProgress={dailyGoalProgress}
        earnedAchievements={achievements}
        nextLesson={nextLesson}
        openAuthModal={openAuthModal}
        onDailyGoalClick={handleDailyGoalClick}
        onAchievementsClick={handleAchievementsClick}
        masteryStats={masteryStats}
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
            {/* Trading 101 Header with Placement Test Link */}
            <div className="trading-101-header">
              <div className="trading-101-header-content">
                <h2 className="trading-101-title">Trading 101</h2>
                <p className="trading-101-subtitle">Structured path from beginner to pro</p>
              </div>
              <button
                className="placement-test-link"
                onClick={handlePlacementTest}
              >
                Test out of levels →
              </button>
            </div>

            {/* Module Grid - PRIMARY CONTENT */}
            <section className="modules-section">
              <div className="modules-grid">
                {modules.map((module, index) => {
                  const { isComplete, isLocked, isCurrent, isTestedOut, needsReview, prevModuleTitle } = getModuleState(module, index)
                  // Get lesson masteries and dot statuses for this module
                  let lessonMasteries = []
                  let lessonDotStatuses = []
                  if (hasLocalModule(module.slug)) {
                    const localModule = getTrading101Module(module.slug)
                    if (localModule?.lessons) {
                      const lessonSlugs = localModule.lessons.map(l => l.slug)
                      lessonMasteries = getModuleLessonMasteries(module.slug, lessonSlugs)
                      lessonDotStatuses = getModuleLessonDotStatuses(module.slug, lessonSlugs)
                    }
                  }
                  return (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      completedLessons={progress[module.id] || 0}
                      isComplete={isComplete}
                      isLocked={isLocked}
                      isCurrent={isCurrent}
                      isTestedOut={isTestedOut}
                      needsReview={needsReview}
                      onLockedClick={() => handleLockedModuleClick(module, prevModuleTitle)}
                      lessonMasteries={lessonMasteries}
                      lessonDotStatuses={lessonDotStatuses}
                    />
                  )
                })}

                {/* Refine Your Edge - 6th Module Card - Always Accessible */}
                <div
                  className="module-card glass-card refine-edge-card"
                  onClick={() => setActiveTab('by-archetype')}
                >
                  <div className="module-badge-stack">
                    <span className="module-badge module-badge-archetypes">
                      ARCHETYPES
                    </span>
                  </div>

                  <div className="module-card-header">
                    <div className="module-icon-wrapper refine-edge-icon">
                      <span className="module-icon">🎯</span>
                    </div>
                  </div>

                  <h3 className="module-title">Refine Your Edge</h3>
                  <p className="module-subtitle refine-edge-subtitle">PERSONALIZED MASTERY</p>
                  <p className="module-description">
                    Master your unique trading style with archetype-specific lessons
                  </p>

                  <div className="module-footer refine-edge-footer">
                    <span className="refine-edge-cta">
                      Explore Archetypes →
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Achievements - show for authenticated users or anyone with local achievements */}
            {(isAuthenticated || achievements.length > 0) && (
              <AchievementShowcase earnedAchievements={achievements} />
            )}
          </>
        )}

        {/* Learn by Archetype Tab - Redesigned */}
        {activeTab === 'by-archetype' && (
          <>
            {isAuthenticated && userArchetypeId ? (
              <>
                {/* Section 1: Compact Hero */}
                <ArchetypeHeroCompact
                  archetype={userArchetypeId}
                  onRetakeQuiz={() => navigate('/')}
                />

                {/* Section 2: Your Archetype (Green Border) */}
                {archetypeModule && (
                  <section className="your-archetype-section">
                    <h3 className="section-title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Recommended for {userArchetypeDisplay}s
                    </h3>
                    <div className="your-archetype-grid">
                      {/* Card 1: Play to your strength */}
                      {(() => {
                        const defaults = ARCHETYPE_DEFAULTS[userArchetypeId]
                        const strengthSlug = defaults?.strengthLesson?.lessonSlug
                        const strengthLesson = archetypeModule.lessons?.find(l => l.slug === strengthSlug)
                        return strengthLesson ? (
                          <LessonRecommendationCard
                            lesson={strengthLesson}
                            moduleSlug={archetypeModule.slug}
                            badge="Play to your strength"
                            badgeType="strength"
                          />
                        ) : null
                      })()}

                      {/* Card 2: Recommended for you (pitfall) */}
                      {(() => {
                        const defaults = ARCHETYPE_DEFAULTS[userArchetypeId]
                        const pitfallSlug = defaults?.pitfallLesson?.lessonSlug
                        const pitfallLesson = archetypeModule.lessons?.find(l => l.slug === pitfallSlug)
                        return pitfallLesson ? (
                          <LessonRecommendationCard
                            lesson={pitfallLesson}
                            moduleSlug={archetypeModule.slug}
                            badge="Recommended for you"
                            badgeType="recommended"
                          />
                        ) : null
                      })()}

                      {/* Card 3: User's Archetype Module Card */}
                      {(() => {
                        const userArchetypeData = ARCHETYPE_MODULES.find(a => a.id === userArchetypeId)
                        return userArchetypeData ? (
                          <ArchetypeModuleCard
                            archetype={userArchetypeData}
                            isUserArchetype={true}
                          />
                        ) : null
                      })()}
                    </div>
                  </section>
                )}

                {/* Section 3: All Archetypes Grid (3x3) */}
                <section className="all-archetypes-section">
                  <h2 className="section-header">All Trading Styles</h2>
                  <div className="archetypes-grid-3x3">
                    {ARCHETYPE_MODULES.map(archetype => (
                      <ArchetypeModuleCard
                        key={archetype.id}
                        archetype={archetype}
                        isUserArchetype={archetype.id === userArchetypeId}
                      />
                    ))}
                    {/* Master Exam as 9th card */}
                    <MasterExamCard />
                  </div>
                </section>
              </>
            ) : (
              /* No archetype / not logged in */
              <>
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
                </div>

                {/* All Archetypes Grid for non-authenticated users */}
                <section className="all-archetypes-section">
                  <h2 className="section-header">All Trading Styles</h2>
                  <div className="archetypes-grid-3x3">
                    {ARCHETYPE_MODULES.map(archetype => (
                      <ArchetypeModuleCard
                        key={archetype.id}
                        archetype={archetype}
                        isUserArchetype={false}
                      />
                    ))}
                    {/* Master Exam as 9th card */}
                    <MasterExamCard />
                  </div>
                </section>
              </>
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

      {/* Daily Goal Modal */}
      <DailyGoalModal
        isOpen={showDailyGoalModal}
        onClose={() => setShowDailyGoalModal(false)}
        currentGoalId={dailyGoalProgress?.goalId}
        onSave={handleSaveDailyGoal}
      />
    </div>
  )
}
