import { Link, Navigate } from 'react-router-dom'
import { isMasterExamUnlocked, hasMasterExamQuestions, MASTER_EXAM } from '../../data/academy/masterExam'

export default function MasterExamPage() {
  const isUnlocked = isMasterExamUnlocked()
  const hasQuestions = hasMasterExamQuestions()

  // Redirect if not unlocked
  if (!isUnlocked) {
    return <Navigate to="/academy" replace />
  }

  // Show Coming Soon if no questions written yet
  if (!hasQuestions) {
    return (
      <div className="academy-container">
        <div className="master-exam-coming-soon">
          <div className="fire-icon">🔥</div>
          <h1>Master Exam Coming Soon</h1>
          <p>
            The 64-question Master Exam is being prepared. Test your knowledge across all 8 trading archetypes and prove your mastery.
          </p>
          <Link to="/academy" className="back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Academy
          </Link>
        </div>
      </div>
    )
  }

  // When questions exist, render the actual exam flow
  // TODO: Implement actual exam flow when questions are written
  return (
    <div className="academy-container">
      <div className="master-exam-coming-soon">
        <div className="fire-icon">🔥</div>
        <h1>Master Exam</h1>
        <p>
          {MASTER_EXAM.totalQuestions} questions across {MASTER_EXAM.sections.length} archetypes. Pass {Math.round(MASTER_EXAM.passThreshold * 100)}% on each section to master that archetype.
        </p>
        <Link to="/academy" className="back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Academy
        </Link>
      </div>
    </div>
  )
}
