// XP and Progression Configuration

export const XP_CONFIG = {
  // Lesson completion
  LESSON_COMPLETE: 25,

  // Quiz XP
  QUIZ_PASS: 10,           // Pass quiz (80%+)
  QUIZ_PERFECT_BONUS: 25,  // Additional bonus for 100%
  MODULE_FINAL_PASS: 40,
  MODULE_FINAL_PERFECT: 60,

  // Module completion bonuses
  MODULE_COMPLETION: {
    newcomer: 50,
    apprentice: 75,
    trader: 100,
    specialist: 150,
    master: 200,
    archetype: 100,
  },

  // Streak bonuses
  STREAK_DAILY: 5,
  STREAK_7_DAY: 25,
  STREAK_30_DAY: 100,

  // Engagement activities
  DAILY_LOGIN: 5,
  FIRST_TRADE_LOGGED: 25,
  JOURNAL_ENTRY: 15,
  JOURNAL_REFLECTION_BONUS: 5,  // Bonus for adding notes/reflection
  JOURNAL_DAILY_LIMIT: 5,       // Max entries per day that earn XP
  WEEKLY_REVIEW: 25,
  WALLET_ANALYSIS: 20,

  // Quiz settings
  PASS_THRESHOLD: 0.8, // 80% to pass

  // Retake rules
  ALLOW_RETAKES: true,
  XP_ON_IMPROVEMENT_ONLY: true,

  // Daily goal bonus
  DAILY_GOAL_COMPLETE_BONUS: 5,
}

// Daily goal options
export const DAILY_GOALS = {
  casual: {
    id: 'casual',
    name: 'Casual',
    time: '10 min/day',
    xp: 50,
    description: '1-2 lessons per day'
  },
  regular: {
    id: 'regular',
    name: 'Regular',
    time: '20 min/day',
    xp: 100,
    description: '2-3 lessons per day'
  },
  committed: {
    id: 'committed',
    name: 'Committed',
    time: '30 min/day',
    xp: 150,
    description: '3-4 lessons per day'
  },
  intense: {
    id: 'intense',
    name: 'Intense',
    time: '45 min/day',
    xp: 225,
    description: '5-6 lessons per day'
  },
  allIn: {
    id: 'allIn',
    name: 'All-In',
    time: '60+ min/day',
    xp: 300,
    description: 'Full study session'
  }
}

// Default daily goal for new users
export const DEFAULT_DAILY_GOAL = 'regular'

// Achievement XP rewards (must match achievements.js)
export const ACHIEVEMENT_XP = {
  'first-steps': 25,
  'on-fire': 50,
  'week-warrior': 100,
  'monthly-master': 500,
  'perfect-score': 50,
  'module-master': 100,
  'rising-star': 25,
  'expert-trader': 250,
  'knowledge-seeker': 100,
  'dedicated-learner': 200,
}

// Level Thresholds - Updated for better progression feel
//
// Design Rationale:
// - Newcomer (1-2): Just starting, 0-249 XP
// - Apprentice (3-4): Learning basics, 250-599 XP
// - Trader (5-6): Has foundational knowledge, 600-1099 XP
// - Specialist (7-8): Solid understanding, 1100-1799 XP
// - Master (9-10): Advanced knowledge, 1800-2999 XP
// - Expert (11-12): Comprehensive mastery, 3000-5499 XP
// - Grandmaster (13-14): Elite tier, 5500-9999 XP
// - Legend (15): Maximum achievement, 10000+ XP
//
// Expected outcomes:
// - Aces placement test (~1000-1200 XP) → Specialist (Level 7)
// - Passes most modules (~600-800 XP) → Trader (Level 5-6)
// - Completes all content + consistency → Expert/Grandmaster
// - Legend requires significant time investment
export const LEVEL_THRESHOLDS = [
  { level: 1, xpRequired: 0, title: 'Newcomer' },
  { level: 2, xpRequired: 100, title: 'Newcomer' },
  { level: 3, xpRequired: 250, title: 'Apprentice' },
  { level: 4, xpRequired: 400, title: 'Apprentice' },
  { level: 5, xpRequired: 600, title: 'Trader' },
  { level: 6, xpRequired: 850, title: 'Trader' },
  { level: 7, xpRequired: 1100, title: 'Specialist' },
  { level: 8, xpRequired: 1400, title: 'Specialist' },
  { level: 9, xpRequired: 1800, title: 'Master' },
  { level: 10, xpRequired: 2300, title: 'Master' },
  { level: 11, xpRequired: 3000, title: 'Expert' },
  { level: 12, xpRequired: 4000, title: 'Expert' },
  { level: 13, xpRequired: 5500, title: 'Grandmaster' },
  { level: 14, xpRequired: 7500, title: 'Grandmaster' },
  { level: 15, xpRequired: 10000, title: 'Legend' },
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
