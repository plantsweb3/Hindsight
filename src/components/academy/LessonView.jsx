import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useOutletContext } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { useAuth } from '../../contexts/AuthContext'
import { useAchievements } from '../../contexts/AchievementContext'
import Quiz from './Quiz'
import { NEWCOMER_QUIZZES, getQuizByLessonSlug } from '../../data/quizzes/newcomer'
import { getTrading101Lesson, hasLocalModule, getTrading101LessonQuiz } from '../../data/academy/modules'
import { saveLessonQuizScore, getLessonProgress, syncProgressToServer } from '../../services/achievements'

// Helper for local progress tracking
const LOCAL_PROGRESS_KEY = 'hindsight_academy_progress'

function getLocalProgress() {
  try {
    const data = localStorage.getItem(LOCAL_PROGRESS_KEY)
    return data ? JSON.parse(data) : { completedLessons: [] }
  } catch {
    return { completedLessons: [] }
  }
}

function saveLocalProgress(progress) {
  localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(progress))
}

function isLessonCompleted(moduleSlug, lessonSlug) {
  const progress = getLocalProgress()
  const key = `${moduleSlug}/${lessonSlug}`
  return progress.completedLessons.includes(key)
}

function markLessonCompleted(moduleSlug, lessonSlug) {
  const progress = getLocalProgress()
  const key = `${moduleSlug}/${lessonSlug}`
  if (!progress.completedLessons.includes(key)) {
    progress.completedLessons.push(key)
    saveLocalProgress(progress)
    return true
  }
  return false
}

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

    // Sanitize HTML to prevent XSS
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'strong', 'em', 'ul', 'li', 'code', 'pre'],
      ALLOWED_ATTR: []
    })
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
  const { isAuthenticated, openAuthModal } = useOutletContext()
  const { token } = useAuth()
  const { checkLessonCompletion, checkQuizCompletion } = useAchievements()
  const [lesson, setLesson] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isMarking, setIsMarking] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizScore, setQuizScore] = useState(null)
  const [xpEarned, setXpEarned] = useState(0)

  // Get quiz for this lesson if it exists
  // Check Trading 101 quizzes first, then fall back to old newcomer system
  const trading101Quiz = lesson ? getTrading101LessonQuiz(moduleSlug, lesson.id) : null
  const quiz = trading101Quiz || getQuizByLessonSlug(lessonSlug)

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    fetchLesson()
  }, [moduleSlug, lessonSlug, token])

  // Fetch quiz scores when lesson loads
  useEffect(() => {
    if (quiz) {
      fetchQuizScore()
    }
  }, [token, lessonSlug, moduleSlug])

  const fetchLesson = async () => {
    setIsLoading(true)
    setError('')

    try {
      let lessonData = null
      let isLocalModule = hasLocalModule(moduleSlug)

      // Check for local data first
      if (isLocalModule) {
        const localLesson = getTrading101Lesson(moduleSlug, lessonSlug)
        if (localLesson) {
          lessonData = { lesson: localLesson }
        }
      }

      // Fall back to API if no local data
      if (!lessonData) {
        const lessonRes = await fetch(`/api/academy/lessons/${moduleSlug}/${lessonSlug}`)
        if (!lessonRes.ok) {
          if (lessonRes.status === 404) {
            throw new Error('Lesson not found')
          }
          throw new Error('Failed to fetch lesson')
        }
        lessonData = await lessonRes.json()
        isLocalModule = false
      }

      setLesson(lessonData.lesson)

      // Check if completed
      if (isLocalModule) {
        // For local modules, use localStorage
        const completed = isLessonCompleted(moduleSlug, lessonSlug)
        setIsCompleted(completed)
      } else if (token) {
        // For API modules, use the API
        const progressRes = await fetch('/api/academy/progress', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (progressRes.ok) {
          const progressData = await progressRes.json()
          const completed = progressData.progress?.completedLessonIds?.includes(lessonData.lesson.id)
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

  const fetchQuizScore = async () => {
    // First check localStorage for local modules
    const localScore = getLessonProgress(moduleSlug, lessonSlug)
    if (localScore) {
      setQuizScore({
        best_score: Math.round(localScore.bestScore * 5), // Convert to 0-5 scale
        best_xp_earned: localScore.bestScore >= 0.8 ? 10 : 0
      })
    }

    // Also try API if authenticated
    if (token) {
      try {
        const res = await fetch('/api/academy/quiz/scores', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          const score = data.scores?.find(s => s.quiz_id === lessonSlug)
          if (score) {
            setQuizScore(score)
          }
        }
      } catch (err) {
        console.error('Failed to fetch quiz score:', err)
      }
    }
  }

  const handleMarkComplete = async () => {
    if (!lesson) return

    setIsMarking(true)
    try {
      const isLocalModuleLesson = hasLocalModule(moduleSlug)

      if (isLocalModuleLesson) {
        // For local modules, use localStorage
        const isNew = markLessonCompleted(moduleSlug, lessonSlug)
        setIsCompleted(true)
        if (isNew) {
          setXpEarned(10) // Show XP earned for local completion
          // Check for achievements after completing lesson
          checkLessonCompletion(moduleSlug, lessonSlug)
          // Sync progress to server for cross-device sync
          if (token) {
            syncProgressToServer(token).catch(() => {})
          }
        }
      } else if (token) {
        // For API modules, use the API
        const res = await fetch('/api/academy/lesson/complete', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ lessonId: lesson.id })
        })
        if (res.ok) {
          const data = await res.json()
          setIsCompleted(true)
          if (data.xpEarned > 0) {
            setXpEarned(data.xpEarned)
          }
          // Check for achievements after completing lesson
          checkLessonCompletion(moduleSlug, lessonSlug)
        }
      }
    } catch (err) {
      console.error('Failed to mark lesson complete:', err)
    } finally {
      setIsMarking(false)
    }
  }

  const handleQuizComplete = (results) => {
    // Save quiz score to localStorage for mastery tracking
    const totalQuestions = quiz?.questions?.length || 5
    saveLessonQuizScore(moduleSlug, lessonSlug, results.score, totalQuestions)

    setQuizScore({
      best_score: results.score,
      best_xp_earned: results.xpEarned
    })
    if (results.xpEarned > 0) {
      setXpEarned(prev => prev + results.xpEarned)
    }
    // Check for quiz-related achievements (like perfect score)
    checkQuizCompletion(results)

    // Sync progress to server for cross-device sync
    if (token) {
      syncProgressToServer(token).catch(() => {})
    }
  }

  const handleQuizClose = () => {
    setShowQuiz(false)
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

        {/* Quiz Section */}
        {quiz && isAuthenticated && (
          <div className="lesson-quiz-section">
            <div className="lesson-quiz-prompt">
              <div className="lesson-quiz-info">
                <span className="lesson-quiz-title">Test Your Knowledge</span>
                <span className="lesson-quiz-desc">
                  {quizScore
                    ? `Best score: ${quizScore.best_score}/5 - ${quizScore.best_xp_earned} XP earned`
                    : '5 questions - Pass with 80% to earn XP'}
                </span>
              </div>
              <button
                onClick={() => setShowQuiz(true)}
                className={`lesson-quiz-btn ${quizScore?.best_score === 5 ? 'completed' : ''}`}
              >
                {quizScore ? (
                  quizScore.best_score === 5 ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Perfect!
                    </>
                  ) : (
                    'Retake Quiz'
                  )
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

      {/* XP Earned Notification */}
      {xpEarned > 0 && (
        <div className="xp-earned-notification">
          <span className="xp-earned-badge">+{xpEarned} XP</span>
        </div>
      )}

      {/* Actions */}
      <div className="lesson-actions">
        {(isAuthenticated || hasLocalModule(moduleSlug)) ? (
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
        {/* Left side: Previous Lesson or Back to Module */}
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
          <Link to={`/academy/${moduleSlug}`} className="lesson-nav-btn lesson-nav-prev">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Module
          </Link>
        )}
        {/* Right side: Next Lesson or Back to Module (if at end) */}
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
            Complete Module
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
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
