import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getLevelInfo, LEVEL_THRESHOLDS } from '../../config/xpConfig'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function XPBar({ className = '', compact = false }) {
  const { token, isAuthenticated } = useAuth()
  const [progress, setProgress] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setIsLoading(false)
      return
    }

    const fetchProgress = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/academy/xp-progress`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          setProgress(data)
        }
      } catch (err) {
        console.error('Failed to fetch XP progress:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgress()
  }, [isAuthenticated, token])

  if (!isAuthenticated || isLoading) {
    return null
  }

  if (!progress) {
    return null
  }

  const { levelInfo, xp } = progress
  const { level, title, progressPercent, xpToNextLevel, isMaxLevel, xpInCurrentLevel, xpForNextLevel } = levelInfo

  if (compact) {
    return (
      <div className={`xp-bar-compact ${className}`}>
        <div className="xp-level-badge-compact">
          <span className="xp-level-num">{level}</span>
        </div>
        <div className="xp-bar-mini">
          <div className="xp-bar-fill-mini" style={{ width: `${progressPercent}%` }} />
        </div>
        <span className="xp-amount-compact">{xp.total} XP</span>
      </div>
    )
  }

  return (
    <div className={`xp-bar ${className}`}>
      <div className="xp-bar-header">
        <div className="xp-level-info">
          <div className="xp-level-badge">
            <span className="xp-level-num">{level}</span>
          </div>
          <div className="xp-level-text">
            <span className="xp-level-title">{title}</span>
            <span className="xp-level-label">Level {level}</span>
          </div>
        </div>
        <div className="xp-amount">
          <span className="xp-total">{xp.total} XP</span>
          {!isMaxLevel && (
            <span className="xp-to-next">{xpToNextLevel} to next level</span>
          )}
        </div>
      </div>

      <div className="xp-progress-bar">
        <div
          className="xp-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {!isMaxLevel && (
        <div className="xp-progress-text">
          {xpInCurrentLevel} / {xpForNextLevel} XP
        </div>
      )}

      {xp.streak > 0 && (
        <div className="xp-streak">
          <span className="xp-streak-icon">🔥</span>
          <span className="xp-streak-count">{xp.streak} day streak</span>
        </div>
      )}
    </div>
  )
}

// Hook to get XP progress
export function useXPProgress() {
  const { token, isAuthenticated } = useAuth()
  const [progress, setProgress] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProgress = async () => {
    if (!isAuthenticated || !token) {
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_BASE}/api/academy/xp-progress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setProgress(data)
      } else {
        throw new Error('Failed to fetch progress')
      }
    } catch (err) {
      console.error('Failed to fetch XP progress:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [isAuthenticated, token])

  return { progress, isLoading, error, refetch: fetchProgress }
}
