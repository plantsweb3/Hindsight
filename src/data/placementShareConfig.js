// Placement Test Share Card Configuration

// Level styling system - each level gets unique colors
export const LEVEL_STYLES = {
  newcomer: {
    gradient: 'linear-gradient(135deg, #374151 0%, #1F2937 100%)',
    border: '#4B5563',
    glow: 'rgba(75, 85, 99, 0.4)',
    stars: 1,
    isJourney: true, // Use journey variant (progress bar instead of stats)
  },
  apprentice: {
    gradient: 'linear-gradient(135deg, #065F46 0%, #064E3B 100%)',
    border: '#10B981',
    glow: 'rgba(16, 185, 129, 0.4)',
    stars: 2,
    isJourney: true,
  },
  trader: {
    gradient: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
    border: '#3B82F6',
    glow: 'rgba(59, 130, 246, 0.4)',
    stars: 3,
    isJourney: false, // Use flex variant (stats row)
  },
  specialist: {
    gradient: 'linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)',
    border: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.4)',
    stars: 4,
    isJourney: false,
  },
  master: {
    gradient: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)',
    border: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.5)',
    stars: 5,
    isJourney: false,
  },
}

// Flex lines (card subtitle) - dynamic copy based on level
export const FLEX_LINES = {
  master: [
    "Top 8% of traders who took this test",
    "Most traders never reach this level",
    "Your knowledge is showing",
  ],
  specialist: [
    "Top 15% of traders who took this test",
    "Your edge is showing",
    "Ready for advanced strategies",
  ],
  trader: [
    "Top 35% of traders who took this test",
    "Solid foundation, room to grow",
    "You know more than most",
  ],
  apprentice: [
    "Smart enough to know what I don't know",
    "Building blocks in place",
    "The foundation is set",
  ],
  newcomer: [
    "Everyone starts somewhere",
    "Awareness is the first step",
    "Ready to learn",
  ],
}

// Tweet templates for each level
export const TWEET_TEMPLATES = {
  master: `Just placed into MASTER level on the Hindsight Academy trading test

Top 8% of traders.

Think you can beat it?
tradehindsight.com/academy`,

  specialist: `Placed into SPECIALIST on Hindsight Academy's placement test

4/5 modules cleared.

Test your trading IQ
tradehindsight.com/academy`,

  trader: `Took the Hindsight Academy placement test - placed into TRADER level

Where do you rank?
tradehindsight.com/academy`,

  apprentice: `Starting my Hindsight Academy journey as an APPRENTICE

Time to level up.

Take the test
tradehindsight.com/academy`,

  newcomer: `Just took the Hindsight Academy placement test.

Starting from scratch. Let's see where you land
tradehindsight.com/academy`,
}

// Share prompt messages based on performance
export function getSharePromptMessage(level, score) {
  // High performers (Specialist/Master or 85%+ score)
  if (level === 'master' || level === 'specialist' || score >= 85) {
    const highScoreMessages = [
      "Go ahead, flex your knowledge.",
      "You earned this. Show it off.",
      "Not everyone can say this. You can.",
      "Your trading IQ is showing.",
      "Yeah, you can brag about this one.",
      "Screenshot-worthy, if we do say so ourselves.",
    ]
    return highScoreMessages[Math.floor(Math.random() * highScoreMessages.length)]
  }

  // Mid performers (Trader or 60-84% score)
  if (level === 'trader' || (score >= 60 && score < 85)) {
    const midScoreMessages = [
      "Solid start. The best traders never stop learning.",
      "You're ahead of most. Keep climbing.",
      "Not bad at all. Room to grow, but you've got the foundation.",
      "Your journey is just getting interesting.",
      "Challenge your friends. See how they stack up.",
    ]
    return midScoreMessages[Math.floor(Math.random() * midScoreMessages.length)]
  }

  // Lower performers (Newcomer/Apprentice or <60% score)
  const lowScoreMessages = [
    "The journey to the top starts with one step.",
    "Every master was once a beginner.",
    "Knowing where you stand is the first win.",
    "The best time to start learning was yesterday. The second best is now.",
    "You showed up. That's more than most do.",
    "Self-awareness is a trading superpower. You've got it.",
    "Your future self will thank you for starting today.",
  ]
  return lowScoreMessages[Math.floor(Math.random() * lowScoreMessages.length)]
}

// Get a random flex line for the given level
export function getFlexLine(level) {
  const lines = FLEX_LINES[level] || FLEX_LINES.newcomer
  return lines[Math.floor(Math.random() * lines.length)]
}

// Get tweet text for the given level
export function getTweetText(level) {
  return TWEET_TEMPLATES[level] || TWEET_TEMPLATES.newcomer
}

// Calculate lessons remaining to Master
export function getLessonsToMaster(modulesCleared, totalModules = 5, lessonsPerModule = 5) {
  const modulesRemaining = totalModules - modulesCleared
  return modulesRemaining * lessonsPerModule
}
