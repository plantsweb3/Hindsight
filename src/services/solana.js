// Use relative path - works for both local dev (via Vite proxy) and Vercel
const API_URL = '/api'

export function isValidSolanaAddress(address) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
}

export async function analyzeWallet(walletAddress, onProgress) {
  if (!isValidSolanaAddress(walletAddress)) {
    throw new Error('Invalid Solana wallet address')
  }

  onProgress?.('Fetching transactions...')

  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `Server error: ${response.status}`)
  }

  const result = await response.json()

  console.log('=== WALLET ANALYSIS ===')
  console.log('Stats:', result.stats)
  console.log('Trades:', result.trades)

  return result
}

export async function analyzeBehavior(trades, stats, openPositions, onProgress, userArchetype, journalPatterns) {
  onProgress?.('Analyzing trading patterns...')

  const response = await fetch(`${API_URL}/analyze-behavior`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trades, stats, openPositions, userArchetype, journalPatterns }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `AI analysis failed: ${response.status}`)
  }

  const analysis = await response.json()

  console.log('=== BEHAVIORAL ANALYSIS ===')
  console.log(analysis)

  return analysis
}

// Convert trades from wallet analysis to journal entry format
export function convertTradesToJournalEntries(trades) {
  // Group trades by token to calculate entries/exits
  const tokenTrades = new Map()

  for (const trade of trades) {
    const tokenMint = trade.changes?.find(c => c.mint !== 'SOL' && !['USDC', 'USDT'].includes(c.symbol))?.mint
    if (!tokenMint) continue

    if (!tokenTrades.has(tokenMint)) {
      tokenTrades.set(tokenMint, { buys: [], sells: [] })
    }

    if (trade.type === 'buy') {
      tokenTrades.get(tokenMint).buys.push(trade)
    } else if (trade.type === 'sell') {
      tokenTrades.get(tokenMint).sells.push(trade)
    }
  }

  const journalEntries = []

  // For each token, match sells with buys (FIFO)
  for (const [tokenMint, { buys, sells }] of tokenTrades) {
    // Sort by timestamp
    buys.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    sells.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    let buyIndex = 0

    for (const sell of sells) {
      if (buyIndex >= buys.length) break

      const buy = buys[buyIndex]
      buyIndex++

      // Calculate hold duration
      const entryTime = new Date(buy.timestamp)
      const exitTime = new Date(sell.timestamp)
      const holdMs = exitTime - entryTime
      const holdDuration = formatHoldDuration(holdMs)

      // Get token info
      const tokenChange = sell.changes?.find(c => c.mint === tokenMint)
      const solChange = sell.changes?.find(c => c.mint === 'SOL')
      const buyTokenChange = buy.changes?.find(c => c.mint === tokenMint)
      const buySolChange = buy.changes?.find(c => c.mint === 'SOL')

      if (!tokenChange || !solChange) continue

      // Calculate prices
      const entryPrice = buySolChange && buyTokenChange
        ? Math.abs(buySolChange.change) / Math.abs(buyTokenChange.change)
        : null
      const exitPrice = solChange && tokenChange
        ? Math.abs(solChange.change) / Math.abs(tokenChange.change)
        : null

      // Calculate PnL
      const positionSize = buySolChange ? Math.abs(buySolChange.change) : null
      const pnlSol = solChange && buySolChange
        ? Math.abs(solChange.change) - Math.abs(buySolChange.change)
        : null
      const pnlPercent = entryPrice && exitPrice
        ? ((exitPrice - entryPrice) / entryPrice) * 100
        : null

      journalEntries.push({
        tokenAddress: tokenMint,
        tokenName: tokenChange.symbol || tokenMint.slice(0, 8),
        entryPrice,
        entryTime: buy.timestamp,
        exitPrice,
        exitTime: sell.timestamp,
        positionSize,
        pnlSol,
        pnlPercent,
        holdDuration,
      })
    }
  }

  return journalEntries
}

function formatHoldDuration(ms) {
  if (ms < 60000) return '<1m'
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m`
  if (ms < 86400000) return `${Math.floor(ms / 3600000)}h`
  return `${Math.floor(ms / 86400000)}d`
}

export async function createJournalEntriesBatch(entries, token) {
  if (!entries.length || !token) return null

  const response = await fetch('/api/journal/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ trades: entries }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to create journal entries')
  }

  return response.json()
}

export async function getJournalPatterns(token) {
  if (!token) return null

  try {
    const response = await fetch('/api/journal/patterns', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) return null
    return response.json()
  } catch (err) {
    console.warn('Failed to fetch journal patterns:', err)
    return null
  }
}
