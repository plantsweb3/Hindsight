import { useState, useEffect, useMemo } from 'react'
import { PLACEMENT_TEST, determinePlacement, calculateSectionScore, LEVEL_INFO, savePlacementQuestionResults } from '../../data/academy/placementTest'
import { calculatePlacementXP, awardPlacementRewards, ACHIEVEMENTS, hasCompletedPlacementTest } from '../../services/achievements'
import PlacementShareCard, { getSharePromptMessage } from './PlacementShareCard'

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

// Module info for review recommendations
const MODULE_INFO = {
  newcomer: { id: 'newcomer', name: 'Newcomer', fullName: 'Your First Steps', slug: 'newcomer' },
  apprentice: { id: 'apprentice', name: 'Apprentice', fullName: 'Research & Defense', slug: 'apprentice' },
  trader: { id: 'trader', name: 'Trader', fullName: 'Strategy & Execution', slug: 'trader' },
  specialist: { id: 'specialist', name: 'Specialist', fullName: 'Psychology & Edge', slug: 'specialist' },
  master: { id: 'master', name: 'Master', fullName: 'Scale & Optimize', slug: 'master' }
}

// Get modules that need review based on section scores
function getModulesNeedingReview(sectionScores) {
  const levels = ['newcomer', 'apprentice', 'trader', 'specialist', 'master']

  return levels
    .filter(level => {
      const score = sectionScores[level]
      // Show review recommendation if score is between 0 and 100% (not perfect)
      return score > 0 && score < 1.0
    })
    .map(level => ({
      ...MODULE_INFO[level],
      score: sectionScores[level],
      priority: sectionScores[level] < 0.5 ? 'high' : sectionScores[level] < 0.75 ? 'medium' : 'low'
    }))
    .sort((a, b) => a.score - b.score) // Lowest scores first
}

// Results Component
function PlacementResults({ answers, onAccept, onStartFromBeginning, onNavigateToModule }) {
  const placementLevel = determinePlacement(answers)
  const levelInfo = LEVEL_INFO[placementLevel]

  // Check if this is a retake
  const isRetake = hasCompletedPlacementTest()

  // Calculate scores for each section (as decimal 0-1)
  const sectionScoresRaw = {}
  PLACEMENT_TEST.sections.forEach(section => {
    sectionScoresRaw[section.level] = calculateSectionScore(answers, section.questions)
  })

  // Calculate rewards (would be earned on first completion)
  const xpEarned = isRetake ? 0 : calculatePlacementXP(placementLevel)
  const levels = ['newcomer', 'apprentice', 'trader', 'specialist', 'master']
  const placementIndex = levels.indexOf(placementLevel)
  const modulesTestedOut = placementLevel === 'completed' ? 5 : placementIndex

  // Check for perfect scores
  const hasPerfectScore = Object.values(sectionScoresRaw).some(score => score === 1.0)

  // Get modules that passed (75%+) - these are unlocked as "tested out"
  const passedModules = levels.filter(level => sectionScoresRaw[level] >= PLACEMENT_TEST.passingThreshold)

  // Get modules needing review (attempted but not perfect)
  const modulesNeedingReview = getModulesNeedingReview(sectionScoresRaw)

  // Calculate scores for display
  const sectionScores = PLACEMENT_TEST.sections.map(section => {
    const score = sectionScoresRaw[section.level]
    const passed = score >= PLACEMENT_TEST.passingThreshold
    return {
      level: section.level,
      name: section.name,
      score: Math.round(score * 100),
      rawScore: score,
      passed
    }
  })

  // Get list of modules tested out of (passed 75%+)
  const testedOutModules = passedModules.map(level => {
    const info = LEVEL_INFO[level]
    return { level, name: info?.name || level, icon: info?.icon || '📚' }
  })

  // Calculate average score across all sections for share card
  const averageScore = Math.round(
    sectionScores.reduce((sum, s) => sum + s.score, 0) / sectionScores.length
  )

  // Determine which achievements would be earned
  const potentialAchievements = []
  if (passedModules.length >= 1) {
    potentialAchievements.push('first-steps', 'module-master')
  }
  if (hasPerfectScore) {
    potentialAchievements.push('perfect-score')
  }
  if (passedModules.length >= 5) {
    potentialAchievements.push('expert-trader')
  }

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

      {/* XP Earned or Retake Notice */}
      {isRetake ? (
        <div className="placement-retake-notice">
          <span className="placement-retake-icon">🔄</span>
          <span className="placement-retake-text">Your module access has been updated based on your new scores.</span>
          <span className="placement-retake-subtext">XP is only awarded on first completion.</span>
        </div>
      ) : xpEarned > 0 && (
        <div className="placement-xp-earned">
          <span className="placement-xp-icon">⚡</span>
          <span className="placement-xp-value">+{xpEarned.toLocaleString()} XP</span>
          <span className="placement-xp-label">for demonstrated knowledge</span>
        </div>
      )}

      {/* Modules Tested Out */}
      {testedOutModules.length > 0 && (
        <div className="placement-modules-unlocked">
          <h3 className="modules-unlocked-title">
            You tested out of {testedOutModules.length} module{testedOutModules.length > 1 ? 's' : ''}:
          </h3>
          <div className="modules-unlocked-list">
            {testedOutModules.map(mod => (
              <div key={mod.level} className="module-unlocked-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="module-unlocked-icon">{mod.icon}</span>
                <span className="module-unlocked-name">{mod.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Earned - only show on first completion */}
      {!isRetake && potentialAchievements.length > 0 && (
        <div className="placement-achievements-earned">
          <h3 className="achievements-earned-title">Achievements Unlocked!</h3>
          <div className="achievements-earned-list">
            {potentialAchievements.map(achId => {
              const achievement = ACHIEVEMENTS[achId]
              if (!achievement) return null
              return (
                <div key={achId} className="achievement-earned-item">
                  <span className="achievement-earned-icon">{achievement.icon}</span>
                  <div className="achievement-earned-info">
                    <span className="achievement-earned-name">{achievement.name}</span>
                    <span className="achievement-earned-desc">{achievement.description}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Review Recommendations */}
      {modulesNeedingReview.length > 0 && (
        <div className="placement-review-recommendations">
          <h3 className="review-recommendations-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Recommended Review
          </h3>
          <p className="review-recommendations-desc">
            Based on your answers, consider reviewing these areas:
          </p>
          <div className="review-modules-list">
            {modulesNeedingReview.map(mod => (
              <div key={mod.id} className={`review-module-card priority-${mod.priority}`}>
                <div className="review-module-header">
                  <span className="review-module-name">{mod.fullName}</span>
                  <span className={`review-module-score score-${mod.priority}`}>
                    {Math.round(mod.score * 100)}%
                  </span>
                </div>
                <p className="review-module-reason">
                  {mod.score < 0.5
                    ? 'Needs significant review'
                    : mod.score < 0.75
                    ? 'Some gaps to fill'
                    : 'Minor topics to review'}
                </p>
                <button
                  className="review-module-btn"
                  onClick={() => onNavigateToModule && onNavigateToModule(mod.slug)}
                >
                  Review {mod.name}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
        <button className="results-btn primary" onClick={() => onAccept(placementLevel, sectionScoresRaw)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Start Learning at {levelInfo.name}
        </button>
        <button className="results-btn secondary" onClick={onStartFromBeginning}>
          Start from Beginning Instead
        </button>
      </div>

      {/* Share Section */}
      <div className="placement-share-divider" />
      <div className="placement-share-container">
        <p className="placement-share-prompt">{getSharePromptMessage(placementLevel, averageScore)}</p>
        <h3 className="placement-share-title">Share your results</h3>
        <PlacementShareCard
          level={placementLevel}
          modulesCleared={passedModules.length}
          totalModules={5}
          xpEarned={xpEarned}
          averageScore={averageScore}
        />
      </div>
    </div>
  )
}

// Main Placement Test Component
export default function PlacementTest({ onComplete, onCancel, onNavigateToModule }) {
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const sections = PLACEMENT_TEST.sections
  const currentSectionData = sections[currentSection]
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0)
  const answeredQuestions = Object.keys(answers).length

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

  // Accept placement and continue - awards XP and achievements
  const handleAcceptPlacement = (level, sectionScores) => {
    // Save individual question results for per-lesson tracking
    const questionResults = savePlacementQuestionResults(answers)
    // Award XP and achievements for tested out modules
    const rewards = awardPlacementRewards(level, sectionScores)
    // Include section scores and question results in rewards
    onComplete(level, { ...rewards, sectionScores, questionResults })
  }

  // Start from beginning - no rewards
  const handleStartFromBeginning = () => {
    onComplete('newcomer', null)
  }

  // Render results
  if (showResults) {
    return (
      <div className="placement-test-container">
        <PlacementResults
          answers={answers}
          onAccept={handleAcceptPlacement}
          onStartFromBeginning={handleStartFromBeginning}
          onNavigateToModule={onNavigateToModule}
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
