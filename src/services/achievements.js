// Achievement Definitions and Checking Service
import { XP_CONFIG, ACHIEVEMENT_XP, getLevelInfo, DAILY_GOALS, DEFAULT_DAILY_GOAL } from '../config/xpConfig'

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

// Update local stats
export function updateLocalStats(updates) {
  const stats = getLocalStats()
  const newStats = { ...stats, ...updates }
  localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(newStats))
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
    localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(stats))
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

  localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(stats))

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

  localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(stats))

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

  localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(stats))

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
  localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(stats))
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

  // Rising Star - 500 XP
  if (!earnedAchievements.includes('rising-star') && stats.totalXp >= 500) {
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
