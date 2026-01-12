import {
  initDb,
  getAcademyModules,
  getAcademyModuleBySlug,
  getAcademyLessonBySlug,
  getRecommendedLessons,
  getUserAcademyProgress,
  markLessonComplete,
  getUserById,
  seedAcademyContent,
  getAcademyOnboardingStatus,
  saveAcademyOnboarding,
  // Quiz and XP functions
  getUserXpProgress,
  addUserXp,
  updateStreak,
  recordQuizAttempt,
  updateQuizBestScore,
  getAllQuizBestScores,
  getUserAchievements,
  awardAchievement,
  getModuleCompletions,
  recordModuleCompletion,
  getFullUserProgress,
  // Leaderboard functions
  getLeaderboard,
  getUserRank,
  syncUserXp,
  // Cross-device progress sync
  saveUserProgress,
  getUserProgress,
  // Course request functions
  initCourseRequestsTable,
  createCourseRequest,
  getTopCourseRequests,
  voteCourseRequest,
} from '../lib/db.js'
import { cors } from '../lib/auth.js'
import jwt from 'jsonwebtoken'

// XP Configuration (duplicated from frontend for server-side calculations)
const XP_CONFIG = {
  LESSON_READ: 10,
  QUIZ_PASS: 15,
  QUIZ_PERFECT: 25,
  MODULE_FINAL_PASS: 40,
  MODULE_FINAL_PERFECT: 60,
  MODULE_COMPLETION_BONUS: 50,
  STREAK_7_DAY: 25,
  STREAK_30_DAY: 100,
  STREAK_100_DAY: 500,
  PASS_THRESHOLD: 0.8,
}

const LEVEL_THRESHOLDS = [
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

const JWT_SECRET = process.env.JWT_SECRET || 'hindsight-secret-key-change-in-production'

// Initialize database and seed content on cold start
let dbInitialized = false
async function ensureDb() {
  if (!dbInitialized) {
    console.log('[Academy] Starting database initialization...')
    try {
      await initDb()
      console.log('[Academy] Database initialized, checking for seed...')
      // Auto-seed content if no modules exist
      const modules = await getAcademyModules()
      if (modules.length === 0) {
        console.log('[Academy] No modules found, seeding content...')
        await seedAcademyContent()
      }
      // Initialize course requests table
      await initCourseRequestsTable()
      dbInitialized = true
      console.log('[Academy] Database ready')
    } catch (err) {
      console.error('[Academy] Database initialization failed:', err.message)
      throw err
    }
  }
}

// Helper to verify JWT and get user
async function authenticateUser(req) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await getUserById(decoded.id)
    return user
  } catch (err) {
    return null
  }
}

// Parse path segments from catch-all route
function parsePath(path) {
  if (!path) return []
  if (Array.isArray(path)) return path
  return path.split('/').filter(Boolean)
}

export default async function handler(req, res) {
  // Set CORS headers
  cors(res, req)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const segments = parsePath(req.query.path)
  const method = req.method

  try {
    // Ensure database is initialized (inside try/catch to handle errors)
    await ensureDb()
    // GET /api/academy/modules - List all modules with lesson counts
    if (method === 'GET' && segments.length === 1 && segments[0] === 'modules') {
      const modules = await getAcademyModules()
      return res.status(200).json({ modules })
    }

    // GET /api/academy/modules/:slug - Get module with its lessons
    if (method === 'GET' && segments.length === 2 && segments[0] === 'modules') {
      const slug = segments[1]
      const module = await getAcademyModuleBySlug(slug)

      if (!module) {
        return res.status(404).json({ error: 'Module not found' })
      }

      return res.status(200).json({ module })
    }

    // GET /api/academy/lessons/:moduleSlug/:lessonSlug - Get single lesson
    if (method === 'GET' && segments.length === 3 && segments[0] === 'lessons') {
      const moduleSlug = segments[1]
      const lessonSlug = segments[2]
      const lesson = await getAcademyLessonBySlug(moduleSlug, lessonSlug)

      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' })
      }

      return res.status(200).json({ lesson })
    }

    // GET /api/academy/progress - Get user's progress (requires auth)
    if (method === 'GET' && segments.length === 1 && segments[0] === 'progress') {
      const user = await authenticateUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const progress = await getUserAcademyProgress(user.id)
      return res.status(200).json({ progress })
    }

    // POST /api/academy/progress/:lessonId - Mark lesson complete (requires auth)
    if (method === 'POST' && segments.length === 2 && segments[0] === 'progress') {
      const user = await authenticateUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const lessonId = parseInt(segments[1], 10)
      if (isNaN(lessonId)) {
        return res.status(400).json({ error: 'Invalid lesson ID' })
      }

      await markLessonComplete(user.id, lessonId)
      return res.status(200).json({ success: true, message: 'Lesson marked complete' })
    }

    // GET /api/academy/recommended - Get archetype-based recommendations (requires auth)
    if (method === 'GET' && segments.length === 1 && segments[0] === 'recommended') {
      const user = await authenticateUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      // Get user's archetype from their profile
      const archetype = user.archetype || null
      const lessons = await getRecommendedLessons(archetype, user.id)
      return res.status(200).json({ lessons, archetype })
    }

    // POST /api/academy/seed - Seed content (dev only, requires auth or admin password)
    // Pass ?force=true to force reseed (clears existing content)
    if (method === 'POST' && segments.length === 1 && segments[0] === 'seed') {
      // Check for admin password (hidden route) or authenticated admin user
      const adminPassword = req.headers['x-admin-password']
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-admin-password-in-env'
      const isAdminPassword = adminPassword === ADMIN_PASSWORD

      if (!isAdminPassword) {
        const user = await authenticateUser(req)
        if (!user || !user.is_admin) {
          return res.status(403).json({ error: 'Admin access required' })
        }
      }

      const force = req.query.force === 'true'
      await seedAcademyContent(force)
      return res.status(200).json({ success: true, message: force ? 'Academy content reseeded' : 'Academy content seeded' })
    }

    // GET /api/academy/onboarding - Check onboarding status (requires auth)
    if (method === 'GET' && segments.length === 1 && segments[0] === 'onboarding') {
      const user = await authenticateUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const status = await getAcademyOnboardingStatus(user.id)
      return res.status(200).json(status || { onboarded: false })
    }

    // POST /api/academy/onboarding - Save onboarding data (requires auth)
    if (method === 'POST' && segments.length === 1 && segments[0] === 'onboarding') {
      const user = await authenticateUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const { experienceLevel, tradingGoal, placementScore, startSection } = req.body

      if (!experienceLevel || !tradingGoal || !startSection) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      await saveAcademyOnboarding(user.id, {
        experienceLevel,
        tradingGoal,
        placementScore: placementScore || null,
        startSection,
      })

      return res.status(200).json({ success: true, message: 'Onboarding complete' })
    }

    // ============================================
    // Quiz and XP System Endpoints
    // ============================================

    // GET /api/academy/xp-progress - Get user's full XP progress (requires auth)
    if (method === 'GET' && segments.length === 1 && segments[0] === 'xp-progress') {
      const user = await authenticateUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const fullProgress = await getFullUserProgress(user.id)

      // Calculate level info
      let currentLevelInfo = LEVEL_THRESHOLDS[0]
      let nextLevelInfo = LEVEL_THRESHOLDS[1]
      for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (fullProgress.xp.total >= LEVEL_THRESHOLDS[i].xpRequired) {
          currentLevelInfo = LEVEL_THRESHOLDS[i]
          nextLevelInfo = LEVEL_THRESHOLDS[i + 1] || null
        } else {
          break
        }
      }

      const xpInCurrentLevel = fullProgress.xp.total - currentLevelInfo.xpRequired
      const xpForNextLevel = nextLevelInfo ? nextLevelInfo.xpRequired - currentLevelInfo.xpRequired : 0
      const progressPercent = nextLevelInfo ? Math.round((xpInCurrentLevel / xpForNextLevel) * 100) : 100

      return res.status(200).json({
        ...fullProgress,
        levelInfo: {
          level: currentLevelInfo.level,
          title: currentLevelInfo.title,
          xpInCurrentLevel,
          xpForNextLevel,
          xpToNextLevel: nextLevelInfo ? nextLevelInfo.xpRequired - fullProgress.xp.total : 0,
          progressPercent,
          isMaxLevel: !nextLevelInfo,
        }
      })
    }

    // POST /api/academy/lesson/complete - Mark lesson complete and award XP (requires auth)
    if (method === 'POST' && segments.length === 2 && segments[0] === 'lesson' && segments[1] === 'complete') {
      const user = await authenticateUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const { lessonId } = req.body
      if (!lessonId) {
        return res.status(400).json({ error: 'Lesson ID required' })
      }

      // Mark lesson complete
      const wasNewCompletion = await markLessonComplete(user.id, lessonId)

      // Update streak
      const streakResult = await updateStreak(user.id)

      let xpResult = null
      let streakXpResult = null

      // Only award XP if this was a new completion
      if (wasNewCompletion) {
        xpResult = await addUserXp(user.id, XP_CONFIG.LESSON_READ, LEVEL_THRESHOLDS)

        // Check for streak milestone bonus
        if (streakResult.streakMilestone) {
          const streakXp = XP_CONFIG[streakResult.streakMilestone] || 0
          if (streakXp > 0) {
            streakXpResult = await addUserXp(user.id, streakXp, LEVEL_THRESHOLDS)
          }
        }
      }

      return res.status(200).json({
        success: true,
        wasNewCompletion,
        xpEarned: wasNewCompletion ? XP_CONFIG.LESSON_READ : 0,
        totalXp: xpResult?.newTotalXp || (await getUserXpProgress(user.id)).total_xp,
        leveledUp: xpResult?.leveledUp || false,
        newLevel: xpResult?.newLevel || null,
        streak: streakResult.streak,
        streakMilestone: streakResult.streakMilestone,
        streakXpEarned: streakXpResult?.xpEarned || 0,
      })
    }

    // POST /api/academy/quiz/submit - Submit quiz answers and get results (requires auth)
    if (method === 'POST' && segments.length === 2 && segments[0] === 'quiz' && segments[1] === 'submit') {
      const user = await authenticateUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const { quizId, answers, questions, isModuleTest } = req.body

      if (!quizId || !answers || !questions) {
        return res.status(400).json({ error: 'Quiz ID, answers, and questions required' })
      }

      // Score the quiz
      let correctCount = 0
      const questionResults = []

      for (const question of questions) {
        const userAnswer = answers[question.id]
        let isCorrect = false

        if (question.type === 'multiple-choice') {
          isCorrect = userAnswer === question.correctAnswer
        } else if (question.type === 'true-false') {
          isCorrect = userAnswer === question.correctAnswer
        } else if (question.type === 'select-all') {
          // For select-all: must have all correct and no incorrect
          const userAnswers = Array.isArray(userAnswer) ? userAnswer : []
          const correctAnswers = question.correctAnswers || []
          const hasAllCorrect = correctAnswers.every(a => userAnswers.includes(a))
          const hasNoIncorrect = userAnswers.every(a => correctAnswers.includes(a))
          isCorrect = hasAllCorrect && hasNoIncorrect
        }

        if (isCorrect) correctCount++
        questionResults.push({
          questionId: question.id,
          isCorrect,
          userAnswer,
          correctAnswer: question.correctAnswer || question.correctAnswers,
          explanation: question.explanation,
        })
      }

      const totalQuestions = questions.length
      const score = correctCount
      const percent = score / totalQuestions
      const passed = percent >= XP_CONFIG.PASS_THRESHOLD
      const perfect = score === totalQuestions

      // Calculate potential XP
      let potentialXp = 0
      if (passed) {
        if (isModuleTest) {
          potentialXp = perfect ? XP_CONFIG.MODULE_FINAL_PERFECT : XP_CONFIG.MODULE_FINAL_PASS
        } else {
          potentialXp = perfect ? XP_CONFIG.QUIZ_PERFECT : XP_CONFIG.QUIZ_PASS
        }
      }

      // Wrap DB operations in try-catch for better error messages
      let bestScoreResult, xpToAward, xpResult, updatedProgress
      try {
        // Update streak on quiz activity
        await updateStreak(user.id)

        // Get XP to award (handles retakes - only awards difference)
        bestScoreResult = await updateQuizBestScore(user.id, quizId, score, potentialXp)
        xpToAward = bestScoreResult.xpToAward

        // Record the attempt
        await recordQuizAttempt(user.id, quizId, score, totalQuestions, passed, perfect, xpToAward, answers)

        // Award XP if any
        xpResult = null
        if (xpToAward > 0) {
          xpResult = await addUserXp(user.id, xpToAward, LEVEL_THRESHOLDS)
        }

        // Get updated progress
        updatedProgress = await getUserXpProgress(user.id)
      } catch (dbError) {
        console.error('Quiz submission DB error:', dbError)
        return res.status(500).json({
          error: 'Database error during quiz submission',
          details: dbError.message,
          hint: 'Try force reseeding the database at /salveregina'
        })
      }

      return res.status(200).json({
        score,
        totalQuestions,
        percent: Math.round(percent * 100),
        passed,
        perfect,
        xpEarned: xpToAward,
        potentialXp,
        wasImprovement: bestScoreResult.improved || bestScoreResult.isFirstAttempt,
        previousBest: bestScoreResult.previousBest,
        totalXp: updatedProgress.total_xp,
        level: updatedProgress.current_level,
        leveledUp: xpResult?.leveledUp || false,
        newLevel: xpResult?.newLevel || null,
        questionResults,
      })
    }

    // GET /api/academy/quiz/scores - Get user's quiz scores (requires auth)
    if (method === 'GET' && segments.length === 2 && segments[0] === 'quiz' && segments[1] === 'scores') {
      const user = await authenticateUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const scores = await getAllQuizBestScores(user.id)
      return res.status(200).json({ scores })
    }

    // GET /api/academy/achievements - Get user's achievements (requires auth)
    if (method === 'GET' && segments.length === 1 && segments[0] === 'achievements') {
      const user = await authenticateUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const achievements = await getUserAchievements(user.id)
      return res.status(200).json({ achievements: achievements.map(a => a.achievement_id) })
    }

    // POST /api/academy/module/complete - Record module completion (requires auth)
    if (method === 'POST' && segments.length === 2 && segments[0] === 'module' && segments[1] === 'complete') {
      const user = await authenticateUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const { moduleId, finalTestScore, finalTestXp } = req.body
      if (!moduleId) {
        return res.status(400).json({ error: 'Module ID required' })
      }

      const result = await recordModuleCompletion(user.id, moduleId, finalTestScore, finalTestXp)

      // Award module completion bonus if new
      let xpResult = null
      if (result.isNew) {
        xpResult = await addUserXp(user.id, XP_CONFIG.MODULE_COMPLETION_BONUS, LEVEL_THRESHOLDS)

        // Award first_steps achievement for completing newcomer
        if (moduleId === 'newcomer') {
          await awardAchievement(user.id, 'first_steps')
        }
      }

      return res.status(200).json({
        success: true,
        isNew: result.isNew,
        bonusXp: result.isNew ? XP_CONFIG.MODULE_COMPLETION_BONUS : 0,
        totalXp: xpResult?.newTotalXp || (await getUserXpProgress(user.id)).total_xp,
        leveledUp: xpResult?.leveledUp || false,
      })
    }

    // ============================================
    // Leaderboard Endpoints
    // ============================================

    // GET /api/academy/leaderboard - Get XP leaderboard (public)
    if (method === 'GET' && segments.length === 1 && segments[0] === 'leaderboard') {
      const limit = parseInt(req.query.limit) || 50
      const leaderboard = await getLeaderboard(Math.min(limit, 1000))

      // If user is authenticated, include their rank
      const user = await authenticateUser(req)
      let userRank = null
      if (user) {
        userRank = await getUserRank(user.id)
      }

      return res.status(200).json({
        leaderboard,
        userRank,
        updatedAt: new Date().toISOString(),
      })
    }

    // GET /api/academy/my-rank - Get current user's rank (requires auth)
    if (method === 'GET' && segments.length === 1 && segments[0] === 'my-rank') {
      const user = await authenticateUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const rank = await getUserRank(user.id)
      return res.status(200).json(rank)
    }

    // POST /api/academy/sync-xp - Sync client XP to server (requires auth)
    if (method === 'POST' && segments.length === 1 && segments[0] === 'sync-xp') {
      const user = await authenticateUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const { totalXp, level } = req.body
      if (typeof totalXp !== 'number' || typeof level !== 'number') {
        return res.status(400).json({ error: 'totalXp and level are required' })
      }

      // Sanity check - prevent obviously fake XP values
      if (totalXp < 0 || totalXp > 100000 || level < 1 || level > 100) {
        return res.status(400).json({ error: 'Invalid XP values' })
      }

      const result = await syncUserXp(user.id, totalXp, level)
      return res.status(200).json(result)
    }

    // POST /api/academy/sync-progress - Save all progress to server (requires auth)
    if (method === 'POST' && segments.length === 1 && segments[0] === 'sync-progress') {
      const user = await authenticateUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const { progress, stats, placement, masterExam, achievements, streak, journalXp, dailyGoalId } = req.body

      const result = await saveUserProgress(user.id, {
        progress,
        stats,
        placement,
        masterExam,
        achievements,
        streak,
        journalXp,
        dailyGoalId
      })

      return res.status(200).json(result)
    }

    // GET /api/academy/sync-progress - Fetch all progress from server (requires auth)
    if (method === 'GET' && segments.length === 1 && segments[0] === 'sync-progress') {
      const user = await authenticateUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const serverProgress = await getUserProgress(user.id)

      if (!serverProgress) {
        return res.status(200).json({ hasData: false })
      }

      return res.status(200).json({
        hasData: true,
        ...serverProgress
      })
    }

    // ============================================
    // Course Request Endpoints
    // ============================================

    // POST /api/academy/course-requests - Submit a new course request
    if (method === 'POST' && segments.length === 1 && segments[0] === 'course-requests') {
      const user = await authenticateUser(req)
      const userId = user ? user.id : null

      const { topic, reason, experienceLevel } = req.body

      if (!topic || topic.trim().length < 3) {
        return res.status(400).json({ error: 'Topic must be at least 3 characters' })
      }

      if (topic.length > 200) {
        return res.status(400).json({ error: 'Topic must be less than 200 characters' })
      }

      if (reason && reason.length > 1000) {
        return res.status(400).json({ error: 'Reason must be less than 1000 characters' })
      }

      const validLevels = ['beginner', 'intermediate', 'advanced', 'all']
      if (experienceLevel && !validLevels.includes(experienceLevel)) {
        return res.status(400).json({ error: 'Invalid experience level' })
      }

      try {
        const result = await createCourseRequest(
          userId,
          topic.trim(),
          reason ? reason.trim() : null,
          experienceLevel || 'all'
        )

        return res.status(201).json({
          success: true,
          request: result,
          message: result.merged
            ? 'Your vote has been added to a similar existing request!'
            : 'Course request submitted successfully!'
        })
      } catch (err) {
        console.error('Course request error:', err)
        return res.status(500).json({ error: 'Failed to submit course request' })
      }
    }

    // GET /api/academy/course-requests/top - Get top voted course requests
    if (method === 'GET' && segments.length === 2 && segments[0] === 'course-requests' && segments[1] === 'top') {
      const limit = Math.min(parseInt(req.query.limit) || 10, 50)

      try {
        const requests = await getTopCourseRequests(limit)
        return res.status(200).json({ requests })
      } catch (err) {
        console.error('Get course requests error:', err)
        return res.status(500).json({ error: 'Failed to fetch course requests' })
      }
    }

    // POST /api/academy/course-requests/:id/vote - Vote for a course request
    if (method === 'POST' && segments.length === 3 && segments[0] === 'course-requests' && segments[2] === 'vote') {
      const requestId = parseInt(segments[1], 10)
      if (isNaN(requestId)) {
        return res.status(400).json({ error: 'Invalid request ID' })
      }

      const user = await authenticateUser(req)
      const userId = user ? user.id : null

      // Get IP hash for anonymous vote tracking
      const forwardedFor = req.headers['x-forwarded-for']
      const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown'
      // Simple hash of IP for privacy
      const ipHash = Buffer.from(ip).toString('base64').substring(0, 16)

      try {
        const result = await voteCourseRequest(requestId, userId, ipHash)

        if (!result.success) {
          return res.status(400).json({
            error: result.error,
            message: result.error === 'already_voted'
              ? 'You have already voted for this request'
              : 'Request not found'
          })
        }

        return res.status(200).json({
          success: true,
          newVoteCount: result.newVoteCount
        })
      } catch (err) {
        console.error('Vote error:', err)
        return res.status(500).json({ error: 'Failed to record vote' })
      }
    }

    // 404 for unmatched routes
    return res.status(404).json({ error: 'Not found' })

  } catch (error) {
    console.error('Academy API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
