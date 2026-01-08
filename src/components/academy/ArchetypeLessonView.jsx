import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { getArchetypeLesson, getArchetypeModule } from './archetypeData'

export default function ArchetypeLessonView() {
  const { archetypeId, lessonSlug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useOutletContext()
  const [isCompleted, setIsCompleted] = useState(false)
  const [isMarking, setIsMarking] = useState(false)

  const lesson = getArchetypeLesson(archetypeId, lessonSlug)
  const module = getArchetypeModule(archetypeId)

  useEffect(() => {
    // Check if lesson is completed from localStorage
    const checkCompleted = () => {
      try {
        const saved = localStorage.getItem(`archetype_progress_${archetypeId}`)
        if (saved) {
          const completed = new Set(JSON.parse(saved))
          setIsCompleted(completed.has(lessonSlug))
        }
      } catch (e) {
        console.error('Failed to check lesson completion:', e)
      }
    }
    checkCompleted()
  }, [archetypeId, lessonSlug])

  const handleMarkComplete = async () => {
    setIsMarking(true)
    try {
      // Save to localStorage
      const saved = localStorage.getItem(`archetype_progress_${archetypeId}`)
      const completed = saved ? new Set(JSON.parse(saved)) : new Set()
      completed.add(lessonSlug)
      localStorage.setItem(`archetype_progress_${archetypeId}`, JSON.stringify([...completed]))
      setIsCompleted(true)
    } catch (e) {
      console.error('Failed to mark lesson complete:', e)
    } finally {
      setIsMarking(false)
    }
  }

  const navigateToLesson = (lessonData) => {
    if (lessonData?.slug) {
      navigate(`/academy/archetype/${archetypeId}/${lessonData.slug}`)
    }
  }

  if (!lesson || !module) {
    return (
      <div className="academy-error">
        <p>Lesson not found</p>
        <Link to={`/academy/archetype/${archetypeId}`} className="academy-back-link">
          Back to Module
        </Link>
      </div>
    )
  }

  // Find lesson index for numbering
  const lessonIndex = module.lessons.findIndex(l => l.slug === lessonSlug)
  const lessonNumber = lessonIndex + 1

  return (
    <div className="lesson-view">
      {/* Breadcrumbs */}
      <nav className="academy-breadcrumbs">
        <Link to="/academy">Academy</Link>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <Link to={`/academy/archetype/${archetypeId}`}>{lesson.moduleTitle}</Link>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span>{lesson.title}</span>
      </nav>

      {/* Lesson Header */}
      <header className="lesson-header">
        <div className="lesson-meta">
          <span className="archetype-lesson-tag">
            {lesson.moduleIcon} {lesson.moduleTitle}
          </span>
          <span className="archetype-lesson-number-badge">
            Lesson {lessonNumber} of {module.lessons.length}
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
      </header>

      {/* Lesson Content */}
      <article className="lesson-content glass-card">
        <div className="lesson-content-placeholder">
          <div className="placeholder-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="placeholder-title">Content Coming Soon</h3>
          <p className="placeholder-text">
            We're currently writing this lesson. Check back soon for in-depth strategies and insights tailored to your {lesson.moduleTitle} archetype.
          </p>
        </div>
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
        {lesson.prevLesson ? (
          <button
            onClick={() => navigateToLesson(lesson.prevLesson)}
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
        {lesson.nextLesson ? (
          <button
            onClick={() => navigateToLesson(lesson.nextLesson)}
            className="lesson-nav-btn lesson-nav-next"
          >
            Next Lesson
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <Link to={`/academy/archetype/${archetypeId}`} className="lesson-nav-btn lesson-nav-next">
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
