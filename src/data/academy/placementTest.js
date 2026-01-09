// Placement Test Data
// 20 questions across 5 levels to determine starting module

export const PLACEMENT_TEST = {
  title: "Trading Knowledge Assessment",
  description: "Answer these questions to find your starting level. You can skip ahead if you already know the basics.",
  passingThreshold: 0.75, // 75% to pass a section

  sections: [
    {
      level: 'newcomer',
      name: 'Fundamentals',
      questions: [
        {
          id: 'p-1',
          question: 'What is a seed phrase used for?',
          options: [
            'Logging into exchanges',
            'Recovering/restoring your wallet',
            'Sending tokens faster',
            'Getting airdrops'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-2',
          question: 'On Solana, what do you need to pay transaction fees?',
          options: [
            'USDC',
            'ETH',
            'SOL',
            'Any token'
          ],
          correctAnswer: 2
        },
        {
          id: 'p-3',
          question: 'What is a DEX?',
          options: [
            'A centralized exchange like Coinbase',
            'A decentralized exchange where you trade from your wallet',
            'A type of token',
            'A wallet provider'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-4',
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
    {
      level: 'apprentice',
      name: 'Research & Safety',
      questions: [
        {
          id: 'p-5',
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
          id: 'p-6',
          question: 'If top 10 wallets hold 60% of a token supply, this is:',
          options: [
            'A good sign of strong holders',
            'Normal for all tokens',
            'A red flag indicating concentration risk',
            'Required for token launch'
          ],
          correctAnswer: 2
        },
        {
          id: 'p-7',
          question: 'What does a long lower wick on a candlestick indicate?',
          options: [
            'Strong selling pressure',
            'Buyers pushed price up from the low',
            'Low trading volume',
            'The token is dead'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-8',
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
    {
      level: 'trader',
      name: 'Strategy & Execution',
      questions: [
        {
          id: 'p-9',
          question: 'What is the recommended maximum risk per trade?',
          options: [
            '10-20%',
            '5-10%',
            '1-2%',
            '50%'
          ],
          correctAnswer: 2
        },
        {
          id: 'p-10',
          question: 'If your portfolio is $10,000, you risk 1%, and your stop is 20% below entry, what is your position size?',
          options: [
            '$100',
            '$200',
            '$500',
            '$1,000'
          ],
          correctAnswer: 2
        },
        {
          id: 'p-11',
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
          id: 'p-12',
          question: 'The "Take Initial Out" rule means:',
          options: [
            'Never invest your savings',
            'When position doubles, sell your initial investment',
            'Always sell at a loss',
            'Take out a loan to trade'
          ],
          correctAnswer: 1
        }
      ]
    },
    {
      level: 'specialist',
      name: 'Psychology & Edge',
      questions: [
        {
          id: 'p-13',
          question: 'Loss aversion causes traders to:',
          options: [
            'Take more calculated risks',
            'Hold losers too long and sell winners too early',
            'Trade more systematically',
            'Avoid all trades'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-14',
          question: 'What is a trading "edge"?',
          options: [
            'A guaranteed winning strategy',
            'A repeatable advantage with positive expected value over time',
            'The sharpest part of a chart',
            'An aggressive trading style'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-15',
          question: 'System adherence measures:',
          options: [
            'How much money you made',
            'Whether you followed your own rules',
            'How long your trades last',
            'Your popularity'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-16',
          question: 'During a losing streak, what should you check FIRST?',
          options: [
            'If you should quit trading',
            'If you are following your process correctly',
            'What other traders are doing',
            'If the market is manipulated'
          ],
          correctAnswer: 1
        }
      ]
    },
    {
      level: 'master',
      name: 'Scale & Optimize',
      questions: [
        {
          id: 'p-17',
          question: 'What percentage should your Foundation tier (blue chips, stables) be at minimum?',
          options: [
            '10%',
            '25%',
            '40%',
            '75%'
          ],
          correctAnswer: 2
        },
        {
          id: 'p-18',
          question: 'What is the maximum recommended position size increase when scaling up?',
          options: [
            '100%',
            '50%',
            '25%',
            '10%'
          ],
          correctAnswer: 2
        },
        {
          id: 'p-19',
          question: 'In US crypto taxation, trading crypto to crypto is:',
          options: [
            'Not taxable',
            'A taxable event',
            'Only taxable over $10,000',
            'Illegal'
          ],
          correctAnswer: 1
        },
        {
          id: 'p-20',
          question: 'What should you do when an edge starts decaying?',
          options: [
            'Keep trading it anyway',
            'Double position sizes',
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

  // Must pass 75% of section to "test out" of it
  // Return the highest level they qualify for
  if (scores.master >= passThreshold) return 'completed' // All modules unlocked
  if (scores.specialist >= passThreshold) return 'master'
  if (scores.trader >= passThreshold) return 'specialist'
  if (scores.apprentice >= passThreshold) return 'trader'
  if (scores.newcomer >= passThreshold) return 'apprentice'
  return 'newcomer' // Start from beginning
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
