import { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
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
import ProFeatures from './components/ProFeatures'

function AppContent() {
  const { user, token, isAuthenticated, isLoading: authLoading, saveArchetype, saveAnalysis } = useAuth()

  const [view, setView] = useState('landing') // 'landing' | 'quiz' | 'quizResult' | 'results' | 'dashboard' | 'journal' | 'settings' | 'pro'
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [quizResults, setQuizResults] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')
  const [pendingQuizSave, setPendingQuizSave] = useState(null)
  const [pendingJournalRedirect, setPendingJournalRedirect] = useState(false)

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

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
      } else {
        // Store in localStorage for saving after signup
        localStorage.setItem('pendingWalletAnalysis', JSON.stringify({
          walletAddress,
          analysis,
          stats: walletData.stats,
          trades: walletData.trades
        }))
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
    console.log('[Quiz] Complete, results:', results.primary, results.secondary)
    console.log('[Quiz] isAuthenticated:', isAuthenticated)

    // If logged in, save archetype immediately
    if (isAuthenticated) {
      try {
        console.log('[Quiz] Saving archetype to API...')
        await saveArchetype(results.primary, results.secondary, results.answers)
        console.log('[Quiz] Archetype saved successfully')
      } catch (err) {
        console.error('[Quiz] Failed to save archetype:', err)
      }
    } else {
      // Store in localStorage for saving after signup
      console.log('[Quiz] Not authenticated, storing in localStorage')
      localStorage.setItem('pendingQuizResults', JSON.stringify(results))
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
    // Get the new token from auth context (it updates after signup/login)
    const newToken = localStorage.getItem('hindsight_token')

    // Save pending quiz results from localStorage
    const pendingQuiz = localStorage.getItem('pendingQuizResults')
    if (pendingQuiz) {
      try {
        const quizData = JSON.parse(pendingQuiz)
        console.log('[Auth] Saving pending quiz results with token:', newToken ? 'present' : 'missing')
        await saveArchetype(quizData.primary, quizData.secondary, quizData.answers, newToken)
        localStorage.removeItem('pendingQuizResults')
        setQuizResults(quizData) // Update state too
        console.log('[Auth] Pending quiz results saved successfully')
      } catch (err) {
        console.error('Failed to save pending quiz results:', err)
      }
    }

    // Also handle the old pendingQuizSave state (for backward compatibility)
    if (pendingQuizSave) {
      try {
        console.log('[Auth] Saving pendingQuizSave with token:', newToken ? 'present' : 'missing')
        await saveArchetype(pendingQuizSave.primary, pendingQuizSave.secondary, pendingQuizSave.answers, newToken)
        console.log('[Auth] pendingQuizSave saved successfully')
      } catch (err) {
        console.error('Failed to save pending archetype:', err)
      }
      setPendingQuizSave(null)
    }

    // Save pending wallet analysis from localStorage
    const pendingAnalysis = localStorage.getItem('pendingWalletAnalysis')
    if (pendingAnalysis && newToken) {
      try {
        const analysisData = JSON.parse(pendingAnalysis)
        await saveAnalysis(analysisData.walletAddress, analysisData.analysis, analysisData.stats)

        // Also create journal entries from the trades
        if (analysisData.trades?.length > 0) {
          const journalEntries = convertTradesToJournalEntries(analysisData.trades)
          if (journalEntries.length > 0) {
            await createJournalEntriesBatch(journalEntries, newToken)
          }
        }
        localStorage.removeItem('pendingWalletAnalysis')
      } catch (err) {
        console.error('Failed to save pending wallet analysis:', err)
      }
    }

    // Redirect to dashboard after signup/login
    if (pendingJournalRedirect) {
      setPendingJournalRedirect(false)
      setView('dashboard')
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

  const handleOpenPro = () => {
    setView('pro')
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
        onOpenPro={handleOpenPro}
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
          user={user}
          onOpenDashboard={handleOpenDashboard}
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

  if (view === 'pro') {
    return (
      <ProFeatures
        onBack={handleReset}
        onVerifySuccess={() => {
          // After successful Pro verification, go to dashboard
          setView('dashboard')
        }}
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
        onOpenPro={handleOpenPro}
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
      <Analytics />
    </AuthProvider>
  )
}
