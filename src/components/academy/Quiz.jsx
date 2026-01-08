import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import QuizQuestion from './QuizQuestion'
import QuizResults from './QuizResults'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function Quiz({ quiz, onComplete, onClose, isModuleTest = false }) {
  const { token, isAuthenticated } = useAuth()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const questions = quiz?.questions || []
  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1
  const hasAnsweredCurrent = answers[currentQuestion?.id] !== undefined

  // Check if current answer is correct (for explanation display)
  const checkCurrentAnswer = () => {
    if (!currentQuestion || !hasAnsweredCurrent) return null

    const userAnswer = answers[currentQuestion.id]

    if (currentQuestion.type === 'multiple-choice') {
      return userAnswer === currentQuestion.correctAnswer
    } else if (currentQuestion.type === 'true-false') {
      return userAnswer === currentQuestion.correctAnswer
    } else if (currentQuestion.type === 'select-all') {
      const userAnswers = Array.isArray(userAnswer) ? userAnswer : []
      const correctAnswers = currentQuestion.correctAnswers || []
      const hasAllCorrect = correctAnswers.every(a => userAnswers.includes(a))
      const hasNoIncorrect = userAnswers.every(a => correctAnswers.includes(a))
      return hasAllCorrect && hasNoIncorrect
    }
    return false
  }

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    setShowExplanation(false)
    setLastAnswerCorrect(null)
  }

  const handleSubmitAnswer = () => {
    const isCorrect = checkCurrentAnswer()
    setLastAnswerCorrect(isCorrect)
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      submitQuiz()
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
      setShowExplanation(false)
      setLastAnswerCorrect(null)
    }
  }

  const submitQuiz = async () => {
    if (!isAuthenticated) {
      setError('You must be logged in to submit the quiz')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/api/academy/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quizId: quiz.lessonSlug || quiz.moduleSlug,
          answers,
          questions,
          isModuleTest,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit quiz')
      }

      const data = await response.json()
      setResults(data)

      if (onComplete) {
        onComplete(data)
      }
    } catch (err) {
      console.error('Quiz submission error:', err)
      setError(err.message || 'Failed to submit quiz')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setShowExplanation(false)
    setLastAnswerCorrect(null)
    setResults(null)
    setError(null)
  }

  // Show results if quiz is complete
  if (results) {
    return (
      <QuizResults
        results={results}
        quiz={quiz}
        onRetry={handleRetry}
        onClose={onClose}
        isModuleTest={isModuleTest}
      />
    )
  }

  if (!currentQuestion) {
    return (
      <div className="quiz-error">
        <p>No questions found for this quiz.</p>
        <button onClick={onClose} className="quiz-close-btn">Close</button>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      {/* Quiz Header */}
      <div className="quiz-header">
        <h2 className="quiz-title">{quiz.title}</h2>
        <div className="quiz-progress">
          <div className="quiz-progress-text">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
          <div className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <button onClick={onClose} className="quiz-close-x" aria-label="Close quiz">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Question */}
      <QuizQuestion
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        answer={answers[currentQuestion.id]}
        onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
        showExplanation={showExplanation}
        isCorrect={lastAnswerCorrect}
        disabled={showExplanation}
      />

      {/* Error */}
      {error && (
        <div className="quiz-error-message">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="quiz-actions">
        {!showExplanation ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!hasAnsweredCurrent}
            className="quiz-submit-btn"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            disabled={isSubmitting}
            className="quiz-next-btn"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-small" />
                Submitting...
              </>
            ) : isLastQuestion ? (
              'See Results'
            ) : (
              'Next Question'
            )}
          </button>
        )}
      </div>
    </div>
  )
}
