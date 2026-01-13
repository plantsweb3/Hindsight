import Anthropic from '@anthropic-ai/sdk'
import {
  initDb,
  getUserById,
  getUserWallets,
  getJournalEntries,
  getJournalStats,
  createConversation,
  saveMessage,
  getConversationHistory,
  getConversation,
  getDailyMessageCount,
  incrementDailyMessageCount,
  getCachedUserContext,
  setCachedUserContext,
} from '../lib/db.js'
import { authenticateRequest, json, error, cors } from '../lib/auth.js'

// Constants
const FREE_TIER_DAILY_LIMIT = 5
const MODEL = 'claude-haiku-4-5-20251001'
const MAX_TOKENS = 1024

// Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Ensure DB is initialized
let dbInitialized = false
async function ensureDb() {
  if (!dbInitialized) {
    await initDb()
    dbInitialized = true
  }
}

// Build system prompt with user context
async function buildSystemPrompt(userId) {
  // Check cache first
  const cached = await getCachedUserContext(userId)
  if (cached) {
    return buildPromptFromContext(cached)
  }

  // Build fresh context
  const context = await buildUserContext(userId)

  // Cache for 1 hour
  await setCachedUserContext(userId, context, 60)

  return buildPromptFromContext(context)
}

// Gather all user context data
async function buildUserContext(userId) {
  const user = await getUserById(userId)
  const wallets = await getUserWallets(userId)
  const journalEntries = await getJournalEntries(userId, { limit: 20 })
  const journalStats = await getJournalStats(userId)

  return {
    archetype: {
      primary: user?.primary_archetype || null,
      secondary: user?.secondary_archetype || null,
    },
    wallets: wallets?.length || 0,
    journal: {
      entryCount: Number(journalStats?.total_trades) || 0,
      winRate: journalStats?.total_trades > 0
        ? ((Number(journalStats?.wins) / Number(journalStats?.total_trades)) * 100).toFixed(1)
        : null,
      totalPnl: Number(journalStats?.total_pnl) || 0,
      recentThemes: extractJournalThemes(journalEntries),
    },
    isPro: user?.is_pro === 1,
  }
}

// Extract common themes from journal entries
function extractJournalThemes(entries) {
  if (!entries || entries.length === 0) return []

  const themes = []

  // Common moods
  const moods = entries.map(e => e.mood).filter(Boolean)
  const moodCounts = {}
  moods.forEach(m => { moodCounts[m] = (moodCounts[m] || 0) + 1 })
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]
  if (topMood) themes.push(`Most common mood: ${topMood[0]}`)

  // Win/loss patterns
  const wins = entries.filter(e => Number(e.pnl_percent) > 0).length
  const losses = entries.filter(e => Number(e.pnl_percent) < 0).length
  if (wins + losses > 0) {
    themes.push(`Recent trades: ${wins} wins, ${losses} losses`)
  }

  return themes
}

// Build the actual prompt string from context
function buildPromptFromContext(context) {
  const archetypeSection = context.archetype.primary
    ? `## User's Trading Profile
- Primary Archetype: ${context.archetype.primary}${context.archetype.secondary ? `\n- Secondary Tendency: ${context.archetype.secondary}` : ''}

Personalize advice to their archetype. Reference their known tendencies when relevant.`
    : ''

  const journalSection = context.journal.entryCount > 0
    ? `## Trading Journal Insights
- Journal entries: ${context.journal.entryCount}
- Win rate: ${context.journal.winRate || 'N/A'}%
- Total PnL: ${context.journal.totalPnl > 0 ? '+' : ''}${context.journal.totalPnl} SOL
${context.journal.recentThemes.length > 0 ? `- Recent patterns: ${context.journal.recentThemes.join(', ')}` : ''}`
    : ''

  return `You are the Hindsight Coach, an AI trading mentor for Solana memecoin traders. You help users improve their trading psychology, strategy, and discipline.

## Your Personality
- Direct and honest, but supportive
- Focus on practical, actionable advice
- Reference specific patterns when you see them
- Encourage self-reflection and journaling
- Never give financial advice or price predictions
- Remind users that memecoins are extremely risky

## Platform Context
Hindsight is a trading improvement platform with:
- Wallet analysis (shows trading patterns)
- Trade journaling (review past trades)
- Trading 101 Academy (educational modules)
- Archetype quiz (identifies trading style)

${archetypeSection}

${journalSection}

## Important Guidelines
1. Be concise - users are traders, not readers
2. Ask follow-up questions to understand their situation
3. Connect advice to their specific data when available
4. Encourage using Hindsight features (journal, analysis)
5. Never promise gains or validate risky behavior
6. If they share a specific trade, ask about their thesis and exit plan`
}

// Check if user can send message (rate limiting)
async function checkRateLimit(userId, isPro) {
  if (isPro) {
    return { allowed: true, remaining: null }
  }

  const dailyCount = await getDailyMessageCount(userId)
  const remaining = FREE_TIER_DAILY_LIMIT - dailyCount

  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    limit: FREE_TIER_DAILY_LIMIT,
    used: dailyCount,
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
    // GET /api/chat/status - Get user's chat status
    if (route === 'status' && req.method === 'GET') {
      const user = await getUserById(decoded.id)
      const isPro = user?.is_pro === 1
      const rateLimit = await checkRateLimit(decoded.id, isPro)

      return json(res, {
        isPro,
        dailyLimit: FREE_TIER_DAILY_LIMIT,
        messagesUsed: rateLimit.used || 0,
        messagesRemaining: rateLimit.remaining,
        canSendMessage: rateLimit.allowed,
      })
    }

    // POST /api/chat - Send message and stream response
    if (route === '' && req.method === 'POST') {
      const { message, conversationId } = req.body

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return error(res, 'Message is required', 400)
      }

      if (message.length > 4000) {
        return error(res, 'Message too long (max 4000 characters)', 400)
      }

      // Get user and check Pro status
      const user = await getUserById(decoded.id)
      const isPro = user?.is_pro === 1

      // Check rate limit
      const rateLimit = await checkRateLimit(decoded.id, isPro)
      if (!rateLimit.allowed) {
        return res.status(429).json({
          error: 'Daily message limit reached',
          isPro: false,
          limit: FREE_TIER_DAILY_LIMIT,
          resetsAt: getNextMidnight(),
        })
      }

      // Get or create conversation
      let convId = conversationId
      let existingMessages = []

      if (convId) {
        // Verify conversation belongs to user
        const conv = await getConversation(convId, decoded.id)
        if (!conv) {
          return error(res, 'Conversation not found', 404)
        }
        existingMessages = await getConversationHistory(convId, 20)
      } else {
        // Create new conversation
        convId = await createConversation(decoded.id)
      }

      // Build messages array for API
      const systemPrompt = await buildSystemPrompt(decoded.id)
      const messages = [
        ...existingMessages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user', content: message.trim() },
      ]

      // Save user message
      await saveMessage(convId, 'user', message.trim())

      // Increment daily count for free users
      if (!isPro) {
        await incrementDailyMessageCount(decoded.id)
      }

      // Set up SSE headers for streaming
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      res.setHeader('X-Accel-Buffering', 'no')

      // Send conversation ID first
      res.write(`data: ${JSON.stringify({ type: 'conversation', id: convId })}\n\n`)

      let fullResponse = ''

      try {
        // Stream response from Anthropic
        const stream = await anthropic.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: systemPrompt,
          messages,
        })

        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta?.text) {
            const chunk = event.delta.text
            fullResponse += chunk
            res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`)
          }
        }

        // Save assistant response
        const usage = await stream.finalMessage()
        const tokenCount = usage?.usage?.output_tokens || null
        await saveMessage(convId, 'assistant', fullResponse, tokenCount)

        // Send completion event
        res.write(`data: ${JSON.stringify({ type: 'done', conversationId: convId })}\n\n`)
        res.end()

      } catch (streamError) {
        console.error('[Chat] Stream error:', streamError)
        res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to generate response' })}\n\n`)
        res.end()
      }

      return
    }

    // 404 for unmatched routes
    return error(res, 'Not found', 404)

  } catch (err) {
    console.error('[Chat API] Error:', err)
    return error(res, 'Internal server error', 500)
  }
}

// Helper to get next midnight timestamp
function getNextMidnight() {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow.toISOString()
}
