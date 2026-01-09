export default function QuizResults({ results, quiz, onRetry, onClose, isModuleTest }) {
  const { score, totalQuestions, percent, passed, perfect, xpEarned, leveledUp, newLevel, wasImprovement } = results

  const getMessage = () => {
    if (perfect) {
      return {
        emoji: '🎉',
        title: 'Perfect Score!',
        subtitle: 'You got every question right!',
      }
    }
    if (passed) {
      return {
        emoji: '✅',
        title: 'Quiz Passed!',
        subtitle: 'Great job! Keep learning.',
      }
    }
    return {
      emoji: '📚',
      title: 'Keep Studying',
      subtitle: 'You need 80% to pass. Review the lesson and try again.',
    }
  }

  const message = getMessage()

  return (
    <div className="quiz-results">
      <div className="quiz-results-header">
        <span className="quiz-results-emoji">{message.emoji}</span>
        <h2 className="quiz-results-title">{message.title}</h2>
        <p className="quiz-results-subtitle">{message.subtitle}</p>
      </div>

      <div className="quiz-results-score">
        <div className="quiz-score-circle">
          <svg viewBox="0 0 100 100" className="quiz-score-svg">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={passed ? (perfect ? '#10b981' : '#3b82f6') : '#ef4444'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(percent / 100) * 283} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="quiz-score-text">
            <span className="quiz-score-value">{score}/{totalQuestions}</span>
            <span className="quiz-score-percent">{percent}%</span>
          </div>
        </div>
      </div>

      {/* XP Earned */}
      {xpEarned > 0 && (
        <div className="quiz-xp-earned">
          <div className="quiz-xp-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>+{xpEarned} XP</span>
          </div>
          {wasImprovement && !perfect && passed && (
            <p className="quiz-xp-note">Improvement bonus! Get a perfect score for +10 more XP.</p>
          )}
          {!wasImprovement && passed && (
            <p className="quiz-xp-note">Already earned max XP for this quiz.</p>
          )}
        </div>
      )}

      {/* Level Up */}
      {leveledUp && (
        <div className="quiz-level-up">
          <div className="quiz-level-badge">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>Level Up!</span>
          </div>
          <p className="quiz-level-text">You reached Level {newLevel}!</p>
        </div>
      )}

      {/* Question Review (collapsed by default) */}
      <details className="quiz-review">
        <summary className="quiz-review-toggle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
          Review Answers
        </summary>
        <div className="quiz-review-list">
          {results.questionResults?.map((qr, i) => {
            const question = quiz?.questions?.[i]
            const userAnswerText = question?.options?.find(o => o.id === qr.userAnswer)?.text
            const correctAnswerText = question?.options?.find(o => o.id === qr.correctAnswer)?.text

            return (
              <div key={qr.questionId} className={`quiz-review-item ${qr.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="quiz-review-header">
                  <span className="quiz-review-num">Q{i + 1}</span>
                  {qr.isCorrect ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <p className="quiz-review-question">{question?.question}</p>
                <div className="quiz-review-answers">
                  <p className={`quiz-review-answer ${qr.isCorrect ? 'correct' : 'incorrect'}`}>
                    <span className="quiz-review-label">Your answer:</span> {userAnswerText || 'No answer'}
                  </p>
                  {!qr.isCorrect && (
                    <p className="quiz-review-answer correct">
                      <span className="quiz-review-label">Correct answer:</span> {correctAnswerText}
                    </p>
                  )}
                </div>
                {qr.explanation && (
                  <p className="quiz-review-explanation">{qr.explanation}</p>
                )}
              </div>
            )
          })}
        </div>
      </details>

      {/* Actions */}
      <div className="quiz-results-actions">
        {!passed && (
          <button onClick={onRetry} className="quiz-retry-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 4v6h6M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            Try Again
          </button>
        )}
        <button onClick={onClose} className={`quiz-continue-btn ${!passed ? 'secondary' : ''}`}>
          {passed ? 'Continue' : 'Review Lesson'}
        </button>
      </div>
    </div>
  )
}
