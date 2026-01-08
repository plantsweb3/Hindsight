import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function MarkdownContent({ content }) {
  // Simple markdown-to-html conversion for basic formatting
  const parseMarkdown = (text) => {
    if (!text) return ''

    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      // Numbered lists
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      // Paragraphs (double newlines)
      .replace(/\n\n/gim, '</p><p>')
      // Single newlines in lists
      .replace(/<\/li>\n<li>/gim, '</li><li>')

    // Wrap in paragraph
    html = '<p>' + html + '</p>'

    // Wrap consecutive list items in ul
    html = html.replace(/(<li>.*?<\/li>)+/gim, '<ul>$&</ul>')

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/gim, '')
    html = html.replace(/<p>\s*<ul>/gim, '<ul>')
    html = html.replace(/<\/ul>\s*<\/p>/gim, '</ul>')

    return html
  }

  return (
    <div
      className="lesson-content-text"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  )
}

export default function LessonView() {
  const { moduleSlug, lessonSlug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useOutletContext()
  const { token } = useAuth()
  const [lesson, setLesson] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isMarking, setIsMarking] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLesson()
  }, [moduleSlug, lessonSlug, token])

  const fetchLesson = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Fetch lesson
      const lessonRes = await fetch(`/api/academy/lessons/${moduleSlug}/${lessonSlug}`)
      if (!lessonRes.ok) {
        if (lessonRes.status === 404) {
          throw new Error('Lesson not found')
        }
        throw new Error('Failed to fetch lesson')
      }
      const lessonData = await lessonRes.json()
      setLesson(lessonData.lesson)

      // Check if completed
      if (token) {
        const progressRes = await fetch('/api/academy/progress', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (progressRes.ok) {
          const progressData = await progressRes.json()
          const completed = progressData.progress?.some(p => p.lesson_id === lessonData.lesson.id)
          setIsCompleted(completed)
        }
      }
    } catch (err) {
      console.error('Failed to fetch lesson:', err)
      setError(err.message || 'Failed to load lesson')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!token || !lesson) return

    setIsMarking(true)
    try {
      const res = await fetch(`/api/academy/progress/${lesson.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        setIsCompleted(true)
      }
    } catch (err) {
      console.error('Failed to mark lesson complete:', err)
    } finally {
      setIsMarking(false)
    }
  }

  const navigateToLesson = (slug) => {
    if (slug) {
      navigate(`/academy/${moduleSlug}/${slug}`)
    }
  }

  if (isLoading) {
    return (
      <div className="academy-loading">
        <div className="spinner" />
        <p>Loading lesson...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="academy-error">
        <p>{error}</p>
        <Link to={`/academy/${moduleSlug}`} className="academy-back-link">
          Back to Module
        </Link>
      </div>
    )
  }

  if (!lesson) {
    return null
  }

  return (
    <div className="lesson-view">
      {/* Breadcrumbs */}
      <nav className="academy-breadcrumbs">
        <Link to="/academy">Academy</Link>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <Link to={`/academy/${moduleSlug}`}>{lesson.module_title}</Link>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span>{lesson.title}</span>
      </nav>

      {/* Lesson Header */}
      <header className="lesson-header">
        <div className="lesson-meta">
          <span className={`lesson-difficulty difficulty-${lesson.difficulty}`}>
            {lesson.difficulty}
          </span>
          <span className="lesson-reading-time">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {lesson.reading_time} min read
          </span>
          {isCompleted && (
            <span className="lesson-completed-indicator">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Completed
            </span>
          )}
        </div>
        <h1 className="lesson-title">{lesson.title}</h1>
        {lesson.description && (
          <p className="lesson-description">{lesson.description}</p>
        )}
      </header>

      {/* Lesson Content */}
      <article className="lesson-content glass-card">
        <MarkdownContent content={lesson.content} />
      </article>

      {/* Actions */}
      <div className="lesson-actions">
        {isAuthenticated ? (
          <button
            onClick={handleMarkComplete}
            disabled={isCompleted || isMarking}
            className={`lesson-complete-btn ${isCompleted ? 'completed' : ''}`}
          >
            {isMarking ? (
              <>
                <span className="spinner-small" />
                Saving...
              </>
            ) : isCompleted ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Completed
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Mark as Complete
              </>
            )}
          </button>
        ) : (
          <Link to="/" className="lesson-login-prompt">
            Sign in to track your progress
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="lesson-navigation">
        {lesson.prev_lesson ? (
          <button
            onClick={() => navigateToLesson(lesson.prev_lesson)}
            className="lesson-nav-btn lesson-nav-prev"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Previous Lesson
          </button>
        ) : (
          <div />
        )}
        {lesson.next_lesson ? (
          <button
            onClick={() => navigateToLesson(lesson.next_lesson)}
            className="lesson-nav-btn lesson-nav-next"
          >
            Next Lesson
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <Link to={`/academy/${moduleSlug}`} className="lesson-nav-btn lesson-nav-next">
            Back to Module
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </nav>
    </div>
  )
}
