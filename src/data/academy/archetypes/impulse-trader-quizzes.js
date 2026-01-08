// Impulse Trader Archetype Quizzes
// Quiz questions for each lesson and final assessment

export const impulseTraderQuizzes = {
  moduleId: 'impulse-trader',

  // Quizzes for each lesson (3 questions each)
  lessonQuizzes: {
    'impulse-trader-1': {
      lessonId: 'impulse-trader-1',
      lessonTitle: "The Impulse Trader's Reality",
      questions: [
        {
          id: 'impulse1-q1',
          question: 'What is the core dilemma for impulse traders?',
          options: [
            'They trade too rarely',
            'Instinct says act now, but profitable trading requires planning first',
            'They never feel the urge to trade',
            'Markets are too slow for them'
          ],
          correctAnswer: 1,
          explanation: 'The impulse trader\'s core dilemma is that instinct says "act now, figure it out later" while profitable trading requires "plan first, act systematically."'
        },
        {
          id: 'impulse1-q2',
          question: 'What are the two brain systems involved in impulse trading?',
          options: [
            'Left brain and right brain',
            'Memory and imagination',
            'Fast (instinctive/emotional) and slow (analytical/deliberate)',
            'Visual and auditory'
          ],
          correctAnswer: 2,
          explanation: 'Impulse traders have a dominant "fast system" (instinctive, emotional, acts before thinking) while the "slow system" (analytical, deliberate) is harder to engage.'
        },
        {
          id: 'impulse1-q3',
          question: 'What does the goal state transformation look like for impulse traders?',
          options: [
            'Impulse → Immediate action → Random results',
            'No impulse → No trading → No risk',
            'Impulse → Quick filter → Validated action OR Skip',
            'Impulse → Ignore → Regret'
          ],
          correctAnswer: 2,
          explanation: 'The goal is to transform from "Impulse → Immediate action → Random results" to "Impulse → Quick filter → Validated action OR Skip."'
        }
      ]
    },
    'impulse-trader-2': {
      lessonId: 'impulse-trader-2',
      lessonTitle: 'The Cost of Uncontrolled Impulse',
      questions: [
        {
          id: 'impulse2-q1',
          question: 'What is the "impulse premium" on entries?',
          options: [
            'A reward for quick action',
            'The extra cost of buying at worse prices due to chasing',
            'A fee charged by exchanges',
            'A bonus for impulse traders'
          ],
          correctAnswer: 1,
          explanation: 'The impulse premium is the extra cost from chasing entries. If optimal entry is $1.00 but you impulsively buy at $1.20, you\'ve paid a 20% impulse premium.'
        },
        {
          id: 'impulse2-q2',
          question: 'What is the psychological cost cycle of impulse trading?',
          options: [
            'Win → Confidence → Bigger wins',
            'Impulse trade → Lose → Feel stupid → Promise to stop → Do it again → Feel worse',
            'Trade → Profit → Repeat',
            'Research → Trade → Learn'
          ],
          correctAnswer: 1,
          explanation: 'The cycle erodes confidence: impulse trade → lose money → feel stupid → promise to stop → do it again → feel worse. This damages self-trust.'
        },
        {
          id: 'impulse2-q3',
          question: 'What is an opportunity cost of impulse trading?',
          options: [
            'Lower trading fees',
            'More time for analysis',
            'Capital trapped in bad positions means missing actual good opportunities',
            'Better sleep'
          ],
          correctAnswer: 2,
          explanation: 'Capital stuck in underwater impulse trades can\'t be used for actual opportunities. You watch good setups pass because your money is trapped.'
        }
      ]
    },
    'impulse-trader-3': {
      lessonId: 'impulse-trader-3',
      lessonTitle: 'The Pause Protocol',
      questions: [
        {
          id: 'impulse3-q1',
          question: 'Why does willpower fail against impulse in the moment?',
          options: [
            'Traders are weak',
            'Rational brain is offline, emotional brain is driving',
            'Markets are too exciting',
            'Willpower is a myth'
          ],
          correctAnswer: 1,
          explanation: 'In the impulse moment, the rational brain is offline and the emotional brain is driving. "I won\'t do it" doesn\'t work - you need external intervention.'
        },
        {
          id: 'impulse3-q2',
          question: 'What is the minimum timer length in the Pause Protocol?',
          options: [
            '30 seconds',
            '1 minute',
            '2 minutes',
            '10 minutes'
          ],
          correctAnswer: 2,
          explanation: 'The Pause Protocol requires a minimum 2-minute timer before any action. Use your phone timer, do something else during the wait, return with a clearer head.'
        },
        {
          id: 'impulse3-q3',
          question: 'For Level 3 (intense) impulses, what is the recommended response?',
          options: [
            'Standard 2-minute protocol',
            'Trade with reduced size',
            'DO NOT TRADE - 15+ minute break, walk away from computer',
            'Increase position size'
          ],
          correctAnswer: 2,
          explanation: 'Level 3 intensity (overwhelming, physical agitation, can\'t think clearly) means DO NOT TRADE. Take a 15+ minute break and walk away from the computer.'
        }
      ]
    },
    'impulse-trader-4': {
      lessonId: 'impulse-trader-4',
      lessonTitle: 'Quick Validation Filters',
      questions: [
        {
          id: 'impulse4-q1',
          question: 'What is the "Why" Test in the 60-Second Filter?',
          options: [
            'Ask why others are buying',
            'Explain in one sentence why this will go up',
            'Question your existence',
            'Research for an hour'
          ],
          correctAnswer: 1,
          explanation: 'The Why Test asks: "Can I explain why this will go up in one sentence?" Good answers are specific (e.g., "Breaking out at resistance with volume"). Bad answers are vague ("It\'s going up").'
        },
        {
          id: 'impulse4-q2',
          question: 'What does the Chase Check filter ask?',
          options: [
            'Am I running fast enough?',
            'Am I chasing a green candle?',
            'Is someone chasing me?',
            'How many trades today?'
          ],
          correctAnswer: 1,
          explanation: 'The Chase Check asks "Am I chasing a green candle?" The rule is: Never buy during an active green candle. Wait for it to close.'
        },
        {
          id: 'impulse4-q3',
          question: 'If you pass 5 out of 6 filters, what should you do?',
          options: [
            'Skip the trade entirely',
            'Take the trade with full size',
            'Take the trade with reduced size',
            'Add leverage'
          ],
          correctAnswer: 2,
          explanation: 'Scoring: 6/6 = take the trade, 5/6 = take with reduced size, 4/6 or below = skip. One failed filter means proceed with caution.'
        }
      ]
    },
    'impulse-trader-5': {
      lessonId: 'impulse-trader-5',
      lessonTitle: 'Structured Entry and Exit',
      questions: [
        {
          id: 'impulse5-q1',
          question: 'When should you set your stop loss?',
          options: [
            'After the trade plays out',
            'When you feel like it',
            'BEFORE or immediately after entry',
            'Only if losing money'
          ],
          correctAnswer: 2,
          explanation: 'Stop loss must be placed BEFORE or immediately after entry. Not "I\'ll set it later" - your impulsive nature will find excuses. Stop set at entry is non-negotiable.'
        },
        {
          id: 'impulse5-q2',
          question: 'Why should impulse traders default to smaller position sizes?',
          options: [
            'They have less money',
            'Their nature leads to overconfidence - smaller size counters this',
            'Larger sizes are illegal',
            'Position size doesn\'t matter'
          ],
          correctAnswer: 1,
          explanation: 'Impulse traders tend toward overconfidence. Counter it by using 75% of calculated size normally, 50% for first trade of day, after a loss, or during high excitement.'
        },
        {
          id: 'impulse5-q3',
          question: 'What is the Post-Entry Rule?',
          options: [
            'Immediately take profit',
            'No changes for 1 hour minimum',
            'Add to position every 10 minutes',
            'Watch the chart constantly'
          ],
          correctAnswer: 1,
          explanation: 'The Post-Entry Rule: No changes for 1 hour minimum. This prevents moving stops on first dip, taking quick profit on first bounce, or impulsive adding/cutting.'
        }
      ]
    },
    'impulse-trader-6': {
      lessonId: 'impulse-trader-6',
      lessonTitle: 'Managing Active Positions',
      questions: [
        {
          id: 'impulse6-q1',
          question: 'Why should you trust entry-self more than mid-trade-self?',
          options: [
            'Entry-self has more experience',
            'Entry-self was calm and followed process; mid-trade-self is emotional and clouded by P/L',
            'Mid-trade-self is always wrong',
            'Entry-self can see the future'
          ],
          correctAnswer: 1,
          explanation: 'Entry-self was calm, followed the process, and thought clearly. Mid-trade-self is emotional, reactive, and clouded by unrealized P/L. Trust the planned orders.'
        },
        {
          id: 'impulse6-q2',
          question: 'What is the ONLY allowed change to stops during a trade?',
          options: [
            'Move them further away',
            'Remove them entirely',
            'Tighten them (move in your favor)',
            'Change them based on feelings'
          ],
          correctAnswer: 2,
          explanation: 'You can only tighten stops (move them in your favor) - like moving to breakeven after 1R profit or below new swing low. NEVER move stops further from entry.'
        },
        {
          id: 'impulse6-q3',
          question: 'What should you do when feeling unbearable anxiety about a position?',
          options: [
            'Panic sell everything',
            'Ignore it completely',
            'Reduce position size, keep core with proper stop, learn it was too big',
            'Double down'
          ],
          correctAnswer: 2,
          explanation: 'If anxiety is unbearable: reduce position size, keep core position with proper stop, learn that position was too big. Better to reduce and stay sane than overtrade from anxiety.'
        }
      ]
    },
    'impulse-trader-7': {
      lessonId: 'impulse-trader-7',
      lessonTitle: 'Breaking the Impulse Cycle',
      questions: [
        {
          id: 'impulse7-q1',
          question: 'What are the stages of the impulse cycle?',
          options: [
            'Research → Trade → Profit',
            'Trigger → Urge → Action → Consequence → Regret → Promise → Calm → Repeat',
            'Plan → Execute → Review',
            'Buy → Hold → Sell'
          ],
          correctAnswer: 1,
          explanation: 'The impulse cycle: Trigger → Urge → Action → Consequence → Regret → Promise ("I won\'t do it again") → Calm → Return to Trigger. Breaking it requires interruption.'
        },
        {
          id: 'impulse7-q2',
          question: 'What is the strategy for interrupting at the Trigger point?',
          options: [
            'Trade more',
            'Control your environment - reduce trigger exposure, curate social media, set trading times',
            'Ignore triggers',
            'React faster'
          ],
          correctAnswer: 1,
          explanation: 'Interrupt at Trigger by controlling environment: reduce trigger exposure, don\'t watch charts all day, curate social media (unfollow hype accounts), set specific trading times.'
        },
        {
          id: 'impulse7-q3',
          question: 'What is the new identity shift for impulse traders?',
          options: [
            '"I am an impulse trader"',
            '"I am a disciplined trader who acts quickly when appropriate"',
            '"I never trade"',
            '"I trade without thinking"'
          ],
          correctAnswer: 1,
          explanation: 'The identity shift: from "I\'m an impulse trader" to "I\'m a disciplined trader who acts quickly when appropriate." You\'re not suppressing who you are - you\'re evolving.'
        }
      ]
    },
    'impulse-trader-8': {
      lessonId: 'impulse-trader-8',
      lessonTitle: 'Your Impulse Trader System',
      questions: [
        {
          id: 'impulse8-q1',
          question: 'What are the four phases of the Impulse Trader System?',
          options: [
            'Buy, Hold, Sell, Repeat',
            'Prevention, Intervention, Execution, Review',
            'Research, Trade, Profit, Celebrate',
            'Wake, Trade, Sleep, Repeat'
          ],
          correctAnswer: 1,
          explanation: 'The four phases are: Prevention (reduce triggers), Intervention (pause and filter), Execution (structured entry/exit), Review (learn and improve).'
        },
        {
          id: 'impulse8-q2',
          question: 'Which is a core rule for impulse traders?',
          options: [
            'Trade during all hours',
            'Every trade has a stop and target BEFORE entry',
            'Use 150% of calculated position size',
            'Change orders frequently'
          ],
          correctAnswer: 1,
          explanation: 'A core rule is: Every trade has a stop and target BEFORE entry. This removes the option to "figure it out later" and protects against mid-trade impulse decisions.'
        },
        {
          id: 'impulse8-q3',
          question: 'What should short-term success look like for an impulse trader?',
          options: [
            'Maximum profit',
            'Following protocol today with 80%+ adherence score',
            'Making as many trades as possible',
            'Never feeling any impulses'
          ],
          correctAnswer: 1,
          explanation: 'Short-term success is: Did I follow protocol today? Is my adherence score above 80%? Process adherence, not just outcomes, defines success.'
        }
      ]
    }
  },

  // Final module test (15 questions)
  finalTest: {
    title: 'Impulse Trader Final Assessment',
    description: 'Test your mastery of impulse control and disciplined execution',
    passingScore: 80,
    questions: [
      {
        id: 'impulse-final-1',
        question: 'What is the core dilemma facing impulse traders?',
        options: [
          'They trade too slowly',
          'Instinct says act now, profitable trading requires planning first',
          'They have too much patience',
          'Markets move too slowly for them'
        ],
        correctAnswer: 1,
        explanation: 'The impulse trader\'s dilemma: instinct says "act now, figure it out later" while profitable trading requires "plan first, act systematically."'
      },
      {
        id: 'impulse-final-2',
        question: 'The goal is to eliminate impulses completely.',
        options: [
          'True',
          'False'
        ],
        correctAnswer: 1,
        explanation: 'False. The goal isn\'t to eliminate impulses but to channel them through filters. You\'ll still feel the urge - you just won\'t act blindly on it.'
      },
      {
        id: 'impulse-final-3',
        question: 'Why does willpower alone fail against impulses?',
        options: [
          'Traders are lazy',
          'Rational brain is offline, emotional brain is driving in the moment',
          'Impulses are too rare',
          'Willpower is unlimited'
        ],
        correctAnswer: 1,
        explanation: 'In the impulse moment, the rational brain is offline and the emotional brain is driving. You need systems and external intervention, not just willpower.'
      },
      {
        id: 'impulse-final-4',
        question: 'What is the minimum timer length in the Pause Protocol?',
        options: [
          '30 seconds',
          '1 minute',
          '2 minutes',
          '5 minutes'
        ],
        correctAnswer: 2,
        explanation: 'The Pause Protocol requires a minimum 2-minute timer before any trading action can be taken.'
      },
      {
        id: 'impulse-final-5',
        question: 'For Level 3 (intense) impulses, what is required?',
        options: [
          'Standard 2-minute protocol',
          'Trade with smaller size',
          'DO NOT TRADE - take a 15+ minute break',
          'Trade immediately'
        ],
        correctAnswer: 2,
        explanation: 'Level 3 intensity (overwhelming, can\'t think clearly) means DO NOT TRADE. Take 15+ minutes, walk away from the computer.'
      },
      {
        id: 'impulse-final-6',
        question: 'What does the Chase Check ask?',
        options: [
          'Am I being chased?',
          'Am I chasing a green candle?',
          'Am I fast enough?',
          'Am I ahead of the market?'
        ],
        correctAnswer: 1,
        explanation: 'The Chase Check asks "Am I chasing a green candle?" Rule: Never buy during an active green candle. Wait for it to close.'
      },
      {
        id: 'impulse-final-7',
        question: 'If you pass 5 out of 6 validation filters, you should:',
        options: [
          'Skip the trade',
          'Take the trade with full size',
          'Take the trade with reduced size',
          'Double your position'
        ],
        correctAnswer: 2,
        explanation: '6/6 = full trade, 5/6 = reduced size, 4/6 or below = skip. One failed filter means proceed with caution and smaller position.'
      },
      {
        id: 'impulse-final-8',
        question: 'When must you set your stop loss?',
        options: [
          'Whenever you feel like it',
          'After the trade develops',
          'BEFORE or immediately after entry',
          'Only if losing'
        ],
        correctAnswer: 2,
        explanation: 'Stop loss must be set BEFORE or immediately after entry. Not later - your impulsive nature will find excuses.'
      },
      {
        id: 'impulse-final-9',
        question: 'Why should impulse traders default to smaller position sizes?',
        options: [
          'They have less capital',
          'Their nature leads to overconfidence',
          'Smaller is always better',
          'It doesn\'t matter'
        ],
        correctAnswer: 1,
        explanation: 'Impulse traders tend toward overconfidence. Counter with 75% of calculated size normally, 50% for first trade or after losses.'
      },
      {
        id: 'impulse-final-10',
        question: 'What is the Post-Entry Rule?',
        options: [
          'Take profit immediately',
          'No changes for 1 hour minimum',
          'Add every 10 minutes',
          'Watch constantly'
        ],
        correctAnswer: 1,
        explanation: 'Post-Entry Rule: No changes for 1 hour minimum. Prevents impulsive adjustments to stops, targets, or position size.'
      },
      {
        id: 'impulse-final-11',
        question: 'What is the ONLY allowed change to stops?',
        options: [
          'Move them further away',
          'Remove them',
          'Tighten them (move in your favor)',
          'Any change is fine'
        ],
        correctAnswer: 2,
        explanation: 'You can only tighten stops (move them in your favor). NEVER move stops further from entry.'
      },
      {
        id: 'impulse-final-12',
        question: 'Trust your entry-self more than mid-trade-self because:',
        options: [
          'Entry-self has more experience',
          'Entry-self was calm and followed process; mid-trade-self is emotional',
          'Mid-trade-self is always wrong',
          'Entry-self predicts the future'
        ],
        correctAnswer: 1,
        explanation: 'Entry-self was calm, followed process, thought clearly. Mid-trade-self is emotional, reactive, clouded by unrealized P/L.'
      },
      {
        id: 'impulse-final-13',
        question: 'What is the identity shift for successful impulse traders?',
        options: [
          '"I am an impulse trader"',
          '"I am a disciplined trader who acts quickly when appropriate"',
          '"I never trade"',
          '"I suppress all instincts"'
        ],
        correctAnswer: 1,
        explanation: 'The shift is from "I\'m an impulse trader" to "I\'m a disciplined trader who acts quickly when appropriate." Evolution, not suppression.'
      },
      {
        id: 'impulse-final-14',
        question: 'What are the four phases of the Impulse Trader System?',
        options: [
          'Buy, Hold, Sell, Repeat',
          'Prevention, Intervention, Execution, Review',
          'Research, Trade, Profit, Celebrate',
          'Think, Act, Regret, Repeat'
        ],
        correctAnswer: 1,
        explanation: 'The four phases: Prevention (reduce triggers), Intervention (pause/filter), Execution (structured entry/exit), Review (learn/improve).'
      },
      {
        id: 'impulse-final-15',
        question: 'What defines short-term success for an impulse trader?',
        options: [
          'Maximum profit',
          'Following protocol with 80%+ adherence score',
          'Making many trades',
          'Feeling no impulses'
        ],
        correctAnswer: 1,
        explanation: 'Short-term success is: Did I follow protocol today? Is my adherence score 80%+? Process adherence defines success, not just outcomes.'
      }
    ]
  }
}
