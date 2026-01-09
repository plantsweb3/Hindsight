import { Link, useParams } from 'react-router-dom'
import { getArchetypeModule } from './archetypeData'
import { getArchetypeLessonCardStatus } from '../../services/achievements'

function LessonCard({ lesson, archetypeId, lessonNumber, status }) {
  // Determine card class based on status
  const getCardClass = () => {
    if (status.style === 'green-glow') return 'lesson-status-passed'
    if (status.style === 'yellow') return 'lesson-status-review'
    return 'lesson-status-not-started'
  }

  return (
    <Link
      to={`/academy/archetype/${archetypeId}/${lesson.slug}`}
      className={`lesson-card glass-card ${getCardClass()}`}
    >
      <div className="lesson-card-header">
        <span className="archetype-lesson-number">Lesson {lessonNumber}</span>
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
      <div className="lesson-card-footer">
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

export default function ArchetypeModuleView() {
  const { archetypeId } = useParams()

  const module = getArchetypeModule(archetypeId)

  if (!module) {
    return (
      <div className="academy-error">
        <p>Archetype module not found</p>
        <Link to="/academy" className="academy-back-link">
          Back to Academy
        </Link>
      </div>
    )
  }

  const completedCount = module.lessons.filter(l => {
    const status = getArchetypeLessonCardStatus(archetypeId, l.slug)
    return status.type === 'completed'
  }).length
  const totalLessons = module.lessons.length
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
          <span>{module.icon}</span>
        </div>
        <div className="module-info">
          <p className="archetype-module-subtitle">{module.subtitle}</p>
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
      {totalLessons > 0 && completedCount > 0 && (
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
          {module.lessons.map((lesson, index) => {
            const status = getArchetypeLessonCardStatus(archetypeId, lesson.slug)
            return (
              <div key={lesson.id} className="lesson-item">
                <span className="lesson-number">{index + 1}</span>
                <LessonCard
                  lesson={lesson}
                  archetypeId={archetypeId}
                  lessonNumber={index + 1}
                  status={status}
                />
              </div>
            )
          })}
        </div>
      </section>

      {/* Back Link */}
      <div className="module-back-section">
        <Link to="/academy" className="module-back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Academy
        </Link>
      </div>
    </div>
  )
}
