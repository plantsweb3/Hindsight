import { useState, useEffect } from 'react'
import { Link, useParams, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getTrading101Module, hasLocalModule } from '../../data/academy/modules'
import { getLessonCardStatus } from '../../services/achievements'

// Helper for local progress tracking (same as LessonView)
const LOCAL_PROGRESS_KEY = 'hindsight_academy_progress'

function getLocalProgress() {
  try {
    const data = localStorage.getItem(LOCAL_PROGRESS_KEY)
    return data ? JSON.parse(data) : { completedLessons: [] }
  } catch {
    return { completedLessons: [] }
  }
}

function getCompletedLessonsForModule(moduleSlug) {
  const progress = getLocalProgress()
  const prefix = `${moduleSlug}/`
  return progress.completedLessons
    .filter(key => key.startsWith(prefix))
    .map(key => key.replace(prefix, ''))
}

function LessonCard({ lesson, moduleSlug, status }) {
  // Determine card class based on status
  const getCardClass = () => {
    if (status.style === 'green-glow') return 'lesson-status-passed'
    if (status.style === 'yellow') return 'lesson-status-review'
    return 'lesson-status-not-started'
  }

  return (
    <Link
      to={`/academy/${moduleSlug}/${lesson.slug}`}
      className={`lesson-card glass-card ${getCardClass()}`}
    >
      <div className="lesson-card-header">
        <span className={`lesson-difficulty difficulty-${lesson.difficulty}`}>
          {lesson.difficulty}
        </span>
        <div className="lesson-status-badges">
          <span className={`lesson-status-badge status-${status.style}`}>
            {status.style === 'green-glow' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {status.displayText}
          </span>
        </div>
      </div>
      <h3 className="lesson-card-title">{lesson.title}</h3>
      <p className="lesson-card-desc">{lesson.description}</p>
      <div className="lesson-card-footer">
        <span className="lesson-time">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {lesson.reading_time} min read
        </span>
        <span className="lesson-cta">
          {status.type === 'not-started' ? 'Start' : 'Review'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

export default function ModuleView() {
  const { moduleSlug } = useParams()
  const { isAuthenticated } = useOutletContext()
  const { token } = useAuth()
  const [module, setModule] = useState(null)
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    fetchModule()
  }, [moduleSlug, token])

  const fetchModule = async () => {
    setIsLoading(true)
    setError('')

    try {
      let moduleData = null

      // Check for local data first
      if (hasLocalModule(moduleSlug)) {
        const localModule = getTrading101Module(moduleSlug)
        if (localModule) {
          // Transform local module to match API format
          moduleData = {
            module: {
              ...localModule,
              lessons: localModule.lessons.map(l => ({
                id: l.id,
                title: l.title,
                slug: l.slug,
                description: l.description,
                reading_time: l.readTime,
                difficulty: l.difficulty
              }))
            }
          }
        }
      }

      // Fall back to API if no local data
      if (!moduleData) {
        const moduleRes = await fetch(`/api/academy/modules/${moduleSlug}`)
        if (!moduleRes.ok) {
          if (moduleRes.status === 404) {
            throw new Error('Module not found')
          }
          throw new Error('Failed to fetch module')
        }
        moduleData = await moduleRes.json()
      }

      setModule(moduleData.module)

      // Check for progress
      const isLocalModuleData = hasLocalModule(moduleSlug)

      if (isLocalModuleData) {
        // For local modules, use localStorage (works without auth)
        const completedSlugs = getCompletedLessonsForModule(moduleSlug)
        setCompletedLessonIds(new Set(completedSlugs))
      } else if (token) {
        // For API modules, fetch progress from server
        const progressRes = await fetch('/api/academy/progress', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (progressRes.ok) {
          const progressData = await progressRes.json()
          // completedLessonIds is an array of lesson IDs
          const completedIds = new Set(progressData.progress?.completedLessonIds || [])
          setCompletedLessonIds(completedIds)
        }
      }
    } catch (err) {
      console.error('Failed to fetch module:', err)
      setError(err.message || 'Failed to load module')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="academy-loading">
        <div className="spinner" />
        <p>Loading module...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="academy-error">
        <p>{error}</p>
        <Link to="/academy" className="academy-back-link">
          Back to Academy
        </Link>
      </div>
    )
  }

  if (!module) {
    return null
  }

  // For local modules, completedLessonIds contains slugs; for API modules, it contains IDs
  const completedCount = module.lessons?.filter(l =>
    completedLessonIds.has(l.id) || completedLessonIds.has(l.slug)
  ).length || 0
  const totalLessons = module.lessons?.length || 0
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  return (
    <div className="module-view">
      {/* Breadcrumbs */}
      <nav className="academy-breadcrumbs">
        <Link to="/academy">Academy</Link>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span>{module.title}</span>
      </nav>

      {/* Module Header */}
      <header className="module-header">
        <div className="module-icon">
          <span>{module.icon || '📚'}</span>
        </div>
        <div className="module-info">
          <h1 className="module-title">{module.title}</h1>
          <p className="module-desc">{module.description}</p>
          <div className="module-stats">
            <span className="module-stat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {totalLessons} lessons
            </span>
            {completedCount > 0 && (
              <span className="module-stat module-stat-progress">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {completedCount} completed
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {totalLessons > 0 && (isAuthenticated || hasLocalModule(moduleSlug)) && (
        <div className="module-progress-section">
          <div className="module-progress-bar-large">
            <div className="module-progress-fill-large" style={{ width: `${progress}%` }} />
          </div>
          <span className="module-progress-label">{progress}% complete</span>
        </div>
      )}

      {/* Lessons List */}
      <section className="lessons-section">
        <h2 className="lessons-title">Lessons</h2>
        <div className="lessons-list">
          {module.lessons?.map((lesson, index) => {
            const status = getLessonCardStatus(moduleSlug, lesson.slug)
            return (
              <div key={lesson.id} className="lesson-item">
                <span className="lesson-number">{index + 1}</span>
                <LessonCard
                  lesson={lesson}
                  moduleSlug={moduleSlug}
                  status={status}
                />
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
