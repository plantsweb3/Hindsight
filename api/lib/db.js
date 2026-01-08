import { createClient } from '@libsql/client'

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
  const result = await getDb().execute({
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
  // Get mood distribution
  const moodResult = await getDb().execute({
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
  const researchResult = await getDb().execute({
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
  const result = await getDb().execute({
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
  const result = await getDb().execute({
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

// Get recommended lessons based on user's archetype
export async function getRecommendedLessons(archetype, userId = null, limit = 5) {
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
      CASE WHEN l.archetype_tags LIKE ? THEN 0 ELSE 1 END,
      m.order_index ASC,
      l.order_index ASC
    LIMIT ?
  `
  const args = userId
    ? [userId, `%"${archetype}"%`, limit]
    : [`%"${archetype}"%`, limit]

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

  return {
    totalLessons: Number(totalResult.rows[0]?.total || 0),
    completedLessons: Number(completedResult.rows[0]?.completed || 0),
    moduleProgress: moduleProgress.rows,
    recentlyCompleted: recentResult.rows,
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
    { module_slug: 'newcomer', title: 'Setting Up Your Solana Wallet', slug: 'wallet-setup', description: 'Create and secure your first Solana wallet', reading_time: 6, difficulty: 'beginner', archetype_tags: '[]', order_index: 1, content: `# Setting Up Your Solana Wallet\n\nYour wallet is your gateway to trading on Solana. Let's set it up properly.\n\n## Recommended Wallets\n\n### Phantom (Most Popular)\n1. Go to phantom.app\n2. Download the browser extension\n3. Create a new wallet\n4. **WRITE DOWN YOUR SEED PHRASE** on paper (never digitally!)\n\n### Solflare (Alternative)\nSimilar process, good mobile experience.\n\n## Security Essentials\n\n### Your Seed Phrase\n- 12-24 words that control your wallet\n- If someone gets these, they own your funds\n- Never share with anyone, ever\n- Never type into websites\n- Store offline in multiple secure locations\n\n### Good Habits\n- Use a hardware wallet for large amounts\n- Create separate wallets for different purposes\n- Never connect to sketchy websites\n\n## Pro Tip\nConsider having a "hot wallet" with small amounts for active trading, and a "cold wallet" for storing bigger bags.` },
    { module_slug: 'newcomer', title: 'Funding Your Wallet', slug: 'funding-wallet', description: 'Get SOL into your wallet to start trading', reading_time: 5, difficulty: 'beginner', archetype_tags: '[]', order_index: 2, content: `# Funding Your Wallet\n\nYou need SOL to trade memecoins. Here's how to get it.\n\n## Methods to Get SOL\n\n### From a Centralized Exchange\n1. Buy SOL on Coinbase, Kraken, or Binance\n2. Go to withdraw\n3. Paste your Phantom wallet address\n4. Select Solana network (NOT Ethereum!)\n5. Confirm and wait ~1 minute\n\n### Using a Fiat Onramp\n- Moonpay or Ramp (built into Phantom)\n- Higher fees but convenient\n\n### Bridge from Other Chains\n- Use bridges like Wormhole or Portal\n- More complex, for advanced users\n\n## Important Notes\n\n- Always send a small test amount first\n- Double-check the wallet address\n- Keep some SOL for transaction fees (~0.1 SOL minimum)\n- Transactions are fast but allow a minute\n\n## How Much to Start?\n\nStart with an amount you can afford to lose completely. This is learning money. Many start with 0.5-2 SOL.` },
    { module_slug: 'newcomer', title: 'Making Your First Trade on Pump.fun', slug: 'first-trade', description: 'Buy your first memecoin step by step', reading_time: 8, difficulty: 'beginner', archetype_tags: '[]', order_index: 3, content: `# Making Your First Trade on Pump.fun\n\nTime to make your first trade. Don't worry—we'll go slow.\n\n## What is Pump.fun?\n\nPump.fun is where most new memecoins launch on Solana. It uses a "bonding curve" that increases price as more people buy.\n\n## Step by Step\n\n### 1. Connect Your Wallet\n- Go to pump.fun\n- Click "Connect Wallet"\n- Select Phantom and approve\n\n### 2. Find a Coin\n- Browse the homepage for new launches\n- Look at the bonding curve progress\n- Check the token name and description\n\n### 3. Buy\n- Enter SOL amount (start SMALL: 0.05-0.1 SOL)\n- Click Buy\n- Approve the transaction in Phantom\n- Wait for confirmation\n\n### 4. Check Your Holdings\n- Your tokens appear in your wallet\n- Refresh if needed\n\n## Your First Trade Rules\n\n- Use a tiny amount (0.05 SOL max)\n- This is practice, not profit-seeking\n- Expect to lose it—that's fine\n- The goal is to learn the mechanics\n\n## What to Expect\n\nMost coins go to zero. That's normal. Your first trade is about learning the process, not making money.` },
    { module_slug: 'newcomer', title: 'Understanding Fees and Slippage', slug: 'fees-slippage', description: 'Know what you\'re paying and why', reading_time: 6, difficulty: 'beginner', archetype_tags: '[]', order_index: 4, content: `# Understanding Fees and Slippage\n\nHidden costs can eat your profits. Know what you're paying.\n\n## Transaction Fees on Solana\n\n- Base fee: ~0.000005 SOL (tiny)\n- Priority fees: 0.001-0.01 SOL during congestion\n- Total: Usually less than $0.01\n\nSolana is cheap, but fees add up if you're trading frequently.\n\n## Slippage: The Hidden Cost\n\n### What is Slippage?\nThe difference between expected price and actual price.\n\n### Why Does It Happen?\n- Low liquidity (small pools)\n- High volatility (fast price moves)\n- Large order relative to pool size\n\n### Example\n- You expect to buy at $0.001\n- You actually buy at $0.00105\n- That's 5% slippage (lost money)\n\n## Slippage Settings\n\n- Default: 1-2% for liquid tokens\n- For memecoins: Often need 5-15%\n- Too low: Transaction fails\n- Too high: You overpay\n\n## Pro Tips\n\n- Check liquidity before buying\n- Smaller trades = less slippage\n- Split large buys into multiple transactions\n- Fast-moving coins need higher slippage\n\n## The Real Cost\n\nA 10% slippage on buy + 10% on sell = 20% loss before the coin even moves. Factor this into your decisions.` },
    { module_slug: 'newcomer', title: 'Reading Your Wallet Activity', slug: 'wallet-activity', description: 'Track your trades and understand what happened', reading_time: 5, difficulty: 'beginner', archetype_tags: '[]', order_index: 5, content: `# Reading Your Wallet Activity\n\nUnderstanding your transaction history is crucial for learning.\n\n## Viewing Activity in Phantom\n\n1. Click on your wallet\n2. Scroll down to see recent transactions\n3. Click any transaction for details\n\n## Understanding Transactions\n\n### Swap/Trade\n- Shows what you sent and received\n- Includes fees paid\n- Links to blockchain explorer\n\n### Failed Transactions\n- Still cost fees (sorry)\n- Usually slippage or network issues\n- Increase slippage and retry\n\n## Using Solscan\n\nFor detailed history:\n1. Go to solscan.io\n2. Search your wallet address\n3. See all transactions with exact details\n\n## Key Things to Track\n\n- Entry price (what you paid per token)\n- Amount of tokens received\n- Fees paid\n- Current value vs purchase price\n\n## Building Good Habits\n\n- Check every trade after it completes\n- Note any unexpected slippage\n- Track wins and losses manually at first\n- Learn to read the blockchain explorer\n\n## Why This Matters\n\nMany traders have no idea if they're profitable. Without tracking, you're flying blind. Start tracking from day one.` },

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

export default getDb
