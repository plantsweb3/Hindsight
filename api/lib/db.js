import { createClient } from '@libsql/client'

// TODO: Update SIGHT_CA with actual contract address at launch
const SIGHT_CA = 'PLACEHOLDER_UPDATE_AT_LAUNCH'

// Turso database connection (lazy initialization)
let db = null

function getDb() {
  if (!db) {
    if (!process.env.TURSO_DATABASE_URL) {
      throw new Error('TURSO_DATABASE_URL environment variable is not set')
    }
    db = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
    console.log('[DB] Database client initialized')
  }
  return db
}

// Free tier limits
export const FREE_TIER_LIMITS = {
  MAX_WALLETS: 1,
  MAX_JOURNAL_ENTRIES: 1,
}

// Initialize tables (run once on first deploy)
export async function initDb() {
  await getDb().execute(`
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
    await getDb().execute(`ALTER TABLE users ADD COLUMN is_pro INTEGER DEFAULT 0`)
  } catch (e) { /* Column already exists */ }
  try {
    await getDb().execute(`ALTER TABLE users ADD COLUMN pro_verified_at DATETIME`)
  } catch (e) { /* Column already exists */ }
  try {
    await getDb().execute(`ALTER TABLE users ADD COLUMN pro_expires_at DATETIME`)
  } catch (e) { /* Column already exists */ }

  // Add Academy onboarding columns
  try {
    await getDb().execute(`ALTER TABLE users ADD COLUMN academy_onboarded INTEGER DEFAULT 0`)
  } catch (e) { /* Column already exists */ }
  try {
    await getDb().execute(`ALTER TABLE users ADD COLUMN experience_level TEXT`)
  } catch (e) { /* Column already exists */ }
  try {
    await getDb().execute(`ALTER TABLE users ADD COLUMN trading_goal TEXT`)
  } catch (e) { /* Column already exists */ }
  try {
    await getDb().execute(`ALTER TABLE users ADD COLUMN placement_score INTEGER`)
  } catch (e) { /* Column already exists */ }
  try {
    await getDb().execute(`ALTER TABLE users ADD COLUMN academy_start_section TEXT`)
  } catch (e) { /* Column already exists */ }

  await getDb().execute(`
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

  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS trade_journal (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      wallet_address TEXT,
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

  // Migration: Add wallet_address column if it doesn't exist (for existing databases)
  // MUST run BEFORE creating indexes that reference this column
  try {
    await getDb().execute(`ALTER TABLE trade_journal ADD COLUMN wallet_address TEXT`)
    console.log('[DB] Migration: Added wallet_address column to trade_journal')
  } catch (err) {
    // Column already exists - this is expected, just log it
    console.log('[DB] Migration note:', err.message || 'wallet_address column likely already exists')
  }

  // Create indexes (after migrations so all columns exist)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_journal_user_id ON trade_journal(user_id)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_journal_exit_time ON trade_journal(exit_time)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_journal_token_address ON trade_journal(token_address)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_journal_wallet_address ON trade_journal(wallet_address)`)

  // Bug reports table
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS bug_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      description TEXT NOT NULL,
      steps TEXT,
      screenshot TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'new'
    )
  `)

  // Add screenshot column if it doesn't exist (for existing databases)
  try {
    await getDb().execute(`ALTER TABLE bug_reports ADD COLUMN screenshot TEXT`)
  } catch (e) { /* Column already exists */ }

  // Bug reports indexes
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_bug_reports_status ON bug_reports(status)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_bug_reports_created_at ON bug_reports(created_at DESC)`)

  // Academy modules table
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS academy_modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      subtitle TEXT,
      description TEXT,
      icon TEXT,
      difficulty TEXT DEFAULT 'beginner',
      is_pro INTEGER DEFAULT 0,
      order_index INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Add subtitle/difficulty/is_pro columns if they don't exist (for existing databases)
  try {
    await getDb().execute(`ALTER TABLE academy_modules ADD COLUMN subtitle TEXT`)
  } catch (e) { /* Column already exists */ }
  try {
    await getDb().execute(`ALTER TABLE academy_modules ADD COLUMN difficulty TEXT DEFAULT 'beginner'`)
  } catch (e) { /* Column already exists */ }
  try {
    await getDb().execute(`ALTER TABLE academy_modules ADD COLUMN is_pro INTEGER DEFAULT 0`)
  } catch (e) { /* Column already exists */ }

  // Academy lessons table
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS academy_lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      content TEXT,
      description TEXT,
      reading_time INTEGER DEFAULT 5,
      difficulty TEXT DEFAULT 'beginner',
      archetype_tags TEXT DEFAULT '[]',
      order_index INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (module_id) REFERENCES academy_modules(id) ON DELETE CASCADE,
      UNIQUE(module_id, slug)
    )
  `)

  // User academy progress table
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS user_academy_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id INTEGER NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (lesson_id) REFERENCES academy_lessons(id) ON DELETE CASCADE,
      UNIQUE(user_id, lesson_id)
    )
  `)

  // Academy indexes
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_academy_modules_slug ON academy_modules(slug)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_academy_lessons_module_id ON academy_lessons(module_id)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_academy_lessons_slug ON academy_lessons(slug)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_academy_progress_user_id ON user_academy_progress(user_id)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_academy_progress_lesson_id ON user_academy_progress(lesson_id)`)

  // ============================================
  // Quiz and XP System Tables
  // ============================================

  // User XP and progression
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS user_xp_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      total_xp INTEGER DEFAULT 0,
      current_level INTEGER DEFAULT 1,
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      last_activity_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Quiz attempts and scores
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      quiz_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      passed INTEGER NOT NULL,
      perfect INTEGER NOT NULL,
      xp_earned INTEGER NOT NULL,
      answers_json TEXT,
      attempted_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Track best quiz scores (for retakes)
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS quiz_best_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      quiz_id TEXT NOT NULL,
      best_score INTEGER NOT NULL,
      best_xp_earned INTEGER NOT NULL,
      attempts INTEGER DEFAULT 1,
      first_passed_at TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, quiz_id)
    )
  `)

  // Achievements/badges earned
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS user_achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      achievement_id TEXT NOT NULL,
      earned_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, achievement_id)
    )
  `)

  // Module completion tracking
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS module_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      module_id TEXT NOT NULL,
      completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
      final_test_score INTEGER,
      final_test_xp INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, module_id)
    )
  `)

  // Cross-device progress sync table
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS user_progress_sync (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      progress_data TEXT DEFAULT '{}',
      stats_data TEXT DEFAULT '{}',
      placement_data TEXT DEFAULT '{}',
      master_exam_data TEXT DEFAULT '{}',
      achievements_data TEXT DEFAULT '[]',
      streak_data TEXT DEFAULT '{}',
      journal_xp_data TEXT DEFAULT '{}',
      daily_goal_id TEXT DEFAULT 'regular',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Migration: Add master_exam_data column if it doesn't exist (for existing databases)
  try {
    await getDb().execute(`ALTER TABLE user_progress_sync ADD COLUMN master_exam_data TEXT DEFAULT '{}'`)
  } catch (e) {
    // Column already exists, ignore
  }

  // Quiz/XP indexes
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_user_xp_progress_user_id ON user_xp_progress(user_id)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_quiz_best_scores_user_id ON quiz_best_scores(user_id)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_module_completions_user_id ON module_completions(user_id)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_user_progress_sync_user_id ON user_progress_sync(user_id)`)

  // ============================================
  // AI COACH TABLES
  // ============================================

  // Chat conversations
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS chat_conversations (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title TEXT,
      message_count INTEGER DEFAULT 0,
      is_archived INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Chat messages
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      token_count INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
    )
  `)

  // Daily message tracking for free tier limits
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS daily_message_counts (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      message_count INTEGER DEFAULT 0,
      UNIQUE(user_id, date),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Context cache for expensive context generation
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS user_context_cache (
      user_id INTEGER PRIMARY KEY,
      context_json TEXT NOT NULL,
      generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Chat indexes
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_chat_conversations_user ON chat_conversations(user_id, updated_at DESC)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id, created_at ASC)`)
  await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_daily_message_counts_user_date ON daily_message_counts(user_id, date)`)

  // Run one-time XP backfill for existing users (only runs once)
  await runOneTimeXpBackfill()
}

// User functions
export async function createUser(username, passwordHash) {
  const result = await getDb().execute({
    sql: `INSERT INTO users (username, password_hash) VALUES (?, ?)`,
    args: [username, passwordHash],
  })
  return Number(result.lastInsertRowid)
}

export async function getUserByUsername(username) {
  const result = await getDb().execute({
    sql: `SELECT * FROM users WHERE username = ?`,
    args: [username],
  })
  return result.rows[0] || null
}

export async function getUserById(id) {
  const result = await getDb().execute({
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
    await getDb().execute({
      sql: `UPDATE users SET primary_archetype = ?, secondary_archetype = ?, quiz_answers = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args,
    })
  } catch (err) {
    console.error('[DB] Turso execute error:', err)
    console.error('[DB] Error details:', { message: err.message, code: err.code })
    throw err
  }
}

// Default wallet labels
export const WALLET_LABELS = ['Main', 'Long Hold', 'Gamble', 'Sniper', 'Unlabeled']

// Helper to normalize wallet data (handle migration from string[] to object[])
function normalizeWallets(walletsJson) {
  const raw = JSON.parse(walletsJson || '[]')
  // Convert old format (string[]) to new format (object[])
  return raw.map(w => {
    if (typeof w === 'string') {
      return { address: w, label: 'Unlabeled' }
    }
    return w
  })
}

// Helper to get wallet addresses as flat array
export function getWalletAddresses(wallets) {
  return wallets.map(w => typeof w === 'string' ? w : w.address)
}

export async function addSavedWallet(userId, walletAddress, label = 'Unlabeled') {
  const user = await getUserById(userId)
  if (!user) throw new Error('User not found')

  const wallets = normalizeWallets(user.saved_wallets)
  const exists = wallets.some(w => w.address === walletAddress)

  if (!exists) {
    wallets.push({ address: walletAddress, label })
    await getDb().execute({
      sql: `UPDATE users SET saved_wallets = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [JSON.stringify(wallets), userId],
    })
  }
  return wallets
}

// Add wallet bypassing free tier limit (used for $SIGHT verification)
export async function addSavedWalletBypassLimit(userId, walletAddress, label = 'Unlabeled') {
  const user = await getUserById(userId)
  if (!user) throw new Error('User not found')

  const wallets = normalizeWallets(user.saved_wallets)
  const exists = wallets.some(w => w.address === walletAddress)

  if (!exists) {
    wallets.push({ address: walletAddress, label })
    await getDb().execute({
      sql: `UPDATE users SET saved_wallets = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [JSON.stringify(wallets), userId],
    })
  }
  return wallets
}

export async function removeSavedWallet(userId, walletAddress) {
  const user = await getUserById(userId)
  if (!user) throw new Error('User not found')

  let wallets = normalizeWallets(user.saved_wallets)
  wallets = wallets.filter(w => w.address !== walletAddress)
  await getDb().execute({
    sql: `UPDATE users SET saved_wallets = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [JSON.stringify(wallets), userId],
  })
  return wallets
}

// Update wallet label (Pro feature)
export async function updateWalletLabel(userId, walletAddress, label) {
  const user = await getUserById(userId)
  if (!user) throw new Error('User not found')

  const wallets = normalizeWallets(user.saved_wallets)
  const walletIndex = wallets.findIndex(w => w.address === walletAddress)

  if (walletIndex === -1) {
    throw new Error('Wallet not found')
  }

  wallets[walletIndex].label = label
  await getDb().execute({
    sql: `UPDATE users SET saved_wallets = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [JSON.stringify(wallets), userId],
  })
  return wallets
}

// Get user's wallets with labels (normalized)
export async function getUserWallets(userId) {
  const user = await getUserById(userId)
  if (!user) return []
  return normalizeWallets(user.saved_wallets)
}

// Analysis functions
export async function saveAnalysis(userId, walletAddress, analysis, stats) {
  const result = await getDb().execute({
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
  const result = await getDb().execute({
    sql: `SELECT * FROM analyses WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
    args: [userId],
  })
  return result.rows
}

// Journal functions
export async function getJournalEntries(userId, filters = {}) {
  let sql = `SELECT * FROM trade_journal WHERE user_id = ?`
  const args = [userId]

  // Exclude $SIGHT token from results (skip if placeholder)
  if (SIGHT_CA !== 'PLACEHOLDER_UPDATE_AT_LAUNCH') {
    sql += ` AND (token_address IS NULL OR token_address != ?)`
    args.push(SIGHT_CA)
  }

  // Filter by wallet address
  if (filters.walletAddress) {
    sql += ` AND wallet_address = ?`
    args.push(filters.walletAddress)
  }

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

  const result = await getDb().execute({ sql, args })
  return result.rows
}

export async function getJournalStats(userId) {
  // Build query with optional SIGHT exclusion
  const excludeSight = SIGHT_CA !== 'PLACEHOLDER_UPDATE_AT_LAUNCH'
  const sql = `
    SELECT
      COUNT(*) as total_trades,
      SUM(CASE WHEN pnl_percent > 0 THEN 1 ELSE 0 END) as wins,
      SUM(CASE WHEN pnl_percent < 0 THEN 1 ELSE 0 END) as losses,
      SUM(pnl_sol) as total_pnl,
      AVG(pnl_percent) as avg_pnl_percent
    FROM trade_journal
    WHERE user_id = ?${excludeSight ? ' AND (token_address IS NULL OR token_address != ?)' : ''}
  `
  const args = excludeSight ? [userId, SIGHT_CA] : [userId]

  const result = await getDb().execute({ sql, args })
  return result.rows[0]
}

export async function createJournalEntry(userId, entry) {
  const result = await getDb().execute({
    sql: `
      INSERT INTO trade_journal (
        user_id, wallet_address, token_address, token_name, entry_price, entry_time,
        exit_price, exit_time, position_size, pnl_sol, pnl_percent,
        hold_duration, thesis, execution, mood, research_level,
        exit_reasoning, lesson_learned, ath_price, ath_time,
        ath_market_cap, exit_vs_ath_percent, ath_timing
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      userId,
      entry.walletAddress || null,
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

  await getDb().execute({
    sql: `UPDATE trade_journal SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
    args,
  })
}

export async function journalEntryExists(userId, tokenAddress, exitTime) {
  const result = await getDb().execute({
    sql: `SELECT id FROM trade_journal WHERE user_id = ? AND token_address = ? AND exit_time = ?`,
    args: [userId, tokenAddress, exitTime],
  })
  return result.rows.length > 0
}

export async function getJournalPatterns(userId) {
  const excludeSight = SIGHT_CA !== 'PLACEHOLDER_UPDATE_AT_LAUNCH'
  const sightFilter = excludeSight ? ' AND (token_address IS NULL OR token_address != ?)' : ''

  // Get mood distribution
  const moodResult = await getDb().execute({
    sql: `
      SELECT mood,
             COUNT(*) as count,
             AVG(pnl_percent) as avg_pnl
      FROM trade_journal
      WHERE user_id = ? AND mood IS NOT NULL${sightFilter}
      GROUP BY mood
    `,
    args: excludeSight ? [userId, SIGHT_CA] : [userId],
  })

  // Get research level distribution
  const researchResult = await getDb().execute({
    sql: `
      SELECT research_level,
             COUNT(*) as count,
             AVG(pnl_percent) as avg_pnl
      FROM trade_journal
      WHERE user_id = ? AND research_level IS NOT NULL${sightFilter}
      GROUP BY research_level
    `,
    args: excludeSight ? [userId, SIGHT_CA] : [userId],
  })

  return {
    byMood: moodResult.rows,
    byResearch: researchResult.rows,
  }
}

export async function getWeeklySummary(userId) {
  const excludeSight = SIGHT_CA !== 'PLACEHOLDER_UPDATE_AT_LAUNCH'
  const sightFilter = excludeSight ? ' AND (token_address IS NULL OR token_address != ?)' : ''

  const result = await getDb().execute({
    sql: `
      SELECT
        strftime('%Y-%W', exit_time) as week,
        COUNT(*) as trades,
        SUM(CASE WHEN pnl_percent > 0 THEN 1 ELSE 0 END) as wins,
        SUM(pnl_sol) as pnl
      FROM trade_journal
      WHERE user_id = ?${sightFilter}
      GROUP BY week
      ORDER BY week DESC
      LIMIT 12
    `,
    args: excludeSight ? [userId, SIGHT_CA] : [userId],
  })
  return result.rows
}

export async function getMonthlySummary(userId) {
  const excludeSight = SIGHT_CA !== 'PLACEHOLDER_UPDATE_AT_LAUNCH'
  const sightFilter = excludeSight ? ' AND (token_address IS NULL OR token_address != ?)' : ''

  const result = await getDb().execute({
    sql: `
      SELECT
        strftime('%Y-%m', exit_time) as month,
        COUNT(*) as trades,
        SUM(CASE WHEN pnl_percent > 0 THEN 1 ELSE 0 END) as wins,
        SUM(pnl_sol) as pnl
      FROM trade_journal
      WHERE user_id = ?${sightFilter}
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `,
    args: excludeSight ? [userId, SIGHT_CA] : [userId],
  })
  return result.rows
}

// Get user's usage stats
export async function getUserUsageStats(userId) {
  const user = await getUserById(userId)
  if (!user) return null

  const wallets = normalizeWallets(user.saved_wallets)
  const walletCount = wallets.length

  const journalResult = await getDb().execute({
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

  await getDb().execute({
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

// Bug report functions
export async function createBugReport(email, description, steps, userAgent, screenshot = null) {
  const result = await getDb().execute({
    sql: `INSERT INTO bug_reports (email, description, steps, user_agent, screenshot) VALUES (?, ?, ?, ?, ?)`,
    args: [email || null, description, steps || null, userAgent || null, screenshot || null],
  })
  return Number(result.lastInsertRowid)
}

export async function getBugReports(status = null) {
  let sql = `SELECT * FROM bug_reports`
  const args = []

  if (status) {
    sql += ` WHERE status = ?`
    args.push(status)
  }

  sql += ` ORDER BY created_at DESC`

  const result = await getDb().execute({ sql, args })
  return result.rows
}

export async function updateBugReportStatus(id, status) {
  await getDb().execute({
    sql: `UPDATE bug_reports SET status = ? WHERE id = ?`,
    args: [status, id],
  })
}

// Academy functions

// Get all published modules with lesson counts and user progress
export async function getAcademyModules(userId = null) {
  let sql = `
    SELECT
      m.*,
      COUNT(DISTINCT l.id) as lesson_count,
      ${userId ? 'COUNT(DISTINCT p.lesson_id) as completed_count' : '0 as completed_count'}
    FROM academy_modules m
    LEFT JOIN academy_lessons l ON l.module_id = m.id AND l.is_published = 1
    ${userId ? 'LEFT JOIN user_academy_progress p ON p.lesson_id = l.id AND p.user_id = ?' : ''}
    WHERE m.is_published = 1
    GROUP BY m.id
    ORDER BY m.order_index ASC
  `
  const args = userId ? [userId] : []
  const result = await getDb().execute({ sql, args })
  return result.rows
}

// Get single module by slug with its lessons
export async function getAcademyModuleBySlug(slug, userId = null) {
  // Get module
  const moduleResult = await getDb().execute({
    sql: `SELECT * FROM academy_modules WHERE slug = ? AND is_published = 1`,
    args: [slug],
  })

  if (!moduleResult.rows.length) return null
  const module = moduleResult.rows[0]

  // Get lessons for this module
  let lessonSql = `
    SELECT
      l.*,
      ${userId ? 'CASE WHEN p.id IS NOT NULL THEN 1 ELSE 0 END as is_completed' : '0 as is_completed'}
    FROM academy_lessons l
    ${userId ? 'LEFT JOIN user_academy_progress p ON p.lesson_id = l.id AND p.user_id = ?' : ''}
    WHERE l.module_id = ? AND l.is_published = 1
    ORDER BY l.order_index ASC
  `
  const lessonArgs = userId ? [userId, module.id] : [module.id]
  const lessonsResult = await getDb().execute({ sql: lessonSql, args: lessonArgs })

  return {
    ...module,
    lessons: lessonsResult.rows,
  }
}

// Get single lesson by module and lesson slugs
export async function getAcademyLessonBySlug(moduleSlug, lessonSlug, userId = null) {
  const sql = `
    SELECT
      l.*,
      m.title as module_title,
      m.slug as module_slug,
      m.icon as module_icon,
      ${userId ? 'CASE WHEN p.id IS NOT NULL THEN 1 ELSE 0 END as is_completed' : '0 as is_completed'}
    FROM academy_lessons l
    JOIN academy_modules m ON l.module_id = m.id
    ${userId ? 'LEFT JOIN user_academy_progress p ON p.lesson_id = l.id AND p.user_id = ?' : ''}
    WHERE m.slug = ? AND l.slug = ? AND l.is_published = 1 AND m.is_published = 1
  `
  const args = userId ? [userId, moduleSlug, lessonSlug] : [moduleSlug, lessonSlug]
  const result = await getDb().execute({ sql, args })

  if (!result.rows.length) return null

  const lesson = result.rows[0]

  // Get prev/next lessons
  const navResult = await getDb().execute({
    sql: `
      SELECT id, title, slug, order_index FROM academy_lessons
      WHERE module_id = (SELECT id FROM academy_modules WHERE slug = ?) AND is_published = 1
      ORDER BY order_index ASC
    `,
    args: [moduleSlug],
  })

  const lessons = navResult.rows
  const currentIndex = lessons.findIndex(l => l.slug === lessonSlug)

  return {
    ...lesson,
    prevLesson: currentIndex > 0 ? lessons[currentIndex - 1] : null,
    nextLesson: currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
  }
}

// Normalize archetype name to slug format
function normalizeArchetypeToSlug(archetype) {
  if (!archetype) return null
  // Handle camelCase like NarrativeFrontRunner -> narrative-front-runner
  return archetype
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/\s+/g, '-')
}

// Get recommended lessons based on user's archetype
export async function getRecommendedLessons(archetype, userId = null, limit = 5) {
  // Normalize archetype to match module slug (e.g., NarrativeFrontRunner -> narrative-front-runner)
  const archetypeSlug = normalizeArchetypeToSlug(archetype)

  // Priority 1: Get lessons from archetype-specific module (matching slug)
  // Priority 2: Get lessons tagged with this archetype
  // Priority 3: Get any incomplete lessons (fallback)
  let sql = `
    SELECT
      l.*,
      m.title as module_title,
      m.slug as module_slug,
      m.icon as module_icon,
      ${userId ? 'CASE WHEN p.id IS NOT NULL THEN 1 ELSE 0 END as is_completed' : '0 as is_completed'}
    FROM academy_lessons l
    JOIN academy_modules m ON l.module_id = m.id
    ${userId ? 'LEFT JOIN user_academy_progress p ON p.lesson_id = l.id AND p.user_id = ?' : ''}
    WHERE l.is_published = 1 AND m.is_published = 1
    ${userId ? 'AND p.id IS NULL' : ''}
    ORDER BY
      CASE
        WHEN m.slug = ? THEN 0
        WHEN m.slug LIKE ? THEN 1
        WHEN l.archetype_tags LIKE ? THEN 2
        ELSE 3
      END,
      l.order_index ASC
    LIMIT ?
  `

  const archetypePattern = `%${archetypeSlug}%`
  const archetypeTagPattern = `%"${archetype}"%`

  const args = userId
    ? [userId, archetypeSlug, archetypePattern, archetypeTagPattern, limit]
    : [archetypeSlug, archetypePattern, archetypeTagPattern, limit]

  const result = await getDb().execute({ sql, args })
  return result.rows
}

// Get user's academy progress
export async function getUserAcademyProgress(userId) {
  // Overall stats
  const totalResult = await getDb().execute({
    sql: `SELECT COUNT(*) as total FROM academy_lessons WHERE is_published = 1`,
    args: [],
  })

  const completedResult = await getDb().execute({
    sql: `SELECT COUNT(*) as completed FROM user_academy_progress WHERE user_id = ?`,
    args: [userId],
  })

  // Per-module progress
  const moduleProgress = await getDb().execute({
    sql: `
      SELECT
        m.id,
        m.title,
        m.slug,
        m.icon,
        COUNT(DISTINCT l.id) as total_lessons,
        COUNT(DISTINCT p.lesson_id) as completed_lessons
      FROM academy_modules m
      LEFT JOIN academy_lessons l ON l.module_id = m.id AND l.is_published = 1
      LEFT JOIN user_academy_progress p ON p.lesson_id = l.id AND p.user_id = ?
      WHERE m.is_published = 1
      GROUP BY m.id
      ORDER BY m.order_index ASC
    `,
    args: [userId],
  })

  // Recently completed
  const recentResult = await getDb().execute({
    sql: `
      SELECT l.*, m.slug as module_slug, p.completed_at
      FROM user_academy_progress p
      JOIN academy_lessons l ON p.lesson_id = l.id
      JOIN academy_modules m ON l.module_id = m.id
      WHERE p.user_id = ?
      ORDER BY p.completed_at DESC
      LIMIT 5
    `,
    args: [userId],
  })

  // All completed lesson IDs (for ModuleView)
  const completedIdsResult = await getDb().execute({
    sql: `SELECT lesson_id FROM user_academy_progress WHERE user_id = ?`,
    args: [userId],
  })

  return {
    totalLessons: Number(totalResult.rows[0]?.total || 0),
    completedLessons: Number(completedResult.rows[0]?.completed || 0),
    moduleProgress: moduleProgress.rows,
    recentlyCompleted: recentResult.rows,
    completedLessonIds: completedIdsResult.rows.map(r => r.lesson_id),
  }
}

// Mark lesson as complete
export async function markLessonComplete(userId, lessonId) {
  try {
    await getDb().execute({
      sql: `INSERT INTO user_academy_progress (user_id, lesson_id) VALUES (?, ?)`,
      args: [userId, lessonId],
    })
    return true
  } catch (e) {
    // Already completed (unique constraint violation)
    return false
  }
}

// Seed academy content (run once, or force reseed)
export async function seedAcademyContent(force = false) {
  // Check if already seeded
  const existing = await getDb().execute({ sql: `SELECT COUNT(*) as count FROM academy_modules`, args: [] })
  if (existing.rows[0].count > 0 && !force) {
    console.log('[Academy] Content already seeded')
    return
  }

  // If forcing, clear existing content first
  if (force && existing.rows[0].count > 0) {
    console.log('[Academy] Force reseed - clearing existing content')
    await getDb().execute({ sql: `DELETE FROM user_academy_progress`, args: [] })
    await getDb().execute({ sql: `DELETE FROM academy_lessons`, args: [] })
    await getDb().execute({ sql: `DELETE FROM academy_modules`, args: [] })
  }

  const modules = [
    // Trading 101 Modules
    { title: 'Newcomer', subtitle: 'Your First Steps', slug: 'newcomer', description: 'Get set up and make your first moves', icon: '🌱', difficulty: 'beginner', is_pro: 0, order_index: 1 },
    { title: 'Apprentice', subtitle: 'Research & Defense', slug: 'apprentice', description: 'Learn to find opportunities and avoid traps', icon: '🔍', difficulty: 'beginner+', is_pro: 0, order_index: 2 },
    { title: 'Trader', subtitle: 'Strategy & Execution', slug: 'trader', description: 'Size positions and manage risk like a pro', icon: '⚔️', difficulty: 'intermediate', is_pro: 0, order_index: 3 },
    { title: 'Specialist', subtitle: 'Psychology & Edge', slug: 'specialist', description: 'Master your emotions and find your edge', icon: '🧠', difficulty: 'advanced', is_pro: 1, order_index: 4 },
    { title: 'Master', subtitle: 'Scale & Optimize', slug: 'master', description: 'Advanced techniques for consistent profits', icon: '👑', difficulty: 'expert', is_pro: 1, order_index: 5 },
  ]

  for (const mod of modules) {
    await getDb().execute({
      sql: `INSERT INTO academy_modules (title, subtitle, slug, description, icon, difficulty, is_pro, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [mod.title, mod.subtitle, mod.slug, mod.description, mod.icon, mod.difficulty, mod.is_pro, mod.order_index],
    })
  }

  const lessons = [
    // Module 1: Newcomer (Your First Steps)
    { module_slug: 'newcomer', title: 'Setting Up Your Solana Wallet', slug: 'wallet-setup', description: 'What a wallet is, how to install Phantom, and critical security practices', reading_time: 5, difficulty: 'beginner', archetype_tags: '[]', order_index: 1, content: `## What You'll Learn
- What a Solana wallet actually is and why you need one
- How to install and set up Phantom (the most popular Solana wallet)
- Critical security practices that will protect your money

---

## Your Wallet Is Your Identity

In traditional finance, you have a bank account. In crypto, you have a wallet. But here's the key difference: **there's no bank**. You are your own bank. No customer service hotline. No fraud protection. No password reset.

This is the most important thing to understand before you start trading memecoins: **if you lose access to your wallet or someone steals your keys, your money is gone forever.** No one can reverse the transaction. No one can recover your funds.

Sound scary? Good. That healthy fear will keep you safe. Now let's set you up properly.

---

## Why Phantom?

Phantom is the most widely used wallet in the Solana ecosystem, with over 15 million users. It's the "MetaMask of Solana" - meaning it's the standard that most apps expect you to have.

**Why traders choose Phantom:**
- Built specifically for Solana (fast and optimized)
- Available as browser extension and mobile app
- Built-in swap feature, staking, and NFT gallery
- Transaction preview shows you what you're signing before you approve
- Supports hardware wallet connection for extra security
- Now also supports Ethereum, Polygon, and Bitcoin

Other solid options exist (Solflare, Backpack), but Phantom is where most beginners should start.

---

## Installation: Step by Step

### Desktop (Recommended for Trading)

1. **Go directly to phantom.app** - Never Google "Phantom wallet" and click an ad. Scammers run fake sites. Type the URL yourself or use this link: https://phantom.app

2. **Click "Download" and select your browser** - Phantom works on Chrome, Brave, Firefox, and Edge

3. **Add the extension** - Click "Add to Chrome" (or your browser) and confirm

4. **Create a new wallet** - Click the Phantom icon in your browser toolbar and select "Create a new wallet"

5. **SET A STRONG PASSWORD** - This password locks your wallet on this device. Make it unique and strong.

6. **WRITE DOWN YOUR SEED PHRASE** - This is the most critical step. More on this below.

### Mobile

1. Download Phantom from the official App Store (iOS) or Google Play (Android)
2. Open the app and tap "Create a new wallet"
3. Set up biometric unlock (Face ID, fingerprint)
4. Write down your seed phrase

---

## Your Seed Phrase: The Master Key

When you create your wallet, Phantom gives you a **seed phrase** - a list of 12 random words in a specific order. This phrase IS your wallet. Anyone who has these words can access your funds from any device, anywhere in the world.

### The Rules (Non-Negotiable)

**DO:**
- Write it down on paper immediately
- Store it somewhere secure (safe, lockbox, fireproof container)
- Consider making multiple copies stored in different locations
- Keep it offline forever

**DO NOT:**
- Take a screenshot
- Save it in your notes app
- Email it to yourself
- Store it in cloud storage (Google Drive, iCloud, Dropbox)
- Store it in a password manager
- Tell anyone - ever
- Enter it on any website except when restoring YOUR wallet

### Why This Matters

If your computer gets hacked, your phone gets stolen, or you fall for a phishing scam, the attacker needs your seed phrase to steal your funds. If it only exists on paper locked in your safe, they can't get it remotely.

**Real talk:** Most people who lose crypto don't get "hacked" by sophisticated attackers. They either lose their seed phrase, store it somewhere insecure, or enter it on a fake website. Don't be that person.

---

## Wallet Hygiene: Best Practices

### Use Multiple Wallets

Experienced traders don't use one wallet for everything. They separate:

1. **Vault Wallet** - Long-term holds and larger amounts. Rarely connects to apps. Consider pairing with a hardware wallet (Ledger) for maximum security.

2. **Trading Wallet** - Active trading, connects to DEXs and trading terminals. Only keep what you're willing to risk.

3. **Burner Wallet** - Testing sketchy sites, claiming airdrops, minting unknown NFTs. Treat funds here as expendable.

You can create multiple wallets in Phantom by clicking your profile and "Add / Connect Wallet" → "Create a new wallet."

### Check Before You Sign

Phantom shows you a preview of every transaction before you approve it. **Read it.** Look for:
- What are you approving?
- What tokens are being moved?
- Does this match what you expected?

If something looks off, reject the transaction. Scammers create fake sites that look identical to real ones but ask you to sign transactions that drain your wallet.

### Revoke Permissions Regularly

When you connect your wallet to apps, you grant them permissions. Periodically review and revoke access from apps you no longer use. You can do this at revoke.solscan.io.

---

## Quick Start Checklist

- Installed Phantom from phantom.app (not from Google search)
- Created new wallet with strong password
- Wrote down seed phrase on paper
- Stored seed phrase in secure location (not digitally)
- Understand that losing seed phrase = losing funds forever
- Know never to enter seed phrase on any website

---

## What's Next

Your wallet is ready. But it's empty. In the next lesson, you'll learn how to get SOL into your wallet so you can start trading.` },
    { module_slug: 'newcomer', title: 'Funding Your Wallet: CEX to DEX', slug: 'funding-wallet', description: 'How to get SOL into your wallet via different methods', reading_time: 5, difficulty: 'beginner', archetype_tags: '[]', order_index: 2, content: `## What You'll Learn
- How to get SOL (Solana's native token) into your wallet
- The difference between CEX and DEX trading
- Multiple methods to fund your wallet, from easiest to cheapest

---

## Why You Need SOL

Before you can trade memecoins, you need SOL in your wallet. SOL is Solana's native token, and it serves two purposes:

1. **Gas fees** - Every transaction on Solana costs a tiny amount of SOL (usually less than $0.01). Without SOL, you literally cannot do anything.

2. **Trading capital** - You'll swap SOL for the memecoins you want to buy. SOL is the base currency for most trading pairs.

**Recommendation:** Start with a small amount while you're learning. $50-100 is enough to get familiar with the ecosystem without risking serious money.

---

## Method 1: Buy Directly in Phantom (Easiest)

Phantom lets you buy SOL without leaving the app using Apple Pay, Google Pay, or card.

**How to do it:**
1. Open Phantom and tap "Buy"
2. Select SOL
3. Enter the dollar amount you want
4. Choose your payment method (Coinbase Pay, MoonPay, Robinhood)
5. Complete the purchase

**Pros:**
- Fastest option (funds arrive in minutes)
- No extra accounts needed
- Simple for beginners

**Cons:**
- Higher fees (payment processors take 2-5%)
- Amount limits vary by provider
- Requires identity verification

This is the easiest option for getting started quickly.

---

## Method 2: Buy on an Exchange and Transfer (Cheapest)

For lower fees and higher limits, buy SOL on a centralized exchange (CEX) and send it to your Phantom wallet.

### Step 1: Set Up an Exchange Account

Popular exchanges for buying SOL:
- **Coinbase** - Most beginner-friendly, widely trusted in the US
- **Kraken** - Good security reputation, lower fees than Coinbase
- **Binance** - Lowest fees, largest volume (not available in some US states)

Create an account, verify your identity (required by law), and link your bank account or card.

### Step 2: Buy SOL

Navigate to SOL on the exchange and place a buy order. For beginners, a "market order" is simplest - you'll get SOL at the current price immediately.

### Step 3: Withdraw to Phantom

This is the critical step. You're moving YOUR SOL from the exchange (where they hold it for you) to YOUR wallet (where only you control it).

1. In Phantom, tap "Receive" or click your wallet address to copy it
2. In your exchange, go to "Withdraw" or "Send"
3. Select SOL as the asset
4. **SELECT SOLANA NETWORK** - This is crucial. Exchanges offer multiple networks. You MUST choose Solana. Sending on the wrong network = lost funds.
5. Paste your Phantom wallet address
6. Double-check the address (at least first and last 4 characters)
7. Confirm the withdrawal
8. Wait a few minutes for funds to arrive

**Warning:** Always send a small test amount first (like $5 worth) to make sure everything works before sending larger amounts.

---

## Method 3: Swap From Another Crypto

If you already hold crypto on another chain (ETH, USDC on Ethereum, etc.), you can bridge it to Solana.

**Options:**
- **Phantom's Crosschain Swapper** - Swap ETH, USDC, or other tokens directly to SOL within Phantom
- **Jupiter Bridge** - At jup.ag, you can bridge assets from Ethereum and other chains

Bridging is more advanced and has its own risks and fees. For beginners, Methods 1 or 2 are recommended.

---

## CEX vs DEX: Know the Difference

**CEX (Centralized Exchange)** - Coinbase, Kraken, Binance
- They hold your crypto for you
- Easy to use, customer support exists
- Requires identity verification
- "Not your keys, not your crypto"

**DEX (Decentralized Exchange)** - Jupiter, Raydium, pump.fun
- You control your own wallet
- No identity verification
- Trade directly from your wallet
- You're responsible for your own security

When you trade memecoins, you'll use DEXs because:
1. Memecoins aren't listed on CEXs (they're too new/risky)
2. DEXs let you trade instantly without asking permission
3. You maintain custody of your funds

---

## How Much SOL Do You Need?

**For learning:** $50-100
- Enough to make several trades
- Small enough that mistakes don't hurt
- Covers gas fees for weeks

**For active trading:** Whatever you can afford to lose
- Seriously - only trade with money you're prepared to lose completely
- Start small, scale up only after proving consistency

**Keep some SOL reserved:**
- Always keep 0.05-0.1 SOL for gas fees
- Running out of SOL means you can't make transactions (including selling)

---

## Common Mistakes to Avoid

**Wrong network selection:** When withdrawing from an exchange, selecting the wrong network (like BSC or Ethereum instead of Solana) sends your funds to the wrong chain. They're not "lost" but recovering them is complicated. Triple-check you're on the Solana network.

**Sending to wrong address:** Crypto transactions are irreversible. If you send to a wrong address, it's gone. Always copy/paste addresses (never type them) and verify before sending.

**Sending all your SOL:** Keep some for gas. If you swap all your SOL for a memecoin, you won't have gas to sell it later.

---

## Quick Checklist

- Understand that you need SOL for both gas fees and trading
- Chose a funding method (direct buy or exchange transfer)
- If using an exchange, understand to select Solana network when withdrawing
- Know to always send a test transaction first
- Have SOL in your Phantom wallet
- Keeping some SOL reserved for gas fees

---

## What's Next

You've got SOL in your wallet. Now let's understand what you're actually trading - what are memecoins and why do people trade them?` },
    { module_slug: 'newcomer', title: 'What Are Memecoins?', slug: 'what-are-memecoins', description: 'Understanding memecoins, market cap, supply, liquidity, and the brutal statistics', reading_time: 5, difficulty: 'beginner', archetype_tags: '[]', order_index: 3, content: `## What You'll Learn
- What makes a memecoin different from other crypto
- Why people trade them (and why they're risky)
- Key concepts: market cap, supply, and liquidity
- The brutal reality of memecoin statistics

---

## Memecoins Explained

A memecoin is a cryptocurrency based on internet culture, jokes, trends, or community vibes rather than technology or utility. They have no product roadmap, no team building anything, no "fundamentals" in the traditional sense.

**Examples you might recognize:**
- Dogecoin (DOGE) - The original, based on the Shiba Inu meme
- Shiba Inu (SHIB) - Dog theme, rode the 2021 meme wave
- BONK - Solana's dog coin, major ecosystem token
- TRUMP - Launched days before the 2025 inauguration, went viral

**What memecoins are NOT:**
- Investments in technology or companies
- Backed by anything tangible
- Predictable or rational
- Safe

---

## Why Do People Trade Memecoins?

**The appeal:**
1. **Massive potential returns** - Early buyers can see 10x, 100x, even 1000x gains
2. **Fast action** - Markets move in minutes, not months
3. **Low barrier to entry** - Anyone can participate with any amount
4. **Cultural relevance** - Trading what's trending on the internet
5. **Community energy** - The "fun" of being part of something viral

**The reality:**
1. **Most memecoins go to zero** - Over 98% of pump.fun tokens fail
2. **It's a zero-sum game** - For every winner, there are losers
3. **Insiders have advantages** - Creators and early wallets often dump on retail
4. **It's gambling** - Pure speculation with no underlying value

This isn't a judgment - it's context. If you're going to play this game, go in with eyes open.

---

## Key Concepts You Must Understand

### Market Cap

**Market Cap = Price × Circulating Supply**

If a token costs $0.001 and there are 1 billion tokens, the market cap is $1 million.

**Why it matters:**
- A $0.001 token isn't "cheap" - market cap tells the real story
- A 10x from $1M market cap means reaching $10M (possible)
- A 10x from $100M market cap means reaching $1B (much harder)

**Typical memecoin market cap ranges:**
- Under $100K - Extremely early, high risk, most die here
- $100K - $1M - "Micro caps," still very risky
- $1M - $10M - Established some traction
- $10M - $100M - Significant community and volume
- $100M+ - Major memecoin, reduced upside from this point

### Supply

Most memecoins launch with a fixed supply (commonly 1 billion tokens). Unlike traditional companies that can issue more shares, the supply is typically locked.

**Watch for:**
- Who holds the supply? (Check top wallets)
- Are tokens concentrated in a few wallets? (Dump risk)
- Is there a mechanism to create more tokens? (Inflation risk - rare in memecoins)

### Liquidity

Liquidity is how easily you can buy or sell without moving the price.

**High liquidity:** Large buys/sells don't affect price much
**Low liquidity:** Even small trades cause big price swings

**Why it matters:**
- Low liquidity = high slippage (you get worse prices)
- Low liquidity = vulnerable to manipulation
- Low liquidity = harder to exit your position

---

## The Pump.fun Era

Before pump.fun, launching a token on Solana required technical knowledge, initial capital for liquidity, and lots of setup. Pump.fun changed everything.

**What pump.fun did:**
- Made token creation free and instant (anyone can do it)
- Provided built-in liquidity via a "bonding curve"
- Created a fair launch system (no pre-sales, no team tokens on curve)
- Made memecoins 10x more accessible... and 100x more abundant

**The result:**
- Thousands of new tokens launch daily
- 99%+ are worthless
- A tiny fraction become tradeable plays
- The game became faster and more competitive

---

## The Statistics You Need to Accept

**According to industry analysis:**
- Less than 2% of pump.fun tokens ever "graduate" to a DEX
- The vast majority of tokens die within hours
- Many are intentional scams (rug pulls, dev dumps)
- Even legitimate tokens mostly fail to gain traction

**What this means for you:**
- Expect to lose on most trades
- Never put in more than you can lose completely
- Small position sizes are your defense
- One winner needs to pay for many losers

---

## What Makes a Memecoin "Work"?

The few that succeed typically have:

1. **Strong narrative** - Ties to current events, trends, or cultural moments
2. **Community energy** - Active discussion on Twitter (CT), Telegram
3. **Meme quality** - Good visuals, shareable content
4. **Timing** - Right place, right time
5. **Clean launch** - No obvious scam signals, fair distribution

Notice what's NOT on this list: technology, utility, partnerships. In memecoins, attention is everything.

---

## Quick Checklist

- Understand memecoins have no underlying value - pure speculation
- Know how to think about market cap vs price
- Recognize that most memecoins fail
- Accept that this is high-risk, high-reward gambling
- Committed to only risking what you can afford to lose

---

## What's Next

You understand what memecoins are and the risks involved. Now let's make your first actual trade using Jupiter, the main DEX aggregator on Solana.` },
    { module_slug: 'newcomer', title: 'Your First Trade on Jupiter', slug: 'first-trade-jupiter', description: 'Connect your wallet, understand slippage, and make your first swap', reading_time: 5, difficulty: 'beginner', archetype_tags: '[]', order_index: 4, content: `## What You'll Learn
- What Jupiter is and why traders use it
- How to connect your wallet and make a swap
- Understanding slippage, routes, and fees
- Making your first real trade

---

## What Is Jupiter?

Jupiter is Solana's leading DEX aggregator. Instead of trading on one exchange, Jupiter scans multiple exchanges (Raydium, Orca, Meteora, and more) to find you the best price.

**Think of it like this:** If you wanted to buy a TV, you could check one store's price, or you could use a price comparison site that checks all stores. Jupiter is the price comparison site for Solana tokens.

**Why use Jupiter:**
- Best prices by aggregating multiple liquidity sources
- Smart routing splits large trades across exchanges
- User-friendly interface
- Handles over 50% of all DEX volume on Solana
- Supports limit orders and DCA (Dollar Cost Averaging)

**Website:** jup.ag

---

## Connecting Your Wallet

1. Go to **jup.ag** (type it directly - never click links from random sources)
2. Click "Connect Wallet" in the top right
3. Select "Phantom"
4. Approve the connection in Phantom

You're now connected. Jupiter can see your token balances but cannot move funds without your approval on each transaction.

---

## Understanding the Swap Interface

Jupiter's interface shows:

**Top field:** What you're swapping FROM (usually SOL)
**Bottom field:** What you're swapping TO (the token you want)

**Route info:** Jupiter shows you which exchanges it's using and why

**Price impact:** How much your trade will move the price (bigger trades = bigger impact)

**Minimum received:** The worst-case amount you'll get after slippage

---

## Slippage: What It Is and How to Set It

**Slippage** is the difference between the price you expect and the price you actually get. It happens because prices change between when you submit a transaction and when it executes.

**Why it matters for memecoins:**
- Volatile tokens move fast
- Low liquidity means bigger price swings
- If price moves beyond your slippage tolerance, the transaction fails

**How to set it:**
1. Click the settings gear icon
2. Set slippage tolerance (default is usually 0.5%)
3. For memecoins, you'll often need 5-15% due to volatility
4. Higher slippage = more likely to succeed, but potentially worse price

**Rule of thumb:**
- Established tokens (SOL, USDC): 0.5-1%
- Active memecoins: 5-10%
- New or volatile tokens: 10-15%

---

## Making Your First Trade

Let's walk through swapping SOL for USDC (a stablecoin) as a safe first trade:

1. **In the "You pay" field:** Select SOL, enter a small amount (like 0.1 SOL)

2. **In the "You receive" field:** Select USDC (search for it if needed)

3. **Review the details:**
   - Check the exchange rate
   - Check the price impact (should be nearly 0% for this pair)
   - Check the route Jupiter is using

4. **Click "Swap"**

5. **Approve in Phantom:**
   - A popup shows transaction details
   - Verify it matches what you expected
   - Click "Approve"

6. **Wait for confirmation:**
   - Transaction processes in seconds
   - Your USDC appears in your wallet

Congratulations - you've made your first on-chain trade.

---

## Buying Your First Memecoin

Now let's do it with a real memecoin:

1. **Find the token address** - You need the exact contract address (also called "mint address" or "CA"). Get this from reliable sources like:
   - DexScreener (dexscreener.com)
   - Birdeye (birdeye.so)
   - The project's official Twitter

   **Never** trust random addresses from DMs or comments.

2. **Paste the address in Jupiter** - In the "You receive" field, paste the token address. Jupiter will find it.

3. **Set appropriate slippage** - For memecoins, start with 10%

4. **Use a small amount** - For your first trade, use 0.05-0.1 SOL maximum

5. **Swap and approve** - Same process as before

**Warning:** If Jupiter shows "route not found" or very high price impact, the token might have low liquidity. This is risky.

---

## After the Trade

Your tokens now appear in your Phantom wallet. If you don't see them:
- Scroll down in your asset list
- Search for the token
- Sometimes takes a few seconds to appear

**To sell later:**
- Return to Jupiter
- Swap the memecoin back to SOL
- Same process, reversed

---

## What You're Actually Paying

**Solana network fees:** Usually < $0.01 per transaction (you pay this in SOL)

**Jupiter platform fee:** 0.1-0.5% depending on the route (built into the quote)

**Price impact:** On low liquidity tokens, you might get a worse price than displayed

**Slippage:** If the price moves against you before execution

For most trades, you'll pay under $0.10 total in fees - one of Solana's big advantages over other chains.

---

## Common First-Trade Mistakes

**Buying the wrong token:** Scammers create fake tokens with similar names. Always verify the contract address, not just the name.

**Setting slippage too low:** Transaction fails repeatedly because price moved. Increase slippage.

**Setting slippage too high:** You might get a bad fill if the token is being manipulated. Start at 10%, adjust as needed.

**Trading all your SOL:** Keep some for gas, or you can't make any more transactions.

---

## Quick Checklist

- Connected wallet to jup.ag
- Made a test swap (SOL to USDC and back is fine)
- Understand slippage and how to set it
- Know how to find token contract addresses
- Keeping SOL reserved for transaction fees

---

## What's Next

You can make trades on Jupiter. But most memecoin action happens on pump.fun, where tokens launch. Let's learn how pump.fun works and how tokens "graduate" to become tradeable on Jupiter.` },
    { module_slug: 'newcomer', title: 'Understanding Pump.fun Basics', slug: 'pumpfun-basics', description: 'How pump.fun works, bonding curves, graduation, and basic safety checks', reading_time: 5, difficulty: 'beginner', archetype_tags: '[]', order_index: 5, content: `## What You'll Learn
- How pump.fun works and why it dominates memecoin launches
- The bonding curve mechanism explained simply
- What "graduation" means and why it matters
- Basic safety checks before buying any token

---

## What Is Pump.fun?

Pump.fun is a memecoin launchpad on Solana that lets anyone create and trade tokens instantly with no coding, no initial capital, and no permission needed.

**Before pump.fun:** Launching a token required:
- Technical knowledge to create the contract
- SOL to seed the liquidity pool
- Setting up on a DEX like Raydium
- Often days of work

**With pump.fun:** Anyone can:
- Create a token in minutes
- Start trading immediately
- No upfront cost beyond tiny gas fees

**The result:** Thousands of tokens launch daily. Most fail. A few become tradeable. This is the new memecoin meta.

---

## The Bonding Curve: How It Works

When a token launches on pump.fun, it doesn't immediately have a liquidity pool like normal tokens. Instead, it uses a **bonding curve** - a mathematical formula that sets the price based on supply.

**How it works in practice:**

1. **Token creates with 1 billion supply**
2. **800 million tokens go on the bonding curve** - These are available for anyone to buy
3. **Price starts near zero** - First buyers get massive amounts of tokens for small SOL
4. **As people buy, price increases** - The curve makes each subsequent purchase more expensive
5. **As people sell, price decreases** - Selling returns SOL and decreases price along the curve

**Simple example:**
- Buyer 1 spends 0.5 SOL, gets 50 million tokens
- Buyer 2 spends 0.5 SOL, gets 40 million tokens (price already higher)
- Buyer 3 spends 0.5 SOL, gets 30 million tokens (price even higher)

Early buyers always have an advantage in both token amount and entry price.

---

## Graduation: The Magic Threshold

When enough people buy and the bonding curve is fully sold (all 800M tokens purchased), the token **graduates**.

**What happens at graduation:**
1. Token reaches approximately $69K market cap threshold
2. Liquidity moves to PumpSwap (pump.fun's own DEX)
3. The remaining 200M tokens become tradeable
4. Normal AMM (automated market maker) trading begins
5. Token becomes accessible on Jupiter and other aggregators

**Before graduation:** Token only tradeable on pump.fun, via bonding curve

**After graduation:** Token tradeable everywhere on Solana DEXs

**Why graduation matters:**
- Most tokens never graduate (under 2% do)
- Graduation means the token attracted enough buyers
- It's a milestone showing real demand
- More liquidity and visibility after graduation

---

## PumpSwap: Where Graduated Tokens Trade

Since March 2025, graduated tokens automatically move to PumpSwap - pump.fun's native DEX - instead of Raydium.

**Key differences:**
- 0.25% trading fee (0.2% to LPs, 0.05% to protocol)
- No migration fee for creators
- Future creator revenue sharing planned
- Works like a standard AMM (similar to Uniswap/Raydium)

After graduation, you can trade on PumpSwap directly or via aggregators like Jupiter.

---

## Basic Safety Checks Before Buying

Before you ape into any token on pump.fun, do these basic checks:

### 1. Check RugCheck (rugcheck.xyz)

Paste the token address into rugcheck.xyz. It analyzes:
- Mint authority (can dev create more tokens?)
- Freeze authority (can dev freeze your wallet?)
- Top holder distribution
- Liquidity status
- Known scam patterns

**Green flags:** Authority revoked, reasonable distribution
**Red flags:** Authorities active, concentrated holdings

### 2. Look at Holder Distribution

On pump.fun or DexScreener, check the top holders:
- Are the top 10 wallets holding 30%+? Risky.
- Do multiple wallets have suspiciously similar amounts? Could be bundled (same person).
- Did many wallets buy in the first few seconds? Possible insider sniping.

### 3. Check the Socials

Click through to any linked Twitter/Telegram:
- Does the Twitter account exist?
- Is it new or established?
- Is there actual community engagement?
- Or just bot comments?

No socials at all is a red flag for anything but pure gambling plays.

### 4. Watch the Buys and Sells

On the pump.fun page, watch the transaction flow:
- Is there organic buying from different wallets?
- Or are the same wallets buying back and forth (wash trading)?
- Are dev/insider wallets selling into every pump?

---

## The Reality of Pump.fun Trading

**Brutal truth:** The majority of pump.fun tokens are:
- Cash grabs by creators who dump immediately
- Copycat tokens with no original concept
- Bot farms washing volume
- Or simply ignored and dead within hours

**The opportunity:** Among thousands of daily launches, a handful gain real traction. Finding those before they graduate is the game.

**The skill:** Learning to distinguish signal from noise, real buying from fake, and actual communities from manufactured ones.

---

## Your First Pump.fun Experience

1. Go to pump.fun
2. Browse the "Trending" or "New" sections
3. Click on tokens to see their pages
4. Look at charts, holder distribution, and transaction flow
5. Run checks on rugcheck.xyz
6. **Don't buy anything yet** - just observe

Watch how fast things move. See how many tokens die. Notice the patterns. This observation is more valuable than any trade right now.

---

## Quick Checklist

- Understand bonding curve mechanics (early = cheaper)
- Know what graduation means and why it matters
- Can run basic safety checks before buying
- Observed pump.fun without trading (recommended first step)
- Accept that most tokens will fail

---

## Module 1 Complete!

You now understand:
- How to set up and secure your wallet
- How to fund your wallet with SOL
- What memecoins are and their risks
- How to trade on Jupiter
- How pump.fun and bonding curves work

**Next Steps:**
- Practice making small trades on Jupiter
- Watch pump.fun to understand the flow
- Move to Module 2: Apprentice to learn research and defense

Welcome to the trenches. Trade small. Learn fast. Protect your capital.` },

    // Module 2: Apprentice (Research & Defense)
    { module_slug: 'apprentice', title: 'Finding Coins Before They Pump', slug: 'finding-coins', description: 'Where to look and what to look for', reading_time: 10, difficulty: 'beginner', archetype_tags: '["NarrativeFrontRunner", "CopyTrader"]', order_index: 1, content: `# Finding Coins Before They Pump\n\nThe money is made in the finding, not the buying.\n\n## Where to Look\n\n### Pump.fun New Tab\n- Refresh constantly during active hours\n- Sort by creation time\n- Watch for interesting names/themes\n\n### Twitter/X\n- Follow memecoin accounts\n- Use search for coin mentions\n- Watch for coordinated posting\n\n### Telegram Groups\n- Alpha groups (quality varies wildly)\n- Be skeptical of "guaranteed" calls\n\n### On-Chain\n- Track smart wallets (covered in lesson 4)\n- Watch for unusual buying patterns\n\n## What Makes a Coin Interesting?\n\n### Good Signs\n- Catchy, relevant name/ticker\n- Clean website (if applicable)\n- Active developer engagement\n- Organic community forming\n- Fresh narrative or trend\n\n### Warning Signs\n- Copycat of existing coin\n- Dev not responding\n- Fake socials/followers\n- Too good to be true promises\n\n## Timing Matters\n\n- Too early: No liquidity, might die\n- Too late: You're exit liquidity\n- Sweet spot: Building momentum, not yet mainstream\n\n## Reality Check\n\nMost coins you find will fail. That's the game. You're looking for the 1 in 20 that works.` },
    { module_slug: 'apprentice', title: 'Spotting Rugs and Scams', slug: 'spotting-scams', description: 'Protect yourself from the most common traps', reading_time: 8, difficulty: 'beginner', archetype_tags: '["LossAverse", "ImpulseTrader"]', order_index: 2, content: `# Spotting Rugs and Scams\n\nNot every coin that dumps is a scam, but many are. Learn to spot them.\n\n## Common Scam Types\n\n### Rug Pull\n- Dev removes liquidity\n- Token becomes unsellable\n- Your investment goes to zero instantly\n\n### Honeypot\n- You can buy but not sell\n- Smart contract blocks sales\n- Complete loss guaranteed\n\n### Slow Rug\n- Dev sells gradually\n- Price bleeds over time\n- Harder to identify\n\n## Red Flags Checklist\n\n### Contract/Tokenomics\n- Dev holds huge % of supply\n- Liquidity not locked/burned\n- Mint function enabled (can create more tokens)\n- Blacklist function (can block your wallet)\n\n### Social Signals\n- No real community, just bots\n- Aggressive shilling\n- Promises of guaranteed gains\n- "Next 100x" marketing\n\n### Developer Behavior\n- Anonymous with no track record\n- Defensive when questioned\n- Pushing urgency ("buy now before moon")\n\n## Protection Tools\n\n- RugCheck.xyz - Analyzes contract safety\n- Birdeye/Dexscreener - Check holder distribution\n- Solscan - View dev wallets and movements\n\n## The Golden Rules\n\n1. If it seems too good to be true, it is\n2. Never invest more than you can lose\n3. Check before you buy, not after\n4. When in doubt, skip it` },
    { module_slug: 'apprentice', title: 'Using Dexscreener Like a Pro', slug: 'dexscreener', description: 'Master the essential research tool', reading_time: 8, difficulty: 'beginner', archetype_tags: '["TechnicalAnalyst", "NarrativeFrontRunner"]', order_index: 3, content: `# Using Dexscreener Like a Pro\n\nDexscreener is your command center. Learn to read it.\n\n## Key Metrics to Check\n\n### Price & Chart\n- Current price and % change\n- Candlestick patterns\n- Support/resistance levels\n\n### Liquidity\n- Total liquidity in pool\n- Higher = safer (harder to manipulate)\n- Below $10k = extremely risky\n\n### Volume\n- 24h trading volume\n- Compare to liquidity (healthy: volume > liquidity)\n- Sudden spikes = something happening\n\n### Market Cap (FDV)\n- Fully diluted valuation\n- Compare to similar coins\n- Lower cap = more room to grow (and fall)\n\n### Holders\n- Number of unique holders\n- Growth rate over time\n- Concentration (top 10 holders %)\n\n## The Holder Tab\n\n- Click "Holders" to see distribution\n- Check if top wallets are selling\n- Look for bundled wallets (same entity)\n- Dev wallet activity\n\n## Transaction Flow\n\n- Watch buy/sell ratio\n- Size of transactions\n- Smart money movements\n\n## Filters and Alerts\n\n- Set up price alerts\n- Filter by chain, liquidity, volume\n- Save coins to watchlist\n\n## Pro Tip\n\nSpend time just watching charts without trading. Pattern recognition takes time to develop.` },
    { module_slug: 'apprentice', title: 'Following Smart Wallets', slug: 'smart-wallets', description: 'Learn from successful traders\' moves', reading_time: 10, difficulty: 'beginner', archetype_tags: '["CopyTrader", "NarrativeFrontRunner"]', order_index: 4, content: `# Following Smart Wallets\n\nSmart money leaves footprints. Learn to track them.\n\n## What is a "Smart Wallet"?\n\nA wallet that consistently:\n- Enters coins early\n- Takes profits effectively  \n- Has strong win rate over time\n\n## How to Find Smart Wallets\n\n### Method 1: Backtrack Winners\n1. Find a coin that pumped\n2. Check early buyers on Solscan\n3. Research those wallets' other trades\n4. Look for consistent winners\n\n### Method 2: Leaderboards\n- Trading terminals show top wallets\n- GMGN, Cielo, Birdeye rankings\n- Verify with your own research\n\n### Method 3: CT Research\n- Some traders share their wallets\n- Verify claims with actual on-chain data\n\n## What to Track\n\n- When they buy (how early?)\n- Position sizes (how confident?)\n- How long they hold\n- Exit strategy (partial or full?)\n\n## Using Tracking Tools\n\n- Set alerts for wallet activity\n- Padre, Axiom, GMGN have copy features\n- Some tools show real-time feeds\n\n## Important Caveats\n\n### Don't Blindly Copy\n- You don't know their strategy\n- They might have information you don't\n- They might be dumping on copiers\n\n### Verify Everything\n- One good trade isn't a pattern\n- Look at 50+ trades minimum\n- Check for consistent edge vs luck\n\n## The Goal\n\nUnderstand WHY smart wallets are buying, not just WHAT. That understanding is your real edge.` },
    { module_slug: 'apprentice', title: 'Tracking Narratives', slug: 'tracking-narratives', description: 'Ride the waves of market attention', reading_time: 8, difficulty: 'beginner', archetype_tags: '["NarrativeFrontRunner", "TechnicalAnalyst"]', order_index: 5, content: `# Tracking Narratives\n\nMemecoins move on stories. Learn to read them.\n\n## What is a Narrative?\n\nA theme or trend that captures market attention:\n- AI coins (GPT hype)\n- Political coins (elections)\n- Animal meta (dogs, cats, frogs)\n- Event-based (conferences, launches)\n\n## Narrative Lifecycle\n\n### 1. Birth\n- New theme emerges\n- Early believers accumulate\n- Low attention\n\n### 2. Recognition\n- CT starts noticing\n- Volume increases\n- More coins in the category launch\n\n### 3. Mainstream\n- Everyone's talking about it\n- Late money pours in\n- Biggest gains for early holders\n\n### 4. Exhaustion (Cooked)\n- "Cooked" narrative = played out\n- Diminishing returns on new entries\n- Rotation to next narrative\n\n## How to Spot Emerging Narratives\n\n- What's trending on CT?\n- Real world events (news, announcements)\n- What are smart wallets clustering into?\n- Cross-reference with Google Trends\n\n## Strategy\n\n### Early Narrative\n- Higher risk, higher reward\n- Position in multiple coins\n- Be patient for recognition\n\n### Mature Narrative\n- Lower risk, lower reward\n- Look for leaders in the category\n- Quicker exits needed\n\n## The Meta Game\n\nThe best traders don't chase narratives—they anticipate them. Always be thinking: "What's next?"` },

    // Module 3: Trader (Strategy & Execution)
    { module_slug: 'trader', title: 'Position Sizing That Protects You', slug: 'position-sizing', description: 'Never risk more than you can afford to lose', reading_time: 8, difficulty: 'intermediate', archetype_tags: '["ImpulseTrader", "FOMO", "LossAverse"]', order_index: 1, content: `# Position Sizing That Protects You\n\nHow much you bet matters more than what you bet on.\n\n## The 1-2% Rule\n\nNever risk more than 1-2% of your portfolio on a single trade.\n\n### Example\n- Portfolio: 10 SOL\n- Max risk per trade: 0.1-0.2 SOL\n- Not the position size—the RISK (what you'd lose if stopped out)\n\n## Sizing by Conviction\n\n### Low Conviction (Lottery)\n- 0.5-1% of portfolio\n- High risk, might go to zero\n- Example: 0.05 SOL on a fresh launch\n\n### Medium Conviction\n- 1-2% of portfolio\n- Solid thesis, manageable risk\n- Example: 0.1-0.2 SOL\n\n### High Conviction\n- 2-5% of portfolio (max)\n- Strong thesis, good risk/reward\n- Example: 0.2-0.5 SOL\n- Never go higher even with conviction\n\n## Why This Works\n\n- 10 losses at 1% = only down 10%\n- One big win can cover many small losses\n- You survive to learn and improve\n\n## Common Mistakes\n\n- Going all-in on "sure things"\n- Sizing up after losses (revenge)\n- Not counting open exposure\n\n## Portfolio Check\n\nBefore any trade ask:\n1. What % of my portfolio is this?\n2. What's my total open exposure?\n3. Can I sleep if this goes to zero?\n\nIf the answers don't feel right, size down.` },
    { module_slug: 'trader', title: 'When to Take Profits', slug: 'taking-profits', description: 'Secure gains before they disappear', reading_time: 8, difficulty: 'intermediate', archetype_tags: '["DiamondHands", "FOMO", "LossAverse"]', order_index: 2, content: `# When to Take Profits\n\nUnrealized gains aren't real. You only make money when you sell.\n\n## The Profit-Taking Framework\n\n### Starter System: Sell in Thirds\n1. Sell 1/3 at 2x (recover initial)\n2. Sell 1/3 at 3-5x (lock profit)\n3. Let 1/3 ride (house money)\n\n### Why This Works\n- You're never wrong\n- Removes emotional decision-making\n- Lets winners run while securing gains\n\n## When to Exit Everything\n\n- Thesis is broken (fundamentals changed)\n- Dev behavior changes (selling, inactive)\n- Narrative is dying\n- Better opportunity elsewhere\n\n## Signs to Take Profit\n\n### Technical\n- Parabolic move (unsustainable)\n- Volume decreasing on new highs\n- Key resistance levels\n\n### Social\n- Everyone talking about it (mainstream)\n- "This is going to $X" confidence everywhere\n- Late money arriving (new wallets buying)\n\n## The Hardest Part\n\n- Watching a coin 10x after you sold\n- Holding through a dump back to entry\n- Both will happen. Accept it.\n\n## Golden Rules\n\n1. No one ever went broke taking profits\n2. Partial profits remove regret\n3. It's okay to be early\n4. Capital returned to play another day\n\n## Pro Tip\n\nSet limit sell orders at your targets BEFORE the pump. Remove yourself from emotional decisions.` },
    { module_slug: 'trader', title: 'Setting Stop Losses', slug: 'stop-losses', description: 'Cut losses before they cut you', reading_time: 7, difficulty: 'intermediate', archetype_tags: '["DiamondHands", "ImpulseTrader", "FOMO"]', order_index: 3, content: `# Setting Stop Losses\n\nThe best traders are experts at losing small.\n\n## Why Stop Losses Matter\n\n- 50% loss needs 100% gain to recover\n- 80% loss needs 400% gain to recover\n- Small losses are recoverable\n- Large losses can end your trading\n\n## Types of Stops\n\n### Percentage-Based\n- Exit if down X% from entry\n- Simple, systematic\n- Example: -20% stop on all trades\n\n### Technical\n- Exit if price breaks key level\n- More nuanced\n- Example: Stop if below previous support\n\n### Time-Based\n- Exit if thesis doesn't play out\n- Prevents bag-holding dead coins\n- Example: Sell if no movement in 24h\n\n## Where to Set Stops\n\n### Too Tight\n- Gets triggered by normal volatility\n- "Stop hunted" constantly\n- Never gives trade room to work\n\n### Too Loose\n- Takes too much damage\n- Defeats the purpose\n- Emotional attachment\n\n### Right Spot\n- Below logical support\n- Where thesis is invalidated\n- Sized so loss is acceptable\n\n## Mental vs Actual Stops\n\n- Mental: You decide when to sell manually\n- Actual: Set an order that executes automatically\n\nMental stops often fail because emotions interfere. Use actual stop orders when possible.\n\n## The Rule\n\nDecide your stop BEFORE entering. If you enter without knowing when you'd exit for a loss, you're gambling.` },
    { module_slug: 'trader', title: 'Reading Volume and Liquidity', slug: 'volume-liquidity', description: 'Understand what the market is really doing', reading_time: 9, difficulty: 'intermediate', archetype_tags: '["TechnicalAnalyst", "Scalper"]', order_index: 4, content: `# Reading Volume and Liquidity\n\nVolume tells you what's real. Liquidity tells you what's possible.\n\n## Volume Basics\n\n### What is Volume?\nThe total amount traded in a period (usually 24h).\n\n### High Volume Signals\n- Interest and attention\n- Easier to enter/exit\n- Price moves are more "real"\n\n### Low Volume Signals\n- Lack of interest\n- Easier to manipulate\n- Risky to enter\n\n## Volume Patterns\n\n### Healthy Uptrend\n- Price up + Volume up = Strong\n- Price up + Volume down = Weakening\n\n### Warning Signs\n- Huge volume spike then silence\n- Volume declining while price rises\n- Sudden volume without price movement\n\n## Liquidity Basics\n\n### What is Liquidity?\nThe depth of the trading pool—how much can be traded without moving price.\n\n### Why Liquidity Matters\n- Low liquidity = high slippage\n- Low liquidity = easy to manipulate\n- Low liquidity = hard to exit\n\n### Liquidity Thresholds\n- Under $10k: Extremely risky\n- $10k-$50k: Risky, small positions only\n- $50k-$200k: Moderate, be careful on size\n- $200k+: Reasonable for most position sizes\n\n## Practical Application\n\n1. Check liquidity BEFORE buying\n2. Size position to liquidity (never more than 2% of pool)\n3. Watch volume for sentiment shifts\n4. Compare volume to market cap for activity level\n\n## The Liquidity Trap\n\nYou can "own" a coin with no one to sell to. Liquidity is your exit. No liquidity = no exit.` },
    { module_slug: 'trader', title: 'Building a Trading Plan', slug: 'trading-plan', description: 'Your personal rulebook for consistent execution', reading_time: 10, difficulty: 'intermediate', archetype_tags: '["ImpulseTrader", "FOMO", "CopyTrader"]', order_index: 5, content: `# Building a Trading Plan\n\nWithout a plan, you're gambling. With a plan, you're trading.\n\n## What is a Trading Plan?\n\nA written document that defines:\n- What you trade\n- When you enter\n- How you size\n- When you exit\n- How you handle losses\n\n## Core Components\n\n### 1. Entry Rules\n- What triggers a buy?\n- What confluence do you need?\n- What disqualifies a trade?\n\n### 2. Position Sizing Rules\n- Standard size per conviction level\n- Maximum portfolio exposure\n- Scaling rules (if any)\n\n### 3. Exit Rules\n- Profit targets (when to sell)\n- Stop loss levels (when to cut)\n- Time stops (when to move on)\n\n### 4. Risk Rules\n- Max loss per trade\n- Max loss per day/week\n- When to stop trading\n\n### 5. Process Rules\n- Daily routine\n- Research requirements\n- Review schedule\n\n## Example Trading Plan\n\n"I trade memecoins on Solana.\nI enter when: [specific criteria]\nI size positions at: 1-2% of portfolio\nI take profit at: 2x, 3x, let rest ride\nI stop out at: -30% or if thesis breaks\nI stop trading when: Down 5% in a day\nI review trades: Every Sunday"\n\n## The Most Important Part\n\n**Write it down.**\n\nA plan in your head changes with your emotions. A written plan holds you accountable.\n\n## Revision\n\nYour plan should evolve. Review monthly:\n- What's working?\n- What's not?\n- What rules do you keep breaking?\n\nUpdate accordingly, but not during trading.` },

    // Module 4: Specialist (Psychology & Edge)
    { module_slug: 'specialist', title: 'Why You Keep Losing', slug: 'why-losing', description: 'Identify and fix your biggest mistakes', reading_time: 9, difficulty: 'advanced', archetype_tags: '["ImpulseTrader", "FOMO", "DiamondHands"]', order_index: 1, content: `# Why You Keep Losing\n\nThe market isn't rigged against you. You're rigging yourself.\n\n## The Brutal Truth\n\n90% of traders lose money. Not because markets are random, but because:\n- They trade without an edge\n- They can't control emotions\n- They make the same mistakes repeatedly\n- They don't track or analyze\n\n## Common Loss Patterns\n\n### The FOMO Loop\n1. Miss a pump\n2. Buy the top\n3. Watch it dump\n4. Sell the bottom\n5. Watch it pump again\n6. Repeat\n\n### The Revenge Spiral\n1. Take a loss\n2. Get emotional\n3. Size up to recover\n4. Take a bigger loss\n5. Spiral continues\n\n### The Diamond Hands Delusion\n1. Buy a coin\n2. It goes down\n3. Refuse to sell (it's not a loss until you sell!)\n4. It goes to zero\n5. Lose everything\n\n## Finding Your Pattern\n\n### Journal Exercise\nFor your last 20 trades, write:\n- Why did I enter?\n- How did I feel?\n- What was the result?\n- What mistake (if any)?\n\nLook for patterns. Most traders have 1-2 mistakes that cause 80% of their losses.\n\n## The Fix\n\n1. Identify your pattern\n2. Create a specific rule against it\n3. Enforce the rule systematically\n4. Track compliance\n5. Review and adjust\n\n## Remember\n\nThe market will teach you the same lesson over and over until you learn it. The tuition is your losses.` },
    { module_slug: 'specialist', title: 'Fighting FOMO (For Real)', slug: 'fighting-fomo', description: 'Practical techniques to control the urge', reading_time: 8, difficulty: 'advanced', archetype_tags: '["FOMO", "ImpulseTrader", "CopyTrader"]', order_index: 2, content: `# Fighting FOMO (For Real)\n\nEveryone knows FOMO is bad. Few can actually control it.\n\n## Why FOMO is So Powerful\n\n- Hardwired survival instinct (don't miss resources)\n- Social proof (everyone's making money!)\n- Loss aversion (losing out feels worse than losing money)\n- Dopamine addiction (the rush of the buy)\n\n## FOMO Triggers\n\n- Green candles (visual)\n- CT hype threads (social)\n- Friends sharing wins (social proof)\n- "Last chance" narratives (urgency)\n- Missing previous pumps (regret)\n\n## Practical Countermeasures\n\n### 1. The 10-Minute Rule\nSee something pumping? Wait 10 minutes before any action. Most FOMO fades.\n\n### 2. Pre-Made Watchlist\nOnly trade coins you've already researched. If it's not on your list, you don't trade it.\n\n### 3. Entry Checklist\nForce yourself to check 5 things before any buy. Slows the impulse.\n\n### 4. Position Size Limits\nIf entering late, automatically cut your normal size by 50-75%.\n\n### 5. Opportunity Journal\nWrite down every FOMO urge and what happened 24h later. You'll see most "misses" don't matter.\n\n## Reframing FOMO\n\n### Old Mindset\n"I need to get in before I miss it!"\n\n### New Mindset\n"If I'm hearing about it now, I'm probably late. What's the next opportunity instead?"\n\n## The Truth About "Missing Out"\n\n- Markets offer new opportunities daily\n- Missing one trade costs $0\n- FOMO-driven bad entries cost real money\n- The best traders miss plenty of pumps\n\nThe game is long. Missing this one is fine.` },
    { module_slug: 'specialist', title: 'Building Your Edge', slug: 'building-edge', description: 'What separates winners from everyone else', reading_time: 10, difficulty: 'advanced', archetype_tags: '["NarrativeFrontRunner", "TechnicalAnalyst", "Scalper"]', order_index: 3, content: `# Building Your Edge\n\nAn edge is what makes you consistently profitable. Without one, you're gambling.\n\n## What is an Edge?\n\nA systematic advantage that gives you better-than-random odds:\n- Information advantage (you know something others don't)\n- Timing advantage (you act faster)\n- Analytical advantage (you see patterns others miss)\n- Emotional advantage (you don't panic sell)\n\n## Types of Edges\n\n### Information Edge\n- Following niche communities\n- Understanding specific narratives deeply\n- Relationships with insiders (careful here)\n\n### Speed Edge\n- Faster tools and execution\n- Monitoring new launches\n- Copy trading smart wallets quickly\n\n### Analytical Edge\n- Better at reading charts/patterns\n- Superior risk management\n- Portfolio optimization\n\n### Psychological Edge\n- Patience to wait for setups\n- Discipline to follow rules\n- Emotional stability in volatility\n\n## Finding Your Edge\n\n### Step 1: Audit Your Wins\nLook at your best trades:\n- What did you do differently?\n- Why did you enter?\n- What gave you conviction?\n\n### Step 2: Identify Patterns\nWhat do your winners have in common? That's a hint at your edge.\n\n### Step 3: Systematize\nTurn the pattern into repeatable rules.\n\n### Step 4: Test\nTrade the system, track results, refine.\n\n## Common Edges in Memecoins\n\n- Early narrative recognition\n- Smart wallet tracking + quick execution\n- Understanding CT meta (what's getting attention)\n- Superior risk management (surviving when others blow up)\n\n## The Truth\n\nMost people trade without any edge. If you can develop even a small, consistent edge and protect it, you're ahead of 90% of traders.` },
    { module_slug: 'specialist', title: 'Trading Your Archetype', slug: 'trading-archetype', description: 'Strategies aligned with your natural style', reading_time: 9, difficulty: 'advanced', archetype_tags: '[]', order_index: 4, content: `# Trading Your Archetype\n\nYour personality determines your optimal strategy. Stop fighting it.\n\n## Why Archetype Matters\n\nYou can't successfully trade against your nature:\n- Scalpers can't hold for weeks\n- Diamond Hands can't take quick profits\n- Analysts can't ignore charts\n- Impulse traders can't wait\n\n## Archetype-Aligned Strategies\n\n### Diamond Hands\n**Play to:** Conviction, patience\n**Strategy:** Find strong fundamentals, hold through volatility\n**Weakness to manage:** Know when to exit, set take-profit orders\n\n### Scalper\n**Play to:** Speed, quick decisions\n**Strategy:** High frequency, small gains, tight stops\n**Weakness to manage:** Overtrading, fees eating profits\n\n### Narrative Front-Runner\n**Play to:** Pattern recognition, research\n**Strategy:** Spot themes early, build positions before mainstream\n**Weakness to manage:** Being too early, patience\n\n### FOMO Trader\n**Play to:** Momentum recognition\n**Strategy:** Ride momentum WITH rules, strict stops\n**Weakness to manage:** Entry discipline, sizing\n\n### Copy Trader\n**Play to:** Research, learning\n**Strategy:** Follow proven wallets, understand their logic\n**Weakness to manage:** Blind following, delayed execution\n\n### Technical Analyst\n**Play to:** Chart reading, patterns\n**Strategy:** Technical setups, defined entries/exits\n**Weakness to manage:** Analysis paralysis, ignoring fundamentals\n\n### Loss Averse\n**Play to:** Capital protection\n**Strategy:** Smaller positions, tighter stops, consistent gains\n**Weakness to manage:** Selling winners too early\n\n### Impulse Trader\n**Play to:** Quick reactions\n**Strategy:** Automated rules, cooling-off periods\n**Weakness to manage:** Everything (needs most structure)\n\n## The Goal\n\nBuild a system that works WITH your tendencies, not against them. Compensate for weaknesses with rules, not willpower.` },
    { module_slug: 'specialist', title: 'Journaling for Growth', slug: 'journaling', description: 'Track your way to improvement', reading_time: 7, difficulty: 'advanced', archetype_tags: '[]', order_index: 5, content: `# Journaling for Growth\n\nThe traders who improve track everything. The rest repeat mistakes.\n\n## Why Journal?\n\n- Identifies patterns you can't see in real-time\n- Creates accountability\n- Enables data-driven improvement\n- Separates emotions from analysis\n\n## What to Track\n\n### Per Trade\n- Entry date/time\n- Token and entry price\n- Position size\n- Thesis (why you entered)\n- Emotional state when entering\n- Exit date/time and price\n- Profit/Loss\n- What you learned\n\n### Weekly Review\n- Total P&L\n- Win rate\n- Best and worst trades\n- Rules followed/broken\n- Emotional patterns\n- Key lessons\n\n### Monthly Review\n- Overall P&L trend\n- What's working\n- What's not\n- Plan adjustments\n- Goals for next month\n\n## Journal Prompts\n\n### Before Trading\n- How am I feeling today?\n- Am I in the right headspace?\n- What's my plan?\n\n### After Each Trade\n- Did I follow my rules?\n- What went well?\n- What could be better?\n\n### Weekly\n- What was my biggest mistake?\n- What was my best decision?\n- What pattern do I see?\n\n## Tools\n\n- Simple spreadsheet\n- Notion or notes app\n- Specialized trading journal\n- Hindsight's built-in journal\n\n## The Compound Effect\n\n1% improvement per week = 67% improvement per year.\n\nJournaling is how you find that 1%. Without it, you're hoping to stumble into success.` },

    // Module 5: Master (Scale & Optimize)
    { module_slug: 'master', title: 'Scaling Winning Positions', slug: 'scaling-positions', description: 'When and how to add to winners', reading_time: 9, difficulty: 'expert', archetype_tags: '["DiamondHands", "NarrativeFrontRunner", "TechnicalAnalyst"]', order_index: 1, content: `# Scaling Winning Positions\n\nThe biggest gains come from adding to winners, not starting big.\n\n## Scaling In: The Concept\n\nInstead of full position at once:\n1. Start with smaller "pilot" position\n2. Add more as thesis proves correct\n3. Build into strength, not weakness\n\n## Why Scale In?\n\n### Reduces Initial Risk\n- Smaller initial commitment\n- Thesis tested before full exposure\n- Less damage if wrong early\n\n### Improves Average Entry\n- If right, you add at higher prices (but with confirmation)\n- If wrong, you lose less\n\n## Scaling Strategies\n\n### The 25-25-50 Method\n1. 25% position on initial entry\n2. 25% more if price holds/confirms\n3. 50% on breakout or key level\n\n### The Breakout Add\n1. Initial position at support\n2. Add full size on confirmed breakout\n3. Tight stop under breakout level\n\n### The Dip Buy Add\n1. Initial position\n2. Add on healthy pullbacks\n3. Stop if structure breaks\n\n## When NOT to Scale In\n\n- Averaging down on losers (adding to weakness)\n- FOMO adding after massive pump\n- When already at max position size\n- When thesis is weakening\n\n## Scaling Out (Taking Profits)\n\nSame concept in reverse:\n1. Partial profit at first target\n2. More at second target\n3. Let remainder ride\n\n## The Key Insight\n\nBe willing to pay higher prices for higher probability.\n\nThe goal isn't the best average price. It's the best risk-adjusted outcome.` },
    { module_slug: 'master', title: 'Multi-Wallet Strategies', slug: 'multi-wallet', description: 'Organize your trading for different purposes', reading_time: 8, difficulty: 'expert', archetype_tags: '["Scalper", "NarrativeFrontRunner", "LossAverse"]', order_index: 2, content: `# Multi-Wallet Strategies\n\nOne wallet isn't enough for serious trading.\n\n## Why Multiple Wallets?\n\n### Organizational\n- Separate purposes, separate wallets\n- Clear P&L tracking per strategy\n- No mixing up position sizes\n\n### Risk Management\n- Limits exposure per strategy\n- If one wallet compromised, others safe\n- Forced budgeting\n\n### Operational\n- Different wallets for different tools\n- Some for tracking, some for stealth\n\n## Common Wallet Structures\n\n### The Three-Wallet System\n\n**1. Vault (Cold)**\n- Long-term holds only\n- Large amounts\n- Hardware wallet ideally\n- Rarely touched\n\n**2. Active Trading**\n- Day-to-day trading\n- Defined budget that gets refilled\n- Quick access needed\n\n**3. Degen/Lottery**\n- High-risk plays only\n- Small, fixed amount\n- Expect to lose it all\n- Refill monthly (if at all)\n\n### The Strategy-Split System\n\n- **Wallet A:** Narrative plays\n- **Wallet B:** Copy trading\n- **Wallet C:** Technical setups\n- Track performance separately\n\n## Operational Security\n\n- Different seed phrases for each\n- Store securely (offline)\n- Don't connect high-value wallets to sketchy sites\n- Use burner wallets for testing\n\n## Tracking Across Wallets\n\n- Use portfolio trackers that support multiple wallets\n- Regular reconciliation\n- Know your total exposure at all times\n\n## Pro Tip\n\nYour "main" wallet should never be your "degen" wallet. The separation prevents catastrophic decisions.` },
    { module_slug: 'master', title: 'Reading the Market Cycle', slug: 'market-cycle', description: 'Know where we are to know what to do', reading_time: 10, difficulty: 'expert', archetype_tags: '["NarrativeFrontRunner", "TechnicalAnalyst", "DiamondHands"]', order_index: 3, content: `# Reading the Market Cycle\n\nDifferent cycle phases require different strategies.\n\n## The Crypto Cycle\n\n### 1. Accumulation (Bear Market Bottom)\n- Sentiment: Despair, "crypto is dead"\n- Volume: Low\n- Prices: Beaten down\n- Strategy: Research and accumulate quietly\n\n### 2. Early Bull\n- Sentiment: Skepticism turning to hope\n- Volume: Increasing\n- Prices: Starting to recover\n- Strategy: Position in quality, start watching for narratives\n\n### 3. Bull Market\n- Sentiment: Optimism, FOMO\n- Volume: High\n- Prices: New highs\n- Strategy: Active trading, ride momentum, take profits\n\n### 4. Euphoria (Top)\n- Sentiment: "This time is different"\n- Volume: Massive\n- Prices: Parabolic\n- Strategy: Heavy profit-taking, extreme caution on new entries\n\n### 5. Distribution/Early Bear\n- Sentiment: Denial, "just a dip"\n- Volume: Declining\n- Prices: Lower highs\n- Strategy: Reduce exposure, tighter stops, capital preservation\n\n### 6. Bear Market\n- Sentiment: Capitulation, fear\n- Volume: Collapsing\n- Prices: Crashing\n- Strategy: Preserve capital, research for next cycle\n\n## Cycle Indicators\n\n### On-Chain\n- Exchange flows\n- Long-term holder behavior\n- Funding rates\n\n### Social\n- Mainstream media coverage\n- Search trends\n- Influencer sentiment\n\n### Technical\n- Moving averages\n- Volume patterns\n- Market structure\n\n## Memecoin-Specific Cycles\n\nMemecoins have their own mini-cycles within the broader cycle:\n- New meta emerges\n- Leaders established\n- Copycats flood in\n- Rotation to next meta\n\n## The Key Skill\n\nAdapt your strategy to the environment. What works in a bull doesn't work in a bear. Be flexible, not dogmatic.` },
    { module_slug: 'master', title: 'Building a Trading System', slug: 'trading-system', description: 'Create a repeatable, testable process', reading_time: 10, difficulty: 'expert', archetype_tags: '[]', order_index: 4, content: `# Building a Trading System\n\nA system is a complete, repeatable process that removes discretion.\n\n## System vs. Strategy\n\n**Strategy:** "I trade momentum breakouts"\n**System:** Exact rules for identifying, entering, sizing, managing, and exiting momentum breakouts\n\n## System Components\n\n### 1. Universe Definition\n- What do you trade?\n- What do you avoid?\n- How do you filter?\n\n### 2. Entry Signals\n- Specific, quantifiable triggers\n- No ambiguity\n- Example: "Buy when price crosses above 20MA with volume 2x average"\n\n### 3. Position Sizing\n- Exact formula based on account/risk\n- Adjustment rules for volatility\n- Maximum exposure limits\n\n### 4. Exit Rules\n- Profit targets (specific levels)\n- Stop losses (specific levels)\n- Time stops (specific duration)\n\n### 5. Portfolio Rules\n- Maximum positions open\n- Correlation limits\n- Rebalancing triggers\n\n## Building Your System\n\n### Step 1: Define Your Edge\nWhat gives you an advantage? Be specific.\n\n### Step 2: Create Rules\nTurn the edge into specific, actionable rules.\n\n### Step 3: Backtest\nWould these rules have worked historically?\n\n### Step 4: Paper Trade\nTest in real-time without real money.\n\n### Step 5: Trade Small\nStart with minimal size to validate.\n\n### Step 6: Scale Up\nOnly after proven, carefully increase size.\n\n### Step 7: Monitor and Adjust\nTrack performance, refine as needed.\n\n## System Metrics to Track\n\n- Win rate\n- Average win vs. average loss\n- Maximum drawdown\n- Profit factor (gross profit / gross loss)\n- Sharpe ratio (returns vs. volatility)\n\n## The Goal\n\nA system you can execute mechanically, removing emotion and inconsistency. The best system is one you'll actually follow.` },
    { module_slug: 'master', title: 'When Not to Trade', slug: 'when-not-trade', description: 'Sometimes the best trade is no trade', reading_time: 7, difficulty: 'expert', archetype_tags: '["ImpulseTrader", "FOMO", "Scalper"]', order_index: 5, content: `# When Not to Trade\n\nThe best traders know when to sit out.\n\n## Market Conditions to Avoid\n\n### Low Liquidity Periods\n- Asian session (for Solana memes)\n- Weekends\n- Major holidays\n- Easier to get trapped\n\n### High Uncertainty Events\n- Major regulatory news\n- Black swan events\n- When volatility is extreme and directionless\n\n### Dead Markets\n- No clear narratives\n- Volume dried up\n- Nothing setting up\n\n## Personal Conditions to Avoid\n\n### Emotional States\n- Tilted from recent losses\n- Overly euphoric from wins\n- Stressed from life events\n- Sleep-deprived\n- Influenced by substances\n\n### Account Conditions\n- Down to max daily loss\n- On a cold streak without understanding why\n- After a big win (overconfidence)\n\n### Mental States\n- Bored (trading for entertainment)\n- Need to make money urgently\n- Trying to "force" opportunities\n\n## The Opportunity Cost Fallacy\n\n"But I might miss something!"\n\n- Markets run 24/7. Opportunities are infinite.\n- The cost of bad trades far exceeds missed trades.\n- Preservation today enables profits tomorrow.\n\n## What to Do Instead\n\n### Research Mode\n- Study charts without trading\n- Read, learn, analyze\n- Build watchlist for better times\n\n### Review Mode\n- Analyze recent trades\n- Update your journal\n- Refine your system\n\n### Rest Mode\n- Step away completely\n- Clear your head\n- Return fresh\n\n## The Discipline of Inaction\n\nTrading nothing takes more discipline than trading. Most traders can't do it.\n\nThe ability to sit on your hands and wait for your pitch is what separates professionals from amateurs. Develop it.` },
  ]

  for (const lesson of lessons) {
    const moduleResult = await getDb().execute({
      sql: `SELECT id FROM academy_modules WHERE slug = ?`,
      args: [lesson.module_slug],
    })

    if (moduleResult.rows.length) {
      await getDb().execute({
        sql: `INSERT INTO academy_lessons (module_id, title, slug, description, reading_time, difficulty, archetype_tags, order_index, content)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          moduleResult.rows[0].id,
          lesson.title,
          lesson.slug,
          lesson.description,
          lesson.reading_time,
          lesson.difficulty,
          lesson.archetype_tags,
          lesson.order_index,
          lesson.content,
        ],
      })
    }
  }

  console.log('[Academy] Content seeded successfully')
}

// Get user's academy onboarding status
export async function getAcademyOnboardingStatus(userId) {
  const result = await getDb().execute({
    sql: `SELECT academy_onboarded, experience_level, trading_goal, placement_score, academy_start_section
          FROM users WHERE id = ?`,
    args: [userId],
  })
  if (!result.rows.length) return null
  const row = result.rows[0]
  return {
    onboarded: Boolean(row.academy_onboarded),
    experienceLevel: row.experience_level,
    tradingGoal: row.trading_goal,
    placementScore: row.placement_score,
    startSection: row.academy_start_section,
  }
}

// Save academy onboarding data
export async function saveAcademyOnboarding(userId, data) {
  const { experienceLevel, tradingGoal, placementScore, startSection } = data
  await getDb().execute({
    sql: `UPDATE users SET
            academy_onboarded = 1,
            experience_level = ?,
            trading_goal = ?,
            placement_score = ?,
            academy_start_section = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
    args: [experienceLevel, tradingGoal, placementScore, startSection, userId],
  })
  return true
}

// ============================================
// Quiz and XP System Functions
// ============================================

// Get or create user XP progress
export async function getUserXpProgress(userId) {
  let result = await getDb().execute({
    sql: `SELECT * FROM user_xp_progress WHERE user_id = ?`,
    args: [userId],
  })

  if (!result.rows.length) {
    // Create new progress record
    await getDb().execute({
      sql: `INSERT INTO user_xp_progress (user_id) VALUES (?)`,
      args: [userId],
    })
    result = await getDb().execute({
      sql: `SELECT * FROM user_xp_progress WHERE user_id = ?`,
      args: [userId],
    })
  }

  return result.rows[0]
}

// Update user XP and check for level up
export async function addUserXp(userId, xpAmount, levelThresholds) {
  const progress = await getUserXpProgress(userId)
  const newTotalXp = progress.total_xp + xpAmount

  // Calculate new level
  let newLevel = 1
  for (const threshold of levelThresholds) {
    if (newTotalXp >= threshold.xpRequired) {
      newLevel = threshold.level
    } else {
      break
    }
  }

  const leveledUp = newLevel > progress.current_level

  await getDb().execute({
    sql: `UPDATE user_xp_progress SET
            total_xp = ?,
            current_level = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?`,
    args: [newTotalXp, newLevel, userId],
  })

  return {
    previousXp: progress.total_xp,
    newTotalXp,
    xpEarned: xpAmount,
    previousLevel: progress.current_level,
    newLevel,
    leveledUp,
  }
}

// Update streak (call on any activity)
export async function updateStreak(userId) {
  const progress = await getUserXpProgress(userId)
  const today = new Date().toISOString().split('T')[0]
  const lastActivity = progress.last_activity_date

  let newStreak = progress.current_streak
  let streakMilestone = null

  if (!lastActivity) {
    // First activity ever
    newStreak = 1
  } else if (lastActivity === today) {
    // Already logged activity today, no change
    return { streak: newStreak, isNewDay: false }
  } else {
    // Check if yesterday
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (lastActivity === yesterdayStr) {
      // Streak continues
      newStreak = progress.current_streak + 1
    } else {
      // Streak broken, start fresh
      newStreak = 1
    }
  }

  const newLongest = Math.max(newStreak, progress.longest_streak)

  // Check for streak milestones
  if (newStreak === 7) streakMilestone = 'STREAK_7_DAY'
  else if (newStreak === 30) streakMilestone = 'STREAK_30_DAY'
  else if (newStreak === 100) streakMilestone = 'STREAK_100_DAY'

  await getDb().execute({
    sql: `UPDATE user_xp_progress SET
            current_streak = ?,
            longest_streak = ?,
            last_activity_date = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?`,
    args: [newStreak, newLongest, today, userId],
  })

  return { streak: newStreak, longestStreak: newLongest, isNewDay: true, streakMilestone }
}

// Record quiz attempt
export async function recordQuizAttempt(userId, quizId, score, totalQuestions, passed, perfect, xpEarned, answers) {
  await getDb().execute({
    sql: `INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, passed, perfect, xp_earned, answers_json)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [userId, quizId, score, totalQuestions, passed ? 1 : 0, perfect ? 1 : 0, xpEarned, JSON.stringify(answers)],
  })
}

// Get or update best quiz score (returns XP to award - only difference if improvement)
export async function updateQuizBestScore(userId, quizId, score, potentialXp) {
  const result = await getDb().execute({
    sql: `SELECT * FROM quiz_best_scores WHERE user_id = ? AND quiz_id = ?`,
    args: [userId, quizId],
  })

  if (!result.rows.length) {
    // First attempt
    await getDb().execute({
      sql: `INSERT INTO quiz_best_scores (user_id, quiz_id, best_score, best_xp_earned, first_passed_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      args: [userId, quizId, score, potentialXp],
    })
    return { xpToAward: potentialXp, isFirstAttempt: true, previousBest: 0 }
  }

  const current = result.rows[0]
  const newAttempts = current.attempts + 1

  if (potentialXp > current.best_xp_earned) {
    // Improved! Award the difference
    const xpDifference = potentialXp - current.best_xp_earned
    await getDb().execute({
      sql: `UPDATE quiz_best_scores SET
              best_score = ?,
              best_xp_earned = ?,
              attempts = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ? AND quiz_id = ?`,
      args: [score, potentialXp, newAttempts, userId, quizId],
    })
    return { xpToAward: xpDifference, isFirstAttempt: false, previousBest: current.best_score, improved: true }
  }

  // No improvement, just increment attempts
  await getDb().execute({
    sql: `UPDATE quiz_best_scores SET attempts = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND quiz_id = ?`,
    args: [newAttempts, userId, quizId],
  })
  return { xpToAward: 0, isFirstAttempt: false, previousBest: current.best_score, improved: false }
}

// Get user's quiz history for a specific quiz
export async function getQuizHistory(userId, quizId) {
  const result = await getDb().execute({
    sql: `SELECT * FROM quiz_attempts WHERE user_id = ? AND quiz_id = ? ORDER BY attempted_at DESC LIMIT 10`,
    args: [userId, quizId],
  })
  return result.rows
}

// Get user's best scores for all quizzes
export async function getAllQuizBestScores(userId) {
  const result = await getDb().execute({
    sql: `SELECT * FROM quiz_best_scores WHERE user_id = ?`,
    args: [userId],
  })
  return result.rows
}

// Award achievement
export async function awardAchievement(userId, achievementId) {
  try {
    await getDb().execute({
      sql: `INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)`,
      args: [userId, achievementId],
    })
    return { awarded: true, isNew: true }
  } catch (e) {
    // Already has achievement
    return { awarded: false, isNew: false }
  }
}

// Get user's achievements
export async function getUserAchievements(userId) {
  const result = await getDb().execute({
    sql: `SELECT * FROM user_achievements WHERE user_id = ?`,
    args: [userId],
  })
  return result.rows
}

// Record module completion
export async function recordModuleCompletion(userId, moduleId, finalTestScore, finalTestXp) {
  try {
    await getDb().execute({
      sql: `INSERT INTO module_completions (user_id, module_id, final_test_score, final_test_xp)
            VALUES (?, ?, ?, ?)`,
      args: [userId, moduleId, finalTestScore, finalTestXp],
    })
    return { completed: true, isNew: true }
  } catch (e) {
    // Already completed
    return { completed: false, isNew: false }
  }
}

// Get user's module completions
export async function getModuleCompletions(userId) {
  const result = await getDb().execute({
    sql: `SELECT * FROM module_completions WHERE user_id = ?`,
    args: [userId],
  })
  return result.rows
}

// Get comprehensive progress for a user (for dashboard display)
export async function getFullUserProgress(userId) {
  const xpProgress = await getUserXpProgress(userId)
  const achievements = await getUserAchievements(userId)
  const quizScores = await getAllQuizBestScores(userId)
  const moduleCompletions = await getModuleCompletions(userId)
  const academyProgress = await getUserAcademyProgress(userId)

  return {
    xp: {
      total: xpProgress.total_xp,
      level: xpProgress.current_level,
      streak: xpProgress.current_streak,
      longestStreak: xpProgress.longest_streak,
      lastActivity: xpProgress.last_activity_date,
    },
    achievements: achievements.map(a => a.achievement_id),
    quizScores: quizScores.reduce((acc, q) => {
      acc[q.quiz_id] = { score: q.best_score, xp: q.best_xp_earned, attempts: q.attempts }
      return acc
    }, {}),
    moduleCompletions: moduleCompletions.map(m => m.module_id),
    lessonProgress: academyProgress,
  }
}

// ==============================================
// LEADERBOARD SYSTEM
// ==============================================

// Get XP leaderboard (top users by XP)
export async function getLeaderboard(limit = 50) {
  const result = await getDb().execute({
    sql: `SELECT
            u.id,
            u.username,
            COALESCE(xp.total_xp, 0) as total_xp,
            COALESCE(xp.current_level, 1) as level,
            COALESCE(xp.current_streak, 0) as streak
          FROM users u
          LEFT JOIN user_xp_progress xp ON u.id = xp.user_id
          WHERE COALESCE(xp.total_xp, 0) > 0
          ORDER BY COALESCE(xp.total_xp, 0) DESC
          LIMIT ?`,
    args: [limit],
  })

  return result.rows.map((row, index) => ({
    rank: index + 1,
    id: row.id,
    username: row.username,
    totalXp: row.total_xp,
    level: row.level,
    streak: row.streak,
  }))
}

// Get user's rank on the leaderboard
export async function getUserRank(userId) {
  // Get user's XP
  const userProgress = await getUserXpProgress(userId)
  const userXp = userProgress.total_xp || 0

  // Count how many users have more XP
  const result = await getDb().execute({
    sql: `SELECT COUNT(*) as higher_count
          FROM user_xp_progress
          WHERE total_xp > ?`,
    args: [userXp],
  })

  const rank = (result.rows[0]?.higher_count || 0) + 1

  // Get total users with any XP
  const totalResult = await getDb().execute(
    `SELECT COUNT(*) as total FROM user_xp_progress WHERE total_xp > 0`
  )
  const totalUsers = totalResult.rows[0]?.total || 0

  return {
    rank,
    totalUsers,
    totalXp: userXp,
    percentile: totalUsers > 0 ? Math.round((1 - (rank - 1) / totalUsers) * 100) : 100,
  }
}

// Sync user's XP from client-side calculation
// This allows client to update server when XP changes
export async function syncUserXp(userId, totalXp, level) {
  const current = await getUserXpProgress(userId)

  // Only update if client XP is higher (prevents manipulation downward)
  if (totalXp > current.total_xp) {
    await getDb().execute({
      sql: `UPDATE user_xp_progress
            SET total_xp = ?, current_level = ?, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?`,
      args: [totalXp, level, userId],
    })
    return { updated: true, previousXp: current.total_xp, newXp: totalXp }
  }

  return { updated: false, currentXp: current.total_xp }
}

// Achievement XP values (must match src/config/xpConfig.js)
const ACHIEVEMENT_XP = {
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

// One-time XP backfill for all users from server-side data
// Calculates XP from quiz_best_scores, module_completions, and user_achievements
export async function backfillXpForAllUsers() {
  console.log('[DB] Starting XP backfill for all users...')

  // Get all users
  const usersResult = await getDb().execute(`SELECT id, username FROM users`)
  const users = usersResult.rows

  let updated = 0
  let skipped = 0

  for (const user of users) {
    const userId = user.id

    // Sum XP from quiz_best_scores
    const quizXpResult = await getDb().execute({
      sql: `SELECT COALESCE(SUM(best_xp_earned), 0) as total FROM quiz_best_scores WHERE user_id = ?`,
      args: [userId],
    })
    const quizXp = quizXpResult.rows[0]?.total || 0

    // Sum XP from module_completions
    const moduleXpResult = await getDb().execute({
      sql: `SELECT COALESCE(SUM(final_test_xp), 0) as total FROM module_completions WHERE user_id = ?`,
      args: [userId],
    })
    const moduleXp = moduleXpResult.rows[0]?.total || 0

    // Sum XP from achievements
    const achievementsResult = await getDb().execute({
      sql: `SELECT achievement_id FROM user_achievements WHERE user_id = ?`,
      args: [userId],
    })
    let achievementXp = 0
    for (const row of achievementsResult.rows) {
      achievementXp += ACHIEVEMENT_XP[row.achievement_id] || 0
    }

    const calculatedXp = quizXp + moduleXp + achievementXp

    if (calculatedXp === 0) {
      skipped++
      continue
    }

    // Get current XP
    const current = await getUserXpProgress(userId)

    // Only update if calculated XP is higher
    if (calculatedXp > current.total_xp) {
      // Calculate level from XP (simplified - matches xpConfig.js)
      const LEVEL_THRESHOLDS = [0, 100, 250, 400, 600, 850, 1100, 1400, 1800, 2300, 3000, 4000, 5500, 7500, 10000]
      let level = 1
      for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (calculatedXp >= LEVEL_THRESHOLDS[i]) {
          level = i + 1
          break
        }
      }

      await getDb().execute({
        sql: `UPDATE user_xp_progress
              SET total_xp = ?, current_level = ?, updated_at = CURRENT_TIMESTAMP
              WHERE user_id = ?`,
        args: [calculatedXp, level, userId],
      })
      console.log(`[DB] Updated ${user.username}: ${current.total_xp} -> ${calculatedXp} XP (quiz: ${quizXp}, module: ${moduleXp}, ach: ${achievementXp})`)
      updated++
    } else {
      skipped++
    }
  }

  console.log(`[DB] XP backfill complete. Updated: ${updated}, Skipped: ${skipped}`)
  return { updated, skipped }
}

// Run the one-time XP backfill if not already done
export async function runOneTimeXpBackfill() {
  // Check if we've already run the backfill using a simple marker in the db
  // We'll check if there's a system_flags table with a backfill_complete flag
  try {
    await getDb().execute(`
      CREATE TABLE IF NOT EXISTS system_flags (
        flag_name TEXT PRIMARY KEY,
        flag_value TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const flagResult = await getDb().execute({
      sql: `SELECT flag_value FROM system_flags WHERE flag_name = ?`,
      args: ['xp_backfill_complete'],
    })

    if (flagResult.rows.length > 0) {
      console.log('[DB] XP backfill already completed, skipping')
      return { alreadyComplete: true }
    }

    // Run the backfill
    const result = await backfillXpForAllUsers()

    // Mark as complete
    await getDb().execute({
      sql: `INSERT INTO system_flags (flag_name, flag_value) VALUES (?, ?)`,
      args: ['xp_backfill_complete', new Date().toISOString()],
    })

    return { ...result, alreadyComplete: false }
  } catch (err) {
    console.error('[DB] Error during XP backfill:', err)
    return { error: err.message }
  }
}

// ==============================================
// CROSS-DEVICE PROGRESS SYNC
// ==============================================

// Save user progress to server (called when progress changes)
export async function saveUserProgress(userId, progressData) {
  const {
    progress = {},
    stats = {},
    placement = {},
    masterExam = {},
    achievements = [],
    streak = {},
    journalXp = {},
    dailyGoalId = 'regular'
  } = progressData

  // Check if user already has a sync record
  const existing = await getDb().execute({
    sql: `SELECT id FROM user_progress_sync WHERE user_id = ?`,
    args: [userId],
  })

  if (existing.rows.length > 0) {
    // Update existing record
    await getDb().execute({
      sql: `UPDATE user_progress_sync SET
            progress_data = ?,
            stats_data = ?,
            placement_data = ?,
            master_exam_data = ?,
            achievements_data = ?,
            streak_data = ?,
            journal_xp_data = ?,
            daily_goal_id = ?,
            updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?`,
      args: [
        JSON.stringify(progress),
        JSON.stringify(stats),
        JSON.stringify(placement),
        JSON.stringify(masterExam),
        JSON.stringify(achievements),
        JSON.stringify(streak),
        JSON.stringify(journalXp),
        dailyGoalId,
        userId
      ],
    })
  } else {
    // Insert new record
    await getDb().execute({
      sql: `INSERT INTO user_progress_sync
            (user_id, progress_data, stats_data, placement_data, master_exam_data, achievements_data, streak_data, journal_xp_data, daily_goal_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        userId,
        JSON.stringify(progress),
        JSON.stringify(stats),
        JSON.stringify(placement),
        JSON.stringify(masterExam),
        JSON.stringify(achievements),
        JSON.stringify(streak),
        JSON.stringify(journalXp),
        dailyGoalId
      ],
    })
  }

  return { success: true, updatedAt: new Date().toISOString() }
}

// Fetch user progress from server (called on page load)
export async function getUserProgress(userId) {
  const result = await getDb().execute({
    sql: `SELECT * FROM user_progress_sync WHERE user_id = ?`,
    args: [userId],
  })

  if (result.rows.length === 0) {
    return null
  }

  const row = result.rows[0]
  return {
    progress: JSON.parse(row.progress_data || '{}'),
    stats: JSON.parse(row.stats_data || '{}'),
    placement: JSON.parse(row.placement_data || '{}'),
    masterExam: JSON.parse(row.master_exam_data || '{}'),
    achievements: JSON.parse(row.achievements_data || '[]'),
    streak: JSON.parse(row.streak_data || '{}'),
    journalXp: JSON.parse(row.journal_xp_data || '{}'),
    dailyGoalId: row.daily_goal_id || 'regular',
    updatedAt: row.updated_at
  }
}

// Delete user and all associated data
export async function deleteUser(userId) {
  // Delete from all tables that reference this user
  // Order matters due to foreign key constraints (delete children first)
  const tablesToDelete = [
    'user_progress_sync',
    'user_xp_progress',
    'user_achievements',
    'quiz_attempts',
    'quiz_best_scores',
    'module_completions',
    'user_academy_progress',
    'trade_journal',  // Fixed: was 'journal_entries'
    'analyses',
    'saved_wallets',
    'chat_messages',  // Added: must delete before chat_conversations (FK constraint)
    'chat_conversations',  // Added
    'daily_message_counts',  // Added
    'user_context_cache',  // Added
    'course_request_votes',  // Added: must delete before course_requests (FK constraint)
    'course_requests',  // Added
    'users'  // Delete user last
  ]

  for (const table of tablesToDelete) {
    try {
      if (table === 'users') {
        await getDb().execute({
          sql: `DELETE FROM ${table} WHERE id = ?`,
          args: [userId],
        })
      } else if (table === 'chat_messages') {
        // chat_messages doesn't have user_id directly - delete via conversation
        await getDb().execute({
          sql: `DELETE FROM chat_messages WHERE conversation_id IN (SELECT id FROM chat_conversations WHERE user_id = ?)`,
          args: [userId],
        })
      } else {
        await getDb().execute({
          sql: `DELETE FROM ${table} WHERE user_id = ?`,
          args: [userId],
        })
      }
    } catch (err) {
      // Only log in development, don't expose in production
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DB] deleteUser: Could not delete from ${table}:`, err.message)
      }
    }
  }

  return { success: true }
}

// ============================================
// Course Request Functions
// ============================================

export async function initCourseRequestsTable() {
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS course_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      topic TEXT NOT NULL,
      reason TEXT,
      experience_level TEXT,
      votes INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `)

  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS course_request_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id INTEGER NOT NULL,
      user_id INTEGER,
      ip_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (request_id) REFERENCES course_requests(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `)

  // Create indexes for faster lookups
  try {
    await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_course_requests_votes ON course_requests(votes DESC)`)
    await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_course_requests_user_id ON course_requests(user_id)`)
    await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_course_requests_created_at ON course_requests(created_at DESC)`)
    await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_course_request_votes_request ON course_request_votes(request_id)`)
    await getDb().execute(`CREATE INDEX IF NOT EXISTS idx_course_request_votes_user_id ON course_request_votes(user_id)`)
  } catch (e) { /* Index might already exist */ }
}

export async function createCourseRequest(userId, topic, reason, experienceLevel) {
  // Check if similar topic already exists
  const existing = await getDb().execute({
    sql: `SELECT id, votes FROM course_requests WHERE LOWER(topic) = LOWER(?) LIMIT 1`,
    args: [topic.trim()]
  })

  if (existing.rows.length > 0) {
    // Topic exists - just upvote it instead
    const requestId = existing.rows[0].id
    await getDb().execute({
      sql: `UPDATE course_requests SET votes = votes + 1 WHERE id = ?`,
      args: [requestId]
    })
    return { id: requestId, merged: true, votes: existing.rows[0].votes + 1 }
  }

  // Create new request
  const result = await getDb().execute({
    sql: `INSERT INTO course_requests (user_id, topic, reason, experience_level) VALUES (?, ?, ?, ?)`,
    args: [userId || null, topic.trim(), reason || null, experienceLevel || null]
  })

  return { id: Number(result.lastInsertRowid), merged: false, votes: 1 }
}

export async function getTopCourseRequests(limit = 10) {
  const result = await getDb().execute({
    sql: `SELECT id, topic, votes, created_at FROM course_requests ORDER BY votes DESC, created_at DESC LIMIT ?`,
    args: [limit]
  })

  return result.rows.map(row => ({
    id: Number(row.id),
    topic: row.topic,
    votes: Number(row.votes),
    createdAt: row.created_at
  }))
}

export async function getAllCourseRequests() {
  const result = await getDb().execute({
    sql: `SELECT id, topic, reason, experience_level, votes, created_at FROM course_requests ORDER BY votes DESC, created_at DESC`,
    args: []
  })

  return result.rows.map(row => ({
    id: Number(row.id),
    topic: row.topic,
    reason: row.reason,
    experience_level: row.experience_level,
    votes: Number(row.votes),
    created_at: row.created_at
  }))
}

export async function voteCourseRequest(requestId, userId, ipHash) {
  // Check if already voted (by user or IP)
  const existingVote = await getDb().execute({
    sql: `SELECT id FROM course_request_votes WHERE request_id = ? AND (user_id = ? OR ip_hash = ?) LIMIT 1`,
    args: [requestId, userId || null, ipHash || null]
  })

  if (existingVote.rows.length > 0) {
    return { success: false, error: 'already_voted' }
  }

  // Record vote
  await getDb().execute({
    sql: `INSERT INTO course_request_votes (request_id, user_id, ip_hash) VALUES (?, ?, ?)`,
    args: [requestId, userId || null, ipHash || null]
  })

  // Increment vote count
  await getDb().execute({
    sql: `UPDATE course_requests SET votes = votes + 1 WHERE id = ?`,
    args: [requestId]
  })

  // Get updated vote count
  const updated = await getDb().execute({
    sql: `SELECT votes FROM course_requests WHERE id = ?`,
    args: [requestId]
  })

  return { success: true, votes: Number(updated.rows[0]?.votes || 0) }
}

// ============================================
// AI COACH HELPER FUNCTIONS
// ============================================

// Generate unique ID for chat entities
function generateChatId() {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Create a new conversation
export async function createConversation(userId, title = null) {
  const id = generateChatId()
  await getDb().execute({
    sql: `INSERT INTO chat_conversations (id, user_id, title) VALUES (?, ?, ?)`,
    args: [id, userId, title]
  })
  return id
}

// Save a message to a conversation
export async function saveMessage(conversationId, role, content, tokenCount = null) {
  const id = generateChatId()
  await getDb().execute({
    sql: `INSERT INTO chat_messages (id, conversation_id, role, content, token_count) VALUES (?, ?, ?, ?, ?)`,
    args: [id, conversationId, role, content, tokenCount]
  })

  // Update conversation metadata
  await getDb().execute({
    sql: `UPDATE chat_conversations SET message_count = message_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [conversationId]
  })

  return id
}

// Get messages for a conversation (with optional user verification for defense-in-depth)
export async function getConversationHistory(conversationId, userId = null, limit = 50) {
  // If userId provided, verify conversation belongs to user
  if (userId) {
    const convCheck = await getDb().execute({
      sql: `SELECT id FROM chat_conversations WHERE id = ? AND user_id = ?`,
      args: [conversationId, userId]
    })
    if (convCheck.rows.length === 0) {
      return [] // Conversation doesn't exist or doesn't belong to user
    }
  }

  const result = await getDb().execute({
    sql: `SELECT id, role, content, token_count, created_at FROM chat_messages
          WHERE conversation_id = ? ORDER BY created_at ASC LIMIT ?`,
    args: [conversationId, limit]
  })

  return result.rows.map(row => ({
    id: row.id,
    role: row.role,
    content: row.content,
    tokenCount: row.token_count ? Number(row.token_count) : null,
    createdAt: row.created_at
  }))
}

// Get all conversations for a user
export async function getUserConversations(userId, includeArchived = false) {
  const result = await getDb().execute({
    sql: `SELECT id, title, message_count, is_archived, created_at, updated_at FROM chat_conversations
          WHERE user_id = ? ${includeArchived ? '' : 'AND is_archived = 0'}
          ORDER BY updated_at DESC`,
    args: [userId]
  })

  return result.rows.map(row => ({
    id: row.id,
    title: row.title,
    messageCount: Number(row.message_count),
    isArchived: Boolean(row.is_archived),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }))
}

// Get single conversation
export async function getConversation(conversationId, userId) {
  const result = await getDb().execute({
    sql: `SELECT id, user_id, title, message_count, is_archived, created_at, updated_at
          FROM chat_conversations WHERE id = ? AND user_id = ?`,
    args: [conversationId, userId]
  })

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  return {
    id: row.id,
    userId: Number(row.user_id),
    title: row.title,
    messageCount: Number(row.message_count),
    isArchived: Boolean(row.is_archived),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

// Update conversation title
export async function updateConversationTitle(conversationId, userId, title) {
  await getDb().execute({
    sql: `UPDATE chat_conversations SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
    args: [title, conversationId, userId]
  })
}

// Archive a conversation
export async function archiveConversation(conversationId, userId) {
  await getDb().execute({
    sql: `UPDATE chat_conversations SET is_archived = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
    args: [conversationId, userId]
  })
}

// Delete a conversation and its messages
export async function deleteConversation(conversationId, userId) {
  // Messages are deleted via CASCADE
  await getDb().execute({
    sql: `DELETE FROM chat_conversations WHERE id = ? AND user_id = ?`,
    args: [conversationId, userId]
  })
}

// Get today's date string in YYYY-MM-DD format
function getTodayDateString() {
  return new Date().toISOString().split('T')[0]
}

// Check daily message limit for free tier
export async function getDailyMessageCount(userId) {
  const today = getTodayDateString()
  const result = await getDb().execute({
    sql: `SELECT message_count FROM daily_message_counts WHERE user_id = ? AND date = ?`,
    args: [userId, today]
  })

  return result.rows.length > 0 ? Number(result.rows[0].message_count) : 0
}

// Increment daily message count
export async function incrementDailyMessageCount(userId) {
  const today = getTodayDateString()
  const id = `daily_${userId}_${today}`

  // Upsert: insert or update
  await getDb().execute({
    sql: `INSERT INTO daily_message_counts (id, user_id, date, message_count)
          VALUES (?, ?, ?, 1)
          ON CONFLICT(user_id, date) DO UPDATE SET message_count = message_count + 1`,
    args: [id, userId, today]
  })
}

// Get cached user context
export async function getCachedUserContext(userId) {
  const result = await getDb().execute({
    sql: `SELECT context_json, expires_at FROM user_context_cache WHERE user_id = ?`,
    args: [userId]
  })

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  const expiresAt = new Date(row.expires_at)

  // Check if expired
  if (expiresAt < new Date()) {
    // Delete expired cache
    await getDb().execute({
      sql: `DELETE FROM user_context_cache WHERE user_id = ?`,
      args: [userId]
    })
    return null
  }

  try {
    return JSON.parse(row.context_json)
  } catch (e) {
    console.error('[DB] Failed to parse cached context:', e)
    return null
  }
}

// Set cached user context (1 hour expiry)
export async function setCachedUserContext(userId, contextData, expiryMinutes = 60) {
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString()
  const contextJson = JSON.stringify(contextData)

  await getDb().execute({
    sql: `INSERT INTO user_context_cache (user_id, context_json, generated_at, expires_at)
          VALUES (?, ?, CURRENT_TIMESTAMP, ?)
          ON CONFLICT(user_id) DO UPDATE SET context_json = ?, generated_at = CURRENT_TIMESTAMP, expires_at = ?`,
    args: [userId, contextJson, expiresAt, contextJson, expiresAt]
  })
}

// Clear user context cache
export async function clearUserContextCache(userId) {
  await getDb().execute({
    sql: `DELETE FROM user_context_cache WHERE user_id = ?`,
    args: [userId]
  })
}

export default getDb
