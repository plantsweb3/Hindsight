import { useState } from 'react'
import { PLACEMENT_TEST, determinePlacement, calculateSectionScore, LEVEL_INFO } from '../../data/academy/placementTest'

// Question Card Component
function QuestionCard({ question, selected, onSelect, questionNumber }) {
  return (
    <div className="placement-question">
      <h4 className="placement-question-text">
        <span className="question-number">{questionNumber}.</span>
        {question.question}
      </h4>
      <div className="placement-options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`placement-option ${selected === index ? 'selected' : ''}`}
            onClick={() => onSelect(index)}
          >
            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
            <span className="option-text">{option}</span>
            {selected === index && (
              <svg className="option-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// Results Component
function PlacementResults({ answers, onAccept, onStartFromBeginning }) {
  const placementLevel = determinePlacement(answers)
  const levelInfo = LEVEL_INFO[placementLevel]

  // Calculate scores for each section
  const sectionScores = PLACEMENT_TEST.sections.map(section => {
    const score = calculateSectionScore(answers, section.questions)
    const passed = score >= PLACEMENT_TEST.passingThreshold
    return {
      level: section.level,
      name: section.name,
      score: Math.round(score * 100),
      passed
    }
  })

  return (
    <div className="placement-results">
      <div className="placement-results-header">
        <div className="results-icon">{levelInfo.icon}</div>
        <h1 className="results-title">Assessment Complete!</h1>
      </div>

      <div className="placement-level-result">
        <span className="result-label">Your Starting Level</span>
        <div className="result-level">
          <span className="result-level-icon">{levelInfo.icon}</span>
          <span className="result-level-name">{levelInfo.name}</span>
        </div>
        <p className="result-level-desc">{levelInfo.description}</p>
      </div>

      <div className="section-breakdown">
        <h3 className="breakdown-title">Your Scores</h3>
        {sectionScores.map(section => (
          <div key={section.level} className="section-score-row">
            <div className="section-score-info">
              <span className="section-score-name">{section.name}</span>
              <span className="section-score-level">{LEVEL_INFO[section.level]?.icon}</span>
            </div>
            <div className="section-score-bar-container">
              <div className="section-score-bar">
                <div
                  className={`section-score-fill ${section.passed ? 'passed' : ''}`}
                  style={{ width: `${section.score}%` }}
                />
              </div>
              <span className="section-score-percent">{section.score}%</span>
            </div>
            {section.passed && (
              <span className="section-passed-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Passed
              </span>
            )}
          </div>
        ))}
        <p className="passing-note">75% required to pass each section</p>
      </div>

      <p className="result-description">
        Based on your answers, we recommend starting at <strong>{levelInfo.name}</strong>.
        You can always go back and review earlier modules.
      </p>

      <div className="results-actions">
        <button className="results-btn primary" onClick={() => onAccept(placementLevel)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Start Learning at {levelInfo.name}
        </button>
        <button className="results-btn secondary" onClick={onStartFromBeginning}>
          Start from Beginning Instead
        </button>
      </div>
    </div>
  )
}

// Main Placement Test Component
export default function PlacementTest({ onComplete, onCancel }) {
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const sections = PLACEMENT_TEST.sections
  const currentSectionData = sections[currentSection]
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0)
  const answeredQuestions = Object.keys(answers).length

  // Get global question number
  const getGlobalQuestionNumber = (sectionIndex, questionIndex) => {
    let num = questionIndex + 1
    for (let i = 0; i < sectionIndex; i++) {
      num += sections[i].questions.length
    }
    return num
  }

  // Check if current section is complete
  const isSectionComplete = () => {
    return currentSectionData.questions.every(q => answers[q.id] !== undefined)
  }

  // Handle answer selection
  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
  }

  // Navigate to next section
  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    } else {
      setShowResults(true)
    }
  }

  // Navigate to previous section
  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  // Accept placement and continue
  const handleAcceptPlacement = (level) => {
    onComplete(level)
  }

  // Start from beginning
  const handleStartFromBeginning = () => {
    onComplete('newcomer')
  }

  // Render results
  if (showResults) {
    return (
      <div className="placement-test-container">
        <PlacementResults
          answers={answers}
          onAccept={handleAcceptPlacement}
          onStartFromBeginning={handleStartFromBeginning}
        />
      </div>
    )
  }

  return (
    <div className="placement-test-container">
      <div className="placement-test">
        {/* Header */}
        <div className="placement-header">
          <button className="placement-back-btn" onClick={onCancel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <div className="placement-header-content">
            <h1 className="placement-title">{PLACEMENT_TEST.title}</h1>
            <p className="placement-description">{PLACEMENT_TEST.description}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="placement-progress">
          <div className="placement-progress-bar">
            <div
              className="placement-progress-fill"
              style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
            />
          </div>
          <div className="placement-progress-info">
            <span className="placement-section-name">
              Section {currentSection + 1} of {sections.length}: {currentSectionData.name}
            </span>
            <span className="placement-question-count">
              {answeredQuestions} / {totalQuestions} questions
            </span>
          </div>
        </div>

        {/* Section Progress Dots */}
        <div className="placement-section-dots">
          {sections.map((section, index) => (
            <button
              key={section.level}
              className={`section-dot ${index === currentSection ? 'active' : ''} ${index < currentSection ? 'completed' : ''}`}
              onClick={() => setCurrentSection(index)}
              title={section.name}
            >
              {index < currentSection ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                index + 1
              )}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="placement-questions">
          {currentSectionData.questions.map((question, qIndex) => (
            <QuestionCard
              key={question.id}
              question={question}
              selected={answers[question.id]}
              onSelect={(answer) => handleAnswer(question.id, answer)}
              questionNumber={getGlobalQuestionNumber(currentSection, qIndex)}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="placement-navigation">
          {currentSection > 0 && (
            <button className="placement-nav-btn secondary" onClick={handlePrevious}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Previous Section
            </button>
          )}
          <div className="placement-nav-spacer" />
          {currentSection < sections.length - 1 ? (
            <button
              className="placement-nav-btn primary"
              onClick={handleNext}
              disabled={!isSectionComplete()}
            >
              Next Section
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ) : (
            <button
              className="placement-nav-btn primary"
              onClick={handleNext}
              disabled={!isSectionComplete()}
            >
              See Results
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
