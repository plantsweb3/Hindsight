import bcrypt from 'bcryptjs'
import { PublicKey } from '@solana/web3.js'
import {
  createUser,
  getUserByUsername,
  getUserById,
  updateUserArchetype,
  addSavedWallet,
  addSavedWalletBypassLimit,
  removeSavedWallet,
  updateWalletLabel,
  getUserWallets,
  saveAnalysis,
  getUserAnalyses,
  getUserUsageStats,
  canAddWallet,
  updateProStatus,
  checkSightBalance,
  deleteUser,
  FREE_TIER_LIMITS,
  WALLET_LABELS,
  initDb,
} from '../lib/db.js'
import { signToken, authenticateRequest, json, error, cors } from '../lib/auth.js'

// Validate Solana wallet address
function isValidWalletAddress(address) {
  try {
    new PublicKey(address)
    return true
  } catch {
    return false
  }
}

// Ensure tables exist
let dbInitialized = false
async function ensureDb() {
  if (!dbInitialized) {
    await initDb()
    dbInitialized = true
  }
}

export default async function handler(req, res) {
  // Handle CORS
  cors(res, req)
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  await ensureDb()

  const { path } = req.query
  const route = Array.isArray(path) ? path.join('/') : path

  try {
    // POST /api/auth/signup
    if (route === 'signup' && req.method === 'POST') {
      const { username, password } = req.body || {}

      if (!username || !password) {
        return error(res, 'Username and password are required', 400)
      }

      if (username.length < 3 || username.length > 20) {
        return error(res, 'Username must be 3-20 characters', 400)
      }

      if (password.length < 8) {
        return error(res, 'Password must be at least 8 characters', 400)
      }

      const existingUser = await getUserByUsername(username)
      if (existingUser) {
        return error(res, 'Username already taken', 400)
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const userId = await createUser(username, passwordHash)
      const token = signToken({ id: userId, username })

      return json(res, {
        token,
        user: {
          id: userId,
          username,
          primaryArchetype: null,
          secondaryArchetype: null,
          savedWallets: [],
        },
      })
    }

    // POST /api/auth/login
    if (route === 'login' && req.method === 'POST') {
      const { username, password } = req.body || {}

      if (!username || !password) {
        return error(res, 'Username and password are required', 400)
      }

      const user = await getUserByUsername(username)
      if (!user) {
        return error(res, 'Invalid username or password', 401)
      }

      const validPassword = await bcrypt.compare(password, user.password_hash)
      if (!validPassword) {
        return error(res, 'Invalid username or password', 401)
      }

      const token = signToken({ id: user.id, username: user.username })

      let wallets = []
      try {
        wallets = await getUserWallets(user.id)
      } catch (walletErr) {
        // Continue without wallets
      }

      let usageStats = null
      try {
        usageStats = await getUserUsageStats(user.id)
      } catch (statsErr) {
        // Continue without stats
      }
      return json(res, {
        token,
        user: {
          id: user.id,
          username: user.username,
          primaryArchetype: user.primary_archetype,
          secondaryArchetype: user.secondary_archetype,
          savedWallets: wallets,
          isPro: usageStats?.isPro || false,
        },
      })
    }

    // GET /api/auth/me
    if (route === 'me' && req.method === 'GET') {
      const decoded = authenticateRequest(req)
      if (!decoded) {
        return error(res, 'Authentication required', 401)
      }

      const user = await getUserById(decoded.id)
      if (!user) {
        return error(res, 'User not found', 404)
      }

      // Get usage stats and wallets with labels
      const usageStats = await getUserUsageStats(decoded.id)
      const wallets = await getUserWallets(decoded.id)

      return json(res, {
        id: user.id,
        username: user.username,
        primaryArchetype: user.primary_archetype,
        secondaryArchetype: user.secondary_archetype,
        savedWallets: wallets,
        createdAt: user.created_at,
        // Pro status and usage
        isPro: usageStats?.isPro || false,
        walletCount: usageStats?.walletCount || 0,
        journalEntryCount: usageStats?.journalEntryCount || 0,
        limits: FREE_TIER_LIMITS,
        walletLabels: WALLET_LABELS,
      })
    }

    // POST /api/auth/archetype
    if (route === 'archetype' && req.method === 'POST') {
      const decoded = authenticateRequest(req)
      if (!decoded) {
        return error(res, 'Authentication required', 401)
      }

      const { primaryArchetype, secondaryArchetype, quizAnswers } = req.body || {}

      if (!primaryArchetype || !secondaryArchetype) {
        return error(res, 'Archetype data required', 400)
      }

      // Ensure we're passing plain strings
      const primary = typeof primaryArchetype === 'string' ? primaryArchetype : String(primaryArchetype)
      const secondary = typeof secondaryArchetype === 'string' ? secondaryArchetype : String(secondaryArchetype)
      const userId = typeof decoded.id === 'number' ? decoded.id : Number(decoded.id)

      await updateUserArchetype(userId, primary, secondary, quizAnswers)

      return json(res, {
        success: true,
        primaryArchetype,
        secondaryArchetype,
      })
    }

    // POST /api/auth/wallets
    if (route === 'wallets' && req.method === 'POST') {
      const decoded = authenticateRequest(req)
      if (!decoded) {
        return error(res, 'Authentication required', 401)
      }

      const { walletAddress } = req.body || {}
      if (!walletAddress) {
        return error(res, 'Wallet address required', 400)
      }

      if (!isValidWalletAddress(walletAddress)) {
        return error(res, 'Invalid Solana wallet address', 400)
      }

      // Check if user can add more wallets
      const canAdd = await canAddWallet(decoded.id)
      if (!canAdd.allowed) {
        return json(res, {
          error: 'limit_reached',
          message: canAdd.reason,
          limit: canAdd.limit,
          current: canAdd.current,
          requiresPro: true,
        }, 403)
      }

      const wallets = await addSavedWallet(decoded.id, walletAddress)
      return json(res, { wallets })
    }

    // DELETE /api/auth/wallets/:address
    if (route.startsWith('wallets/') && req.method === 'DELETE') {
      const decoded = authenticateRequest(req)
      if (!decoded) {
        return error(res, 'Authentication required', 401)
      }

      const address = route.replace('wallets/', '')
      const wallets = await removeSavedWallet(decoded.id, address)
      return json(res, { wallets })
    }

    // PATCH /api/auth/wallets/:address/label - Update wallet label (Pro feature)
    if (route.match(/^wallets\/[^/]+\/label$/) && req.method === 'PATCH') {
      const decoded = authenticateRequest(req)
      if (!decoded) {
        return error(res, 'Authentication required', 401)
      }

      // Check Pro status
      const usageStats = await getUserUsageStats(decoded.id)
      if (!usageStats?.isPro) {
        return json(res, {
          error: 'pro_required',
          message: 'Wallet labels are a Pro feature',
          requiresPro: true,
        }, 403)
      }

      const address = route.replace('wallets/', '').replace('/label', '')
      const { label } = req.body || {}

      if (!label) {
        return error(res, 'Label required', 400)
      }

      const wallets = await updateWalletLabel(decoded.id, address, label)
      return json(res, { wallets, success: true })
    }

    // POST /api/auth/analyses
    if (route === 'analyses' && req.method === 'POST') {
      const decoded = authenticateRequest(req)
      if (!decoded) {
        return error(res, 'Authentication required', 401)
      }

      const { walletAddress, analysis, stats } = req.body || {}

      if (!walletAddress || !analysis) {
        return error(res, 'Analysis data required', 400)
      }

      if (!isValidWalletAddress(walletAddress)) {
        return error(res, 'Invalid Solana wallet address', 400)
      }

      const analysisId = await saveAnalysis(decoded.id, walletAddress, analysis, stats)
      await addSavedWallet(decoded.id, walletAddress)

      return json(res, { id: analysisId, success: true })
    }

    // GET /api/auth/analyses
    if (route === 'analyses' && req.method === 'GET') {
      const decoded = authenticateRequest(req)
      if (!decoded) {
        return error(res, 'Authentication required', 401)
      }

      const analyses = await getUserAnalyses(decoded.id)

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

      return json(res, parsed)
    }

    // DELETE /api/auth/delete-account - Permanently delete user account
    if (route === 'delete-account' && req.method === 'DELETE') {
      const decoded = authenticateRequest(req)
      if (!decoded) {
        return error(res, 'Authentication required', 401)
      }

      try {
        await deleteUser(decoded.id)
        return json(res, { success: true })
      } catch (err) {
        console.error('[API] Error deleting account')
        return error(res, 'Failed to delete account', 500)
      }
    }

    // POST /api/auth/verify-sight - Verify $SIGHT holdings and grant Pro
    if (route === 'verify-sight' && req.method === 'POST') {
      const decoded = authenticateRequest(req)
      if (!decoded) {
        return error(res, 'Authentication required', 401)
      }

      const { walletAddress } = req.body || {}
      if (!walletAddress) {
        return error(res, 'Wallet address required', 400)
      }

      if (!isValidWalletAddress(walletAddress)) {
        return error(res, 'Invalid Solana wallet address', 400)
      }

      // Check if wallet holds enough $SIGHT
      // TODO: Plug in $SIGHT CA and actual balance check after launch
      const balanceCheck = await checkSightBalance([walletAddress])

      if (!balanceCheck.isPro) {
        return json(res, {
          error: 'Insufficient $SIGHT balance',
          insufficientBalance: true,
          balance: balanceCheck.balance,
          requiredBalance: balanceCheck.requiredBalance,
        }, 400)
      }

      // Grant Pro status
      await updateProStatus(decoded.id, true)

      // Add wallet to saved wallets (bypassing free tier limit)
      const wallets = await addSavedWalletBypassLimit(decoded.id, walletAddress)

      return json(res, {
        success: true,
        isPro: true,
        wallets,
      })
    }

    // Route not found
    return error(res, 'Not found', 404)
  } catch (err) {
    console.error('Auth API error:', err.message, err.stack)
    // Ensure we always return JSON, even for unexpected errors
    try {
      return error(res, err.message || 'Internal server error', 500)
    } catch (responseErr) {
      // Last resort fallback if error() fails
      console.error('Failed to send error response:', responseErr)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
