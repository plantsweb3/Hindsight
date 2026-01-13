import { useRef, useState, useEffect, useCallback } from 'react'
import html2canvas from 'html2canvas'
import { LEVEL_STYLES, getFlexLine, getTweetText, getSharePromptMessage, getLessonsToMaster } from '../../data/placementShareConfig'

// Star component for level badge
function StarRow({ count, total = 5 }) {
  return (
    <div className="placement-share-stars">
      {[...Array(total)].map((_, i) => (
        <span
          key={i}
          className={`placement-share-star ${i < count ? 'filled' : 'empty'}`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

// The actual card content (rendered to image)
function PlacementShareCardContent({ level, modulesCleared, totalModules, xpEarned, averageScore, flexLine }) {
  const levelStyle = LEVEL_STYLES[level] || LEVEL_STYLES.newcomer
  const levelName = level.charAt(0).toUpperCase() + level.slice(1)
  const lessonsToMaster = getLessonsToMaster(modulesCleared, totalModules)

  return (
    <div className="placement-share-card-canvas">
      {/* Background with radial gradient */}
      <div className="placement-share-card-bg" />

      {/* Content */}
      <div className="placement-share-card-content">
        {/* Header - Logo + Academy */}
        <div className="placement-share-header">
          <img src="/hindsightlogo.png" alt="" className="placement-share-logo" />
          <span className="placement-share-brand">hindsight</span>
          <span className="placement-share-academy-label">ACADEMY</span>
        </div>

        {/* Level Badge */}
        <div
          className="placement-share-level-badge"
          style={{
            background: levelStyle.gradient,
            borderColor: levelStyle.border,
            boxShadow: `0 0 30px ${levelStyle.glow}`,
          }}
        >
          {levelStyle.isJourney && (
            <span className="placement-share-starting-as">STARTING AS</span>
          )}
          <span className="placement-share-level-name">{levelName.toUpperCase()}</span>
          <StarRow count={levelStyle.stars} />
        </div>

        {/* Flex Line */}
        <p className="placement-share-flex-line">{flexLine}</p>

        {/* Stats Row (for Trader/Specialist/Master) OR Progress Bar (for Newcomer/Apprentice) */}
        {levelStyle.isJourney ? (
          // Journey variant - progress bar
          <div className="placement-share-journey">
            <div className="placement-share-progress-container">
              <div className="placement-share-progress-track">
                <div
                  className="placement-share-progress-fill"
                  style={{ width: `${(modulesCleared / totalModules) * 100}%` }}
                />
              </div>
            </div>
            <span className="placement-share-lessons-text">{lessonsToMaster} lessons to Master</span>
          </div>
        ) : (
          // Flex variant - stats row
          <div className="placement-share-stats">
            <div className="placement-share-stat">
              <span className="placement-share-stat-value primary">{modulesCleared}/{totalModules}</span>
              <span className="placement-share-stat-label">MODULES</span>
              <span className="placement-share-stat-sublabel">CLEARED</span>
            </div>
            <div className="placement-share-stat">
              <span className="placement-share-stat-value">{xpEarned.toLocaleString()}</span>
              <span className="placement-share-stat-label">XP</span>
              <span className="placement-share-stat-sublabel">EARNED</span>
            </div>
            <div className="placement-share-stat">
              <span className="placement-share-stat-value">{averageScore}%</span>
              <span className="placement-share-stat-label">SCORE</span>
              <span className="placement-share-stat-sublabel">&nbsp;</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="placement-share-cta">
          <span className="placement-share-cta-text">Test your trading IQ →</span>
          <span className="placement-share-cta-url">tradehindsight.com</span>
        </div>
      </div>
    </div>
  )
}

// Main exported component with share functionality
export default function PlacementShareCard({ level, modulesCleared, totalModules = 5, xpEarned, averageScore }) {
  const cardRef = useRef(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [clipboardSupported, setClipboardSupported] = useState(false)
  const [flexLine] = useState(() => getFlexLine(level))

  // Check clipboard support on mount
  useEffect(() => {
    setClipboardSupported('clipboard' in navigator && 'write' in navigator.clipboard)
  }, [])

  const showToastMessage = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleShareToTwitter = useCallback(async () => {
    if (!cardRef.current || isGenerating) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 1200,
        height: 630,
      })

      // Download the image
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `hindsight-${level}-placement.png`
      link.href = dataUrl
      link.click()

      showToastMessage('Image downloaded! Attach it to your tweet.')

      // Open Twitter with pre-filled text
      setTimeout(() => {
        const tweetText = encodeURIComponent(getTweetText(level))
        window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank')
      }, 500)
    } catch (err) {
      console.error('Failed to generate image:', err)
      showToastMessage('Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }, [isGenerating, level])

  const handleCopyImage = useCallback(async () => {
    if (!cardRef.current || isGenerating) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 1200,
        height: 630,
      })

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])

      showToastMessage('Image copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy image:', err)
      showToastMessage('Could not copy image. Try downloading instead.')
    } finally {
      setIsGenerating(false)
    }
  }, [isGenerating])

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || isGenerating) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 1200,
        height: 630,
      })

      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `hindsight-${level}-placement.png`
      link.href = dataUrl
      link.click()

      showToastMessage('Image downloaded!')
    } catch (err) {
      console.error('Failed to download image:', err)
      showToastMessage('Failed to download image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }, [isGenerating, level])

  return (
    <div className="placement-share-section">
      {/* Card preview - scaled down for display */}
      <div className="placement-share-card-wrapper">
        <div ref={cardRef} style={{ width: 1200, height: 630 }}>
          <PlacementShareCardContent
            level={level}
            modulesCleared={modulesCleared}
            totalModules={totalModules}
            xpEarned={xpEarned}
            averageScore={averageScore}
            flexLine={flexLine}
          />
        </div>
      </div>

      {/* Share Buttons */}
      <div className="placement-share-buttons">
        <button
          onClick={handleShareToTwitter}
          disabled={isGenerating}
          className="placement-share-btn placement-share-btn-twitter"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </button>
        {clipboardSupported && (
          <button
            onClick={handleCopyImage}
            disabled={isGenerating}
            className="placement-share-btn placement-share-btn-secondary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy image
          </button>
        )}
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="placement-share-btn placement-share-btn-secondary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="placement-share-toast">
          {toastMessage}
        </div>
      )}
    </div>
  )
}

// Export the share prompt message function for use in results page
export { getSharePromptMessage }
