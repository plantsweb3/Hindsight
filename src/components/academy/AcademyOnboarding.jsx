import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

// Placement test questions
const PLACEMENT_QUESTIONS = [
  {
    question: "What does it mean when a token has 'liquidity locked'?",
    options: [
      "The developer can't remove trading liquidity",
      "You can't sell the token",
      "The price is fixed",
      "Trading is paused"
    ],
    correct: 0
  },
  {
    question: "What is 'market cap' in crypto?",
    options: [
      "The maximum price a token can reach",
      "Total value of all circulating tokens",
      "The amount of money in the liquidity pool",
      "The developer's profit"
    ],
    correct: 1
  },
  {
    question: "What's a common red flag for a potential rug pull?",
    options: [
      "Active GitHub repository",
      "Doxxed team members",
      "Unlocked team tokens with no vesting",
      "Multiple exchange listings"
    ],
    correct: 2
  },
  {
    question: "What does 'DYOR' stand for?",
    options: [
      "Do Your Own Research",
      "Double Your Own Returns",
      "Decide Your Own Risk",
      "Download Your Own Records"
    ],
    correct: 0
  },
  {
    question: "If a token drops 50%, how much gain do you need to break even?",
    options: [
      "50%",
      "75%",
      "100%",
      "150%"
    ],
    correct: 2
  },
  {
    question: "What is a 'stop loss'?",
    options: [
      "A fee for selling too quickly",
      "An automatic sell order at a preset price",
      "The maximum amount you can lose in a day",
      "A type of trading bot"
    ],
    correct: 1
  },
  {
    question: "What does high trading volume usually indicate?",
    options: [
      "The token is about to crash",
      "Strong interest and liquidity",
      "The developer is selling",
      "A bug in the smart contract"
    ],
    correct: 1
  },
  {
    question: "What's 'slippage' in a DEX trade?",
    options: [
      "The fee taken by the exchange",
      "Price difference between expected and actual execution",
      "The time delay in transaction confirmation",
      "A type of trading error"
    ],
    correct: 1
  },
  {
    question: "What's the purpose of taking partial profits?",
    options: [
      "To pay lower taxes",
      "To reduce risk while maintaining upside exposure",
      "To confuse other traders",
      "It's required by most exchanges"
    ],
    correct: 1
  },
  {
    question: "What does 'diamond hands' typically mean?",
    options: [
      "Selling at the first sign of profit",
      "Only buying expensive tokens",
      "Holding through volatility without selling",
      "A type of wallet security"
    ],
    correct: 2
  }
]

// Experience level options
const EXPERIENCE_OPTIONS = [
  { id: 'brand_new', emoji: '🌱', title: 'Brand New', desc: 'Never traded crypto before' },
  { id: 'switching', emoji: '🔄', title: 'Switching Over', desc: 'Traded crypto, new to memecoins' },
  { id: 'active', emoji: '📈', title: 'Active Trader', desc: 'Already trading memecoins' },
  { id: 'profitable', emoji: '💎', title: 'Profitable', desc: 'Consistent profits, want to optimize' }
]

// Goal options
const GOAL_OPTIONS = [
  { id: 'side_income', emoji: '💰', title: 'Side Income', desc: 'Make extra money on the side' },
  { id: 'full_time', emoji: '🚀', title: 'Go Full-Time', desc: 'Replace my job with trading' },
  { id: 'understand', emoji: '🧠', title: 'Understand the Space', desc: 'Learn how it all works' },
  { id: 'sharpen', emoji: '⚡', title: 'Sharpen My Edge', desc: 'Improve my existing strategy' }
]

// Map score to section
function getStartSection(score) {
  if (score >= 10) return { section: 'specialist', name: 'Specialist', module: 4 }
  if (score >= 8) return { section: 'trader', name: 'Trader', module: 3 }
  if (score >= 5) return { section: 'apprentice', name: 'Apprentice', module: 2 }
  return { section: 'newcomer', name: 'Newcomer', module: 1 }
}

// Progress indicator component
function ProgressIndicator({ currentStep, totalSteps }) {
  return (
    <div className="onboarding-progress">
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <span className="progress-text">Step {currentStep} of {totalSteps}</span>
    </div>
  )
}

// Welcome screen
function WelcomeScreen({ onNext }) {
  return (
    <div className="onboarding-screen welcome-screen">
      <div className="welcome-icon">
        <img src="/hindsightlogo.png" alt="Hindsight" className="welcome-logo" />
      </div>
      <h1 className="onboarding-title">Welcome to Hindsight Academy</h1>
      <p className="onboarding-subtitle">Let's personalize your learning path</p>
      <button onClick={onNext} className="onboarding-btn onboarding-btn-primary">
        Get Started
      </button>
    </div>
  )
}

// Experience level screen
function ExperienceScreen({ onNext, onBack, selected, onSelect }) {
  return (
    <div className="onboarding-screen">
      <ProgressIndicator currentStep={1} totalSteps={3} />
      <h2 className="onboarding-question">What's your trading experience?</h2>
      <div className="option-cards">
        {EXPERIENCE_OPTIONS.map(opt => (
          <button
            key={opt.id}
            className={`option-card ${selected === opt.id ? 'selected' : ''}`}
            onClick={() => onSelect(opt.id)}
          >
            <span className="option-emoji">{opt.emoji}</span>
            <span className="option-title">{opt.title}</span>
            <span className="option-desc">{opt.desc}</span>
          </button>
        ))}
      </div>
      <div className="onboarding-actions">
        <button onClick={onBack} className="onboarding-btn onboarding-btn-secondary">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="onboarding-btn onboarding-btn-primary"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// Goals screen
function GoalsScreen({ onNext, onBack, selected, onSelect }) {
  return (
    <div className="onboarding-screen">
      <ProgressIndicator currentStep={2} totalSteps={3} />
      <h2 className="onboarding-question">What's your main goal?</h2>
      <div className="option-cards">
        {GOAL_OPTIONS.map(opt => (
          <button
            key={opt.id}
            className={`option-card ${selected === opt.id ? 'selected' : ''}`}
            onClick={() => onSelect(opt.id)}
          >
            <span className="option-emoji">{opt.emoji}</span>
            <span className="option-title">{opt.title}</span>
            <span className="option-desc">{opt.desc}</span>
          </button>
        ))}
      </div>
      <div className="onboarding-actions">
        <button onClick={onBack} className="onboarding-btn onboarding-btn-secondary">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="onboarding-btn onboarding-btn-primary"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// Placement decision screen
function PlacementDecisionScreen({ onStartFromBeginning, onTakeTest, onBack }) {
  return (
    <div className="onboarding-screen">
      <ProgressIndicator currentStep={3} totalSteps={3} />
      <h2 className="onboarding-question">Want to test out of the basics?</h2>
      <p className="onboarding-hint">
        Take a quick 10-question quiz to see where you should start, or jump right into the fundamentals.
      </p>
      <div className="decision-buttons">
        <button
          onClick={onStartFromBeginning}
          className="decision-btn decision-btn-secondary"
        >
          <span className="decision-icon">📚</span>
          <span className="decision-title">Start from the beginning</span>
          <span className="decision-desc">Build a solid foundation</span>
        </button>
        <button
          onClick={onTakeTest}
          className="decision-btn decision-btn-primary"
        >
          <span className="decision-icon">🎯</span>
          <span className="decision-title">Take placement test</span>
          <span className="decision-desc">10 questions, ~2 minutes</span>
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

// Placement test screen
function PlacementTestScreen({ onComplete, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const question = PLACEMENT_QUESTIONS[currentQuestion]
  const isLastQuestion = currentQuestion === PLACEMENT_QUESTIONS.length - 1

  const handleAnswer = () => {
    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (isLastQuestion) {
      // Calculate score
      const score = newAnswers.reduce((acc, ans, idx) => {
        return acc + (ans === PLACEMENT_QUESTIONS[idx].correct ? 1 : 0)
      }, 0)
      onComplete(score)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  return (
    <div className="onboarding-screen test-screen">
      <div className="test-progress">
        <span className="test-progress-text">
          Question {currentQuestion + 1} of {PLACEMENT_QUESTIONS.length}
        </span>
        <div className="test-progress-bar">
          <div
            className="test-progress-fill"
            style={{ width: `${((currentQuestion + 1) / PLACEMENT_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>
      <h2 className="test-question">{question.question}</h2>
      <div className="test-options">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={`test-option ${selectedAnswer === idx ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer(idx)}
          >
            <span className="test-option-letter">{String.fromCharCode(65 + idx)}</span>
            <span className="test-option-text">{opt}</span>
          </button>
        ))}
      </div>
      <div className="onboarding-actions">
        {currentQuestion === 0 ? (
          <button onClick={onBack} className="onboarding-btn onboarding-btn-secondary">
            Back
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={handleAnswer}
          disabled={selectedAnswer === null}
          className="onboarding-btn onboarding-btn-primary"
        >
          {isLastQuestion ? 'See Results' : 'Next Question'}
        </button>
      </div>
    </div>
  )
}

// Results screen
function ResultsScreen({ score, startSection, onComplete }) {
  const sectionInfo = getStartSection(score)

  const getMessage = () => {
    if (score === 10) return "Perfect score! You clearly know your stuff."
    if (score >= 8) return "Excellent! You have a strong foundation."
    if (score >= 5) return "Good job! You know the basics."
    return "No worries! Everyone starts somewhere."
  }

  return (
    <div className="onboarding-screen results-screen">
      <div className="results-score">
        <span className="score-number">{score}</span>
        <span className="score-total">/10</span>
      </div>
      <h2 className="results-title">
        Starting you at <span className="results-section">{sectionInfo.name}</span>
      </h2>
      <p className="results-message">{getMessage()}</p>
      <p className="results-hint">
        You'll begin with Module {sectionInfo.module}. You can always go back and review earlier content.
      </p>
      <button onClick={onComplete} className="onboarding-btn onboarding-btn-primary">
        Start Learning
      </button>
    </div>
  )
}

// Main onboarding component
export default function AcademyOnboarding({ onComplete }) {
  const navigate = useNavigate()
  const { token, isAuthenticated } = useAuth()
  const [screen, setScreen] = useState('welcome') // welcome, experience, goals, decision, test, results
  const [experienceLevel, setExperienceLevel] = useState(null)
  const [tradingGoal, setTradingGoal] = useState(null)
  const [placementScore, setPlacementScore] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Determine start section based on experience and test
  const getStartSectionFromData = () => {
    if (experienceLevel === 'brand_new') {
      return { section: 'newcomer', name: 'Newcomer', module: 1 }
    }
    if (placementScore !== null) {
      return getStartSection(placementScore)
    }
    return { section: 'newcomer', name: 'Newcomer', module: 1 }
  }

  const saveOnboarding = async (startSectionData) => {
    const data = {
      experienceLevel,
      tradingGoal,
      placementScore,
      startSection: startSectionData.section,
    }

    // Save to localStorage for non-logged-in users or as backup
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
          body: JSON.stringify(data),
        })
      } catch (err) {
        console.error('Failed to save onboarding:', err)
      } finally {
        setIsSubmitting(false)
      }
    }

    // Call completion callback
    onComplete(startSectionData)
  }

  const handleWelcomeNext = () => setScreen('experience')

  const handleExperienceNext = () => setScreen('goals')
  const handleExperienceBack = () => setScreen('welcome')

  const handleGoalsNext = () => {
    // If brand new, skip placement decision
    if (experienceLevel === 'brand_new') {
      const startSection = { section: 'newcomer', name: 'Newcomer', module: 1 }
      saveOnboarding(startSection)
    } else {
      setScreen('decision')
    }
  }
  const handleGoalsBack = () => setScreen('experience')

  const handleStartFromBeginning = () => {
    const startSection = { section: 'newcomer', name: 'Newcomer', module: 1 }
    saveOnboarding(startSection)
  }
  const handleTakeTest = () => setScreen('test')
  const handleDecisionBack = () => setScreen('goals')

  const handleTestComplete = (score) => {
    setPlacementScore(score)
    setScreen('results')
  }
  const handleTestBack = () => setScreen('decision')

  const handleResultsComplete = () => {
    const startSection = getStartSection(placementScore)
    saveOnboarding(startSection)
  }

  return (
    <div className="academy-onboarding">
      <div className="onboarding-container">
        {screen === 'welcome' && (
          <WelcomeScreen onNext={handleWelcomeNext} />
        )}
        {screen === 'experience' && (
          <ExperienceScreen
            onNext={handleExperienceNext}
            onBack={handleExperienceBack}
            selected={experienceLevel}
            onSelect={setExperienceLevel}
          />
        )}
        {screen === 'goals' && (
          <GoalsScreen
            onNext={handleGoalsNext}
            onBack={handleGoalsBack}
            selected={tradingGoal}
            onSelect={setTradingGoal}
          />
        )}
        {screen === 'decision' && (
          <PlacementDecisionScreen
            onStartFromBeginning={handleStartFromBeginning}
            onTakeTest={handleTakeTest}
            onBack={handleDecisionBack}
          />
        )}
        {screen === 'test' && (
          <PlacementTestScreen
            onComplete={handleTestComplete}
            onBack={handleTestBack}
          />
        )}
        {screen === 'results' && (
          <ResultsScreen
            score={placementScore}
            onComplete={handleResultsComplete}
          />
        )}
      </div>
    </div>
  )
}
