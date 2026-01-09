// Master Exam - 64 Questions Across All 8 Archetypes

export const MASTER_EXAM = {
  title: "Archetype Master Exam",
  description: "Prove your mastery across all trading styles. Pass sections to skip ahead on any archetype.",
  totalQuestions: 64,
  questionsPerArchetype: 8,
  passThreshold: 0.75,

  requirement: {
    type: 'module-complete',
    moduleId: 'master',
    message: 'Complete Trading 101 Master module to unlock'
  },

  sections: [
    // ==================== NARRATIVE FRONT RUNNER ====================
    {
      archetypeId: 'narrative-front-runner',
      name: 'Narrative Front Runner',
      icon: '🔮',
      questions: [
        {
          id: 'me-nfr-1',
          lessonSlug: 'what-is-narrative-trading',
          lessonTitle: 'What Is Narrative Trading?',
          question: 'What primarily drives price action in narrative trading?',
          options: [
            'Technical chart patterns',
            'Stories, themes, and collective beliefs that capture market attention',
            'Company fundamentals and earnings',
            'Random market movements'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-nfr-2',
          lessonSlug: 'finding-narratives-before-they-trend',
          lessonTitle: 'Finding Narratives Before They Trend',
          question: 'Which is the BEST early signal that a narrative is forming?',
          options: [
            'Token is already up 1000%',
            'Multiple small communities discussing the same theme independently',
            'A celebrity tweeted about it',
            'High trading volume on major exchanges'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-nfr-3',
          lessonSlug: 'evaluating-narrative-strength',
          lessonTitle: 'Evaluating Narrative Strength',
          question: 'A strong narrative typically has:',
          options: [
            'Complex technical explanations',
            'Simple, memorable hook that spreads easily',
            'Backing from venture capital only',
            'Low social media presence'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-nfr-4',
          lessonSlug: 'timing-your-entry',
          lessonTitle: 'Timing Your Entry',
          question: 'The ideal time to enter a narrative play is typically:',
          options: [
            'After it trends on Twitter/X',
            'During early accumulation before mainstream awareness',
            'At the peak of media coverage',
            'After the first major correction'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-nfr-5',
          lessonSlug: 'managing-narrative-positions',
          lessonTitle: 'Managing Narrative Positions',
          question: 'Why do narrative plays require stricter position sizing?',
          options: [
            'They always go up',
            'They are highly volatile and can collapse quickly when sentiment shifts',
            'They have guaranteed returns',
            'They are less risky than blue chips'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-nfr-6',
          lessonSlug: 'exit-strategies-for-narratives',
          lessonTitle: 'Exit Strategies for Narratives',
          question: 'The best time to start taking profits on a narrative play is:',
          options: [
            'Never, always hold',
            'When mainstream media starts covering it heavily',
            'Only when it goes to zero',
            'After losing 50%'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-nfr-7',
          lessonSlug: 'narrative-failures',
          lessonTitle: 'Narrative Failures',
          question: 'A healthy narrative portfolio approach includes:',
          options: [
            'All-in on one narrative',
            'Diversifying across multiple uncorrelated narratives with proper sizing',
            'Only buying after 10x gains',
            'Avoiding all narrative plays'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-nfr-8',
          lessonSlug: 'building-your-narrative-edge',
          lessonTitle: 'Building Your Narrative Edge',
          question: 'Narrative rotation refers to:',
          options: [
            'Spinning your screen',
            'Moving capital from fading narratives to emerging ones',
            'Never changing positions',
            'Only trading one token forever'
          ],
          correctAnswer: 1
        }
      ]
    },

    // ==================== DIAMOND HANDS ====================
    {
      archetypeId: 'diamond-hands',
      name: 'Diamond Hands',
      icon: '💎',
      questions: [
        {
          id: 'me-dh-1',
          lessonSlug: 'the-diamond-hands-philosophy',
          lessonTitle: 'The Diamond Hands Philosophy',
          question: 'True diamond hands mentality is based on:',
          options: [
            'Stubbornly holding everything no matter what',
            'High conviction backed by thorough research and clear thesis',
            'Never looking at your portfolio',
            'Ignoring all negative news'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-dh-2',
          lessonSlug: 'identifying-hold-worthy-assets',
          lessonTitle: 'Identifying Hold-Worthy Assets',
          question: 'Which factor is MOST important when selecting a long-term hold?',
          options: [
            'Current price action',
            'Strong fundamentals, active development, and sustainable tokenomics',
            'How much it pumped yesterday',
            'Number of Twitter followers'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-dh-3',
          lessonSlug: 'entry-strategies-for-long-term-holds',
          lessonTitle: 'Entry Strategies for Long-Term Holds',
          question: 'Dollar-cost averaging (DCA) helps diamond hands by:',
          options: [
            'Guaranteeing profits',
            'Reducing impact of volatility and removing emotional timing decisions',
            'Maximizing FOMO',
            'Only buying at tops'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-dh-4',
          lessonSlug: 'surviving-volatility',
          lessonTitle: 'Surviving Volatility',
          question: 'During a 60% drawdown, a true diamond hands trader should:',
          options: [
            'Panic sell everything',
            'Re-evaluate thesis - if unchanged, hold or accumulate more',
            'Leverage up to recover losses',
            'Blame market manipulation'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-dh-5',
          lessonSlug: 'when-diamond-hands-become-bag-holding',
          lessonTitle: 'When Diamond Hands Become Bag Holding',
          question: 'The key difference between conviction holding and bag holding is:',
          options: [
            'There is no difference',
            'Conviction is based on valid thesis; bag holding is denial after thesis breaks',
            'Bag holding always works out',
            'Conviction means never selling'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-dh-6',
          lessonSlug: 'taking-profits-without-regret',
          lessonTitle: 'Taking Profits Without Regret',
          question: 'Even diamond hands should take profits when:',
          options: [
            'Never, true diamond hands never sell',
            'Position becomes oversized or original thesis plays out',
            'Price goes up 1%',
            'Someone on Twitter says to'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-dh-7',
          lessonSlug: 'portfolio-construction-for-diamond-hands',
          lessonTitle: 'Portfolio Construction for Diamond Hands',
          question: 'A diamond hands portfolio should be weighted toward:',
          options: [
            '100% memecoins',
            'Higher allocation to high-conviction, researched positions',
            'Whatever is trending today',
            'Equal weight everything'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-dh-8',
          lessonSlug: 'the-diamond-hands-lifestyle',
          lessonTitle: 'The Diamond Hands Lifestyle',
          question: 'The biggest mistake diamond hands traders make is:',
          options: [
            'Taking profits too early',
            'Holding through invalidated thesis due to emotional attachment',
            'Doing too much research',
            'Position sizing too small'
          ],
          correctAnswer: 1
        }
      ]
    },

    // ==================== LOSS AVERSE ====================
    {
      archetypeId: 'loss-averse',
      name: 'Loss Averse',
      icon: '🛡️',
      questions: [
        {
          id: 'me-la-1',
          lessonSlug: 'the-loss-averse-advantage',
          lessonTitle: 'The Loss Averse Advantage',
          question: 'Loss aversion means losses feel approximately how much stronger than equivalent gains?',
          options: [
            'The same',
            '2-2.5x stronger',
            '10x stronger',
            'Losses feel weaker'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-la-2',
          lessonSlug: 'position-sizing-for-capital-preservation',
          lessonTitle: 'Position Sizing for Capital Preservation',
          question: 'A loss-averse trader should size positions based on:',
          options: [
            'How confident they feel',
            'Maximum acceptable loss that won\'t impact decision-making',
            'What others are doing',
            'Always maximum size'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-la-3',
          lessonSlug: 'stop-losses-that-actually-work',
          lessonTitle: 'Stop Losses That Actually Work',
          question: 'For loss-averse traders, stop losses should be:',
          options: [
            'Never used',
            'Set before entry and honored without exception',
            'Moved further away when losing',
            'Set after the trade goes against you'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-la-4',
          lessonSlug: 'risk-reward-analysis',
          lessonTitle: 'Risk-Reward Analysis',
          question: 'A conservative risk-per-trade for loss-averse traders is:',
          options: [
            '10-20% of portfolio',
            '0.5-1% of portfolio',
            '50% of portfolio',
            'Whatever feels right'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-la-5',
          lessonSlug: 'portfolio-protection-strategies',
          lessonTitle: 'Portfolio Protection Strategies',
          question: 'Loss-averse traders should prioritize setups with:',
          options: [
            'Maximum volatility',
            'Clear invalidation levels and defined risk',
            'No stop losses',
            'Highest potential return only'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-la-6',
          lessonSlug: 'when-caution-becomes-a-problem',
          lessonTitle: 'When Caution Becomes a Problem',
          question: 'Analysis paralysis in loss-averse traders often leads to:',
          options: [
            'Better trades',
            'Missing opportunities while waiting for "perfect" setups',
            'More profits',
            'Less stress'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-la-7',
          lessonSlug: 'the-loss-averse-trading-system',
          lessonTitle: 'The Loss Averse Trading System',
          question: 'Loss-averse traders can build confidence by:',
          options: [
            'Taking bigger risks',
            'Starting with smaller positions and scaling up with proven results',
            'Ignoring losses',
            'Only trading when certain'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-la-8',
          lessonSlug: 'long-term-success-as-a-loss-averse-trader',
          lessonTitle: 'Long-Term Success as a Loss Averse Trader',
          question: 'The ideal system for loss-averse traders emphasizes:',
          options: [
            'Maximum leverage',
            'High win rate with smaller gains over large wins with more losses',
            'All-or-nothing trades',
            'No system, just intuition'
          ],
          correctAnswer: 1
        }
      ]
    },

    // ==================== COPY TRADER ====================
    {
      archetypeId: 'copy-trader',
      name: 'Copy Trader',
      icon: '👀',
      questions: [
        {
          id: 'me-ct-1',
          lessonSlug: 'the-copy-traders-path',
          lessonTitle: 'The Copy Trader\'s Path',
          question: 'The goal of copy trading should be:',
          options: [
            'Blindly following every trade forever',
            'Learning patterns and strategies to eventually develop independence',
            'Never thinking for yourself',
            'Copying only losses'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-ct-2',
          lessonSlug: 'finding-smart-money-to-follow',
          lessonTitle: 'Finding Smart Money to Follow',
          question: 'When evaluating a wallet to copy, the MOST important metric is:',
          options: [
            'One big winning trade',
            'Consistent profitability over many trades across market conditions',
            'Number of Twitter followers',
            'How much SOL they hold'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-ct-3',
          lessonSlug: 'understanding-before-following',
          lessonTitle: 'Understanding Before Following',
          question: 'A wallet worth copying typically shows:',
          options: [
            'Random trading patterns',
            'Consistent entry/exit strategies and good risk management',
            'Only memecoins',
            'Very few trades'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-ct-4',
          lessonSlug: 'execution-without-front-running-yourself',
          lessonTitle: 'Execution Without Front-Running Yourself',
          question: 'Which tool is essential for copy trading on Solana?',
          options: [
            'Instagram',
            'On-chain wallet trackers like Birdeye, Cielo, or similar',
            'Email newsletters only',
            'Random guessing'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-ct-5',
          lessonSlug: 'holding-with-borrowed-conviction',
          lessonTitle: 'Holding with Borrowed Conviction',
          question: 'When copying a trade, you should:',
          options: [
            'Enter at any price',
            'Consider if the entry still makes sense at current price',
            'Always buy higher than they did',
            'Wait until they exit'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-ct-6',
          lessonSlug: 'developing-independent-analysis',
          lessonTitle: 'Developing Independent Analysis',
          question: 'A major risk of copy trading is:',
          options: [
            'Making too much money',
            'Followed wallet has different capital/risk tolerance than you',
            'Learning too much',
            'Getting better at trading'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-ct-7',
          lessonSlug: 'common-copy-trading-mistakes',
          lessonTitle: 'Common Copy Trading Mistakes',
          question: 'The biggest copy trading mistake is:',
          options: [
            'Following too few wallets',
            'Copying entries without understanding the thesis behind them',
            'Taking profits',
            'Using stop losses'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-ct-8',
          lessonSlug: 'the-path-to-trading-independence',
          lessonTitle: 'The Path to Trading Independence',
          question: 'To graduate from copy trading, you should:',
          options: [
            'Never stop copying',
            'Journal why copied trades worked and develop your own thesis',
            'Copy more wallets',
            'Increase position sizes'
          ],
          correctAnswer: 1
        }
      ]
    },

    // ==================== TECHNICAL ANALYST ====================
    {
      archetypeId: 'technical-analyst',
      name: 'Technical Analyst',
      icon: '📊',
      questions: [
        {
          id: 'me-ta-1',
          lessonSlug: 'the-technical-analysis-edge',
          lessonTitle: 'The Technical Analysis Edge',
          question: 'Technical analysis assumes that:',
          options: [
            'Prices are random',
            'Price action reflects all available information and history tends to repeat',
            'Fundamentals don\'t matter at all',
            'Charts predict the future perfectly'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-ta-2',
          lessonSlug: 'support-resistance-and-market-structure',
          lessonTitle: 'Support, Resistance, and Market Structure',
          question: 'A support level becomes resistance when:',
          options: [
            'Never',
            'Price breaks below it and retests from underneath',
            'Price bounces off it',
            'Volume increases'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-ta-3',
          lessonSlug: 'chart-patterns-that-work-in-crypto',
          lessonTitle: 'Chart Patterns That Work in Crypto',
          question: 'The most reliable chart patterns have:',
          options: [
            'No volume confirmation',
            'Clear structure, volume confirmation, and defined invalidation',
            'Complex interpretations',
            'No historical precedent'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-ta-4',
          lessonSlug: 'indicators-that-actually-help',
          lessonTitle: 'Indicators That Actually Help',
          question: 'Indicators are BEST used to:',
          options: [
            'Predict exact price movements',
            'Confirm price action and identify momentum/divergences',
            'Replace price analysis entirely',
            'Generate automatic trades'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-ta-5',
          lessonSlug: 'building-your-technical-trading-system',
          lessonTitle: 'Building Your Technical Trading System',
          question: 'A price breakout on low volume suggests:',
          options: [
            'Strong confirmation',
            'Potential false breakout - lack of conviction',
            'Guaranteed success',
            'Volume doesn\'t matter'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-ta-6',
          lessonSlug: 'risk-management-through-technicals',
          lessonTitle: 'Risk Management Through Technicals',
          question: 'Multiple timeframe analysis helps by:',
          options: [
            'Making things more confusing',
            'Aligning trades with higher timeframe trends for better probability',
            'Ignoring the big picture',
            'Only looking at 1-minute charts'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-ta-7',
          lessonSlug: 'combining-technical-and-fundamental-analysis',
          lessonTitle: 'Combining Technical and Fundamental Analysis',
          question: 'Technical analysis works best when:',
          options: [
            'Used in complete isolation',
            'Combined with fundamental/narrative analysis for confluence',
            'Indicators are ignored',
            'Only used on memecoins'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-ta-8',
          lessonSlug: 'evolving-your-technical-analysis',
          lessonTitle: 'Evolving Your Technical Analysis',
          question: 'The biggest limitation of TA in crypto is:',
          options: [
            'It always works perfectly',
            'Low liquidity and manipulation can invalidate patterns',
            'There are no limitations',
            'Charts are too easy to read'
          ],
          correctAnswer: 1
        }
      ]
    },

    // ==================== FOMO TRADER ====================
    {
      archetypeId: 'fomo-trader',
      name: 'FOMO Trader',
      icon: '😰',
      questions: [
        {
          id: 'me-fomo-1',
          lessonSlug: 'understanding-your-fomo',
          lessonTitle: 'Understanding Your FOMO',
          question: 'FOMO in trading is triggered by:',
          options: [
            'Careful analysis',
            'Fear of missing potential gains, often amplified by social media',
            'Following a trading plan',
            'Patient waiting'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-fomo-2',
          lessonSlug: 'the-true-cost-of-chasing',
          lessonTitle: 'The True Cost of Chasing',
          question: 'Chasing pumps typically results in:',
          options: [
            'Consistent profits',
            'Buying near tops with poor risk/reward',
            'Better entries',
            'Lower stress'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-fomo-3',
          lessonSlug: 'the-fomo-override-system',
          lessonTitle: 'The FOMO Override System',
          question: 'When feeling FOMO, the first step should be:',
          options: [
            'Buy immediately before it goes higher',
            'Pause, step away, and wait for a clear setup or pullback',
            'Double your intended position',
            'Tell everyone on Twitter'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-fomo-4',
          lessonSlug: 'strategic-entry-after-the-move',
          lessonTitle: 'Strategic Entry After the Move',
          question: 'If you missed the initial pump, a better strategy is:',
          options: [
            'Buy at any price',
            'Wait for a pullback to support or a new setup to form',
            'Give up entirely',
            'FOMO in at the top'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-fomo-5',
          lessonSlug: 'building-a-watchlist-system',
          lessonTitle: 'Building a Watchlist System',
          question: 'A good watchlist helps FOMO traders by:',
          options: [
            'Creating more FOMO',
            'Having pre-researched targets ready so you\'re not caught off guard',
            'Tracking every token',
            'Replacing all analysis'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-fomo-6',
          lessonSlug: 'managing-positions-after-fomo-entry',
          lessonTitle: 'Managing Positions After FOMO Entry',
          question: 'When you do take a FOMO trade, position size should be:',
          options: [
            'Maximum possible',
            'Smaller than normal to account for poor entry',
            'The same as planned trades',
            'All of your portfolio'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-fomo-7',
          lessonSlug: 'the-psychology-of-missing-out',
          lessonTitle: 'The Psychology of Missing Out',
          question: 'The key to converting FOMO energy into discipline is:',
          options: [
            'Suppressing all emotions',
            'Channeling urgency into preparation and watchlist building',
            'Ignoring the market',
            'Trading more frequently'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-fomo-8',
          lessonSlug: 'your-fomo-resistant-trading-system',
          lessonTitle: 'Your FOMO-Resistant Trading System',
          question: 'After a FOMO trade goes wrong, you should:',
          options: [
            'Immediately revenge trade',
            'Journal the mistake, identify the trigger, and plan prevention',
            'Quit trading',
            'Blame the market'
          ],
          correctAnswer: 1
        }
      ]
    },

    // ==================== IMPULSE TRADER ====================
    {
      archetypeId: 'impulse-trader',
      name: 'Impulse Trader',
      icon: '⚡',
      questions: [
        {
          id: 'me-imp-1',
          lessonSlug: 'the-impulse-traders-reality',
          lessonTitle: 'The Impulse Trader\'s Reality',
          question: 'Impulse trading is characterized by:',
          options: [
            'Careful planning',
            'Quick decisions often based on emotion or incomplete analysis',
            'Following a strict system',
            'Patience'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-imp-2',
          lessonSlug: 'the-cost-of-uncontrolled-impulse',
          lessonTitle: 'The Cost of Uncontrolled Impulse',
          question: 'The potential strength of impulse traders is:',
          options: [
            'They never make mistakes',
            'Quick pattern recognition and ability to act fast in volatile markets',
            'They always wait for confirmation',
            'They never trade'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-imp-3',
          lessonSlug: 'the-pause-protocol',
          lessonTitle: 'The Pause Protocol',
          question: 'The Pause Protocol requires impulse traders to:',
          options: [
            'Trade faster',
            'Wait a set amount of time (e.g., 5 minutes) before executing',
            'Never pause',
            'Only trade at night'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-imp-4',
          lessonSlug: 'quick-validation-filters',
          lessonTitle: 'Quick Validation Filters',
          question: 'A quick validation filter for impulse trades should check:',
          options: [
            'Nothing, just trade',
            'Basic criteria: liquidity, holder distribution, recent volume',
            'Only the token name',
            'Twitter follower count only'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-imp-5',
          lessonSlug: 'structured-entry-and-exit',
          lessonTitle: 'Structured Entry and Exit',
          question: 'Impulse traders benefit most from:',
          options: [
            'No rules at all',
            'Pre-defined rules that don\'t require in-the-moment decisions',
            'Making rules after the trade',
            'Copying others\' exits'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-imp-6',
          lessonSlug: 'managing-active-positions',
          lessonTitle: 'Managing Active Positions',
          question: 'Impulse traders should set stop losses:',
          options: [
            'After the trade moves against them',
            'Immediately upon entry, before emotions affect judgment',
            'Never',
            'Only on winning trades'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-imp-7',
          lessonSlug: 'breaking-the-impulse-cycle',
          lessonTitle: 'Breaking the Impulse Cycle',
          question: 'Journaling is especially important for impulse traders because:',
          options: [
            'It\'s not important',
            'It reveals patterns in what triggers impulsive behavior',
            'It makes trading slower',
            'It guarantees profits'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-imp-8',
          lessonSlug: 'your-impulse-trader-system',
          lessonTitle: 'Your Impulse Trader System',
          question: 'Effective guardrails for impulse traders include:',
          options: [
            'Unlimited trading capital accessible',
            'Daily loss limits, position size caps, and mandatory breaks after losses',
            'No limits at all',
            'Trading 24/7'
          ],
          correctAnswer: 1
        }
      ]
    },

    // ==================== SCALPER ====================
    {
      archetypeId: 'scalper',
      name: 'Scalper',
      icon: '⚔️',
      questions: [
        {
          id: 'me-sc-1',
          lessonSlug: 'the-scalpers-edge',
          lessonTitle: 'The Scalper\'s Edge',
          question: 'Scalping aims to profit from:',
          options: [
            'Long-term price appreciation',
            'Small, frequent price movements with quick entries and exits',
            'Holding for months',
            'One big trade per year'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-sc-2',
          lessonSlug: 'scalping-setups-that-work',
          lessonTitle: 'Scalping Setups That Work',
          question: 'The best scalping setups have:',
          options: [
            'Wide spreads and low volume',
            'Tight spreads, high liquidity, and clear short-term levels',
            'No clear entry points',
            'Monthly timeframes'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-sc-3',
          lessonSlug: 'execution-speed-and-precision',
          lessonTitle: 'Execution Speed and Precision',
          question: 'For scalpers, execution speed is critical because:',
          options: [
            'It doesn\'t matter',
            'Small price movements require precise entries; delays kill edge',
            'Slower is always better',
            'Only exit speed matters'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-sc-4',
          lessonSlug: 'risk-management-at-high-frequency',
          lessonTitle: 'Risk Management at High Frequency',
          question: 'Scalpers should use stop losses that are:',
          options: [
            'Very wide to avoid getting stopped out',
            'Tight and predetermined - small losses are acceptable, big losses are not',
            'Not used at all',
            'Set after the trade'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-sc-5',
          lessonSlug: 'the-mental-game-of-scalping',
          lessonTitle: 'The Mental Game of Scalping',
          question: 'The biggest psychological challenge for scalpers is:',
          options: [
            'Boredom',
            'Maintaining discipline through many small wins/losses without tilting',
            'Not enough excitement',
            'Trades lasting too long'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-sc-6',
          lessonSlug: 'tools-and-infrastructure',
          lessonTitle: 'Tools and Infrastructure',
          question: 'Essential tools for crypto scalping include:',
          options: [
            'Just a basic phone app',
            'Fast execution platform, real-time charts, and hotkeys',
            'Only Twitter',
            'Monthly reports'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-sc-7',
          lessonSlug: 'when-to-scalp-and-when-to-stop',
          lessonTitle: 'When to Scalp (And When to Stop)',
          question: 'The worst time to scalp is during:',
          options: [
            'High volume periods',
            'Low liquidity and wide spreads (like weekends or off-hours)',
            'Active trading hours',
            'Trending markets'
          ],
          correctAnswer: 1
        },
        {
          id: 'me-sc-8',
          lessonSlug: 'building-sustainable-scalping-habits',
          lessonTitle: 'Building Sustainable Scalping Habits',
          question: 'When scaling up a scalping strategy, the main constraint is:',
          options: [
            'Your screen size',
            'Liquidity - larger size can move markets and get worse fills',
            'Number of monitors',
            'Internet speed only'
          ],
          correctAnswer: 1
        }
      ]
    }
  ]
};


// ==================== HELPER FUNCTIONS ====================

// Save Master Exam results to localStorage
export function saveMasterExamResults(answers) {
  const questionResults = {};

  MASTER_EXAM.sections.forEach(section => {
    section.questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;

      questionResults[question.id] = {
        correct: isCorrect,
        lessonSlug: question.lessonSlug,
        archetypeId: section.archetypeId,
        userAnswer,
        correctAnswer: question.correctAnswer
      };
    });
  });

  // Store latest results
  localStorage.setItem('masterExamQuestionResults', JSON.stringify(questionResults));

  // Calculate section scores
  const sectionScores = {};
  MASTER_EXAM.sections.forEach(section => {
    const correctCount = section.questions.filter(q => questionResults[q.id]?.correct).length;
    sectionScores[section.archetypeId] = correctCount / section.questions.length;
  });

  // Update BEST scores (never decrease)
  const existingBestScores = JSON.parse(localStorage.getItem('masterExamBestScores') || '{}');
  const existingBestQuestions = JSON.parse(localStorage.getItem('masterExamBestQuestionResults') || '{}');

  // Update best section scores
  Object.keys(sectionScores).forEach(archetypeId => {
    if (!existingBestScores[archetypeId] || sectionScores[archetypeId] > existingBestScores[archetypeId]) {
      existingBestScores[archetypeId] = sectionScores[archetypeId];
    }
  });

  // Update best question results (correct answers stick)
  Object.entries(questionResults).forEach(([questionId, result]) => {
    if (result.correct) {
      existingBestQuestions[questionId] = result;
    } else if (!existingBestQuestions[questionId]) {
      existingBestQuestions[questionId] = result;
    }
  });

  // Save everything
  localStorage.setItem('masterExamBestScores', JSON.stringify(existingBestScores));
  localStorage.setItem('masterExamBestQuestionResults', JSON.stringify(existingBestQuestions));
  localStorage.setItem('masterExamLatestScores', JSON.stringify(sectionScores));
  localStorage.setItem('masterExamCompleted', 'true');

  // Trigger UI updates
  window.dispatchEvent(new Event('progressUpdated'));

  return { questionResults, sectionScores };
}


// Check if Master Exam is unlocked (Trading 101 Master complete)
export function isMasterExamUnlocked() {
  try {
    const data = localStorage.getItem('hindsight_academy_progress')
    if (!data) return false

    const progress = JSON.parse(data)
    const lessonScores = progress.lessonScores || {}

    // Check if master module lessons have been completed
    const masterKeys = Object.keys(lessonScores).filter(key => key.startsWith('master/'))

    // Also check placement test for master module
    const placementResults = localStorage.getItem('placementTestBestQuestionResults')
    if (placementResults) {
      const results = JSON.parse(placementResults)
      const masterResults = Object.values(results).filter(r => r.moduleId === 'master')
      if (masterResults.length > 0) {
        const passedCount = masterResults.filter(r => r.correct).length
        if (passedCount / masterResults.length >= 0.75) {
          return true
        }
      }
    }

    // Check if at least 75% of master lessons are completed with passing scores
    if (masterKeys.length >= 4) {
      const passedCount = masterKeys.filter(key => {
        const score = lessonScores[key]
        return score && score.bestScore >= 0.75
      }).length
      return passedCount >= 4
    }

    return false
  } catch {
    return false
  }
}


// Check if Master Exam has questions written
export function hasMasterExamQuestions() {
  return MASTER_EXAM.sections.every(section => section.questions.length > 0)
}


// Get total questions count
export function getMasterExamQuestionCount() {
  return MASTER_EXAM.sections.reduce((total, section) => total + section.questions.length, 0)
}


// Calculate Master Exam XP
export function calculateMasterExamXP(sectionScores) {
  const ARCHETYPE_XP = {
    // 8 lessons x 25 XP + 8 quizzes x 10 XP + completion bonus
    // = 200 + 80 + 100 = 380 XP per archetype
    'narrative-front-runner': 380,
    'diamond-hands': 380,
    'loss-averse': 380,
    'copy-trader': 380,
    'technical-analyst': 380,
    'fomo-trader': 380,
    'impulse-trader': 380,
    'scalper': 380
  };

  let xp = 0;

  Object.entries(sectionScores).forEach(([archetypeId, score]) => {
    if (score >= 0.75) {
      xp += ARCHETYPE_XP[archetypeId] || 0;
    }
  });

  return xp;
}
