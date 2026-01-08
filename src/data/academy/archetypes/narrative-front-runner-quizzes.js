export const narrativeFrontRunnerQuizzes = {
  moduleId: 'narrative-front-runner',

  lessonQuizzes: {
    'nfr-1': {
      title: 'What Is Narrative Trading?',
      questions: [
        {
          id: 'nfr-1-q1',
          question: 'What is the primary driver of memecoin price movements?',
          options: [
            { id: 'a', text: 'Revenue and earnings reports' },
            { id: 'b', text: 'Narrative and collective belief' },
            { id: 'c', text: 'Technical analysis patterns' },
            { id: 'd', text: 'Developer activity metrics' }
          ],
          correctAnswer: 'b',
          explanation: 'In memecoins, narrative is the only thing that matters. Stories and collective belief create buying pressure that becomes self-fulfilling.'
        },
        {
          id: 'nfr-1-q2',
          question: 'During which phase of the narrative lifecycle should a Front Runner ideally enter?',
          options: [
            { id: 'a', text: 'Phase 4: Peak Hype' },
            { id: 'b', text: 'Phase 1 or 2: Emergence/Early Adoption' },
            { id: 'c', text: 'Phase 5: Exhaustion' },
            { id: 'd', text: 'Phase 3: Viral Spread' }
          ],
          correctAnswer: 'b',
          explanation: 'Narrative Front Runners enter early in Phase 1-2 when smart money is positioning, before the narrative goes viral.'
        },
        {
          id: 'nfr-1-q3',
          question: 'What is the main weakness of the Narrative Front Runner archetype?',
          options: [
            { id: 'a', text: 'Missing entries due to over-analysis' },
            { id: 'b', text: 'FOMO - entering narratives too late' },
            { id: 'c', text: 'Taking profits too early' },
            { id: 'd', text: 'Ignoring technical indicators' }
          ],
          correctAnswer: 'b',
          explanation: 'The Narrative Front Runner\'s main weakness is FOMO - the urge to enter narratives after they\'ve already started trending.'
        }
      ]
    },

    'nfr-2': {
      title: 'Finding Narratives Before They Trend',
      questions: [
        {
          id: 'nfr-2-q1',
          question: 'Which is the BEST source for finding narratives early?',
          options: [
            { id: 'a', text: 'Mainstream crypto news sites' },
            { id: 'b', text: 'Alpha groups and smart money wallets' },
            { id: 'c', text: 'YouTube crypto influencers' },
            { id: 'd', text: 'Reddit front page posts' }
          ],
          correctAnswer: 'b',
          explanation: 'Alpha groups and tracking smart money wallets give you early signals before narratives spread to mainstream channels.'
        },
        {
          id: 'nfr-2-q2',
          question: 'What does increasing private chat mentions combined with flat price action typically signal?',
          options: [
            { id: 'a', text: 'The narrative is dying' },
            { id: 'b', text: 'Smart money accumulation phase' },
            { id: 'c', text: 'Time to sell immediately' },
            { id: 'd', text: 'The token is a rug pull' }
          ],
          correctAnswer: 'b',
          explanation: 'When chatter increases but price stays flat, smart money is often quietly accumulating before the breakout.'
        },
        {
          id: 'nfr-2-q3',
          question: 'Which signal indicates a narrative is already too late to enter?',
          options: [
            { id: 'a', text: 'First mentions in private alpha chats' },
            { id: 'b', text: 'Smart money wallets starting to buy' },
            { id: 'c', text: 'Mainstream influencers tweeting with engagement' },
            { id: 'd', text: 'New token pairs appearing on DEX' }
          ],
          correctAnswer: 'c',
          explanation: 'When mainstream influencers are already promoting with high engagement, you\'re in Phase 3-4 and likely too late for the best entry.'
        }
      ]
    },

    'nfr-3': {
      title: 'Evaluating Narrative Strength',
      questions: [
        {
          id: 'nfr-3-q1',
          question: 'What makes a narrative "sticky" and likely to persist?',
          options: [
            { id: 'a', text: 'Complex technical explanations' },
            { id: 'b', text: 'Simple, emotionally resonant story with clear villain/hero' },
            { id: 'c', text: 'Celebrity endorsement alone' },
            { id: 'd', text: 'High initial market cap' }
          ],
          correctAnswer: 'b',
          explanation: 'Sticky narratives are simple to explain, emotionally resonant, and often have clear heroes/villains that people can rally around.'
        },
        {
          id: 'nfr-3-q2',
          question: 'Which combination indicates a STRONG narrative setup?',
          options: [
            { id: 'a', text: 'High volume + declining holder count' },
            { id: 'b', text: 'Growing wallets + organic social spread + catalyst upcoming' },
            { id: 'c', text: 'Low volume + static holder count' },
            { id: 'd', text: 'Paid promotion + rapid price increase' }
          ],
          correctAnswer: 'b',
          explanation: 'Strong narratives show organic growth in holders, natural social spread (not paid), and have upcoming catalysts to drive further attention.'
        },
        {
          id: 'nfr-3-q3',
          question: 'What is "narrative velocity"?',
          options: [
            { id: 'a', text: 'How fast the price is moving' },
            { id: 'b', text: 'The speed at which a story spreads across social platforms' },
            { id: 'c', text: 'Trading volume per minute' },
            { id: 'd', text: 'Number of holders gained per day' }
          ],
          correctAnswer: 'b',
          explanation: 'Narrative velocity measures how quickly a story spreads from inner circles to mainstream - this determines how much time you have to enter.'
        }
      ]
    },

    'nfr-4': {
      title: 'Timing Your Entry',
      questions: [
        {
          id: 'nfr-4-q1',
          question: 'What is the ideal entry point for a Narrative Front Runner?',
          options: [
            { id: 'a', text: 'During the parabolic run-up' },
            { id: 'b', text: 'Late Phase 1 or early Phase 2, before viral spread' },
            { id: 'c', text: 'After the first major pullback' },
            { id: 'd', text: 'When the narrative hits mainstream news' }
          ],
          correctAnswer: 'b',
          explanation: 'The sweet spot is late Phase 1/early Phase 2 - the narrative is validated but hasn\'t gone viral yet.'
        },
        {
          id: 'nfr-4-q2',
          question: 'You discover a strong narrative but the token has already 3x\'d. What should you do?',
          options: [
            { id: 'a', text: 'FOMO in immediately before you miss more upside' },
            { id: 'b', text: 'Evaluate if you\'re Phase 2 or 3, size accordingly or skip' },
            { id: 'c', text: 'Wait for it to 10x then enter' },
            { id: 'd', text: 'Short the token' }
          ],
          correctAnswer: 'b',
          explanation: 'Always assess which phase you\'re entering. A 3x doesn\'t mean it\'s over, but size smaller if you\'re in Phase 3, or skip entirely if it\'s too late.'
        },
        {
          id: 'nfr-4-q3',
          question: 'What is "confirmation stacking"?',
          options: [
            { id: 'a', text: 'Waiting for multiple technical indicators to align' },
            { id: 'b', text: 'Getting validation from multiple independent narrative signals before entering' },
            { id: 'c', text: 'Adding to your position multiple times' },
            { id: 'd', text: 'Confirming the token contract is safe' }
          ],
          correctAnswer: 'b',
          explanation: 'Confirmation stacking means waiting for multiple independent signals (smart money buying, organic social growth, upcoming catalyst) before committing.'
        }
      ]
    },

    'nfr-5': {
      title: 'Managing Narrative Positions',
      questions: [
        {
          id: 'nfr-5-q1',
          question: 'How should you size a narrative trade where you entered in Phase 1?',
          options: [
            { id: 'a', text: 'Go all-in for maximum profit' },
            { id: 'b', text: 'Start with conviction size, scale in as narrative confirms' },
            { id: 'c', text: 'Minimum position only' },
            { id: 'd', text: 'Wait until Phase 3 to add size' }
          ],
          correctAnswer: 'b',
          explanation: 'Early entries warrant conviction sizing, but scale in as the narrative confirms to manage risk of narratives that don\'t materialize.'
        },
        {
          id: 'nfr-5-q2',
          question: 'Your narrative play is up 5x but the story is still spreading. What\'s the Front Runner approach?',
          options: [
            { id: 'a', text: 'Sell everything to lock in profits' },
            { id: 'b', text: 'Hold entire position for more upside' },
            { id: 'c', text: 'Take some profit, let remainder ride with trailing stop' },
            { id: 'd', text: 'Add more to the position' }
          ],
          correctAnswer: 'c',
          explanation: 'The Front Runner approach is to secure some profit while maintaining exposure. Taking 2-3x initial investment and letting the rest ride with a trailing stop is common.'
        },
        {
          id: 'nfr-5-q3',
          question: 'What should trigger re-evaluation of your narrative position?',
          options: [
            { id: 'a', text: 'Any price dip of 10% or more' },
            { id: 'b', text: 'Changes in the underlying narrative thesis' },
            { id: 'c', text: 'When Twitter engagement decreases' },
            { id: 'd', text: 'After exactly 7 days of holding' }
          ],
          correctAnswer: 'b',
          explanation: 'Price action alone shouldn\'t change your thesis. Re-evaluate when the narrative itself changes - new information, competing narratives, or thesis invalidation.'
        }
      ]
    },

    'nfr-6': {
      title: 'Exit Strategies for Narrative Trades',
      questions: [
        {
          id: 'nfr-6-q1',
          question: 'What is the strongest exit signal for a narrative trade?',
          options: [
            { id: 'a', text: 'Price hits your target' },
            { id: 'b', text: 'Narrative reaches mainstream saturation with declining engagement' },
            { id: 'c', text: 'The token is mentioned on CNBC' },
            { id: 'd', text: 'Trading volume decreases slightly' }
          ],
          correctAnswer: 'b',
          explanation: 'When everyone knows about the narrative but engagement is declining, you\'re in Phase 4-5 and smart money is exiting. This is your primary exit signal.'
        },
        {
          id: 'nfr-6-q2',
          question: 'What is the "Grandma Test" for narrative exits?',
          options: [
            { id: 'a', text: 'If your grandma can explain the token, it\'s a buy' },
            { id: 'b', text: 'If non-crypto people are asking about it, the narrative is near peak' },
            { id: 'c', text: 'If grandma doesn\'t approve, don\'t invest' },
            { id: 'd', text: 'A test of token legitimacy' }
          ],
          correctAnswer: 'b',
          explanation: 'When non-crypto people start asking about a narrative, it means the story has reached maximum saturation and is likely near its peak.'
        },
        {
          id: 'nfr-6-q3',
          question: 'You\'re holding a narrative play and a stronger competing narrative emerges. What should you do?',
          options: [
            { id: 'a', text: 'Diamond hands - never sell' },
            { id: 'b', text: 'Immediately dump and rotate to new narrative' },
            { id: 'c', text: 'Assess if your narrative is weakened, consider partial rotation' },
            { id: 'd', text: 'Short your current position' }
          ],
          correctAnswer: 'c',
          explanation: 'Competing narratives can weaken your current play. Assess the relative strength and consider partial rotation rather than all-or-nothing moves.'
        }
      ]
    },

    'nfr-7': {
      title: 'When Narratives Fail',
      questions: [
        {
          id: 'nfr-7-q1',
          question: 'What\'s the most common reason narratives fail to materialize?',
          options: [
            { id: 'a', text: 'Poor tokenomics' },
            { id: 'b', text: 'The story never resonated beyond inner circles' },
            { id: 'c', text: 'Technical issues with the blockchain' },
            { id: 'd', text: 'Market cap was too low' }
          ],
          correctAnswer: 'b',
          explanation: 'Most narratives fail because they never achieve escape velocity - they stay in inner circles and never capture broader attention.'
        },
        {
          id: 'nfr-7-q2',
          question: 'How should you handle a narrative position that\'s down 50% with no signs of recovery?',
          options: [
            { id: 'a', text: 'Average down aggressively' },
            { id: 'b', text: 'Hold forever - it could come back' },
            { id: 'c', text: 'Accept the loss, free up capital for next opportunity' },
            { id: 'd', text: 'Blame the market makers' }
          ],
          correctAnswer: 'c',
          explanation: 'Capital efficiency matters. If the narrative has failed, holding dead money prevents you from catching the next opportunity. Accept the loss and move on.'
        },
        {
          id: 'nfr-7-q3',
          question: 'What\'s a "zombie narrative"?',
          options: [
            { id: 'a', text: 'A narrative about zombie tokens' },
            { id: 'b', text: 'A narrative that died but keeps getting revived without new catalysts' },
            { id: 'c', text: 'A very slow-moving narrative' },
            { id: 'd', text: 'A narrative with no Twitter presence' }
          ],
          correctAnswer: 'b',
          explanation: 'Zombie narratives keep getting pumped by hopeful holders but lack genuine new catalysts. They tend to make lower highs each cycle - avoid these.'
        }
      ]
    },

    'nfr-8': {
      title: 'Building Your Narrative Edge',
      questions: [
        {
          id: 'nfr-8-q1',
          question: 'What creates a sustainable edge in narrative trading?',
          options: [
            { id: 'a', text: 'Following the most popular CT accounts' },
            { id: 'b', text: 'Unique information sources + pattern recognition + emotional discipline' },
            { id: 'c', text: 'Trading the largest cap tokens only' },
            { id: 'd', text: 'Using leverage on every trade' }
          ],
          correctAnswer: 'b',
          explanation: 'Edge comes from seeing things before others (information), recognizing patterns (skill), and not FOMOing or panic selling (discipline).'
        },
        {
          id: 'nfr-8-q2',
          question: 'How should you develop your "narrative radar"?',
          options: [
            { id: 'a', text: 'Copy trade one successful trader' },
            { id: 'b', text: 'Diversify information sources and track what signals preceded winning trades' },
            { id: 'c', text: 'Only check Twitter once a day' },
            { id: 'd', text: 'Ignore social media entirely' }
          ],
          correctAnswer: 'b',
          explanation: 'Build your radar by tracking multiple independent sources and doing post-mortems on trades to identify which early signals were most predictive.'
        },
        {
          id: 'nfr-8-q3',
          question: 'What\'s the Front Runner\'s approach to FOMO management?',
          options: [
            { id: 'a', text: 'Never feel FOMO' },
            { id: 'b', text: 'Give in to FOMO but size smaller' },
            { id: 'c', text: 'Have rules that prevent late entries regardless of emotion' },
            { id: 'd', text: 'Only trade when feeling maximum FOMO' }
          ],
          correctAnswer: 'c',
          explanation: 'You can\'t eliminate FOMO, but you can have rules that override it. Pre-defined criteria for "too late" entries protect you when emotions run high.'
        }
      ]
    }
  },

  finalTest: {
    title: 'Narrative Front Runner Final Assessment',
    passingScore: 80,
    xpReward: 100,
    questions: [
      {
        id: 'nfr-final-1',
        question: 'What is the primary driver of memecoin price movements?',
        options: [
          { id: 'a', text: 'Technical fundamentals' },
          { id: 'b', text: 'Narrative and collective belief' },
          { id: 'c', text: 'Developer activity' },
          { id: 'd', text: 'Market cap rankings' }
        ],
        correctAnswer: 'b',
        explanation: 'Narrative is the only thing that matters in memecoins - it creates the collective belief that drives price action.'
      },
      {
        id: 'nfr-final-2',
        question: 'What phase of the narrative lifecycle is ideal for entry?',
        options: [
          { id: 'a', text: 'Phase 1-2: Early emergence' },
          { id: 'b', text: 'Phase 3: Viral spread' },
          { id: 'c', text: 'Phase 4: Peak hype' },
          { id: 'd', text: 'Phase 5: Exhaustion' }
        ],
        correctAnswer: 'a',
        explanation: 'Entering in Phase 1-2 gives you the best risk/reward before the narrative goes viral.'
      },
      {
        id: 'nfr-final-3',
        question: 'Which is the BEST early narrative signal?',
        options: [
          { id: 'a', text: 'Trending on Twitter' },
          { id: 'b', text: 'Smart money wallets accumulating' },
          { id: 'c', text: 'YouTube videos published' },
          { id: 'd', text: 'Listed on major exchanges' }
        ],
        correctAnswer: 'b',
        explanation: 'Smart money movement precedes public attention - it\'s the earliest reliable signal.'
      },
      {
        id: 'nfr-final-4',
        question: 'What makes a narrative "sticky"?',
        options: [
          { id: 'a', text: 'Complex technical details' },
          { id: 'b', text: 'Simple, emotionally resonant story' },
          { id: 'c', text: 'High market cap' },
          { id: 'd', text: 'Lots of paid promotion' }
        ],
        correctAnswer: 'b',
        explanation: 'Sticky narratives are simple to explain and emotionally compelling - they spread naturally.'
      },
      {
        id: 'nfr-final-5',
        question: 'What is "confirmation stacking"?',
        options: [
          { id: 'a', text: 'Adding to winning positions' },
          { id: 'b', text: 'Multiple independent signals validating your thesis' },
          { id: 'c', text: 'Technical indicator confluence' },
          { id: 'd', text: 'Verifying contract safety' }
        ],
        correctAnswer: 'b',
        explanation: 'Confirmation stacking means waiting for multiple independent narrative signals before committing.'
      },
      {
        id: 'nfr-final-6',
        question: 'A narrative is up 5x but still spreading. What should you do?',
        options: [
          { id: 'a', text: 'Sell everything' },
          { id: 'b', text: 'Add more' },
          { id: 'c', text: 'Take partial profits, let remainder ride' },
          { id: 'd', text: 'Do nothing' }
        ],
        correctAnswer: 'c',
        explanation: 'Secure some profit while maintaining exposure - the Front Runner balances greed and caution.'
      },
      {
        id: 'nfr-final-7',
        question: 'What is the strongest exit signal?',
        options: [
          { id: 'a', text: 'Price target hit' },
          { id: 'b', text: 'Narrative saturation with declining engagement' },
          { id: 'c', text: 'Volume increase' },
          { id: 'd', text: 'New holders joining' }
        ],
        correctAnswer: 'b',
        explanation: 'When everyone knows the narrative but engagement falls, smart money is exiting. Time to leave.'
      },
      {
        id: 'nfr-final-8',
        question: 'What is the "Grandma Test"?',
        options: [
          { id: 'a', text: 'Token safety check' },
          { id: 'b', text: 'When non-crypto people ask, narrative is near peak' },
          { id: 'c', text: 'Getting financial advice from elders' },
          { id: 'd', text: 'Long-term hold test' }
        ],
        correctAnswer: 'b',
        explanation: 'When normies know about it, the narrative has reached maximum saturation.'
      },
      {
        id: 'nfr-final-9',
        question: 'What\'s the main weakness of the Narrative Front Runner?',
        options: [
          { id: 'a', text: 'Over-analysis paralysis' },
          { id: 'b', text: 'FOMO - entering too late' },
          { id: 'c', text: 'Selling too early' },
          { id: 'd', text: 'Ignoring fundamentals' }
        ],
        correctAnswer: 'b',
        explanation: 'The Front Runner\'s curse is FOMO - the urge to chase narratives after they\'ve already run.'
      },
      {
        id: 'nfr-final-10',
        question: 'How should you handle a failed narrative position?',
        options: [
          { id: 'a', text: 'Average down' },
          { id: 'b', text: 'Hold forever' },
          { id: 'c', text: 'Accept loss, free capital for next opportunity' },
          { id: 'd', text: 'Double down' }
        ],
        correctAnswer: 'c',
        explanation: 'Dead capital in failed narratives prevents you from catching the next wave. Move on.'
      },
      {
        id: 'nfr-final-11',
        question: 'What is a "zombie narrative"?',
        options: [
          { id: 'a', text: 'Horror-themed tokens' },
          { id: 'b', text: 'Dead narrative repeatedly revived without new catalysts' },
          { id: 'c', text: 'Very slow narratives' },
          { id: 'd', text: 'Anonymous team tokens' }
        ],
        correctAnswer: 'b',
        explanation: 'Zombie narratives make lower highs each cycle - avoid them, they trap capital.'
      },
      {
        id: 'nfr-final-12',
        question: 'How do you build sustainable edge in narrative trading?',
        options: [
          { id: 'a', text: 'Follow top influencers' },
          { id: 'b', text: 'Unique sources + pattern recognition + discipline' },
          { id: 'c', text: 'Use maximum leverage' },
          { id: 'd', text: 'Trade only top 100 tokens' }
        ],
        correctAnswer: 'b',
        explanation: 'Edge comes from seeing things before others, recognizing patterns, and controlling emotions.'
      },
      {
        id: 'nfr-final-13',
        question: 'When a competing narrative emerges, you should:',
        options: [
          { id: 'a', text: 'Ignore it completely' },
          { id: 'b', text: 'Immediately switch' },
          { id: 'c', text: 'Assess relative strength, consider partial rotation' },
          { id: 'd', text: 'Short your current position' }
        ],
        correctAnswer: 'c',
        explanation: 'Evaluate how the new narrative affects your current thesis before making any moves.'
      },
      {
        id: 'nfr-final-14',
        question: 'What indicates a narrative has already moved too far?',
        options: [
          { id: 'a', text: 'First mentions in alpha chats' },
          { id: 'b', text: 'Smart money starting to buy' },
          { id: 'c', text: 'Mainstream influencers with high engagement' },
          { id: 'd', text: 'DEX listing' }
        ],
        correctAnswer: 'c',
        explanation: 'Mainstream influencer coverage with high engagement means you\'re in Phase 3-4 - likely too late.'
      },
      {
        id: 'nfr-final-15',
        question: 'The Front Runner\'s approach to FOMO is:',
        options: [
          { id: 'a', text: 'Eliminate FOMO entirely' },
          { id: 'b', text: 'Give in but size smaller' },
          { id: 'c', text: 'Have rules that override emotional decisions' },
          { id: 'd', text: 'Only trade when feeling FOMO' }
        ],
        correctAnswer: 'c',
        explanation: 'You can\'t eliminate FOMO, but pre-defined rules protect you when emotions are high.'
      }
    ]
  }
}
