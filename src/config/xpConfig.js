// XP and Progression Configuration

export const XP_CONFIG = {
  // Lesson activities
  LESSON_READ: 10,
  QUIZ_PASS: 15,
  QUIZ_PERFECT: 25,
  MODULE_FINAL_PASS: 40,
  MODULE_FINAL_PERFECT: 60,
  MODULE_COMPLETION_BONUS: 50,

  // Engagement activities
  DAILY_LOGIN: 5,
  FIRST_TRADE_LOGGED: 25,
  JOURNAL_ENTRY: 10,

  // Streak bonuses
  STREAK_7_DAY: 25,
  STREAK_30_DAY: 100,
  STREAK_100_DAY: 500,

  // Quiz settings
  PASS_THRESHOLD: 0.8, // 80% to pass

  // Retake rules
  ALLOW_RETAKES: true,
  XP_ON_IMPROVEMENT_ONLY: true,
}

export const LEVEL_THRESHOLDS = [
  { level: 1, xpRequired: 0, title: 'Newcomer' },
  { level: 2, xpRequired: 50, title: 'Newcomer' },
  { level: 3, xpRequired: 125, title: 'Newcomer' },
  { level: 4, xpRequired: 225, title: 'Apprentice' },
  { level: 5, xpRequired: 375, title: 'Apprentice' },
  { level: 6, xpRequired: 575, title: 'Apprentice' },
  { level: 7, xpRequired: 825, title: 'Journeyman' },
  { level: 8, xpRequired: 1125, title: 'Journeyman' },
  { level: 9, xpRequired: 1525, title: 'Journeyman' },
  { level: 10, xpRequired: 2025, title: 'Expert' },
  { level: 11, xpRequired: 2625, title: 'Expert' },
  { level: 12, xpRequired: 3375, title: 'Expert' },
  { level: 13, xpRequired: 4275, title: 'Master' },
  { level: 14, xpRequired: 5275, title: 'Master' },
  { level: 15, xpRequired: 6475, title: 'Legend' },
]

export const ACHIEVEMENTS = {
  FIRST_STEPS: {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete the Newcomer module',
    icon: '🎓',
  },
  WEEK_WARRIOR: {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: '7-day learning streak',
    icon: '🔥',
  },
  PERFECTIONIST: {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: '5 perfect quizzes in a row',
    icon: '💯',
  },
  SCHOLAR: {
    id: 'scholar',
    name: 'Scholar',
    description: 'Complete the Trading 101 track',
    icon: '📚',
  },
  SELF_AWARE: {
    id: 'self_aware',
    name: 'Self Aware',
    description: 'Complete your archetype track',
    icon: '🧠',
  },
  GRADUATE: {
    id: 'graduate',
    name: 'Graduate',
    description: 'Complete all available content',
    icon: '🏆',
  },
  JOURNALIST: {
    id: 'journalist',
    name: 'Journalist',
    description: 'Log 10 trades with notes',
    icon: '✍️',
  },
  DIAMOND_HANDS: {
    id: 'diamond_hands',
    name: 'Diamond Hands',
    description: '30-day learning streak',
    icon: '💎',
  },
}

// Helper to get current level info
export function getLevelInfo(totalXp) {
  let currentLevel = LEVEL_THRESHOLDS[0]
  let nextLevel = LEVEL_THRESHOLDS[1]

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXp >= LEVEL_THRESHOLDS[i].xpRequired) {
      currentLevel = LEVEL_THRESHOLDS[i]
      nextLevel = LEVEL_THRESHOLDS[i + 1] || null
    } else {
      break
    }
  }

  const xpInCurrentLevel = totalXp - currentLevel.xpRequired
  const xpForNextLevel = nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : 0
  const progressPercent = nextLevel ? Math.round((xpInCurrentLevel / xpForNextLevel) * 100) : 100

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    totalXp,
    xpInCurrentLevel,
    xpForNextLevel,
    xpToNextLevel: nextLevel ? nextLevel.xpRequired - totalXp : 0,
    progressPercent,
    isMaxLevel: !nextLevel,
  }
}

// Calculate XP for quiz based on score
export function calculateQuizXp(score, totalQuestions, isModuleTest = false) {
  const percent = score / totalQuestions
  const passed = percent >= XP_CONFIG.PASS_THRESHOLD
  const perfect = score === totalQuestions

  if (!passed) {
    return { xp: 0, passed: false, perfect: false }
  }

  if (isModuleTest) {
    return {
      xp: perfect ? XP_CONFIG.MODULE_FINAL_PERFECT : XP_CONFIG.MODULE_FINAL_PASS,
      passed: true,
      perfect,
    }
  }

  return {
    xp: perfect ? XP_CONFIG.QUIZ_PERFECT : XP_CONFIG.QUIZ_PASS,
    passed: true,
    perfect,
  }
}
