import { useState, useEffect } from 'react'

export default function QuizQuestion({
  question,
  questionNumber,
  answer,
  onAnswer,
  showExplanation,
  isCorrect,
  disabled,
}) {
  // For select-all, track multiple selections
  const [selectedOptions, setSelectedOptions] = useState([])

  // Sync selectedOptions with answer prop for select-all
  useEffect(() => {
    if (question.type === 'select-all' && Array.isArray(answer)) {
      setSelectedOptions(answer)
    } else if (question.type === 'select-all') {
      setSelectedOptions([])
    }
  }, [question.id, answer, question.type])

  const handleMultipleChoiceSelect = (optionId) => {
    if (disabled) return
    onAnswer(optionId)
  }

  const handleTrueFalseSelect = (value) => {
    if (disabled) return
    onAnswer(value)
  }

  const handleSelectAllToggle = (optionId) => {
    if (disabled) return

    let newSelected
    if (selectedOptions.includes(optionId)) {
      newSelected = selectedOptions.filter(id => id !== optionId)
    } else {
      newSelected = [...selectedOptions, optionId]
    }
    setSelectedOptions(newSelected)
    onAnswer(newSelected)
  }

  const getOptionClass = (optionId) => {
    let baseClass = 'quiz-option'

    if (question.type === 'select-all') {
      if (selectedOptions.includes(optionId)) {
        baseClass += ' selected'
      }
    } else {
      if (answer === optionId) {
        baseClass += ' selected'
      }
    }

    // Show correct/incorrect styling after submission
    if (showExplanation) {
      if (question.type === 'select-all') {
        const isCorrectAnswer = question.correctAnswers?.includes(optionId)
        const wasSelected = selectedOptions.includes(optionId)

        if (isCorrectAnswer && wasSelected) {
          baseClass += ' correct'
        } else if (isCorrectAnswer && !wasSelected) {
          baseClass += ' missed'
        } else if (!isCorrectAnswer && wasSelected) {
          baseClass += ' incorrect'
        }
      } else {
        const isCorrectAnswer = optionId === question.correctAnswer
        const wasSelected = answer === optionId

        if (isCorrectAnswer) {
          baseClass += ' correct'
        } else if (wasSelected && !isCorrectAnswer) {
          baseClass += ' incorrect'
        }
      }
    }

    return baseClass
  }

  const getTrueFalseClass = (value) => {
    let baseClass = 'quiz-option quiz-tf-option'

    if (answer === value) {
      baseClass += ' selected'
    }

    if (showExplanation) {
      if (value === question.correctAnswer) {
        baseClass += ' correct'
      } else if (answer === value) {
        baseClass += ' incorrect'
      }
    }

    return baseClass
  }

  return (
    <div className="quiz-question">
      <div className="quiz-question-header">
        <span className="quiz-question-number">Q{questionNumber}</span>
        <span className="quiz-question-type">
          {question.type === 'multiple-choice' && 'Multiple Choice'}
          {question.type === 'true-false' && 'True or False'}
          {question.type === 'select-all' && 'Select All That Apply'}
        </span>
      </div>

      <h3 className="quiz-question-text">{question.question}</h3>

      {/* Multiple Choice */}
      {question.type === 'multiple-choice' && (
        <div className="quiz-options">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleMultipleChoiceSelect(option.id)}
              className={getOptionClass(option.id)}
              disabled={disabled}
            >
              <span className="quiz-option-letter">{option.id.toUpperCase()}</span>
              <span className="quiz-option-text">{option.text}</span>
              {showExplanation && option.id === question.correctAnswer && (
                <span className="quiz-option-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* True/False */}
      {question.type === 'true-false' && (
        <div className="quiz-options quiz-tf-options">
          <button
            onClick={() => handleTrueFalseSelect(true)}
            className={getTrueFalseClass(true)}
            disabled={disabled}
          >
            <span className="quiz-option-text">True</span>
            {showExplanation && question.correctAnswer === true && (
              <span className="quiz-option-check">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </button>
          <button
            onClick={() => handleTrueFalseSelect(false)}
            className={getTrueFalseClass(false)}
            disabled={disabled}
          >
            <span className="quiz-option-text">False</span>
            {showExplanation && question.correctAnswer === false && (
              <span className="quiz-option-check">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </button>
        </div>
      )}

      {/* Select All */}
      {question.type === 'select-all' && (
        <div className="quiz-options quiz-select-all">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelectAllToggle(option.id)}
              className={getOptionClass(option.id)}
              disabled={disabled}
            >
              <span className="quiz-option-checkbox">
                {selectedOptions.includes(option.id) ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <polyline points="9 12 11 14 15 10" fill="none" stroke="#0a0a0f" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                  </svg>
                )}
              </span>
              <span className="quiz-option-text">{option.text}</span>
              {showExplanation && question.correctAnswers?.includes(option.id) && (
                <span className="quiz-option-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Explanation */}
      {showExplanation && (
        <div className={`quiz-explanation ${isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="quiz-explanation-header">
            {isCorrect ? (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <span>Correct!</span>
              </>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
                <span>Incorrect</span>
              </>
            )}
          </div>
          <p className="quiz-explanation-text">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
