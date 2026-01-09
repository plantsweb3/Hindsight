// Specialist Module Quizzes
// 5 lesson quizzes + 1 final exam

export const specialistQuizzes = {
  moduleId: 'specialist',
  moduleName: 'Specialist: Psychology & Edge',

  // Lesson quizzes (5 questions each)
  lessonQuizzes: {
    'psychology-of-trading': {
      lessonTitle: 'The Psychology of Trading',
      questions: [
        {
          id: 'pot-1',
          question: 'Why does loss aversion hurt traders?',
          options: [
            'It makes you take more risks',
            'It makes you hold losers and sell winners too early',
            'It makes you trade too often',
            'It makes you too analytical'
          ],
          correctAnswer: 1,
          explanation: 'Loss aversion makes losses feel 2-2.5x more painful than equivalent gains feel good, causing traders to hold losers hoping for recovery and sell winners too early to "lock in" gains.'
        },
        {
          id: 'pot-2',
          question: 'True or False: Your brain\'s survival instincts are well-suited for trading.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. Your brain evolved for survival on the savanna, not for navigating volatile markets. Instincts like loss aversion, social proof, and fight-or-flight actually hurt traders.'
        },
        {
          id: 'pot-3',
          question: 'What is confirmation bias?',
          options: [
            'Seeking information that confirms existing beliefs',
            'Confirming every trade with a friend',
            'Using technical confirmations',
            'Double-checking your orders'
          ],
          correctAnswer: 0,
          explanation: 'Confirmation bias is seeking information that confirms what you already believe, causing you to ignore red flags and stay in bad positions longer.'
        },
        {
          id: 'pot-4',
          question: 'At what point in the emotional cycle are traders most likely to make mistakes?',
          options: ['Depression', 'Hope', 'Euphoria', 'Anxiety'],
          correctAnswer: 2,
          explanation: 'Euphoria ("I can\'t lose!") is the most dangerous point. This is when traders oversize, skip research, and make their worst decisions.'
        },
        {
          id: 'pot-5',
          question: 'What emotional state is optimal for trading decisions?',
          options: ['High excitement', 'Fear', 'Neutral/calm', 'Euphoria'],
          correctAnswer: 2,
          explanation: 'Neutral/calm is optimal. Decisions from calm are best - neither euphoric nor fearful. This is your target state for trading.'
        }
      ]
    },

    'emotional-management': {
      lessonTitle: 'Emotional Management',
      questions: [
        {
          id: 'em-1',
          question: 'What is the first step when emotions are running high?',
          options: [
            'Make the trade quickly',
            'Call a friend',
            'Recognize and pause',
            'Double your position'
          ],
          correctAnswer: 2,
          explanation: 'The first step of the Pause Protocol is to recognize when you\'re activated (heart rate up, urge to act NOW, can\'t think clearly) and pause before taking action.'
        },
        {
          id: 'em-2',
          question: 'True or False: You should trust your in-the-moment emotions over your pre-written trading plan.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. Trust past-you (who made the plan when calm) over present-you (who is emotional). The plan was made when you were rational.'
        },
        {
          id: 'em-3',
          question: 'Which is NOT a recommended pre-commitment strategy?',
          options: [
            'Written trading plan',
            'Pre-set orders',
            'Trading based on how you feel',
            'Removing trading apps from home screen'
          ],
          correctAnswer: 2,
          explanation: 'Trading based on feelings is the opposite of pre-commitment. Pre-commitment strategies (written plans, pre-set orders, commitment devices) help you make decisions when calm.'
        },
        {
          id: 'em-4',
          question: 'What should you do when you notice frustration after losses?',
          options: [
            'Trade more to make it back',
            'Double position size',
            'Stop trading, do physical activity, review rules',
            'Ignore it and keep trading'
          ],
          correctAnswer: 2,
          explanation: 'When frustrated: Stop trading immediately, do physical activity to discharge energy, review rules (not results), and ask "Am I trading to profit or to feel better?"'
        },
        {
          id: 'em-5',
          question: 'The 24-hour rule suggests:',
          options: [
            'Trade every 24 hours',
            'Wait 24 hours before major decisions',
            'Only check prices once per day',
            'Close all positions within 24 hours'
          ],
          correctAnswer: 1,
          explanation: 'For major decisions (large trades, exits, strategy changes): Wait 24 hours, sleep on it, decide tomorrow. Most "urgent" decisions aren\'t actually urgent.'
        }
      ]
    },

    'developing-your-edge': {
      lessonTitle: 'Developing Your Trading Edge',
      questions: [
        {
          id: 'dye-1',
          question: 'What is a trading edge?',
          options: [
            'A guaranteed winning strategy',
            'A repeatable advantage that produces positive expected value over many trades',
            'A special type of order',
            'The sharpest part of your trading'
          ],
          correctAnswer: 1,
          explanation: 'An edge is a repeatable advantage that produces positive expected value over many trades. It doesn\'t win every trade, but it wins over many trades.'
        },
        {
          id: 'dye-2',
          question: 'True or False: Having an edge means you win every trade.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. An edge wins over many trades, not every trade. Even with a positive edge, you can have losing streaks due to variance.'
        },
        {
          id: 'dye-3',
          question: 'What is a "behavioral edge"?',
          options: [
            'Knowing information before others',
            'Having the best tools',
            'Acting better than others through discipline, risk management, patience',
            'Being the fastest trader'
          ],
          correctAnswer: 2,
          explanation: 'A behavioral edge comes from acting better than others: emotional discipline, risk management, patience to wait for setups, and ability to cut losses.'
        },
        {
          id: 'dye-4',
          question: 'How many trades should you track minimum to validate an edge?',
          options: ['5-10', '10-20', '50-100', '500+'],
          correctAnswer: 2,
          explanation: 'Track at least 50-100 trades to validate an edge. Fewer trades means too much noise to determine if you truly have positive expectancy.'
        },
        {
          id: 'dye-5',
          question: 'What happens to edges over time?',
          options: [
            'They always get stronger',
            'They can decay as conditions change and others discover them',
            'They never change',
            'They double in effectiveness'
          ],
          correctAnswer: 1,
          explanation: 'Edges decay as others discover them, market conditions change, technology evolves, and competition increases. Continuous adaptation is required.'
        }
      ]
    },

    'building-a-trading-system': {
      lessonTitle: 'Building a Trading System',
      questions: [
        {
          id: 'bts-1',
          question: 'What is the main benefit of a trading system?',
          options: [
            'It guarantees profits',
            'It removes emotional decision-making and creates consistency',
            'It requires no effort',
            'It trades automatically'
          ],
          correctAnswer: 1,
          explanation: 'A trading system removes emotional decision-making and creates consistency. Rules decide each trade, emotions are overridden, and execution becomes consistent.'
        },
        {
          id: 'bts-2',
          question: 'True or False: A trading system should leave room for "gut feel" overrides.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. When system says trade, you trade. When it says don\'t, you don\'t. No overrides, no exceptions, no "just this once."'
        },
        {
          id: 'bts-3',
          question: 'What should your "Universe Definition" specify?',
          options: [
            'Your star sign',
            'What you trade - asset types, market cap ranges, chains, etc.',
            'How much money you have',
            'Your goals for the year'
          ],
          correctAnswer: 1,
          explanation: 'Universe Definition specifies what you trade: asset types, market cap range, chains, and exclusions. This defines your trading sandbox.'
        },
        {
          id: 'bts-4',
          question: 'How often should you change your system rules?',
          options: [
            'After every losing trade',
            'Daily based on feelings',
            'Carefully, one change at a time, with 20+ trades to evaluate',
            'Never change anything'
          ],
          correctAnswer: 2,
          explanation: 'Change rules carefully: one change at a time, need 20+ trades to evaluate, don\'t over-optimize to recent results. Use version control to track changes.'
        },
        {
          id: 'bts-5',
          question: 'What is "system adherence"?',
          options: [
            'How profitable your system is',
            'Whether you followed your own rules on each trade',
            'How complex your system is',
            'How long you\'ve been trading'
          ],
          correctAnswer: 1,
          explanation: 'System adherence measures whether you followed your own rules on each trade. Track: Did I follow entry rules? Sizing rules? Stop rules? Target rules?'
        }
      ]
    },

    'building-consistency': {
      lessonTitle: 'Building Consistency',
      questions: [
        {
          id: 'bc-1',
          question: 'What is the formula for consistency?',
          options: [
            'Profit × Time',
            'Process Adherence × Time',
            'Wins ÷ Losses',
            'Entry × Exit'
          ],
          correctAnswer: 1,
          explanation: 'Consistency = Process Adherence × Time. Following your system every trade over enough trades for your edge to play out.'
        },
        {
          id: 'bc-2',
          question: 'True or False: A winning trade with broken process is better than a losing trade with proper process.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. A losing trade with proper process is better. Good process + bad outcome = Still good. Bad process + good outcome = Still bad.'
        },
        {
          id: 'bc-3',
          question: 'What should you track more than results?',
          options: [
            'Twitter followers',
            'Number of trades',
            'Process adherence',
            'Other traders\' results'
          ],
          correctAnswer: 2,
          explanation: 'Track process adherence more than results. "Did I follow the process?" is most important. Results matter less in the short-term.'
        },
        {
          id: 'bc-4',
          question: 'When in a losing streak, what should you check FIRST?',
          options: [
            'If you should quit trading',
            'If you\'re following your process',
            'What other traders are doing',
            'If the market is manipulated'
          ],
          correctAnswer: 1,
          explanation: 'First verify process: Am I following my system? If no, that\'s the problem - return to process. Only then check for changed conditions or accept variance.'
        },
        {
          id: 'bc-5',
          question: 'When in a winning streak, what should you NOT do?',
          options: [
            'Keep following your process',
            'Take some profits',
            'Dramatically increase position sizes',
            'Expect eventual reversion'
          ],
          correctAnswer: 2,
          explanation: 'Don\'t increase risk during winning streaks. Overconfidence is the enemy. Maintain same position sizes and don\'t assume streak continues.'
        }
      ]
    }
  },

  // Final exam (15 questions)
  finalTest: {
    title: 'Specialist Module Final Exam',
    passingScore: 80,
    questions: [
      {
        id: 'final-1',
        question: 'Loss aversion causes traders to:',
        options: [
          'Take more calculated risks',
          'Hold losers and sell winners too early',
          'Trade more systematically',
          'Have no emotions'
        ],
        correctAnswer: 1,
        explanation: 'Loss aversion makes losses feel more painful than gains feel good, causing traders to hold losers and sell winners prematurely.'
      },
      {
        id: 'final-2',
        question: 'True or False: Your brain\'s instincts evolved for trading modern markets.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Your brain evolved for survival, not trading. These instincts often work against you in markets.'
      },
      {
        id: 'final-3',
        question: 'What is the first step of the Pause Protocol?',
        options: [
          'Execute the trade immediately',
          'Recognize emotional activation',
          'Calculate position size',
          'Check Twitter sentiment'
        ],
        correctAnswer: 1,
        explanation: 'The first step is to recognize when you\'re activated: heart rate up, urge to act NOW, can\'t think clearly.'
      },
      {
        id: 'final-4',
        question: 'Pre-set orders help because:',
        options: [
          'They execute faster',
          'They\'re cheaper',
          'They remove emotional interference from execution',
          'They guarantee profits'
        ],
        correctAnswer: 2,
        explanation: 'Pre-set orders execute without your emotional interference. When emotions hit, the orders execute as planned.'
      },
      {
        id: 'final-5',
        question: 'What is a trading edge?',
        options: [
          'The sharpest part of a chart',
          'A repeatable advantage with positive expected value over time',
          'A guaranteed winning strategy',
          'An edge over other people personally'
        ],
        correctAnswer: 1,
        explanation: 'An edge is a repeatable advantage that produces positive expected value over many trades.'
      },
      {
        id: 'final-6',
        question: 'True or False: Edges stay effective forever without any maintenance.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Edges decay as others discover them, conditions change, and competition increases. Continuous adaptation is required.'
      },
      {
        id: 'final-7',
        question: 'Which is a "behavioral edge"?',
        options: [
          'Faster internet',
          'Insider information',
          'Emotional discipline and strict risk management',
          'Better charting software'
        ],
        correctAnswer: 2,
        explanation: 'A behavioral edge comes from acting better than others: emotional discipline, risk management, patience, and ability to cut losses.'
      },
      {
        id: 'final-8',
        question: 'What should a trading system define?',
        options: [
          'Only entry points',
          'What you trade, when to enter, how much, and when to exit',
          'Just your feelings',
          'Other traders\' strategies'
        ],
        correctAnswer: 1,
        explanation: 'A trading system answers all trading questions in advance: what to trade, when to enter, how much, when to exit, and how to manage.'
      },
      {
        id: 'final-9',
        question: 'How often should you evaluate system changes?',
        options: [
          'After every trade',
          'After 5 trades',
          'After 20+ trades minimum',
          'Never evaluate, just change freely'
        ],
        correctAnswer: 2,
        explanation: 'Need 20+ trades to evaluate changes. One change at a time. Don\'t over-optimize to recent results.'
      },
      {
        id: 'final-10',
        question: 'True or False: Following your system with no exceptions is essential.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. When system says trade, you trade. No overrides, no exceptions, no "just this once."'
      },
      {
        id: 'final-11',
        question: 'What does "system adherence" measure?',
        options: [
          'How much money you made',
          'Whether you followed your own rules',
          'How long your trades last',
          'Your popularity'
        ],
        correctAnswer: 1,
        explanation: 'System adherence measures whether you followed your own rules on each trade.'
      },
      {
        id: 'final-12',
        question: 'During a losing streak, if you ARE following your process, the problem is likely:',
        options: [
          'You personally',
          'Market manipulation',
          'Normal variance, keep trading the system',
          'Time to quit forever'
        ],
        correctAnswer: 2,
        explanation: 'If following process, it\'s likely variance. Review if system still has positive expectancy. If yes, keep trading, ride it out.'
      },
      {
        id: 'final-13',
        question: 'Which is the most important metric for long-term success?',
        options: [
          'One big winning trade',
          'Process adherence over many trades',
          'How you feel about your trades',
          'Daily profits'
        ],
        correctAnswer: 1,
        explanation: 'Process adherence over many trades matters most. You can\'t have consistent results without consistent actions.'
      },
      {
        id: 'final-14',
        question: 'During a winning streak, you should:',
        options: [
          'Double your position sizes',
          'Assume you\'ve figured it out and relax rules',
          'Maintain same position sizes and expect eventual reversion',
          'Start giving trading advice to everyone'
        ],
        correctAnswer: 2,
        explanation: 'During winning streaks: Don\'t change what\'s working, don\'t increase risk, take some profits, expect reversion.'
      },
      {
        id: 'final-15',
        question: 'The consistency mindset is:',
        options: [
          '"I need to hit home runs"',
          '"I need to be flashy"',
          '"I don\'t need to be great, I need to be consistent"',
          '"I should change my system constantly"'
        ],
        correctAnswer: 2,
        explanation: 'The mantra: "I don\'t need to be great. I need to be consistent." Consistent is boring, reliable, and how wealth is built.'
      }
    ]
  }
}

// Helper function to get quiz by lesson slug
export function getSpecialistQuizByLessonSlug(lessonSlug) {
  const lessonQuiz = specialistQuizzes.lessonQuizzes[lessonSlug]
  if (!lessonQuiz) return null

  return {
    title: lessonQuiz.lessonTitle,
    lessonSlug: `trading101-specialist-${lessonSlug}`,
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
export function getSpecialistFinalTest() {
  const finalTest = specialistQuizzes.finalTest
  return {
    title: finalTest.title,
    moduleSlug: 'trading101-specialist-final',
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

export default specialistQuizzes
