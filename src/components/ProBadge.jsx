import { useState } from 'react'

// Pro Badge - Small purple gradient pill
export function ProBadge({ className = '' }) {
  return (
    <span className={`pro-badge-pill ${className}`}>Pro</span>
  )
}

// Pro Feature Popup - Shows when clicking a Pro-gated element
export function ProFeaturePopup({ isOpen, onClose, featureName, onLearnMore }) {
  if (!isOpen) return null

  return (
    <div className="pro-popup-overlay" onClick={onClose}>
      <div className="pro-popup" onClick={e => e.stopPropagation()}>
        <button className="pro-popup-close" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="pro-popup-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <h3 className="pro-popup-title">Pro Feature</h3>
        <p className="pro-popup-text">
          <span className="pro-popup-feature">{featureName}</span> is available for $SIGHT holders.
        </p>

        <button className="pro-popup-link" onClick={onLearnMore}>
          Learn more
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Hook for managing Pro popup state
export function useProPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [featureName, setFeatureName] = useState('')

  const showProPopup = (name) => {
    setFeatureName(name)
    setIsOpen(true)
  }

  const hideProPopup = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    featureName,
    showProPopup,
    hideProPopup,
  }
}

export default ProBadge
