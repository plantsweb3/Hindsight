export const lossAverseQuizzes = {
  moduleId: 'loss-averse',

  lessonQuizzes: {
    'la-1': {
      title: 'The Loss Averse Advantage',
      questions: [
        {
          id: 'la-1-q1',
          question: 'What gain is needed to recover from a 50% loss?',
          options: [
            { id: 'a', text: '50%' },
            { id: 'b', text: '75%' },
            { id: 'c', text: '100%' },
            { id: 'd', text: '200%' }
          ],
          correctAnswer: 'c',
          explanation: 'A 50% loss requires a 100% gain to break even. This asymmetry is why protecting downside matters more than maximizing upside.'
        },
        {
          id: 'la-1-q2',
          question: 'What is Warren Buffett\'s Rule #1?',
          options: [
            { id: 'a', text: 'Buy low, sell high' },
            { id: 'b', text: 'Never lose money' },
            { id: 'c', text: 'Diversify everything' },
            { id: 'd', text: 'Time the market' }
          ],
          correctAnswer: 'b',
          explanation: 'Warren Buffett\'s Rule #1 is "Never lose money" and Rule #2 is "Never forget Rule #1" - emphasizing capital preservation.'
        },
        {
          id: 'la-1-q3',
          question: 'What is a natural strength of Loss Averse traders?',
          options: [
            { id: 'a', text: 'Taking maximum risks for maximum gains' },
            { id: 'b', text: 'Surviving drawdowns that wipe out others' },
            { id: 'c', text: 'Never having losing trades' },
            { id: 'd', text: 'Finding 100x opportunities' }
          ],
          correctAnswer: 'b',
          explanation: 'Loss Averse traders naturally size positions conservatively and cut losses faster, helping them survive drawdowns that destroy others.'
        }
      ]
    },

    'la-2': {
      title: 'Position Sizing for Capital Preservation',
      questions: [
        {
          id: 'la-2-q1',
          question: 'What is the professional traders\' 1% rule?',
          options: [
            { id: 'a', text: 'Only trade 1% of the time' },
            { id: 'b', text: 'Never risk more than 1% of portfolio on a single trade' },
            { id: 'c', text: 'Expect 1% returns daily' },
            { id: 'd', text: 'Keep 1% in stablecoins' }
          ],
          correctAnswer: 'b',
          explanation: 'The 1% rule means never risking more than 1% of your portfolio on any single trade, ensuring survivability through losing streaks.'
        },
        {
          id: 'la-2-q2',
          question: 'What is the formula for position sizing based on risk?',
          options: [
            { id: 'a', text: 'Portfolio × Risk %' },
            { id: 'b', text: '(Portfolio × Risk %) ÷ Stop Loss %' },
            { id: 'c', text: 'Stop Loss % ÷ Risk %' },
            { id: 'd', text: 'Portfolio ÷ Number of trades' }
          ],
          correctAnswer: 'b',
          explanation: 'Position Size = (Portfolio × Risk %) ÷ Stop Loss %. This ensures your actual dollar risk equals your intended risk percentage.'
        },
        {
          id: 'la-2-q3',
          question: 'What is the "Sleep Test" for position sizing?',
          options: [
            { id: 'a', text: 'Only trade while well-rested' },
            { id: 'b', text: 'If this goes to zero, will you sleep fine?' },
            { id: 'c', text: 'Set alerts so you can sleep' },
            { id: 'd', text: 'Never trade at night' }
          ],
          correctAnswer: 'b',
          explanation: 'If a position going to zero would cause you to lose sleep, you\'re oversized. Reduce until you can hold without stress.'
        }
      ]
    },

    'la-3': {
      title: 'Stop Losses That Actually Work',
      questions: [
        {
          id: 'la-3-q1',
          question: 'Is it okay to move your stop loss further away if price is approaching it?',
          options: [
            { id: 'a', text: 'Yes, to give it more room' },
            { id: 'b', text: 'Yes, if you\'re still bullish' },
            { id: 'c', text: 'No, never move stops further away' },
            { id: 'd', text: 'Only on weekends' }
          ],
          correctAnswer: 'c',
          explanation: 'Never move stops further away. This is how small losses become catastrophic losses. You can tighten stops but never widen them.'
        },
        {
          id: 'la-3-q2',
          question: 'What is the 2x ATR rule for stop losses?',
          options: [
            { id: 'a', text: 'Set stops at 2x your entry price' },
            { id: 'b', text: 'Set stops at 2x the asset\'s average daily movement' },
            { id: 'c', text: 'Wait 2 days before setting stops' },
            { id: 'd', text: 'Use 2 different stop losses' }
          ],
          correctAnswer: 'b',
          explanation: 'Set stop at 2x the Average True Range (ATR) - this gives room for normal volatility without getting stopped on regular price swings.'
        },
        {
          id: 'la-3-q3',
          question: 'What is the problem with mental stops?',
          options: [
            { id: 'a', text: 'They cost too much' },
            { id: 'b', text: 'You\'ll move them or miss them when emotions take over' },
            { id: 'c', text: 'They\'re too tight' },
            { id: 'd', text: 'They don\'t work on DEXes' }
          ],
          correctAnswer: 'b',
          explanation: 'Mental stops fail because emotion overrides logic in the moment - you\'ll move them when price approaches or be away when they should trigger.'
        }
      ]
    },

    'la-4': {
      title: 'Risk/Reward Analysis',
      questions: [
        {
          id: 'la-4-q1',
          question: 'What is the minimum R:R ratio you should require for trades?',
          options: [
            { id: 'a', text: '1:0.5' },
            { id: 'b', text: '1:1' },
            { id: 'c', text: '1:2' },
            { id: 'd', text: '1:5' }
          ],
          correctAnswer: 'c',
          explanation: 'Minimum 1:2 R:R means you make 2x what you risk. This allows you to be wrong more than half the time and still profit.'
        },
        {
          id: 'la-4-q2',
          question: 'With a 1:3 R:R ratio, what percentage of the time can you be wrong and still profit?',
          options: [
            { id: 'a', text: '25%' },
            { id: 'b', text: '50%' },
            { id: 'c', text: '60%+' },
            { id: 'd', text: '75%' }
          ],
          correctAnswer: 'c',
          explanation: 'With 1:3 R:R, you can be wrong over 60% of the time and still profit because winners make 3x what losers cost.'
        },
        {
          id: 'la-4-q3',
          question: 'Why does R:R matter more than win rate?',
          options: [
            { id: 'a', text: 'It doesn\'t - win rate is more important' },
            { id: 'b', text: 'Because you can be wrong often and still profit with good R:R' },
            { id: 'c', text: 'Because R:R is easier to calculate' },
            { id: 'd', text: 'Because professionals only use R:R' }
          ],
          correctAnswer: 'b',
          explanation: 'Good R:R allows you to profit even with low win rates. 40% win rate at 1:3 R:R is profitable; 60% win rate at 1:0.5 R:R is not.'
        }
      ]
    },

    'la-5': {
      title: 'Portfolio Protection Strategies',
      questions: [
        {
          id: 'la-5-q1',
          question: 'What is "portfolio heat"?',
          options: [
            { id: 'a', text: 'How much your portfolio has gained' },
            { id: 'b', text: 'Total risk across all open positions' },
            { id: 'c', text: 'The temperature of the market' },
            { id: 'd', text: 'Your emotional state while trading' }
          ],
          correctAnswer: 'b',
          explanation: 'Portfolio heat is the total risk across all open positions. If each position risks 1% and you have 5 positions, your heat is 5%.'
        },
        {
          id: 'la-5-q2',
          question: 'When should you reduce position sizes by 50% according to the drawdown plan?',
          options: [
            { id: 'a', text: '5% portfolio drawdown' },
            { id: 'b', text: '10% portfolio drawdown' },
            { id: 'c', text: '20% portfolio drawdown' },
            { id: 'd', text: '50% portfolio drawdown' }
          ],
          correctAnswer: 'c',
          explanation: 'At 20% drawdown, reduce position sizes by 50% and increase stablecoin allocation. At 30%, move to mostly stables.'
        },
        {
          id: 'la-5-q3',
          question: 'What is the minimum stablecoin allocation recommended?',
          options: [
            { id: 'a', text: '0% - always be fully invested' },
            { id: 'b', text: '5%' },
            { id: 'c', text: '10-20%' },
            { id: 'd', text: '50%' }
          ],
          correctAnswer: 'c',
          explanation: 'Keep minimum 10-20% in stablecoins for protection, dry powder, and psychological safety. More in uncertain times.'
        }
      ]
    },

    'la-6': {
      title: 'When Caution Becomes a Problem',
      questions: [
        {
          id: 'la-6-q1',
          question: 'What\'s a sign that your caution has become excessive?',
          options: [
            { id: 'a', text: 'Using stop losses' },
            { id: 'b', text: 'Analysis paralysis - researching but never trading' },
            { id: 'c', text: 'Calculating R:R before trades' },
            { id: 'd', text: 'Keeping some stablecoins' }
          ],
          correctAnswer: 'b',
          explanation: 'Analysis paralysis - endless research without acting - is a sign fear is overriding your process and costing you opportunities.'
        },
        {
          id: 'la-6-q2',
          question: 'What percentage confidence is enough to take a trade with proper risk management?',
          options: [
            { id: 'a', text: '50%' },
            { id: 'b', text: '70%' },
            { id: 'c', text: '90%' },
            { id: 'd', text: '100%' }
          ],
          correctAnswer: 'b',
          explanation: '70% confidence is enough with proper risk management. Position sizing handles the 30% uncertainty. Waiting for 100% means never trading.'
        },
        {
          id: 'la-6-q3',
          question: 'How do you differentiate between "fear" and "process" when hesitating on a trade?',
          options: [
            { id: 'a', text: 'Fear is always wrong, process is always right' },
            { id: 'b', text: 'Fear is emotional ("what if it dumps"), process is logical ("doesn\'t meet criteria")' },
            { id: 'c', text: 'They\'re the same thing' },
            { id: 'd', text: 'Ask a friend' }
          ],
          correctAnswer: 'b',
          explanation: 'Fear is emotional ("what if it fails?"), process is logical ("R:R isn\'t favorable"). Only skip trades for process reasons, not fear.'
        }
      ]
    },

    'la-7': {
      title: 'The Loss Averse Trading System',
      questions: [
        {
          id: 'la-7-q1',
          question: 'What should happen when your stop loss is hit?',
          options: [
            { id: 'a', text: 'Move it further and wait' },
            { id: 'b', text: 'Exit immediately, no exceptions' },
            { id: 'c', text: 'Buy more to average down' },
            { id: 'd', text: 'Wait to see if it recovers' }
          ],
          correctAnswer: 'b',
          explanation: 'When stop loss is hit, exit immediately with no exceptions. Don\'t move the stop, don\'t buy more, don\'t wait and hope.'
        },
        {
          id: 'la-7-q2',
          question: 'What\'s the maximum portfolio heat recommended?',
          options: [
            { id: 'a', text: '5%' },
            { id: 'b', text: '10%' },
            { id: 'c', text: '25%' },
            { id: 'd', text: '50%' }
          ],
          correctAnswer: 'b',
          explanation: 'Maximum portfolio heat should be 10%. If you have 10 positions at 1% risk each, don\'t add more until some close.'
        },
        {
          id: 'la-7-q3',
          question: 'Which of these belongs in a pre-trade checklist?',
          options: [
            { id: 'a', text: 'Written thesis' },
            { id: 'b', text: 'Stop loss calculated' },
            { id: 'c', text: 'R:R minimum 1:2' },
            { id: 'd', text: 'All of the above' }
          ],
          correctAnswer: 'd',
          explanation: 'All of these belong in a pre-trade checklist: written thesis, stop loss calculated, R:R minimum 1:2, plus position size and portfolio heat checks.'
        }
      ]
    },

    'la-8': {
      title: 'Long-Term Success as a Loss Averse Trader',
      questions: [
        {
          id: 'la-8-q1',
          question: 'What\'s the long-term advantage of loss averse trading?',
          options: [
            { id: 'a', text: 'Biggest gains possible' },
            { id: 'b', text: 'Survival and compound growth over years' },
            { id: 'c', text: 'More exciting than other styles' },
            { id: 'd', text: 'Never having losing trades' }
          ],
          correctAnswer: 'b',
          explanation: 'Loss averse trading leads to survival and compound growth. Avoiding big losses allows steady compounding over years.'
        },
        {
          id: 'la-8-q2',
          question: 'How does the trading system scale as portfolio grows?',
          options: [
            { id: 'a', text: 'You need completely new rules' },
            { id: 'b', text: 'The process stays the same, only the numbers change' },
            { id: 'c', text: 'You should take more risk percentage-wise' },
            { id: 'd', text: 'You should trade less often' }
          ],
          correctAnswer: 'b',
          explanation: 'Your process doesn\'t change as portfolio grows. 1% risk stays 1% risk - only the dollar amounts change.'
        },
        {
          id: 'la-8-q3',
          question: 'What\'s the proper mindset shift for long-term success?',
          options: [
            { id: 'a', text: 'From "I need to be right" to "I need to manage risk"' },
            { id: 'b', text: 'From "slow gains" to "fast gains"' },
            { id: 'c', text: 'From "careful" to "aggressive"' },
            { id: 'd', text: 'From "protect capital" to "maximize returns"' }
          ],
          correctAnswer: 'a',
          explanation: 'Shift from "I need to be right" to "I need to manage risk" - focus on process and risk management, not being correct on every trade.'
        }
      ]
    }
  },

  finalTest: {
    title: 'Loss Averse Final Assessment',
    passingScore: 80,
    xpReward: 100,
    questions: [
      {
        id: 'la-final-1',
        question: 'What gain is needed to recover from a 50% loss?',
        options: [
          { id: 'a', text: '50%' },
          { id: 'b', text: '75%' },
          { id: 'c', text: '100%' },
          { id: 'd', text: '200%' }
        ],
        correctAnswer: 'c',
        explanation: 'A 50% loss requires a 100% gain to break even due to the asymmetry of losses.'
      },
      {
        id: 'la-final-2',
        question: 'True or False: Professional traders typically risk 10-20% of their portfolio per trade.',
        options: [
          { id: 'a', text: 'True' },
          { id: 'b', text: 'False' }
        ],
        correctAnswer: 'b',
        explanation: 'False. Professional traders use the 1% rule - never risking more than 1% of portfolio on a single trade.'
      },
      {
        id: 'la-final-3',
        question: 'What is the formula for position sizing based on risk?',
        options: [
          { id: 'a', text: 'Portfolio × Risk %' },
          { id: 'b', text: '(Portfolio × Risk %) ÷ Stop Loss %' },
          { id: 'c', text: 'Stop Loss % ÷ Risk %' },
          { id: 'd', text: 'Portfolio ÷ Number of trades' }
        ],
        correctAnswer: 'b',
        explanation: 'Position Size = (Portfolio × Risk %) ÷ Stop Loss %. This ensures your risk in dollars equals your intended percentage.'
      },
      {
        id: 'la-final-4',
        question: 'What is the minimum R:R ratio you should require for trades?',
        options: [
          { id: 'a', text: '1:0.5' },
          { id: 'b', text: '1:1' },
          { id: 'c', text: '1:2' },
          { id: 'd', text: '1:5' }
        ],
        correctAnswer: 'c',
        explanation: 'Minimum 1:2 R:R allows you to be wrong more than half the time and still profit.'
      },
      {
        id: 'la-final-5',
        question: 'True or False: It\'s okay to move your stop loss further away if price is approaching it.',
        options: [
          { id: 'a', text: 'True' },
          { id: 'b', text: 'False' }
        ],
        correctAnswer: 'b',
        explanation: 'False. Never move stops further away. This turns small losses into catastrophic ones.'
      },
      {
        id: 'la-final-6',
        question: 'What is "portfolio heat"?',
        options: [
          { id: 'a', text: 'How much your portfolio has gained' },
          { id: 'b', text: 'Total risk across all open positions' },
          { id: 'c', text: 'The temperature of the market' },
          { id: 'd', text: 'Your emotional state while trading' }
        ],
        correctAnswer: 'b',
        explanation: 'Portfolio heat is the total risk across all open positions combined.'
      },
      {
        id: 'la-final-7',
        question: 'When should you reduce position sizes by 50% according to the drawdown plan?',
        options: [
          { id: 'a', text: '5% portfolio drawdown' },
          { id: 'b', text: '10% portfolio drawdown' },
          { id: 'c', text: '20% portfolio drawdown' },
          { id: 'd', text: '50% portfolio drawdown' }
        ],
        correctAnswer: 'c',
        explanation: 'At 20% portfolio drawdown, reduce position sizes by 50% and increase stablecoin allocation.'
      },
      {
        id: 'la-final-8',
        question: 'What\'s a sign that your caution has become excessive?',
        options: [
          { id: 'a', text: 'Using stop losses' },
          { id: 'b', text: 'Analysis paralysis - researching but never trading' },
          { id: 'c', text: 'Calculating R:R before trades' },
          { id: 'd', text: 'Keeping some stablecoins' }
        ],
        correctAnswer: 'b',
        explanation: 'Analysis paralysis - endless research without acting - shows fear is overriding process.'
      },
      {
        id: 'la-final-9',
        question: 'What percentage confidence should be enough to take a trade with proper risk management?',
        options: [
          { id: 'a', text: '50%' },
          { id: 'b', text: '70%' },
          { id: 'c', text: '90%' },
          { id: 'd', text: '100%' }
        ],
        correctAnswer: 'b',
        explanation: '70% confidence is enough. Position sizing handles the uncertainty. 100% confidence never comes.'
      },
      {
        id: 'la-final-10',
        question: 'Which of these belongs in a pre-trade checklist?',
        options: [
          { id: 'a', text: 'Written thesis only' },
          { id: 'b', text: 'Stop loss calculated only' },
          { id: 'c', text: 'Written thesis, stop loss, and R:R minimum 1:2' },
          { id: 'd', text: 'Asking friends for opinions' }
        ],
        correctAnswer: 'c',
        explanation: 'All of these belong: written thesis, stop loss calculated, R:R minimum 1:2, plus position size and portfolio heat checks.'
      },
      {
        id: 'la-final-11',
        question: 'True or False: With a 1:3 R:R ratio, you can be wrong 60% of the time and still profit.',
        options: [
          { id: 'a', text: 'True' },
          { id: 'b', text: 'False' }
        ],
        correctAnswer: 'a',
        explanation: 'True. With 1:3 R:R, 4 wins at $300 ($1200) minus 6 losses at $100 ($600) = $600 profit.'
      },
      {
        id: 'la-final-12',
        question: 'What\'s the maximum position size typically recommended for any single altcoin?',
        options: [
          { id: 'a', text: '5%' },
          { id: 'b', text: '10%' },
          { id: 'c', text: '25%' },
          { id: 'd', text: '50%' }
        ],
        correctAnswer: 'b',
        explanation: 'Max position in any single asset should be 10% (except blue chips like BTC/ETH/SOL which can be larger).'
      },
      {
        id: 'la-final-13',
        question: 'What is the "Sleep Test" for position sizing?',
        options: [
          { id: 'a', text: 'Only trade while well-rested' },
          { id: 'b', text: 'If this goes to zero, will you sleep fine?' },
          { id: 'c', text: 'Set alerts so you can sleep' },
          { id: 'd', text: 'Never trade at night' }
        ],
        correctAnswer: 'b',
        explanation: 'If you can\'t sleep fine knowing a position could go to zero, you\'re oversized.'
      },
      {
        id: 'la-final-14',
        question: 'Which exit rule should be absolute with no exceptions?',
        options: [
          { id: 'a', text: 'Take profit at 2x' },
          { id: 'b', text: 'Exit when you feel scared' },
          { id: 'c', text: 'Exit when stop loss is hit' },
          { id: 'd', text: 'Exit after one week' }
        ],
        correctAnswer: 'c',
        explanation: 'Stop loss exits must be absolute - exit immediately when hit, no exceptions, no moving, no hoping.'
      },
      {
        id: 'la-final-15',
        question: 'What\'s the long-term advantage of loss averse trading?',
        options: [
          { id: 'a', text: 'Biggest gains possible' },
          { id: 'b', text: 'Survival and compound growth over years' },
          { id: 'c', text: 'More exciting than other styles' },
          { id: 'd', text: 'Never having losing trades' }
        ],
        correctAnswer: 'b',
        explanation: 'Loss averse trading leads to survival and compound growth. The careful players win the long game.'
      }
    ]
  }
}
