import { createClient } from '@libsql/client'

// Turso database connection
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// Free tier limits
export const FREE_TIER_LIMITS = {
  MAX_WALLETS: 1,
  MAX_JOURNAL_ENTRIES: 1,
}

// Initialize tables (run once on first deploy)
export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      primary_archetype TEXT,
      secondary_archetype TEXT,
      quiz_answers TEXT,
      saved_wallets TEXT DEFAULT '[]',
      is_pro INTEGER DEFAULT 0,
      pro_verified_at DATETIME,
      pro_expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Add Pro columns if they don't exist (for existing databases)
  try {
    await db.execute(`ALTER TABLE users ADD COLUMN is_pro INTEGER DEFAULT 0`)
  } catch (e) { /* Column already exists */ }
  try {
    await db.execute(`ALTER TABLE users ADD COLUMN pro_verified_at DATETIME`)
  } catch (e) { /* Column already exists */ }
  try {
    await db.execute(`ALTER TABLE users ADD COLUMN pro_expires_at DATETIME`)
  } catch (e) { /* Column already exists */ }

  await db.execute(`
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
    )
  `)

  await db.execute(`
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
    )
  `)

  // Create indexes
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_journal_user_id ON trade_journal(user_id)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_journal_exit_time ON trade_journal(exit_time)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_journal_token_address ON trade_journal(token_address)`)
}

// User functions
export async function createUser(username, passwordHash) {
  const result = await db.execute({
    sql: `INSERT INTO users (username, password_hash) VALUES (?, ?)`,
    args: [username, passwordHash],
  })
  return Number(result.lastInsertRowid)
}

export async function getUserByUsername(username) {
  const result = await db.execute({
    sql: `SELECT * FROM users WHERE username = ?`,
    args: [username],
  })
  return result.rows[0] || null
}

export async function getUserById(id) {
  const result = await db.execute({
    sql: `SELECT * FROM users WHERE id = ?`,
    args: [id],
  })
  return result.rows[0] || null
}

export async function updateUserArchetype(userId, primary, secondary, quizAnswers) {
  // Ensure all values are valid Turso types (string, number, null, or BigInt)
  // Convert undefined to null, ensure strings are strings
  const safePrimary = primary != null ? String(primary) : null
  const safeSecondary = secondary != null ? String(secondary) : null
  const safeUserId = userId != null ? Number(userId) : null

  // Serialize quizAnswers - handle undefined, null, and array
  let serializedAnswers = null
  if (quizAnswers != null) {
    try {
      serializedAnswers = JSON.stringify(quizAnswers)
    } catch (e) {
      console.error('[DB] Failed to serialize quizAnswers:', e)
      serializedAnswers = null
    }
  }

  const args = [safePrimary, safeSecondary, serializedAnswers, safeUserId]

  // Debug: Log exact args being sent to Turso
  console.log('[DB] updateUserArchetype args:', args)
  console.log('[DB] arg types:', args.map((a, i) => ({
    index: i,
    value: a,
    type: typeof a,
    isNull: a === null,
    isUndefined: a === undefined,
  })))

  // Verify no undefined values (Turso doesn't support undefined)
  if (args.some(a => a === undefined)) {
    throw new Error('Cannot pass undefined to Turso - use null instead')
  }

  try {
    await db.execute({
      sql: `UPDATE users SET primary_archetype = ?, secondary_archetype = ?, quiz_answers = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args,
    })
  } catch (err) {
    console.error('[DB] Turso execute error:', err)
    console.error('[DB] Error details:', { message: err.message, code: err.code })
    throw err
  }
}

export async function addSavedWallet(userId, walletAddress) {
  const user = await getUserById(userId)
  if (!user) throw new Error('User not found')

  const wallets = JSON.parse(user.saved_wallets || '[]')
  if (!wallets.includes(walletAddress)) {
    wallets.push(walletAddress)
    await db.execute({
      sql: `UPDATE users SET saved_wallets = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [JSON.stringify(wallets), userId],
    })
  }
  return wallets
}

// Add wallet bypassing free tier limit (used for $SIGHT verification)
export async function addSavedWalletBypassLimit(userId, walletAddress) {
  const user = await getUserById(userId)
  if (!user) throw new Error('User not found')

  const wallets = JSON.parse(user.saved_wallets || '[]')
  if (!wallets.includes(walletAddress)) {
    wallets.push(walletAddress)
    await db.execute({
      sql: `UPDATE users SET saved_wallets = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [JSON.stringify(wallets), userId],
    })
  }
  return wallets
}

export async function removeSavedWallet(userId, walletAddress) {
  const user = await getUserById(userId)
  if (!user) throw new Error('User not found')

  let wallets = JSON.parse(user.saved_wallets || '[]')
  wallets = wallets.filter(w => w !== walletAddress)
  await db.execute({
    sql: `UPDATE users SET saved_wallets = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [JSON.stringify(wallets), userId],
  })
  return wallets
}

// Analysis functions
export async function saveAnalysis(userId, walletAddress, analysis, stats) {
  const result = await db.execute({
    sql: `INSERT INTO analyses (user_id, wallet_address, verdict, win_rate, avg_hold_time, patterns, stats) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      userId,
      walletAddress,
      analysis.verdict,
      analysis.winRate,
      analysis.avgHoldTime,
      JSON.stringify(analysis.patterns || []),
      JSON.stringify(stats || {}),
    ],
  })
  return Number(result.lastInsertRowid)
}

export async function getUserAnalyses(userId) {
  const result = await db.execute({
    sql: `SELECT * FROM analyses WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
    args: [userId],
  })
  return result.rows
}

// Journal functions
export async function getJournalEntries(userId, filters = {}) {
  let sql = `SELECT * FROM trade_journal WHERE user_id = ?`
  const args = [userId]

  if (filters.outcome === 'winners') {
    sql += ` AND pnl_percent > 0`
  } else if (filters.outcome === 'losers') {
    sql += ` AND pnl_percent < 0`
  }

  if (filters.mood) {
    sql += ` AND mood = ?`
    args.push(filters.mood)
  }

  if (filters.researchLevel) {
    sql += ` AND research_level = ?`
    args.push(filters.researchLevel)
  }

  if (filters.dateFrom) {
    sql += ` AND exit_time >= ?`
    args.push(filters.dateFrom)
  }

  if (filters.dateTo) {
    sql += ` AND exit_time <= ?`
    args.push(filters.dateTo)
  }

  sql += ` ORDER BY exit_time DESC`

  if (filters.limit) {
    sql += ` LIMIT ?`
    args.push(filters.limit)
  }

  const result = await db.execute({ sql, args })
  return result.rows
}

export async function getJournalStats(userId) {
  const result = await db.execute({
    sql: `
      SELECT
        COUNT(*) as total_trades,
        SUM(CASE WHEN pnl_percent > 0 THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN pnl_percent < 0 THEN 1 ELSE 0 END) as losses,
        SUM(pnl_sol) as total_pnl,
        AVG(pnl_percent) as avg_pnl_percent
      FROM trade_journal
      WHERE user_id = ?
    `,
    args: [userId],
  })
  return result.rows[0]
}

export async function createJournalEntry(userId, entry) {
  const result = await db.execute({
    sql: `
      INSERT INTO trade_journal (
        user_id, token_address, token_name, entry_price, entry_time,
        exit_price, exit_time, position_size, pnl_sol, pnl_percent,
        hold_duration, thesis, execution, mood, research_level,
        exit_reasoning, lesson_learned, ath_price, ath_time,
        ath_market_cap, exit_vs_ath_percent, ath_timing
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      userId,
      entry.tokenAddress,
      entry.tokenName,
      entry.entryPrice,
      entry.entryTime,
      entry.exitPrice,
      entry.exitTime,
      entry.positionSize,
      entry.pnlSol,
      entry.pnlPercent,
      entry.holdDuration,
      entry.thesis || null,
      entry.execution || null,
      entry.mood || null,
      entry.researchLevel || null,
      entry.exitReasoning || null,
      entry.lessonLearned || null,
      entry.athPrice || null,
      entry.athTime || null,
      entry.athMarketCap || null,
      entry.exitVsAthPercent || null,
      entry.athTiming || null,
    ],
  })
  return Number(result.lastInsertRowid)
}

export async function updateJournalEntry(entryId, userId, updates) {
  const fields = []
  const args = []

  const allowedFields = ['thesis', 'execution', 'mood', 'research_level', 'exit_reasoning', 'lesson_learned']

  for (const [key, value] of Object.entries(updates)) {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
    if (allowedFields.includes(dbKey)) {
      fields.push(`${dbKey} = ?`)
      args.push(value)
    }
  }

  if (fields.length === 0) return

  fields.push('updated_at = CURRENT_TIMESTAMP')
  args.push(entryId, userId)

  await db.execute({
    sql: `UPDATE trade_journal SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
    args,
  })
}

export async function journalEntryExists(userId, tokenAddress, exitTime) {
  const result = await db.execute({
    sql: `SELECT id FROM trade_journal WHERE user_id = ? AND token_address = ? AND exit_time = ?`,
    args: [userId, tokenAddress, exitTime],
  })
  return result.rows.length > 0
}

export async function getJournalPatterns(userId) {
  // Get mood distribution
  const moodResult = await db.execute({
    sql: `
      SELECT mood,
             COUNT(*) as count,
             AVG(pnl_percent) as avg_pnl
      FROM trade_journal
      WHERE user_id = ? AND mood IS NOT NULL
      GROUP BY mood
    `,
    args: [userId],
  })

  // Get research level distribution
  const researchResult = await db.execute({
    sql: `
      SELECT research_level,
             COUNT(*) as count,
             AVG(pnl_percent) as avg_pnl
      FROM trade_journal
      WHERE user_id = ? AND research_level IS NOT NULL
      GROUP BY research_level
    `,
    args: [userId],
  })

  return {
    byMood: moodResult.rows,
    byResearch: researchResult.rows,
  }
}

export async function getWeeklySummary(userId) {
  const result = await db.execute({
    sql: `
      SELECT
        strftime('%Y-%W', exit_time) as week,
        COUNT(*) as trades,
        SUM(CASE WHEN pnl_percent > 0 THEN 1 ELSE 0 END) as wins,
        SUM(pnl_sol) as pnl
      FROM trade_journal
      WHERE user_id = ?
      GROUP BY week
      ORDER BY week DESC
      LIMIT 12
    `,
    args: [userId],
  })
  return result.rows
}

export async function getMonthlySummary(userId) {
  const result = await db.execute({
    sql: `
      SELECT
        strftime('%Y-%m', exit_time) as month,
        COUNT(*) as trades,
        SUM(CASE WHEN pnl_percent > 0 THEN 1 ELSE 0 END) as wins,
        SUM(pnl_sol) as pnl
      FROM trade_journal
      WHERE user_id = ?
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `,
    args: [userId],
  })
  return result.rows
}

// Get user's usage stats
export async function getUserUsageStats(userId) {
  const user = await getUserById(userId)
  if (!user) return null

  const walletCount = JSON.parse(user.saved_wallets || '[]').length

  const journalResult = await db.execute({
    sql: `SELECT COUNT(*) as count FROM trade_journal WHERE user_id = ?`,
    args: [userId],
  })
  const journalEntryCount = Number(journalResult.rows[0]?.count || 0)

  // Check if Pro status is still valid (not expired)
  const isPro = user.is_pro === 1 && (
    !user.pro_expires_at || new Date(user.pro_expires_at) > new Date()
  )

  return {
    walletCount,
    journalEntryCount,
    isPro,
    proVerifiedAt: user.pro_verified_at,
    proExpiresAt: user.pro_expires_at,
  }
}

// Update Pro status
export async function updateProStatus(userId, isPro) {
  const now = new Date().toISOString()
  // Pro status expires after 24 hours (will need to re-verify)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  await db.execute({
    sql: `UPDATE users SET is_pro = ?, pro_verified_at = ?, pro_expires_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [isPro ? 1 : 0, isPro ? now : null, isPro ? expiresAt : null, userId],
  })
}

// Check if user can add wallet (within free tier or is Pro)
export async function canAddWallet(userId) {
  const stats = await getUserUsageStats(userId)
  if (!stats) return { allowed: false, reason: 'User not found' }

  if (stats.isPro) return { allowed: true, isPro: true }
  if (stats.walletCount < FREE_TIER_LIMITS.MAX_WALLETS) {
    return { allowed: true, isPro: false, remaining: FREE_TIER_LIMITS.MAX_WALLETS - stats.walletCount }
  }

  return {
    allowed: false,
    isPro: false,
    reason: 'Free tier wallet limit reached',
    limit: FREE_TIER_LIMITS.MAX_WALLETS,
    current: stats.walletCount,
  }
}

// Check if user can add journal entry (within free tier or is Pro)
export async function canAddJournalEntry(userId) {
  const stats = await getUserUsageStats(userId)
  if (!stats) return { allowed: false, reason: 'User not found' }

  if (stats.isPro) return { allowed: true, isPro: true }
  if (stats.journalEntryCount < FREE_TIER_LIMITS.MAX_JOURNAL_ENTRIES) {
    return { allowed: true, isPro: false, remaining: FREE_TIER_LIMITS.MAX_JOURNAL_ENTRIES - stats.journalEntryCount }
  }

  return {
    allowed: false,
    isPro: false,
    reason: 'Free tier journal entry limit reached',
    limit: FREE_TIER_LIMITS.MAX_JOURNAL_ENTRIES,
    current: stats.journalEntryCount,
  }
}

// Placeholder for $SIGHT token verification
// TODO: Plug in $SIGHT CA after launch
export async function checkSightBalance(walletAddresses) {
  // This will be updated post-launch to actually check balances
  // For now, returns not Pro
  return {
    isPro: false,
    balance: 0,
    requiredBalance: 0.25, // 0.25 SOL worth of $SIGHT
    // TODO: Add actual token check here
    // const SIGHT_CA = 'YOUR_TOKEN_CA_HERE'
    // const MIN_BALANCE_SOL = 0.25
  }
}

export default db
