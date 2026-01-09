// Achievement Definitions and Checking Service
import { XP_CONFIG, ACHIEVEMENT_XP, getLevelInfo, DAILY_GOALS, DEFAULT_DAILY_GOAL } from '../config/xpConfig'

// ==============================================
// CALCULATED XP SYSTEM
// XP is NEVER stored as a total - always calculated from actual progress
//
// IMPORTANT: XP falls into two categories:
// 1. KNOWLEDGE XP - Based on demonstrated knowledge (lessons, quizzes, placement test)
// 2. CONSISTENCY XP - Based on returning regularly (streaks, daily goals)
//
// The placement test ONLY awards KNOWLEDGE XP, never CONSISTENCY XP.
// This ensures the leaderboard reflects actual knowledge, not just grinding.
// ==============================================

// XP values for placement test modules
// Each module represents: 5 lessons (125 XP) + 5 quiz passes (50 XP) + module bonus
// These are KNOWLEDGE-BASED rewards only
const PLACEMENT_MODULE_XP = {
  newcomer: 225,    // 125 + 50 + 50 module bonus
  apprentice: 250,  // 125 + 50 + 75 module bonus
  trader: 275,      // 125 + 50 + 100 module bonus
  specialist: 325,  // 125 + 50 + 150 module bonus
  master: 375       // 125 + 50 + 200 module bonus
}

// Perfect score bonus per section (5 quizzes × 25 XP = 125 XP max per module)
const PLACEMENT_PERFECT_BONUS_PER_MODULE = 125

// Calculate total XP from all sources - this is the SINGLE SOURCE OF TRUTH
// XP is calculated from BEST scores only - retakes don't add XP, they can only improve it
export function calculateTotalXP() {
  let totalXP = 0

  // ==============================================
  // KNOWLEDGE XP (from demonstrated learning)
  // ==============================================

  // 1. XP from completed lessons (25 XP each)
  const progressData = localStorage.getItem('hindsight_academy_progress')
  const progress = progressData ? JSON.parse(progressData) : {}
  const completedLessons = progress.completedLessons || []
  totalXP += completedLessons.length * XP_CONFIG.LESSON_COMPLETE

  // 2. XP from quiz scores (10 XP for pass 80%+, 25 bonus for 100%)
  // Uses BEST score only - retakes don't stack XP
  const lessonScores = progress.lessonScores || {}
  Object.values(lessonScores).forEach(scoreData => {
    const bestScore = scoreData.bestScore || 0
    if (bestScore >= 0.8) {
      totalXP += XP_CONFIG.QUIZ_PASS // 10 XP for passing
    }
    if (bestScore >= 1.0) {
      totalXP += XP_CONFIG.QUIZ_PERFECT_BONUS // 25 XP bonus for perfect
    }
  })

  // 3. XP from placement test - KNOWLEDGE XP only
  // Uses BEST scores - each module can only contribute XP ONCE
  // Retakes update best scores but don't stack XP
  const placementCompleted = localStorage.getItem('placementTestCompleted') === 'true'
  if (placementCompleted) {
    const bestScoresData = localStorage.getItem('placementTestBestScores')
    const bestScores = bestScoresData ? JSON.parse(bestScoresData) : {}
    const modules = ['newcomer', 'apprentice', 'trader', 'specialist', 'master']

    modules.forEach(moduleId => {
      const score = bestScores[moduleId] || 0

      // Base XP for passing the module (75%+)
      if (score >= 0.75) {
        totalXP += PLACEMENT_MODULE_XP[moduleId]
      }

      // Perfect score bonus for 100% on a module section
      // This rewards exceptional knowledge demonstration
      if (score >= 1.0) {
        totalXP += PLACEMENT_PERFECT_BONUS_PER_MODULE
      }
    })
  }

  // 4. XP from module completions (through actual lessons, not placement)
  // Prevents double-counting with placement test XP
  const statsData = localStorage.getItem('hindsight_academy_stats')
  const stats = statsData ? JSON.parse(statsData) : {}
  const completedModules = stats.completedModules || []
  const testedOutModules = progress.testedOutModules || []

  completedModules.forEach(moduleSlug => {
    // Don't double-count modules that were tested out via placement
    if (!testedOutModules.includes(moduleSlug)) {
      const moduleXp = XP_CONFIG.MODULE_COMPLETION[moduleSlug] || 50
      totalXP += moduleXp
    }
  })

  // 5. XP from knowledge-based achievements
  const achievementsData = localStorage.getItem('hindsight_achievements')
  const achievements = achievementsData ? JSON.parse(achievementsData) : []
  achievements.forEach(achId => {
    totalXP += ACHIEVEMENT_XP[achId] || 0
  })

  // ==============================================
  // CONSISTENCY XP (from returning regularly)
  // NOTE: Placement test does NOT award any of these
  // ==============================================

  // 6. XP from daily goal completion bonuses
  const dailyBonusesClaimed = stats.dailyBonusesClaimed || 0
  totalXP += dailyBonusesClaimed * XP_CONFIG.DAILY_GOAL_COMPLETE_BONUS

  // Note: Streak XP is awarded through achievements (on-fire, week-warrior, monthly-master)
  // These are already included in the achievements section above
  // Placement test deliberately does NOT award streak achievements

  return totalXP
}

// Get calculated XP and level info - use this instead of stored totalXp
export function getCalculatedXPInfo() {
  const totalXp = calculateTotalXP()
  const levelInfo = getLevelInfo(totalXp)
  return {
    totalXp,
    ...levelInfo
  }
}

// Dispatch event to trigger XP recalculation in all components
function dispatchXPUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('xpUpdated'))
  }
}

export const ACHIEVEMENTS = {
  'first-steps': {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '👣',
    criteria: 'Complete 1 lesson',
    xpReward: 25
  },
  'on-fire': {
    id: 'on-fire',
    name: 'On Fire',
    description: 'Complete lessons 3 days in a row',
    icon: '🔥',
    criteria: 'Complete at least 1 lesson for 3 consecutive days',
    xpReward: 50
  },
  'week-warrior': {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Complete lessons 7 days in a row',
    icon: '⚔️',
    criteria: 'Complete at least 1 lesson for 7 consecutive days',
    xpReward: 100
  },
  'monthly-master': {
    id: 'monthly-master',
    name: 'Monthly Master',
    description: 'Complete lessons 30 days in a row',
    icon: '👑',
    criteria: 'Complete at least 1 lesson for 30 consecutive days',
    xpReward: 500
  },
  'perfect-score': {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: '💯',
    criteria: 'Score 100% on any lesson quiz or module exam',
    xpReward: 50
  },
  'module-master': {
    id: 'module-master',
    name: 'Module Master',
    description: 'Complete an entire module',
    icon: '📚',
    criteria: 'Complete all lessons in any module',
    xpReward: 100
  },
  'rising-star': {
    id: 'rising-star',
    name: 'Rising Star',
    description: 'Reach 500 XP',
    icon: '⭐',
    criteria: 'Accumulate 500 total XP',
    xpReward: 25
  },
  'expert-trader': {
    id: 'expert-trader',
    name: 'Expert Trader',
    description: 'Complete all Trading 101 modules',
    icon: '🎯',
    criteria: 'Complete Newcomer, Apprentice, Trader, Specialist, and Master modules',
    xpReward: 250
  },
  'knowledge-seeker': {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 25 lessons',
    icon: '🧠',
    criteria: 'Complete 25 total lessons across any modules',
    xpReward: 100
  },
  'dedicated-learner': {
    id: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Complete 50 lessons',
    icon: '📖',
    criteria: 'Complete 50 total lessons across any modules',
    xpReward: 200
  }
}

// Trading 101 module slugs for expert-trader achievement
const TRADING_101_MODULES = ['newcomer', 'apprentice', 'trader', 'specialist', 'master']

// Local storage key for tracking achievements (for local modules)
const LOCAL_ACHIEVEMENTS_KEY = 'hindsight_achievements'
const LOCAL_STATS_KEY = 'hindsight_academy_stats'
const LOCAL_PROGRESS_KEY = 'hindsight_academy_progress'

// ==============================================
// LESSON MASTERY SYSTEM
// ==============================================

export const LESSON_MASTERY = {
  NOT_STARTED: {
    status: 'not-started',
    color: 'gray',
    label: 'Not Started'
  },
  IN_PROGRESS: {
    status: 'in-progress',
    color: 'blue',
    label: 'In Progress'
  },
  COMPLETED_PARTIAL: {
    status: 'completed-partial',
    color: 'yellow',
    label: 'Completed',
    threshold: 0.80
  },
  MASTERED: {
    status: 'mastered',
    color: 'green',
    label: 'Mastered',
    threshold: 1.0
  }
}

// Get lesson mastery based on quiz score
export function getLessonMastery(quizScore, isCompleted = false) {
  if (quizScore === null || quizScore === undefined) {
    return isCompleted ? LESSON_MASTERY.IN_PROGRESS : LESSON_MASTERY.NOT_STARTED
  }
  if (quizScore >= 1.0) {
    return LESSON_MASTERY.MASTERED
  }
  if (quizScore >= 0.80) {
    return LESSON_MASTERY.COMPLETED_PARTIAL
  }
  return LESSON_MASTERY.IN_PROGRESS
}

// Get lesson progress from local storage
export function getLessonProgress(moduleSlug, lessonSlug) {
  try {
    const data = localStorage.getItem(LOCAL_PROGRESS_KEY)
    const progress = data ? JSON.parse(data) : {}
    const key = `${moduleSlug}/${lessonSlug}`
    return progress.lessonScores?.[key] || null
  } catch {
    return null
  }
}

// ==============================================
// LESSON MASTERY FROM QUIZ OR PLACEMENT TEST
// ==============================================
// Gets mastery percentage for a lesson from:
// 1. Individual lesson quiz score (if they took the quiz)
// 2. OR placement test section score (if they tested out of the module)
//
// This ensures mastery is displayed regardless of how the user learned.

// Map module slugs to placement test section names
const MODULE_TO_PLACEMENT_SECTION = {
  'newcomer': 'newcomer',
  'apprentice': 'apprentice',
  'trader': 'trader',
  'specialist': 'specialist',
  'master': 'master'
}

// Get mastery percentage for a specific lesson
// Returns { percentage: number (0-100), source: 'quiz'|'placement'|null }
export function getLessonMasteryPercentage(moduleSlug, lessonSlug) {
  // 1. First check for individual lesson quiz score
  const lessonProgress = getLessonProgress(moduleSlug, lessonSlug)
  if (lessonProgress && lessonProgress.bestScore != null) {
    return {
      percentage: Math.round(lessonProgress.bestScore * 100),
      source: 'quiz'
    }
  }

  // 2. Fall back to placement test score for this module
  const placementSection = MODULE_TO_PLACEMENT_SECTION[moduleSlug]
  if (placementSection) {
    const bestScores = getPlacementBestScores()
    const sectionScore = bestScores[placementSection]
    if (sectionScore != null && sectionScore > 0) {
      return {
        percentage: Math.round(sectionScore * 100),
        source: 'placement'
      }
    }
  }

  // 3. No mastery data available
  return { percentage: null, source: null }
}

// Get all lesson masteries for a module
// Returns array of { lessonSlug, percentage, source } for each lesson
export function getModuleLessonMasteries(moduleSlug, lessonSlugs) {
  // First, check if we have placement test scores for this module
  const placementSection = MODULE_TO_PLACEMENT_SECTION[moduleSlug]
  let placementScore = null
  if (placementSection) {
    const bestScores = getPlacementBestScores()
    placementScore = bestScores[placementSection]
  }

  // Get individual lesson scores
  const lessonScores = getAllLessonScores()

  return lessonSlugs.map(slug => {
    const lessonKey = `${moduleSlug}/${slug}`
    const quizScore = lessonScores[lessonKey]

    // Quiz score takes precedence
    if (quizScore && quizScore.bestScore != null) {
      return {
        lessonSlug: slug,
        percentage: Math.round(quizScore.bestScore * 100),
        source: 'quiz'
      }
    }

    // Fall back to placement score
    if (placementScore != null && placementScore > 0) {
      return {
        lessonSlug: slug,
        percentage: Math.round(placementScore * 100),
        source: 'placement'
      }
    }

    return {
      lessonSlug: slug,
      percentage: null,
      source: null
    }
  })
}

// Get average mastery for a module (for module card display)
// Returns { percentage: number (0-100), lessonsWithMastery: number, totalLessons: number }
export function getModuleMasteryAverage(moduleSlug, lessonSlugs) {
  const masteries = getModuleLessonMasteries(moduleSlug, lessonSlugs)
  const withMastery = masteries.filter(m => m.percentage != null)

  if (withMastery.length === 0) {
    return { percentage: 0, lessonsWithMastery: 0, totalLessons: lessonSlugs.length }
  }

  const total = withMastery.reduce((sum, m) => sum + m.percentage, 0)
  const average = Math.round(total / withMastery.length)

  return {
    percentage: average,
    lessonsWithMastery: withMastery.length,
    totalLessons: lessonSlugs.length
  }
}

// Helper to save progress and notify listeners
function saveProgressAndNotify(progress) {
  localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(progress))
  // Dispatch event to notify all components of the update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('progressUpdated'))
  }
}

// Save lesson quiz score to local storage
export function saveLessonQuizScore(moduleSlug, lessonSlug, score, totalQuestions) {
  try {
    const data = localStorage.getItem(LOCAL_PROGRESS_KEY)
    const progress = data ? JSON.parse(data) : { completedLessons: [], lessonScores: {} }
    const key = `${moduleSlug}/${lessonSlug}`

    const normalizedScore = score / totalQuestions
    const existing = progress.lessonScores?.[key]

    if (!progress.lessonScores) progress.lessonScores = {}

    progress.lessonScores[key] = {
      score: normalizedScore,
      bestScore: Math.max(normalizedScore, existing?.bestScore || 0),
      attempts: (existing?.attempts || 0) + 1,
      lastAttempt: new Date().toISOString()
    }

    saveProgressAndNotify(progress)
    return progress.lessonScores[key]
  } catch (err) {
    console.error('Failed to save lesson quiz score:', err)
    return null
  }
}

// Get all lesson scores for mastery calculation
export function getAllLessonScores() {
  try {
    const data = localStorage.getItem(LOCAL_PROGRESS_KEY)
    const progress = data ? JSON.parse(data) : {}
    return progress.lessonScores || {}
  } catch {
    return {}
  }
}

// Get placement test scores from localStorage
export function getPlacementTestScores() {
  try {
    const data = localStorage.getItem(LOCAL_PROGRESS_KEY)
    const progress = data ? JSON.parse(data) : {}
    return progress.moduleScores || {}
  } catch {
    return {}
  }
}

// Calculate overall mastery percentage
// Includes both lesson quiz scores AND placement test section scores
export function calculateOverallMastery() {
  const lessonScores = getAllLessonScores()
  const placementScores = getPlacementTestScores()

  // Collect all scores - from lesson quizzes
  const allScores = Object.values(lessonScores).map(s => s.bestScore).filter(s => s != null)

  // Also include placement test section scores (they're already 0-1 scale)
  Object.values(placementScores).forEach(score => {
    if (score != null && score > 0) {
      allScores.push(score)
    }
  })

  if (allScores.length === 0) {
    return { percentage: 0, quizzesAttempted: 0, quizzesMastered: 0, label: 'Not Started' }
  }

  const totalScore = allScores.reduce((sum, s) => sum + s, 0)
  const averageScore = totalScore / allScores.length
  const mastered = allScores.filter(s => s >= 1.0).length

  return {
    percentage: Math.round(averageScore * 100),
    quizzesAttempted: allScores.length,
    quizzesMastered: mastered,
    label: `${allScores.length} quizzes`
  }
}

// Get local achievements
export function getLocalAchievements() {
  try {
    const data = localStorage.getItem(LOCAL_ACHIEVEMENTS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// Save local achievement
export function saveLocalAchievement(achievementId) {
  const achievements = getLocalAchievements()
  if (!achievements.includes(achievementId)) {
    achievements.push(achievementId)
    localStorage.setItem(LOCAL_ACHIEVEMENTS_KEY, JSON.stringify(achievements))
    return true
  }
  return false
}

// Default stats object
const DEFAULT_STATS = {
  lessonsCompleted: 0,
  modulesCompleted: 0,
  totalXp: 0,
  currentStreak: 0,
  perfectQuizzes: 0,
  completedModules: [],
  lastActivityDate: null,
  // Daily goal tracking
  dailyGoalId: DEFAULT_DAILY_GOAL,
  dailyXpEarned: 0,
  dailyGoalStreak: 0,
  dailyGoalLastCompleteDate: null
}

// Get local stats
export function getLocalStats() {
  try {
    const data = localStorage.getItem(LOCAL_STATS_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      // Merge with defaults to ensure new fields exist
      return { ...DEFAULT_STATS, ...parsed }
    }
    return { ...DEFAULT_STATS }
  } catch {
    return { ...DEFAULT_STATS }
  }
}

// Helper to save stats and notify listeners
function saveStatsAndNotify(stats) {
  localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(stats))
  // Dispatch event to notify all components (like XPBar) of the update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('xpUpdated'))
  }
}

// Update local stats
export function updateLocalStats(updates) {
  const stats = getLocalStats()
  const newStats = { ...stats, ...updates }
  saveStatsAndNotify(newStats)
  return newStats
}

// Get the user's daily goal XP target
export function getDailyGoalXp() {
  const stats = getLocalStats()
  const goalId = stats.dailyGoalId || DEFAULT_DAILY_GOAL
  return DAILY_GOALS[goalId]?.xp || DAILY_GOALS[DEFAULT_DAILY_GOAL].xp
}

// Set the user's daily goal
export function setDailyGoal(goalId) {
  if (!DAILY_GOALS[goalId]) {
    console.warn(`Invalid daily goal ID: ${goalId}`)
    return null
  }
  return updateLocalStats({ dailyGoalId: goalId })
}

// Check if it's a new day and reset daily XP if needed
export function checkDailyReset() {
  const stats = getLocalStats()
  const today = new Date().toISOString().split('T')[0]
  const lastActivity = stats.lastActivityDate

  if (lastActivity && today !== lastActivity) {
    // It's a new day - check if goal was met yesterday
    const goalXp = getDailyGoalXp()
    const wasGoalMet = (stats.dailyXpEarned || 0) >= goalXp

    if (wasGoalMet) {
      // Goal was met, increment streak
      stats.dailyGoalStreak = (stats.dailyGoalStreak || 0) + 1
      stats.dailyGoalLastCompleteDate = lastActivity
    } else if (stats.dailyGoalStreak > 0) {
      // Goal not met, reset streak
      stats.dailyGoalStreak = 0
    }

    // Reset daily XP counter
    stats.dailyXpEarned = 0
    saveStatsAndNotify(stats)
  }

  return stats
}

// Add to daily XP earned (called when any XP is earned)
export function addDailyXp(amount) {
  const stats = getLocalStats()
  const goalXp = getDailyGoalXp()
  const wasAlreadyComplete = (stats.dailyXpEarned || 0) >= goalXp

  stats.dailyXpEarned = (stats.dailyXpEarned || 0) + amount
  const isNowComplete = stats.dailyXpEarned >= goalXp
  const justCompleted = !wasAlreadyComplete && isNowComplete

  // If just completed, add bonus XP
  if (justCompleted) {
    stats.totalXp = (stats.totalXp || 0) + XP_CONFIG.DAILY_GOAL_COMPLETE_BONUS
    if (!stats.xpBySource) stats.xpBySource = {}
    stats.xpBySource.dailyGoalBonus = (stats.xpBySource.dailyGoalBonus || 0) + XP_CONFIG.DAILY_GOAL_COMPLETE_BONUS
  }

  saveStatsAndNotify(stats)

  return {
    dailyXpEarned: stats.dailyXpEarned,
    goalXp,
    isComplete: isNowComplete,
    justCompleted,
    bonusXp: justCompleted ? XP_CONFIG.DAILY_GOAL_COMPLETE_BONUS : 0
  }
}

// Get daily goal progress info
export function getDailyGoalProgress() {
  const stats = checkDailyReset() // Ensure we've reset if it's a new day
  const goalId = stats.dailyGoalId || DEFAULT_DAILY_GOAL
  const goal = DAILY_GOALS[goalId]
  const goalXp = goal?.xp || DAILY_GOALS[DEFAULT_DAILY_GOAL].xp
  const dailyXpEarned = stats.dailyXpEarned || 0
  const isComplete = dailyXpEarned >= goalXp
  const progressPercent = Math.min(Math.round((dailyXpEarned / goalXp) * 100), 100)

  return {
    goalId,
    goal,
    goalXp,
    dailyXpEarned,
    isComplete,
    progressPercent,
    dailyGoalStreak: stats.dailyGoalStreak || 0
  }
}

// Add XP to local stats and check for level up
export function addLocalXp(amount, source = 'unknown') {
  // First check if we need to reset daily XP for a new day
  checkDailyReset()

  const stats = getLocalStats()
  const previousXp = stats.totalXp || 0
  const previousLevel = getLevelInfo(previousXp)

  stats.totalXp = previousXp + amount
  stats.lastActivityDate = new Date().toISOString().split('T')[0]

  // Track daily XP earned
  const goalXp = getDailyGoalXp()
  const wasGoalComplete = (stats.dailyXpEarned || 0) >= goalXp
  stats.dailyXpEarned = (stats.dailyXpEarned || 0) + amount
  const isGoalComplete = stats.dailyXpEarned >= goalXp
  const dailyGoalJustCompleted = !wasGoalComplete && isGoalComplete

  // Add bonus XP if daily goal just completed
  if (dailyGoalJustCompleted) {
    stats.totalXp += XP_CONFIG.DAILY_GOAL_COMPLETE_BONUS
    if (!stats.xpBySource) stats.xpBySource = {}
    stats.xpBySource.dailyGoalBonus = (stats.xpBySource.dailyGoalBonus || 0) + XP_CONFIG.DAILY_GOAL_COMPLETE_BONUS
  }

  // Track XP by source for debugging
  if (!stats.xpBySource) stats.xpBySource = {}
  stats.xpBySource[source] = (stats.xpBySource[source] || 0) + amount

  saveStatsAndNotify(stats)

  const newLevel = getLevelInfo(stats.totalXp)
  const leveledUp = newLevel.level > previousLevel.level
  const titleChanged = newLevel.title !== previousLevel.title

  return {
    stats,
    xpAwarded: amount,
    newTotal: stats.totalXp,
    leveledUp,
    newLevel: newLevel.level,
    newTitle: newLevel.title,
    titleChanged,
    previousLevel: previousLevel.level,
    dailyGoalJustCompleted,
    dailyGoalBonusXp: dailyGoalJustCompleted ? XP_CONFIG.DAILY_GOAL_COMPLETE_BONUS : 0
  }
}

// Increment lessons completed in local stats (adds XP too)
export function incrementLessonsCompleted() {
  // First check if we need to reset daily XP for a new day
  checkDailyReset()

  const stats = getLocalStats()
  stats.lessonsCompleted = (stats.lessonsCompleted || 0) + 1
  stats.lastActivityDate = new Date().toISOString().split('T')[0]

  // Add lesson XP
  const previousXp = stats.totalXp || 0
  stats.totalXp = previousXp + XP_CONFIG.LESSON_COMPLETE

  // Track daily XP earned
  const goalXp = getDailyGoalXp()
  const wasGoalComplete = (stats.dailyXpEarned || 0) >= goalXp
  stats.dailyXpEarned = (stats.dailyXpEarned || 0) + XP_CONFIG.LESSON_COMPLETE
  const isGoalComplete = stats.dailyXpEarned >= goalXp
  const dailyGoalJustCompleted = !wasGoalComplete && isGoalComplete

  // Add bonus XP if daily goal just completed
  if (dailyGoalJustCompleted) {
    stats.totalXp += XP_CONFIG.DAILY_GOAL_COMPLETE_BONUS
    if (!stats.xpBySource) stats.xpBySource = {}
    stats.xpBySource.dailyGoalBonus = (stats.xpBySource.dailyGoalBonus || 0) + XP_CONFIG.DAILY_GOAL_COMPLETE_BONUS
  }

  // Track XP by source
  if (!stats.xpBySource) stats.xpBySource = {}
  stats.xpBySource.lesson = (stats.xpBySource.lesson || 0) + XP_CONFIG.LESSON_COMPLETE

  saveStatsAndNotify(stats)

  // Return stats with daily goal info
  stats.dailyGoalJustCompleted = dailyGoalJustCompleted
  stats.dailyGoalBonusXp = dailyGoalJustCompleted ? XP_CONFIG.DAILY_GOAL_COMPLETE_BONUS : 0
  return stats
}

// Add quiz XP to local stats
export function addQuizXp(passed, perfect) {
  if (!passed) return { xpAwarded: 0 }

  let xp = XP_CONFIG.QUIZ_PASS
  if (perfect) {
    xp += XP_CONFIG.QUIZ_PERFECT_BONUS
  }

  return addLocalXp(xp, 'quiz')
}

// Add achievement XP to local stats
export function addAchievementXp(achievementIds) {
  if (!achievementIds || achievementIds.length === 0) return { xpAwarded: 0 }

  const totalXp = achievementIds.reduce((sum, id) => {
    return sum + (ACHIEVEMENT_XP[id] || ACHIEVEMENTS[id]?.xpReward || 0)
  }, 0)

  if (totalXp > 0) {
    return addLocalXp(totalXp, 'achievement')
  }
  return { xpAwarded: 0 }
}

// Mark module as completed in local stats
export function markModuleCompletedLocal(moduleSlug) {
  const stats = getLocalStats()
  if (!stats.completedModules) {
    stats.completedModules = []
  }
  if (!stats.completedModules.includes(moduleSlug)) {
    stats.completedModules.push(moduleSlug)
    stats.modulesCompleted = stats.completedModules.length

    // Add module completion XP
    const moduleXp = XP_CONFIG.MODULE_COMPLETION[moduleSlug] || XP_CONFIG.MODULE_COMPLETION.archetype || 50
    const previousXp = stats.totalXp || 0
    stats.totalXp = previousXp + moduleXp

    if (!stats.xpBySource) stats.xpBySource = {}
    stats.xpBySource.module = (stats.xpBySource.module || 0) + moduleXp
  }
  saveStatsAndNotify(stats)
  return stats
}

// Check for new achievements based on current stats
export function checkAchievements(stats, earnedAchievements = [], event = null, eventData = {}) {
  const newAchievements = []

  // First Steps - first lesson completed
  if (!earnedAchievements.includes('first-steps') && stats.lessonsCompleted >= 1) {
    newAchievements.push('first-steps')
  }

  // Perfect Score - 100% on any quiz
  if (!earnedAchievements.includes('perfect-score') && event === 'quiz-complete' && eventData.perfect) {
    newAchievements.push('perfect-score')
  }

  // On Fire - 3 day streak
  if (!earnedAchievements.includes('on-fire') && stats.currentStreak >= 3) {
    newAchievements.push('on-fire')
  }

  // Week Warrior - 7 day streak
  if (!earnedAchievements.includes('week-warrior') && stats.currentStreak >= 7) {
    newAchievements.push('week-warrior')
  }

  // Monthly Master - 30 day streak
  if (!earnedAchievements.includes('monthly-master') && stats.currentStreak >= 30) {
    newAchievements.push('monthly-master')
  }

  // Module Master - complete any module
  if (!earnedAchievements.includes('module-master') && stats.modulesCompleted >= 1) {
    newAchievements.push('module-master')
  }

  // Rising Star - 500 XP (use calculated XP, not stored total)
  const calculatedXpForCheck = calculateTotalXP()
  if (!earnedAchievements.includes('rising-star') && calculatedXpForCheck >= 500) {
    newAchievements.push('rising-star')
  }

  // Knowledge Seeker - 25 lessons
  if (!earnedAchievements.includes('knowledge-seeker') && stats.lessonsCompleted >= 25) {
    newAchievements.push('knowledge-seeker')
  }

  // Dedicated Learner - 50 lessons
  if (!earnedAchievements.includes('dedicated-learner') && stats.lessonsCompleted >= 50) {
    newAchievements.push('dedicated-learner')
  }

  // Expert Trader - all Trading 101 modules
  if (!earnedAchievements.includes('expert-trader') && stats.completedModules) {
    const hasAllTrading101 = TRADING_101_MODULES.every(m =>
      stats.completedModules.includes(m)
    )
    if (hasAllTrading101) {
      newAchievements.push('expert-trader')
    }
  }

  return newAchievements
}

// Calculate total XP reward for achievements
export function calculateAchievementXpReward(achievementIds) {
  return achievementIds.reduce((total, id) => {
    const achievement = ACHIEVEMENTS[id]
    return total + (achievement?.xpReward || 0)
  }, 0)
}

// Get achievement details by ID
export function getAchievementById(id) {
  return ACHIEVEMENTS[id] || null
}

// Get all achievement IDs
export function getAllAchievementIds() {
  return Object.keys(ACHIEVEMENTS)
}

// ==============================================
// PLACEMENT TEST XP AND ACHIEVEMENT SYSTEM
// ==============================================

// XP values for testing out of each module
const MODULE_TEST_OUT_XP = {
  newcomer: {
    // 5 lessons × 25 XP = 125
    // 5 quizzes passed × 10 XP = 50
    // Module completion bonus = 50
    // Total: 225 XP
    lessonXp: 125,
    quizXp: 50,
    moduleBonus: 50,
    total: 225
  },
  apprentice: {
    // 5 lessons × 25 XP = 125
    // 5 quizzes × 10 XP = 50
    // Module completion bonus = 75
    // Total: 250 XP
    lessonXp: 125,
    quizXp: 50,
    moduleBonus: 75,
    total: 250
  },
  trader: {
    // 5 lessons × 25 XP = 125
    // 5 quizzes × 10 XP = 50
    // Module completion bonus = 100
    // Total: 275 XP
    lessonXp: 125,
    quizXp: 50,
    moduleBonus: 100,
    total: 275
  },
  specialist: {
    // 5 lessons × 25 XP = 125
    // 5 quizzes × 10 XP = 50
    // Module completion bonus = 150
    // Total: 325 XP
    lessonXp: 125,
    quizXp: 50,
    moduleBonus: 150,
    total: 325
  },
  master: {
    // 5 lessons × 25 XP = 125
    // 5 quizzes × 10 XP = 50
    // Module completion bonus = 200
    // Total: 375 XP
    lessonXp: 125,
    quizXp: 50,
    moduleBonus: 200,
    total: 375
  }
}

// Calculate XP for placement test based on placement level
// Awards XP for all modules BELOW placement level (modules they tested out of)
export function calculatePlacementXP(placementLevel) {
  const levels = ['newcomer', 'apprentice', 'trader', 'specialist', 'master']
  const placementIndex = placementLevel === 'completed' ? 5 : levels.indexOf(placementLevel)

  let totalXp = 0

  // Award XP for all modules BELOW placement level (modules they tested out of)
  for (let i = 0; i < placementIndex; i++) {
    totalXp += MODULE_TEST_OUT_XP[levels[i]].total
  }

  return totalXp
}

// Calculate which achievements should be awarded for placement test
// Does NOT award time-based achievements (streaks)
export function calculatePlacementAchievements(placementLevel, sectionScores) {
  const levels = ['newcomer', 'apprentice', 'trader', 'specialist', 'master']
  const placementIndex = placementLevel === 'completed' ? 5 : levels.indexOf(placementLevel)
  const modulesTestedOut = placementIndex
  const lessonsEquivalent = modulesTestedOut * 5

  const achievements = []
  const earnedAchievements = getLocalAchievements()

  // First Steps - if they tested out of at least Newcomer
  if (modulesTestedOut >= 1 && !earnedAchievements.includes('first-steps')) {
    achievements.push('first-steps')
  }

  // Perfect Score - if any section was 100%
  if (sectionScores) {
    const gotPerfectSection = Object.values(sectionScores).some(score => score === 1.0)
    if (gotPerfectSection && !earnedAchievements.includes('perfect-score')) {
      achievements.push('perfect-score')
    }
  }

  // Module Master - if tested out of at least 1 module
  if (modulesTestedOut >= 1 && !earnedAchievements.includes('module-master')) {
    achievements.push('module-master')
  }

  // Knowledge Seeker - 25 lessons equivalent (need all 5 modules = 25 lessons)
  if (lessonsEquivalent >= 25 && !earnedAchievements.includes('knowledge-seeker')) {
    achievements.push('knowledge-seeker')
  }

  // Expert Trader - completed all Trading 101
  if (modulesTestedOut >= 5 && !earnedAchievements.includes('expert-trader')) {
    achievements.push('expert-trader')
  }

  // ==============================================
  // IMPORTANT: Placement test ONLY awards KNOWLEDGE achievements
  // We deliberately do NOT award CONSISTENCY/STREAK achievements:
  // - on-fire (3 day streak) - requires returning 3 days
  // - week-warrior (7 day streak) - requires returning 7 days
  // - monthly-master (30 day streak) - requires returning 30 days
  // - dedicated-learner (50 lessons) - only from actual lessons, not placement
  //
  // This ensures the XP leaderboard reflects:
  // 1. KNOWLEDGE - What you know (placement test can demonstrate this)
  // 2. CONSISTENCY - How regularly you learn (must be earned over time)
  // ==============================================

  return achievements
}

// Check if placement test has been completed before
export function hasCompletedPlacementTest() {
  try {
    return localStorage.getItem('placementTestCompleted') === 'true'
  } catch {
    return false
  }
}

// Get placement test BEST scores (for XP calculation and module unlocking)
// These are the highest scores ever achieved across all attempts
export function getPlacementBestScores() {
  try {
    // Try new key first
    let data = localStorage.getItem('placementTestBestScores')
    if (data) {
      return JSON.parse(data)
    }
    // Fall back to legacy key (before best/latest separation)
    data = localStorage.getItem('placementTestScores')
    if (data) {
      return JSON.parse(data)
    }
    // Also check moduleScores in progress (another legacy location)
    const progressData = localStorage.getItem('hindsight_academy_progress')
    if (progressData) {
      const progress = JSON.parse(progressData)
      if (progress.moduleScores && Object.keys(progress.moduleScores).length > 0) {
        return progress.moduleScores
      }
    }
    return {}
  } catch {
    return {}
  }
}

// Get placement test LATEST scores (for review recommendations)
// These are the most recent scores from the last attempt
export function getPlacementLatestScores() {
  try {
    const data = localStorage.getItem('placementTestLatestScores')
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

// Save placement test scores - tracks both BEST and LATEST separately
// - Best scores: Used for XP calculation and module unlocking (can only go up)
// - Latest scores: Used for review recommendations (reflects current knowledge)
function savePlacementScores(sectionScores) {
  try {
    // Always save the latest scores (most recent attempt)
    localStorage.setItem('placementTestLatestScores', JSON.stringify(sectionScores))
    localStorage.setItem('placementTestLatestDate', new Date().toISOString())

    // Update best scores - take the MAX of existing and new for each section
    const existingBest = getPlacementBestScores()
    const updatedBest = { ...existingBest }

    Object.entries(sectionScores).forEach(([level, score]) => {
      if (!updatedBest[level] || score > updatedBest[level]) {
        updatedBest[level] = score
      }
    })

    localStorage.setItem('placementTestBestScores', JSON.stringify(updatedBest))

    // Also save to legacy key for backwards compatibility
    localStorage.setItem('placementTestScores', JSON.stringify(updatedBest))

    return { bestScores: updatedBest, latestScores: sectionScores }
  } catch (err) {
    console.error('Failed to save placement scores:', err)
    return { bestScores: sectionScores, latestScores: sectionScores }
  }
}

// Mark placement test as completed (first time only)
function markPlacementTestCompleted() {
  try {
    localStorage.setItem('placementTestCompleted', 'true')
    localStorage.setItem('placementTestDate', new Date().toISOString())
  } catch (err) {
    console.error('Failed to mark placement test completed:', err)
  }
}

// Award XP and achievements for placement test
// Returns the rewards that were given
//
// SCORING LOGIC:
// - BEST scores: Used for XP calculation and module unlocking (can only go up)
// - LATEST scores: Used for review recommendations (reflects current knowledge)
//
// On retake:
// - Best scores are updated if new scores are higher
// - XP is recalculated based on best scores (may increase if better)
// - Review recommendations use latest scores
export function awardPlacementRewards(placementLevel, sectionScores) {
  const levels = ['newcomer', 'apprentice', 'trader', 'specialist', 'master']
  const isFirstCompletion = !hasCompletedPlacementTest()

  // Save scores - this updates both best and latest
  const { bestScores, latestScores } = savePlacementScores(sectionScores)

  // Calculate modules unlocked based on BEST scores (not current attempt)
  // This ensures you never lose module access from a bad retake
  const modulesUnlockedFromBest = levels.filter(level => bestScores[level] >= 0.75)

  // If first time, mark as completed
  if (isFirstCompletion) {
    markPlacementTestCompleted()
  }

  // Calculate achievements based on best scores
  const placementIndex = modulesUnlockedFromBest.length
  const newAchievements = isFirstCompletion
    ? calculatePlacementAchievements(placementLevel, bestScores)
    : []

  // Award achievements (only on first completion)
  newAchievements.forEach(achId => {
    saveLocalAchievement(achId)
  })

  // Update stats to track modules tested out (based on best scores)
  const stats = getLocalStats()

  // Track which modules were completed via placement (based on best scores)
  if (!stats.completedModules) stats.completedModules = []
  modulesUnlockedFromBest.forEach(moduleSlug => {
    if (!stats.completedModules.includes(moduleSlug)) {
      stats.completedModules.push(moduleSlug)
    }
  })

  // Update lesson and module counts based on best scores
  stats.lessonsCompleted = Math.max(stats.lessonsCompleted || 0, modulesUnlockedFromBest.length * 5)
  stats.modulesCompleted = Math.max(stats.modulesCompleted || 0, modulesUnlockedFromBest.length)

  saveStatsAndNotify(stats)

  // Dispatch XP update event so components recalculate XP
  dispatchXPUpdate()

  // Check for XP-based achievements (like Rising Star at 500 XP)
  const calculatedXp = calculateTotalXP()
  const xpAchievements = []
  const earnedAchievements = getLocalAchievements()

  if (calculatedXp >= 500 && !earnedAchievements.includes('rising-star')) {
    xpAchievements.push('rising-star')
    saveLocalAchievement('rising-star')
  }

  // Return info for UI - XP is calculated, not stored
  return {
    xpEarned: calculateTotalXP(), // Current total XP (calculated)
    achievements: [...newAchievements, ...xpAchievements],
    modulesUnlocked: modulesUnlockedFromBest.length,
    isRetake: !isFirstCompletion,
    bestScores,
    latestScores
  }
}
