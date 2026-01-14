import Anthropic from '@anthropic-ai/sdk'
import { cors, authenticateRequest } from './lib/auth.js'

// Only log in development
const debug = process.env.NODE_ENV !== 'production' ? console.log.bind(console) : () => {}

// Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Vercel serverless handler
export default async function handler(req, res) {
  // Handle CORS
  cors(res, req)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Authentication is optional - allows landing page analysis for new visitors
  // This enables the full experience before signup to improve conversion
  const decoded = authenticateRequest(req)

  const { trades, stats, openPositions, userArchetype, journalPatterns, crossWalletStats } = req.body

  if (!trades || !trades.length) {
    return res.status(400).json({ error: 'No trades to analyze' })
  }

  debug(`Analyzing behavior for ${trades.length} trades...`)
  if (crossWalletStats) {
    debug(`Cross-wallet analysis: ${crossWalletStats.length} wallets`)
  }

  // Prepare trade summary with token symbols and PnL
  const tradeSummary = trades.map(t => {
    const solChange = t.changes.find(c => c.mint === 'SOL' || c.symbol === 'SOL')
    const tokenChange = t.changes.find(c => c.mint !== 'SOL' && c.symbol !== 'SOL')

    const summary = {
      type: t.type,
      timestamp: t.timestamp,
      solAmount: solChange?.change || 0,
      token: tokenChange?.symbol || 'UNKNOWN',
      tokenAmount: tokenChange?.change || 0,
    }

    // Add PnL data for sells
    if (t.type === 'sell' && t.pnlPercent !== undefined) {
      summary.pnlPercent = Math.round(t.pnlPercent * 10) / 10
      summary.pnlSol = Math.round((t.pnlSol || 0) * 1000) / 1000
    }

    // Add price for all trades
    if (t.priceInSol) {
      summary.priceInSol = t.priceInSol
    }

    return summary
  })

  // Count trades per token
  const tokenCounts = {}
  tradeSummary.forEach(t => {
    tokenCounts[t.token] = (tokenCounts[t.token] || 0) + 1
  })
  const topTokens = Object.entries(tokenCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([token, count]) => `${token}: ${count} trades`)
    .join('\n')

  // Build PnL summary for prompt
  const pnlSummary = stats.realizedWinRate
    ? `- Realized Win Rate: ${stats.realizedWinRate} (${stats.winCount} wins, ${stats.lossCount} losses)
- Total PnL: ${stats.totalPnlSol > 0 ? '+' : ''}${stats.totalPnlSol} SOL
- Avg Win: +${stats.avgWinPercent}% | Avg Loss: ${stats.avgLossPercent}%`
    : '- PnL data not available (no matched buy/sell pairs)'

  // Build open positions summary
  const openPositionsSummary = openPositions && openPositions.length > 0
    ? openPositions.map(p => ({
        token: p.symbol,
        valueUsd: p.currentValueUsd,
        change24h: p.priceChange24h ? `${p.priceChange24h > 0 ? '+' : ''}${Math.round(p.priceChange24h)}%` : 'N/A',
        holdingDays: p.holdingDays !== undefined ? p.holdingDays : 'unknown',
        category: p.category,
      }))
    : []

  const openPositionsText = openPositionsSummary.length > 0
    ? `OPEN POSITIONS (tokens still held):
- Total positions: ${stats.totalPositions || openPositionsSummary.length}
- Total value: $${stats.totalValueUsd || 0}
- Diamond hands (up big, holding): ${stats.diamondHandsCount || 0}
- Bagholding (down big, stuck): ${stats.bagholdingCount || 0}

TOP HOLDINGS:
${JSON.stringify(openPositionsSummary.slice(0, 10), null, 2)}`
    : 'OPEN POSITIONS: No significant token holdings found'

  // Build archetype context if available
  const archetypeContext = userArchetype ? `
USER'S TRADER PROFILE:
- Primary Archetype: ${userArchetype.primary}
- Secondary Tendency: ${userArchetype.secondary || 'None'}
- Known Strengths: ${userArchetype.strengths?.join(', ') || 'Unknown'}
- Known Weaknesses: ${userArchetype.weaknesses?.join(', ') || 'Unknown'}
- Coaching Focus: ${userArchetype.coaching || 'General improvement'}

PERSONALIZATION: Reference their archetype when patterns confirm or contradict their self-reported style.
` : ''

  // Build cross-wallet comparison if available (Pro users with 2+ wallets)
  const truncateAddr = (addr) => `${addr.slice(0, 4)}...${addr.slice(-4)}`
  const crossWalletContext = crossWalletStats && crossWalletStats.length >= 2 ? `
CROSS-WALLET PERFORMANCE (Pro User):
${crossWalletStats.map(w => {
  const pnlSign = w.totalPnlSol >= 0 ? '+' : ''
  return `- ${truncateAddr(w.address)} (${w.label}): ${w.trades} trades, ${pnlSign}${w.totalPnlSol} SOL, ${w.winRate} win rate`
}).join('\n')}

CROSS-WALLET ANALYSIS INSTRUCTIONS:
- Compare behavior across their different wallet strategies
- Note if their labeled wallets match their actual behavior (e.g., does "Long Hold" actually hold?)
- Identify which wallet strategy is performing best and why
- Call out inconsistencies between wallet intentions and actual trading patterns
- Include one pattern specifically about their cross-wallet behavior
` : ''

  const prompt = `You are Hindsight, a brutally honest trading coach analyzing Solana memecoin trading behavior. Your job is to identify the psychological patterns affecting this trader's performance.

Analyze this trading data and deliver a verdict that hits hard but helps them improve.
${archetypeContext}${crossWalletContext}
TRADING DATA:
- Total trades analyzed: ${stats.dexTrades}
- Buys: ${stats.buys}
- Sells: ${stats.sells}

PNL ANALYSIS (Closed Positions):
${pnlSummary}

${openPositionsText}

TOP TOKENS TRADED:
${topTokens}

RECENT TRADE HISTORY (most recent first):
${JSON.stringify(tradeSummary.slice(0, 30), null, 2)}

IMPORTANT - Understanding the data:
CLOSED POSITIONS (trades):
- pnlPercent: The percentage gain/loss on that specific sell (positive = profit, negative = loss)
- pnlSol: The SOL profit/loss on that sell

OPEN POSITIONS (still holding):
- category: "diamond_hands" (up 50%+, 7+ days), "bagholding" (down 30%+, 3+ days), "recent" (<24h), "holding" (neutral)
- change24h: 24-hour price change for that token
- Use open positions to identify if they're sitting on winners/losers they should act on

Respond with ONLY valid JSON in this exact format:
{
  "verdict": "One brutal sentence. Reference BOTH closed trades AND open positions. (e.g., 'You sold your winners at +30% but are bagholding 5 losers down 60%+' or 'Diamond hands on DHG (+400%) but panic-sold everything else.')",
  "winRate": "Use the ACTUAL realized win rate from PNL ANALYSIS if available, otherwise estimate",
  "avgHoldTime": "Estimated average hold time (e.g., '< 5 minutes' or '2-4 hours')",
  "patterns": [
    {
      "name": "Pattern name (e.g., 'Premature Profit-Taking' or 'Bagholding Losers')",
      "description": "What they're doing - reference BOTH closed trades AND open positions with real token names",
      "correction": "Specific actionable fix they can implement"
    },
    {
      "name": "Second pattern",
      "description": "Description with evidence from trades AND holdings",
      "correction": "Actionable fix"
    },
    {
      "name": "Third pattern",
      "description": "Description with evidence from trades AND holdings",
      "correction": "Actionable fix"
    }
  ]
}

CRITICAL RULES for accurate analysis:
- ONLY call it "panic selling" if pnlPercent is NEGATIVE (they sold at a loss)
- If pnlPercent is POSITIVE, call it "profit-taking" or "good exit" - NOT panic selling
- Use actual pnlPercent values in your descriptions (e.g., "sold at +130%" or "sold at -40%")
- ALWAYS use actual token symbols/names from the trade data
- Reference specific patterns you see in their actual trades
- Keep the verdict punchy and memorable (under 15 words)
- Patterns should be specific to THIS trader's behavior, not generic advice
- If they have a positive win rate and total PnL, acknowledge what they're doing right`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }, {
      timeout: 55000, // 55 second timeout (Vercel has 60s limit)
    })

    const responseText = message.content[0].text
    debug('Claude response received')

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse AI response')
    }

    const analysis = JSON.parse(jsonMatch[0])
    res.json(analysis)
  } catch (err) {
    console.error('AI analysis failed:', err.message)
    // Don't expose internal error details to client
    res.status(500).json({ error: 'AI analysis failed. Please try again.' })
  }
}
