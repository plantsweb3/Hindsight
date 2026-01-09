// Archetype Recommendations System
// Maps archetypes to personalized lesson recommendations

// Default recommendations for each archetype
// strengthLesson: plays to their natural advantage
// pitfallLesson: addresses their most common weakness
export const ARCHETYPE_DEFAULTS = {
  'narrative-front-runner': {
    strengthLesson: {
      lessonSlug: 'finding-narratives-before-they-trend',
      reason: 'Play to your strength'
    },
    pitfallLesson: {
      lessonSlug: 'exit-strategies-for-narratives',
      reason: 'Avoid common pitfalls'
    }
  },
  'diamond-hands': {
    strengthLesson: {
      lessonSlug: 'identifying-hold-worthy-assets',
      reason: 'Play to your strength'
    },
    pitfallLesson: {
      lessonSlug: 'when-diamond-hands-become-bag-holding',
      reason: 'Avoid common pitfalls'
    }
  },
  'loss-averse': {
    strengthLesson: {
      lessonSlug: 'position-sizing-for-capital-preservation',
      reason: 'Play to your strength'
    },
    pitfallLesson: {
      lessonSlug: 'when-caution-becomes-a-problem',
      reason: 'Avoid common pitfalls'
    }
  },
  'copy-trader': {
    strengthLesson: {
      lessonSlug: 'finding-smart-money-to-follow',
      reason: 'Play to your strength'
    },
    pitfallLesson: {
      lessonSlug: 'common-copy-trading-mistakes',
      reason: 'Avoid common pitfalls'
    }
  },
  'technical-analyst': {
    strengthLesson: {
      lessonSlug: 'support-resistance-and-market-structure',
      reason: 'Play to your strength'
    },
    pitfallLesson: {
      lessonSlug: 'combining-technical-and-fundamental-analysis',
      reason: 'Avoid common pitfalls'
    }
  },
  'fomo-trader': {
    strengthLesson: {
      lessonSlug: 'building-a-watchlist-system',
      reason: 'Play to your strength'
    },
    pitfallLesson: {
      lessonSlug: 'the-fomo-override-system',
      reason: 'Avoid common pitfalls'
    }
  },
  'scalper': {
    strengthLesson: {
      lessonSlug: 'scalping-setups-that-work',
      reason: 'Play to your strength'
    },
    pitfallLesson: {
      lessonSlug: 'risk-management-at-high-frequency',
      reason: 'Avoid common pitfalls'
    }
  },
  'impulse-trader': {
    strengthLesson: {
      lessonSlug: 'quick-validation-filters',
      reason: 'Play to your strength'
    },
    pitfallLesson: {
      lessonSlug: 'the-pause-protocol',
      reason: 'Avoid common pitfalls'
    }
  }
}

// Wallet analysis insight to lesson mapping
// Maps common trading issues to relevant archetype lessons
export const INSIGHT_TO_LESSON_MAP = {
  'high-loss-rate': {
    'narrative-front-runner': 'exit-strategies-for-narrative-plays',
    'diamond-hands': 'taking-profits-strategically',
    'fomo-trader': 'the-fomo-override-system',
    'impulse-trader': 'structured-entry-and-exit',
    'loss-averse': 'stop-losses-that-protect',
    'copy-trader': 'common-copy-trading-mistakes',
    'technical-analyst': 'stop-losses-and-invalidation',
    'scalper': 'risk-management-at-high-frequency'
  },
  'poor-timing': {
    'narrative-front-runner': 'timing-your-narrative-entries',
    'fomo-trader': 'strategic-entry-after-the-move',
    'scalper': 'execution-speed-and-precision',
    'impulse-trader': 'quick-validation-filters',
    'diamond-hands': 'accumulation-strategies',
    'technical-analyst': 'volume-and-momentum-signals',
    'loss-averse': 'timing-entries-with-protection',
    'copy-trader': 'timing-your-copy-trades'
  },
  'oversized-positions': {
    'loss-averse': 'position-sizing-for-capital-preservation',
    'impulse-trader': 'structured-entry-and-exit',
    'scalper': 'risk-management-at-high-frequency',
    'fomo-trader': 'position-sizing-for-fomo',
    'diamond-hands': 'building-positions-strategically',
    'narrative-front-runner': 'position-sizing-for-narratives',
    'technical-analyst': 'position-sizing-with-technicals',
    'copy-trader': 'sizing-your-copy-trades'
  },
  'no-exit-strategy': {
    'diamond-hands': 'taking-profits-strategically',
    'narrative-front-runner': 'exit-strategies-for-narrative-plays',
    'fomo-trader': 'the-fomo-override-system',
    'impulse-trader': 'structured-entry-and-exit',
    'loss-averse': 'taking-profits-without-regret',
    'copy-trader': 'exit-strategies-for-copy-trades',
    'technical-analyst': 'profit-taking-with-technicals',
    'scalper': 'quick-profit-taking'
  },
  'chasing-pumps': {
    'fomo-trader': 'the-fomo-override-system',
    'impulse-trader': 'the-pause-protocol',
    'narrative-front-runner': 'timing-your-narrative-entries',
    'diamond-hands': 'patience-in-accumulation',
    'loss-averse': 'avoiding-fomo-with-rules',
    'copy-trader': 'not-chasing-whale-moves',
    'technical-analyst': 'waiting-for-confirmation',
    'scalper': 'waiting-for-setups'
  },
  'holding-too-long': {
    'diamond-hands': 'bag-holding-vs-conviction',
    'loss-averse': 'stop-losses-that-protect',
    'narrative-front-runner': 'exit-strategies-for-narrative-plays',
    'fomo-trader': 'cutting-losses-quickly',
    'impulse-trader': 'quick-validation-filters',
    'copy-trader': 'when-to-stop-copying',
    'technical-analyst': 'invalidation-signals',
    'scalper': 'quick-exits'
  }
}

/**
 * Get personalized lesson recommendations for a user
 * @param {string} archetypeId - The user's archetype
 * @param {Object} archetypeModule - The archetype module data with lessons
 * @param {Array} walletInsights - Optional array of wallet analysis insights
 * @returns {Array} Array of recommended lessons with reasons
 */
export function getArchetypeRecommendations(archetypeId, archetypeModule, walletInsights = []) {
  if (!archetypeModule || !archetypeModule.lessons) {
    return []
  }

  const recommendations = []
  const defaults = ARCHETYPE_DEFAULTS[archetypeId]

  // Priority 1: Wallet analysis insights
  if (walletInsights && walletInsights.length > 0) {
    walletInsights.forEach(insight => {
      const lessonMap = INSIGHT_TO_LESSON_MAP[insight.type]
      if (lessonMap) {
        const lessonSlug = lessonMap[archetypeId]
        if (lessonSlug) {
          const lesson = archetypeModule.lessons.find(l => l.slug === lessonSlug)
          if (lesson && recommendations.length < 2) {
            recommendations.push({
              lesson,
              reason: insight.message || 'Based on your trading history'
            })
          }
        }
      }
    })
  }

  // Priority 2: Archetype-specific defaults (fill remaining slots)
  if (defaults && recommendations.length < 2) {
    // Add strength lesson first if not already added
    if (recommendations.length === 0 && defaults.strengthLesson) {
      const strengthLesson = archetypeModule.lessons.find(
        l => l.slug === defaults.strengthLesson.lessonSlug
      )
      if (strengthLesson) {
        recommendations.push({
          lesson: strengthLesson,
          reason: defaults.strengthLesson.reason
        })
      }
    }

    // Add pitfall lesson second if not already added
    if (recommendations.length === 1 && defaults.pitfallLesson) {
      const pitfallLesson = archetypeModule.lessons.find(
        l => l.slug === defaults.pitfallLesson.lessonSlug
      )
      if (pitfallLesson) {
        recommendations.push({
          lesson: pitfallLesson,
          reason: defaults.pitfallLesson.reason
        })
      }
    }
  }

  // Fallback: If still not enough recommendations, use first available lessons
  if (recommendations.length < 2) {
    const existingSlugs = recommendations.map(r => r.lesson.slug)
    const remainingLessons = archetypeModule.lessons.filter(
      l => !existingSlugs.includes(l.slug)
    )

    while (recommendations.length < 2 && remainingLessons.length > 0) {
      const lesson = remainingLessons.shift()
      recommendations.push({
        lesson,
        reason: 'Recommended for you'
      })
    }
  }

  return recommendations
}

/**
 * Get wallet analysis insights for a user (placeholder - integrate with actual analysis)
 * @param {string} userId - The user ID
 * @returns {Array} Array of insight objects with type and message
 */
export function getWalletAnalysisInsights(userId) {
  // TODO: Integrate with actual wallet analysis data
  // For now, return empty array to use defaults
  // In production, this would fetch from the user's wallet analysis

  // Example format:
  // return [
  //   { type: 'high-loss-rate', message: 'Your win rate is below 40%' },
  //   { type: 'chasing-pumps', message: 'Buying after 50%+ moves' }
  // ]

  return []
}
