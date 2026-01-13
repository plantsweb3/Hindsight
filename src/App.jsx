import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AchievementProvider } from './contexts/AchievementContext'
import { analyzeWallet, analyzeBehavior, isValidSolanaAddress, convertTradesToJournalEntries, createJournalEntriesBatch, getJournalPatterns, getCrossWalletStats } from './services/solana'
import { getUserFriendlyError } from './utils/helpers'
import { ARCHETYPES } from './data/quizData'
import LandingPageV2 from './components/LandingPageV2'
import Quiz from './components/Quiz'
import QuizResult from './components/QuizResult'
import Results from './components/Results'
import Dashboard from './components/Dashboard'
import Journal from './components/Journal'
import Settings from './components/Settings'
import AuthModal from './components/AuthModal'
import ProFeatures from './components/ProFeatures'
import Contact from './components/Contact'
import ReportBug from './components/ReportBug'
import Admin from './components/Admin'
import AcademyLayout from './components/academy/AcademyLayout'
import AcademyDashboard from './components/academy/AcademyDashboard'
import ModuleView from './components/academy/ModuleView'
import LessonView from './components/academy/LessonView'
import ArchetypeModuleView from './components/academy/ArchetypeModuleView'
import ArchetypeLessonView from './components/academy/ArchetypeLessonView'
import MasterExamPage from './components/academy/MasterExamPage'
import CourseRequestsPage from './components/academy/CourseRequestsPage'
import LeaderboardPage from './components/academy/LeaderboardPage'
import Legal from './components/Legal'
import AchievementCelebration from './components/academy/AchievementCelebration'
import LevelUpCelebration from './components/academy/LevelUpCelebration'
import ChatInterface from './components/chat/ChatInterface'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// Protected views that require authentication
const PROTECTED_VIEWS = ['dashboard', 'journal', 'settings']

// Map views to URL paths for persistence
const VIEW_TO_PATH = {
  landing: '/',
  quiz: '/quiz',
  quizResult: '/quiz/result',
  results: '/results',
  dashboard: '/copilot',
  journal: '/journal',
  settings: '/settings',
  pro: '/pro',
  contact: '/contact',
  reportBug: '/report-bug',
  admin: '/salveregina',
}

const PATH_TO_VIEW = Object.entries(VIEW_TO_PATH).reduce((acc, [view, path]) => {
  acc[path] = view
  return acc
}, {})

function AppContent() {
  const { user, token, isAuthenticated, isLoading: authLoading, saveArchetype, saveAnalysis } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Initialize view based on current URL
  const getInitialView = () => {
    const path = window.location.pathname
    return PATH_TO_VIEW[path] || 'landing'
  }

  const [view, setView] = useState(getInitialView) // 'landing' | 'quiz' | 'quizResult' | 'results' | 'dashboard' | 'journal' | 'settings' | 'pro' | 'contact' | 'reportBug' | 'admin'
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [quizResults, setQuizResults] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')
  const [pendingQuizSave, setPendingQuizSave] = useState(null)
  const [pendingJournalRedirect, setPendingJournalRedirect] = useState(false)

  const [isHiddenAdmin, setIsHiddenAdmin] = useState(() => window.location.pathname === '/salveregina')

  // AbortController for cancelling wallet scans
  const abortControllerRef = useRef(null)

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  // Sync URL with view state (push to history when view changes)
  useEffect(() => {
    const targetPath = VIEW_TO_PATH[view]
    // Don't redirect if:
    // - on academy routes
    // - current path is a valid view path (user navigated intentionally, let the other effect catch up)
    const isValidViewPath = PATH_TO_VIEW[location.pathname] !== undefined
    if (targetPath && location.pathname !== targetPath && !location.pathname.startsWith('/academy') && !isValidViewPath) {
      navigate(targetPath, { replace: false })
    }
  }, [view, navigate, location.pathname])

  // Handle URL changes (browser back/forward, direct navigation)
  useEffect(() => {
    const path = location.pathname
    if (path === '/salveregina') {
      setIsHiddenAdmin(true)
      setView('admin')
    } else if (PATH_TO_VIEW[path] && PATH_TO_VIEW[path] !== view) {
      setView(PATH_TO_VIEW[path])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]) // view intentionally omitted to prevent infinite loops

  // Track previous auth state to detect session expiration
  const wasAuthenticated = useRef(false)

  // Reset to landing if auth expires while on protected view
  // Only triggers when auth changes from true to false (not on initial load)
  useEffect(() => {
    if (!authLoading) {
      if (wasAuthenticated.current && !isAuthenticated && PROTECTED_VIEWS.includes(view)) {
        // Session expired - redirect to landing
        setView('landing')
        navigate('/', { replace: true })
      }
      wasAuthenticated.current = isAuthenticated
    }
  }, [isAuthenticated, authLoading, view, navigate])

  // Clear stale state when navigating to views that require data
  useEffect(() => {
    // If on quizResult but no quiz data, redirect to landing
    if (view === 'quizResult' && !quizResults) {
      setView('landing')
    }
    // If on results but no results data, redirect to landing
    if (view === 'results' && !results) {
      setView('landing')
    }
  }, [view, quizResults, results])

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

  const handleCancelScan = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsLoading(false)
    setProgress('')
    setError('Scan cancelled')
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

    // Cancel any existing scan
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new AbortController for this scan
    abortControllerRef.current = new AbortController()

    setError('')
    setIsLoading(true)
    setProgress('Fetching transactions...')

    try {
      // Step 1: Get wallet trades and open positions
      const walletData = await analyzeWallet(walletAddress, setProgress, abortControllerRef.current.signal)

      if (!walletData.trades.length) {
        throw new Error('No trades found for this wallet')
      }

      // Step 2: Analyze behavior with AI (including archetype and journal patterns for personalization)
      setProgress('Analyzing trading patterns...')
      const userArchetype = getUserArchetypeData()

      // Fetch journal patterns if authenticated
      let journalPatterns = null
      let crossWalletStats = null
      if (isAuthenticated && token) {
        journalPatterns = await getJournalPatterns(token)

        // For Pro users with multiple wallets, get cross-wallet comparison data
        if (user?.isPro && user?.savedWallets?.length >= 2) {
          setProgress('Comparing across wallets...')
          crossWalletStats = await getCrossWalletStats(token, user.savedWallets)
        }
      }

      const analysis = await analyzeBehavior(
        walletData.trades,
        walletData.stats,
        walletData.openPositions,
        setProgress,
        userArchetype,
        journalPatterns,
        crossWalletStats
      )

      // Save analysis and create journal entries if logged in
      if (isAuthenticated && token) {
        try {
          await saveAnalysis(walletAddress, analysis, walletData.stats)

          // Auto-create journal entries from closed trades (with wallet address for filtering)
          const journalEntries = convertTradesToJournalEntries(walletData.trades, walletAddress)
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
      // Don't show error for cancelled scans (already handled in handleCancelScan)
      if (err.name === 'AbortError') {
        return
      }
      console.error('Analysis failed:', err)
      setError(getUserFriendlyError(err))
    } finally {
      setIsLoading(false)
      setProgress('')
      abortControllerRef.current = null
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

        // Also create journal entries from the trades (with wallet address)
        if (analysisData.trades?.length > 0) {
          const journalEntries = convertTradesToJournalEntries(analysisData.trades, analysisData.walletAddress)
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

    // Close the auth modal
    setShowAuthModal(false)
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

  const handleOpenContact = () => {
    setView('contact')
  }

  const handleOpenReportBug = () => {
    setView('reportBug')
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

  if (view === 'dashboard') {
    // If not authenticated, show auth modal to login
    if (!isAuthenticated) {
      return (
        <>
          <LandingPage
            onAnalyze={handleAnalyze}
            onStartQuiz={handleStartQuiz}
            onShowAuth={handleShowAuth}
            onOpenDashboard={handleOpenDashboard}
            onOpenJournal={handleOpenJournal}
            onOpenSettings={handleOpenSettings}
            onOpenPro={handleOpenPro}
            onOpenContact={handleOpenContact}
            isLoading={isLoading}
            progress={progress}
            error={error}
            onDismissError={() => setError('')}
            isAuthenticated={isAuthenticated}
            user={user}
          />
          <AuthModal
            isOpen={true}
            onClose={() => setView('landing')}
            onSuccess={() => {}}
            initialMode="login"
          />
        </>
      )
    }
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

  if (view === 'contact') {
    return (
      <Contact
        onBack={handleReset}
        onOpenReportBug={handleOpenReportBug}
      />
    )
  }

  if (view === 'reportBug') {
    return (
      <ReportBug
        onBack={handleOpenContact}
      />
    )
  }

  if (view === 'admin' && (isAuthenticated || isHiddenAdmin)) {
    return (
      <Admin
        onBack={handleReset}
        isHiddenRoute={isHiddenAdmin}
      />
    )
  }

  return (
    <>
      <LandingPageV2
        onAnalyze={handleAnalyze}
        onStartQuiz={handleStartQuiz}
        onShowAuth={handleShowAuth}
        onOpenDashboard={handleOpenDashboard}
        onOpenJournal={handleOpenJournal}
        onOpenSettings={handleOpenSettings}
        onOpenPro={handleOpenPro}
        onOpenContact={handleOpenContact}
        isLoading={isLoading}
        progress={progress}
        error={error}
        onDismissError={() => setError('')}
        isAuthenticated={isAuthenticated}
        user={user}
        onCancelScan={handleCancelScan}
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
      <AchievementProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Academy - URL-based routing */}
            <Route path="/academy" element={<AcademyLayout />}>
              <Route index element={<AcademyDashboard />} />
              <Route path="archetype-master-exam" element={<MasterExamPage />} />
              <Route path="course-requests" element={<CourseRequestsPage />} />
              <Route path="archetype/:archetypeId" element={<ArchetypeModuleView />} />
              <Route path="archetype/:archetypeId/:lessonSlug" element={<ArchetypeLessonView />} />
              <Route path=":moduleSlug" element={<ModuleView />} />
              <Route path=":moduleSlug/:lessonSlug" element={<LessonView />} />
            </Route>

            {/* Leaderboard - standalone page */}
            <Route path="/leaderboard" element={<LeaderboardPage />} />

            {/* Legal pages - Privacy Policy and Terms of Service */}
            <Route path="/legal/:page" element={<Legal />} />

            {/* AI Coach - requires authentication */}
            <Route path="/coach" element={<ChatInterface />} />

            {/* Everything else - existing state-based */}
            <Route path="/*" element={<AppContent />} />
          </Routes>
          {/* Achievement celebration modal - shows anywhere in the app */}
          <AchievementCelebration />
          {/* Level up celebration modal - shows anywhere in the app */}
          <LevelUpCelebration />
        </BrowserRouter>
        <Analytics />
        <SpeedInsights />
      </AchievementProvider>
    </AuthProvider>
  )
}
