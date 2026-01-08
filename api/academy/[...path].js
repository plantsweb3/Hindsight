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
  saveAcademyOnboarding
} from '../lib/db.js'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'hindsight-dev-secret-change-in-production'

// Initialize database and seed content on cold start
let dbInitialized = false
async function ensureDb() {
  if (!dbInitialized) {
    await initDb()
    // Auto-seed content if no modules exist
    const modules = await getAcademyModules()
    if (modules.length === 0) {
      await seedAcademyContent()
    }
    dbInitialized = true
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
    const user = await getUserById(decoded.userId)
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
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Ensure database is initialized
  await ensureDb()

  const segments = parsePath(req.query.path)
  const method = req.method

  try {
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
      const isAdminPassword = adminPassword === 'DeusVult777!'

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

    // 404 for unmatched routes
    return res.status(404).json({ error: 'Not found' })

  } catch (error) {
    console.error('Academy API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
