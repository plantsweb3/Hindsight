import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { analyzeWallet, analyzeBehavior, isValidSolanaAddress, convertTradesToJournalEntries, createJournalEntriesBatch, getJournalPatterns } from './services/solana'
import { ARCHETYPES } from './data/quizData'
import LandingPage from './components/LandingPage'
import Quiz from './components/Quiz'
import QuizResult from './components/QuizResult'
import Results from './components/Results'
import Dashboard from './components/Dashboard'
import Journal from './components/Journal'
import Settings from './components/Settings'
import AuthModal from './components/AuthModal'

function AppContent() {
  const { user, token, isAuthenticated, isLoading: authLoading, saveArchetype, saveAnalysis } = useAuth()

  const [view, setView] = useState('landing') // 'landing' | 'quiz' | 'quizResult' | 'results' | 'dashboard' | 'journal' | 'settings'
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [quizResults, setQuizResults] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')
  const [pendingQuizSave, setPendingQuizSave] = useState(null)
  const [pendingJournalRedirect, setPendingJournalRedirect] = useState(false)

  // Build archetype data for personalized AI analysis
  const getUserArchetypeData = () => {
    const archetype = quizResults?.primary || user?.primaryArchetype
    if (!archetype || !ARCHETYPES[archetype]) return null

    const data = ARCHETYPES[archetype]
    return {
      primary: data.name,
      secondary: ARCHETYPES[quizResults?.secondary || user?.secondaryArchetype]?.name || null,
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      coaching: data.coaching,
    }
  }

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

      // Step 2: Analyze behavior with AI (including archetype and journal patterns for personalization)
      setProgress('Analyzing trading patterns...')
      const userArchetype = getUserArchetypeData()

      // Fetch journal patterns if authenticated
      let journalPatterns = null
      if (isAuthenticated && token) {
        journalPatterns = await getJournalPatterns(token)
      }

      const analysis = await analyzeBehavior(
        walletData.trades,
        walletData.stats,
        walletData.openPositions,
        setProgress,
        userArchetype,
        journalPatterns
      )

      // Save analysis and create journal entries if logged in
      if (isAuthenticated && token) {
        try {
          await saveAnalysis(walletAddress, analysis, walletData.stats)

          // Auto-create journal entries from closed trades
          const journalEntries = convertTradesToJournalEntries(walletData.trades)
          if (journalEntries.length > 0) {
            const result = await createJournalEntriesBatch(journalEntries, token)
            console.log(`Created ${result?.created || 0} journal entries, skipped ${result?.skipped || 0} duplicates`)
          }
        } catch (err) {
          console.error('Failed to save analysis or journal entries:', err)
        }
      }

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

  const handleQuizComplete = async (results) => {
    setQuizResults(results)

    // If logged in, save archetype
    if (isAuthenticated) {
      try {
        await saveArchetype(results.primary, results.secondary, results.answers)
      } catch (err) {
        console.error('Failed to save archetype:', err)
      }
    }

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

  const handleShowAuth = (mode = 'login') => {
    setAuthModalMode(mode)
    setShowAuthModal(true)
  }

  const handleAuthSuccess = async () => {
    // If there were pending quiz results to save, save them now
    if (pendingQuizSave) {
      try {
        await saveArchetype(pendingQuizSave.primary, pendingQuizSave.secondary, pendingQuizSave.answers)
      } catch (err) {
        console.error('Failed to save pending archetype:', err)
      }
      setPendingQuizSave(null)
    }

    // If user was trying to start tracking, redirect to journal
    if (pendingJournalRedirect) {
      setPendingJournalRedirect(false)
      setView('journal')
    }
  }

  const handleStartTrackingAuth = (mode = 'signup') => {
    // User wants to start tracking but isn't logged in
    setPendingJournalRedirect(true)
    setAuthModalMode(mode)
    setShowAuthModal(true)
  }

  const handleSaveQuizPrompt = () => {
    // User wants to save quiz results but isn't logged in
    setPendingQuizSave(quizResults)
    setAuthModalMode('signup')
    setShowAuthModal(true)
  }

  const handleOpenDashboard = () => {
    setView('dashboard')
  }

  const handleOpenJournal = () => {
    setView('journal')
  }

  const handleOpenSettings = () => {
    setView('settings')
  }

  const handleSettingsNavigate = (page) => {
    if (page === 'dashboard') setView('dashboard')
    else if (page === 'journal') setView('journal')
    else if (page === 'landing') setView('landing')
    else if (page === 'settings') setView('settings')
  }

  const handleJournalAnalyze = () => {
    setView('landing')
  }

  const handleDashboardAnalyze = (walletAddress) => {
    if (walletAddress) {
      handleAnalyze(walletAddress)
    } else {
      setView('landing')
    }
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  // Render based on current view
  if (view === 'results' && results) {
    return (
      <>
        <Results
          analysis={results.analysis}
          stats={results.stats}
          onReset={handleReset}
          isAuthenticated={isAuthenticated}
          onShowAuth={handleStartTrackingAuth}
          onOpenJournal={handleOpenJournal}
        />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          initialMode={authModalMode}
        />
      </>
    )
  }

  if (view === 'dashboard' && isAuthenticated) {
    return (
      <Dashboard
        onBack={handleReset}
        onAnalyze={handleDashboardAnalyze}
        onRetakeQuiz={handleRetakeQuiz}
        onOpenJournal={handleOpenJournal}
        onOpenSettings={handleOpenSettings}
      />
    )
  }

  if (view === 'journal' && isAuthenticated) {
    return (
      <Journal
        onBack={handleReset}
        onAnalyze={handleJournalAnalyze}
        onOpenDashboard={handleOpenDashboard}
      />
    )
  }

  if (view === 'settings' && isAuthenticated) {
    return (
      <Settings
        onNavigate={handleSettingsNavigate}
        onRetakeQuiz={handleRetakeQuiz}
      />
    )
  }

  if (view === 'quizResult' && quizResults) {
    return (
      <>
        <QuizResult
          results={quizResults}
          onAnalyze={handleAnalyzeFromQuiz}
          onRetake={handleRetakeQuiz}
          onBack={handleReset}
          isAuthenticated={isAuthenticated}
          onSavePrompt={handleSaveQuizPrompt}
        />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          initialMode={authModalMode}
        />
      </>
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
    <>
      <LandingPage
        onAnalyze={handleAnalyze}
        onStartQuiz={handleStartQuiz}
        onShowAuth={handleShowAuth}
        onOpenDashboard={handleOpenDashboard}
        onOpenJournal={handleOpenJournal}
        isLoading={isLoading}
        progress={progress}
        error={error}
        isAuthenticated={isAuthenticated}
        user={user}
      />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
