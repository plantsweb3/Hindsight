import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// Welcome screen
function WelcomeScreen({ onNext }) {
  return (
    <div className="onboarding-screen welcome-screen">
      <div className="welcome-icon">
        <img src="/hindsightlogo.png" alt="Hindsight" className="welcome-logo" />
      </div>
      <h1 className="onboarding-title">Welcome to Hindsight Academy</h1>
      <p className="onboarding-subtitle">Learn to trade memecoins with confidence</p>
      <button onClick={onNext} className="onboarding-btn onboarding-btn-primary">
        Get Started
      </button>
    </div>
  )
}

// Simple choice screen - brand new or test knowledge
function ChoiceScreen({ onBrandNew, onTakeTest, onBack }) {
  return (
    <div className="onboarding-screen">
      <h2 className="onboarding-question">Where would you like to start?</h2>
      <p className="onboarding-hint">
        New to memecoins? Start from the beginning. Already trading? Test out of the basics.
      </p>
      <div className="decision-buttons">
        <button
          onClick={onBrandNew}
          className="decision-btn decision-btn-secondary"
        >
          <span className="decision-icon">🌱</span>
          <span className="decision-title">I'm brand new</span>
          <span className="decision-desc">Start from the beginning</span>
        </button>
        <button
          onClick={onTakeTest}
          className="decision-btn decision-btn-primary"
        >
          <span className="decision-icon">🎯</span>
          <span className="decision-title">Test my knowledge</span>
          <span className="decision-desc">Skip what you already know</span>
        </button>
      </div>
      <div className="onboarding-actions">
        <button onClick={onBack} className="onboarding-btn onboarding-btn-secondary">
          Back
        </button>
      </div>
    </div>
  )
}

// Main onboarding component
export default function AcademyOnboarding({ onComplete }) {
  const { token, isAuthenticated } = useAuth()
  const [screen, setScreen] = useState('welcome') // welcome, choice
  const [isSubmitting, setIsSubmitting] = useState(false)

  const saveOnboarding = async (startSection, showPlacementTest = false) => {
    const data = {
      startSection,
      showPlacementTest,
    }

    // Save to localStorage
    localStorage.setItem('academy_onboarding', JSON.stringify({
      ...data,
      onboarded: true,
    }))

    // If logged in, save to database
    if (isAuthenticated && token) {
      try {
        setIsSubmitting(true)
        await fetch('/api/academy/onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ startSection }),
        })
      } catch (err) {
        console.error('Failed to save onboarding:', err)
      } finally {
        setIsSubmitting(false)
      }
    }

    // Call completion callback
    onComplete({ section: startSection })
  }

  const handleWelcomeNext = () => setScreen('choice')
  const handleChoiceBack = () => setScreen('welcome')

  const handleBrandNew = () => {
    saveOnboarding('newcomer', false)
  }

  const handleTakeTest = () => {
    // Save onboarding with flag to auto-open placement test
    saveOnboarding('newcomer', true)
  }

  return (
    <div className="academy-onboarding">
      <div className="onboarding-container">
        {screen === 'welcome' && (
          <WelcomeScreen onNext={handleWelcomeNext} />
        )}
        {screen === 'choice' && (
          <ChoiceScreen
            onBrandNew={handleBrandNew}
            onTakeTest={handleTakeTest}
            onBack={handleChoiceBack}
          />
        )}
      </div>
    </div>
  )
}
