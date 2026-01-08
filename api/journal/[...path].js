import {
  getJournalEntries,
  getJournalStats,
  createJournalEntry,
  updateJournalEntry,
  journalEntryExists,
  getJournalPatterns,
  getWeeklySummary,
  getMonthlySummary,
  canAddJournalEntry,
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

    // POST /api/journal - Create entry
    if (route === '' && req.method === 'POST') {
      const entry = req.body

      if (!entry || !entry.tokenAddress || !entry.exitTime) {
        return error(res, 'Token address and exit time are required', 400)
      }

      const id = await createJournalEntry(decoded.id, entry)
      return json(res, { id, success: true })
    }

    // POST /api/journal/batch - Create multiple entries
    if (route === 'batch' && req.method === 'POST') {
      const { entries } = req.body || {}

      if (!entries || !Array.isArray(entries)) {
        return error(res, 'Entries array required', 400)
      }

      // Check if user can add journal entries
      const canAdd = await canAddJournalEntry(decoded.id)

      let created = 0
      let skipped = 0
      let limitReached = false

      for (const entry of entries) {
        // Skip if already exists
        const exists = await journalEntryExists(decoded.id, entry.tokenAddress, entry.exitTime)
        if (exists) {
          skipped++
          continue
        }

        // Check limits before each creation (for free users)
        if (!canAdd.isPro) {
          const currentCanAdd = await canAddJournalEntry(decoded.id)
          if (!currentCanAdd.allowed) {
            limitReached = true
            break
          }
        }

        await createJournalEntry(decoded.id, entry)
        created++
      }

      return json(res, {
        created,
        skipped,
        total: entries.length,
        limitReached,
        limit: FREE_TIER_LIMITS.MAX_JOURNAL_ENTRIES,
        isPro: canAdd.isPro,
      })
    }

    // PATCH /api/journal/:id - Update entry
    if (req.method === 'PATCH') {
      const entryId = parseInt(route)
      if (isNaN(entryId)) {
        return error(res, 'Invalid entry ID', 400)
      }

      const updates = req.body
      if (!updates || Object.keys(updates).length === 0) {
        return error(res, 'No updates provided', 400)
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
