import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MASTER_EXAM, saveMasterExamResults, isMasterExamUnlocked, hasMasterExamQuestions, calculateMasterExamXP } from '../../data/academy/masterExam'

// Question Card Component
function QuestionCard({ question, selected, onSelect, questionNumber }) {
  return (
    <div className="master-exam-question">
      <h4 className="master-exam-question-text">
        <span className="question-number">{questionNumber}.</span>
        {question.question}
      </h4>
      <div className="master-exam-options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`master-exam-option ${selected === index ? 'selected' : ''}`}
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
function MasterExamResults({ answers, sectionScores, onAccept, onNavigateToArchetype }) {
  const xpEarned = calculateMasterExamXP(sectionScores)
  const passedSections = MASTER_EXAM.sections.filter(s => sectionScores[s.archetypeId] >= MASTER_EXAM.passThreshold)
  const failedSections = MASTER_EXAM.sections.filter(s => sectionScores[s.archetypeId] < MASTER_EXAM.passThreshold)

  // Calculate overall score
  const totalCorrect = Object.values(sectionScores).reduce((sum, score) => sum + (score * 8), 0)
  const overallPercent = Math.round((totalCorrect / 64) * 100)

  return (
    <div className="master-exam-results">
      <div className="master-exam-results-header">
        <div className="results-icon">🔥</div>
        <h1 className="results-title">Master Exam Complete!</h1>
      </div>

      <div className="master-exam-overall-score">
        <span className="overall-label">Overall Score</span>
        <div className="overall-value">{overallPercent}%</div>
        <span className="overall-detail">{Math.round(totalCorrect)} / 64 correct</span>
      </div>

      {/* XP Earned */}
      {xpEarned > 0 && (
        <div className="master-exam-xp-earned">
          <span className="master-exam-xp-icon">⚡</span>
          <span className="master-exam-xp-value">+{xpEarned.toLocaleString()} XP</span>
          <span className="master-exam-xp-label">for mastered archetypes</span>
        </div>
      )}

      {/* Archetypes Mastered */}
      {passedSections.length > 0 && (
        <div className="master-exam-passed-sections">
          <h3 className="sections-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Archetypes Mastered ({passedSections.length})
          </h3>
          <div className="sections-list">
            {passedSections.map(section => (
              <div key={section.archetypeId} className="section-item passed">
                <span className="section-icon">{section.icon}</span>
                <span className="section-name">{section.name}</span>
                <span className="section-score">{Math.round(sectionScores[section.archetypeId] * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Archetypes to Review */}
      {failedSections.length > 0 && (
        <div className="master-exam-failed-sections">
          <h3 className="sections-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Needs Review ({failedSections.length})
          </h3>
          <p className="sections-subtitle">Score 75%+ to master these archetypes</p>
          <div className="sections-list">
            {failedSections.map(section => (
              <div key={section.archetypeId} className="section-item failed">
                <span className="section-icon">{section.icon}</span>
                <span className="section-name">{section.name}</span>
                <span className="section-score">{Math.round(sectionScores[section.archetypeId] * 100)}%</span>
                <button
                  className="section-review-btn"
                  onClick={() => onNavigateToArchetype(section.archetypeId)}
                >
                  Study
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score Breakdown */}
      <div className="master-exam-breakdown">
        <h3 className="breakdown-title">Score Breakdown</h3>
        {MASTER_EXAM.sections.map(section => {
          const score = sectionScores[section.archetypeId]
          const passed = score >= MASTER_EXAM.passThreshold
          return (
            <div key={section.archetypeId} className="breakdown-row">
              <div className="breakdown-info">
                <span className="breakdown-icon">{section.icon}</span>
                <span className="breakdown-name">{section.name}</span>
              </div>
              <div className="breakdown-bar-container">
                <div className="breakdown-bar">
                  <div
                    className={`breakdown-fill ${passed ? 'passed' : ''}`}
                    style={{ width: `${Math.round(score * 100)}%` }}
                  />
                </div>
                <span className="breakdown-percent">{Math.round(score * 100)}%</span>
              </div>
              {passed && (
                <span className="breakdown-passed-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </div>
          )
        })}
        <p className="passing-note">75% required to master each archetype</p>
      </div>

      <div className="master-exam-results-actions">
        <button className="results-btn primary" onClick={onAccept}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Return to Academy
        </button>
      </div>
    </div>
  )
}

// Main Master Exam Component
export default function MasterExamPage() {
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [sectionScores, setSectionScores] = useState({})

  const isUnlocked = isMasterExamUnlocked()
  const hasQuestions = hasMasterExamQuestions()

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Scroll to top on section change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentSection])

  // Scroll to top when showing results
  useEffect(() => {
    if (showResults) {
      window.scrollTo(0, 0)
    }
  }, [showResults])

  // Redirect if not unlocked
  if (!isUnlocked) {
    return (
      <div className="master-exam-container">
        <div className="master-exam-locked">
          <div className="locked-icon">🔒</div>
          <h1>Master Exam Locked</h1>
          <p>Complete Trading 101 Master module to unlock the Archetype Master Exam.</p>
          <Link to="/academy" className="back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Academy
          </Link>
        </div>
      </div>
    )
  }

  // Show error if no questions
  if (!hasQuestions) {
    return (
      <div className="master-exam-container">
        <div className="master-exam-coming-soon">
          <div className="fire-icon">🔥</div>
          <h1>Master Exam Coming Soon</h1>
          <p>The 64-question Master Exam is being prepared.</p>
          <Link to="/academy" className="back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Academy
          </Link>
        </div>
      </div>
    )
  }

  const sections = MASTER_EXAM.sections
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
      // Calculate and save results
      const { sectionScores: scores } = saveMasterExamResults(answers)
      setSectionScores(scores)
      setShowResults(true)
    }
  }

  // Navigate to previous section
  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  // Handle accept results
  const handleAccept = () => {
    navigate('/academy')
  }

  // Handle navigate to archetype
  const handleNavigateToArchetype = (archetypeId) => {
    navigate(`/academy/archetype/${archetypeId}`)
  }

  // Cancel and go back
  const handleCancel = () => {
    navigate('/academy')
  }

  // Render results
  if (showResults) {
    return (
      <div className="master-exam-container">
        <MasterExamResults
          answers={answers}
          sectionScores={sectionScores}
          onAccept={handleAccept}
          onNavigateToArchetype={handleNavigateToArchetype}
        />
      </div>
    )
  }

  return (
    <div className="master-exam-container">
      <div className="master-exam">
        {/* Header */}
        <div className="master-exam-header">
          <button className="master-exam-back-btn" onClick={handleCancel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <div className="master-exam-header-content">
            <h1 className="master-exam-title">{MASTER_EXAM.title}</h1>
            <p className="master-exam-description">{MASTER_EXAM.description}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="master-exam-progress">
          <div className="master-exam-progress-bar">
            <div
              className="master-exam-progress-fill"
              style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
            />
          </div>
          <div className="master-exam-progress-info">
            <span className="master-exam-section-name">
              <span className="section-icon">{currentSectionData.icon}</span>
              Section {currentSection + 1} of {sections.length}: {currentSectionData.name}
            </span>
            <span className="master-exam-question-count">
              {answeredQuestions} / {totalQuestions} questions
            </span>
          </div>
        </div>

        {/* Section Progress Dots */}
        <div className="master-exam-section-dots">
          {sections.map((section, index) => (
            <button
              key={section.archetypeId}
              className={`section-dot ${index === currentSection ? 'active' : ''} ${index < currentSection ? 'completed' : ''}`}
              onClick={() => setCurrentSection(index)}
              title={section.name}
            >
              {index < currentSection ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span className="dot-icon">{section.icon}</span>
              )}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="master-exam-questions">
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
        <div className="master-exam-navigation">
          {currentSection > 0 && (
            <button className="master-exam-nav-btn secondary" onClick={handlePrevious}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Previous Section
            </button>
          )}
          <div className="master-exam-nav-spacer" />
          {currentSection < sections.length - 1 ? (
            <button
              className="master-exam-nav-btn primary"
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
              className="master-exam-nav-btn primary"
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
