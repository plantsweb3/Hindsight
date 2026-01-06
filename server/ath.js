// ATH (All-Time High) data fetching via DexScreener API

// ATH cache (longer TTL since ATH data doesn't change frequently)
const athCache = new Map()
const ATH_CACHE_TTL = 30 * 60 * 1000 // 30 minutes

// Fetch ATH data for a token from DexScreener
export async function getTokenATH(tokenAddress) {
  // Check cache
  const cacheKey = tokenAddress
  const cached = athCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < ATH_CACHE_TTL) {
    return cached.data
  }

  try {
    // DexScreener tokens endpoint returns pair data with price info
    const response = await fetch(
      `https://api.dexscreener.com/tokens/v1/solana/${tokenAddress}`
    )

    if (!response.ok) {
      console.warn(`DexScreener ATH fetch failed for ${tokenAddress}: ${response.status}`)
      return null
    }

    const data = await response.json()

    // DexScreener returns array of pairs for this token
    if (!Array.isArray(data) || data.length === 0) {
      return null
    }

    // Find the pair with highest liquidity (most reliable data)
    const bestPair = data.reduce((best, pair) => {
      const liquidity = pair.liquidity?.usd || 0
      return liquidity > (best?.liquidity?.usd || 0) ? pair : best
    }, data[0])

    if (!bestPair) return null

    // Extract price data
    const currentPrice = parseFloat(bestPair.priceUsd) || 0
    const marketCap = bestPair.marketCap || null

    // Check price changes to estimate ATH
    // priceChange contains h1, h6, h24 percentage changes
    const priceChange = bestPair.priceChange || {}

    // Calculate ATH from available price change data
    let athPrice = currentPrice
    let athMarketCap = marketCap
    let athTime = null

    // If price dropped significantly, ATH was higher
    const changes = [
      { period: 'h1', change: priceChange.h1 },
      { period: 'h6', change: priceChange.h6 },
      { period: 'h24', change: priceChange.h24 },
    ].filter(c => c.change !== undefined && c.change !== null)

    // The most negative change gives us the best ATH estimate
    const maxDrop = changes.reduce((max, c) =>
      (c.change < max.change) ? c : max,
      { change: 0, period: null }
    )

    if (maxDrop.change < -10) {
      // Price dropped, so ATH was higher
      // currentPrice = ATH * (1 + change/100)
      // ATH = currentPrice / (1 + change/100)
      athPrice = currentPrice / (1 + maxDrop.change / 100)

      // Estimate ATH time based on period
      const now = new Date()
      if (maxDrop.period === 'h1') {
        athTime = new Date(now - 30 * 60 * 1000).toISOString() // ~30min ago
      } else if (maxDrop.period === 'h6') {
        athTime = new Date(now - 3 * 60 * 60 * 1000).toISOString() // ~3h ago
      } else if (maxDrop.period === 'h24') {
        athTime = new Date(now - 12 * 60 * 60 * 1000).toISOString() // ~12h ago
      }

      // Scale market cap proportionally
      if (marketCap) {
        athMarketCap = marketCap * (athPrice / currentPrice)
      }
    } else {
      // Current price might be near ATH
      athTime = new Date().toISOString()
    }

    const athData = {
      athPrice,
      athTime,
      athMarketCap,
      currentPrice,
      symbol: bestPair.baseToken?.symbol || tokenAddress.slice(0, 6),
    }

    // Cache the result
    athCache.set(cacheKey, { data: athData, timestamp: Date.now() })

    return athData
  } catch (err) {
    console.warn(`Failed to fetch ATH for ${tokenAddress}:`, err.message)
    return null
  }
}

// Calculate ATH metrics for a trade
export function calculateATHMetrics(athData, exitPrice, exitTime) {
  if (!athData || !athData.athPrice || !exitPrice) {
    return null
  }

  // Convert exit price to USD if needed (assuming exitPrice is already in comparable units)
  const exitVsAthPercent = ((exitPrice - athData.athPrice) / athData.athPrice) * 100

  // Determine timing: did they sell before or after ATH?
  let athTiming = 'unknown'
  if (athData.athTime && exitTime) {
    const exitDate = new Date(exitTime)
    const athDate = new Date(athData.athTime)

    if (exitDate < athDate) {
      athTiming = 'before_ath' // Sold before the peak
    } else {
      athTiming = 'after_ath' // Sold after the peak
    }
  }

  return {
    athPrice: athData.athPrice,
    athTime: athData.athTime,
    athMarketCap: athData.athMarketCap,
    exitVsAthPercent: Math.round(exitVsAthPercent * 10) / 10,
    athTiming,
  }
}

// Batch fetch ATH data for multiple tokens
export async function batchFetchATH(tokenAddresses) {
  const results = new Map()
  const uniqueAddresses = [...new Set(tokenAddresses)]

  // Fetch in parallel with rate limiting (max 5 concurrent)
  const batchSize = 5
  for (let i = 0; i < uniqueAddresses.length; i += batchSize) {
    const batch = uniqueAddresses.slice(i, i + batchSize)
    const promises = batch.map(async (addr) => {
      const ath = await getTokenATH(addr)
      return { address: addr, ath }
    })

    const batchResults = await Promise.all(promises)
    batchResults.forEach(r => results.set(r.address, r.ath))

    // Small delay between batches to avoid rate limiting
    if (i + batchSize < uniqueAddresses.length) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  return results
}

// Enrich trades with ATH data
export async function enrichTradesWithATH(trades) {
  if (!trades || trades.length === 0) return trades

  // Get unique token addresses
  const tokenAddresses = [...new Set(trades.map(t => t.tokenAddress))]

  console.log(`Fetching ATH data for ${tokenAddresses.length} tokens...`)

  // Batch fetch ATH data
  const athDataMap = await batchFetchATH(tokenAddresses)

  // Enrich each trade with ATH metrics
  return trades.map(trade => {
    const athData = athDataMap.get(trade.tokenAddress)

    if (!athData) {
      return trade // No ATH data available
    }

    // We need to compare exit price (in SOL or USD) with ATH price (in USD)
    // For now, we'll use the exitPrice directly if available
    // Note: This might need adjustment based on how prices are stored
    const athMetrics = calculateATHMetrics(athData, trade.exitPrice, trade.exitTime)

    if (!athMetrics) {
      return trade
    }

    return {
      ...trade,
      athPrice: athMetrics.athPrice,
      athTime: athMetrics.athTime,
      athMarketCap: athMetrics.athMarketCap,
      exitVsAthPercent: athMetrics.exitVsAthPercent,
      athTiming: athMetrics.athTiming,
    }
  })
}
