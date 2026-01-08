import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AcademyOnboarding from './AcademyOnboarding'
import XPBar from './XPBar'
import AuthModal from '../AuthModal'

function AcademyHeader() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="academy-header">
      <div className="academy-header-left">
        <Link to="/" className="academy-logo">
          <img src="/hindsightlogo.png" alt="Hindsight" className="academy-logo-img" />
          <span className="academy-logo-text">hindsight</span>
        </Link>
        <span className="academy-badge">Academy</span>
      </div>
      <div className="academy-header-center">
        {isAuthenticated && <XPBar compact />}
      </div>
      <nav className="academy-nav">
        <Link to="/academy" className="academy-nav-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Home
        </Link>
        <Link to="/" className="academy-nav-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to App
        </Link>
      </nav>
    </header>
  )
}

function RippleBackground() {
  return (
    <div className="ripple-background">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="ripple-ring"
          style={{ '--ring-index': i, '--ring-delay': `${i * 0.8}s` }}
        />
      ))}
    </div>
  )
}

export default function AcademyLayout() {
  const navigate = useNavigate()
  const { isAuthenticated, user, token } = useAuth()
  const [isOnboarded, setIsOnboarded] = useState(null) // null = loading, true/false = status
  const [onboardingData, setOnboardingData] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode)
    setShowAuthModal(true)
  }

  useEffect(() => {
    checkOnboardingStatus()
  }, [isAuthenticated, token])

  const checkOnboardingStatus = async () => {
    // First check localStorage (works for both logged in and guest users)
    const localData = localStorage.getItem('academy_onboarding')
    if (localData) {
      try {
        const parsed = JSON.parse(localData)
        if (parsed.onboarded) {
          setOnboardingData(parsed)
          setIsOnboarded(true)
          return
        }
      } catch (e) {
        // Invalid localStorage data, continue
      }
    }

    // If logged in, check database
    if (isAuthenticated && token) {
      try {
        const res = await fetch('/api/academy/onboarding', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          if (data.onboarded) {
            setOnboardingData(data)
            setIsOnboarded(true)
            // Sync to localStorage
            localStorage.setItem('academy_onboarding', JSON.stringify({
              ...data,
              onboarded: true,
            }))
            return
          }
        }
      } catch (err) {
        console.error('Failed to check onboarding status:', err)
      }
    }

    // Not onboarded
    setIsOnboarded(false)
  }

  const handleOnboardingComplete = (startSection) => {
    setOnboardingData({
      startSection: startSection.section,
      onboarded: true,
    })
    setIsOnboarded(true)
    // Navigate to dashboard
    navigate('/academy')
  }

  // Loading state
  if (isOnboarded === null) {
    return (
      <div className="academy-page">
        <RippleBackground />
        <div className="academy-loading">
          <div className="spinner" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Show onboarding if not completed
  if (!isOnboarded) {
    return (
      <div className="academy-page">
        <RippleBackground />
        <AcademyOnboarding onComplete={handleOnboardingComplete} />
      </div>
    )
  }

  // Show regular Academy content
  return (
    <div className="academy-page">
      <RippleBackground />
      <AcademyHeader />
      <main className="academy-main">
        <Outlet context={{ isAuthenticated, user, onboardingData, openAuthModal }} />
      </main>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
    </div>
  )
}
