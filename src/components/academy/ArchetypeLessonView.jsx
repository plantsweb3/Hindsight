import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { getArchetypeLesson, getArchetypeModule, getArchetypeLessonQuiz } from './archetypeData'
import Quiz from './Quiz'

// Simple markdown-to-html conversion for basic formatting
function MarkdownContent({ content }) {
  const parseMarkdown = (text) => {
    if (!text) return ''

    let html = text
      // Code blocks (triple backticks)
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Tables (basic support)
      .replace(/\|(.+)\|/gim, (match) => {
        const cells = match.split('|').filter(c => c.trim())
        if (cells.every(c => c.trim().match(/^[-:]+$/))) {
          return '' // Skip separator rows
        }
        const cellHtml = cells.map(c => `<td>${c.trim()}</td>`).join('')
        return `<tr>${cellHtml}</tr>`
      })
      // Unordered lists
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

    // Wrap table rows in table
    html = html.replace(/(<tr>.*?<\/tr>)+/gis, '<table class="lesson-table">$&</table>')

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/gim, '')
    html = html.replace(/<p>\s*<ul>/gim, '<ul>')
    html = html.replace(/<\/ul>\s*<\/p>/gim, '</ul>')
    html = html.replace(/<p>\s*<h/gim, '<h')
    html = html.replace(/<\/h(\d)>\s*<\/p>/gim, '</h$1>')
    html = html.replace(/<p>\s*<pre>/gim, '<pre>')
    html = html.replace(/<\/pre>\s*<\/p>/gim, '</pre>')
    html = html.replace(/<p>\s*<table/gim, '<table')
    html = html.replace(/<\/table>\s*<\/p>/gim, '</table>')

    return html
  }

  return (
    <div
      className="lesson-content-text"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  )
}

export default function ArchetypeLessonView() {
  const { archetypeId, lessonSlug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, openAuthModal } = useOutletContext()
  const [isCompleted, setIsCompleted] = useState(false)
  const [isMarking, setIsMarking] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const lesson = getArchetypeLesson(archetypeId, lessonSlug)
  const module = getArchetypeModule(archetypeId)
  const quiz = lesson ? getArchetypeLessonQuiz(archetypeId, lesson.id) : null

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

    // Check if quiz is completed from localStorage
    const checkQuizCompleted = () => {
      if (!quiz) return
      try {
        const saved = localStorage.getItem(`archetype_quiz_${archetypeId}`)
        if (saved) {
          const completedQuizzes = new Set(JSON.parse(saved))
          setQuizCompleted(completedQuizzes.has(lesson?.id))
        }
      } catch (e) {
        console.error('Failed to check quiz completion:', e)
      }
    }

    checkCompleted()
    checkQuizCompleted()
  }, [archetypeId, lessonSlug, quiz, lesson?.id])

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

  const handleQuizComplete = (results) => {
    // Save quiz completion to localStorage
    try {
      const saved = localStorage.getItem(`archetype_quiz_${archetypeId}`)
      const completedQuizzes = saved ? new Set(JSON.parse(saved)) : new Set()
      completedQuizzes.add(lesson.id)
      localStorage.setItem(`archetype_quiz_${archetypeId}`, JSON.stringify([...completedQuizzes]))
      setQuizCompleted(true)
    } catch (e) {
      console.error('Failed to save quiz completion:', e)
    }
  }

  const handleQuizClose = () => {
    setShowQuiz(false)
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
          {lesson.readTime && (
            <span className="lesson-reading-time">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {lesson.readTime} min read
            </span>
          )}
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
        {lesson.content ? (
          <MarkdownContent content={lesson.content} />
        ) : (
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
        )}

        {/* Quiz Section */}
        {quiz && isAuthenticated && (
          <div className="lesson-quiz-section">
            <div className="lesson-quiz-prompt">
              <div className="lesson-quiz-info">
                <span className="lesson-quiz-title">Test Your Knowledge</span>
                <span className="lesson-quiz-desc">
                  {quizCompleted
                    ? 'Quiz completed!'
                    : `${quiz.questions.length} questions - Test what you learned`}
                </span>
              </div>
              <button
                onClick={() => setShowQuiz(true)}
                className={`lesson-quiz-btn ${quizCompleted ? 'completed' : ''}`}
              >
                {quizCompleted ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Retake Quiz
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                    Take Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        )}
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
          <button onClick={() => openAuthModal('login')} className="lesson-login-prompt">
            Sign in to track your progress
          </button>
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

      {/* Quiz Modal */}
      {showQuiz && quiz && (
        <div className="quiz-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) handleQuizClose()
        }}>
          <div className="quiz-modal-content">
            <Quiz
              quiz={quiz}
              onComplete={handleQuizComplete}
              onClose={handleQuizClose}
            />
          </div>
        </div>
      )}
    </div>
  )
}
