import { useEffect, useState } from 'react'
import { useAchievements } from '../../contexts/AchievementContext'

// Sparkle particles for level up
function SparkleParticle({ delay, left, size }) {
  return (
    <div
      className="sparkle-particle"
      style={{
        '--delay': `${delay}ms`,
        '--left': `${left}%`,
        '--size': `${size}px`,
      }}
    />
  )
}

// Generate sparkle particles
function Sparkles() {
  const particles = []

  for (let i = 0; i < 30; i++) {
    particles.push(
      <SparkleParticle
        key={i}
        delay={Math.random() * 800}
        left={Math.random() * 100}
        size={4 + Math.random() * 8}
      />
    )
  }

  return <div className="sparkles-container">{particles}</div>
}

export default function LevelUpCelebration() {
  const { isShowingLevelUp, levelUpInfo, dismissLevelUp } = useAchievements()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isShowingLevelUp && levelUpInfo) {
      const timer = setTimeout(() => setShowContent(true), 100)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [isShowingLevelUp, levelUpInfo])

  if (!isShowingLevelUp || !levelUpInfo) {
    return null
  }

  return (
    <div className="level-up-celebration-overlay" onClick={dismissLevelUp}>
      <Sparkles />

      <div
        className={`level-up-celebration-modal ${showContent ? 'show' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="level-up-glow" />

        {/* Level badge */}
        <div className={`level-up-badge ${showContent ? 'animate' : ''}`}>
          <span className="level-number">{levelUpInfo.newLevel}</span>
        </div>

        {/* Level up text */}
        <div className="level-up-trophy-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 3h14a2 2 0 0 1 2 2v2a5 5 0 0 1-5 5h-.09a5 5 0 0 1-4.91 4.09V19h2a1 1 0 0 1 1 1v1H10v-1a1 1 0 0 1 1-1h2v-2.91A5 5 0 0 1 8.09 12H8a5 5 0 0 1-5-5V5a2 2 0 0 1 2-2z" />
          </svg>
          Level Up!
        </div>

        {/* New title if changed */}
        {levelUpInfo.titleChanged && (
          <h2 className="level-up-title">
            New Rank: <span className="title-highlight">{levelUpInfo.newTitle}</span>
          </h2>
        )}

        {!levelUpInfo.titleChanged && (
          <h2 className="level-up-title">
            Level {levelUpInfo.newLevel} Reached!
          </h2>
        )}

        <p className="level-up-description">
          Keep learning to unlock new ranks and achievements!
        </p>

        {/* Continue button */}
        <button onClick={dismissLevelUp} className="level-up-continue-btn">
          Continue
        </button>
      </div>
    </div>
  )
}
