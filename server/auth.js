import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
  createUser,
  getUserByUsername,
  getUserById,
  updateUserArchetype,
  addSavedWallet,
  removeSavedWallet,
  saveAnalysis,
  getUserAnalyses,
} from './db.js'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'hindsight-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

// Optional auth - doesn't fail if no token, just sets req.user if valid
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded
    } catch (err) {
      // Token invalid, continue without user
    }
  }
  next()
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: 'Username must be 3-20 characters' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  // Check if username exists
  const existingUser = getUserByUsername(username)
  if (existingUser) {
    return res.status(400).json({ error: 'Username already taken' })
  }

  try {
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const userId = createUser(username, passwordHash)

    // Generate token
    const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.json({
      token,
      user: {
        id: userId,
        username,
        primaryArchetype: null,
        secondaryArchetype: null,
        savedWallets: [],
      },
    })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Failed to create account' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  const user = getUserByUsername(username)
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  try {
    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // Generate token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        primaryArchetype: user.primary_archetype,
        secondaryArchetype: user.secondary_archetype,
        savedWallets: JSON.parse(user.saved_wallets || '[]'),
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
})

// GET /api/auth/me - Get current user
router.get('/me', authenticateToken, (req, res) => {
  const user = getUserById(req.user.id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({
    id: user.id,
    username: user.username,
    primaryArchetype: user.primary_archetype,
    secondaryArchetype: user.secondary_archetype,
    savedWallets: JSON.parse(user.saved_wallets || '[]'),
    createdAt: user.created_at,
  })
})

// POST /api/auth/archetype - Save quiz results
router.post('/archetype', authenticateToken, (req, res) => {
  const { primaryArchetype, secondaryArchetype, quizAnswers } = req.body

  if (!primaryArchetype || !secondaryArchetype) {
    return res.status(400).json({ error: 'Archetype data required' })
  }

  try {
    updateUserArchetype(req.user.id, primaryArchetype, secondaryArchetype, quizAnswers)

    res.json({
      success: true,
      primaryArchetype,
      secondaryArchetype,
    })
  } catch (err) {
    console.error('Update archetype error:', err)
    res.status(500).json({ error: 'Failed to save archetype' })
  }
})

// POST /api/auth/wallets - Add saved wallet
router.post('/wallets', authenticateToken, (req, res) => {
  const { walletAddress } = req.body

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address required' })
  }

  try {
    const wallets = addSavedWallet(req.user.id, walletAddress)
    res.json({ wallets })
  } catch (err) {
    console.error('Add wallet error:', err)
    res.status(500).json({ error: 'Failed to save wallet' })
  }
})

// DELETE /api/auth/wallets/:address - Remove saved wallet
router.delete('/wallets/:address', authenticateToken, (req, res) => {
  const { address } = req.params

  try {
    const wallets = removeSavedWallet(req.user.id, address)
    res.json({ wallets })
  } catch (err) {
    console.error('Remove wallet error:', err)
    res.status(500).json({ error: 'Failed to remove wallet' })
  }
})

// POST /api/auth/analyses - Save analysis
router.post('/analyses', authenticateToken, (req, res) => {
  const { walletAddress, analysis, stats } = req.body

  if (!walletAddress || !analysis) {
    return res.status(400).json({ error: 'Analysis data required' })
  }

  try {
    const analysisId = saveAnalysis(req.user.id, walletAddress, analysis, stats)

    // Also save the wallet
    addSavedWallet(req.user.id, walletAddress)

    res.json({ id: analysisId, success: true })
  } catch (err) {
    console.error('Save analysis error:', err)
    res.status(500).json({ error: 'Failed to save analysis' })
  }
})

// GET /api/auth/analyses - Get user's analyses
router.get('/analyses', authenticateToken, (req, res) => {
  try {
    const analyses = getUserAnalyses(req.user.id)

    // Parse JSON fields
    const parsed = analyses.map(a => ({
      id: a.id,
      walletAddress: a.wallet_address,
      verdict: a.verdict,
      winRate: a.win_rate,
      avgHoldTime: a.avg_hold_time,
      patterns: JSON.parse(a.patterns || '[]'),
      stats: JSON.parse(a.stats || '{}'),
      createdAt: a.created_at,
    }))

    res.json(parsed)
  } catch (err) {
    console.error('Get analyses error:', err)
    res.status(500).json({ error: 'Failed to fetch analyses' })
  }
})

export default router
