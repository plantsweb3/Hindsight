import { useState } from 'react'
import { analyzeWallet, analyzeBehavior, isValidSolanaAddress } from './services/solana'
import LandingPage from './components/LandingPage'
import Results from './components/Results'

export default function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)

  const handleAnalyze = async (walletAddress) => {
    // Validate
    if (!walletAddress) {
      setError('Please enter a wallet address')
      return
    }

    if (!isValidSolanaAddress(walletAddress)) {
      setError('Invalid Solana wallet address')
      return
    }

    setError('')
    setIsLoading(true)
    setProgress('Fetching transactions...')

    try {
      // Step 1: Get wallet trades and open positions
      const walletData = await analyzeWallet(walletAddress, setProgress)

      if (!walletData.trades.length) {
        throw new Error('No trades found for this wallet')
      }

      // Step 2: Analyze behavior with AI (including open positions)
      setProgress('Analyzing trading patterns...')
      const analysis = await analyzeBehavior(
        walletData.trades,
        walletData.stats,
        walletData.openPositions,
        setProgress
      )

      // Show results
      setResults({
        analysis,
        stats: walletData.stats,
        openPositions: walletData.openPositions,
        walletAddress,
      })
    } catch (err) {
      console.error('Analysis failed:', err)
      setError(err.message || 'Analysis failed')
    } finally {
      setIsLoading(false)
      setProgress('')
    }
  }

  const handleReset = () => {
    setResults(null)
    setError('')
  }

  if (results) {
    return (
      <Results
        analysis={results.analysis}
        stats={results.stats}
        onReset={handleReset}
      />
    )
  }

  return (
    <LandingPage
      onAnalyze={handleAnalyze}
      isLoading={isLoading}
      progress={progress}
      error={error}
    />
  )
}
