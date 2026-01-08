// FOMO Trader Archetype Quizzes
// Quiz questions for each lesson and final assessment

export const fomoTraderQuizzes = {
  moduleId: 'fomo-trader',

  // Quizzes for each lesson (3 questions each)
  lessonQuizzes: {
    'fomo-trader-1': {
      lessonId: 'fomo-trader-1',
      lessonTitle: 'Understanding Your FOMO',
      questions: [
        {
          id: 'fomo1-q1',
          question: 'What is the FOMO paradox?',
          options: [
            'FOMO always leads to profits',
            'Acting on FOMO usually causes you to miss out more',
            'FOMO only affects new traders',
            'FOMO is rare in crypto markets'
          ],
          correctAnswer: 1,
          explanation: 'The FOMO paradox is that acting on FOMO usually causes you to miss out MORE - you chase at the top, panic sell on the dip, and miss the real move.'
        },
        {
          id: 'fomo1-q2',
          question: "What is the FOMO Trader's real enemy?",
          options: [
            'Feeling FOMO',
            'Market volatility',
            'Impulsive action, poor timing, oversizing, and no exit plan',
            'Other traders'
          ],
          correctAnswer: 2,
          explanation: "The real enemy isn't FOMO itself, but impulsive action, poor timing, oversizing, and entering without an exit plan."
        },
        {
          id: 'fomo1-q3',
          question: 'What is the hidden strength of FOMO awareness?',
          options: [
            'It makes you trade more',
            'You notice opportunities others miss',
            'It guarantees profits',
            'It eliminates risk'
          ],
          correctAnswer: 1,
          explanation: "FOMO awareness is actually valuable because you notice opportunities others miss. The problem isn't your radar - it's your reaction to it."
        }
      ]
    },
    'fomo-trader-2': {
      lessonId: 'fomo-trader-2',
      lessonTitle: 'The True Cost of Chasing',
      questions: [
        {
          id: 'fomo2-q1',
          question: 'What is the cascade effect in FOMO trading?',
          options: [
            'Making multiple profitable trades',
            'One FOMO trade leads to revenge trades and desperation',
            'Prices always cascade downward',
            'Following multiple signals'
          ],
          correctAnswer: 1,
          explanation: 'The cascade effect is when one FOMO trade triggers revenge trading and desperation, turning one losing trade into multiple losing trades.'
        },
        {
          id: 'fomo2-q2',
          question: 'What is the opportunity cost of being stuck in a FOMO bag?',
          options: [
            'No cost at all',
            'You pay trading fees',
            'Capital is trapped, better opportunities pass, you cannot buy actual dips',
            'Only emotional costs'
          ],
          correctAnswer: 2,
          explanation: "When stuck in a FOMO bag, your capital is trapped, better opportunities pass by, and you can't buy actual dips when they occur."
        },
        {
          id: 'fomo2-q3',
          question: 'What gain is needed to recover from a 50% loss?',
          options: [
            '50%',
            '75%',
            '100%',
            '150%'
          ],
          correctAnswer: 2,
          explanation: 'After a 50% loss, you need a 100% gain to recover. If you have $100 and lose 50% ($50), you need to double that $50 (100% gain) to get back to $100.'
        }
      ]
    },
    'fomo-trader-3': {
      lessonId: 'fomo-trader-3',
      lessonTitle: 'The FOMO Override System',
      questions: [
        {
          id: 'fomo3-q1',
          question: 'What is the first step in the FOMO Override Protocol?',
          options: [
            'Buy immediately',
            'Calculate position size',
            'STOP - close the app and wait 10 minutes',
            'Check social media'
          ],
          correctAnswer: 2,
          explanation: 'The first step is STOP: close the trading app, step away, set a 10-minute timer. No buying during the cool-down period.'
        },
        {
          id: 'fomo3-q2',
          question: 'Why does willpower fail in the FOMO moment?',
          options: [
            'Traders are lazy',
            'Emotional brain activates and rational brain goes offline',
            'Markets move too fast',
            'Charts are confusing'
          ],
          correctAnswer: 1,
          explanation: "In the FOMO moment, the emotional brain activates and the rational brain goes offline. That's why you need systems, not just willpower."
        },
        {
          id: 'fomo3-q3',
          question: 'What happens if you enter a trade after the FOMO protocol?',
          options: [
            'You go all in',
            'You reduce size by 50% (FOMO tax) with tighter stop',
            'You use leverage',
            'You skip setting a stop loss'
          ],
          correctAnswer: 1,
          explanation: 'Even when you enter after following the protocol, you reduce size by 50% (FOMO tax), use a tighter stop, and have a defined exit plan.'
        }
      ]
    },
    'fomo-trader-4': {
      lessonId: 'fomo-trader-4',
      lessonTitle: 'Strategic Entry After the Move',
      questions: [
        {
          id: 'fomo4-q1',
          question: 'If a token is up 200%+ in a day, what should you do?',
          options: [
            'Buy immediately before it goes higher',
            'Almost certainly too late - skip',
            'Double your usual size',
            'Use margin to get in'
          ],
          correctAnswer: 1,
          explanation: "If a token is up 200%+ in a day, it's almost certainly too late. You don't need to catch everything - wait for the next opportunity."
        },
        {
          id: 'fomo4-q2',
          question: 'What is a good entry on a pumping asset?',
          options: [
            'Green candle buying at new highs',
            'After 3+ green candles in a row',
            'First significant pullback (20-30%) or retest of breakout level',
            'When everyone is saying "buy now"'
          ],
          correctAnswer: 2,
          explanation: 'Good entries on pumping assets include first significant pullback (20-30%), retest of breakout level, consolidation after pump, or dip to rising MA.'
        },
        {
          id: 'fomo4-q3',
          question: 'How should position size be adjusted for chasing?',
          options: [
            'Double the usual size',
            'Standard position or larger',
            'Reduced size (50-75% for strategic chase, 25-50% for late chase)',
            'Size doesn\'t matter'
          ],
          correctAnswer: 2,
          explanation: 'Even valid chases deserve reduced size: 50-75% for strategic chase, 25-50% for late chase. Higher risk of reversal means smaller size = less damage if wrong.'
        }
      ]
    },
    'fomo-trader-5': {
      lessonId: 'fomo-trader-5',
      lessonTitle: 'Building a Watchlist System',
      questions: [
        {
          id: 'fomo5-q1',
          question: 'How many Tier 1 watchlist assets should you maintain maximum?',
          options: [
            '1-2',
            '3-5',
            '10-15',
            'As many as possible'
          ],
          correctAnswer: 1,
          explanation: 'Tier 1 should have 3-5 assets maximum (fully researched, ready to buy). More than this is unmanageable. Quality over quantity.'
        },
        {
          id: 'fomo5-q2',
          question: 'What is the mental shift that eliminates most FOMO?',
          options: [
            '"What should I buy right now?"',
            '"What have I prepared to buy?"',
            '"What is everyone else buying?"',
            '"What is pumping today?"'
          ],
          correctAnswer: 1,
          explanation: 'The shift from "What should I buy right now?" to "What have I prepared to buy?" eliminates most FOMO. You\'re waiting for your prices, not looking in real-time.'
        },
        {
          id: 'fomo5-q3',
          question: 'What type of alerts should you set?',
          options: [
            'Alert at current price',
            'Alert every 5% move',
            'Alerts at entry levels that signal action',
            'No alerts needed'
          ],
          correctAnswer: 2,
          explanation: 'Set alerts at entry levels, not current prices. Good alerts signal action: when X reaches your entry zone, when Y drops 20%, when Z breaks resistance.'
        }
      ]
    },
    'fomo-trader-6': {
      lessonId: 'fomo-trader-6',
      lessonTitle: 'Managing Positions After FOMO Entry',
      questions: [
        {
          id: 'fomo6-q1',
          question: 'After a FOMO entry, what should you do immediately?',
          options: [
            'Buy more to average down',
            'Set a stop loss and assess if there is a valid thesis',
            'Forget about it and hope',
            'Tell everyone about your trade'
          ],
          correctAnswer: 1,
          explanation: 'After FOMO entry, immediately assess: Is there a thesis? Set a stop loss NOW. Evaluate R:R from current price.'
        },
        {
          id: 'fomo6-q2',
          question: 'What is "Breaking Even Disease"?',
          options: [
            'A profitable trading strategy',
            'When you make exactly zero profit',
            'Holding a losing position just to sell at your entry price',
            'A physical illness'
          ],
          correctAnswer: 2,
          explanation: 'Breaking Even Disease is the deadliest FOMO aftereffect: refusing to sell until you get back to your entry price. Market doesn\'t care about your entry.'
        },
        {
          id: 'fomo6-q3',
          question: 'What is the "Would I Buy Here?" test?',
          options: [
            'Ask friends if they would buy',
            'Ignore entry price and evaluate if you would buy at current price fresh',
            'Calculate your average entry',
            'Check if the price will go up'
          ],
          correctAnswer: 1,
          explanation: 'The test is: "If I had cash and no position, would I buy this right now?" If no, why are you holding? Sunk cost is irrelevant to what happens next.'
        }
      ]
    },
    'fomo-trader-7': {
      lessonId: 'fomo-trader-7',
      lessonTitle: 'The Psychology of Missing Out',
      questions: [
        {
          id: 'fomo7-q1',
          question: 'What percentage of major moves do even the best traders catch?',
          options: [
            '100%',
            '70-80%',
            '20-30%',
            '5%'
          ],
          correctAnswer: 2,
          explanation: 'The best traders catch only 20-30% of major moves and miss 70-80% of them. They make money on the ones they catch and don\'t agonize over misses.'
        },
        {
          id: 'fomo7-q2',
          question: 'Why is "I didn\'t miss it - I wasn\'t positioned for it" a valid reframe?',
          options: [
            'It\'s a way to avoid responsibility',
            'A missed opportunity isn\'t a mistake unless you had a plan and didn\'t execute',
            'It makes you feel better',
            'It\'s not actually valid'
          ],
          correctAnswer: 1,
          explanation: "A missed opportunity isn't a mistake unless you had a plan and didn't execute. If something pumped that you never researched and wasn't on your watchlist, you can't miss what was never yours."
        },
        {
          id: 'fomo7-q3',
          question: 'What is survivorship bias in the context of FOMO?',
          options: [
            'Only survivors can trade',
            'You only see the winners that pumped, not the losers that dumped',
            'Surviving traders have FOMO immunity',
            'A trading strategy'
          ],
          correctAnswer: 1,
          explanation: 'Survivorship bias means you only see the winners that pumped. For every Token X up 500%, there are 10 tokens that dumped 80% that you don\'t see.'
        }
      ]
    },
    'fomo-trader-8': {
      lessonId: 'fomo-trader-8',
      lessonTitle: 'Your FOMO-Resistant Trading System',
      questions: [
        {
          id: 'fomo8-q1',
          question: 'What are the five pillars of the FOMO-resistant system?',
          options: [
            'Buy, sell, hold, profit, repeat',
            'Preparation, Rules, Interrupts, Execution, Review',
            'Research, Trade, Exit, Wait, Retry',
            'None of these'
          ],
          correctAnswer: 1,
          explanation: 'The five pillars are: Preparation (research/watchlists), Rules (clear entry criteria), Interrupts (FOMO override protocol), Execution (systematic process), Review (learning/improvement).'
        },
        {
          id: 'fomo8-q2',
          question: 'Which is NOT a valid entry rule in the FOMO-resistant system?',
          options: [
            'Asset is on your watchlist',
            'Price is at your pre-defined level',
            'Currently pumping with green candles',
            'Checklist is complete'
          ],
          correctAnswer: 2,
          explanation: 'Rule 4 is "No green candle buying" - wait for pullback or consolidation, never buy something currently pumping. Patience is required.'
        },
        {
          id: 'fomo8-q3',
          question: "What's the target protocol adherence percentage?",
          options: [
            '50%+',
            '60%+',
            '80%+',
            '100%'
          ],
          correctAnswer: 2,
          explanation: 'Target protocol adherence is 80%+. The goal isn\'t perfection but consistent improvement. Track how many FOMO moments resulted in following the protocol.'
        }
      ]
    }
  },

  // Final module test (15 questions)
  finalTest: {
    title: 'FOMO Trader Final Assessment',
    description: 'Test your mastery of FOMO management and disciplined trading',
    passingScore: 80,
    questions: [
      {
        id: 'fomo-final-1',
        question: 'What is the core problem with acting on FOMO?',
        options: [
          'You always lose money',
          'Acting on FOMO usually causes you to miss out more',
          "It's illegal",
          'Other traders will judge you'
        ],
        correctAnswer: 1,
        explanation: 'The FOMO paradox is that acting on FOMO usually causes you to miss out MORE - chasing tops, panic selling dips, missing the real move.'
      },
      {
        id: 'fomo-final-2',
        question: 'The goal is to eliminate FOMO feelings completely.',
        options: [
          'True',
          'False'
        ],
        correctAnswer: 1,
        explanation: 'False. The goal is to manage your response to FOMO, not eliminate the feeling. You\'ll still feel it, but you won\'t be controlled by it.'
      },
      {
        id: 'fomo-final-3',
        question: 'What gain is needed to recover from a -50% loss?',
        options: [
          '50%',
          '75%',
          '100%',
          '150%'
        ],
        correctAnswer: 2,
        explanation: 'After a 50% loss, you need a 100% gain to recover. $100 → $50 (50% loss) needs to double to $100 (100% gain).'
      },
      {
        id: 'fomo-final-4',
        question: "What's the first step in the FOMO Override Protocol?",
        options: [
          'Buy immediately',
          'Calculate position size',
          'Stop - close the app and wait 10 minutes',
          'Text a friend'
        ],
        correctAnswer: 2,
        explanation: 'Step 1 is STOP: Close the trading app, step away from computer, set a 10-minute timer. No buying during cool-down.'
      },
      {
        id: 'fomo-final-5',
        question: 'When is chasing potentially valid?',
        options: [
          'Whenever you feel like it',
          'When something is up 500% today',
          'When it\'s a new narrative emergence on day 1-2 with valid thesis',
          'When everyone on Twitter is talking about it'
        ],
        correctAnswer: 2,
        explanation: 'Chasing can be valid on day 1-2 of a new narrative with a valid thesis, breakout confirmation with volume, or real news/catalyst.'
      },
      {
        id: 'fomo-final-6',
        question: "If a token is already up 200%+ in a day, it's almost certainly too late to enter.",
        options: [
          'True',
          'False'
        ],
        correctAnswer: 0,
        explanation: 'True. At 200%+ daily gain, you\'re almost certainly too late. Better to skip and find the next opportunity.'
      },
      {
        id: 'fomo-final-7',
        question: 'How many Tier 1 watchlist assets should you maintain maximum?',
        options: [
          '1-2',
          '3-5',
          '10-15',
          'As many as possible'
        ],
        correctAnswer: 1,
        explanation: 'Tier 1 should have 3-5 assets maximum. More is unmanageable. Quality over quantity.'
      },
      {
        id: 'fomo-final-8',
        question: 'After a FOMO entry, what should you do immediately?',
        options: [
          'Buy more to average down',
          'Set a stop loss and assess the thesis',
          'Forget about it',
          'Tell everyone about your trade'
        ],
        correctAnswer: 1,
        explanation: 'After FOMO entry, immediately set a stop loss and assess if there is a valid thesis. Evaluate R:R from current position.'
      },
      {
        id: 'fomo-final-9',
        question: 'What is "Breaking Even Disease"?',
        options: [
          'A physical illness',
          'Holding a losing position just to sell at your entry price',
          'A profitable trading strategy',
          'When you make zero profit'
        ],
        correctAnswer: 1,
        explanation: 'Breaking Even Disease is refusing to sell until you get back to your entry price. Market doesn\'t care about your entry - evaluate current R:R.'
      },
      {
        id: 'fomo-final-10',
        question: 'What percentage of major moves do even the best traders catch?',
        options: [
          '100%',
          '70-80%',
          '20-30%',
          '5%'
        ],
        correctAnswer: 2,
        explanation: 'The best traders catch only 20-30% of major moves. They make money on the ones they catch and don\'t agonize over misses.'
      },
      {
        id: 'fomo-final-11',
        question: 'Which is NOT a valid entry rule in the FOMO-resistant system?',
        options: [
          'Asset is on your watchlist',
          'Price is at your pre-defined level',
          'Currently pumping with green candles',
          'Checklist is complete'
        ],
        correctAnswer: 2,
        explanation: '"No green candle buying" is a key rule. Wait for pullback or consolidation. Never buy something currently pumping.'
      },
      {
        id: 'fomo-final-12',
        question: 'When feeling strong FOMO, you should reduce your position size by 50% even if you decide to enter.',
        options: [
          'True',
          'False'
        ],
        correctAnswer: 0,
        explanation: 'True. Even after following the protocol, if you felt strong FOMO, reduce size by 50% (FOMO tax).'
      },
      {
        id: 'fomo-final-13',
        question: 'What\'s the purpose of the "Would I Buy Here?" test?',
        options: [
          'Ask friends for opinions',
          'Ignore your entry price and evaluate current R:R',
          'Calculate your average entry',
          'Predict future prices'
        ],
        correctAnswer: 1,
        explanation: 'The test ignores your entry price (sunk cost) and evaluates: would I buy fresh at current price? If no, why are you holding?'
      },
      {
        id: 'fomo-final-14',
        question: 'Which of these is a healthy reframe for missed opportunities?',
        options: [
          '"I didn\'t miss it - I wasn\'t positioned for it"',
          '"There will always be another opportunity"',
          '"I\'m a terrible trader"',
          'Both A and B'
        ],
        correctAnswer: 3,
        explanation: 'Both "I wasn\'t positioned for it" and "There will always be another" are healthy reframes. Capital preserved is capital available.'
      },
      {
        id: 'fomo-final-15',
        question: "What's the target protocol adherence percentage?",
        options: [
          '50%+',
          '60%+',
          '80%+',
          '100%'
        ],
        correctAnswer: 2,
        explanation: 'Target is 80%+ protocol adherence. Track how many FOMO moments resulted in following the protocol.'
      }
    ]
  }
}
