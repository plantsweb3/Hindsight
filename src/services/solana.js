// Use relative path - works for both local dev (via Vite proxy) and Vercel
const API_URL = '/api'

// TODO: Update SIGHT_CA with actual contract address at launch
const SIGHT_CA = 'PLACEHOLDER_UPDATE_AT_LAUNCH'

// Check if a trade involves the $SIGHT token (excluded from analytics)
function involvesSightToken(trade) {
  if (!trade?.changes || SIGHT_CA === 'PLACEHOLDER_UPDATE_AT_LAUNCH') return false
  return trade.changes.some(c => c.mint === SIGHT_CA)
}

export function isValidSolanaAddress(address) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
}

export async function analyzeWallet(walletAddress, onProgress, abortSignal) {
  if (!isValidSolanaAddress(walletAddress)) {
    throw new Error('Invalid Solana wallet address')
  }

  onProgress?.('Fetching full trade history (this may take 30-60 seconds)...')

  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress }),
    signal: abortSignal,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `Server error: ${response.status}`)
  }

  const result = await response.json()

  return result
}

export async function analyzeBehavior(trades, stats, openPositions, onProgress, userArchetype, journalPatterns, crossWalletStats = null) {
  onProgress?.('Analyzing trading patterns...')

  const response = await fetch(`${API_URL}/analyze-behavior`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trades, stats, openPositions, userArchetype, journalPatterns, crossWalletStats }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `AI analysis failed: ${response.status}`)
  }

  const analysis = await response.json()

  return analysis
}

// Convert trades from wallet analysis to journal entry format
export function convertTradesToJournalEntries(trades, walletAddress = null) {
  // Group trades by token to calculate entries/exits
  const tokenTrades = new Map()

  for (const trade of trades) {
    // Skip $SIGHT token trades
    if (involvesSightToken(trade)) continue

    const tokenMint = trade.changes?.find(c => c.mint !== 'SOL' && !['USDC', 'USDT'].includes(c.symbol))?.mint
    if (!tokenMint) continue

    // Also skip if the token itself is SIGHT
    if (tokenMint === SIGHT_CA) continue

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
        walletAddress,
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
    body: JSON.stringify({ entries }),
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

// Get cross-wallet performance stats for Pro users
export async function getCrossWalletStats(token, savedWallets) {
  if (!token || !savedWallets || savedWallets.length < 2) return null

  try {
    // Fetch all journal entries
    const response = await fetch('/api/journal?limit=500', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) return null
    const entries = await response.json()

    // Normalize wallets (handle string[] and object[] formats)
    const wallets = savedWallets.map(w =>
      typeof w === 'string' ? { address: w, label: 'Unlabeled' } : w
    )

    // Group entries by wallet address
    const walletStats = new Map()

    for (const wallet of wallets) {
      walletStats.set(wallet.address, {
        address: wallet.address,
        label: wallet.label,
        trades: 0,
        wins: 0,
        losses: 0,
        totalPnlSol: 0,
        avgPnlPercent: 0,
        pnlPercentSum: 0,
      })
    }

    // Calculate stats per wallet
    for (const entry of entries) {
      if (!entry.walletAddress) continue

      // Skip $SIGHT token entries from cross-wallet stats
      if (entry.tokenAddress === SIGHT_CA) continue

      const stats = walletStats.get(entry.walletAddress)
      if (!stats) continue

      stats.trades++
      if (entry.pnlSol > 0) stats.wins++
      else if (entry.pnlSol < 0) stats.losses++
      stats.totalPnlSol += entry.pnlSol || 0
      stats.pnlPercentSum += entry.pnlPercent || 0
    }

    // Calculate averages and win rates
    const result = []
    for (const [address, stats] of walletStats) {
      if (stats.trades === 0) continue

      result.push({
        address: stats.address,
        label: stats.label,
        trades: stats.trades,
        wins: stats.wins,
        losses: stats.losses,
        totalPnlSol: Math.round(stats.totalPnlSol * 1000) / 1000,
        winRate: stats.trades > 0
          ? `${Math.round((stats.wins / stats.trades) * 100)}%`
          : '0%',
        avgPnlPercent: stats.trades > 0
          ? Math.round(stats.pnlPercentSum / stats.trades)
          : 0,
      })
    }

    return result.length >= 2 ? result : null
  } catch (err) {
    console.warn('Failed to fetch cross-wallet stats:', err)
    return null
  }
}
