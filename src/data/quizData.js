// Archetype definitions
export const ARCHETYPES = {
  DiamondHands: {
    name: 'Diamond Hands',
    emoji: '💎',
    description: "You're a conviction trader who buys what you believe in and holds through the chaos. While others panic sell at -50%, you're averaging down. You've seen your portfolio swing wildly and you've got the battle scars to prove it. When you're right, you're really right.",
    strengths: [
      'Captures full runs that others sell too early',
      "Doesn't get shaken out by volatility",
      'Strong research and conviction in picks',
    ],
    weaknesses: [
      'Holds losers way past their expiration date',
      'Confuses hope with conviction',
      'Misses obvious exit signals',
    ],
    coaching: "Learn to distinguish real conviction from copium. Set invalidation points before entry. A diamond hand that never sells is just a bag holder with a better story.",
    cta: "Your conviction is your superpower - but is it backed by data? Connect your wallet and we'll analyze your actual holds. We'll show you which diamonds were worth holding and which ones were just rocks.",
  },
  Scalper: {
    name: 'Scalper',
    emoji: '⚡',
    description: "You're in and out before most people even notice the candle. Speed is your edge - you grab quick profits and move on to the next play. You don't marry positions, you date them for about fifteen minutes.",
    strengths: [
      'Limits downside exposure',
      'Compounds small wins into real gains',
      'Decisive execution',
    ],
    weaknesses: [
      'Overtrading eats into profits',
      'Misses big runners by exiting too early',
      'Fees and slippage add up fast',
    ],
    coaching: "Quality over quantity. Not every candle needs your attention. Track your win rate and average gain - if the math doesn't work, slow down.",
    cta: "You move fast - but are your quick trades actually adding up? Connect your wallet and we'll break down your win rate, average gain, and whether the math is working in your favor.",
  },
  NarrativeFrontRunner: {
    name: 'Narrative Front-Runner',
    emoji: '🔮',
    description: "You see the meta before it forms. While everyone's chasing today's pump, you're already positioned for next week's narrative. You live in Discord alpha chats and your watchlist is full of coins nobody's heard of yet.",
    strengths: [
      'Early entries with massive upside',
      'Strong research and pattern recognition',
      'Understands market psychology',
    ],
    weaknesses: [
      'Sometimes too early, watches positions bleed',
      'Impatient when narratives take time to play out',
      'Over-researches and misses simpler plays',
    ],
    coaching: "Being early is only valuable if you manage the wait. Size smaller on speculative narrative plays and add when confirmation hits.",
    cta: "You're early to the narrative - but are you timing your exits right? Connect your wallet and we'll analyze whether you're capturing the upside on your big brain plays or leaving money on the table.",
  },
  FOMO: {
    name: 'FOMO Trader',
    emoji: '🚀',
    description: "When your timeline is full of green PnLs, you can't stay on the sidelines. You see others making money and you need to be in something. The fear of missing out drives more of your entries than you'd like to admit.",
    strengths: [
      'Aware of market sentiment and momentum',
      'Willing to take action',
      'Stays engaged with the market',
    ],
    weaknesses: [
      'Buys tops consistently',
      'Enters without a plan',
      'Emotional decision-making',
    ],
    coaching: "The best trade is often no trade. Build a system for entries that doesn't involve how you feel. If you're buying because everyone else is winning, you're already late.",
    cta: "Let's be honest about how those late entries are working out. Connect your wallet and we'll show you the real cost of chasing pumps. No judgment - just data on your entry timing.",
  },
  CopyTrader: {
    name: 'Copy Trader',
    emoji: '👀',
    description: "Why do your own research when smart wallets do it for you? You follow the top traders, watch influencer callouts, and let others find the alpha. When the whales move, you move.",
    strengths: [
      "Leverages others' expertise",
      "Finds opportunities you'd miss solo",
      'Low research time investment',
    ],
    weaknesses: [
      'Always one step behind the source',
      'No edge on exit timing',
      'Vulnerable to front-running and manipulation',
    ],
    coaching: "Following is fine, but you need your own exit plan. The wallet you're copying isn't going to text you when they sell. Develop independent conviction on at least your exit strategy.",
    cta: "You're following the right wallets - but are you exiting at the right time? Connect your wallet and we'll analyze where you're losing edge. Are you getting front-run? Exiting too late?",
  },
  TechnicalAnalyst: {
    name: 'Technical Analyst',
    emoji: '📊',
    description: "Charts don't lie. You see support, resistance, volume patterns, and RSI divergences that others miss. You've got TradingView open on a second monitor and you trust the data over the hype.",
    strengths: [
      'Systematic and disciplined approach',
      'Clear entry and exit levels',
      'Removes emotion from decisions',
    ],
    weaknesses: [
      "Memecoins don't respect your trendlines",
      'Analysis paralysis delays entries',
      'Misses narrative-driven moves',
    ],
    coaching: "TA is a tool, not a religion. In memecoin markets, narrative and momentum often override technicals. Blend your charts with social sentiment for better timing.",
    cta: "Your charts are clean - but how do they hold up in memecoin chaos? Connect your wallet and we'll show you where your TA worked and where narrative trumped technicals.",
  },
  LossAverse: {
    name: 'Loss Averse',
    emoji: '🛡️',
    description: "Capital preservation is your religion. You'd rather miss a 10x than take a 50% loss. You cut losers fast and protect your port at all costs. Your stop losses have stop losses.",
    strengths: [
      'Excellent risk management',
      'Survives to trade another day',
      'Disciplined and consistent',
    ],
    weaknesses: [
      'Sells winners way too early',
      'Gets stopped out before the real move',
      "Small wins don't offset the runners you miss",
    ],
    coaching: "You're protecting yourself out of profits. Learn to scale out instead of all-or-nothing exits. Let a portion ride with a trailing stop so you capture upside while protecting your base.",
    cta: "You're protecting capital - but how many runners have you sold too early? Connect your wallet and we'll show you what those early exits actually cost you.",
  },
  ImpulseTrader: {
    name: 'Impulse Trader',
    emoji: '🎲',
    description: "You trade on instinct. When something feels right, you ape in. You don't need a spreadsheet or a thesis - your gut has made you money before and it'll do it again. Trading plans are for people who overthink.",
    strengths: [
      'Decisive action when others hesitate',
      'Catches moves that over-thinkers miss',
      'High risk tolerance',
    ],
    weaknesses: [
      'No consistent system',
      'Emotional swings drive decisions',
      'Big wins followed by big losses',
    ],
    coaching: "Your gut isn't wrong, but it needs guardrails. Before every trade, write one sentence on why you're entering and where you're exiting. Turn instinct into a repeatable system.",
    cta: "Your instincts are sharp - but let's see the full picture. Connect your wallet and we'll analyze the pattern behind your gut trades. When does your instinct print and when does it burn?",
  },
}

// Quiz questions with scoring
export const QUESTIONS = [
  {
    id: 1,
    question: "A coin you're watching just pumped 50%. What do you do?",
    options: [
      { text: 'Buy now before it goes higher', scores: { FOMO: 2 } },
      { text: 'Wait for a pullback to enter', scores: { LossAverse: 2 } },
      { text: "Check who's buying and why it pumped", scores: { NarrativeFrontRunner: 1, TechnicalAnalyst: 1 } },
      { text: 'Already in, I spotted it early', scores: { NarrativeFrontRunner: 2 } },
      { text: 'Check what the top wallets are doing', scores: { CopyTrader: 2 } },
    ],
  },
  {
    id: 2,
    question: 'How long do you typically hold a position?',
    options: [
      { text: 'Minutes to hours', scores: { Scalper: 2 } },
      { text: 'A day or two', scores: { ImpulseTrader: 2 } },
      { text: 'Days to weeks', scores: { TechnicalAnalyst: 1, NarrativeFrontRunner: 1 } },
      { text: 'Weeks to months, riding the whole wave', scores: { DiamondHands: 2 } },
      { text: 'Until someone I follow sells', scores: { CopyTrader: 2 } },
    ],
  },
  {
    id: 3,
    question: "Your bag drops 40% after entry. What's your move?",
    options: [
      { text: 'Sell immediately to protect capital', scores: { LossAverse: 2 } },
      { text: 'Average down, conviction unchanged', scores: { DiamondHands: 2 } },
      { text: 'Check if the narrative is still intact', scores: { NarrativeFrontRunner: 2 } },
      { text: 'Already sold at -15%', scores: { Scalper: 2 } },
      { text: 'Panic sell then regret it', scores: { ImpulseTrader: 2 } },
    ],
  },
  {
    id: 4,
    question: 'What triggers most of your trades?',
    options: [
      { text: 'Gut feeling, something feels right', scores: { ImpulseTrader: 2 } },
      { text: 'Chart patterns and volume', scores: { TechnicalAnalyst: 2 } },
      { text: 'Influencer callouts or wallet alerts', scores: { CopyTrader: 2 } },
      { text: 'Seeing green PnLs everywhere', scores: { FOMO: 2 } },
      { text: 'Research on upcoming narratives', scores: { NarrativeFrontRunner: 2 } },
      { text: 'Quick scalp opportunity', scores: { Scalper: 2 } },
    ],
  },
  {
    id: 5,
    question: 'How many trades do you make on an active day?',
    options: [
      { text: '10+', scores: { Scalper: 2 } },
      { text: '5-10', scores: { ImpulseTrader: 2 } },
      { text: '2-4', scores: { TechnicalAnalyst: 1, NarrativeFrontRunner: 1 } },
      { text: "0-1, I'm selective", scores: { DiamondHands: 1, LossAverse: 1 } },
    ],
  },
  {
    id: 6,
    question: "What's your biggest weakness?",
    options: [
      { text: 'Selling too early', scores: { LossAverse: 2 }, tiebreaker: 'LossAverse' },
      { text: 'Holding too long', scores: { DiamondHands: 2 }, tiebreaker: 'DiamondHands' },
      { text: 'Trading without a plan', scores: { ImpulseTrader: 2 }, tiebreaker: 'ImpulseTrader' },
      { text: 'Chasing pumps', scores: { FOMO: 2 }, tiebreaker: 'FOMO' },
      { text: 'Overtrading', scores: { Scalper: 2 }, tiebreaker: 'Scalper' },
      { text: 'Relying too much on others', scores: { CopyTrader: 2 }, tiebreaker: 'CopyTrader' },
    ],
  },
  {
    id: 7,
    question: 'When do you decide your exit price?',
    options: [
      { text: 'Before I enter', scores: { TechnicalAnalyst: 1, LossAverse: 1 } },
      { text: 'When it feels right', scores: { ImpulseTrader: 2 } },
      { text: 'When the narrative plays out', scores: { NarrativeFrontRunner: 2 } },
      { text: "When I've 2-5x'd", scores: { DiamondHands: 2 } },
      { text: 'When top wallets exit', scores: { CopyTrader: 2 } },
      { text: 'Quick profit, move on', scores: { Scalper: 2 } },
    ],
  },
]

// Calculate results from answers
export function calculateResults(answers) {
  const scores = {
    DiamondHands: 0,
    Scalper: 0,
    NarrativeFrontRunner: 0,
    FOMO: 0,
    CopyTrader: 0,
    TechnicalAnalyst: 0,
    LossAverse: 0,
    ImpulseTrader: 0,
  }

  let tiebreaker = null

  // Calculate scores from each answer
  answers.forEach((answerIndex, questionIndex) => {
    const question = QUESTIONS[questionIndex]
    const selectedOption = question.options[answerIndex]

    if (selectedOption) {
      // Add scores
      Object.entries(selectedOption.scores).forEach(([archetype, points]) => {
        scores[archetype] += points
      })

      // Track tiebreaker from Q6
      if (selectedOption.tiebreaker) {
        tiebreaker = selectedOption.tiebreaker
      }
    }
  })

  // Sort archetypes by score
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])

  // Handle ties using Q6 tiebreaker
  let primary = sorted[0][0]
  let secondary = sorted[1][0]

  // If there's a tie for first, use tiebreaker
  if (sorted[0][1] === sorted[1][1] && tiebreaker) {
    if (sorted[1][0] === tiebreaker) {
      primary = sorted[1][0]
      secondary = sorted[0][0]
    }
  }

  return {
    primary,
    secondary,
    scores,
    primaryData: ARCHETYPES[primary],
    secondaryData: ARCHETYPES[secondary],
  }
}
