// Master Exam - Structure Only (Questions NOT written yet)
// DO NOT add questions - this file defines the UI structure

export const MASTER_EXAM = {
  title: 'Archetype Master Exam',
  description: 'Prove your mastery across all trading styles. Pass sections to skip ahead.',
  totalQuestions: 64,
  questionsPerArchetype: 8, // 1 per lesson
  passThreshold: 0.75,

  requirement: {
    type: 'module-complete',
    moduleId: 'master', // Trading 101 Master module
    message: 'Complete Trading 101 Master module to unlock'
  },

  sections: [
    {
      archetypeId: 'narrative-front-runner',
      name: 'Narrative Front Runner',
      icon: '🔮',
      questions: [] // TO BE WRITTEN - 8 questions mapping to 8 lessons
    },
    {
      archetypeId: 'diamond-hands',
      name: 'Diamond Hands',
      icon: '💎',
      questions: [] // TO BE WRITTEN
    },
    {
      archetypeId: 'loss-averse',
      name: 'Loss Averse',
      icon: '🛡️',
      questions: [] // TO BE WRITTEN
    },
    {
      archetypeId: 'copy-trader',
      name: 'Copy Trader',
      icon: '👀',
      questions: [] // TO BE WRITTEN
    },
    {
      archetypeId: 'technical-analyst',
      name: 'Technical Analyst',
      icon: '📊',
      questions: [] // TO BE WRITTEN
    },
    {
      archetypeId: 'fomo-trader',
      name: 'FOMO Trader',
      icon: '😰',
      questions: [] // TO BE WRITTEN
    },
    {
      archetypeId: 'impulse-trader',
      name: 'Impulse Trader',
      icon: '⚡',
      questions: [] // TO BE WRITTEN
    },
    {
      archetypeId: 'scalper',
      name: 'Scalper',
      icon: '⚔️',
      questions: [] // TO BE WRITTEN
    }
  ]
}

// Check if Master Exam is unlocked (Trading 101 Master complete)
export function isMasterExamUnlocked() {
  try {
    const data = localStorage.getItem('hindsight_academy_progress')
    if (!data) return false

    const progress = JSON.parse(data)
    const lessonScores = progress.lessonScores || {}

    // Check if master module lessons have been completed
    // Master module has lessons like master/lesson-slug
    const masterKeys = Object.keys(lessonScores).filter(key => key.startsWith('master/'))

    // Also check placement test for master module
    const placementResults = localStorage.getItem('placementTestBestQuestionResults')
    if (placementResults) {
      const results = JSON.parse(placementResults)
      const masterResults = Object.values(results).filter(r => r.moduleId === 'master')
      if (masterResults.length > 0) {
        const passedCount = masterResults.filter(r => r.correct).length
        if (passedCount / masterResults.length >= 0.75) {
          return true
        }
      }
    }

    // Check if at least 75% of master lessons are completed with passing scores
    if (masterKeys.length >= 4) { // At least 4 lessons completed
      const passedCount = masterKeys.filter(key => {
        const score = lessonScores[key]
        return score && score.bestScore >= 0.75
      }).length
      return passedCount >= 4
    }

    return false
  } catch {
    return false
  }
}

// Check if Master Exam has questions written
export function hasMasterExamQuestions() {
  return MASTER_EXAM.sections.every(section => section.questions.length > 0)
}

// Get total questions count
export function getMasterExamQuestionCount() {
  return MASTER_EXAM.sections.reduce((total, section) => total + section.questions.length, 0)
}
