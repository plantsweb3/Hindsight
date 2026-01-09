import { createContext, useContext, useState, useCallback } from 'react'
import {
  ACHIEVEMENTS,
  checkAchievements,
  getLocalAchievements,
  saveLocalAchievement,
  getLocalStats,
  incrementLessonsCompleted,
  markModuleCompletedLocal,
  updateLocalStats,
  calculateAchievementXpReward
} from '../services/achievements'

const AchievementContext = createContext(null)

export function AchievementProvider({ children }) {
  // Queue of achievements to celebrate (shown one at a time)
  const [achievementQueue, setAchievementQueue] = useState([])
  const [isShowingCelebration, setIsShowingCelebration] = useState(false)

  // Add achievements to the celebration queue
  const queueAchievements = useCallback((newAchievementIds) => {
    if (!newAchievementIds || newAchievementIds.length === 0) return

    const achievements = newAchievementIds
      .map(id => ACHIEVEMENTS[id])
      .filter(Boolean)

    if (achievements.length > 0) {
      setAchievementQueue(prev => [...prev, ...achievements])
      setIsShowingCelebration(true)
    }
  }, [])

  // Get current achievement being celebrated
  const currentCelebration = achievementQueue[0] || null

  // Dismiss current celebration and show next (if any)
  const dismissCelebration = useCallback(() => {
    setAchievementQueue(prev => {
      const remaining = prev.slice(1)
      if (remaining.length === 0) {
        setIsShowingCelebration(false)
      }
      return remaining
    })
  }, [])

  // Check achievements after lesson completion (local)
  const checkLessonCompletion = useCallback((moduleSlug, lessonSlug, earnedAchievements = []) => {
    // Increment local lesson count
    const stats = incrementLessonsCompleted()

    // Merge with any server-side earned achievements
    const allEarned = [...new Set([...getLocalAchievements(), ...earnedAchievements])]

    // Check for new achievements
    const newAchievements = checkAchievements(stats, allEarned, 'lesson-complete', {
      moduleSlug,
      lessonSlug
    })

    // Save and queue new achievements
    newAchievements.forEach(id => saveLocalAchievement(id))
    queueAchievements(newAchievements)

    return {
      newAchievements,
      xpReward: calculateAchievementXpReward(newAchievements)
    }
  }, [queueAchievements])

  // Check achievements after quiz completion
  const checkQuizCompletion = useCallback((quizResults, earnedAchievements = []) => {
    const stats = getLocalStats()
    const allEarned = [...new Set([...getLocalAchievements(), ...earnedAchievements])]

    // Check for new achievements
    const newAchievements = checkAchievements(stats, allEarned, 'quiz-complete', {
      perfect: quizResults.perfect,
      score: quizResults.score,
      totalQuestions: quizResults.totalQuestions
    })

    // Save and queue new achievements
    newAchievements.forEach(id => saveLocalAchievement(id))
    queueAchievements(newAchievements)

    return {
      newAchievements,
      xpReward: calculateAchievementXpReward(newAchievements)
    }
  }, [queueAchievements])

  // Check achievements after module completion
  const checkModuleCompletion = useCallback((moduleSlug, earnedAchievements = []) => {
    // Mark module as completed in local stats
    const stats = markModuleCompletedLocal(moduleSlug)
    const allEarned = [...new Set([...getLocalAchievements(), ...earnedAchievements])]

    // Check for new achievements
    const newAchievements = checkAchievements(stats, allEarned, 'module-complete', {
      moduleSlug
    })

    // Save and queue new achievements
    newAchievements.forEach(id => saveLocalAchievement(id))
    queueAchievements(newAchievements)

    return {
      newAchievements,
      xpReward: calculateAchievementXpReward(newAchievements)
    }
  }, [queueAchievements])

  // Check achievements after XP update
  const checkXpMilestone = useCallback((totalXp, earnedAchievements = []) => {
    const stats = { ...getLocalStats(), totalXp }
    updateLocalStats({ totalXp })

    const allEarned = [...new Set([...getLocalAchievements(), ...earnedAchievements])]

    // Check for XP-based achievements
    const newAchievements = checkAchievements(stats, allEarned, 'xp-update', { totalXp })

    // Save and queue new achievements
    newAchievements.forEach(id => saveLocalAchievement(id))
    queueAchievements(newAchievements)

    return {
      newAchievements,
      xpReward: calculateAchievementXpReward(newAchievements)
    }
  }, [queueAchievements])

  // Update streak in local stats
  const updateStreak = useCallback((currentStreak) => {
    const stats = updateLocalStats({ currentStreak })
    const allEarned = getLocalAchievements()

    // Check for streak-based achievements
    const newAchievements = checkAchievements(stats, allEarned, 'streak-update', {
      currentStreak
    })

    // Save and queue new achievements
    newAchievements.forEach(id => saveLocalAchievement(id))
    queueAchievements(newAchievements)

    return {
      newAchievements,
      xpReward: calculateAchievementXpReward(newAchievements)
    }
  }, [queueAchievements])

  // Get all earned achievements (local + server)
  const getEarnedAchievements = useCallback((serverAchievements = []) => {
    const localAchievements = getLocalAchievements()
    return [...new Set([...localAchievements, ...serverAchievements])]
  }, [])

  const value = {
    // Celebration state
    isShowingCelebration,
    currentCelebration,
    dismissCelebration,
    achievementQueue,

    // Achievement checking functions
    checkLessonCompletion,
    checkQuizCompletion,
    checkModuleCompletion,
    checkXpMilestone,
    updateStreak,
    getEarnedAchievements,

    // Manual queue function (for server-triggered achievements)
    queueAchievements
  }

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  )
}

export function useAchievements() {
  const context = useContext(AchievementContext)
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider')
  }
  return context
}
