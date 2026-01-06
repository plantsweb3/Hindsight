import { Connection, PublicKey } from '@solana/web3.js'

// Helius RPC
const HELIUS_KEY = process.env.HELIUS_API_KEY
const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`

// In-memory caches (reset on cold start, which is fine for serverless)
const tokenCache = new Map()

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

// Fetch token metadata from Helius DAS API
async function getTokenMetadata(mintAddress) {
  if (mintAddress === 'SOL') {
    return { symbol: 'SOL', name: 'Solana' }
  }

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

  const fallback = { symbol: mintAddress.slice(0, 6), name: 'Unknown' }
  tokenCache.set(mintAddress, fallback)
  return fallback
}

// Batch fetch token metadata
async function resolveTokenNames(mints) {
  const unique = [...new Set(mints.filter(m => m && m !== 'SOL'))]
  const batchSize = 10
  for (let i = 0; i < unique.length; i += batchSize) {
    const batch = unique.slice(i, i + batchSize)
    await Promise.all(batch.map(mint => getTokenMetadata(mint)))
  }
}

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

// Calculate PnL using FIFO position tracking
function calculatePnL(trades) {
  const positions = new Map()

  const sortedTrades = [...trades].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
  )

  for (const trade of sortedTrades) {
    const solChange = trade.changes.find(c => c.mint === 'SOL' || STABLES.includes(c.mint))
    const tokenChange = trade.changes.find(c => c.mint !== 'SOL' && !STABLES.includes(c.mint))

    if (!solChange || !tokenChange) continue

    const token = tokenChange.mint
    const priceInSol = Math.abs(solChange.change) / Math.abs(tokenChange.change)
    trade.priceInSol = priceInSol

    if (trade.type === 'buy') {
      if (!positions.has(token)) positions.set(token, [])
      positions.get(token).push({
        price: priceInSol,
        amount: Math.abs(tokenChange.change),
        timestamp: trade.timestamp
      })
    } else if (trade.type === 'sell') {
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
      .filter(t => t.balance > 0)
  } catch (err) {
    console.warn('Failed to fetch token balances:', err.message)
    return []
  }
}

// Fetch current prices from DexScreener
async function getCurrentPrices(mints) {
  const prices = new Map()
  const batchSize = 30

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

// Calculate cost basis from trades
function calculateCostBasis(trades) {
  const costBasis = new Map()

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
  const balances = await getWalletTokenBalances(walletAddress)

  if (balances.length === 0) {
    return { positions: [], summary: null }
  }

  const significantBalances = balances.filter(b =>
    b.balance > 0 &&
    !STABLES.includes(b.mint) &&
    b.mint !== 'So11111111111111111111111111111111111111112'
  )

  if (significantBalances.length === 0) {
    return { positions: [], summary: null }
  }

  const mints = significantBalances.map(b => b.mint)
  const prices = await getCurrentPrices(mints)
  const costBasis = calculateCostBasis(trades)

  const positions = []
  const now = new Date()

  for (const balance of significantBalances) {
    const price = prices.get(balance.mint)
    const basis = costBasis.get(balance.mint)
    const metadata = tokenCache.get(balance.mint)

    if (!price) continue

    const currentValueUsd = balance.balance * price.priceUsd
    if (currentValueUsd < 1) continue

    const position = {
      mint: balance.mint,
      symbol: metadata?.symbol || balance.mint.slice(0, 6),
      name: metadata?.name || 'Unknown',
      balance: balance.balance,
      currentPriceUsd: price.priceUsd,
      currentValueUsd: Math.round(currentValueUsd * 100) / 100,
      priceChange24h: price.priceChange24h,
    }

    if (basis && basis.totalAmount > 0) {
      const avgEntryPriceSol = basis.totalCost / basis.totalAmount
      position.costBasisSol = Math.round(basis.totalCost * 1000) / 1000
      position.avgEntryPriceSol = avgEntryPriceSol

      const holdingDays = Math.floor((now - new Date(basis.firstBuyTime)) / (1000 * 60 * 60 * 24))
      position.holdingDays = holdingDays
      position.firstBuyTime = basis.firstBuyTime

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
      position.category = 'unknown_entry'
    }

    positions.push(position)
  }

  positions.sort((a, b) => b.currentValueUsd - a.currentValueUsd)

  const totalValueUsd = positions.reduce((sum, p) => sum + p.currentValueUsd, 0)
  const diamondHands = positions.filter(p => p.category === 'diamond_hands')
  const bagholding = positions.filter(p => p.category === 'bagholding')

  const summary = {
    totalPositions: positions.length,
    totalValueUsd: Math.round(totalValueUsd * 100) / 100,
    diamondHandsCount: diamondHands.length,
    bagholdingCount: bagholding.length,
  }

  return { positions: positions.slice(0, 20), summary }
}

// Vercel serverless handler
export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { walletAddress } = req.body

  if (!walletAddress) {
    return res.status(400).json({ error: 'walletAddress is required' })
  }

  try {
    new PublicKey(walletAddress)
  } catch {
    return res.status(400).json({ error: 'Invalid Solana wallet address' })
  }

  console.log(`Analyzing: ${walletAddress}`)

  try {
    const connection = new Connection(RPC_URL, 'confirmed')
    const pubkey = new PublicKey(walletAddress)
    const signatures = await connection.getSignaturesForAddress(pubkey, { limit: 100 })
    console.log(`Found ${signatures.length} transactions`)

    if (!signatures.length) {
      return res.json({
        walletAddress,
        stats: { totalTransactions: 0, dexTrades: 0 },
        trades: []
      })
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
          }
        }
      } catch (err) {
        console.warn(`Error fetching tx ${i}: ${err.message}`)
      }
    }

    console.log(`Found ${trades.length} DEX trades`)

    // Resolve token names
    const allMints = trades.flatMap(t => t.changes.map(c => c.mint))
    await resolveTokenNames(allMints)

    // Calculate PnL
    calculatePnL(trades)
    const pnlStats = calculatePnLStats(trades)

    // Analyze open positions
    const openPositions = await analyzeOpenPositions(walletAddress, trades)

    // Add token symbols to trades
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

    res.json(result)
  } catch (err) {
    console.error('Analysis failed:', err.message)
    res.status(500).json({ error: err.message })
  }
}
