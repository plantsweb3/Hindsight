import { Router } from 'express'
import { authenticateToken } from './auth.js'
import {
  createJournalEntry,
  createJournalEntriesBatch,
  updateJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  deleteJournalEntry,
  getJournalStats,
  getJournalPatterns,
  getWeeklySummary,
  getMonthlySummary,
  checkDuplicateJournalEntry,
} from './db.js'
import { enrichTradesWithATH } from './ath.js'

const router = Router()

// All routes require authentication
router.use(authenticateToken)

// GET /api/journal - Get journal entries with filters
router.get('/', (req, res) => {
  try {
    const { outcome, token, mood, researchLevel, startDate, endDate, limit } = req.query

    const entries = getJournalEntries(req.user.id, {
      outcome,
      token,
      mood,
      researchLevel,
      startDate,
      endDate,
      limit: limit ? parseInt(limit) : undefined,
    })

    // Transform snake_case to camelCase for frontend
    const transformed = entries.map(transformEntry)
    res.json(transformed)
  } catch (err) {
    console.error('Get journal entries error:', err)
    res.status(500).json({ error: 'Failed to fetch journal entries' })
  }
})

// GET /api/journal/stats - Get journal statistics
router.get('/stats', (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const stats = getJournalStats(req.user.id, startDate, endDate)

    res.json({
      totalTrades: stats.total_trades || 0,
      wins: stats.wins || 0,
      losses: stats.losses || 0,
      totalPnl: stats.total_pnl || 0,
      avgPnlPercent: stats.avg_pnl_percent || 0,
      journaledCount: stats.journaled_count || 0,
      winRate: stats.total_trades > 0
        ? ((stats.wins / stats.total_trades) * 100).toFixed(1) + '%'
        : '0%',
    })
  } catch (err) {
    console.error('Get journal stats error:', err)
    res.status(500).json({ error: 'Failed to fetch journal stats' })
  }
})

// GET /api/journal/patterns - Get AI pattern analysis data
router.get('/patterns', (req, res) => {
  try {
    const patterns = getJournalPatterns(req.user.id)
    const stats = getJournalStats(req.user.id)

    // Only generate insights if user has 10+ journaled trades
    if (stats.journaled_count < 10) {
      return res.json({
        hasEnoughData: false,
        journaledCount: stats.journaled_count,
        requiredCount: 10,
        insights: [],
      })
    }

    // Generate insights from patterns
    const insights = []

    // Mood on losing trades insight
    if (patterns.moodOnLosses.length > 0) {
      const topMood = patterns.moodOnLosses[0]
      const totalLosses = patterns.moodOnLosses.reduce((sum, m) => sum + m.count, 0)
      const percentage = ((topMood.count / totalLosses) * 100).toFixed(0)
      if (percentage > 40) {
        insights.push({
          type: 'mood_losses',
          text: `You mark "${topMood.mood}" on ${percentage}% of your losing trades`,
          severity: percentage > 60 ? 'high' : 'medium',
        })
      }
    }

    // Research level on winning trades insight
    if (patterns.researchOnWins.length > 0 && patterns.pnlByResearch.length > 0) {
      const deepDive = patterns.pnlByResearch.find(r => r.research_level === 'Deep Dive')
      const blindApe = patterns.pnlByResearch.find(r => r.research_level === 'Blind Ape')

      if (deepDive && blindApe && deepDive.avg_pnl > blindApe.avg_pnl) {
        insights.push({
          type: 'research_correlation',
          text: `Your "Deep Dive" trades average ${deepDive.avg_pnl.toFixed(1)}% while "Blind Ape" trades average ${blindApe.avg_pnl.toFixed(1)}%`,
          severity: 'medium',
        })
      }
    }

    // Revenge trading insight
    if (patterns.holdByMood.length > 0) {
      const revenge = patterns.holdByMood.find(m => m.mood === 'Revenge Trade')
      if (revenge && revenge.avg_pnl < 0) {
        insights.push({
          type: 'revenge_trading',
          text: `Your revenge trades average ${revenge.avg_pnl.toFixed(1)}% - emotional trading is hurting you`,
          severity: 'high',
        })
      }
    }

    // FOMO insight
    const fomo = patterns.holdByMood.find(m => m.mood === 'FOMO')
    if (fomo && fomo.avg_pnl < 0) {
      insights.push({
        type: 'fomo_trading',
        text: `FOMO entries average ${fomo.avg_pnl.toFixed(1)}% - chasing is costing you`,
        severity: 'high',
      })
    }

    // ATH exit timing insights
    if (patterns.athPatterns && patterns.athPatterns.totalWithAth >= 5) {
      const { avgExitVsAth, nearAthCount, earlyExitCount, lateExitCount, totalWithAth } = patterns.athPatterns

      // Check if they consistently sell early
      const earlyExitRate = (earlyExitCount / totalWithAth) * 100
      if (earlyExitRate > 60 && avgExitVsAth < -30) {
        insights.push({
          type: 'early_exit',
          text: `You sell before the peak ${earlyExitRate.toFixed(0)}% of the time, missing avg ${Math.abs(avgExitVsAth).toFixed(0)}% of gains`,
          severity: avgExitVsAth < -50 ? 'high' : 'medium',
        })
      }

      // Check if they hold too long after ATH
      const lateExitRate = (lateExitCount / totalWithAth) * 100
      if (lateExitRate > 60 && avgExitVsAth < -40) {
        insights.push({
          type: 'late_exit',
          text: `You hold past the peak ${lateExitRate.toFixed(0)}% of the time, giving back avg ${Math.abs(avgExitVsAth).toFixed(0)}% from ATH`,
          severity: avgExitVsAth < -60 ? 'high' : 'medium',
        })
      }

      // Acknowledge good exit timing
      const nearAthRate = (nearAthCount / totalWithAth) * 100
      if (nearAthRate > 30) {
        insights.push({
          type: 'good_exits',
          text: `${nearAthRate.toFixed(0)}% of your exits are within 10% of ATH - solid timing`,
          severity: 'low',
        })
      }
    }

    res.json({
      hasEnoughData: true,
      journaledCount: stats.journaled_count,
      insights,
      patterns: {
        moodOnLosses: patterns.moodOnLosses,
        researchOnWins: patterns.researchOnWins,
        holdByMood: patterns.holdByMood,
        pnlByResearch: patterns.pnlByResearch,
      },
      athPatterns: patterns.athPatterns,
    })
  } catch (err) {
    console.error('Get journal patterns error:', err)
    res.status(500).json({ error: 'Failed to fetch journal patterns' })
  }
})

// GET /api/journal/weekly - Get weekly summaries
router.get('/weekly', (req, res) => {
  try {
    const summary = getWeeklySummary(req.user.id)
    res.json(summary.map(w => ({
      week: w.week,
      totalTrades: w.total_trades,
      wins: w.wins,
      totalPnl: w.total_pnl,
      avgPnlPercent: w.avg_pnl_percent,
      winRate: w.total_trades > 0
        ? ((w.wins / w.total_trades) * 100).toFixed(1) + '%'
        : '0%',
    })))
  } catch (err) {
    console.error('Get weekly summary error:', err)
    res.status(500).json({ error: 'Failed to fetch weekly summary' })
  }
})

// GET /api/journal/monthly - Get monthly summaries
router.get('/monthly', (req, res) => {
  try {
    const summary = getMonthlySummary(req.user.id)
    res.json(summary.map(m => ({
      month: m.month,
      totalTrades: m.total_trades,
      wins: m.wins,
      totalPnl: m.total_pnl,
      avgPnlPercent: m.avg_pnl_percent,
      winRate: m.total_trades > 0
        ? ((m.wins / m.total_trades) * 100).toFixed(1) + '%'
        : '0%',
    })))
  } catch (err) {
    console.error('Get monthly summary error:', err)
    res.status(500).json({ error: 'Failed to fetch monthly summary' })
  }
})

// GET /api/journal/:id - Get single entry
router.get('/:id', (req, res) => {
  try {
    const entry = getJournalEntryById(parseInt(req.params.id), req.user.id)
    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' })
    }
    res.json(transformEntry(entry))
  } catch (err) {
    console.error('Get journal entry error:', err)
    res.status(500).json({ error: 'Failed to fetch journal entry' })
  }
})

// POST /api/journal - Create single entry
router.post('/', (req, res) => {
  try {
    const {
      tokenAddress, tokenName, entryPrice, entryTime,
      exitPrice, exitTime, positionSize, pnlSol, pnlPercent, holdDuration,
    } = req.body

    if (!tokenAddress) {
      return res.status(400).json({ error: 'Token address is required' })
    }

    // Check for duplicate
    const existing = checkDuplicateJournalEntry(req.user.id, tokenAddress, exitTime)
    if (existing) {
      return res.status(409).json({ error: 'Trade already exists in journal', existingId: existing.id })
    }

    const entryId = createJournalEntry(req.user.id, {
      tokenAddress,
      tokenName,
      entryPrice,
      entryTime,
      exitPrice,
      exitTime,
      positionSize,
      pnlSol,
      pnlPercent,
      holdDuration,
    })

    res.json({ id: entryId, success: true })
  } catch (err) {
    console.error('Create journal entry error:', err)
    res.status(500).json({ error: 'Failed to create journal entry' })
  }
})

// POST /api/journal/batch - Create multiple entries (after wallet analysis)
router.post('/batch', async (req, res) => {
  try {
    const { trades } = req.body

    if (!Array.isArray(trades) || trades.length === 0) {
      return res.status(400).json({ error: 'Trades array is required' })
    }

    // Filter out duplicates
    const newTrades = trades.filter(trade => {
      const existing = checkDuplicateJournalEntry(req.user.id, trade.tokenAddress, trade.exitTime)
      return !existing
    })

    if (newTrades.length === 0) {
      return res.json({ created: 0, skipped: trades.length, message: 'All trades already exist' })
    }

    // Enrich trades with ATH data from DexScreener
    console.log(`Enriching ${newTrades.length} trades with ATH data...`)
    const enrichedTrades = await enrichTradesWithATH(newTrades)

    const ids = createJournalEntriesBatch(req.user.id, enrichedTrades)

    res.json({
      created: ids.length,
      skipped: trades.length - newTrades.length,
      ids,
    })
  } catch (err) {
    console.error('Batch create journal entries error:', err)
    res.status(500).json({ error: 'Failed to create journal entries' })
  }
})

// PUT /api/journal/:id - Update user input fields
router.put('/:id', (req, res) => {
  try {
    const { thesis, execution, mood, researchLevel, exitReasoning, lessonLearned } = req.body

    // Validate mood and researchLevel if provided
    const validMoods = ['Confident', 'Uncertain', 'FOMO', 'Revenge Trade']
    const validResearchLevels = ['Deep Dive', 'Quick Look', 'Blind Ape']

    if (mood && !validMoods.includes(mood)) {
      return res.status(400).json({ error: 'Invalid mood value' })
    }
    if (researchLevel && !validResearchLevels.includes(researchLevel)) {
      return res.status(400).json({ error: 'Invalid research level value' })
    }

    const result = updateJournalEntry(parseInt(req.params.id), req.user.id, {
      thesis,
      execution,
      mood,
      researchLevel,
      exitReasoning,
      lessonLearned,
    })

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Journal entry not found' })
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Update journal entry error:', err)
    res.status(500).json({ error: 'Failed to update journal entry' })
  }
})

// DELETE /api/journal/:id - Delete entry
router.delete('/:id', (req, res) => {
  try {
    const result = deleteJournalEntry(parseInt(req.params.id), req.user.id)

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Journal entry not found' })
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Delete journal entry error:', err)
    res.status(500).json({ error: 'Failed to delete journal entry' })
  }
})

// Helper to transform DB row to camelCase
function transformEntry(entry) {
  return {
    id: entry.id,
    tokenAddress: entry.token_address,
    tokenName: entry.token_name,
    entryPrice: entry.entry_price,
    entryTime: entry.entry_time,
    exitPrice: entry.exit_price,
    exitTime: entry.exit_time,
    positionSize: entry.position_size,
    pnlSol: entry.pnl_sol,
    pnlPercent: entry.pnl_percent,
    holdDuration: entry.hold_duration,
    thesis: entry.thesis,
    execution: entry.execution,
    mood: entry.mood,
    researchLevel: entry.research_level,
    exitReasoning: entry.exit_reasoning,
    lessonLearned: entry.lesson_learned,
    athPrice: entry.ath_price,
    athTime: entry.ath_time,
    athMarketCap: entry.ath_market_cap,
    exitVsAthPercent: entry.exit_vs_ath_percent,
    athTiming: entry.ath_timing,
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
  }
}

export default router
