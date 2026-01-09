// Trader Module Quizzes
// 5 lesson quizzes + 1 final exam

export const traderQuizzes = {
  moduleId: 'trader',
  moduleName: 'Trader: Strategy & Execution',

  // Lesson quizzes (5 questions each)
  lessonQuizzes: {
    'position-sizing': {
      lessonTitle: 'Position Sizing Fundamentals',
      questions: [
        {
          id: 'ps-1',
          question: 'What is the recommended maximum risk per trade?',
          options: ['10-20%', '5-10%', '1-2%', '50%'],
          correctAnswer: 2,
          explanation: 'Risk 1-2% of your portfolio per trade maximum. This ensures 10 consecutive losses only result in a 10-20% drawdown, which is survivable.'
        },
        {
          id: 'ps-2',
          question: 'True or False: If your stop loss is further from entry, your position size should be smaller.',
          options: ['True', 'False'],
          correctAnswer: 0,
          explanation: 'True. Wider stop = smaller position to maintain the same risk percentage. Position Size = Risk Amount ÷ Stop Loss Percentage.'
        },
        {
          id: 'ps-3',
          question: 'If you have a $10,000 portfolio and want to risk 1% with a 25% stop loss, what\'s your position size?',
          options: ['$100', '$250', '$400', '$1,000'],
          correctAnswer: 2,
          explanation: '$100 (1% of $10,000) ÷ 0.25 (25% stop) = $400 position size.'
        },
        {
          id: 'ps-4',
          question: 'Why is "sizing by conviction" a mistake?',
          options: [
            'Conviction is always wrong',
            'Conviction doesn\'t change the actual risk or volatility',
            'You should never have conviction',
            'It makes trades too small'
          ],
          correctAnswer: 1,
          explanation: 'Conviction doesn\'t change volatility or risk. You can be convinced AND wrong. Size by risk rules, not feelings.'
        },
        {
          id: 'ps-5',
          question: 'What question should you ask before finalizing position size?',
          options: [
            'Will this definitely make money?',
            'What\'s everyone else buying?',
            'If this goes to zero tonight, will I be okay?',
            'Is this trending on Twitter?'
          ],
          correctAnswer: 2,
          explanation: 'The "Go to Zero" test ensures you\'re sizing appropriately. If the answer is no, reduce size until it\'s yes.'
        }
      ]
    },

    'stop-losses': {
      lessonTitle: 'Stop Losses That Work',
      questions: [
        {
          id: 'sl-1',
          question: 'What should you NEVER do with a stop loss?',
          options: [
            'Move it toward profit',
            'Move it further away from entry',
            'Base it on support levels',
            'Use it on every trade'
          ],
          correctAnswer: 1,
          explanation: 'Never move stops away from entry. You\'re not "giving it room" - you\'re increasing your loss. Only move stops toward profit (trailing).'
        },
        {
          id: 'sl-2',
          question: 'True or False: A stop loss should be placed at obvious round numbers like $1.00 or $10.00.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. These obvious levels are hunted by market makers. Place stops slightly beyond obvious levels, using less round numbers.'
        },
        {
          id: 'sl-3',
          question: 'If your proper stop loss is 50% below entry and you\'re only willing to risk $100, your position size should be:',
          options: ['$100', '$200', '$500', '$50'],
          correctAnswer: 1,
          explanation: '$100 ÷ 0.50 = $200. Wider stop distance means smaller position size to maintain the same risk amount.'
        },
        {
          id: 'sl-4',
          question: 'What\'s the problem with "mental stops"?',
          options: [
            'They\'re more effective than actual stops',
            'You\'ll likely move them, hesitate, or miss them',
            'They cost more in fees',
            'They\'re illegal'
          ],
          correctAnswer: 1,
          explanation: 'Mental stops fail because you\'ll move them when price gets close, be away when triggered, or negotiate with yourself. Use actual stop orders.'
        },
        {
          id: 'sl-5',
          question: 'When can you move your stop loss?',
          options: [
            'Whenever price gets close to it',
            'Only toward profit (trailing), never away from entry',
            'Never under any circumstances',
            'Whenever you feel hopeful'
          ],
          correctAnswer: 1,
          explanation: 'Only move stops toward profit as the price moves in your favor (trailing). Never move them away from entry to "give it more room."'
        }
      ]
    },

    'risk-reward': {
      lessonTitle: 'Risk/Reward and Trade Selection',
      questions: [
        {
          id: 'rr-1',
          question: 'What is a 1:3 Risk/Reward ratio?',
          options: [
            'You risk $3 to make $1',
            'You risk $1 to make $3',
            'You win 3 out of every trade',
            'You trade 3 times per day'
          ],
          correctAnswer: 1,
          explanation: 'A 1:3 R:R means for every $1 you risk, you potentially make $3. This allows profitability even with a low win rate.'
        },
        {
          id: 'rr-2',
          question: 'True or False: A high win rate is more important than a high R:R ratio.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. With a 1:3 R:R, you can be wrong 65% of the time and still be profitable. High R:R provides more margin for error.'
        },
        {
          id: 'rr-3',
          question: 'What\'s the minimum R:R you should require for standard trades?',
          options: ['1:0.5', '1:1', '1:2', '1:10'],
          correctAnswer: 2,
          explanation: 'Never take a trade below 1:2 R:R. This is profitable with 40%+ win rate. 1:1 requires a high win rate, and 1:0.5 is unprofitable.'
        },
        {
          id: 'rr-4',
          question: 'Which entry gives the best R:R opportunity?',
          options: [
            'Buying near resistance',
            'Buying near support',
            'Buying in the middle of a range',
            'Buying when price is already up 100%'
          ],
          correctAnswer: 1,
          explanation: 'Buying near support allows a tight stop below, meaning small risk with the same target = better R:R.'
        },
        {
          id: 'rr-5',
          question: 'What should you do if a trade setup has 1:1.5 R:R?',
          options: [
            'Take it with full size',
            'Take it with double size',
            'Usually skip it or wait for better entry',
            'Always take every trade available'
          ],
          correctAnswer: 2,
          explanation: '1:1.5 R:R is marginal (Tier 3). Usually skip it or take a tiny position. Being selective is profitable.'
        }
      ]
    },

    'entry-strategies': {
      lessonTitle: 'Entry Strategies',
      questions: [
        {
          id: 'es-1',
          question: 'Which entry strategy gives the best average price?',
          options: [
            'Market order',
            'Limit order at support',
            'Chasing green candles',
            'Buying at all-time high'
          ],
          correctAnswer: 1,
          explanation: 'Limit orders at support give the best average price. You wait for price to come to you rather than chasing.'
        },
        {
          id: 'es-2',
          question: 'True or False: If you miss a trade because your limit didn\'t fill, you should immediately market buy to chase it.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. Missing > Chasing. There\'s always another setup. Discipline matters more than any single trade.'
        },
        {
          id: 'es-3',
          question: 'What is a "breakout retest" entry?',
          options: [
            'Buying before the breakout happens',
            'Buying the breakout, then selling',
            'Waiting for price to break resistance, then pull back to test it as support',
            'Never entering breakouts'
          ],
          correctAnswer: 2,
          explanation: 'Breakout retest combines confirmation (price broke resistance) with better entry (pullback to test level as support). Best of both worlds.'
        },
        {
          id: 'es-4',
          question: 'In a scaled entry of $1000 total, a common split might be:',
          options: [
            '$1000 all at once',
            '$333, $333, $334 at different prices',
            '$100 across 10 trades',
            'Whatever feels right in the moment'
          ],
          correctAnswer: 1,
          explanation: 'Scaled entries split the position across 2-3 entries (e.g., 30%/40%/30%) to get a better average price if it dips.'
        },
        {
          id: 'es-5',
          question: 'When is a market order appropriate?',
          options: [
            'Always, for fastest execution',
            'Rarely, only when speed is truly critical',
            'For every trade',
            'When you\'re feeling FOMO'
          ],
          correctAnswer: 1,
          explanation: 'Market orders give worst average price and significant slippage. Use only when speed is truly critical (rare).'
        }
      ]
    },

    'taking-profits': {
      lessonTitle: 'Taking Profits',
      questions: [
        {
          id: 'tp-1',
          question: 'What\'s the main psychological challenge of taking profits?',
          options: [
            'It\'s technically difficult',
            'Greed and fear of missing more gains',
            'Exchanges make it hard',
            'You need special permissions'
          ],
          correctAnswer: 1,
          explanation: 'Greed ("it could go higher"), ego ("I\'ll sell the top"), and FOMO ("what if it 10x") make profit-taking psychologically difficult.'
        },
        {
          id: 'tp-2',
          question: 'True or False: You should aim to sell at the exact top of every trade.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. You will never sell the top. Never. The goal is to sell while it\'s still going up.'
        },
        {
          id: 'tp-3',
          question: 'What is the "Take Initial Out" rule?',
          options: [
            'Never invest your initial capital',
            'Once investment doubles, sell your initial amount to secure break-even',
            'Always sell at a loss',
            'Keep adding to positions'
          ],
          correctAnswer: 1,
          explanation: 'When position doubles, sell your initial investment. The remainder is "house money" - you literally can\'t lose on that trade.'
        },
        {
          id: 'tp-4',
          question: 'Which profit-taking approach combines locking in gains with letting winners run?',
          options: [
            'Fixed target exit (100% at one price)',
            'Never selling',
            'Scaled exit (sell portions at multiple targets)',
            'Market sell everything at entry'
          ],
          correctAnswer: 2,
          explanation: 'Scaled exits sell portions at multiple targets, locking in some profit while keeping exposure for bigger moves.'
        },
        {
          id: 'tp-5',
          question: 'After selling a winner that then goes higher, you should:',
          options: [
            'Buy back at the higher price',
            'Calculate how much you "missed" and feel bad',
            'Appreciate the win, log the trade, and find next opportunity',
            'Stop trading forever'
          ],
          correctAnswer: 2,
          explanation: 'Profits taken are real. Profits not taken are imaginary. Log the trade, appreciate the win, move to next opportunity.'
        }
      ]
    }
  },

  // Final exam (15 questions)
  finalTest: {
    title: 'Trader Module Final Exam',
    passingScore: 80,
    questions: [
      {
        id: 'final-1',
        question: 'What is the recommended maximum risk per trade?',
        options: ['10-20%', '5-10%', '1-2%', '50%'],
        correctAnswer: 2,
        explanation: 'Risk 1-2% of your portfolio per trade maximum to survive losing streaks.'
      },
      {
        id: 'final-2',
        question: 'If you have a $20,000 portfolio, risk 1%, and your stop is 25% below entry, what\'s your position size?',
        options: ['$200', '$400', '$800', '$5,000'],
        correctAnswer: 2,
        explanation: '$200 (1% of $20,000) ÷ 0.25 (25% stop) = $800 position size.'
      },
      {
        id: 'final-3',
        question: 'True or False: You should move your stop loss further away when price gets close to it.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Never move stops away from entry. You\'re increasing your loss, not "giving it room."'
      },
      {
        id: 'final-4',
        question: 'A 1:3 Risk/Reward ratio means:',
        options: [
          'You risk $3 to potentially make $1',
          'You risk $1 to potentially make $3',
          'You trade 3 times per day',
          'You win 3 out of every trade'
        ],
        correctAnswer: 1,
        explanation: '1:3 R:R means for every $1 risked, you potentially make $3.'
      },
      {
        id: 'final-5',
        question: 'What\'s the minimum R:R you should require for standard trades?',
        options: ['1:0.5', '1:1', '1:2', '1:5 only'],
        correctAnswer: 2,
        explanation: 'Never take a trade below 1:2 R:R. This is profitable with 40%+ win rate.'
      },
      {
        id: 'final-6',
        question: 'Which entry typically gives the best R:R?',
        options: [
          'Buying at resistance',
          'Buying near support',
          'Market buying during a pump',
          'Buying at all-time high'
        ],
        correctAnswer: 1,
        explanation: 'Buying near support allows tight stop below = small risk with same target = better R:R.'
      },
      {
        id: 'final-7',
        question: 'True or False: Chasing green candles usually results in good entries.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Chasing green candles = buying at worst price. Wait for close or pullback.'
      },
      {
        id: 'final-8',
        question: 'What is a "breakout retest" entry?',
        options: [
          'Buying before any breakout',
          'Waiting for price to break resistance, then pull back to test it as support',
          'Selling during a breakout',
          'Ignoring all breakouts'
        ],
        correctAnswer: 1,
        explanation: 'Breakout retest waits for confirmation (break) then better entry (pullback to test level).'
      },
      {
        id: 'final-9',
        question: 'The "Take Initial Out" rule means:',
        options: [
          'Never invest',
          'When position doubles, sell your initial investment to play with house money',
          'Always sell at a loss',
          'Take out a loan'
        ],
        correctAnswer: 1,
        explanation: 'Selling your initial when position doubles means you literally can\'t lose on that trade.'
      },
      {
        id: 'final-10',
        question: 'True or False: You should set profit targets AFTER you see how the trade goes.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Set targets BEFORE entry when you\'re rational. Trust past-you over in-the-moment-you.'
      },
      {
        id: 'final-11',
        question: 'What determines your position size?',
        options: [
          'How much you like the token',
          'What\'s trending on Twitter',
          'Your risk amount divided by stop loss percentage',
          'Random feeling'
        ],
        correctAnswer: 2,
        explanation: 'Position Size = Risk Amount ÷ Stop Loss Percentage. This is the formula.'
      },
      {
        id: 'final-12',
        question: 'Which stop loss placement is usually best?',
        options: [
          'At an obvious round number',
          'Just beyond a logical invalidation point (support break, etc.)',
          '1% below entry for all trades',
          'No stop loss'
        ],
        correctAnswer: 1,
        explanation: 'Place stops at logical invalidation points (where your thesis is proven wrong), not arbitrary numbers.'
      },
      {
        id: 'final-13',
        question: 'With a 1:3 R:R, what win rate do you need to be profitable?',
        options: ['90%+', '75%+', '50%+', 'As low as 30%+'],
        correctAnswer: 3,
        explanation: 'With 1:3 R:R, you can be wrong 65%+ of the time and still profit. Low win rate is fine with high R:R.'
      },
      {
        id: 'final-14',
        question: 'Which profit-taking strategy locks in some gains while allowing for bigger moves?',
        options: [
          'All-or-nothing at one target',
          'Never selling',
          'Scaled exit at multiple targets',
          'Selling at the entry price'
        ],
        correctAnswer: 2,
        explanation: 'Scaled exits sell portions at multiple targets, securing profit while keeping exposure.'
      },
      {
        id: 'final-15',
        question: 'After a winning trade, you should:',
        options: [
          'Obsess over how much more you could have made',
          'Immediately buy back if it keeps going up',
          'Log the trade, appreciate the win, move to next opportunity',
          'Tell everyone on Twitter'
        ],
        correctAnswer: 2,
        explanation: 'Profits taken are real. Log it, appreciate it, find the next opportunity. Don\'t look back.'
      }
    ]
  }
}

// Helper function to get quiz by lesson slug
export function getTraderQuizByLessonSlug(lessonSlug) {
  const lessonQuiz = traderQuizzes.lessonQuizzes[lessonSlug]
  if (!lessonQuiz) return null

  return {
    title: lessonQuiz.lessonTitle,
    lessonSlug: `trading101-trader-${lessonSlug}`,
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
export function getTraderFinalTest() {
  const finalTest = traderQuizzes.finalTest
  return {
    title: finalTest.title,
    moduleSlug: 'trading101-trader-final',
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

export default traderQuizzes
