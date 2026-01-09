// Achievement Definitions and Checking Service
import { XP_CONFIG, ACHIEVEMENT_XP, getLevelInfo } from '../config/xpConfig'

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

// Get local stats
export function getLocalStats() {
  try {
    const data = localStorage.getItem(LOCAL_STATS_KEY)
    return data ? JSON.parse(data) : {
      lessonsCompleted: 0,
      modulesCompleted: 0,
      totalXp: 0,
      currentStreak: 0,
      perfectQuizzes: 0,
      completedModules: [],
      lastActivityDate: null
    }
  } catch {
    return {
      lessonsCompleted: 0,
      modulesCompleted: 0,
      totalXp: 0,
      currentStreak: 0,
      perfectQuizzes: 0,
      completedModules: [],
      lastActivityDate: null
    }
  }
}

// Update local stats
export function updateLocalStats(updates) {
  const stats = getLocalStats()
  const newStats = { ...stats, ...updates }
  localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(newStats))
  return newStats
}

// Add XP to local stats and check for level up
export function addLocalXp(amount, source = 'unknown') {
  const stats = getLocalStats()
  const previousXp = stats.totalXp || 0
  const previousLevel = getLevelInfo(previousXp)

  stats.totalXp = previousXp + amount
  stats.lastActivityDate = new Date().toISOString().split('T')[0]

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
    previousLevel: previousLevel.level
  }
}

// Increment lessons completed in local stats (adds XP too)
export function incrementLessonsCompleted() {
  const stats = getLocalStats()
  stats.lessonsCompleted = (stats.lessonsCompleted || 0) + 1
  stats.lastActivityDate = new Date().toISOString().split('T')[0]

  // Add lesson XP
  const previousXp = stats.totalXp || 0
  stats.totalXp = previousXp + XP_CONFIG.LESSON_COMPLETE

  // Track XP by source
  if (!stats.xpBySource) stats.xpBySource = {}
  stats.xpBySource.lesson = (stats.xpBySource.lesson || 0) + XP_CONFIG.LESSON_COMPLETE

  localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(stats))
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
