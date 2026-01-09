// Master Module Quizzes
// 5 lesson quizzes + 1 final exam

export const masterQuizzes = {
  moduleId: 'master',
  moduleName: 'Master: Scale & Optimize',

  // Lesson quizzes (5 questions each)
  lessonQuizzes: {
    'portfolio-construction': {
      lessonTitle: 'Portfolio Construction',
      questions: [
        {
          id: 'pc-1',
          question: 'What percentage should Foundation tier (blue chips, stables) be at minimum?',
          options: ['10%', '20%', '40%', '80%'],
          correctAnswer: 2,
          explanation: 'Never go below 40% Foundation. This is your survival layer that survives any market condition.'
        },
        {
          id: 'pc-2',
          question: 'True or False: Holding 10 different memecoins provides good diversification.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. All memecoins are highly correlated - they dump together in risk-off environments. True diversification requires assets with low correlation.'
        },
        {
          id: 'pc-3',
          question: 'What is the maximum recommended single position size for speculation tier?',
          options: ['20%', '10%', '5%', '2%'],
          correctAnswer: 3,
          explanation: 'Speculation positions should be maximum 2% each. These can go to zero, so small sizes only.'
        },
        {
          id: 'pc-4',
          question: 'When should you rebalance your portfolio?',
          options: [
            'Every trade',
            'When any tier drifts 10%+ from target',
            'Only when you\'re losing',
            'Never'
          ],
          correctAnswer: 1,
          explanation: 'Check allocations weekly and rebalance if any tier drifts 10%+ from target to maintain your risk profile.'
        },
        {
          id: 'pc-5',
          question: 'Why is holding cash (stablecoins) valuable?',
          options: [
            'It earns the most yield',
            'It provides dry powder for opportunities and reduces volatility',
            'It\'s required by law',
            'It makes you look smart'
          ],
          correctAnswer: 1,
          explanation: 'Cash provides dry powder for opportunities, reduces portfolio volatility, offers psychological comfort, and gives you optionality.'
        }
      ]
    },

    'scaling-positions': {
      lessonTitle: 'Scaling Positions',
      questions: [
        {
          id: 'sp-1',
          question: 'What is the maximum recommended position size increase at once?',
          options: ['100%', '50%', '25%', '200%'],
          correctAnswer: 2,
          explanation: 'The 25% Rule: Increase position sizes by maximum 25% at a time. Scale gradually to acclimate psychologically and verify profitability is maintained.'
        },
        {
          id: 'sp-2',
          question: 'True or False: If you\'re profitable at $500 per trade, you should immediately scale to $5,000.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. Scale gradually (25% max increase at a time) with minimum 20 trades at each new size to verify profitability and emotional stability.'
        },
        {
          id: 'sp-3',
          question: 'What determines how large a position you can take in a token?',
          options: [
            'How much you want to make',
            'Liquidity and daily volume',
            'How bullish you are',
            'What others are doing'
          ],
          correctAnswer: 1,
          explanation: 'Liquidity constraints determine max position size. Never be more than 1-2% of daily volume to avoid market impact and slippage.'
        },
        {
          id: 'sp-4',
          question: 'When should you scale DOWN?',
          options: [
            'When you\'re winning',
            'When drawing down or emotionally unstable',
            'Never',
            'Every week'
          ],
          correctAnswer: 1,
          explanation: 'Scale down when drawing down significantly, emotional state is degraded, system is underperforming, or life stress has increased.'
        },
        {
          id: 'sp-5',
          question: 'What\'s the minimum number of trades at a new size before scaling again?',
          options: ['5', '10', '20', '100'],
          correctAnswer: 2,
          explanation: 'Minimum 20 trades at each new size to verify profitability is maintained, check emotional stability, and ensure process is followed consistently.'
        }
      ]
    },

    'advanced-entry-exit': {
      lessonTitle: 'Advanced Entry and Exit Techniques',
      questions: [
        {
          id: 'aee-1',
          question: 'What is an "iceberg order"?',
          options: [
            'A cold storage wallet',
            'Breaking large orders into smaller pieces to hide true size',
            'A type of stop loss',
            'Buying during winter months'
          ],
          correctAnswer: 1,
          explanation: 'Iceberg orders break large orders into smaller pieces over time so the market doesn\'t see your full size and move against you.'
        },
        {
          id: 'aee-2',
          question: 'True or False: Scaling into a position means buying all at once at the best price.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. Scaling into a position means building the position across multiple entries at different prices, often improving your average if price dips.'
        },
        {
          id: 'aee-3',
          question: 'What is a trailing exit?',
          options: [
            'Exiting at a fixed price',
            'Following other traders\' exits',
            'Moving exit point as price moves in your favor',
            'Never exiting'
          ],
          correctAnswer: 2,
          explanation: 'A trailing exit moves your exit point (stop) as price moves in your favor, locking in gains while allowing for larger moves.'
        },
        {
          id: 'aee-4',
          question: 'When might you use a time-based exit?',
          options: [
            'Never',
            'After a catalyst event or to avoid weekend risk',
            'Only when profitable',
            'Every trade'
          ],
          correctAnswer: 1,
          explanation: 'Time-based exits are useful for catalyst trades (exit after the catalyst), avoiding weekend risk, or freeing capital for other opportunities.'
        },
        {
          id: 'aee-5',
          question: 'Order flow reading helps you:',
          options: [
            'See the future',
            'Time entries by reading buying/selling pressure',
            'Guarantee profits',
            'Avoid all losses'
          ],
          correctAnswer: 1,
          explanation: 'Order flow reading helps you time entries and confirm breakouts by reading buying/selling pressure through bid/ask ratios, large orders, and order book depth.'
        }
      ]
    },

    'tax-record-keeping': {
      lessonTitle: 'Tax and Record Keeping',
      questions: [
        {
          id: 'trk-1',
          question: 'What is a taxable event in crypto (US)?',
          options: [
            'Buying crypto with fiat',
            'Holding crypto',
            'Trading crypto to crypto',
            'Transferring between your own wallets'
          ],
          correctAnswer: 2,
          explanation: 'Trading crypto to crypto is taxable. Also taxable: selling for fiat, spending crypto, receiving income in crypto. NOT taxable: buying, holding, transfers between own wallets.'
        },
        {
          id: 'trk-2',
          question: 'True or False: Holding crypto for over 1 year results in lower tax rates.',
          options: ['True', 'False'],
          correctAnswer: 0,
          explanation: 'True. Long-term capital gains (held over 1 year) are taxed at 0%, 15%, or 20% vs short-term which is taxed as ordinary income (10-37%).'
        },
        {
          id: 'trk-3',
          question: 'What is tax-loss harvesting?',
          options: [
            'Collecting taxes from others',
            'Selling losing positions to offset gains',
            'Avoiding all taxes',
            'Only reporting wins'
          ],
          correctAnswer: 1,
          explanation: 'Tax-loss harvesting is selling losing positions to realize losses that offset your gains, reducing your net taxable amount.'
        },
        {
          id: 'trk-4',
          question: 'What percentage of gains should you set aside for taxes as a rule of thumb?',
          options: ['5-10%', '25-35%', '50-60%', '0%'],
          correctAnswer: 1,
          explanation: 'Set aside 25-35% of realized gains for taxes. Keep in a separate stablecoin allocation and don\'t spend your tax money.'
        },
        {
          id: 'trk-5',
          question: 'What should you do before tax season?',
          options: [
            'Delete all records',
            'Export all exchange records and reconcile transactions',
            'Ignore it',
            'Only report losses'
          ],
          correctAnswer: 1,
          explanation: 'Before tax season: export all exchange records, reconcile wallet transactions, calculate total gains/losses, organize by short/long term, and consult a tax professional.'
        }
      ]
    },

    'continuous-improvement': {
      lessonTitle: 'Continuous Improvement',
      questions: [
        {
          id: 'ci-1',
          question: 'What is the key mindset for long-term trading success?',
          options: [
            'Fixed mindset - "I\'ve figured it out"',
            'Growth mindset - "I\'m always learning"',
            'Avoidance mindset - "I don\'t need to review"',
            'Comparison mindset - "I need to beat others"'
          ],
          correctAnswer: 1,
          explanation: 'Markets reward the growth mindset. Complacency gets punished. Every trade teaches something.'
        },
        {
          id: 'ci-2',
          question: 'True or False: Once you have a profitable system, you don\'t need to review it anymore.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. Markets change, strategies decay, edges erode. Continuous review and adaptation is essential for long-term success.'
        },
        {
          id: 'ci-3',
          question: 'How often should you do a comprehensive monthly review?',
          options: ['Never', 'Once a year', 'Monthly (1-2 hours)', 'Every trade'],
          correctAnswer: 2,
          explanation: 'Monthly reviews (1-2 hours) cover comprehensive performance metrics, system effectiveness analysis, edge validation, and strategic adjustments.'
        },
        {
          id: 'ci-4',
          question: 'What should you do when an edge starts decaying?',
          options: [
            'Keep trading it anyway',
            'Double down on position sizes',
            'Adapt the setup, develop new edges, or retire it',
            'Blame the market'
          ],
          correctAnswer: 2,
          explanation: 'When an edge decays: adapt or retire the setup, develop new edges, don\'t force what\'s not working. Edges don\'t last forever.'
        },
        {
          id: 'ci-5',
          question: 'What stage of trader evolution is characterized by "knowing what to do but requiring effort to execute"?',
          options: [
            'Unconscious incompetence',
            'Conscious incompetence',
            'Conscious competence',
            'Mastery'
          ],
          correctAnswer: 2,
          explanation: 'Conscious competence: You know what to do, but it requires effort and focus to execute. Starting to be profitable.'
        }
      ]
    }
  },

  // Final exam (15 questions)
  finalTest: {
    title: 'Master Module Final Exam',
    passingScore: 80,
    questions: [
      {
        id: 'final-1',
        question: 'What percentage of portfolio should Foundation tier (blue chips, stables) be at minimum?',
        options: ['10%', '25%', '40%', '75%'],
        correctAnswer: 2,
        explanation: 'Never go below 40% Foundation. This is your survival layer.'
      },
      {
        id: 'final-2',
        question: 'True or False: Holding 10 different memecoins provides good diversification.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. All memecoins are highly correlated and dump together.'
      },
      {
        id: 'final-3',
        question: 'When should you rebalance your portfolio?',
        options: [
          'Never',
          'Every trade',
          'When any tier drifts 10%+ from target',
          'Only when at all-time highs'
        ],
        correctAnswer: 2,
        explanation: 'Rebalance when any tier drifts 10%+ from target to maintain risk profile.'
      },
      {
        id: 'final-4',
        question: 'What is the maximum recommended position size increase when scaling?',
        options: ['100%', '50%', '25%', '10%'],
        correctAnswer: 2,
        explanation: 'The 25% Rule: Scale gradually with maximum 25% increase at a time.'
      },
      {
        id: 'final-5',
        question: 'What determines how large a position you can take in a token?',
        options: [
          'Your confidence',
          'Liquidity and daily volume',
          'What influencers say',
          'Your trading history'
        ],
        correctAnswer: 1,
        explanation: 'Liquidity constraints determine max size. Never be more than 1-2% of daily volume.'
      },
      {
        id: 'final-6',
        question: 'True or False: When in a drawdown, you should scale UP to recover faster.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Scale DOWN during drawdowns. Reduce size until emotional stability returns.'
      },
      {
        id: 'final-7',
        question: 'What is scaling into a position?',
        options: [
          'Buying all at once',
          'Building position across multiple entries at different prices',
          'Only buying at all-time highs',
          'Never adding to positions'
        ],
        correctAnswer: 1,
        explanation: 'Scaling in builds position across multiple entries, often improving average price.'
      },
      {
        id: 'final-8',
        question: 'What is a trailing exit?',
        options: [
          'Exiting at a fixed price',
          'Moving exit point as price moves in your favor',
          'Never selling',
          'Following other traders'
        ],
        correctAnswer: 1,
        explanation: 'Trailing exits move your stop up as price rises, locking in gains.'
      },
      {
        id: 'final-9',
        question: 'Which is a taxable event in crypto (US)?',
        options: [
          'Buying with fiat',
          'Holding',
          'Trading crypto to crypto',
          'Transferring to your own wallet'
        ],
        correctAnswer: 2,
        explanation: 'Trading crypto to crypto is taxable. Buying, holding, and transfers are not.'
      },
      {
        id: 'final-10',
        question: 'True or False: Short-term capital gains (held < 1 year) have lower tax rates than long-term.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Long-term gains (> 1 year) have lower rates (0-20% vs 10-37%).'
      },
      {
        id: 'final-11',
        question: 'What is tax-loss harvesting?',
        options: [
          'Avoiding all taxes',
          'Selling losing positions to offset gains',
          'Only reporting losses',
          'Hiding from the IRS'
        ],
        correctAnswer: 1,
        explanation: 'Tax-loss harvesting sells losers to offset gains, reducing taxable amount.'
      },
      {
        id: 'final-12',
        question: 'How often should you do a weekly trading review?',
        options: ['Never', 'Weekly (30 minutes)', 'Once a year', 'Only when losing'],
        correctAnswer: 1,
        explanation: 'Weekly reviews (30 minutes) cover P&L, win rate, process adherence, and patterns.'
      },
      {
        id: 'final-13',
        question: 'What should you do when an edge starts decaying?',
        options: [
          'Ignore it',
          'Double position sizes',
          'Adapt, develop new edges, or retire the setup',
          'Blame market manipulation'
        ],
        correctAnswer: 2,
        explanation: 'When edges decay: adapt, develop new edges, or retire. Don\'t force what\'s not working.'
      },
      {
        id: 'final-14',
        question: 'What is "conscious competence"?',
        options: [
          'Not knowing what you don\'t know',
          'Knowing what to do but requiring effort to execute',
          'Everything is automatic',
          'Teaching others'
        ],
        correctAnswer: 1,
        explanation: 'Conscious competence: Know what to do, requires effort to execute, starting to be profitable.'
      },
      {
        id: 'final-15',
        question: 'The key to long-term trading success is:',
        options: [
          'Finding one strategy and never changing',
          'Copying other traders exactly',
          'Continuous improvement and adaptation',
          'Trading as much as possible'
        ],
        correctAnswer: 2,
        explanation: 'Markets change, strategies decay. Continuous improvement and adaptation is essential.'
      }
    ]
  }
}

// Helper function to get quiz by lesson slug
export function getMasterQuizByLessonSlug(lessonSlug) {
  const lessonQuiz = masterQuizzes.lessonQuizzes[lessonSlug]
  if (!lessonQuiz) return null

  return {
    title: lessonQuiz.lessonTitle,
    lessonSlug: `trading101-master-${lessonSlug}`,
    questions: lessonQuiz.questions.map(q => ({
      id: q.id,
      question: q.question,
      type: 'multiple-choice',
      options: q.options.map((opt, idx) => ({
        id: String.fromCharCode(97 + idx),
        text: opt
      })),
      correctAnswer: String.fromCharCode(97 + q.correctAnswer),
      explanation: q.explanation
    }))
  }
}

// Helper function to get final test
export function getMasterFinalTest() {
  const finalTest = masterQuizzes.finalTest
  return {
    title: finalTest.title,
    moduleSlug: 'trading101-master-final',
    passingScore: finalTest.passingScore,
    questions: finalTest.questions.map(q => ({
      id: q.id,
      question: q.question,
      type: 'multiple-choice',
      options: q.options.map((opt, idx) => ({
        id: String.fromCharCode(97 + idx),
        text: opt
      })),
      correctAnswer: String.fromCharCode(97 + q.correctAnswer),
      explanation: q.explanation
    }))
  }
}

export default masterQuizzes
