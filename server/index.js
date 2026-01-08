import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Connection, PublicKey } from '@solana/web3.js'
import Anthropic from '@anthropic-ai/sdk'
import authRoutes from './auth.js'
import journalRoutes from './journal.js'

const app = express()
const PORT = 3001

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// Auth routes
app.use('/api/auth', authRoutes)

// Journal routes
app.use('/api/journal', journalRoutes)

// Academy seed endpoint (for local dev)
const ADMIN_PASSWORD = 'DeusVult777!'
app.post('/api/academy/seed', async (req, res) => {
  const adminPassword = req.headers['x-admin-password']
  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Admin access required' })
  }

  const force = req.query.force === 'true'
  try {
    // Dynamic import to avoid module resolution issues
    const dbModule = await import('../api/lib/db.js')
    await dbModule.initDb()
    await dbModule.seedAcademyContent(force)
    res.json({ success: true, message: force ? 'Academy content reseeded' : 'Academy content seeded' })
  } catch (err) {
    console.error('Seed failed:', err)
    res.status(500).json({ error: err.message })
  }
})

// Helius RPC
const HELIUS_KEY = process.env.HELIUS_API_KEY
const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`
const connection = new Connection(RPC_URL, 'confirmed')

// Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Token metadata cache
const tokenCache = new Map()

// Simple cache (5 min)
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000

function getCached(wallet) {
  const entry = cache.get(wallet)
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data
  }
  return null
}

function setCache(wallet, data) {
  cache.set(wallet, { data, timestamp: Date.now() })
}

// Fetch token metadata from Helius DAS API
async function getTokenMetadata(mintAddress) {
  if (mintAddress === 'SOL') {
    return { symbol: 'SOL', name: 'Solana' }
  }

  // Check cache first
  if (tokenCache.has(mintAddress)) {
    return tokenCache.get(mintAddress)
  }

  try {
    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getAsset',
        params: { id: mintAddress },
      }),
    })

    const data = await response.json()

    if (data.result?.content?.metadata) {
      const meta = data.result.content.metadata
      const tokenInfo = {
        symbol: meta.symbol || mintAddress.slice(0, 6),
        name: meta.name || 'Unknown',
      }
      tokenCache.set(mintAddress, tokenInfo)
      return tokenInfo
    }
  } catch (err) {
    console.warn(`Failed to fetch metadata for ${mintAddress}:`, err.message)
  }

  // Fallback to shortened address
  const fallback = { symbol: mintAddress.slice(0, 6), name: 'Unknown' }
  tokenCache.set(mintAddress, fallback)
  return fallback
}

// Batch fetch token metadata
async function resolveTokenNames(mints) {
  const unique = [...new Set(mints.filter(m => m && m !== 'SOL'))]

  // Fetch in parallel with limit
  const batchSize = 10
  for (let i = 0; i < unique.length; i += batchSize) {
    const batch = unique.slice(i, i + batchSize)
    await Promise.all(batch.map(mint => getTokenMetadata(mint)))
  }
}

// DEX and trading program IDs
const DEX_PROGRAMS = [
  '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P', // Pump.fun
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', // Raydium
  'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK', // Raydium CPMM
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', // Jupiter V6
  'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB', // Jupiter V4
  'JUP3c2Uh3WA4Ng34tw6kPd2G4C5BB21Xo36Je1s32Ph', // Jupiter V3
  'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc', // Orca
  '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP', // Orca legacy
  'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo', // Meteora
  'Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB', // Meteora DLMM
  'PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY', // Phoenix
  'MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG', // Moonshot
]

const STABLES = [
  'So11111111111111111111111111111111111111112', // wSOL
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
]

function isDexTx(tx) {
  if (!tx?.transaction?.message) return false

  const accountKeys = tx.transaction.message.accountKeys || []
  const instructions = tx.transaction.message.instructions || []
  const innerInstructions = tx.meta?.innerInstructions || []

  const hasProgram = accountKeys.some(a => {
    const key = a.pubkey?.toString() || a.toString()
    return DEX_PROGRAMS.includes(key)
  })

  if (hasProgram) return true

  for (const ix of instructions) {
    const programId = ix.programId?.toString() || ''
    if (DEX_PROGRAMS.includes(programId)) return true
  }

  for (const inner of innerInstructions) {
    for (const ix of inner.instructions || []) {
      const programId = ix.programId?.toString() || ''
      if (DEX_PROGRAMS.includes(programId)) return true
    }
  }

  return false
}

function parseSwap(tx, wallet) {
  if (!tx?.meta) return null

  const { meta, blockTime, transaction } = tx
  const signature = transaction?.signatures?.[0]
  const changes = []
  const balanceMap = new Map()

  const preBalances = meta.preTokenBalances || []
  const postBalances = meta.postTokenBalances || []

  preBalances.forEach(b => {
    if (b.owner === wallet) {
      balanceMap.set(b.mint, {
        mint: b.mint,
        pre: parseFloat(b.uiTokenAmount?.uiAmount || 0),
        post: 0,
        decimals: b.uiTokenAmount?.decimals || 0
      })
    }
  })

  postBalances.forEach(b => {
    if (b.owner === wallet) {
      const entry = balanceMap.get(b.mint) || {
        mint: b.mint,
        pre: 0,
        post: 0,
        decimals: b.uiTokenAmount?.decimals || 0
      }
      entry.post = parseFloat(b.uiTokenAmount?.uiAmount || 0)
      balanceMap.set(b.mint, entry)
    }
  })

  balanceMap.forEach((v, mint) => {
    const change = v.post - v.pre
    if (Math.abs(change) > 0.000001) {
      changes.push({
        mint,
        change,
        type: change > 0 ? 'received' : 'sent',
        decimals: v.decimals
      })
    }
  })

  const accounts = transaction?.message?.accountKeys || []
  const idx = accounts.findIndex(a => (a.pubkey?.toString() || a.toString()) === wallet)

  if (idx !== -1 && meta.preBalances && meta.postBalances) {
    const solChange = (meta.postBalances[idx] - meta.preBalances[idx]) / 1e9
    if (Math.abs(solChange) > 0.0001) {
      changes.push({
        mint: 'SOL',
        change: solChange,
        type: solChange > 0 ? 'received' : 'sent',
        decimals: 9
      })
    }
  }

  if (changes.length < 2) return null

  const solChange = changes.find(c => c.mint === 'SOL' || STABLES.includes(c.mint))
  const tokenChange = changes.find(c => c.mint !== 'SOL' && !STABLES.includes(c.mint))

  let tradeType = 'unknown'
  if (solChange && tokenChange) {
    tradeType = solChange.change < 0 ? 'buy' : 'sell'
  }

  return {
    signature,
    timestamp: blockTime ? new Date(blockTime * 1000).toISOString() : null,
    type: tradeType,
    changes,
    fee: meta.fee / 1e9,
  }
}

// Calculate PnL for trades using FIFO position tracking
function calculatePnL(trades) {
  const positions = new Map() // token -> [{price, amount, timestamp}]

  // Sort trades by timestamp (oldest first) for FIFO matching
  const sortedTrades = [...trades].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
  )

  for (const trade of sortedTrades) {
    const solChange = trade.changes.find(c => c.mint === 'SOL' || STABLES.includes(c.mint))
    const tokenChange = trade.changes.find(c => c.mint !== 'SOL' && !STABLES.includes(c.mint))

    if (!solChange || !tokenChange) continue

    const token = tokenChange.mint
    const priceInSol = Math.abs(solChange.change) / Math.abs(tokenChange.change)

    // Store price on the trade
    trade.priceInSol = priceInSol

    if (trade.type === 'buy') {
      // Add to position
      if (!positions.has(token)) positions.set(token, [])
      positions.get(token).push({
        price: priceInSol,
        amount: Math.abs(tokenChange.change),
        timestamp: trade.timestamp
      })
    } else if (trade.type === 'sell') {
      // Match against entries (FIFO)
      const entries = positions.get(token) || []
      let soldAmount = Math.abs(tokenChange.change)
      let totalCost = 0
      let totalSold = 0

      while (soldAmount > 0 && entries.length > 0) {
        const entry = entries[0]
        const sellFromEntry = Math.min(entry.amount, soldAmount)
        totalCost += sellFromEntry * entry.price
        totalSold += sellFromEntry
        entry.amount -= sellFromEntry
        soldAmount -= sellFromEntry
        if (entry.amount <= 0) entries.shift()
      }

      if (totalSold > 0) {
        const avgEntryPrice = totalCost / totalSold
        trade.entryPrice = avgEntryPrice
        trade.pnlPercent = ((priceInSol - avgEntryPrice) / avgEntryPrice) * 100
        trade.pnlSol = (priceInSol - avgEntryPrice) * totalSold
      }
    }
  }

  return trades
}

// Calculate aggregate PnL stats
function calculatePnLStats(trades) {
  const sellsWithPnL = trades.filter(t => t.type === 'sell' && t.pnlPercent !== undefined)

  const wins = sellsWithPnL.filter(t => t.pnlPercent > 0)
  const losses = sellsWithPnL.filter(t => t.pnlPercent <= 0)

  const totalPnlSol = sellsWithPnL.reduce((sum, t) => sum + (t.pnlSol || 0), 0)
  const avgWinPercent = wins.length > 0
    ? wins.reduce((sum, t) => sum + t.pnlPercent, 0) / wins.length
    : 0
  const avgLossPercent = losses.length > 0
    ? losses.reduce((sum, t) => sum + t.pnlPercent, 0) / losses.length
    : 0

  return {
    totalPnlSol: Math.round(totalPnlSol * 1000) / 1000,
    winCount: wins.length,
    lossCount: losses.length,
    realizedWinRate: sellsWithPnL.length > 0
      ? `${Math.round((wins.length / sellsWithPnL.length) * 100)}%`
      : 'N/A',
    avgWinPercent: Math.round(avgWinPercent),
    avgLossPercent: Math.round(avgLossPercent),
  }
}

// Fetch current token balances for wallet
async function getWalletTokenBalances(walletAddress) {
  try {
    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          walletAddress,
          { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
          { encoding: 'jsonParsed' }
        ],
      }),
    })

    const data = await response.json()
    if (!data.result?.value) return []

    return data.result.value
      .map(account => {
        const info = account.account.data.parsed.info
        return {
          mint: info.mint,
          balance: parseFloat(info.tokenAmount.uiAmount || 0),
          decimals: info.tokenAmount.decimals,
        }
      })
      .filter(t => t.balance > 0) // Only non-zero balances
  } catch (err) {
    console.warn('Failed to fetch token balances:', err.message)
    return []
  }
}

// Fetch current prices from DexScreener (free, no auth)
async function getCurrentPrices(mints) {
  const prices = new Map()
  const batchSize = 30 // DexScreener limit

  for (let i = 0; i < mints.length; i += batchSize) {
    const batch = mints.slice(i, i + batchSize)
    try {
      const response = await fetch(
        `https://api.dexscreener.com/tokens/v1/solana/${batch.join(',')}`
      )
      const data = await response.json()

      if (Array.isArray(data)) {
        data.forEach(token => {
          if (token.baseToken?.address && token.priceUsd) {
            prices.set(token.baseToken.address, {
              priceUsd: parseFloat(token.priceUsd),
              priceChange24h: token.priceChange?.h24 || 0,
            })
          }
        })
      }
    } catch (err) {
      console.warn('DexScreener fetch failed:', err.message)
    }
  }

  return prices
}

// Calculate cost basis from trades for open positions
function calculateCostBasis(trades) {
  const costBasis = new Map() // mint -> { totalCost, totalAmount, firstBuyTime }

  // Sort by time (oldest first)
  const sortedTrades = [...trades].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
  )

  for (const trade of sortedTrades) {
    const solChange = trade.changes.find(c => c.mint === 'SOL' || STABLES.includes(c.mint))
    const tokenChange = trade.changes.find(c => c.mint !== 'SOL' && !STABLES.includes(c.mint))

    if (!solChange || !tokenChange) continue

    const mint = tokenChange.mint
    const amount = Math.abs(tokenChange.change)
    const cost = Math.abs(solChange.change)

    if (trade.type === 'buy') {
      const existing = costBasis.get(mint) || { totalCost: 0, totalAmount: 0, firstBuyTime: null }
      existing.totalCost += cost
      existing.totalAmount += amount
      if (!existing.firstBuyTime) existing.firstBuyTime = trade.timestamp
      costBasis.set(mint, existing)
    } else if (trade.type === 'sell') {
      const existing = costBasis.get(mint)
      if (existing && existing.totalAmount > 0) {
        // Reduce position proportionally
        const sellRatio = Math.min(amount / existing.totalAmount, 1)
        existing.totalCost *= (1 - sellRatio)
        existing.totalAmount -= amount
        if (existing.totalAmount < 0.000001) {
          costBasis.delete(mint)
        }
      }
    }
  }

  return costBasis
}

// Analyze open positions
async function analyzeOpenPositions(walletAddress, trades) {
  console.log('Fetching token balances...')
  const balances = await getWalletTokenBalances(walletAddress)

  if (balances.length === 0) {
    return { positions: [], summary: null }
  }

  // Filter out dust and stables
  const significantBalances = balances.filter(b =>
    b.balance > 0 &&
    !STABLES.includes(b.mint) &&
    b.mint !== 'So11111111111111111111111111111111111111112'
  )

  if (significantBalances.length === 0) {
    return { positions: [], summary: null }
  }

  console.log(`Found ${significantBalances.length} token holdings, fetching prices...`)

  // Get current prices
  const mints = significantBalances.map(b => b.mint)
  const prices = await getCurrentPrices(mints)

  // Get cost basis from trades
  const costBasis = calculateCostBasis(trades)

  // Build open positions
  const positions = []
  const now = new Date()

  for (const balance of significantBalances) {
    const price = prices.get(balance.mint)
    const basis = costBasis.get(balance.mint)
    const metadata = tokenCache.get(balance.mint)

    if (!price) continue // Skip tokens without price data

    const currentValueUsd = balance.balance * price.priceUsd
    if (currentValueUsd < 1) continue // Skip dust (< $1)

    const position = {
      mint: balance.mint,
      symbol: metadata?.symbol || balance.mint.slice(0, 6),
      name: metadata?.name || 'Unknown',
      balance: balance.balance,
      currentPriceUsd: price.priceUsd,
      currentValueUsd: Math.round(currentValueUsd * 100) / 100,
      priceChange24h: price.priceChange24h,
    }

    // Add cost basis if we have trade history
    if (basis && basis.totalAmount > 0) {
      const avgEntryPriceSol = basis.totalCost / basis.totalAmount
      position.costBasisSol = Math.round(basis.totalCost * 1000) / 1000
      position.avgEntryPriceSol = avgEntryPriceSol

      // Calculate unrealized PnL (approximate - using current price vs entry)
      // Note: This is simplified since we're comparing SOL entry to USD current
      const holdingDays = Math.floor((now - new Date(basis.firstBuyTime)) / (1000 * 60 * 60 * 24))
      position.holdingDays = holdingDays
      position.firstBuyTime = basis.firstBuyTime

      // Categorize position
      if (price.priceChange24h > 50 && holdingDays >= 7) {
        position.category = 'diamond_hands'
      } else if (price.priceChange24h < -30 && holdingDays >= 3) {
        position.category = 'bagholding'
      } else if (holdingDays < 1) {
        position.category = 'recent'
      } else {
        position.category = 'holding'
      }
    } else {
      position.category = 'unknown_entry' // Bought before our data window
    }

    positions.push(position)
  }

  // Sort by value descending
  positions.sort((a, b) => b.currentValueUsd - a.currentValueUsd)

  // Calculate summary
  const totalValueUsd = positions.reduce((sum, p) => sum + p.currentValueUsd, 0)
  const diamondHands = positions.filter(p => p.category === 'diamond_hands')
  const bagholding = positions.filter(p => p.category === 'bagholding')

  const summary = {
    totalPositions: positions.length,
    totalValueUsd: Math.round(totalValueUsd * 100) / 100,
    diamondHandsCount: diamondHands.length,
    bagholdingCount: bagholding.length,
  }

  return { positions: positions.slice(0, 20), summary } // Top 20 positions
}

// POST /api/analyze - Get wallet trades
app.post('/api/analyze', async (req, res) => {
  const { walletAddress } = req.body

  if (!walletAddress) {
    return res.status(400).json({ error: 'walletAddress is required' })
  }

  try {
    new PublicKey(walletAddress)
  } catch {
    return res.status(400).json({ error: 'Invalid Solana wallet address' })
  }

  const cached = getCached(walletAddress)
  if (cached) {
    console.log(`Cache hit: ${walletAddress}`)
    return res.json(cached)
  }

  console.log(`Analyzing: ${walletAddress}`)

  try {
    const pubkey = new PublicKey(walletAddress)
    const signatures = await connection.getSignaturesForAddress(pubkey, { limit: 100 })
    console.log(`Found ${signatures.length} transactions`)

    if (!signatures.length) {
      const result = { walletAddress, stats: { totalTransactions: 0, dexTrades: 0 }, trades: [] }
      setCache(walletAddress, result)
      return res.json(result)
    }

    const trades = []

    for (let i = 0; i < signatures.length; i++) {
      try {
        const tx = await connection.getParsedTransaction(signatures[i].signature, {
          maxSupportedTransactionVersion: 0,
        })

        if (tx && isDexTx(tx)) {
          const swap = parseSwap(tx, walletAddress)
          if (swap) {
            trades.push(swap)
            console.log(`  [${i + 1}] ${swap.type.toUpperCase()} - ${swap.signature.slice(0, 8)}...`)
          }
        }
      } catch (err) {
        console.warn(`Error fetching tx ${i}: ${err.message}`)
      }
    }

    console.log(`Found ${trades.length} DEX trades`)

    // Resolve token names
    const allMints = trades.flatMap(t => t.changes.map(c => c.mint))
    console.log('Resolving token names...')
    await resolveTokenNames(allMints)

    // Calculate PnL for each trade
    console.log('Calculating PnL...')
    calculatePnL(trades)
    const pnlStats = calculatePnLStats(trades)

    // Analyze open positions (tokens still held)
    const openPositions = await analyzeOpenPositions(walletAddress, trades)

    // Add token symbols to trades (and preserve PnL fields)
    const tradesWithSymbols = trades.map(trade => ({
      ...trade,
      changes: trade.changes.map(c => ({
        ...c,
        symbol: tokenCache.get(c.mint)?.symbol || (c.mint === 'SOL' ? 'SOL' : c.mint.slice(0, 6)),
        name: tokenCache.get(c.mint)?.name || 'Unknown',
      }))
    }))

    const result = {
      walletAddress,
      stats: {
        totalTransactions: signatures.length,
        dexTrades: trades.length,
        buys: trades.filter(t => t.type === 'buy').length,
        sells: trades.filter(t => t.type === 'sell').length,
        ...pnlStats,
        ...openPositions.summary,
      },
      trades: tradesWithSymbols,
      openPositions: openPositions.positions,
    }

    setCache(walletAddress, result)
    res.json(result)
  } catch (err) {
    console.error('Analysis failed:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/analyze-behavior - AI behavioral analysis
app.post('/api/analyze-behavior', async (req, res) => {
  const { trades, stats, openPositions, userArchetype, journalPatterns } = req.body

  if (!trades || !trades.length) {
    return res.status(400).json({ error: 'No trades to analyze' })
  }

  console.log(`Analyzing behavior for ${trades.length} trades...`)
  if (userArchetype) {
    console.log(`User archetype: ${userArchetype.primary} / ${userArchetype.secondary}`)
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
USER'S SELF-REPORTED TRADER TYPE:
- Primary Archetype: ${userArchetype.primary}
- Secondary Tendency: ${userArchetype.secondary}
- Known Strengths: ${userArchetype.strengths?.join(', ') || 'Unknown'}
- Known Weaknesses: ${userArchetype.weaknesses?.join(', ') || 'Unknown'}
- Coaching Focus: ${userArchetype.coaching || 'General improvement'}

PERSONALIZATION INSTRUCTIONS:
- Reference their archetype when patterns confirm or contradict their self-reported style
- Use their known weaknesses to frame specific observations (e.g., "As a Diamond Hands trader, you tend to hold too long - and this wallet confirms it.")
- Acknowledge when they're playing to their strengths
- Tailor corrections to their specific trading personality
` : ''

  // Build journal patterns context if available
  let journalContext = ''
  if (journalPatterns && journalPatterns.hasEnoughData) {
    const moodSummary = journalPatterns.patterns?.moodOnLosses?.length > 0
      ? `Most common mood on losing trades: ${journalPatterns.patterns.moodOnLosses[0].mood} (${journalPatterns.patterns.moodOnLosses[0].count} times)`
      : 'No mood data available'

    const researchSummary = journalPatterns.patterns?.researchOnWins?.length > 0
      ? `Most common research level on winning trades: ${journalPatterns.patterns.researchOnWins[0].research_level} (${journalPatterns.patterns.researchOnWins[0].count} times)`
      : 'No research level data available'

    const insightsSummary = journalPatterns.insights?.length > 0
      ? journalPatterns.insights.map(i => `- ${i.text}`).join('\n')
      : 'No specific patterns identified yet'

    // Build ATH patterns summary if available
    let athSummary = ''
    if (journalPatterns.athPatterns) {
      const { avgExitVsAth, earlyExitCount, lateExitCount, nearAthCount, totalWithAth } = journalPatterns.athPatterns
      if (totalWithAth > 0) {
        athSummary = `
ATH EXIT PATTERNS (${totalWithAth} trades with ATH data):
- Average exit vs ATH: ${avgExitVsAth > 0 ? '+' : ''}${avgExitVsAth?.toFixed(1)}%
- Near ATH exits (within 10%): ${nearAthCount} trades
- Sold before peak: ${earlyExitCount} trades
- Sold after peak: ${lateExitCount} trades`
      }
    }

    journalContext = `
USER'S TRADING JOURNAL DATA (${journalPatterns.journaledCount} trades journaled):
${moodSummary}
${researchSummary}
${athSummary}

Self-reported patterns from journal:
${insightsSummary}

JOURNAL-BASED COACHING:
- Reference their self-reported behaviors when giving advice
- Be specific about what they've admitted to doing wrong
- Call out the connection between their mood/research and outcomes
- If ATH data is available, point out their exit timing patterns (e.g., "You consistently sell before the peak" or "You're holding too long after ATH")
`
  }

  const prompt = `You are Hindsight, a brutally honest trading coach analyzing Solana memecoin trading behavior. Your job is to identify the psychological patterns affecting this trader's performance.

Analyze this trading data and deliver a verdict that hits hard but helps them improve.
${archetypeContext}${journalContext}

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
    })

    const responseText = message.content[0].text
    console.log('Claude response:', responseText)

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse AI response')
    }

    const analysis = JSON.parse(jsonMatch[0])
    res.json(analysis)
  } catch (err) {
    console.error('AI analysis failed:', err.message)
    res.status(500).json({ error: 'AI analysis failed: ' + err.message })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
  console.log(`Using Helius RPC`)
})
