// Copy Trader Archetype Quizzes
// Quiz questions for each lesson and final assessment

export const copyTraderQuizzes = {
  moduleId: 'copy-trader',

  // Quizzes for each lesson (3 questions each)
  lessonQuizzes: {
    'copy-trader-1': {
      lessonId: 'copy-trader-1',
      lessonTitle: "The Copy Trader's Path",
      questions: [
        {
          id: 'ct1-q1',
          question: 'What is the highest level of copy trading described in the module?',
          options: [
            'Blind Following - copy without understanding',
            'Informed Following - understand the thesis',
            'Strategic Following - use smart money as one input while developing your own edge',
            'Pure Imitation - match every trade exactly'
          ],
          correctAnswer: 2,
          explanation: 'Level 3: Strategic Following is the best approach - using smart money as one input while doing your own research and building your own edge over time.'
        },
        {
          id: 'ct1-q2',
          question: 'What is the ultimate goal of copy trading according to this module?',
          options: [
            'To copy trade forever',
            'To make money without effort',
            'To learn while developing independence and become someone others want to copy',
            'To follow as many traders as possible'
          ],
          correctAnswer: 2,
          explanation: 'The goal is to learn, practice, develop your own thesis, and eventually graduate to become someone others want to copy. Copy trading is the apprenticeship, independence is the goal.'
        },
        {
          id: 'ct1-q3',
          question: 'Which of these is a natural strength of Copy Traders?',
          options: [
            'Overconfidence in their own analysis',
            'Needing to reinvent every strategy',
            'Humility to learn from others',
            'Ignoring what successful traders do'
          ],
          correctAnswer: 2,
          explanation: 'Copy Traders naturally recognize that others know more, are humble enough to learn, and can identify successful traders. Ego kills more traders than bad analysis.'
        }
      ]
    },
    'copy-trader-2': {
      lessonId: 'copy-trader-2',
      lessonTitle: 'Finding Smart Money to Follow',
      questions: [
        {
          id: 'ct2-q1',
          question: 'Which tier of smart money provides the strongest signal?',
          options: [
            'Social media influencers with large followings',
            'On-chain wallets with verifiable history',
            'Anonymous callers in Telegram groups',
            'Accounts with lifestyle displays'
          ],
          correctAnswer: 1,
          explanation: "On-chain wallets (Tier 1) provide the best signal because actions can't be faked. Either they made money or they didn't - it's all verifiable on-chain."
        },
        {
          id: 'ct2-q2',
          question: 'What is a major red flag when evaluating someone to follow?',
          options: [
            'They share both wins and losses',
            'They only show winning trades, never losses',
            'They explain their thesis clearly',
            'They have a consistent track record over months'
          ],
          correctAnswer: 1,
          explanation: 'Everyone has losses. If someone only shows winners and hides losses, they are being dishonest and not worth following.'
        },
        {
          id: 'ct2-q3',
          question: 'How many high-quality sources should you ideally follow?',
          options: [
            '1-2 sources',
            '3-5 sources',
            '10-15 sources',
            'As many as possible'
          ],
          correctAnswer: 1,
          explanation: '3-5 high-quality sources is optimal. Following too many leads to conflicting signals and information overload. Quality over quantity.'
        }
      ]
    },
    'copy-trader-3': {
      lessonId: 'copy-trader-3',
      lessonTitle: 'Understanding Before Following',
      questions: [
        {
          id: 'ct3-q1',
          question: 'What conviction level (1-10) is the minimum before taking a trade?',
          options: [
            '1-2',
            '3-4',
            '5-6',
            '9-10'
          ],
          correctAnswer: 2,
          explanation: 'Never take a trade below 5 conviction. At 5-7 you have moderate conviction and should size at half position or less. Below 5, skip entirely.'
        },
        {
          id: 'ct3-q2',
          question: 'What is the "Explanation Test"?',
          options: [
            'Testing if the project has documentation',
            'Seeing if you can explain the trade in 2-3 sentences',
            'Asking the trader to explain their thesis',
            'Checking if others understand the trade'
          ],
          correctAnswer: 1,
          explanation: "If you can explain the trade simply in 2-3 sentences, you understand it. If you can only say 'Whale X bought it so I bought it,' you don't understand it."
        },
        {
          id: 'ct3-q3',
          question: 'What should you do when you cannot fully understand a trade?',
          options: [
            'Buy a full position anyway',
            'Skip it or take a tiny position as a learning experiment',
            'Double down because smart money knows best',
            'Wait for an influencer to explain it'
          ],
          correctAnswer: 1,
          explanation: "When understanding isn't possible, either skip the trade or take a tiny position as a learning experiment. Never size up on trades you don't understand."
        }
      ]
    },
    'copy-trader-4': {
      lessonId: 'copy-trader-4',
      lessonTitle: 'Execution Without Front-Running Yourself',
      questions: [
        {
          id: 'ct4-q1',
          question: 'What is the best entry strategy for most situations?',
          options: [
            'All in immediately at market price',
            'Wait for the token to double then buy',
            'Scale in with multiple entries (30%/40%/30%)',
            'Only buy on weekends'
          ],
          correctAnswer: 2,
          explanation: 'Scale in entry is best for most situations - buy 30% immediately, 40% on first dip, 30% on deeper dip. This reduces timing risk and can get you better average entry than even the whale.'
        },
        {
          id: 'ct4-q2',
          question: 'If a token is already up 100%+ from smart money entry, you should:',
          options: [
            'Chase it immediately before it goes higher',
            'Buy double the usual size to make up for the premium',
            'Definitely skip and find the next opportunity',
            'Wait for it to double again then buy'
          ],
          correctAnswer: 2,
          explanation: "If price is already up 100%+ from smart money entry, definitely skip. You're late, find the next trade. Don't FOMO into pumped tokens."
        },
        {
          id: 'ct4-q3',
          question: 'What is the right mindset about missed trades?',
          options: [
            'Every missed trade is a failure',
            'Chase every pump to never miss again',
            'Missing good trades due to not chasing is okay - discipline over outcome',
            'Never miss a trade, always buy immediately'
          ],
          correctAnswer: 2,
          explanation: "Missing trades because you didn't chase is the right decision even if it has a bad outcome. Discipline over outcome. There's always another trade. Missing good trades > chasing bad entries."
        }
      ]
    },
    'copy-trader-5': {
      lessonId: 'copy-trader-5',
      lessonTitle: 'Holding With Borrowed Conviction',
      questions: [
        {
          id: 'ct5-q1',
          question: 'What causes the "conviction gap" between smart money and copy traders?',
          options: [
            'Copy traders have more capital',
            'Copy traders did deep research while smart money guessed',
            "Smart money did deep research while copy traders don't fully understand the thesis",
            'Smart money panics more easily'
          ],
          correctAnswer: 2,
          explanation: "Smart money holds because they did deep research and have strong thesis. Copy traders panic because they don't fully understand the thesis - this gap is why most copy traders lose even copying winners."
        },
        {
          id: 'ct5-q2',
          question: 'How should you size positions for holdability?',
          options: [
            'Size so big that every dip feels like catastrophe',
            'Size so you can hold through 30% dips without panic and 50% with discomfort but not terror',
            'Always go all in for maximum returns',
            'Size based on what smart money bought in dollars'
          ],
          correctAnswer: 1,
          explanation: "Size so you can hold through 30% dips without panic, 50% dips with discomfort but not terror, and total loss without ruin. If you can't hold it, you're oversized."
        },
        {
          id: 'ct5-q3',
          question: 'What is the first step in the Panic Prevention Protocol?',
          options: [
            'Sell everything immediately',
            'Check Twitter for what others are doing',
            'Step away - close apps for 1 hour minimum',
            'Buy more to average down'
          ],
          correctAnswer: 2,
          explanation: "When panic hits, step away first - close apps for 1 hour minimum. Then review your rules, check smart money, check thesis, talk to someone objective, and only then decide with a clear head."
        }
      ]
    },
    'copy-trader-6': {
      lessonId: 'copy-trader-6',
      lessonTitle: 'Developing Independent Analysis',
      questions: [
        {
          id: 'ct6-q1',
          question: 'What is the "Shadow Analysis Exercise"?',
          options: [
            'Trading only at night',
            'Making your own predictions before seeing smart money moves, then comparing',
            'Copying without thinking',
            'Following traders who are anonymous'
          ],
          correctAnswer: 1,
          explanation: 'The Shadow Analysis Exercise involves making your own predictions before knowing what smart money bought, then comparing to learn from the gaps and build pattern recognition.'
        },
        {
          id: 'ct6-q2',
          question: 'What is the optimal mix for advanced traders?',
          options: [
            '100% independent trades only',
            '100% copy trades only',
            '60-70% independent, 20-30% smart money validated, 10% following trusted sources',
            '50% random trades, 50% copy trades'
          ],
          correctAnswer: 2,
          explanation: 'Even advanced traders use a hybrid model: 60-70% independent trades, 20-30% smart money validated trades, 10% following trusted sources on high conviction.'
        },
        {
          id: 'ct6-q3',
          question: 'At what stage should you target 50%+ of trades with independent thesis?',
          options: [
            'Level 1: Narrative Recognition',
            'Level 2: Project Evaluation',
            'Middle stage metrics',
            'Only after 5 years of trading'
          ],
          correctAnswer: 2,
          explanation: 'Middle stage metrics target having independent thesis for 50%+ of trades and occasionally identifying plays before smart money.'
        }
      ]
    },
    'copy-trader-7': {
      lessonId: 'copy-trader-7',
      lessonTitle: 'Common Copy Trading Mistakes',
      questions: [
        {
          id: 'ct7-q1',
          question: 'What is the #1 profit killer for copy traders?',
          options: [
            'Following too few sources',
            'Entering late and exiting early',
            'Too much research',
            'Position sizes too small'
          ],
          correctAnswer: 1,
          explanation: 'Entering late and exiting early is the #1 profit killer. Smart money buys at $1, you chase at $1.50, panic sell at $1.20, and it runs to $3 without you.'
        },
        {
          id: 'ct7-q2',
          question: 'Why is copying position dollar amounts a mistake?',
          options: [
            'It makes you trade too small',
            'A 1% position for a whale could be 20% of your portfolio - completely different risk',
            'Dollar amounts are more accurate than percentages',
            'Smart money always sizes the same'
          ],
          correctAnswer: 1,
          explanation: "Whale with $10M buys $100K (1%), you with $10K buy $2K (20%!) - same trade but completely different risk. Always size as % of YOUR portfolio, not dollar amounts."
        },
        {
          id: 'ct7-q3',
          question: 'What mistake is "Following the Followers"?',
          options: [
            'Following too many people',
            'Being third in line because you follow someone who follows the real source',
            'Following people with followers',
            'Not following anyone'
          ],
          correctAnswer: 1,
          explanation: "You follow Caller A, who follows Whale B. By the time info reaches you, thousands have acted. You're third in line, not first. Go as close to source as possible."
        }
      ]
    },
    'copy-trader-8': {
      lessonId: 'copy-trader-8',
      lessonTitle: 'The Path to Trading Independence',
      questions: [
        {
          id: 'ct8-q1',
          question: 'At what stage should you have 40-60% of trades sourced independently?',
          options: [
            'Stage 1: Pure Copy',
            'Stage 2: Informed Following',
            'Stage 3: Hybrid Trading',
            'Stage 4: Independence'
          ],
          correctAnswer: 2,
          explanation: 'Stage 3: Hybrid Trading (months 6-12) is when you should have 40-60% of trades sourced independently, with independent trades showing positive expectancy.'
        },
        {
          id: 'ct8-q2',
          question: 'What is the typical timeline to reach trading independence?',
          options: [
            '1-2 weeks',
            '1-2 months',
            '6-18 months',
            '5-10 years'
          ],
          correctAnswer: 2,
          explanation: "Reaching trading independence typically takes 6-18 months of dedicated practice. It doesn't happen overnight but comes through consistent effort."
        },
        {
          id: 'ct8-q3',
          question: 'What should you do after graduating to independence?',
          options: [
            'Never look at smart money again',
            'Stop learning completely',
            'Continue monitoring smart money for confirmation while trusting your own analysis',
            'Only copy trade from then on'
          ],
          correctAnswer: 2,
          explanation: "After graduation, continue to monitor smart money for confirmation, learn from better traders, stay humble, but also trust your own analysis and contribute to the community."
        }
      ]
    }
  },

  // Final module test (15 questions)
  finalTest: {
    title: 'Copy Trader Final Assessment',
    description: 'Test your mastery of copy trading principles and the path to independence',
    passingScore: 80,
    questions: [
      {
        id: 'ct-final-1',
        question: "What's the main goal of copy trading according to this module?",
        options: [
          'Copy trades forever',
          'Make money without effort',
          'Learn while developing independent skills',
          'Follow as many sources as possible'
        ],
        correctAnswer: 2,
        explanation: 'The goal is to learn, practice with training wheels, develop your own thesis and process, and eventually graduate to become someone others want to copy.'
      },
      {
        id: 'ct-final-2',
        question: "On-chain wallet tracking provides stronger signal than influencer calls because actions can't be faked.",
        options: [
          'True',
          'False'
        ],
        correctAnswer: 0,
        explanation: "On-chain wallets (Tier 1) are best because actions can't be faked. Either they made money or they didn't - it's all verifiable on the blockchain."
      },
      {
        id: 'ct-final-3',
        question: "What's the maximum number of sources recommended to follow?",
        options: [
          '1-2',
          '3-5',
          '10-15',
          'As many as possible'
        ],
        correctAnswer: 1,
        explanation: '3-5 high-quality sources is optimal. More leads to conflicting signals and information overload. Quality over quantity.'
      },
      {
        id: 'ct-final-4',
        question: 'What conviction level (1-10) should be minimum before taking a trade?',
        options: [
          '1-2',
          '3-4',
          '5-6',
          '9-10'
        ],
        correctAnswer: 2,
        explanation: 'Never take a trade below 5 conviction. At 5-7 you have moderate conviction and should size at half position or less.'
      },
      {
        id: 'ct-final-5',
        question: 'If a token is already up 100%+ from smart money entry, you should:',
        options: [
          'Chase it immediately',
          'Buy double the usual size',
          'Skip and find next opportunity',
          'Wait for it to double again then buy'
        ],
        correctAnswer: 2,
        explanation: "If price is up 100%+, definitely skip. You're late, find the next trade. Don't FOMO."
      },
      {
        id: 'ct-final-6',
        question: 'You should size positions the same dollar amount as the smart money you follow.',
        options: [
          'True',
          'False'
        ],
        correctAnswer: 1,
        explanation: 'Size as % of YOUR portfolio, not dollar amount. A 1% position for a whale could be 20% of your portfolio.'
      },
      {
        id: 'ct-final-7',
        question: "What's the best strategy for most trade entries?",
        options: [
          'All in immediately',
          'Scale in with multiple entries',
          'Wait for it to double then buy',
          'Only buy on weekends'
        ],
        correctAnswer: 1,
        explanation: 'Scale in entry (30%/40%/30%) is best for most situations. It reduces timing risk and can get better average entry.'
      },
      {
        id: 'ct-final-8',
        question: 'Which of these is a red flag when evaluating someone to follow?',
        options: [
          'They share both wins and losses',
          'They only show winning trades',
          'They explain their thesis',
          'They have consistent track record'
        ],
        correctAnswer: 1,
        explanation: 'Everyone has losses. Only showing winners means they are hiding losses and being dishonest.'
      },
      {
        id: 'ct-final-9',
        question: 'What should you do during a 30% dip on a copied position?',
        options: [
          'Check if smart money is selling',
          'Review if thesis is still intact',
          'Panic sell immediately',
          'Both A and B'
        ],
        correctAnswer: 3,
        explanation: 'During dips, check if smart money is selling, review if thesis is intact, and refer to your pre-defined rules. Never panic sell without analysis.'
      },
      {
        id: 'ct-final-10',
        question: 'The "Shadow Analysis Exercise" involves:',
        options: [
          'Trading in the dark',
          'Making your own predictions before seeing smart money moves',
          'Copying without thinking',
          'Only trading during night hours'
        ],
        correctAnswer: 1,
        explanation: 'Shadow Analysis means making your own predictions before knowing what smart money bought, then comparing to learn from the gaps.'
      },
      {
        id: 'ct-final-11',
        question: 'Once you become an independent trader, you should never look at smart money again.',
        options: [
          'True',
          'False'
        ],
        correctAnswer: 1,
        explanation: 'Even after graduation, continue monitoring smart money for confirmation, learn from traders better than you, and stay humble.'
      },
      {
        id: 'ct-final-12',
        question: "What's the biggest profit killer for copy traders?",
        options: [
          'Following too few sources',
          'Entering late and exiting early',
          'Too much research',
          'Position sizes too small'
        ],
        correctAnswer: 1,
        explanation: 'Entering late (chasing pumps) and exiting early (panic selling dips) is the #1 profit killer for copy traders.'
      },
      {
        id: 'ct-final-13',
        question: 'At what stage should you have 40-60% of trades sourced independently?',
        options: [
          'Stage 1: Pure Copy',
          'Stage 2: Informed Following',
          'Stage 3: Hybrid Trading',
          'Stage 4: Independence'
        ],
        correctAnswer: 2,
        explanation: 'Stage 3: Hybrid Trading (months 6-12) targets 40-60% of trades sourced independently.'
      },
      {
        id: 'ct-final-14',
        question: 'Which is NOT a recommended daily habit?',
        options: [
          'Check positions and alerts',
          'Scan Twitter for narratives',
          'Trade every interesting token you see',
          'Journal thoughts and observations'
        ],
        correctAnswer: 2,
        explanation: "Trading every interesting token is NOT recommended. Daily habits should include checking positions, scanning narratives, and journaling - not trading everything."
      },
      {
        id: 'ct-final-15',
        question: "What's the typical timeline to reach trading independence?",
        options: [
          '1-2 weeks',
          '1-2 months',
          '6-18 months',
          '5-10 years'
        ],
        correctAnswer: 2,
        explanation: 'Reaching trading independence typically takes 6-18 months of dedicated practice through the four stages of development.'
      }
    ]
  }
}
