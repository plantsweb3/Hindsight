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

export async function analyzeBehavior(trades, stats, openPositions, onProgress) {
  onProgress?.('Analyzing trading patterns...')

  const response = await fetch(`${API_URL}/analyze-behavior`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trades, stats, openPositions }),
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
