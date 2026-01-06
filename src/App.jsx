import { useState } from 'react'
import { analyzeWallet, analyzeBehavior, isValidSolanaAddress } from './services/solana'
import LandingPage from './components/LandingPage'
import Quiz from './components/Quiz'
import QuizResult from './components/QuizResult'
import Results from './components/Results'

export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'quiz' | 'quizResult' | 'results'
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [quizResults, setQuizResults] = useState(null)

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
      setView('results')
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
    setQuizResults(null)
    setError('')
    setView('landing')
  }

  const handleStartQuiz = () => {
    setView('quiz')
  }

  const handleQuizComplete = (results) => {
    setQuizResults(results)
    setView('quizResult')
  }

  const handleQuizBack = () => {
    setView('landing')
  }

  const handleRetakeQuiz = () => {
    setQuizResults(null)
    setView('quiz')
  }

  const handleAnalyzeFromQuiz = (walletAddress) => {
    handleAnalyze(walletAddress)
  }

  // Render based on current view
  if (view === 'results' && results) {
    return (
      <Results
        analysis={results.analysis}
        stats={results.stats}
        onReset={handleReset}
      />
    )
  }

  if (view === 'quizResult' && quizResults) {
    return (
      <QuizResult
        results={quizResults}
        onAnalyze={handleAnalyzeFromQuiz}
        onRetake={handleRetakeQuiz}
        onBack={handleReset}
      />
    )
  }

  if (view === 'quiz') {
    return (
      <Quiz
        onComplete={handleQuizComplete}
        onBack={handleQuizBack}
      />
    )
  }

  return (
    <LandingPage
      onAnalyze={handleAnalyze}
      onStartQuiz={handleStartQuiz}
      isLoading={isLoading}
      progress={progress}
      error={error}
    />
  )
}
