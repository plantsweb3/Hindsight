export const diamondHandsQuizzes = {
  moduleId: 'diamond-hands',

  lessonQuizzes: {
    'dh-1': {
      title: 'The Diamond Hands Philosophy',
      questions: [
        {
          id: 'dh-1-q1',
          question: 'What is the main problem with overtrading?',
          options: [
            { id: 'a', text: 'You make too much money' },
            { id: 'b', text: 'Fees, slippage, and missing big moves by selling early' },
            { id: 'c', text: 'You run out of tokens to trade' },
            { id: 'd', text: 'The charts become confusing' }
          ],
          correctAnswer: 'b',
          explanation: 'Overtraders pay massive fees, suffer slippage, and often miss the biggest moves because they sell too early.'
        },
        {
          id: 'dh-1-q2',
          question: 'What does Diamond Hands actually mean?',
          options: [
            { id: 'a', text: 'Never selling no matter what happens' },
            { id: 'b', text: 'Holding bags that are clearly dead' },
            { id: 'c', text: 'Identifying high-conviction plays, sizing appropriately, and taking profits strategically' },
            { id: 'd', text: 'Refusing to acknowledge red flags' }
          ],
          correctAnswer: 'c',
          explanation: 'Diamond Hands is about strategic conviction - identifying worthy holds, proper sizing, and having a valid thesis, not blind holding.'
        },
        {
          id: 'dh-1-q3',
          question: 'Why did Trader B (Diamond Hands) outperform Trader A (Overtrader) in the example?',
          options: [
            { id: 'a', text: 'Trader B made more correct calls' },
            { id: 'b', text: 'Trader B let winners run with 300% average wins' },
            { id: 'c', text: 'Trader B used leverage' },
            { id: 'd', text: 'Trader B had insider information' }
          ],
          correctAnswer: 'b',
          explanation: 'Despite a lower win rate, Trader B made more money by holding winners longer (300% average win vs 15%).'
        }
      ]
    },

    'dh-2': {
      title: 'Identifying Hold-Worthy Assets',
      questions: [
        {
          id: 'dh-2-q1',
          question: 'What is a sign of "staying power" for a potential hold?',
          options: [
            { id: 'a', text: 'One-person team with big promises' },
            { id: 'b', text: 'Active development, growing community, survived previous cycles' },
            { id: 'c', text: 'Dev wallet constantly selling' },
            { id: 'd', text: 'Community only talks about price' }
          ],
          correctAnswer: 'b',
          explanation: 'Assets with staying power have active development, genuine community growth, and have survived market cycles.'
        },
        {
          id: 'dh-2-q2',
          question: 'What is the "Would I Buy More?" test?',
          options: [
            { id: 'a', text: 'Asking if you should use leverage' },
            { id: 'b', text: 'Periodically asking if you would buy at current price if you didn\'t already own' },
            { id: 'c', text: 'Checking if friends would buy' },
            { id: 'd', text: 'Testing if the price will go up' }
          ],
          correctAnswer: 'b',
          explanation: 'If you wouldn\'t buy at current prices without owning, your conviction may be based on sunk cost rather than value.'
        },
        {
          id: 'dh-2-q3',
          question: 'If max upside is only 2-3x, what should you consider it?',
          options: [
            { id: 'a', text: 'A long-term hold' },
            { id: 'b', text: 'A trade, not a hold' },
            { id: 'c', text: 'A core position' },
            { id: 'd', text: 'A moonbag' }
          ],
          correctAnswer: 'b',
          explanation: 'For Diamond Hands positions, you want 5-10x+ potential. Limited upside is better suited for trading.'
        }
      ]
    },

    'dh-3': {
      title: 'Entry Strategies for Long-Term Holds',
      questions: [
        {
          id: 'dh-3-q1',
          question: 'What is the recommended hybrid entry approach?',
          options: [
            { id: 'a', text: 'All-in at once' },
            { id: 'b', text: '50% DCA + 50% dip reserve' },
            { id: 'c', text: 'Only buy during ATHs' },
            { id: 'd', text: 'Never buy, only trade' }
          ],
          correctAnswer: 'b',
          explanation: 'The hybrid approach ensures you\'re building position through DCA while keeping dry powder for dip opportunities.'
        },
        {
          id: 'dh-3-q2',
          question: 'What are the WORST times to accumulate?',
          options: [
            { id: 'a', text: 'Bear market capitulation' },
            { id: 'b', text: 'Peak euphoria when everyone is buying' },
            { id: 'c', text: 'Major corrections in bull markets' },
            { id: 'd', text: 'Early recovery with high skepticism' }
          ],
          correctAnswer: 'b',
          explanation: 'Peak euphoria when "your Uber driver is buying" and "this time is different" is consensus are the worst entry points.'
        },
        {
          id: 'dh-3-q3',
          question: 'What happens if you let a single position become too large?',
          options: [
            { id: 'a', text: 'You make more money' },
            { id: 'b', text: 'You can\'t think clearly about it' },
            { id: 'c', text: 'You become a better trader' },
            { id: 'd', text: 'The position performs better' }
          ],
          correctAnswer: 'b',
          explanation: 'Oversized positions impair judgment. You should size so you can think clearly and hold through volatility.'
        }
      ]
    },

    'dh-4': {
      title: 'Surviving Volatility',
      questions: [
        {
          id: 'dh-4-q1',
          question: 'When should you decide whether you\'ll hold through a dip?',
          options: [
            { id: 'a', text: 'During the dip' },
            { id: 'b', text: 'After the dip' },
            { id: 'c', text: 'BEFORE the dip happens' },
            { id: 'd', text: 'When others are selling' }
          ],
          correctAnswer: 'c',
          explanation: 'Pre-commitment is key - decide you\'ll hold before the dip, not during when emotions cloud judgment.'
        },
        {
          id: 'dh-4-q2',
          question: 'When should you actually worry about a drawdown?',
          options: [
            { id: 'a', text: 'Any time price drops 10%+' },
            { id: 'b', text: 'When fundamentals change, narrative dies, or thesis breaks' },
            { id: 'c', text: 'Never worry, always hold' },
            { id: 'd', text: 'Only when others are worried' }
          ],
          correctAnswer: 'b',
          explanation: 'Worry when fundamentals actually change, narrative dies, or your thesis breaks - not just price movement.'
        },
        {
          id: 'dh-4-q3',
          question: 'What is the #1 way to hold through dips?',
          options: [
            { id: 'a', text: 'Delete all apps' },
            { id: 'b', text: 'Size correctly from the start' },
            { id: 'c', text: 'Never look at charts' },
            { id: 'd', text: 'Join a support group' }
          ],
          correctAnswer: 'b',
          explanation: 'If you\'re losing sleep over a position, it\'s too big. Correct sizing from the start prevents panic.'
        }
      ]
    },

    'dh-5': {
      title: 'When Diamond Hands Become Bag Holding',
      questions: [
        {
          id: 'dh-5-q1',
          question: 'What separates Diamond Hands from bag holding?',
          options: [
            { id: 'a', text: 'Diamond Hands never sells' },
            { id: 'b', text: 'Diamond Hands is based on conviction with valid thesis, bag holding is based on hope' },
            { id: 'c', text: 'Bag holding means smaller losses' },
            { id: 'd', text: 'There\'s no difference' }
          ],
          correctAnswer: 'b',
          explanation: 'Conviction is based on research and valid thesis. Cope is based on hope and sunk cost fallacy.'
        },
        {
          id: 'dh-5-q2',
          question: 'What is the sunk cost trap?',
          options: [
            { id: 'a', text: 'A trading strategy' },
            { id: 'b', text: 'Thinking "I\'m already down 70%, might as well hold"' },
            { id: 'c', text: 'A type of market order' },
            { id: 'd', text: 'A bullish signal' }
          ],
          correctAnswer: 'b',
          explanation: 'The sunk cost trap is letting past losses influence future decisions. The past is irrelevant to future returns.'
        },
        {
          id: 'dh-5-q3',
          question: 'What is the correct framing when holding a losing position?',
          options: [
            { id: 'a', text: 'I need to wait until I break even' },
            { id: 'b', text: 'Is this the best use of what\'s left, or should I redeploy?' },
            { id: 'c', text: 'I\'ll double down to average out' },
            { id: 'd', text: 'It has to come back eventually' }
          ],
          correctAnswer: 'b',
          explanation: 'You only control what you do with what\'s left. Ask if it\'s the best use of that capital right now.'
        }
      ]
    },

    'dh-6': {
      title: 'Taking Profits Without Regret',
      questions: [
        {
          id: 'dh-6-q1',
          question: 'What\'s the main benefit of taking your initial investment off the table?',
          options: [
            { id: 'a', text: 'Tax benefits' },
            { id: 'b', text: 'You\'re playing with house money, reducing psychological stress' },
            { id: 'c', text: 'You can brag about it' },
            { id: 'd', text: 'No benefits' }
          ],
          correctAnswer: 'b',
          explanation: 'Once you recover your initial, you\'re playing with pure profit. Drawdowns hurt less with house money.'
        },
        {
          id: 'dh-6-q2',
          question: 'What is the recommended scaled exit approach for Diamond Hands?',
          options: [
            { id: 'a', text: 'Sell everything at 2x' },
            { id: 'b', text: 'Never take profits' },
            { id: 'c', text: 'Sell portions at 3x, 5x, 10x and keep 40%+ as moonbag' },
            { id: 'd', text: 'Only sell in bear markets' }
          ],
          correctAnswer: 'c',
          explanation: 'Diamond Hands traders should target higher multiples (3x, 5x, 10x) and keep larger moonbags than active traders.'
        },
        {
          id: 'dh-6-q3',
          question: 'What should you do after selling some of your position?',
          options: [
            { id: 'a', text: 'Check the price constantly' },
            { id: 'b', text: 'Calculate what you could have made' },
            { id: 'c', text: 'Don\'t check price, focus on what you made, move on' },
            { id: 'd', text: 'Buy back immediately if it goes higher' }
          ],
          correctAnswer: 'c',
          explanation: 'Profits taken are profits earned. Don\'t torture yourself with "what could have been."'
        }
      ]
    },

    'dh-7': {
      title: 'Portfolio Construction for Diamond Hands',
      questions: [
        {
          id: 'dh-7-q1',
          question: 'What percentage should the Foundation Layer (blue chips) typically be?',
          options: [
            { id: 'a', text: '10-20%' },
            { id: 'b', text: '40-60%' },
            { id: 'c', text: '80-90%' },
            { id: 'd', text: '0% - blue chips are boring' }
          ],
          correctAnswer: 'b',
          explanation: 'The Foundation Layer of blue chips (BTC, ETH, SOL) should be 40-60% - your sleep-well positions.'
        },
        {
          id: 'dh-7-q2',
          question: 'Is 20+ positions ideal for diversification?',
          options: [
            { id: 'a', text: 'Yes, more diversification is always better' },
            { id: 'b', text: 'No, 5-10 positions is plenty and you can track them properly' },
            { id: 'c', text: 'Yes, you should have at least 50 positions' },
            { id: 'd', text: 'Only if you use a spreadsheet' }
          ],
          correctAnswer: 'b',
          explanation: '5-10 positions is plenty. 20+ means you can\'t track them properly. Concentration in winners beats broad diversification.'
        },
        {
          id: 'dh-7-q3',
          question: 'What should you do during bear markets?',
          options: [
            { id: 'a', text: 'Sell everything and wait' },
            { id: 'b', text: 'Accumulate projects still building, focus on blue chips' },
            { id: 'c', text: 'All-in on memecoins' },
            { id: 'd', text: 'Stop checking crypto entirely' }
          ],
          correctAnswer: 'b',
          explanation: 'Bear markets are for accumulating survivors - projects still building, teams still active, infrastructure plays.'
        }
      ]
    },

    'dh-8': {
      title: 'The Diamond Hands Lifestyle',
      questions: [
        {
          id: 'dh-8-q1',
          question: 'How often should a Diamond Hands trader check their portfolio?',
          options: [
            { id: 'a', text: 'Every 5 minutes' },
            { id: 'b', text: 'Every hour' },
            { id: 'c', text: 'Once daily with deeper weekly/monthly reviews' },
            { id: 'd', text: 'Never' }
          ],
          correctAnswer: 'c',
          explanation: 'Diamond Hands traders should spend less time on crypto - quick daily check, with proper weekly and monthly reviews.'
        },
        {
          id: 'dh-8-q2',
          question: 'What is the Diamond Hands trader\'s main edge?',
          options: [
            { id: 'a', text: 'Trading more frequently' },
            { id: 'b', text: 'Better technical analysis' },
            { id: 'c', text: 'Patience in a market of overtraders' },
            { id: 'd', text: 'More leverage' }
          ],
          correctAnswer: 'c',
          explanation: 'In a market full of overtraders, your patience is your edge. The holders win, traders provide liquidity.'
        },
        {
          id: 'dh-8-q3',
          question: 'What is a tax benefit of long-term holding?',
          options: [
            { id: 'a', text: 'No taxes ever' },
            { id: 'b', text: 'Lower tax rate on long-term gains (>1 year) in many jurisdictions' },
            { id: 'c', text: 'Free money from the government' },
            { id: 'd', text: 'There are no tax benefits' }
          ],
          correctAnswer: 'b',
          explanation: 'In many jurisdictions, long-term capital gains (held >1 year) have lower tax rates than short-term gains.'
        }
      ]
    }
  },

  finalTest: {
    title: 'Diamond Hands Final Assessment',
    passingScore: 80,
    xpReward: 100,
    questions: [
      {
        id: 'dh-final-1',
        question: 'What separates Diamond Hands from bag holding?',
        options: [
          { id: 'a', text: 'Diamond Hands never sells' },
          { id: 'b', text: 'Diamond Hands is based on conviction with valid thesis, bag holding is based on hope' },
          { id: 'c', text: 'Bag holding means smaller losses' },
          { id: 'd', text: 'There\'s no difference' }
        ],
        correctAnswer: 'b',
        explanation: 'Conviction is based on research and valid thesis. Cope is based on hope and sunk cost fallacy.'
      },
      {
        id: 'dh-final-2',
        question: 'True or False: The more you trade in crypto, the better your returns typically are.',
        options: [
          { id: 'a', text: 'True' },
          { id: 'b', text: 'False' }
        ],
        correctAnswer: 'b',
        explanation: 'Studies show the more you trade, the worse your returns due to fees, slippage, and selling winners early.'
      },
      {
        id: 'dh-final-3',
        question: 'What is the "Would I Buy More?" test?',
        options: [
          { id: 'a', text: 'Asking if you should leverage your position' },
          { id: 'b', text: 'Checking if you\'d buy at current price if you didn\'t already own' },
          { id: 'c', text: 'Seeing if your friends would buy' },
          { id: 'd', text: 'Testing if the price will go up' }
        ],
        correctAnswer: 'b',
        explanation: 'If you wouldn\'t buy at current prices without owning, your conviction may be based on sunk cost.'
      },
      {
        id: 'dh-final-4',
        question: 'Which entry strategy combines regular buying with dip reserves?',
        options: [
          { id: 'a', text: 'Pure DCA' },
          { id: 'b', text: 'All-in approach' },
          { id: 'c', text: 'Hybrid (50% DCA + 50% dip reserve)' },
          { id: 'd', text: 'Never buying' }
        ],
        correctAnswer: 'c',
        explanation: 'The hybrid approach ensures you\'re building position while keeping dry powder for opportunities.'
      },
      {
        id: 'dh-final-5',
        question: 'When should you worry during a drawdown?',
        options: [
          { id: 'a', text: 'Any time price drops 10%+' },
          { id: 'b', text: 'When fundamentals change, narrative dies, or thesis breaks' },
          { id: 'c', text: 'Never worry, always hold' },
          { id: 'd', text: 'Only when others are worried' }
        ],
        correctAnswer: 'b',
        explanation: 'Worry when fundamentals change, narrative dies, or thesis breaks - not just price movement.'
      },
      {
        id: 'dh-final-6',
        question: 'True or False: If you\'re down 70%, you might as well hold since you\'ve already lost so much.',
        options: [
          { id: 'a', text: 'True' },
          { id: 'b', text: 'False' }
        ],
        correctAnswer: 'b',
        explanation: 'This is sunk cost fallacy. The past is irrelevant - only consider the best use of what\'s left.'
      },
      {
        id: 'dh-final-7',
        question: 'What\'s the recommended approach for taking profits as a Diamond Hands trader?',
        options: [
          { id: 'a', text: 'Never take profits' },
          { id: 'b', text: 'Sell everything at once at your target' },
          { id: 'c', text: 'Scaled exits at multiple price targets, keeping a moonbag' },
          { id: 'd', text: 'Only sell in bear markets' }
        ],
        correctAnswer: 'c',
        explanation: 'Scaled exits at 3x, 5x, 10x while keeping 40%+ as moonbag balances profit-taking with upside exposure.'
      },
      {
        id: 'dh-final-8',
        question: 'What percentage should the Foundation Layer (blue chips) typically be?',
        options: [
          { id: 'a', text: '10-20%' },
          { id: 'b', text: '40-60%' },
          { id: 'c', text: '80-90%' },
          { id: 'd', text: '0% - blue chips are boring' }
        ],
        correctAnswer: 'b',
        explanation: 'Foundation Layer (BTC, ETH, SOL) should be 40-60% - your lowest risk, sleep-well positions.'
      },
      {
        id: 'dh-final-9',
        question: 'Which of these are signs your thesis might be broken?',
        options: [
          { id: 'a', text: 'Price dropped 30% with the market' },
          { id: 'b', text: 'Team has left the project' },
          { id: 'c', text: 'Competition shipped first' },
          { id: 'd', text: 'All of the above except A' }
        ],
        correctAnswer: 'd',
        explanation: 'Team leaving and competition winning are thesis-breaking. Market-wide dips are just volatility.'
      },
      {
        id: 'dh-final-10',
        question: 'How often should a Diamond Hands trader typically check their portfolio?',
        options: [
          { id: 'a', text: 'Every 5 minutes' },
          { id: 'b', text: 'Every hour' },
          { id: 'c', text: 'Once daily with deeper weekly/monthly reviews' },
          { id: 'd', text: 'Never' }
        ],
        correctAnswer: 'c',
        explanation: 'Quick daily check (10-15 min), deeper weekly review, full monthly assessment is sustainable.'
      },
      {
        id: 'dh-final-11',
        question: 'What\'s the main benefit of taking your initial investment off the table?',
        options: [
          { id: 'a', text: 'Tax benefits' },
          { id: 'b', text: 'You\'re playing with house money, reducing psychological stress' },
          { id: 'c', text: 'You can brag about it' },
          { id: 'd', text: 'No benefits' }
        ],
        correctAnswer: 'b',
        explanation: 'Playing with house money transforms your psychology - drawdowns hurt less.'
      },
      {
        id: 'dh-final-12',
        question: 'True or False: 20+ positions is ideal for diversification in a Diamond Hands portfolio.',
        options: [
          { id: 'a', text: 'True' },
          { id: 'b', text: 'False' }
        ],
        correctAnswer: 'b',
        explanation: '5-10 positions is plenty. More means you can\'t track them properly. Concentration in winners beats broad diversification.'
      },
      {
        id: 'dh-final-13',
        question: 'What should you do during bear markets as a Diamond Hands trader?',
        options: [
          { id: 'a', text: 'Sell everything and wait' },
          { id: 'b', text: 'Accumulate projects that are still building, focus on blue chips' },
          { id: 'c', text: 'All-in on memecoins' },
          { id: 'd', text: 'Stop checking crypto entirely' }
        ],
        correctAnswer: 'b',
        explanation: 'Bear markets are for accumulating survivors - projects still shipping, teams still active.'
      },
      {
        id: 'dh-final-14',
        question: 'Which of these are part of a sustainable Diamond Hands lifestyle?',
        options: [
          { id: 'a', text: 'Watching crypto YouTube for 5+ hours daily' },
          { id: 'b', text: 'Limiting daily chart checking, having non-crypto hobbies, setting specific research times' },
          { id: 'c', text: 'Checking prices every 10 minutes' },
          { id: 'd', text: 'Sharing all positions publicly' }
        ],
        correctAnswer: 'b',
        explanation: 'Sustainable habits include limited checking, non-crypto identity, and structured information consumption.'
      },
      {
        id: 'dh-final-15',
        question: 'What is the Diamond Hands trader\'s main edge?',
        options: [
          { id: 'a', text: 'Trading more frequently' },
          { id: 'b', text: 'Better technical analysis' },
          { id: 'c', text: 'Patience in a market of overtraders' },
          { id: 'd', text: 'More leverage' }
        ],
        correctAnswer: 'c',
        explanation: 'In a market full of overtraders, patience is your edge. The holders win, traders provide liquidity.'
      }
    ]
  }
}
