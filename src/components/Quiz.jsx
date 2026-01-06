import { useState, useEffect } from 'react'
import { QUESTIONS, calculateResults } from '../data/quizData'

// Shared Wave Background
function WaveBackground() {
  return (
    <div className="wave-background">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="wave-ring"
          style={{
            '--ring-index': i,
            '--ring-delay': `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  )
}

// Progress Bar
function ProgressBar({ current, total }) {
  const progress = ((current + 1) / total) * 100

  return (
    <div className="quiz-progress">
      <div className="quiz-progress-bar">
        <div
          className="quiz-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="quiz-progress-text">
        {current + 1} / {total}
      </span>
    </div>
  )
}

// Question Card
function QuestionCard({ question, questionIndex, selectedAnswer, onSelect, onNext, onBack, isFirst, isLast }) {
  const [isExiting, setIsExiting] = useState(false)
  const [isEntering, setIsEntering] = useState(true)

  useEffect(() => {
    setIsEntering(true)
    const timer = setTimeout(() => setIsEntering(false), 300)
    return () => clearTimeout(timer)
  }, [questionIndex])

  const handleNext = () => {
    setIsExiting(true)
    setTimeout(() => {
      onNext()
      setIsExiting(false)
    }, 200)
  }

  const handleBack = () => {
    setIsExiting(true)
    setTimeout(() => {
      onBack()
      setIsExiting(false)
    }, 200)
  }

  return (
    <div className={`quiz-question-card glass-card ${isExiting ? 'quiz-exit' : ''} ${isEntering ? 'quiz-enter' : ''}`}>
      <h2 className="quiz-question-text">{question.question}</h2>

      <div className="quiz-options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`quiz-option ${selectedAnswer === index ? 'quiz-option-selected' : ''}`}
            onClick={() => onSelect(index)}
          >
            <span className="quiz-option-letter">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="quiz-option-text">{option.text}</span>
          </button>
        ))}
      </div>

      <div className="quiz-nav">
        {!isFirst && (
          <button className="quiz-nav-btn quiz-nav-back" onClick={handleBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <button
          className="quiz-nav-btn quiz-nav-next"
          onClick={handleNext}
          disabled={selectedAnswer === null}
        >
          {isLast ? 'See Results' : 'Next'}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Main Quiz Component
export default function Quiz({ onComplete, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null))

  const handleSelect = (optionIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion === QUESTIONS.length - 1) {
      // Calculate and return results
      const results = calculateResults(answers)
      onComplete(results)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion === 0) {
      onBack()
    } else {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  return (
    <div className="quiz-page">
      <WaveBackground />

      <header className="quiz-header">
        <a href="/" className="header-logo" onClick={(e) => { e.preventDefault(); onBack(); }}>
          <img src="/hindsightlogo.png" alt="Hindsight" className="header-logo-img" />
          <span className="header-title">hindsight</span>
        </a>
      </header>

      <main className="quiz-content">
        <div className="quiz-intro-text">
          <h1 className="quiz-main-title">What kind of trader are you?</h1>
          <p className="quiz-subtitle">7 questions. Brutal honesty. No judgment.</p>
        </div>

        <ProgressBar current={currentQuestion} total={QUESTIONS.length} />

        <QuestionCard
          question={QUESTIONS[currentQuestion]}
          questionIndex={currentQuestion}
          selectedAnswer={answers[currentQuestion]}
          onSelect={handleSelect}
          onNext={handleNext}
          onBack={handleBack}
          isFirst={currentQuestion === 0}
          isLast={currentQuestion === QUESTIONS.length - 1}
        />
      </main>
    </div>
  )
}
