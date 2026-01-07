import { useState } from 'react'

// Shared background components
function RippleBackground() {
  return (
    <div className="ripple-background">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="ripple-ring"
          style={{ '--ring-index': i, '--ring-delay': `${i * 0.8}s` }}
        />
      ))}
    </div>
  )
}

function CursorTrail() {
  return <div className="cursor-trail" />
}

// Header with back button
function ReportBugHeader({ onBack }) {
  return (
    <header className="contact-header">
      <button onClick={onBack} className="contact-back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <a href="/" onClick={(e) => { e.preventDefault(); onBack(); }} className="header-logo">
        <img src="/hindsightlogo.png" alt="Hindsight" className="header-logo-img" />
        <span className="header-title">hindsight</span>
      </a>
    </header>
  )
}

export default function ReportBug({ onBack }) {
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description.trim()) return

    setIsSubmitting(true)

    // Simulate submission (can be hooked up to backend later)
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="contact-page">
        <RippleBackground />
        <CursorTrail />
        <ReportBugHeader onBack={onBack} />

        <main className="contact-content">
          <div className="report-success glass-card">
            <div className="report-success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="report-success-title">Thanks for your report!</h2>
            <p className="report-success-text">
              We appreciate you taking the time to help us improve Hindsight. Our team will review your report and work on a fix.
            </p>
            <button onClick={onBack} className="contact-btn contact-btn-primary">
              Back to Contact
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="contact-page">
      <RippleBackground />
      <CursorTrail />
      <ReportBugHeader onBack={onBack} />

      <main className="contact-content">
        {/* Page Header */}
        <section className="contact-hero">
          <h1 className="contact-title">Report a Bug</h1>
          <p className="contact-subtitle">Help us improve Hindsight by reporting issues you encounter.</p>
        </section>

        {/* Bug Report Form */}
        <div className="report-form-wrapper">
          <form onSubmit={handleSubmit} className="report-form glass-card">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email (optional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="form-input"
              />
              <p className="form-hint">We'll only contact you if we need more info</p>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Bug Description <span className="form-required">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what went wrong..."
                className="form-textarea"
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="steps" className="form-label">
                Steps to Reproduce (optional)
              </label>
              <textarea
                id="steps"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
                className="form-textarea"
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !description.trim()}
              className="contact-btn contact-btn-primary submit-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  Submitting...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Submit Report
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
