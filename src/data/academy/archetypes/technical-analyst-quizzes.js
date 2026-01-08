// Technical Analyst Archetype Quizzes
// Quiz questions for each lesson and final assessment

export const technicalAnalystQuizzes = {
  moduleId: 'technical-analyst',

  // Quizzes for each lesson (3 questions each)
  lessonQuizzes: {
    'technical-analyst-1': {
      lessonId: 'technical-analyst-1',
      lessonTitle: 'The Technical Analysis Edge',
      questions: [
        {
          id: 'ta1-q1',
          question: 'Why does technical analysis work according to the module?',
          options: [
            'Because charts predict the future',
            'Because history rhymes and human emotions create repeating patterns',
            'Because algorithms control all markets',
            'Because all markets move randomly'
          ],
          correctAnswer: 1,
          explanation: 'Technical analysis works because markets are driven by humans with predictable emotional patterns. Fear, greed, hope, and panic create patterns that repeat because human nature doesn\'t change.'
        },
        {
          id: 'ta1-q2',
          question: 'What is different about technical analysis in crypto vs traditional markets?',
          options: [
            'Support and resistance don\'t work in crypto',
            'Crypto has lower volatility',
            'Crypto has higher volatility, faster cycles, and more retail-driven emotional extremes',
            'Traditional markets are 24/7 like crypto'
          ],
          correctAnswer: 2,
          explanation: 'Crypto has higher volatility (messier patterns), 24/7 markets, lower liquidity, faster cycles, and more retail-driven emotional extremes compared to traditional markets.'
        },
        {
          id: 'ta1-q3',
          question: 'What is a potential weakness of technical analysts?',
          options: [
            'Making decisions based on data',
            'Defining clear entry and exit levels',
            'Seeing patterns that aren\'t there and over-complicating with too many indicators',
            'Managing risk with precision'
          ],
          correctAnswer: 2,
          explanation: 'Technical analysis can hurt you when you see patterns that aren\'t there, over-complicate with too many indicators, ignore fundamentals, or become rigid when markets change.'
        }
      ]
    },
    'technical-analyst-2': {
      lessonId: 'technical-analyst-2',
      lessonTitle: 'Support, Resistance, and Market Structure',
      questions: [
        {
          id: 'ta2-q1',
          question: 'What happens when support breaks according to the Role Reversal Principle?',
          options: [
            'It disappears',
            'It becomes stronger support',
            'It becomes resistance',
            'It creates a new pattern'
          ],
          correctAnswer: 2,
          explanation: 'When support breaks, it becomes resistance. When resistance breaks, it becomes support. This is one of the most reliable patterns in trading.'
        },
        {
          id: 'ta2-q2',
          question: 'What defines an uptrend in market structure?',
          options: [
            'Lower highs and lower lows',
            'Higher highs and higher lows',
            'Equal highs and equal lows',
            'Random price movement'
          ],
          correctAnswer: 1,
          explanation: 'An uptrend is defined by higher highs (HH) and higher lows (HL) - each peak higher than the last and each dip higher than the last.'
        },
        {
          id: 'ta2-q3',
          question: 'Which type of support/resistance level is considered strong?',
          options: [
            'Tested only once with low volume',
            'Random prices with no significance',
            'Tested multiple times with high volume and clear reactions',
            'Minor price reactions at obscure levels'
          ],
          correctAnswer: 2,
          explanation: 'Strong levels are tested multiple times, have high volume at the level, show clear obvious reactions, and often occur at round numbers or previous all-time highs/lows.'
        }
      ]
    },
    'technical-analyst-3': {
      lessonId: 'technical-analyst-3',
      lessonTitle: 'Chart Patterns That Work in Crypto',
      questions: [
        {
          id: 'ta3-q1',
          question: 'Which chart patterns work well in crypto?',
          options: [
            'Complex harmonic patterns like Gartley and Butterfly',
            'Breakout from consolidation, higher low continuation, and double bottoms/tops',
            'Elliott Wave counts',
            'All candlestick patterns on 5-minute charts'
          ],
          correctAnswer: 1,
          explanation: 'Patterns that work in crypto include breakout from consolidation, higher low/lower high continuation, double bottom/top, falling/rising wedges, and liquidity grabs/fakeouts.'
        },
        {
          id: 'ta3-q2',
          question: 'What confirms a valid breakout?',
          options: [
            'Low volume on the breakout',
            'Increased volume on the breakout',
            'No volume data needed',
            'Price moving slightly above resistance'
          ],
          correctAnswer: 1,
          explanation: 'Valid breakouts have increased volume. Low volume breakouts are suspect. Volume declining during pattern formation followed by volume spike on breakout is ideal.'
        },
        {
          id: 'ta3-q3',
          question: 'What should you do when a pattern fails?',
          options: [
            'Average down hoping it works',
            'Exit at your stop with no exceptions',
            'Wait for the pattern to complete eventually',
            'Ignore the stop loss'
          ],
          correctAnswer: 1,
          explanation: 'When a pattern fails, exit at your stop with no exceptions. Don\'t average down. Pattern failure can actually be a signal itself (fakeout trade opportunity).'
        }
      ]
    },
    'technical-analyst-4': {
      lessonId: 'technical-analyst-4',
      lessonTitle: 'Indicators That Actually Help',
      questions: [
        {
          id: 'ta4-q1',
          question: 'What is the main problem with most indicators?',
          options: [
            'They are too colorful',
            'They are lagging, redundant, and encourage over-optimization',
            'They are too simple',
            'They only work on daily charts'
          ],
          correctAnswer: 1,
          explanation: 'Most indicators fail because they\'re lagging (tell you what already happened), redundant (all measuring same thing differently), give false signals in ranging markets, and encourage over-optimization.'
        },
        {
          id: 'ta4-q2',
          question: 'What is the recommended maximum number of indicators to use?',
          options: [
            '1 indicator only',
            '2-3 indicators',
            '5-7 indicators',
            '10+ indicators for accuracy'
          ],
          correctAnswer: 1,
          explanation: 'The minimalist indicator setup recommends 2-3 indicators maximum: 20 and 50 EMAs for trend, Volume for confirmation, and RSI for divergence only.'
        },
        {
          id: 'ta4-q3',
          question: 'How should RSI be used properly?',
          options: [
            'Buy whenever RSI is below 30',
            'Sell whenever RSI is above 70',
            'Look for divergence between price and RSI',
            'Ignore RSI completely'
          ],
          correctAnswer: 2,
          explanation: 'RSI should be used primarily for divergence: when price makes new high but RSI makes lower high (bearish), or price makes new low but RSI makes higher low (bullish). Don\'t buy/sell just because RSI is overbought/oversold.'
        }
      ]
    },
    'technical-analyst-5': {
      lessonId: 'technical-analyst-5',
      lessonTitle: 'Building Your Technical Trading System',
      questions: [
        {
          id: 'ta5-q1',
          question: 'What must a trading system answer?',
          options: [
            'Only what markets to trade',
            'What to trade, how to find setups, entry/stop/target levels, and position sizing',
            'Only where to take profit',
            'Only how much to risk'
          ],
          correctAnswer: 1,
          explanation: 'A trading system must answer: What markets do I trade? How do I find setups? What confirms a valid setup? Where do I enter? Where do I place my stop? Where do I take profit? How much do I risk?'
        },
        {
          id: 'ta5-q2',
          question: 'What is the correct formula for position sizing?',
          options: [
            'Account × Risk %',
            'Stop Distance × Risk %',
            '(Account × Risk %) / Stop Distance',
            'Account / Stop Distance'
          ],
          correctAnswer: 2,
          explanation: 'Position Size = (Account × Risk %) / Stop Distance. Example: $10,000 account with 1% risk ($100) and 5% stop distance = $100 / 0.05 = $2,000 position.'
        },
        {
          id: 'ta5-q3',
          question: 'How many trades should you wait before judging a system change?',
          options: [
            '2-3 trades',
            '5-10 trades',
            '20+ trades',
            '100+ trades'
          ],
          correctAnswer: 2,
          explanation: 'When making adjustments to your system, give it 20+ trades to evaluate. Don\'t over-optimize based on recent results or a few trades.'
        }
      ]
    },
    'technical-analyst-6': {
      lessonId: 'technical-analyst-6',
      lessonTitle: 'Risk Management Through Technicals',
      questions: [
        {
          id: 'ta6-q1',
          question: 'Which stop placement strategy uses Average True Range?',
          options: [
            'Structure-based stops',
            'ATR-based stops',
            'Moving average stops',
            'Time stops'
          ],
          correctAnswer: 1,
          explanation: 'ATR-based stops use Average True Range (typically 14-period) to set stops based on volatility, usually at 1.5-2x ATR from entry. This accounts for normal volatility and avoids getting stopped on noise.'
        },
        {
          id: 'ta6-q2',
          question: 'What is the R-Multiple framework used for?',
          options: [
            'Calculating position size',
            'Standardizing performance across different position sizes',
            'Finding support levels',
            'Identifying chart patterns'
          ],
          correctAnswer: 1,
          explanation: 'The R-Multiple framework standardizes performance by measuring wins and losses in terms of R (your initial risk). This allows comparing trades across different position sizes. Goal: average winners should be 2R+ while keeping losers at 1R or less.'
        },
        {
          id: 'ta6-q3',
          question: 'What is a warning sign of potential reversal?',
          options: [
            'Price making new highs with RSI confirmation',
            'Strong volume on breakout',
            'Price making new high but RSI making lower high (divergence)',
            'Trend continuing as expected'
          ],
          correctAnswer: 2,
          explanation: 'Divergence (price makes new high while RSI makes lower high) is a warning sign of weakness and potential reversal. Other warning signs include volume divergence and failed breakouts.'
        }
      ]
    },
    'technical-analyst-7': {
      lessonId: 'technical-analyst-7',
      lessonTitle: 'Combining Technical and Fundamental Analysis',
      questions: [
        {
          id: 'ta7-q1',
          question: 'What do fundamentals tell you vs what do technicals tell you?',
          options: [
            'Fundamentals tell you WHEN, technicals tell you WHAT',
            'Fundamentals tell you WHAT to trade, technicals tell you WHEN to trade',
            'Both tell you the same thing',
            'Neither is useful alone'
          ],
          correctAnswer: 1,
          explanation: 'Fundamentals/Narrative tell you WHAT to trade (is this asset worth trading, upside potential, the story). Technicals tell you WHEN to trade (optimal entry, stop loss, timing).'
        },
        {
          id: 'ta7-q2',
          question: 'What is confluence in trading?',
          options: [
            'When price moves up',
            'Multiple factors aligning for a trade',
            'A type of chart pattern',
            'A specific indicator'
          ],
          correctAnswer: 1,
          explanation: 'Confluence means multiple factors aligning - strong narrative (fundamental), smart money accumulating (on-chain), price at key support (technical), RSI oversold with divergence (indicator). High confluence = high probability trade.'
        },
        {
          id: 'ta7-q3',
          question: 'When should you override bearish technicals?',
          options: [
            'Never',
            'When you feel bullish',
            'When massive positive fundamental news breaks',
            'When the indicator says so'
          ],
          correctAnswer: 2,
          explanation: 'Override bearish technicals when massive positive fundamental news breaks, when structure break might be manipulation before news, or when long-term fundamental thesis unchanged. Fundamentals can change instantly.'
        }
      ]
    },
    'technical-analyst-8': {
      lessonId: 'technical-analyst-8',
      lessonTitle: 'Evolving Your Technical Analysis',
      questions: [
        {
          id: 'ta8-q1',
          question: 'What is the expectancy formula?',
          options: [
            'Win Rate + Loss Rate',
            '(Win Rate × Avg Win) - (Loss Rate × Avg Loss)',
            'Total Wins / Total Losses',
            'Average Win / Average Loss'
          ],
          correctAnswer: 1,
          explanation: 'Expectancy = (Win Rate × Avg Win) - (Loss Rate × Avg Loss). Example: 45% win rate with 2.5R average win and 1R average loss = (0.45 × 2.5) - (0.55 × 1) = 0.575R expected per trade.'
        },
        {
          id: 'ta8-q2',
          question: 'What is a sign of over-optimization?',
          options: [
            'System is simple',
            'System works on backtest but fails live',
            'System has been tested over 100+ trades',
            'System follows basic principles'
          ],
          correctAnswer: 1,
          explanation: 'Signs of over-optimization include: system has too many conditions, works on backtest but fails live, constantly adjusting after losses, and "this time is different" thinking.'
        },
        {
          id: 'ta8-q3',
          question: 'When should you make adjustments to your trading system?',
          options: [
            'After every losing trade',
            'After 20+ trades show consistent pattern',
            'Never',
            'When you feel like it'
          ],
          correctAnswer: 1,
          explanation: 'Adjust when 20+ trades show consistent pattern, market conditions clearly changed, or you have new insight about what works. Do NOT adjust after a few losing trades, based on one anecdote, or without data to support change.'
        }
      ]
    }
  },

  // Final module test (15 questions)
  finalTest: {
    title: 'Technical Analyst Final Assessment',
    description: 'Test your mastery of technical analysis principles and systematic trading',
    passingScore: 80,
    questions: [
      {
        id: 'ta-final-1',
        question: 'What is the foundation of all technical analysis?',
        options: [
          'Complex indicators',
          'Support, resistance, and market structure',
          'News analysis',
          'Social media sentiment'
        ],
        correctAnswer: 1,
        explanation: 'Support, resistance, and market structure are the foundation everything else builds on. You can trade profitably with ONLY these basics.'
      },
      {
        id: 'ta-final-2',
        question: 'When support breaks, it often becomes resistance.',
        options: [
          'True',
          'False'
        ],
        correctAnswer: 0,
        explanation: 'This is the Role Reversal Principle - one of the most reliable patterns in trading. When support breaks it becomes resistance, and vice versa.'
      },
      {
        id: 'ta-final-3',
        question: 'What defines an uptrend in market structure?',
        options: [
          'Lower highs and lower lows',
          'Higher highs and higher lows',
          'Equal highs and equal lows',
          'Random price movement'
        ],
        correctAnswer: 1,
        explanation: 'An uptrend is defined by higher highs (HH) and higher lows (HL) - each peak and dip higher than the previous one.'
      },
      {
        id: 'ta-final-4',
        question: 'Which chart patterns work best in crypto?',
        options: [
          'Breakout from consolidation',
          'Higher low continuation',
          'Complex harmonic patterns',
          'Both A and B'
        ],
        correctAnswer: 3,
        explanation: 'Breakout from consolidation, higher low/lower high continuation, double bottoms/tops, and wedges work well. Complex harmonic patterns are too precise for crypto\'s volatility.'
      },
      {
        id: 'ta-final-5',
        question: 'Most indicators tell you what already happened rather than what will happen.',
        options: [
          'True',
          'False'
        ],
        correctAnswer: 0,
        explanation: 'This is why most indicators fail - they\'re lagging. They tell you what already happened, not what will happen.'
      },
      {
        id: 'ta-final-6',
        question: 'What\'s the recommended maximum number of indicators to use?',
        options: [
          '1',
          '2-3',
          '5-7',
          '10+'
        ],
        correctAnswer: 1,
        explanation: 'The minimalist setup recommends 2-3 indicators: moving averages for trend, volume for confirmation, and RSI for divergence only.'
      },
      {
        id: 'ta-final-7',
        question: 'What does RSI divergence indicate?',
        options: [
          'Price will definitely reverse',
          'Momentum is weakening, potential reversal',
          'You should buy immediately',
          'Volume is increasing'
        ],
        correctAnswer: 1,
        explanation: 'RSI divergence (price makes new high but RSI doesn\'t) indicates momentum is weakening and there\'s potential for reversal - but it\'s a warning, not a guarantee.'
      },
      {
        id: 'ta-final-8',
        question: 'What is the correct formula for position sizing?',
        options: [
          'Account × Risk %',
          'Stop Distance × Risk %',
          '(Account × Risk %) / Stop Distance',
          'Account / Stop Distance'
        ],
        correctAnswer: 2,
        explanation: 'Position Size = (Account × Risk %) / Stop Distance. This ensures your dollar risk stays constant regardless of stop distance.'
      },
      {
        id: 'ta-final-9',
        question: 'Which stop placement strategy accounts for an asset\'s normal volatility?',
        options: [
          'Structure-based stops',
          'ATR-based stops',
          'Moving average stops',
          'Time stops'
        ],
        correctAnswer: 1,
        explanation: 'ATR-based stops use Average True Range to account for normal volatility, setting stops at 1.5-2x ATR to avoid getting stopped on noise.'
      },
      {
        id: 'ta-final-10',
        question: 'What tells you WHAT to trade vs WHEN to trade?',
        options: [
          'Indicators / Chart patterns',
          'Fundamentals / Technicals',
          'News / Social media',
          'Volume / Price'
        ],
        correctAnswer: 1,
        explanation: 'Fundamentals tell you WHAT to trade (is this asset worth trading). Technicals tell you WHEN to trade (optimal entry and timing).'
      },
      {
        id: 'ta-final-11',
        question: 'You should override bearish technicals when massive positive fundamental news breaks.',
        options: [
          'True',
          'False'
        ],
        correctAnswer: 0,
        explanation: 'Fundamentals can change instantly and override technical signals. Massive positive news can invalidate bearish technical setups.'
      },
      {
        id: 'ta-final-12',
        question: 'What is "confluence" in trading?',
        options: [
          'When price moves up',
          'Multiple factors aligning for a trade',
          'A type of chart pattern',
          'A specific indicator'
        ],
        correctAnswer: 1,
        explanation: 'Confluence means multiple factors aligning - fundamental, on-chain, technical, and sentiment all pointing to the same trade. High confluence = high probability.'
      },
      {
        id: 'ta-final-13',
        question: 'What\'s the expectancy formula?',
        options: [
          'Win Rate + Loss Rate',
          '(Win Rate × Avg Win) - (Loss Rate × Avg Loss)',
          'Total Wins / Total Losses',
          'Average Win / Average Loss'
        ],
        correctAnswer: 1,
        explanation: 'Expectancy = (Win Rate × Avg Win) - (Loss Rate × Avg Loss). This tells you how much you expect to make per trade on average.'
      },
      {
        id: 'ta-final-14',
        question: 'When should you make adjustments to your trading system?',
        options: [
          'After every losing trade',
          'After 20+ trades show consistent pattern',
          'Never',
          'When you feel like it'
        ],
        correctAnswer: 1,
        explanation: 'Make adjustments only after 20+ trades show a consistent pattern, market conditions clearly changed, or you have a new insight with data to support it.'
      },
      {
        id: 'ta-final-15',
        question: 'What\'s a sign of over-optimization?',
        options: [
          'System is simple',
          'System works on backtest but fails live',
          'System has been tested over 100+ trades',
          'System follows basic principles'
        ],
        correctAnswer: 1,
        explanation: 'Over-optimization means tweaking system to perfectly fit past data. Signs include: too many conditions, works on backtest but fails live, constant adjustment after losses.'
      }
    ]
  }
}
