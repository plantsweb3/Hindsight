import { useState } from 'react'
import { analyzeWallet, analyzeBehavior, isValidSolanaAddress } from './services/solana'
import Results from './components/Results'

function EyeIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-8"
    >
      <path
        d="M32 12C18 12 6 32 6 32C6 32 18 52 32 52C46 52 58 32 58 32C58 32 46 12 32 12Z"
        stroke="#f5f5f5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="32" cy="32" r="10" stroke="#f5f5f5" strokeWidth="2.5" fill="none" />
      <circle cx="32" cy="32" r="4" fill="#f5f5f5" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white inline-block mr-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function LandingPage({ onAnalyze, isLoading, progress, error }) {
  const [walletAddress, setWalletAddress] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = walletAddress.trim()

    if (!trimmed) {
      setLocalError('Please enter a wallet address')
      return
    }

    if (!isValidSolanaAddress(trimmed)) {
      setLocalError('Invalid Solana wallet address')
      return
    }

    setLocalError('')
    onAnalyze(trimmed)
  }

  const displayError = localError || error

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl text-center flex flex-col items-center">
        <EyeIcon />

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-8 tracking-tight">
          Your wallet history already knows why you're losing
        </h1>

        <p className="text-lg sm:text-xl text-[#888888] mb-12 max-w-lg leading-relaxed">
          Hindsight analyzes any Solana wallet and shows you the behavioral patterns quietly draining your PnL
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-5">
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => {
              setWalletAddress(e.target.value)
              setLocalError('')
            }}
            placeholder="Paste Solana wallet address"
            disabled={isLoading}
            className="w-full px-5 py-4 bg-[#141414] border-2 border-[#252525] rounded-xl text-[#f5f5f5] placeholder-[#555555] text-base focus:outline-none focus:border-[#8b5cf6] transition-colors disabled:opacity-50"
          />

          {displayError && (
            <p className="text-red-400 text-sm">{displayError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-8 py-4 bg-[#8b5cf6] text-white font-semibold rounded-xl text-base hover:bg-[#7c4fe0] transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Spinner />
                {progress || 'Analyzing...'}
              </>
            ) : (
              'Analyze wallet →'
            )}
          </button>
        </form>

        <p className="mt-10 text-sm text-[#555555]">
          No wallet connection. Read-only. Takes ~30 seconds.
        </p>
      </div>
    </main>
  )
}

export default function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)

  const handleAnalyze = async (walletAddress) => {
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
