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
  const [screenshot, setScreenshot] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const compressImage = (file, maxWidth = 1400, quality = 0.5) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Scale down if too large
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to compressed JPEG
          let compressed = canvas.toDataURL('image/jpeg', quality)

          // If still too large, compress more aggressively
          if (compressed.length > 500000) {
            console.log('Image still large, compressing further...')
            canvas.width = Math.round(width * 0.7)
            canvas.height = Math.round(height * 0.7)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            compressed = canvas.toDataURL('image/jpeg', 0.4)
          }

          console.log('Final image size:', Math.round(compressed.length / 1024), 'KB')

          // Reject if still too large
          if (compressed.length > 2000000) {
            reject(new Error('Image too large even after compression. Please use a smaller screenshot.'))
            return
          }

          resolve(compressed)
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = e.target.result
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const handleScreenshotChange = async (e) => {
    const file = e.target.files[0]
    if (!file) {
      setScreenshot(null)
      setScreenshotPreview(null)
      return
    }

    // Check file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      setError('Screenshot must be less than 10MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    setError('')

    try {
      // Compress the image
      const compressed = await compressImage(file)
      setScreenshotPreview(compressed)
      setScreenshot(compressed)
    } catch (err) {
      console.error('Failed to compress image:', err)
      setError('Failed to process image')
    }
  }

  const removeScreenshot = () => {
    setScreenshot(null)
    setScreenshotPreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description.trim()) return

    setIsSubmitting(true)
    setError('')

    try {
      const payload = {
        email: email.trim() || null,
        description: description.trim(),
        steps: steps.trim() || null,
        screenshot: screenshot || null,
      }

      console.log('Payload size:', Math.round(JSON.stringify(payload).length / 1024), 'KB')

      const response = await fetch('/api/report-bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      let data
      try {
        data = await response.json()
      } catch {
        // Response might not be JSON if there's a server error
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report')
      }

      // Clear form and show success
      setEmail('')
      setDescription('')
      setSteps('')
      setScreenshot(null)
      setScreenshotPreview(null)
      setSubmitted(true)
    } catch (err) {
      console.error('Failed to submit bug report:', err)
      setError(err.message || 'Failed to submit report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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

            <div className="form-group">
              <label className="form-label">
                Screenshot (optional)
              </label>
              {screenshotPreview ? (
                <div className="screenshot-preview">
                  <img src={screenshotPreview} alt="Screenshot preview" />
                  <button
                    type="button"
                    onClick={removeScreenshot}
                    className="screenshot-remove"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="screenshot-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="screenshot-input"
                  />
                  <div className="screenshot-dropzone">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>Click to upload screenshot</span>
                    <span className="screenshot-hint">PNG, JPG up to 5MB</span>
                  </div>
                </label>
              )}
            </div>

            {error && (
              <div className="form-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

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
