import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function AcademyHeader() {
  const navigate = useNavigate()

  return (
    <header className="academy-header">
      <div className="academy-header-left">
        <Link to="/" className="academy-logo">
          <img src="/hindsightlogo.png" alt="Hindsight" className="academy-logo-img" />
          <span className="academy-logo-text">hindsight</span>
        </Link>
        <span className="academy-badge">Academy</span>
      </div>
      <nav className="academy-nav">
        <Link to="/academy" className="academy-nav-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Home
        </Link>
        <Link to="/" className="academy-nav-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to App
        </Link>
      </nav>
    </header>
  )
}

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

export default function AcademyLayout() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="academy-page">
      <RippleBackground />
      <AcademyHeader />
      <main className="academy-main">
        <Outlet context={{ isAuthenticated, user }} />
      </main>
    </div>
  )
}
