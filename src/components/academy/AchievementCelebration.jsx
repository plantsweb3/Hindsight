import { useEffect, useState } from 'react'
import { useAchievements } from '../../contexts/AchievementContext'

// Confetti particle component
function ConfettiParticle({ delay, color, left }) {
  return (
    <div
      className="confetti-particle"
      style={{
        '--delay': `${delay}ms`,
        '--color': color,
        '--left': `${left}%`,
      }}
    />
  )
}

// Generate confetti particles
function Confetti() {
  const colors = ['#fbbf24', '#f59e0b', '#8b5cf6', '#6366f1', '#22c55e', '#ef4444', '#3b82f6']
  const particles = []

  for (let i = 0; i < 50; i++) {
    particles.push(
      <ConfettiParticle
        key={i}
        delay={Math.random() * 500}
        color={colors[Math.floor(Math.random() * colors.length)]}
        left={Math.random() * 100}
      />
    )
  }

  return <div className="confetti-container">{particles}</div>
}

export default function AchievementCelebration() {
  const { isShowingCelebration, currentCelebration, dismissCelebration, achievementQueue } = useAchievements()
  const [isAnimating, setIsAnimating] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isShowingCelebration && currentCelebration) {
      // Start animation sequence
      setIsAnimating(true)
      // Slight delay before showing content for dramatic effect
      const timer = setTimeout(() => setShowContent(true), 100)
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
      setShowContent(false)
    }
  }, [isShowingCelebration, currentCelebration])

  if (!isShowingCelebration || !currentCelebration) {
    return null
  }

  const remainingCount = achievementQueue.length - 1

  return (
    <div className="achievement-celebration-overlay" onClick={dismissCelebration}>
      <Confetti />

      <div
        className={`achievement-celebration-modal ${showContent ? 'show' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect behind icon */}
        <div className="achievement-glow" />

        {/* Achievement icon */}
        <div className={`achievement-icon-large ${showContent ? 'animate' : ''}`}>
          {currentCelebration.icon}
        </div>

        {/* Trophy badge */}
        <div className="achievement-trophy-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
          </svg>
          Achievement Unlocked!
        </div>

        {/* Achievement name */}
        <h2 className="achievement-name">{currentCelebration.name}</h2>

        {/* Achievement description */}
        <p className="achievement-description">{currentCelebration.description}</p>

        {/* XP Reward */}
        <div className="achievement-xp-reward">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>+{currentCelebration.xpReward} XP</span>
        </div>

        {/* Continue button */}
        <button onClick={dismissCelebration} className="achievement-continue-btn">
          {remainingCount > 0 ? (
            <>
              Continue
              <span className="achievement-remaining">({remainingCount} more)</span>
            </>
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </div>
  )
}
