import {
  getJournalEntries,
  getJournalStats,
  createJournalEntry,
  updateJournalEntry,
  journalEntryExists,
  journalEntryHasReflection,
  getJournalPatterns,
  getWeeklySummary,
  getMonthlySummary,
  canAddJournalEntry,
  canAddJournalReflection,
  FREE_TIER_LIMITS,
  initDb,
} from '../lib/db.js'
import { authenticateRequest, json, error, cors } from '../lib/auth.js'

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

  // Authenticate
  const decoded = authenticateRequest(req)
  if (!decoded) {
    return error(res, 'Authentication required', 401)
  }

  const { path } = req.query
  const route = Array.isArray(path) ? path.join('/') : (path || '')

  try {
    // GET /api/journal - List entries
    if (route === '' && req.method === 'GET') {
      const filters = {
        walletAddress: req.query.walletAddress,
        outcome: req.query.outcome,
        mood: req.query.mood,
        researchLevel: req.query.researchLevel,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      }

      const entries = await getJournalEntries(decoded.id, filters)

      // Transform to camelCase
      const transformed = entries.map(e => ({
        id: e.id,
        walletAddress: e.wallet_address,
        tokenAddress: e.token_address,
        tokenName: e.token_name,
        entryPrice: e.entry_price,
        entryTime: e.entry_time,
        exitPrice: e.exit_price,
        exitTime: e.exit_time,
        positionSize: e.position_size,
        pnlSol: e.pnl_sol,
        pnlPercent: e.pnl_percent,
        holdDuration: e.hold_duration,
        thesis: e.thesis,
        execution: e.execution,
        mood: e.mood,
        researchLevel: e.research_level,
        exitReasoning: e.exit_reasoning,
        lessonLearned: e.lesson_learned,
        athPrice: e.ath_price,
        athTime: e.ath_time,
        athMarketCap: e.ath_market_cap,
        exitVsAthPercent: e.exit_vs_ath_percent,
        athTiming: e.ath_timing,
        createdAt: e.created_at,
        updatedAt: e.updated_at,
      }))

      return json(res, transformed)
    }

    // GET /api/journal/stats
    if (route === 'stats' && req.method === 'GET') {
      const stats = await getJournalStats(decoded.id)

      const totalTrades = Number(stats.total_trades) || 0
      const wins = Number(stats.wins) || 0

      return json(res, {
        totalTrades,
        wins,
        losses: Number(stats.losses) || 0,
        winRate: totalTrades > 0 ? `${((wins / totalTrades) * 100).toFixed(1)}%` : '0%',
        totalPnl: Number(stats.total_pnl) || 0,
        avgPnlPercent: Number(stats.avg_pnl_percent) || 0,
      })
    }

    // GET /api/journal/patterns
    if (route === 'patterns' && req.method === 'GET') {
      const patterns = await getJournalPatterns(decoded.id)
      return json(res, patterns)
    }

    // GET /api/journal/weekly
    if (route === 'weekly' && req.method === 'GET') {
      const summary = await getWeeklySummary(decoded.id)
      return json(res, summary)
    }

    // GET /api/journal/monthly
    if (route === 'monthly' && req.method === 'GET') {
      const summary = await getMonthlySummary(decoded.id)
      return json(res, summary)
    }

    // POST /api/journal - Create entry (no limit on creating entries, only on reflections)
    if (route === '' && req.method === 'POST') {
      const entry = req.body

      if (!entry || !entry.tokenAddress || !entry.exitTime) {
        return error(res, 'Token address and exit time are required', 400)
      }

      // Check if entry already exists
      const exists = await journalEntryExists(decoded.id, entry.tokenAddress, entry.exitTime)
      if (exists) {
        return json(res, { id: null, success: true, skipped: true, message: 'Entry already exists' })
      }

      const id = await createJournalEntry(decoded.id, entry)
      return json(res, { id, success: true })
    }

    // POST /api/journal/batch - Create multiple entries (no limit - users see all trades)
    if (route === 'batch' && req.method === 'POST') {
      const { entries } = req.body || {}

      console.log(`[Journal Batch] Received ${entries?.length || 0} entries`)

      if (!entries || !Array.isArray(entries)) {
        return error(res, 'Entries array required', 400)
      }

      const canAdd = await canAddJournalEntry(decoded.id)

      let created = 0
      let skipped = 0

      for (const entry of entries) {
        // Skip if already exists
        const exists = await journalEntryExists(decoded.id, entry.tokenAddress, entry.exitTime)
        if (exists) {
          skipped++
          continue
        }

        await createJournalEntry(decoded.id, entry)
        created++
      }

      console.log(`[Journal Batch] Result: created=${created}, skipped=${skipped}`)
      return json(res, {
        created,
        skipped,
        total: entries.length,
        isPro: canAdd.isPro,
      })
    }

    // PATCH /api/journal/:id - Update entry (adding notes/reflections)
    if (req.method === 'PATCH') {
      const entryId = parseInt(route)
      if (isNaN(entryId)) {
        return error(res, 'Invalid entry ID', 400)
      }

      const updates = req.body
      if (!updates || Object.keys(updates).length === 0) {
        return error(res, 'No updates provided', 400)
      }

      // Check if this update includes reflection fields (notes)
      const hasReflectionFields = updates.lessonLearned || updates.exitReasoning || updates.thesis
      if (hasReflectionFields) {
        // Allow editing if entry already has a reflection (not a new reflection)
        const alreadyHasReflection = await journalEntryHasReflection(entryId, decoded.id)
        if (!alreadyHasReflection) {
          // This is a NEW reflection - check the limit
          const canReflect = await canAddJournalReflection(decoded.id)
          if (!canReflect.allowed) {
            return json(res, {
              error: 'reflection_limit_reached',
              message: 'Free tier allows 1 journal reflection. Upgrade to Pro to reflect on all your trades.',
              requiresPro: true,
              limit: FREE_TIER_LIMITS.MAX_JOURNAL_REFLECTIONS,
              current: canReflect.current,
            }, 403)
          }
        }
      }

      await updateJournalEntry(entryId, decoded.id, updates)
      return json(res, { success: true })
    }

    // Route not found
    return error(res, 'Not found', 404)
  } catch (err) {
    console.error('Journal API error:', err)
    return error(res, err.message || 'Internal server error', 500)
  }
}
