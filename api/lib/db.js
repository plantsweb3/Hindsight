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
      description TEXT,
      icon TEXT,
      order_index INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

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

// Seed academy content (run once)
export async function seedAcademyContent() {
  // Check if already seeded
  const existing = await getDb().execute({ sql: `SELECT COUNT(*) as count FROM academy_modules`, args: [] })
  if (existing.rows[0].count > 0) {
    console.log('[Academy] Content already seeded')
    return
  }

  const modules = [
    { title: 'Trading Foundations', slug: 'trading-foundations', description: 'Master the fundamentals every successful trader needs', icon: '📚', order_index: 1 },
    { title: 'Position Sizing & Risk', slug: 'position-sizing', description: 'Protect your capital and size your trades intelligently', icon: '📊', order_index: 2 },
    { title: 'Entry & Exit Strategies', slug: 'entry-exit', description: 'Know when to enter, when to exit, and why', icon: '🎯', order_index: 3 },
    { title: 'Trading Psychology', slug: 'psychology', description: 'Master your emotions and build mental discipline', icon: '🧠', order_index: 4 },
    { title: 'Archetype Mastery', slug: 'archetype-mastery', description: 'Leverage your trading personality strengths', icon: '🎭', order_index: 5 },
  ]

  for (const mod of modules) {
    await getDb().execute({
      sql: `INSERT INTO academy_modules (title, slug, description, icon, order_index) VALUES (?, ?, ?, ?, ?)`,
      args: [mod.title, mod.slug, mod.description, mod.icon, mod.order_index],
    })
  }

  const lessons = [
    // Module 1: Trading Foundations
    { module_slug: 'trading-foundations', title: 'Understanding Market Cycles', slug: 'market-cycles', description: 'Learn to identify where we are in the market cycle', reading_time: 8, difficulty: 'beginner', archetype_tags: '["NarrativeFrontRunner", "TechnicalAnalyst"]', order_index: 1, content: `# Understanding Market Cycles\n\nMarkets move in predictable phases. Learning to identify these cycles is crucial for timing your entries and exits.\n\n## The Four Phases\n\n### 1. Accumulation\nSmart money quietly buys while prices are low and sentiment is negative.\n\n### 2. Markup\nPrices begin rising as more buyers enter. This is where most profits are made.\n\n### 3. Distribution\nSmart money sells to latecomers. Volume is high but price gains slow.\n\n### 4. Markdown\nPrices decline as selling pressure overwhelms buying.\n\n## Key Takeaway\nUnderstanding where we are in the cycle helps you avoid buying tops and selling bottoms.` },
    { module_slug: 'trading-foundations', title: 'Building Your Trading Plan', slug: 'trading-plan', description: 'Create a structured approach to your trades', reading_time: 10, difficulty: 'beginner', archetype_tags: '["ImpulseTrader", "FOMO"]', order_index: 2, content: `# Building Your Trading Plan\n\nEvery successful trader has a plan. Without one, you're gambling.\n\n## Essential Components\n\n### Entry Criteria\n- What signals trigger a buy?\n- What confluence do you need?\n\n### Position Sizing\n- How much of your portfolio per trade?\n- Based on conviction or fixed %?\n\n### Exit Strategy\n- Take profit targets\n- Stop loss levels\n- Time-based exits\n\n### Risk Management\n- Max daily/weekly loss\n- Correlation limits\n\n## The Golden Rule\nWrite it down BEFORE you trade. If you can't articulate why you're entering, don't enter.` },
    { module_slug: 'trading-foundations', title: 'Reading Token Fundamentals', slug: 'token-fundamentals', description: 'Evaluate projects beyond the hype', reading_time: 12, difficulty: 'intermediate', archetype_tags: '["CopyTrader", "DiamondHands"]', order_index: 3, content: `# Reading Token Fundamentals\n\nBefore you ape into any token, you need to do your homework.\n\n## Key Metrics to Evaluate\n\n### Tokenomics\n- Total supply vs circulating supply\n- Vesting schedules\n- Token utility\n\n### Team & Development\n- Doxxed team or anonymous?\n- GitHub activity\n- Roadmap progress\n\n### Community\n- Organic growth vs bought followers\n- Quality of discussions\n- Holder distribution\n\n### Liquidity\n- Pool depth\n- LP lock status\n- Volume trends\n\n## Red Flags\n- Unlocked team tokens\n- Copy-paste code\n- Promises without delivery` },

    // Module 2: Position Sizing & Risk
    { module_slug: 'position-sizing', title: 'Stop Loss Fundamentals', slug: 'stop-loss-basics', description: 'The art of knowing when to cut losses', reading_time: 7, difficulty: 'beginner', archetype_tags: '["DiamondHands", "ImpulseTrader"]', order_index: 1, content: `# Stop Loss Fundamentals\n\nThe most important rule in trading: protect your capital.\n\n## Why Stop Losses Matter\n\nA 50% loss requires a 100% gain just to break even. Small losses are recoverable; large losses can end your trading career.\n\n## Types of Stop Losses\n\n### Percentage-Based\nExit if price drops X% from entry.\n\n### Technical\nExit if price breaks below key support.\n\n### Time-Based\nExit if thesis doesn't play out within timeframe.\n\n## Common Mistakes\n- Moving stops lower (hoping)\n- No stop at all (diamond handing into zero)\n- Stops too tight (getting shaken out)\n\n## The Rule\nDecide your stop BEFORE entering. If you can't stomach the loss at that level, reduce position size.` },
    { module_slug: 'position-sizing', title: 'Position Sizing Formulas', slug: 'position-sizing-formulas', description: 'Never risk more than you can afford to lose', reading_time: 9, difficulty: 'intermediate', archetype_tags: '["LossAverse", "Scalper"]', order_index: 2, content: `# Position Sizing Formulas\n\nThe 1% rule and beyond.\n\n## The 1% Rule\n\nNever risk more than 1% of your portfolio on a single trade.\n\n**Example:**\n- Portfolio: 10 SOL\n- Max risk per trade: 0.1 SOL\n- If stop loss is 20%: Position size = 0.5 SOL\n\n## Kelly Criterion\n\nFor more advanced sizing based on win rate:\n\n\`\`\`\nKelly % = W - [(1-W)/R]\nW = Win rate\nR = Win/Loss ratio\n\`\`\`\n\n## Conviction-Based Sizing\n\n- Low conviction: 0.5% risk\n- Medium conviction: 1% risk\n- High conviction: 2% risk (max)\n\n## Never Forget\nPosition sizing is how you stay in the game long enough to win.` },
    { module_slug: 'position-sizing', title: 'Managing Multiple Positions', slug: 'multiple-positions', description: 'Diversification in a memecoin portfolio', reading_time: 8, difficulty: 'intermediate', archetype_tags: '["DiamondHands", "NarrativeFrontRunner"]', order_index: 3, content: `# Managing Multiple Positions\n\nNot all eggs in one basket.\n\n## Portfolio Allocation\n\n### Core Holdings (40-60%)\nHigher conviction, longer timeframe plays.\n\n### Swing Trades (20-30%)\nMedium-term opportunities.\n\n### Lottery Tickets (10-20%)\nHigh risk/reward moonshots.\n\n## Correlation Risk\n\nHolding 10 memecoins isn't diversification if they all dump together when BTC drops.\n\n## Rebalancing\n\n- Take profits from winners\n- Cut losers that break thesis\n- Maintain allocation targets\n\n## Pro Tip\nTrack all positions in a journal. Know your total exposure at all times.` },

    // Module 3: Entry & Exit Strategies
    { module_slug: 'entry-exit', title: 'Identifying Entry Points', slug: 'entry-points', description: 'When to pull the trigger', reading_time: 10, difficulty: 'beginner', archetype_tags: '["FOMO", "CopyTrader", "TechnicalAnalyst"]', order_index: 1, content: `# Identifying Entry Points\n\nTiming is everything in trading.\n\n## Entry Triggers\n\n### Technical Signals\n- Breakout above resistance\n- Bounce from support\n- Volume confirmation\n\n### Fundamental Catalysts\n- Partnership announcements\n- Product launches\n- Listing news\n\n### Social Signals\n- Influencer mentions\n- Trending on social platforms\n- Community growth spikes\n\n## The Checklist Method\n\nBefore entering, confirm:\n1. ✅ Clear thesis\n2. ✅ Entry trigger hit\n3. ✅ Stop loss defined\n4. ✅ Target defined\n5. ✅ Position size calculated\n\n## Patience Pays\nMissed entries are better than bad entries. The market always offers new opportunities.` },
    { module_slug: 'entry-exit', title: 'Taking Profits Like a Pro', slug: 'taking-profits', description: 'Scaling out and locking in gains', reading_time: 8, difficulty: 'intermediate', archetype_tags: '["LossAverse", "Scalper", "DiamondHands"]', order_index: 2, content: `# Taking Profits Like a Pro\n\nYou only realize gains when you sell.\n\n## Scaling Out Strategy\n\n### The 3-3-3 Method\n- Sell 1/3 at 2x (recover initial)\n- Sell 1/3 at 5x (lock profit)\n- Let 1/3 ride (house money)\n\n## Setting Targets\n\n### Technical Targets\n- Previous highs\n- Fibonacci extensions\n- Round numbers\n\n### Market Cap Targets\n- Compare to similar projects\n- Set realistic expectations\n\n## Common Mistakes\n\n- Selling everything too early\n- Never selling (greed)\n- Moving targets higher during pumps\n\n## Remember\nNo one ever went broke taking profits. Partial profit-taking lets you win both ways.` },
    { module_slug: 'entry-exit', title: 'Reading Volume and Momentum', slug: 'volume-momentum', description: 'Understanding what price action is telling you', reading_time: 12, difficulty: 'advanced', archetype_tags: '["TechnicalAnalyst", "Scalper"]', order_index: 3, content: `# Reading Volume and Momentum\n\nVolume precedes price.\n\n## Volume Analysis\n\n### Healthy Uptrend\n- Price up, volume up = continuation\n- Price up, volume down = weakening\n\n### Distribution Signs\n- High volume, no price progress\n- Selling into strength\n\n## Momentum Indicators\n\n### RSI (Relative Strength Index)\n- Above 70: overbought (potential reversal)\n- Below 30: oversold (potential bounce)\n\n### Volume Profile\n- High volume nodes = support/resistance\n- Low volume areas = quick moves through\n\n## Practical Application\n\n1. Confirm breakouts with volume\n2. Watch for divergences\n3. Don't fight strong momentum\n\n## Advanced Tip\nWatch the order book depth and trade history for real-time sentiment.` },
    { module_slug: 'entry-exit', title: 'Avoiding Fakeouts', slug: 'avoiding-fakeouts', description: 'Spotting traps before you fall in', reading_time: 7, difficulty: 'intermediate', archetype_tags: '["FOMO", "ImpulseTrader"]', order_index: 4, content: `# Avoiding Fakeouts\n\nNot every breakout is real.\n\n## Common Fakeout Patterns\n\n### Bull Trap\nPrice breaks above resistance, lures in buyers, then dumps.\n\n### Bear Trap  \nPrice breaks below support, triggers stop losses, then pumps.\n\n## How to Spot Fakeouts\n\n### Volume Check\n- Real breakouts have volume confirmation\n- Low volume breakouts are suspect\n\n### Time Confirmation\n- Wait for candle close\n- Multiple timeframe confirmation\n\n### Context Matters\n- Is it during low liquidity hours?\n- Any news driving the move?\n\n## Protection Strategies\n\n1. Don't chase the first move\n2. Wait for retest of breakout level\n3. Use smaller size on breakout entries\n4. Have invalidation levels defined\n\n## Key Insight\nPatience filters out most fakeouts. Let the move prove itself.` },

    // Module 4: Trading Psychology
    { module_slug: 'psychology', title: 'FOMO and How to Fight It', slug: 'fighting-fomo', description: 'The psychology behind chasing pumps', reading_time: 8, difficulty: 'beginner', archetype_tags: '["FOMO", "ImpulseTrader", "CopyTrader"]', order_index: 1, content: `# FOMO and How to Fight It\n\nThe fear of missing out is hardwired into our brains.\n\n## Why FOMO Is Dangerous\n\n- Buying highs\n- Oversizing positions\n- Abandoning your plan\n- Ignoring risk management\n\n## FOMO Triggers\n\n- Green candles\n- Social media hype\n- Friends making gains\n- "Last chance" narratives\n\n## Fighting FOMO\n\n### Reframe Your Thinking\n- There will always be another opportunity\n- Chasing usually leads to buying tops\n- Missing a trade costs nothing; bad trades cost everything\n\n### Practical Steps\n1. Have a watchlist ready\n2. Set alerts instead of watching charts\n3. Define entry criteria BEFORE pumps\n4. Size down if entering late\n\n## The Antidote\nRemember: the best traders are patient, not fast.` },
    { module_slug: 'psychology', title: 'Building Emotional Discipline', slug: 'emotional-discipline', description: 'Trading without letting emotions drive decisions', reading_time: 10, difficulty: 'intermediate', archetype_tags: '["ImpulseTrader", "FOMO", "DiamondHands"]', order_index: 2, content: `# Building Emotional Discipline\n\nYour biggest enemy in trading is yourself.\n\n## The Emotional Cycle\n\n1. **Excitement** - New trade, full of hope\n2. **Anxiety** - Price moves against you\n3. **Fear** - Consider panic selling\n4. **Despair** - Sell the bottom\n5. **Relief** - Price recovers (without you)\n6. **Regret** - FOMO back in at higher prices\n\n## Breaking the Cycle\n\n### Have a Written Plan\n- Entry criteria\n- Exit criteria (profit AND loss)\n- Position size\n- Thesis and invalidation\n\n### Use Automation\n- Set limit orders\n- Use stop losses\n- Remove emotion from execution\n\n### Journal Everything\n- What you felt\n- What you did\n- What you should have done\n\n## Daily Practice\n\n1. Review your plan before trading\n2. Check your emotional state\n3. If tilted, step away\n4. Review trades at end of day` },
    { module_slug: 'psychology', title: 'Handling Losing Streaks', slug: 'losing-streaks', description: 'Staying in the game when things go wrong', reading_time: 7, difficulty: 'beginner', archetype_tags: '["LossAverse", "ImpulseTrader"]', order_index: 3, content: `# Handling Losing Streaks\n\nEvery trader faces drawdowns. How you handle them defines your success.\n\n## The Reality\n\nEven with a 60% win rate, you can have 5+ losses in a row. It's statistics, not failure.\n\n## When Losing Streaks Hit\n\n### Don't Do This\n- Increase size to "make it back"\n- Abandon your strategy\n- Revenge trade\n- Trade more frequently\n\n### Do This Instead\n- Reduce position sizes\n- Review your trades for mistakes\n- Take a break if emotional\n- Trust your edge over time\n\n## The Comeback Protocol\n\n1. **Stop** - Take 24-48 hours off\n2. **Review** - Analyze losing trades objectively\n3. **Reset** - Start fresh with smaller sizes\n4. **Rebuild** - Gradually increase as confidence returns\n\n## Perspective\n\nOne bad week doesn't define you. Staying in the game does. Capital preservation beats profit maximization during drawdowns.` },

    // Module 5: Archetype Mastery
    { module_slug: 'archetype-mastery', title: 'Know Your Trading Personality', slug: 'trading-personality', description: 'Understanding your archetype strengths and weaknesses', reading_time: 8, difficulty: 'beginner', archetype_tags: '[]', order_index: 1, content: `# Know Your Trading Personality\n\nYour quiz results revealed your trading archetype. Now let's understand what it means.\n\n## Why Archetypes Matter\n\nYour personality affects:\n- How you handle risk\n- When you enter and exit\n- What mistakes you're prone to\n- What strategies suit you best\n\n## The 8 Archetypes\n\n- **Diamond Hands** 💎 - Conviction holders\n- **Scalper** ⚡ - Quick profit seekers\n- **Narrative Front-Runner** 🔮 - Early trend spotters\n- **FOMO Trader** 🚀 - Momentum chasers\n- **Copy Trader** 👀 - Follow the leaders\n- **Technical Analyst** 📊 - Chart focused\n- **Loss Averse** 🛡️ - Risk minimizers\n- **Impulse Trader** 🎲 - Gut-driven\n\n## Your Journey\n\n1. Accept your natural tendencies\n2. Learn your edge (strengths)\n3. Build systems for weaknesses\n4. Trade in alignment with your personality` },
    { module_slug: 'archetype-mastery', title: 'Playing to Your Strengths', slug: 'playing-strengths', description: 'Strategies tailored to your archetype', reading_time: 10, difficulty: 'intermediate', archetype_tags: '[]', order_index: 2, content: `# Playing to Your Strengths\n\nDifferent archetypes thrive with different strategies.\n\n## Diamond Hands\n**Strength:** Conviction through volatility\n**Strategy:** Focus on fundamentally strong projects, longer timeframes\n\n## Scalper\n**Strength:** Quick decision making\n**Strategy:** High-volume, small-gain trades, tight stops\n\n## Narrative Front-Runner\n**Strength:** Spotting trends early\n**Strategy:** Research-heavy, early entries, patient exits\n\n## FOMO Trader\n**Strength:** Catching momentum\n**Strategy:** Use momentum to your advantage with strict rules\n\n## Copy Trader\n**Strength:** Learning from others\n**Strategy:** Build a curated list of traders to follow, understand their logic\n\n## Technical Analyst\n**Strength:** Pattern recognition\n**Strategy:** Chart-based entries/exits, backtest everything\n\n## Loss Averse\n**Strength:** Capital preservation\n**Strategy:** Smaller positions, tighter stops, consistent gains\n\n## Impulse Trader\n**Strength:** Quick reactions\n**Strategy:** Pre-defined rules, cooling off periods, automation` },
    { module_slug: 'archetype-mastery', title: 'Compensating for Weaknesses', slug: 'compensating-weaknesses', description: 'Building systems to counter your blind spots', reading_time: 12, difficulty: 'advanced', archetype_tags: '[]', order_index: 3, content: `# Compensating for Weaknesses\n\nEvery archetype has Achilles heels. Here's how to build systems that protect you from yourself.\n\n## Diamond Hands Weakness\n**Problem:** Holding too long, missing exits\n**Solution:** Set automatic take-profit orders, use trailing stops\n\n## Scalper Weakness\n**Problem:** Overtrading, death by fees\n**Solution:** Daily trade limits, minimum profit targets\n\n## Narrative Front-Runner Weakness\n**Problem:** Too early, illiquid positions\n**Solution:** Scale in slowly, liquidity requirements\n\n## FOMO Trader Weakness\n**Problem:** Buying tops, emotional entries\n**Solution:** Mandatory waiting period, price alerts not chart watching\n\n## Copy Trader Weakness\n**Problem:** Following blindly, no personal thesis\n**Solution:** Require understanding before copying, keep journal of reasoning\n\n## Technical Analyst Weakness\n**Problem:** Analysis paralysis, missing moves\n**Solution:** Simplify to 2-3 indicators, time-based decisions\n\n## Loss Averse Weakness\n**Problem:** Selling winners too early\n**Solution:** Partial profit taking, let winners run\n\n## Impulse Trader Weakness\n**Problem:** No plan, reactive trading\n**Solution:** Pre-market planning, trade checklist, cool-off rules\n\n## Build Your System\n\n1. Identify your top 3 weaknesses\n2. Create a rule for each\n3. Write it in your trading plan\n4. Review weekly` },
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

export default getDb
