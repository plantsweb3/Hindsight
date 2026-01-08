// Scalper Archetype Quizzes
// Quiz questions for each lesson and final assessment

export const scalperQuizzes = {
  moduleId: 'scalper',

  // Quizzes for each lesson (3 questions each)
  lessonQuizzes: {
    'scalper-1': {
      lessonId: 'scalper-1',
      lessonTitle: "The Scalper's Edge",
      questions: [
        {
          id: 'sc1-q1',
          question: 'What is the typical profit target range for a scalp trade?',
          options: [
            '10-20% per trade',
            '0.5-3% per trade',
            '50%+ per trade',
            'Break-even is the goal'
          ],
          correctAnswer: 1,
          explanation: 'Scalping targets small, quick profits of 0.5% to 3% per trade. You\'re collecting singles that compound, not looking for home runs.'
        },
        {
          id: 'sc1-q2',
          question: 'What is the key mindset difference for successful scalpers?',
          options: [
            '"I need this trade to work"',
            '"This is one of a hundred trades this week"',
            '"I\'ll hold and hope it recovers"',
            '"I made 3%, I\'ll go for more"'
          ],
          correctAnswer: 1,
          explanation: 'Successful scalpers think "This is one of a hundred trades this week" - detachment from individual trades is essential.'
        },
        {
          id: 'sc1-q3',
          question: 'Which is NOT a demand of scalping?',
          options: [
            'Speed and fast execution',
            'Discipline with every trade',
            'Passive, occasional monitoring',
            'Fast, reliable infrastructure'
          ],
          correctAnswer: 2,
          explanation: 'Scalping requires active attention and focus. It\'s not passive income - you can\'t scalp while doing other work.'
        }
      ]
    },
    'scalper-2': {
      lessonId: 'scalper-2',
      lessonTitle: 'Scalping Setups That Work',
      questions: [
        {
          id: 'sc2-q1',
          question: 'What makes a setup work for scalping?',
          options: [
            'Complex patterns that take hours to develop',
            'Quick resolution, clear entry, tight stop, sufficient range',
            'Only works in one direction',
            'Requires multiple indicator confirmations'
          ],
          correctAnswer: 1,
          explanation: 'Scalping setups need quick resolution (minutes not hours), clear entry trigger, tight stop for small invalidation distance, and sufficient range to profit after fees.'
        },
        {
          id: 'sc2-q2',
          question: 'What is the recommended approach for learning scalping setups?',
          options: [
            'Master all setups at once',
            'Master ONE setup first, trade it 100+ times, then add another',
            'Only use indicators, no price action',
            'Trade different setups each day'
          ],
          correctAnswer: 1,
          explanation: 'Master ONE setup before adding others. Pick the one that fits you, trade it 100+ times, track results, refine, then add another.'
        },
        {
          id: 'sc2-q3',
          question: 'What should scalpers avoid trading?',
          options: [
            'Support/resistance bounces',
            'Range scalps',
            'Choppy, directionless markets',
            'VWAP bounces'
          ],
          correctAnswer: 2,
          explanation: 'Don\'t scalp choppy directionless markets, during major news events, low liquidity periods, or when unsure of direction. The best scalpers skip more than they trade.'
        }
      ]
    },
    'scalper-3': {
      lessonId: 'scalper-3',
      lessonTitle: 'Execution Speed and Precision',
      questions: [
        {
          id: 'sc3-q1',
          question: 'What is slippage?',
          options: [
            'A type of chart pattern',
            'Difference between expected and actual fill price',
            'A trading strategy',
            'A fee type'
          ],
          correctAnswer: 1,
          explanation: 'Slippage is the difference between expected price and actual fill. Caused by fast markets, low liquidity, large orders, or market orders in thin books.'
        },
        {
          id: 'sc3-q2',
          question: 'Which is the best entry technique for most scalps?',
          options: [
            'Always market orders',
            'Aggressive limit on trigger - balance of speed and price control',
            'Wait days for perfect entry',
            'Never use limit orders'
          ],
          correctAnswer: 1,
          explanation: 'Aggressive limits (limit at or slightly beyond current price) offer the best of both worlds for most scalps - better than market, usually fills quickly.'
        },
        {
          id: 'sc3-q3',
          question: 'Why are hard stops safer than mental stops?',
          options: [
            'They\'re more expensive',
            'You will hesitate with mental stops and the market doesn\'t care about your feelings',
            'They\'re not - mental stops are better',
            'Hard stops are only for beginners'
          ],
          correctAnswer: 1,
          explanation: 'Hard stops are safer because you WILL hesitate with mental stops. The market doesn\'t care about your feelings - use actual stop orders.'
        }
      ]
    },
    'scalper-4': {
      lessonId: 'scalper-4',
      lessonTitle: 'Risk Management at High Frequency',
      questions: [
        {
          id: 'sc4-q1',
          question: 'What is the recommended maximum risk per scalp trade?',
          options: [
            '5-10%',
            '2-3%',
            '0.25-0.5%',
            '15-20%'
          ],
          correctAnswer: 2,
          explanation: 'Maximum risk per scalp trade should be 0.25% to 0.5% of account - lower than swing trading because more trades = more exposure.'
        },
        {
          id: 'sc4-q2',
          question: 'What happens when you hit your daily loss limit?',
          options: [
            'Trade smaller to make it back',
            'Switch to a different asset',
            'Stop trading immediately, no exceptions',
            'Double down on the next trade'
          ],
          correctAnswer: 2,
          explanation: 'When you hit your daily loss limit (2-3%), STOP. No exceptions. The best trading day after hitting your limit is no trading at all.'
        },
        {
          id: 'sc4-q3',
          question: 'What percentage of gross profits should fees stay under?',
          options: [
            '50%',
            '75%',
            '20%',
            'Fees don\'t matter'
          ],
          correctAnswer: 2,
          explanation: 'Target fees to stay under 20% of gross profits. Fees kill scalpers silently - track total fees as percentage of profits.'
        }
      ]
    },
    'scalper-5': {
      lessonId: 'scalper-5',
      lessonTitle: 'The Mental Game of Scalping',
      questions: [
        {
          id: 'sc5-q1',
          question: 'What is the key detachment principle for scalpers?',
          options: [
            'Every trade must be perfect',
            'Individual trades don\'t matter - you\'re trading a system over hundreds of trades',
            'Never take losses',
            'Always trade with maximum size'
          ],
          correctAnswer: 1,
          explanation: 'The key mindset is that individual trades don\'t matter. You\'re trading A SYSTEM that works over hundreds of trades, not trading for any single trade.'
        },
        {
          id: 'sc5-q2',
          question: 'What should you do when you notice tilt signs?',
          options: [
            'Trade more aggressively to make it back',
            'Increase position size',
            'Stop immediately - pause, breathe, walk, review',
            'Ignore it and keep trading'
          ],
          correctAnswer: 2,
          explanation: 'When tilt is detected: Pause (no trades 10 min minimum), Breathe (calm down), Walk (physical movement resets state), Review (what triggered it), then decide to continue reduced or stop.'
        },
        {
          id: 'sc5-q3',
          question: 'Why is boredom dangerous for scalpers?',
          options: [
            'It\'s not dangerous',
            'No setups → Boredom → Force trades → Losses',
            'It makes you trade better',
            'Boredom improves focus'
          ],
          correctAnswer: 1,
          explanation: 'Slow markets lead to: No setups → Boredom → Force trades → Losses. Accept that waiting is trading, have non-trading activities ready.'
        }
      ]
    },
    'scalper-6': {
      lessonId: 'scalper-6',
      lessonTitle: 'Tools and Infrastructure',
      questions: [
        {
          id: 'sc6-q1',
          question: 'What is essential for DEX scalping on Solana?',
          options: [
            'Free RPC',
            'Premium/Fast RPC with MEV protection',
            'No internet connection needed',
            'Only daily charts'
          ],
          correctAnswer: 1,
          explanation: 'For DEX scalping, you need premium/fast RPC (Helius, QuickNode, Triton) and MEV protection. Free RPCs are too slow and unreliable for scalping.'
        },
        {
          id: 'sc6-q2',
          question: 'Why is a wired internet connection preferred over WiFi?',
          options: [
            'It\'s not - WiFi is better',
            'Stable > Fast - wired is more reliable with less dropouts',
            'WiFi is faster',
            'It doesn\'t matter for scalping'
          ],
          correctAnswer: 1,
          explanation: 'Stable is more important than fast. Wired connection is preferred over WiFi for reliability. One disconnect at the wrong moment can be catastrophic.'
        },
        {
          id: 'sc6-q3',
          question: 'What is the purpose of using hotkeys?',
          options: [
            'They look professional',
            'Click trading is slow - hotkeys enable muscle memory for fast execution',
            'They\'re only for beginners',
            'They increase fees'
          ],
          correctAnswer: 1,
          explanation: 'Click trading is slow. Use hotkeys for buy/sell market, buy/sell limit, cancel orders, close position. Practice until muscle memory - you shouldn\'t be thinking about buttons.'
        }
      ]
    },
    'scalper-7': {
      lessonId: 'scalper-7',
      lessonTitle: 'When to Scalp and When to Stop',
      questions: [
        {
          id: 'sc7-q1',
          question: 'What is the 3-Strike Rule?',
          options: [
            'A baseball strategy',
            '3 consecutive losses = mandatory break (minimum 15 minutes)',
            'Take 3 trades per day maximum',
            'Never risk more than 3%'
          ],
          correctAnswer: 1,
          explanation: 'The 3-Strike Rule: 3 consecutive losses = mandatory break. Minimum 15-minute break, review what happened, reassess conditions, return at reduced size or don\'t return.'
        },
        {
          id: 'sc7-q2',
          question: 'When should you NOT scalp?',
          options: [
            'During trending markets',
            'When volatility is present',
            'Major news pending, choppy markets, low liquidity, or after hitting limits',
            'During range-bound markets'
          ],
          correctAnswer: 2,
          explanation: 'Don\'t scalp when major news is pending, during chaotic choppy action, in low liquidity, when tired/emotional, or after hitting your limits.'
        },
        {
          id: 'sc7-q3',
          question: 'How long should a core trading session block be?',
          options: [
            '4-5 hours non-stop',
            '60-90 minutes before taking a break',
            '8 hours like a regular job',
            '15 minutes'
          ],
          correctAnswer: 1,
          explanation: 'Core session blocks should be 60-90 minutes - fresh, focused, best performance period. Then take a 15-30 minute break before optional second block.'
        }
      ]
    },
    'scalper-8': {
      lessonId: 'scalper-8',
      lessonTitle: 'Building Sustainable Scalping Habits',
      questions: [
        {
          id: 'sc8-q1',
          question: 'Why is a weekly recovery day important?',
          options: [
            'It\'s not important',
            'Complete mental break to prevent burnout - no trading, no charts',
            'Trade even more to catch up',
            'Study charts all day'
          ],
          correctAnswer: 1,
          explanation: 'Take one day off per week: no trading, no chart watching, complete mental break. This isn\'t lazy - it\'s sustainable.'
        },
        {
          id: 'sc8-q2',
          question: 'What should you do immediately after a trading session?',
          options: [
            'Start another session',
            'Log all trades, calculate P/L, note any rule violations',
            'Ignore results until next week',
            'Delete trading history'
          ],
          correctAnswer: 1,
          explanation: 'Immediately after session (15 min): Log all trades, calculate daily P/L, note any rule violations. Then do detailed review in evening.'
        },
        {
          id: 'sc8-q3',
          question: 'What is the key difference between traders who last and those who burn out?',
          options: [
            'Trading more hours',
            'Sustainable habits - practices that keep you profitable and healthy long-term',
            'Using more indicators',
            'Never taking breaks'
          ],
          correctAnswer: 1,
          explanation: 'Many traders try scalping, few last. The difference is sustainable habits - practices that keep you profitable and healthy long-term, including breaks, reviews, and mental health protection.'
        }
      ]
    }
  },

  // Final module test (15 questions)
  finalTest: {
    title: 'Scalper Final Assessment',
    description: 'Test your mastery of scalping techniques and risk management',
    passingScore: 80,
    questions: [
      {
        id: 'sc-final-1',
        question: 'What is the typical profit target range for a scalp trade?',
        options: [
          '10-20% per trade',
          '0.5-3% per trade',
          '50%+ per trade',
          'Break-even'
        ],
        correctAnswer: 1,
        explanation: 'Scalping targets 0.5% to 3% per trade - small, quick profits that compound over many trades.'
      },
      {
        id: 'sc-final-2',
        question: 'Scalping requires less discipline than swing trading because trades are shorter.',
        options: [
          'True',
          'False'
        ],
        correctAnswer: 1,
        explanation: 'False. Scalping requires MORE discipline because more trades = more chances to break rules. One undisciplined trade can erase 10 good ones.'
      },
      {
        id: 'sc-final-3',
        question: 'What is the recommended maximum risk per scalp trade?',
        options: [
          '5-10%',
          '2-3%',
          '0.25-0.5%',
          '15-20%'
        ],
        correctAnswer: 2,
        explanation: 'Maximum risk per scalp trade: 0.25% to 0.5% of account. Lower than swing trading because more trades = more exposure.'
      },
      {
        id: 'sc-final-4',
        question: 'What happens when you hit your daily loss limit?',
        options: [
          'Trade smaller to make it back',
          'Switch to a different asset',
          'Stop trading immediately, no exceptions',
          'Double down on the next trade'
        ],
        correctAnswer: 2,
        explanation: 'When you hit your daily loss limit, STOP immediately. No exceptions. Walk away, review tomorrow.'
      },
      {
        id: 'sc-final-5',
        question: 'Which of these is a valid scalping setup?',
        options: [
          'Support/Resistance bounce',
          'Breakout and retest',
          'Random entry hoping for movement',
          'Both A and B'
        ],
        correctAnswer: 3,
        explanation: 'Valid scalping setups include Support/Resistance bounce, Breakout and retest, VWAP bounce, Range scalp, and Momentum continuation.'
      },
      {
        id: 'sc-final-6',
        question: 'Market orders always give better fills than limit orders.',
        options: [
          'True',
          'False'
        ],
        correctAnswer: 1,
        explanation: 'False. Limit orders give better price control. Market orders are fastest but have highest slippage.'
      },
      {
        id: 'sc-final-7',
        question: 'What is slippage?',
        options: [
          'A type of chart pattern',
          'Difference between expected and actual fill price',
          'A trading strategy',
          'A fee type'
        ],
        correctAnswer: 1,
        explanation: 'Slippage is the difference between expected price and actual fill, caused by fast markets, low liquidity, or large orders.'
      },
      {
        id: 'sc-final-8',
        question: 'What is the "3-Strike Rule"?',
        options: [
          'A baseball strategy',
          '3 consecutive losses = mandatory break',
          'Take 3 trades per day maximum',
          'Never risk more than 3%'
        ],
        correctAnswer: 1,
        explanation: '3 consecutive losses = mandatory break. Minimum 15 minutes, review what happened, reassess conditions.'
      },
      {
        id: 'sc-final-9',
        question: 'When should you NOT scalp?',
        options: [
          'Major news is pending',
          'Market is choppy with no structure',
          'You\'ve hit your daily loss limit',
          'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'Don\'t scalp when major news pending, market is choppy, low liquidity, you\'re tired/emotional, or after hitting limits.'
      },
      {
        id: 'sc-final-10',
        question: 'More screen time always equals more profits for scalpers.',
        options: [
          'True',
          'False'
        ],
        correctAnswer: 1,
        explanation: 'False. Quality degrades with fatigue. Beyond your limit: performance declines, errors increase, risk of tilt rises.'
      },
      {
        id: 'sc-final-11',
        question: 'What is essential for DEX scalping on Solana?',
        options: [
          'Free RPC',
          'Premium/Fast RPC with MEV protection',
          'No internet connection',
          'Daily charts only'
        ],
        correctAnswer: 1,
        explanation: 'DEX scalping needs premium/fast RPC and MEV protection. Free RPCs are too slow and unreliable.'
      },
      {
        id: 'sc-final-12',
        question: 'How long should a core trading session block be?',
        options: [
          '4-5 hours non-stop',
          '60-90 minutes before taking a break',
          '8 hours like a regular job',
          '15 minutes'
        ],
        correctAnswer: 1,
        explanation: 'Core sessions should be 60-90 minutes, then take a 15-30 minute break. Don\'t force extra blocks.'
      },
      {
        id: 'sc-final-13',
        question: 'What percentage of gross profits should fees ideally stay under?',
        options: [
          '50%',
          '75%',
          '20%',
          'Fees don\'t matter'
        ],
        correctAnswer: 2,
        explanation: 'Target fees under 20% of gross profits. Track total fees paid as percentage of profits.'
      },
      {
        id: 'sc-final-14',
        question: "What's the purpose of a weekly recovery day?",
        options: [
          'Complete mental break to prevent burnout',
          'Trade even more to catch up',
          'Study charts all day',
          'Not necessary for scalpers'
        ],
        correctAnswer: 0,
        explanation: 'Take one day off per week: no trading, no charts, complete mental break. This is sustainable, not lazy.'
      },
      {
        id: 'sc-final-15',
        question: 'What is the key mindset difference between successful and unsuccessful scalpers?',
        options: [
          'Successful scalpers never lose',
          'Successful scalpers detach from individual trades and focus on the system',
          'Successful scalpers trade more frequently',
          'Successful scalpers use more indicators'
        ],
        correctAnswer: 1,
        explanation: 'Successful scalpers detach from individual trades. You\'re trading a SYSTEM that works over hundreds of trades, not any single trade.'
      }
    ]
  }
}
