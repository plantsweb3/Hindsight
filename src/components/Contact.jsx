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
function ContactHeader({ onBack }) {
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

export default function Contact({ onBack, onOpenReportBug }) {
  return (
    <div className="contact-page">
      <RippleBackground />
      <CursorTrail />
      <ContactHeader onBack={onBack} />

      <main className="contact-content">
        {/* Page Header */}
        <section className="contact-hero">
          <h1 className="contact-title">Contact</h1>
          <p className="contact-subtitle">Get support, report issues, or discuss partnerships.</p>
        </section>

        {/* Contact Cards Grid */}
        <div className="contact-grid">
          {/* Support Card */}
          <div className="contact-card glass-card">
            <div className="contact-card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className="contact-card-title">Support</h2>
            <p className="contact-card-description">
              For help with your account, trading questions, and general inquiries.
            </p>
            <div className="contact-card-buttons">
              <a href="https://docs.tradehindsight.com" target="_blank" rel="noopener noreferrer" className="contact-btn contact-btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                Hindsight Academy
              </a>
              <a href="#" className="contact-btn contact-btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Community
              </a>
            </div>
          </div>

          {/* Report a Bug Card */}
          <div className="contact-card glass-card">
            <div className="contact-card-icon contact-card-icon-bug">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 2l1.88 1.88" />
                <path d="M14.12 3.88L16 2" />
                <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
                <path d="M12 20c-3.3 0-6-2.7-6-6v-3a6 6 0 0 1 12 0v3c0 3.3-2.7 6-6 6" />
                <path d="M12 20v-9" />
                <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
                <path d="M6 13H2" />
                <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
                <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
                <path d="M22 13h-4" />
                <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
              </svg>
            </div>
            <h2 className="contact-card-title">Report a Bug</h2>
            <p className="contact-card-description">
              Found something broken? Let us know so we can fix it.
            </p>
            <div className="contact-card-buttons">
              <button onClick={onOpenReportBug} className="contact-btn contact-btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                Submit Report
              </button>
            </div>
          </div>

          {/* Investor Relations Card */}
          <div className="contact-card glass-card">
            <div className="contact-card-icon contact-card-icon-investor">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="12" y1="20" x2="12" y2="10" />
                <line x1="18" y1="20" x2="18" y2="4" />
                <line x1="6" y1="20" x2="6" y2="16" />
                <rect x="2" y="20" width="20" height="2" rx="1" />
              </svg>
            </div>
            <h2 className="contact-card-title">Investor Relations</h2>
            <p className="contact-card-description">
              Investment opportunities and business development.
            </p>
            <div className="contact-card-buttons">
              <a href="mailto:invest@tradehindsight.com" className="contact-btn contact-btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email Us
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
