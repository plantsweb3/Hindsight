import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getLevelInfo, LEVEL_THRESHOLDS } from '../../config/xpConfig'
import { getLocalStats } from '../../services/achievements'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function XPBar({ className = '', compact = false }) {
  const { token, isAuthenticated } = useAuth()
  const [progress, setProgress] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadProgress = useCallback(async () => {
    // Always load local stats first
    const localStats = getLocalStats()
    const localXp = localStats.totalXp || 0
    const localLevelInfo = getLevelInfo(localXp)

    // Set initial progress from localStorage
    setProgress({
      levelInfo: localLevelInfo,
      xp: { total: localXp, streak: localStats.currentStreak || 0 }
    })

    // If authenticated, also fetch server data and use the max
    if (isAuthenticated && token) {
      try {
        const res = await fetch(`${API_BASE}/api/academy/xp-progress`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          const serverData = await res.json()
          const serverXp = serverData?.xp?.total || 0
          // Use the higher of local vs server XP
          const totalXp = Math.max(localXp, serverXp)
          const mergedLevelInfo = getLevelInfo(totalXp)
          setProgress({
            levelInfo: mergedLevelInfo,
            xp: { total: totalXp, streak: Math.max(localStats.currentStreak || 0, serverData?.xp?.streak || 0) }
          })
        }
      } catch (err) {
        console.error('Failed to fetch XP progress:', err)
        // Keep using local data on error
      }
    }
    setIsLoading(false)
  }, [isAuthenticated, token])

  useEffect(() => {
    loadProgress()

    // Listen for XP updates from other components
    const handleXpUpdate = () => loadProgress()
    window.addEventListener('xpUpdated', handleXpUpdate)
    window.addEventListener('storage', handleXpUpdate)

    return () => {
      window.removeEventListener('xpUpdated', handleXpUpdate)
      window.removeEventListener('storage', handleXpUpdate)
    }
  }, [loadProgress])

  if (isLoading) {
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
