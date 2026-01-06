import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Create database in server directory
const db = new Database(join(__dirname, 'hindsight.db'))

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    primary_archetype TEXT,
    secondary_archetype TEXT,
    quiz_answers TEXT,
    saved_wallets TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    wallet_address TEXT NOT NULL,
    verdict TEXT,
    win_rate TEXT,
    avg_hold_time TEXT,
    patterns TEXT,
    stats TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
  CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at);

  CREATE TABLE IF NOT EXISTS trade_journal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_address TEXT NOT NULL,
    token_name TEXT,
    entry_price REAL,
    entry_time DATETIME,
    exit_price REAL,
    exit_time DATETIME,
    position_size REAL,
    pnl_sol REAL,
    pnl_percent REAL,
    hold_duration TEXT,
    thesis TEXT,
    execution TEXT,
    mood TEXT,
    research_level TEXT,
    exit_reasoning TEXT,
    lesson_learned TEXT,
    ath_price REAL,
    ath_time DATETIME,
    ath_market_cap REAL,
    exit_vs_ath_percent REAL,
    ath_timing TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_journal_user_id ON trade_journal(user_id);
  CREATE INDEX IF NOT EXISTS idx_journal_exit_time ON trade_journal(exit_time);
  CREATE INDEX IF NOT EXISTS idx_journal_token_address ON trade_journal(token_address);
  CREATE INDEX IF NOT EXISTS idx_journal_mood ON trade_journal(mood);
  CREATE INDEX IF NOT EXISTS idx_journal_research_level ON trade_journal(research_level);
`)

// Migration: Add ATH columns if they don't exist
try {
  db.exec(`ALTER TABLE trade_journal ADD COLUMN ath_price REAL`)
} catch (e) { /* Column already exists */ }
try {
  db.exec(`ALTER TABLE trade_journal ADD COLUMN ath_time DATETIME`)
} catch (e) { /* Column already exists */ }
try {
  db.exec(`ALTER TABLE trade_journal ADD COLUMN ath_market_cap REAL`)
} catch (e) { /* Column already exists */ }
try {
  db.exec(`ALTER TABLE trade_journal ADD COLUMN exit_vs_ath_percent REAL`)
} catch (e) { /* Column already exists */ }
try {
  db.exec(`ALTER TABLE trade_journal ADD COLUMN ath_timing TEXT`)
} catch (e) { /* Column already exists */ }

// User functions
export const createUser = (username, passwordHash) => {
  const stmt = db.prepare(`
    INSERT INTO users (username, password_hash)
    VALUES (?, ?)
  `)
  const result = stmt.run(username, passwordHash)
  return result.lastInsertRowid
}

export const getUserByUsername = (username) => {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?')
  return stmt.get(username)
}

export const getUserById = (id) => {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
  return stmt.get(id)
}

export const updateUserArchetype = (userId, primaryArchetype, secondaryArchetype, quizAnswers) => {
  const stmt = db.prepare(`
    UPDATE users
    SET primary_archetype = ?, secondary_archetype = ?, quiz_answers = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
  return stmt.run(primaryArchetype, secondaryArchetype, JSON.stringify(quizAnswers), userId)
}

export const addSavedWallet = (userId, walletAddress) => {
  const user = getUserById(userId)
  if (!user) return null

  const wallets = JSON.parse(user.saved_wallets || '[]')
  if (!wallets.includes(walletAddress)) {
    wallets.push(walletAddress)
    const stmt = db.prepare(`
      UPDATE users SET saved_wallets = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `)
    stmt.run(JSON.stringify(wallets), userId)
  }
  return wallets
}

export const removeSavedWallet = (userId, walletAddress) => {
  const user = getUserById(userId)
  if (!user) return null

  let wallets = JSON.parse(user.saved_wallets || '[]')
  wallets = wallets.filter(w => w !== walletAddress)
  const stmt = db.prepare(`
    UPDATE users SET saved_wallets = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `)
  stmt.run(JSON.stringify(wallets), userId)
  return wallets
}

// Analysis functions
export const saveAnalysis = (userId, walletAddress, analysis, stats) => {
  const stmt = db.prepare(`
    INSERT INTO analyses (user_id, wallet_address, verdict, win_rate, avg_hold_time, patterns, stats)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  const result = stmt.run(
    userId,
    walletAddress,
    analysis.verdict,
    analysis.winRate,
    analysis.avgHoldTime,
    JSON.stringify(analysis.patterns),
    JSON.stringify(stats)
  )
  return result.lastInsertRowid
}

export const getUserAnalyses = (userId, limit = 20) => {
  const stmt = db.prepare(`
    SELECT * FROM analyses
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `)
  return stmt.all(userId, limit)
}

export const getAnalysisById = (analysisId, userId) => {
  const stmt = db.prepare(`
    SELECT * FROM analyses WHERE id = ? AND user_id = ?
  `)
  return stmt.get(analysisId, userId)
}

// Journal functions
export const createJournalEntry = (userId, tradeData) => {
  const stmt = db.prepare(`
    INSERT INTO trade_journal (
      user_id, token_address, token_name, entry_price, entry_time,
      exit_price, exit_time, position_size, pnl_sol, pnl_percent, hold_duration,
      ath_price, ath_time, ath_market_cap, exit_vs_ath_percent, ath_timing
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const result = stmt.run(
    userId,
    tradeData.tokenAddress,
    tradeData.tokenName,
    tradeData.entryPrice,
    tradeData.entryTime,
    tradeData.exitPrice,
    tradeData.exitTime,
    tradeData.positionSize,
    tradeData.pnlSol,
    tradeData.pnlPercent,
    tradeData.holdDuration,
    tradeData.athPrice || null,
    tradeData.athTime || null,
    tradeData.athMarketCap || null,
    tradeData.exitVsAthPercent || null,
    tradeData.athTiming || null
  )
  return result.lastInsertRowid
}

export const createJournalEntriesBatch = (userId, trades) => {
  const stmt = db.prepare(`
    INSERT INTO trade_journal (
      user_id, token_address, token_name, entry_price, entry_time,
      exit_price, exit_time, position_size, pnl_sol, pnl_percent, hold_duration,
      ath_price, ath_time, ath_market_cap, exit_vs_ath_percent, ath_timing
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertMany = db.transaction((trades) => {
    const ids = []
    for (const trade of trades) {
      const result = stmt.run(
        userId,
        trade.tokenAddress,
        trade.tokenName,
        trade.entryPrice,
        trade.entryTime,
        trade.exitPrice,
        trade.exitTime,
        trade.positionSize,
        trade.pnlSol,
        trade.pnlPercent,
        trade.holdDuration,
        trade.athPrice || null,
        trade.athTime || null,
        trade.athMarketCap || null,
        trade.exitVsAthPercent || null,
        trade.athTiming || null
      )
      ids.push(result.lastInsertRowid)
    }
    return ids
  })

  return insertMany(trades)
}

export const updateJournalEntry = (entryId, userId, updates) => {
  const stmt = db.prepare(`
    UPDATE trade_journal
    SET thesis = ?, execution = ?, mood = ?, research_level = ?,
        exit_reasoning = ?, lesson_learned = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `)
  return stmt.run(
    updates.thesis,
    updates.execution,
    updates.mood,
    updates.researchLevel,
    updates.exitReasoning,
    updates.lessonLearned,
    entryId,
    userId
  )
}

export const getJournalEntries = (userId, options = {}) => {
  let query = 'SELECT * FROM trade_journal WHERE user_id = ?'
  const params = [userId]

  // Filter by outcome (winners/losers)
  if (options.outcome === 'winners') {
    query += ' AND pnl_sol > 0'
  } else if (options.outcome === 'losers') {
    query += ' AND pnl_sol < 0'
  }

  // Filter by token
  if (options.token) {
    query += ' AND (token_address LIKE ? OR token_name LIKE ?)'
    params.push(`%${options.token}%`, `%${options.token}%`)
  }

  // Filter by mood
  if (options.mood) {
    query += ' AND mood = ?'
    params.push(options.mood)
  }

  // Filter by research level
  if (options.researchLevel) {
    query += ' AND research_level = ?'
    params.push(options.researchLevel)
  }

  // Filter by date range
  if (options.startDate) {
    query += ' AND exit_time >= ?'
    params.push(options.startDate)
  }
  if (options.endDate) {
    query += ' AND exit_time <= ?'
    params.push(options.endDate)
  }

  // Order and limit
  query += ' ORDER BY exit_time DESC'
  if (options.limit) {
    query += ' LIMIT ?'
    params.push(options.limit)
  }

  const stmt = db.prepare(query)
  return stmt.all(...params)
}

export const getJournalEntryById = (entryId, userId) => {
  const stmt = db.prepare('SELECT * FROM trade_journal WHERE id = ? AND user_id = ?')
  return stmt.get(entryId, userId)
}

export const deleteJournalEntry = (entryId, userId) => {
  const stmt = db.prepare('DELETE FROM trade_journal WHERE id = ? AND user_id = ?')
  return stmt.run(entryId, userId)
}

export const getJournalStats = (userId, startDate = null, endDate = null) => {
  let dateFilter = ''
  const params = [userId]

  if (startDate) {
    dateFilter += ' AND exit_time >= ?'
    params.push(startDate)
  }
  if (endDate) {
    dateFilter += ' AND exit_time <= ?'
    params.push(endDate)
  }

  const stmt = db.prepare(`
    SELECT
      COUNT(*) as total_trades,
      SUM(CASE WHEN pnl_sol > 0 THEN 1 ELSE 0 END) as wins,
      SUM(CASE WHEN pnl_sol < 0 THEN 1 ELSE 0 END) as losses,
      SUM(pnl_sol) as total_pnl,
      AVG(pnl_percent) as avg_pnl_percent,
      COUNT(CASE WHEN thesis IS NOT NULL AND thesis != '' THEN 1 END) as journaled_count
    FROM trade_journal
    WHERE user_id = ?${dateFilter}
  `)
  return stmt.get(...params)
}

export const getJournalPatterns = (userId) => {
  // Get mood distribution on losing trades
  const moodOnLosses = db.prepare(`
    SELECT mood, COUNT(*) as count
    FROM trade_journal
    WHERE user_id = ? AND pnl_sol < 0 AND mood IS NOT NULL
    GROUP BY mood
    ORDER BY count DESC
  `).all(userId)

  // Get research level distribution on winning trades
  const researchOnWins = db.prepare(`
    SELECT research_level, COUNT(*) as count
    FROM trade_journal
    WHERE user_id = ? AND pnl_sol > 0 AND research_level IS NOT NULL
    GROUP BY research_level
    ORDER BY count DESC
  `).all(userId)

  // Get avg hold duration by mood
  const holdByMood = db.prepare(`
    SELECT mood, AVG(pnl_percent) as avg_pnl, COUNT(*) as count
    FROM trade_journal
    WHERE user_id = ? AND mood IS NOT NULL
    GROUP BY mood
  `).all(userId)

  // Get avg PnL by research level
  const pnlByResearch = db.prepare(`
    SELECT research_level, AVG(pnl_percent) as avg_pnl, COUNT(*) as count
    FROM trade_journal
    WHERE user_id = ? AND research_level IS NOT NULL
    GROUP BY research_level
  `).all(userId)

  // Get ATH exit patterns
  const athStats = db.prepare(`
    SELECT
      COUNT(*) as total_with_ath,
      AVG(exit_vs_ath_percent) as avg_exit_vs_ath,
      SUM(CASE WHEN exit_vs_ath_percent >= -10 THEN 1 ELSE 0 END) as near_ath_count,
      SUM(CASE WHEN ath_timing = 'before_ath' THEN 1 ELSE 0 END) as early_exit_count,
      SUM(CASE WHEN ath_timing = 'after_ath' THEN 1 ELSE 0 END) as late_exit_count
    FROM trade_journal
    WHERE user_id = ? AND ath_price IS NOT NULL AND exit_vs_ath_percent IS NOT NULL
  `).get(userId)

  return {
    moodOnLosses,
    researchOnWins,
    holdByMood,
    pnlByResearch,
    athPatterns: athStats && athStats.total_with_ath > 0 ? {
      totalWithAth: athStats.total_with_ath,
      avgExitVsAth: athStats.avg_exit_vs_ath,
      nearAthCount: athStats.near_ath_count,
      earlyExitCount: athStats.early_exit_count,
      lateExitCount: athStats.late_exit_count,
    } : null,
  }
}

export const getWeeklySummary = (userId) => {
  const stmt = db.prepare(`
    SELECT
      strftime('%Y-%W', exit_time) as week,
      COUNT(*) as total_trades,
      SUM(CASE WHEN pnl_sol > 0 THEN 1 ELSE 0 END) as wins,
      SUM(pnl_sol) as total_pnl,
      AVG(pnl_percent) as avg_pnl_percent
    FROM trade_journal
    WHERE user_id = ? AND exit_time >= date('now', '-12 weeks')
    GROUP BY week
    ORDER BY week DESC
  `)
  return stmt.all(userId)
}

export const getMonthlySummary = (userId) => {
  const stmt = db.prepare(`
    SELECT
      strftime('%Y-%m', exit_time) as month,
      COUNT(*) as total_trades,
      SUM(CASE WHEN pnl_sol > 0 THEN 1 ELSE 0 END) as wins,
      SUM(pnl_sol) as total_pnl,
      AVG(pnl_percent) as avg_pnl_percent
    FROM trade_journal
    WHERE user_id = ? AND exit_time >= date('now', '-12 months')
    GROUP BY month
    ORDER BY month DESC
  `)
  return stmt.all(userId)
}

export const checkDuplicateJournalEntry = (userId, tokenAddress, exitTime) => {
  const stmt = db.prepare(`
    SELECT id FROM trade_journal
    WHERE user_id = ? AND token_address = ? AND exit_time = ?
  `)
  return stmt.get(userId, tokenAddress, exitTime)
}

export default db
