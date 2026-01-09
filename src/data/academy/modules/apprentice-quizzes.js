// Apprentice Module Quizzes
// Quiz questions for each lesson and final assessment

export const apprenticeQuizzes = {
  moduleId: 'apprentice',

  // Quizzes for each lesson
  lessonQuizzes: {
    'apprentice-1': {
      lessonId: 'apprentice-1',
      lessonTitle: 'How to Research a Token',
      questions: [
        {
          id: 'app1-q1',
          question: "What's the minimum liquidity you should generally look for?",
          options: [
            '$100',
            '$1,000',
            '$10,000-$50,000+',
            "Liquidity doesn't matter"
          ],
          correctAnswer: 2,
          explanation: 'You should generally look for $10,000-$50,000+ liquidity to ensure you can exit your position without massive slippage.'
        },
        {
          id: 'app1-q2',
          question: 'If mint authority is not revoked, what can the dev do?',
          options: [
            'Nothing special',
            'Create unlimited new tokens',
            'Only view the contract',
            'Lock the liquidity'
          ],
          correctAnswer: 1,
          explanation: 'If mint authority is not revoked, the dev can create unlimited new tokens, diluting your holdings to worthlessness.'
        },
        {
          id: 'app1-q3',
          question: 'What does it mean if top 10 wallets hold 60% of supply?',
          options: [
            'The token is very popular',
            'High concentration risk - they can dump on you',
            'The token is definitely safe',
            'You should buy more'
          ],
          correctAnswer: 1,
          explanation: 'High concentration (60%+ in top 10 wallets) is a red flag - those wallets can dump and crash the price.'
        },
        {
          id: 'app1-q4',
          question: 'How long should basic memecoin research take?',
          options: [
            '5 seconds',
            '5 minutes',
            '5 hours',
            '5 days'
          ],
          correctAnswer: 1,
          explanation: '5 minutes of systematic research catches 90% of obvious rugs while keeping you agile for fast-moving opportunities.'
        },
        {
          id: 'app1-q5',
          question: 'Which of these is a GREEN flag when researching a token?',
          options: [
            'Token created 30 minutes ago',
            'One wallet holds 25% of supply',
            'Liquidity locked or burned',
            'No social media presence'
          ],
          correctAnswer: 2,
          explanation: 'Locked or burned liquidity means the dev cannot pull the liquidity and rug the token.'
        }
      ]
    },
    'apprentice-2': {
      lessonId: 'apprentice-2',
      lessonTitle: 'Spotting Rugs and Scams',
      questions: [
        {
          id: 'app2-q1',
          question: 'What is a "honeypot" scam?',
          options: [
            'A sweet investment opportunity',
            "A token you can buy but can't sell",
            'A type of wallet',
            'A legitimate trading strategy'
          ],
          correctAnswer: 1,
          explanation: "A honeypot is a scam where you can buy the token but the contract prevents you from selling - your money is trapped."
        },
        {
          id: 'app2-q2',
          question: 'Which type of liquidity is safest?',
          options: [
            'Unlocked liquidity',
            'Liquidity locked for 24 hours',
            'Burned liquidity',
            'All are equally safe'
          ],
          correctAnswer: 2,
          explanation: 'Burned liquidity is safest because it can never be removed - the LP tokens are permanently destroyed.'
        },
        {
          id: 'app2-q3',
          question: 'How does a "slow rug" work?',
          options: [
            'Dev removes all liquidity at once',
            'Dev gradually sells over time causing price to bleed',
            'Contract prevents all selling',
            'Token name is copied from another'
          ],
          correctAnswer: 1,
          explanation: 'A slow rug involves the dev gradually selling their tokens over days/weeks, causing constant sell pressure and price decline.'
        },
        {
          id: 'app2-q4',
          question: 'When you feel strong FOMO and urgency to buy immediately, you should:',
          options: [
            'Buy faster before you miss out',
            'Increase your position size',
            'Slow down - this is often manipulation',
            'Tell everyone else to buy too'
          ],
          correctAnswer: 2,
          explanation: 'Strong emotions like FOMO and urgency are often signs of manipulation. Slow down and do your research.'
        },
        {
          id: 'app2-q5',
          question: 'What protects you from copycat scams?',
          options: [
            'Buy whatever shows up first in search',
            'Trust links from random DMs',
            'Verify contract address from official source',
            'Assume all tokens with the same name are real'
          ],
          correctAnswer: 2,
          explanation: 'Always verify the contract address from official sources to avoid buying fake copycat tokens.'
        }
      ]
    },
    'apprentice-3': {
      lessonId: 'apprentice-3',
      lessonTitle: 'Reading Charts for Beginners',
      questions: [
        {
          id: 'app3-q1',
          question: 'What does a green candlestick indicate?',
          options: [
            'Price went down',
            'Price went up (closed higher than opened)',
            'High volume',
            'A buy signal'
          ],
          correctAnswer: 1,
          explanation: 'A green candlestick means the price closed higher than it opened during that time period.'
        },
        {
          id: 'app3-q2',
          question: 'Support is a level where price tends to:',
          options: [
            'Bounce down from',
            'Bounce up from',
            'Stay forever',
            'Become unpredictable'
          ],
          correctAnswer: 1,
          explanation: 'Support is a price level where buying pressure tends to come in, causing price to bounce upward.'
        },
        {
          id: 'app3-q3',
          question: 'What does "higher lows" in a chart indicate?',
          options: [
            'Downtrend',
            'Uptrend (buyers stepping in earlier)',
            'No trend',
            'Time to sell everything'
          ],
          correctAnswer: 1,
          explanation: 'Higher lows indicate an uptrend - buyers are stepping in at increasingly higher prices, showing strength.'
        },
        {
          id: 'app3-q4',
          question: 'High volume with a price move suggests:',
          options: [
            'The move is weak and will reverse',
            'The move is strong and likely to continue',
            'You should always sell',
            "Volume doesn't matter"
          ],
          correctAnswer: 1,
          explanation: 'High volume confirms a price move, suggesting it has conviction and is more likely to continue.'
        },
        {
          id: 'app3-q5',
          question: 'Where is the best place to buy in an uptrend?',
          options: [
            'At resistance',
            'At the top of a green candle',
            'Near support',
            "Anywhere, it doesn't matter"
          ],
          correctAnswer: 2,
          explanation: 'Buying near support in an uptrend gives you better risk/reward - lower entry with a clear stop level.'
        }
      ]
    },
    'apprentice-4': {
      lessonId: 'apprentice-4',
      lessonTitle: 'Building Your Watchlist',
      questions: [
        {
          id: 'app4-q1',
          question: 'What is the main benefit of having a watchlist?',
          options: [
            'It makes you look professional',
            'It transforms you from reactive to proactive trading',
            'It guarantees profits',
            'You can share it on Twitter'
          ],
          correctAnswer: 1,
          explanation: 'A watchlist transforms your trading from reactive (chasing pumps) to proactive (executing planned trades).'
        },
        {
          id: 'app4-q2',
          question: 'You see a token trending. What should you do?',
          options: [
            'Buy immediately',
            'Research it, watchlist if interesting, wait for pullback',
            'Go all in',
            'Tell everyone to buy'
          ],
          correctAnswer: 1,
          explanation: 'Never buy trending tokens immediately. Research first, add to watchlist if interesting, then wait for a better entry.'
        },
        {
          id: 'app4-q3',
          question: 'How many Tier 1 (ready to buy) tokens should you typically have?',
          options: [
            '20-30',
            '10-15',
            '3-5',
            '50+'
          ],
          correctAnswer: 2,
          explanation: '3-5 Tier 1 tokens is optimal - enough opportunities but manageable to track and execute properly.'
        },
        {
          id: 'app4-q4',
          question: "A token pumping that's NOT on your watchlist - what do you do?",
          options: [
            'Buy immediately before you miss it',
            'Watch, research, maybe add for next time',
            'Go all in',
            'Complain about missing it'
          ],
          correctAnswer: 1,
          explanation: "If it's not on your watchlist, don't buy. Watch, research, and maybe add it for the next opportunity."
        },
        {
          id: 'app4-q5',
          question: 'What belongs in a Tier 1 watchlist entry?',
          options: [
            'Just the token name',
            'Entry price, stop loss, target, and position size',
            'Every tweet about the token',
            'Only the contract address'
          ],
          correctAnswer: 1,
          explanation: 'A Tier 1 entry needs full trade planning: entry zone, stop loss, targets, and position size.'
        }
      ]
    },
    'apprentice-5': {
      lessonId: 'apprentice-5',
      lessonTitle: 'Protecting Your Wallet',
      questions: [
        {
          id: 'app5-q1',
          question: 'Your seed phrase should be stored:',
          options: [
            'In your notes app for easy access',
            'In cloud storage as backup',
            'Written on paper in a secure location',
            'Shared with trusted friends'
          ],
          correctAnswer: 2,
          explanation: 'Your seed phrase should only be written on paper (or metal) and stored in a secure physical location like a safe.'
        },
        {
          id: 'app5-q2',
          question: 'Legitimate support teams will DM you first to help with wallet issues.',
          options: [
            'True',
            'False'
          ],
          correctAnswer: 1,
          explanation: 'False. No legitimate support will ever DM you first. Anyone who does is a scammer.'
        },
        {
          id: 'app5-q3',
          question: 'What should you do with random tokens that appear in your wallet?',
          options: [
            'Try to sell them immediately',
            'Interact with them to see what they are',
            "Ignore them - don't interact",
            'Transfer them to friends'
          ],
          correctAnswer: 2,
          explanation: 'Never interact with unknown tokens in your wallet. They may be scam tokens that drain your wallet when you interact.'
        },
        {
          id: 'app5-q4',
          question: 'Why should you use multiple wallets?',
          options: [
            'To confuse yourself',
            'To isolate risk - if one is compromised, others are safe',
            'To pay more gas fees',
            "It's not necessary"
          ],
          correctAnswer: 1,
          explanation: 'Multiple wallets isolate risk. If your trading wallet is compromised, your vault wallet remains safe.'
        },
        {
          id: 'app5-q5',
          question: 'Which is a good security practice?',
          options: [
            'Click links in DMs to claim airdrops',
            'Store seed phrase in cloud storage',
            'Bookmark official sites and use only bookmarks',
            'Share seed phrase with support when asked'
          ],
          correctAnswer: 2,
          explanation: 'Bookmarking official sites and only using those bookmarks protects you from phishing attacks on fake URLs.'
        }
      ]
    }
  },

  // Final module test (15 questions)
  finalTest: {
    title: 'Apprentice Final Assessment',
    description: 'Test your mastery of research and security fundamentals',
    passingScore: 80,
    questions: [
      {
        id: 'app-final-1',
        question: "What's the minimum liquidity you should generally look for before buying a token?",
        options: [
          '$100',
          '$1,000',
          '$10,000-$50,000+',
          "Liquidity doesn't matter"
        ],
        correctAnswer: 2,
        explanation: 'You need $10,000-$50,000+ liquidity to be able to exit your position without massive slippage.'
      },
      {
        id: 'app-final-2',
        question: "If top 10 wallets hold 60% of a token's supply, this is:",
        options: [
          'A green flag',
          'A red flag',
          'Normal and fine',
          'Irrelevant'
        ],
        correctAnswer: 1,
        explanation: 'High concentration in top wallets is a red flag - they can dump and crash the price.'
      },
      {
        id: 'app-final-3',
        question: 'What is a "honeypot" scam?',
        options: [
          'A guaranteed profit opportunity',
          "A token you can buy but can't sell",
          'A type of wallet',
          'A legitimate trading strategy'
        ],
        correctAnswer: 1,
        explanation: "A honeypot traps your money - you can buy but the contract prevents selling."
      },
      {
        id: 'app-final-4',
        question: "What's the safest type of liquidity?",
        options: [
          'Unlocked liquidity',
          'Liquidity locked for 24 hours',
          'Burned liquidity',
          'All liquidity is equally safe'
        ],
        correctAnswer: 2,
        explanation: 'Burned liquidity can never be removed - the LP tokens are permanently destroyed.'
      },
      {
        id: 'app-final-5',
        question: 'What does a long lower wick on a candlestick indicate?',
        options: [
          'Sellers are in total control',
          'Buyers pushed price up from the low',
          'Volume is low',
          'The token is dead'
        ],
        correctAnswer: 1,
        explanation: 'A long lower wick shows buyers stepped in and pushed price up from the lows - potential support.'
      },
      {
        id: 'app-final-6',
        question: 'In an uptrend, you want to see:',
        options: [
          'Lower highs and lower lows',
          'Higher highs and higher lows',
          'Flat price action',
          'Decreasing volume'
        ],
        correctAnswer: 1,
        explanation: 'An uptrend is defined by higher highs and higher lows - each swing exceeds the previous.'
      },
      {
        id: 'app-final-7',
        question: 'High volume with a price move suggests:',
        options: [
          'The move is weak',
          'The move is strong and likely to continue',
          'You should sell immediately',
          'Volume is irrelevant'
        ],
        correctAnswer: 1,
        explanation: 'High volume confirms conviction behind a move, making it more likely to continue.'
      },
      {
        id: 'app-final-8',
        question: "What should you do with a token that's pumping but NOT on your watchlist?",
        options: [
          'Buy immediately',
          'Watch, research, maybe add for next time',
          'Go all in',
          'Complain about missing it'
        ],
        correctAnswer: 1,
        explanation: "If it's not on your watchlist, don't chase. Research it for potential future opportunities."
      },
      {
        id: 'app-final-9',
        question: 'How many Tier 1 (ready to buy) tokens should you typically maintain?',
        options: [
          '50+',
          '20-30',
          '3-5',
          '100+'
        ],
        correctAnswer: 2,
        explanation: '3-5 Tier 1 tokens is optimal for focused, well-planned trading.'
      },
      {
        id: 'app-final-10',
        question: 'Your seed phrase should be stored:',
        options: [
          'In cloud storage',
          'In your notes app',
          'Written on paper in a secure location',
          'Shared with support staff when asked'
        ],
        correctAnswer: 2,
        explanation: 'Seed phrases should only be on paper in a secure physical location - never digital.'
      },
      {
        id: 'app-final-11',
        question: 'What should you do with random tokens that appear in your wallet?',
        options: [
          'Sell them immediately',
          "Ignore them - don't interact",
          'Send them to friends',
          'Try to stake them'
        ],
        correctAnswer: 1,
        explanation: 'Random tokens are often scams - interacting with them can drain your wallet.'
      },
      {
        id: 'app-final-12',
        question: "It's safe to click links in DMs offering to help with wallet issues.",
        options: [
          'True',
          'False'
        ],
        correctAnswer: 1,
        explanation: 'Never click links in DMs. Legitimate support never DMs first.'
      },
      {
        id: 'app-final-13',
        question: 'Which tools help check if a token is a potential rug?',
        options: [
          'RugCheck only',
          'RugCheck, Bubblemaps, and Birdeye holder distribution',
          'Random Twitter advice',
          'None of these'
        ],
        correctAnswer: 1,
        explanation: 'Use multiple tools: RugCheck for contract analysis, Bubblemaps for wallet clustering, Birdeye for holder distribution.'
      },
      {
        id: 'app-final-14',
        question: 'When you feel strong urgency and FOMO to buy immediately, you should:',
        options: [
          'Buy faster',
          'Increase position size',
          'Slow down - this is often manipulation or emotion',
          'Tell everyone to buy'
        ],
        correctAnswer: 2,
        explanation: 'Strong emotions often signal manipulation. Slow down and think rationally.'
      },
      {
        id: 'app-final-15',
        question: 'What is the recommended wallet setup for security?',
        options: [
          'One wallet for everything',
          'Vault (holdings) + Trading + Burner (sketchy stuff)',
          'Share one wallet with friends',
          'Only use exchange wallets'
        ],
        correctAnswer: 1,
        explanation: 'Multiple wallets isolate risk: vault for holdings, trading for active use, burner for risky activities.'
      }
    ]
  }
}

// Helper function to get quiz by lesson slug
export function getApprenticeQuizByLessonSlug(lessonSlug) {
  const lessonId = Object.keys(apprenticeQuizzes.lessonQuizzes).find(id => {
    const quiz = apprenticeQuizzes.lessonQuizzes[id]
    return quiz.lessonId === lessonSlug || id === lessonSlug
  })
  return lessonId ? apprenticeQuizzes.lessonQuizzes[lessonId] : null
}
