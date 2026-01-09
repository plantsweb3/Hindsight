// Placement Test Data
// 25 questions across 5 modules - each question maps to a specific lesson

export const PLACEMENT_TEST = {
  title: "Trading Knowledge Assessment",
  description: "Answer these questions to find your starting level and identify areas to review.",
  passingThreshold: 0.75, // 75% to pass a section (4/5 questions)
  sectionsCount: 5,
  questionsPerSection: 5,
  totalQuestions: 25,

  sections: [
    // ==================== NEWCOMER ====================
    {
      level: 'newcomer',
      moduleId: 'newcomer',
      name: 'Your First Steps',
      difficulty: 'beginner',
      questions: [
        {
          id: 'p-1',
          lessonSlug: 'wallet-setup',
          lessonTitle: 'Setting Up Your Solana Wallet',
          question: 'What is a seed phrase used for?',
          options: [
            'Logging into exchanges',
            'Recovering and restoring your wallet',
            'Sending tokens faster',
            'Getting airdrops'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-2',
          lessonSlug: 'funding-wallet',
          lessonTitle: 'Funding Your Wallet: CEX to DEX',
          question: 'What is the safest way to transfer SOL from Coinbase to your Phantom wallet?',
          options: [
            'Send to your Ethereum address',
            'Use the Solana network and double-check your wallet address',
            'Share your seed phrase with Coinbase',
            'Transfer to a random address first'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-3',
          lessonSlug: 'what-are-memecoins',
          lessonTitle: 'What Are Memecoins?',
          question: 'What primarily drives memecoin prices?',
          options: [
            'Company earnings reports',
            'Community sentiment, narrative, and speculation',
            'Government regulations',
            'Fixed supply schedules'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-4',
          lessonSlug: 'first-trade-jupiter',
          lessonTitle: 'Your First Trade on Jupiter',
          question: 'What does "slippage tolerance" control on Jupiter?',
          options: [
            'How fast your transaction processes',
            'The maximum price difference you accept between quote and execution',
            'The trading fee percentage',
            'Your wallet connection speed'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-5',
          lessonSlug: 'pumpfun-basics',
          lessonTitle: 'Understanding Pump.fun Basics',
          question: 'What happens to tokens on pump.fun when they complete their bonding curve (~$69K market cap)?',
          options: [
            'They get deleted from the platform',
            'They graduate to PumpSwap with locked liquidity',
            'They become NFTs',
            'Nothing changes, they stay on the bonding curve'
          ],
          correctAnswer: 1
        }
      ]
    },

    // ==================== APPRENTICE ====================
    {
      level: 'apprentice',
      moduleId: 'apprentice',
      name: 'Research & Defense',
      difficulty: 'beginner+',
      questions: [
        {
          id: 'p-6',
          lessonSlug: 'research-token',
          lessonTitle: 'How to Research a Token',
          question: 'Which is NOT part of a basic token research checklist?',
          options: [
            'Check holder distribution',
            'Verify liquidity depth',
            'Read the CEO\'s LinkedIn profile',
            'Review contract on RugCheck'
          ],
          correctAnswer: 2
        },
        {
          id: 'p-7',
          lessonSlug: 'spotting-scams',
          lessonTitle: 'Spotting Rugs and Scams',
          question: 'What is a "honeypot" scam?',
          options: [
            'A token with high returns',
            'A token you can buy but cannot sell',
            'A type of airdrop',
            'A wallet security feature'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-8',
          lessonSlug: 'reading-charts',
          lessonTitle: 'Reading Charts for Beginners',
          question: 'What does a long lower wick on a candlestick indicate?',
          options: [
            'Strong selling pressure won',
            'Buyers pushed price up from the low (buying pressure)',
            'Low trading volume',
            'The token is about to be delisted'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-9',
          lessonSlug: 'building-watchlist',
          lessonTitle: 'Building Your Watchlist',
          question: 'What is the purpose of a tiered watchlist system?',
          options: [
            'To show off how many tokens you track',
            'To organize tokens by readiness level (ready/watching/radar)',
            'To automatically buy tokens',
            'To share picks with friends'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-10',
          lessonSlug: 'protecting-wallet',
          lessonTitle: 'Protecting Your Wallet',
          question: 'Random tokens appearing in your wallet should be:',
          options: [
            'Sold immediately for free money',
            'Transferred to friends',
            'Ignored - do not interact with them',
            'Staked for rewards'
          ],
          correctAnswer: 2
        }
      ]
    },

    // ==================== TRADER ====================
    {
      level: 'trader',
      moduleId: 'trader',
      name: 'Strategy & Execution',
      difficulty: 'intermediate',
      questions: [
        {
          id: 'p-11',
          lessonSlug: 'position-sizing',
          lessonTitle: 'Position Sizing Fundamentals',
          question: 'If your portfolio is $10,000, you risk 1%, and your stop loss is 20% below entry, what is your position size?',
          options: [
            '$100',
            '$200',
            '$500',
            '$1,000'
          ],
          correctAnswer: 2
        },
        {
          id: 'p-12',
          lessonSlug: 'stop-losses',
          lessonTitle: 'Stop Losses That Work',
          question: 'Where should you generally NOT place a stop loss?',
          options: [
            'Below a key support level',
            'At a round number where everyone else places stops',
            'Based on ATR (Average True Range)',
            'At a technical invalidation point'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-13',
          lessonSlug: 'risk-reward',
          lessonTitle: 'Risk/Reward and Trade Selection',
          question: 'A 1:3 Risk/Reward ratio means:',
          options: [
            'You risk $3 to make $1',
            'You risk $1 to potentially make $3',
            'You trade 3 times per day',
            'You win 3 out of 4 trades'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-14',
          lessonSlug: 'entry-strategies',
          lessonTitle: 'Entry Strategies',
          question: 'Which entry strategy involves waiting for price to return to a breakout level before buying?',
          options: [
            'Market order entry',
            'Scaled entry',
            'Breakout retest entry',
            'FOMO entry'
          ],
          correctAnswer: 2
        },
        {
          id: 'p-15',
          lessonSlug: 'taking-profits',
          lessonTitle: 'Taking Profits',
          question: 'The "Take Initial Out" rule means:',
          options: [
            'Never invest your initial savings',
            'When position doubles, sell enough to recover your initial investment',
            'Always sell everything at once',
            'Take profits before your entry'
          ],
          correctAnswer: 1
        }
      ]
    },

    // ==================== SPECIALIST ====================
    {
      level: 'specialist',
      moduleId: 'specialist',
      name: 'Psychology & Edge',
      difficulty: 'advanced',
      questions: [
        {
          id: 'p-16',
          lessonSlug: 'psychology-of-trading',
          lessonTitle: 'The Psychology of Trading',
          question: 'Loss aversion causes traders to:',
          options: [
            'Take more calculated risks',
            'Hold losers too long and sell winners too early',
            'Trade more systematically',
            'Avoid all trades entirely'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-17',
          lessonSlug: 'emotional-management',
          lessonTitle: 'Emotional Management',
          question: 'What is the first step in the "Pause Protocol" when feeling emotional?',
          options: [
            'Execute the trade quickly',
            'Call a friend',
            'Step away from screens and take deep breaths',
            'Double your position size'
          ],
          correctAnswer: 2
        },
        {
          id: 'p-18',
          lessonSlug: 'developing-your-edge',
          lessonTitle: 'Developing Your Trading Edge',
          question: 'What is a trading "edge"?',
          options: [
            'A guaranteed winning strategy',
            'A repeatable advantage with positive expected value over time',
            'The sharpest part of a chart pattern',
            'Having more money than others'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-19',
          lessonSlug: 'building-a-trading-system',
          lessonTitle: 'Building a Trading System',
          question: 'Which is NOT a core component of a trading system?',
          options: [
            'Entry criteria',
            'Position sizing rules',
            'Your Twitter follower count',
            'Exit strategy'
          ],
          correctAnswer: 2
        },
        {
          id: 'p-20',
          lessonSlug: 'building-consistency',
          lessonTitle: 'Building Consistency',
          question: 'Consistency in trading is best measured by:',
          options: [
            'Daily P&L only',
            'Process adherence over time',
            'Number of trades per day',
            'Social media engagement'
          ],
          correctAnswer: 1
        }
      ]
    },

    // ==================== MASTER ====================
    {
      level: 'master',
      moduleId: 'master',
      name: 'Scale & Optimize',
      difficulty: 'expert',
      questions: [
        {
          id: 'p-21',
          lessonSlug: 'portfolio-construction',
          lessonTitle: 'Portfolio Construction',
          question: 'In a balanced crypto portfolio, what percentage should your Foundation tier (stables, blue chips) be at minimum?',
          options: [
            '10%',
            '25%',
            '40%',
            '75%'
          ],
          correctAnswer: 2
        },
        {
          id: 'p-22',
          lessonSlug: 'scaling-positions',
          lessonTitle: 'Scaling Positions',
          question: 'What is the recommended maximum position size increase when scaling up?',
          options: [
            '100% (double it)',
            '50%',
            '25%',
            '10%'
          ],
          correctAnswer: 2
        },
        {
          id: 'p-23',
          lessonSlug: 'advanced-entry-exit',
          lessonTitle: 'Advanced Entry and Exit Techniques',
          question: 'What is an "iceberg order"?',
          options: [
            'An order that only executes in cold weather',
            'A large order split into smaller visible chunks to hide total size',
            'A type of stop loss',
            'An order that automatically cancels'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-24',
          lessonSlug: 'tax-record-keeping',
          lessonTitle: 'Tax and Record Keeping',
          question: 'In US crypto taxation, trading one crypto for another is:',
          options: [
            'Not taxable until you cash out to USD',
            'A taxable event',
            'Only taxable over $10,000',
            'Tax-free if held over 24 hours'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-25',
          lessonSlug: 'continuous-improvement',
          lessonTitle: 'Continuous Improvement',
          question: 'When a trading edge starts decaying (lower win rate), what should you do?',
          options: [
            'Keep trading it anyway, it will come back',
            'Double your position sizes to recover losses',
            'Adapt the setup, develop new edges, or retire it',
            'Blame market manipulation'
          ],
          correctAnswer: 2
        }
      ]
    }
  ]
}

// Calculate section score
export function calculateSectionScore(answers, sectionQuestions) {
  let correct = 0
  sectionQuestions.forEach(q => {
    if (answers[q.id] === q.correctAnswer) {
      correct++
    }
  })
  return correct / sectionQuestions.length
}

// Determine placement level based on answers
export function determinePlacement(answers) {
  const passThreshold = PLACEMENT_TEST.passingThreshold

  const scores = {}
  PLACEMENT_TEST.sections.forEach(section => {
    scores[section.level] = calculateSectionScore(answers, section.questions)
  })

  // Must pass 75% of section (4/5 questions) to "test out" of it
  // Return the highest level they qualify for
  if (scores.master >= passThreshold) return 'completed' // All modules unlocked
  if (scores.specialist >= passThreshold) return 'master'
  if (scores.trader >= passThreshold) return 'specialist'
  if (scores.apprentice >= passThreshold) return 'trader'
  if (scores.newcomer >= passThreshold) return 'apprentice'
  return 'newcomer' // Start from beginning
}

// Save individual question results for per-lesson tracking
export function savePlacementQuestionResults(answers) {
  const questionResults = {}

  PLACEMENT_TEST.sections.forEach(section => {
    section.questions.forEach(question => {
      const userAnswer = answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer

      questionResults[question.id] = {
        correct: isCorrect,
        lessonSlug: question.lessonSlug,
        moduleId: section.moduleId,
        userAnswer,
        correctAnswer: question.correctAnswer
      }
    })
  })

  // Store latest results
  localStorage.setItem('placementTestQuestionResults', JSON.stringify(questionResults))

  // Calculate section scores
  const sectionScores = {}
  PLACEMENT_TEST.sections.forEach(section => {
    const correctCount = section.questions.filter(q => questionResults[q.id].correct).length
    sectionScores[section.moduleId] = correctCount / section.questions.length
  })

  // Update BEST scores (never decrease)
  const existingBestScores = JSON.parse(localStorage.getItem('placementTestBestScores') || '{}')
  const existingBestQuestions = JSON.parse(localStorage.getItem('placementTestBestQuestionResults') || '{}')

  // Update best section scores
  Object.keys(sectionScores).forEach(moduleId => {
    if (!existingBestScores[moduleId] || sectionScores[moduleId] > existingBestScores[moduleId]) {
      existingBestScores[moduleId] = sectionScores[moduleId]
    }
  })

  // Update best question results (correct answers stick)
  Object.entries(questionResults).forEach(([questionId, result]) => {
    if (result.correct) {
      // If answered correctly, always save
      existingBestQuestions[questionId] = result
    } else if (!existingBestQuestions[questionId]) {
      // If answered wrong and no previous attempt, save
      existingBestQuestions[questionId] = result
    }
    // If answered wrong but previously correct, keep the correct one
  })

  // Save everything
  localStorage.setItem('placementTestBestScores', JSON.stringify(existingBestScores))
  localStorage.setItem('placementTestBestQuestionResults', JSON.stringify(existingBestQuestions))
  localStorage.setItem('placementTestLatestScores', JSON.stringify(sectionScores))

  // Trigger UI updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('progressUpdated'))
  }

  return { questionResults, sectionScores, bestScores: existingBestScores, bestQuestionResults: existingBestQuestions }
}

// Get lesson status from placement test results
export function getPlacementLessonStatus(moduleId, lessonSlug) {
  try {
    const bestQuestionResults = JSON.parse(localStorage.getItem('placementTestBestQuestionResults') || '{}')

    // Find the question that maps to this lesson
    const matchingResult = Object.values(bestQuestionResults).find(
      result => result.moduleId === moduleId && result.lessonSlug === lessonSlug
    )

    if (matchingResult) {
      return {
        attempted: true,
        passed: matchingResult.correct,
        source: 'placement'
      }
    }

    return { attempted: false, passed: false, source: null }
  } catch {
    return { attempted: false, passed: false, source: null }
  }
}

// Get level display info
export const LEVEL_INFO = {
  newcomer: {
    name: 'Newcomer',
    icon: '🌱',
    description: 'Start with the basics of trading and wallets'
  },
  apprentice: {
    name: 'Apprentice',
    icon: '📚',
    description: 'Learn research skills and safety practices'
  },
  trader: {
    name: 'Trader',
    icon: '📈',
    description: 'Master strategy and execution'
  },
  specialist: {
    name: 'Specialist',
    icon: '🧠',
    description: 'Understand psychology and develop your edge'
  },
  master: {
    name: 'Master',
    icon: '👑',
    description: 'Scale your trading and optimize performance'
  },
  completed: {
    name: 'Graduate',
    icon: '🎓',
    description: 'You\'ve mastered all levels!'
  }
}
