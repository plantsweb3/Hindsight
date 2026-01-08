// Newcomer Module Quiz Data

export const NEWCOMER_QUIZZES = {
  'wallet-setup': {
    lessonId: 'wallet-setup',
    lessonSlug: 'wallet-setup',
    moduleSlug: 'newcomer',
    title: 'Setting Up Your Solana Wallet',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is a seed phrase?',
        options: [
          { id: 'a', text: 'A password you create to log into your wallet' },
          { id: 'b', text: 'A list of random words that can restore your wallet on any device' },
          { id: 'c', text: 'A security code sent to your email' },
          { id: 'd', text: "Your wallet's public address" },
        ],
        correctAnswer: 'b',
        explanation: 'Your seed phrase (usually 12 or 24 words) is the master key to your wallet. Anyone with these words can access your funds from anywhere in the world.',
      },
      {
        id: 'q2',
        type: 'true-false',
        question: "It's safe to store your seed phrase in a password manager or cloud storage.",
        correctAnswer: false,
        explanation: 'Never store your seed phrase digitally. If your password manager or cloud account gets hacked, your crypto is gone. Write it on paper and store it somewhere physically secure.',
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'Which wallet has the largest user base on Solana?',
        options: [
          { id: 'a', text: 'MetaMask' },
          { id: 'b', text: 'Solflare' },
          { id: 'c', text: 'Phantom' },
          { id: 'd', text: 'Backpack' },
        ],
        correctAnswer: 'c',
        explanation: 'Phantom has over 15 million users and is the standard wallet most Solana apps expect you to have.',
      },
      {
        id: 'q4',
        type: 'select-all',
        question: 'Select ALL safe places to store your seed phrase:',
        options: [
          { id: 'a', text: 'Screenshot on your phone' },
          { id: 'b', text: 'Written on paper in a fireproof safe' },
          { id: 'c', text: 'Notes app on your computer' },
          { id: 'd', text: 'Engraved on a metal plate in a secure location' },
          { id: 'e', text: 'Google Drive document' },
          { id: 'f', text: 'Written on paper in a bank safety deposit box' },
        ],
        correctAnswers: ['b', 'd', 'f'],
        explanation: 'Your seed phrase should only exist in physical form, stored in secure locations. Any digital storage can be hacked remotely.',
      },
      {
        id: 'q5',
        type: 'multiple-choice',
        question: 'What happens if you lose your seed phrase and your device breaks?',
        options: [
          { id: 'a', text: 'You can reset it through Phantom support' },
          { id: 'b', text: 'Your funds are lost forever with no way to recover them' },
          { id: 'c', text: 'You can recover it with your email address' },
          { id: 'd', text: 'Solana validators can restore your wallet' },
        ],
        correctAnswer: 'b',
        explanation: 'There is no customer support in crypto. No seed phrase = no access. This is why proper backup is critical.',
      },
    ],
  },

  'funding-wallet': {
    lessonId: 'funding-wallet',
    lessonSlug: 'funding-wallet',
    moduleSlug: 'newcomer',
    title: 'Funding Your Wallet',
    questions: [
      {
        id: 'q1',
        type: 'select-all',
        question: 'What do you need SOL for? Select ALL that apply:',
        options: [
          { id: 'a', text: 'Paying transaction fees (gas)' },
          { id: 'b', text: 'Swapping for memecoins you want to buy' },
          { id: 'c', text: 'Unlocking your wallet' },
          { id: 'd', text: 'Interacting with any Solana app' },
          { id: 'e', text: 'Creating a Phantom account' },
        ],
        correctAnswers: ['a', 'b', 'd'],
        explanation: "SOL is Solana's native token. You need it for transaction fees (usually <$0.01) and as your trading capital to swap for other tokens.",
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'When withdrawing SOL from Coinbase to Phantom, you can select any network since SOL is SOL.',
        correctAnswer: false,
        explanation: "You MUST select the Solana network. Sending on the wrong network (like Ethereum or BSC) sends your funds to a different blockchain where your Phantom wallet doesn't exist. Recovery is complicated or impossible.",
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: "What's typically the cheapest way to get SOL into your Phantom wallet?",
        options: [
          { id: 'a', text: 'Buy directly in Phantom with Apple Pay' },
          { id: 'b', text: 'Buy on a CEX like Coinbase and withdraw to Phantom' },
          { id: 'c', text: 'Use a credit card through MoonPay' },
          { id: 'd', text: 'All methods cost the same' },
        ],
        correctAnswer: 'b',
        explanation: 'Direct buy options in Phantom charge 2-5% fees through payment processors. Buying on a CEX and withdrawing typically has lower fees, though it requires more steps and KYC verification.',
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'How much SOL should you keep reserved for transaction fees?',
        options: [
          { id: 'a', text: 'None, fees are free on Solana' },
          { id: 'b', text: '0.05-0.1 SOL' },
          { id: 'c', text: 'At least 1 SOL' },
          { id: 'd', text: '10% of your total balance' },
        ],
        correctAnswer: 'b',
        explanation: "Always keep a small SOL buffer (0.05-0.1 SOL) for gas. If you swap ALL your SOL for a memecoin, you won't have gas to sell it later - you'd be stuck.",
      },
      {
        id: 'q5',
        type: 'multiple-choice',
        question: "What's the main difference between a CEX (like Coinbase) and a DEX (like Jupiter)?",
        options: [
          { id: 'a', text: 'CEXs are faster' },
          { id: 'b', text: 'DEXs require identity verification' },
          { id: 'c', text: 'On a CEX they hold your crypto; on a DEX you control your own wallet' },
          { id: 'd', text: 'CEXs have more tokens available' },
        ],
        correctAnswer: 'c',
        explanation: 'CEX = Centralized Exchange where the company holds your funds. DEX = Decentralized Exchange where you trade directly from your own wallet. "Not your keys, not your crypto" refers to CEX custody risks.',
      },
    ],
  },

  'what-are-memecoins': {
    lessonId: 'what-are-memecoins',
    lessonSlug: 'what-are-memecoins',
    moduleSlug: 'newcomer',
    title: 'What Are Memecoins?',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: "How is a token's market cap calculated?",
        options: [
          { id: 'a', text: 'Total trading volume in 24 hours' },
          { id: 'b', text: 'Price x Circulating Supply' },
          { id: 'c', text: 'Number of holders x Average buy size' },
          { id: 'd', text: 'Liquidity pool size x 2' },
        ],
        correctAnswer: 'b',
        explanation: 'Market Cap = Price x Supply. A $0.001 token with 1 billion supply has a $1M market cap. This is why "cheap" prices mean nothing - market cap tells the real story.',
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'A token priced at $0.00001 is "cheap" and has more room to grow than a token priced at $1.',
        correctAnswer: false,
        explanation: 'Price alone is meaningless. A $0.00001 token with 1 trillion supply has a $10M market cap. A $1 token with 1 million supply has only a $1M market cap. The "cheaper" token actually has 10x the valuation.',
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'Approximately what percentage of pump.fun tokens ever graduate to a DEX?',
        options: [
          { id: 'a', text: 'About 25%' },
          { id: 'b', text: 'About 10%' },
          { id: 'c', text: 'Less than 2%' },
          { id: 'd', text: 'About 50%' },
        ],
        correctAnswer: 'c',
        explanation: 'The vast majority of pump.fun tokens die on the bonding curve within hours. Less than 2% ever reach graduation. This is the brutal reality of memecoin trading.',
      },
      {
        id: 'q4',
        type: 'select-all',
        question: 'Select ALL factors that can help a memecoin succeed:',
        options: [
          { id: 'a', text: 'Strong narrative tied to current events or trends' },
          { id: 'b', text: 'Active community on Twitter and Telegram' },
          { id: 'c', text: 'High token price' },
          { id: 'd', text: 'Good timing and cultural relevance' },
          { id: 'e', text: 'Clean launch without obvious scam signals' },
          { id: 'f', text: 'Complex smart contract technology' },
        ],
        correctAnswers: ['a', 'b', 'd', 'e'],
        explanation: 'Memecoins succeed on attention, narrative, and community - not technology. Timing and cultural relevance matter more than any "utility."',
      },
      {
        id: 'q5',
        type: 'multiple-choice',
        question: 'What does "liquidity" mean in crypto trading?',
        options: [
          { id: 'a', text: 'How much water is in the market' },
          { id: 'b', text: 'How easily you can buy or sell without significantly moving the price' },
          { id: 'c', text: 'The total number of tokens in existence' },
          { id: 'd', text: 'How fast transactions confirm' },
        ],
        correctAnswer: 'b',
        explanation: "High liquidity = large trades don't move price much. Low liquidity = even small trades cause big price swings and you may get bad fills (slippage).",
      },
    ],
  },

  'first-trade-jupiter': {
    lessonId: 'first-trade-jupiter',
    lessonSlug: 'first-trade-jupiter',
    moduleSlug: 'newcomer',
    title: 'Your First Trade on Jupiter',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: "What is Jupiter's main function?",
        options: [
          { id: 'a', text: 'Creating new tokens' },
          { id: 'b', text: 'Storing your crypto securely' },
          { id: 'c', text: 'Finding the best swap prices by checking multiple DEXs' },
          { id: 'd', text: 'Providing loans for trading' },
        ],
        correctAnswer: 'c',
        explanation: 'Jupiter is a DEX aggregator - it checks prices across Raydium, Orca, Meteora, and other exchanges to route your trade for the best price.',
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'You should use 0.5% slippage when trading new, volatile memecoins.',
        correctAnswer: false,
        explanation: 'Low slippage (0.5%) is fine for stable pairs like SOL/USDC. For volatile memecoins, you typically need 5-15% slippage or your transactions will fail repeatedly as the price moves.',
      },
      {
        id: 'q3',
        type: 'select-all',
        question: "What are reliable ways to find a token's correct contract address? Select ALL that apply:",
        options: [
          { id: 'a', text: 'DexScreener (dexscreener.com)' },
          { id: 'b', text: 'Birdeye (birdeye.so)' },
          { id: 'c', text: 'Random links in Telegram DMs' },
          { id: 'd', text: "The project's official, verified Twitter account" },
          { id: 'e', text: 'Google search results' },
          { id: 'f', text: 'The pump.fun token page directly' },
        ],
        correctAnswers: ['a', 'b', 'd', 'f'],
        explanation: "Always verify contract addresses from trusted sources. Scammers create fake tokens with identical names - the contract address is the only way to know you're buying the real one.",
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'What happens if you set your slippage too low on a volatile token?',
        options: [
          { id: 'a', text: 'You get a better price' },
          { id: 'b', text: 'Your transaction fails because price moved beyond your tolerance' },
          { id: 'c', text: 'You pay higher fees' },
          { id: 'd', text: 'The token gets locked in your wallet' },
        ],
        correctAnswer: 'b',
        explanation: 'If the price moves more than your slippage tolerance between when you submit and when the transaction executes, it fails. You\'ll see "transaction failed" and need to retry with higher slippage.',
      },
      {
        id: 'q5',
        type: 'multiple-choice',
        question: 'Approximately how much are typical Solana transaction fees?',
        options: [
          { id: 'a', text: '$5-10 per transaction' },
          { id: 'b', text: '$0.50-1.00 per transaction' },
          { id: 'c', text: 'Less than $0.01 per transaction' },
          { id: 'd', text: 'Transactions are free' },
        ],
        correctAnswer: 'c',
        explanation: "Solana's low fees (usually under $0.01) are one of its main advantages. This makes frequent trading practical compared to Ethereum where fees can be $5-50+.",
      },
    ],
  },

  'pumpfun-basics': {
    lessonId: 'pumpfun-basics',
    lessonSlug: 'pumpfun-basics',
    moduleSlug: 'newcomer',
    title: 'Understanding Pump.fun Basics',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'How many tokens are available on a pump.fun bonding curve?',
        options: [
          { id: 'a', text: '1 billion (all of them)' },
          { id: 'b', text: '800 million' },
          { id: 'c', text: '500 million' },
          { id: 'd', text: 'It varies by token' },
        ],
        correctAnswer: 'b',
        explanation: 'Pump.fun tokens launch with 1 billion supply, but only 800 million go on the bonding curve for trading. The remaining 200 million become available after graduation.',
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'On a pump.fun bonding curve, early buyers pay higher prices than later buyers.',
        correctAnswer: false,
        explanation: 'The bonding curve starts price near zero. Early buyers get massive amounts of tokens for small SOL. As more people buy, the price increases along the curve. Early = cheaper, always.',
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'What market cap threshold triggers graduation on pump.fun?',
        options: [
          { id: 'a', text: '$10,000' },
          { id: 'b', text: '$50,000' },
          { id: 'c', text: 'Approximately $69,000' },
          { id: 'd', text: '$100,000' },
        ],
        correctAnswer: 'c',
        explanation: 'When the bonding curve fills (all 800M tokens purchased), the token graduates at roughly $69K market cap - a symbolic number chosen by the pump.fun team.',
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'Where do graduated pump.fun tokens migrate to as of 2025?',
        options: [
          { id: 'a', text: 'Raydium' },
          { id: 'b', text: 'Orca' },
          { id: 'c', text: 'PumpSwap' },
          { id: 'd', text: 'Jupiter directly' },
        ],
        correctAnswer: 'c',
        explanation: "Since March 2025, graduated tokens automatically move to PumpSwap - pump.fun's own DEX. Previously they went to Raydium. After graduation, tokens become tradeable on Jupiter and other aggregators.",
      },
      {
        id: 'q5',
        type: 'select-all',
        question: 'Select ALL red flags you should check before buying a token on pump.fun:',
        options: [
          { id: 'a', text: 'Top 10 wallets holding 30%+ of supply' },
          { id: 'b', text: 'Multiple wallets with suspiciously similar buy amounts' },
          { id: 'c', text: 'No social media links or community presence' },
          { id: 'd', text: 'Many wallets buying in the first few seconds (possible insiders)' },
          { id: 'e', text: 'The token has a dog in its logo' },
          { id: 'f', text: 'RugCheck showing mint authority not revoked' },
        ],
        correctAnswers: ['a', 'b', 'c', 'd', 'f'],
        explanation: 'Always check holder distribution, look for bundled wallet patterns, verify social presence, and run RugCheck. These basic checks can help you avoid obvious scams.',
      },
    ],
  },
}

// Newcomer Module Final Test (15 questions)
export const NEWCOMER_MODULE_TEST = {
  moduleId: 'newcomer',
  moduleSlug: 'newcomer',
  title: 'Newcomer Module Final Test',
  description: 'Comprehensive test covering all 5 lessons',
  passingScore: 12, // out of 15 (80%)
  questions: [
    {
      id: 'mt1',
      type: 'multiple-choice',
      question: 'Your seed phrase should be:',
      options: [
        { id: 'a', text: 'Memorized and never written down' },
        { id: 'b', text: 'Stored in an encrypted file on your computer' },
        { id: 'c', text: 'Written on paper and stored in a physically secure location' },
        { id: 'd', text: 'Shared with a trusted friend as backup' },
      ],
      correctAnswer: 'c',
      explanation: 'Your seed phrase should exist only in physical form, stored in secure locations like a safe or safety deposit box.',
    },
    {
      id: 'mt2',
      type: 'multiple-choice',
      question: 'What is the PRIMARY risk of storing your seed phrase in cloud storage?',
      options: [
        { id: 'a', text: 'It takes up too much space' },
        { id: 'b', text: 'If your cloud account is hacked, your crypto can be stolen remotely' },
        { id: 'c', text: 'Cloud storage is too slow' },
        { id: 'd', text: 'You might forget which cloud service you used' },
      ],
      correctAnswer: 'b',
      explanation: 'Cloud storage can be hacked remotely. If attackers gain access to your cloud account, they can steal your seed phrase and drain your wallet.',
    },
    {
      id: 'mt3',
      type: 'true-false',
      question: 'You can recover your Phantom wallet through customer support if you lose your seed phrase.',
      correctAnswer: false,
      explanation: 'There is no customer support recovery in crypto. Without your seed phrase, your funds are lost forever.',
    },
    {
      id: 'mt4',
      type: 'multiple-choice',
      question: 'When withdrawing SOL from an exchange to Phantom, what is the MOST critical step?',
      options: [
        { id: 'a', text: 'Choosing the fastest withdrawal option' },
        { id: 'b', text: 'Selecting the Solana network' },
        { id: 'c', text: 'Paying for priority processing' },
        { id: 'd', text: 'Using the maximum withdrawal amount' },
      ],
      correctAnswer: 'b',
      explanation: 'Selecting the correct network (Solana) is critical. Sending on the wrong network can result in lost funds.',
    },
    {
      id: 'mt5',
      type: 'select-all',
      question: 'What happens if you swap ALL your SOL for a memecoin? Select ALL that apply:',
      options: [
        { id: 'a', text: "You won't have gas to make any more transactions" },
        { id: 'b', text: "You won't be able to sell the memecoin without first getting more SOL" },
        { id: 'c', text: 'Your wallet will be locked' },
        { id: 'd', text: 'The memecoin will automatically convert back to SOL' },
      ],
      correctAnswers: ['a', 'b'],
      explanation: 'Without SOL for gas fees, you cannot execute any transactions including selling your memecoin.',
    },
    {
      id: 'mt6',
      type: 'multiple-choice',
      question: 'A token has a price of $0.0001 and a supply of 10 billion. What is its market cap?',
      options: [
        { id: 'a', text: '$100,000' },
        { id: 'b', text: '$1,000,000' },
        { id: 'c', text: '$10,000,000' },
        { id: 'd', text: '$10,000' },
      ],
      correctAnswer: 'b',
      explanation: 'Market Cap = Price x Supply = $0.0001 x 10,000,000,000 = $1,000,000',
    },
    {
      id: 'mt7',
      type: 'multiple-choice',
      question: 'What percentage of pump.fun tokens are estimated to fail (never graduate)?',
      options: [
        { id: 'a', text: 'About 50%' },
        { id: 'b', text: 'About 75%' },
        { id: 'c', text: 'About 90%' },
        { id: 'd', text: 'Over 98%' },
      ],
      correctAnswer: 'd',
      explanation: 'Less than 2% of pump.fun tokens ever graduate, meaning over 98% fail.',
    },
    {
      id: 'mt8',
      type: 'true-false',
      question: "High liquidity means that even large trades won't significantly move the price.",
      correctAnswer: true,
      explanation: 'High liquidity means the market can absorb large trades without significant price impact.',
    },
    {
      id: 'mt9',
      type: 'multiple-choice',
      question: 'What does Jupiter do differently than trading on a single DEX like Raydium?',
      options: [
        { id: 'a', text: 'It charges no fees' },
        { id: 'b', text: 'It checks multiple DEXs to find you the best price' },
        { id: 'c', text: 'It guarantees profits on every trade' },
        { id: 'd', text: 'It only works with verified tokens' },
      ],
      correctAnswer: 'b',
      explanation: 'Jupiter is a DEX aggregator that routes your trade through multiple DEXs to find the best price.',
    },
    {
      id: 'mt10',
      type: 'multiple-choice',
      question: "You're trying to buy a volatile memecoin on Jupiter but your transaction keeps failing. What should you do?",
      options: [
        { id: 'a', text: 'Try a different wallet' },
        { id: 'b', text: 'Increase your slippage tolerance' },
        { id: 'c', text: 'Wait for gas fees to go down' },
        { id: 'd', text: 'Report the bug to Jupiter support' },
      ],
      correctAnswer: 'b',
      explanation: 'Failed transactions on volatile tokens usually mean the price moved beyond your slippage tolerance. Increase slippage to 5-15% for volatile memecoins.',
    },
    {
      id: 'mt11',
      type: 'select-all',
      question: "How can you verify you're buying the correct token and not a scam copy? Select ALL that apply:",
      options: [
        { id: 'a', text: 'Check the contract address on DexScreener or Birdeye' },
        { id: 'b', text: "Verify the address matches the project's official Twitter" },
        { id: 'c', text: 'Trust that the token name is correct' },
        { id: 'd', text: 'Check that the token page on pump.fun matches other sources' },
        { id: 'e', text: 'Look for the highest trading volume' },
      ],
      correctAnswers: ['a', 'b', 'd'],
      explanation: 'Always verify contract addresses from multiple trusted sources. Token names can be duplicated by scammers.',
    },
    {
      id: 'mt12',
      type: 'multiple-choice',
      question: "On pump.fun's bonding curve, who gets the best price?",
      options: [
        { id: 'a', text: 'Whoever buys the largest amount' },
        { id: 'b', text: 'The first buyers' },
        { id: 'c', text: 'The last buyers before graduation' },
        { id: 'd', text: 'Everyone pays the same price' },
      ],
      correctAnswer: 'b',
      explanation: 'The bonding curve starts price near zero and increases with each purchase. Early buyers always get the cheapest prices.',
    },
    {
      id: 'mt13',
      type: 'true-false',
      question: 'After a token graduates from pump.fun, it can only be traded on PumpSwap.',
      correctAnswer: false,
      explanation: 'After graduation, tokens are tradeable on PumpSwap AND accessible through aggregators like Jupiter, which can route through any DEX.',
    },
    {
      id: 'mt14',
      type: 'multiple-choice',
      question: 'What does RugCheck.xyz help you identify?',
      options: [
        { id: 'a', text: 'The best time to buy a token' },
        { id: 'b', text: 'Potential scam signals like active mint authority and concentrated holdings' },
        { id: 'c', text: 'Price predictions for tokens' },
        { id: 'd', text: 'Which influencers are promoting a token' },
      ],
      correctAnswer: 'b',
      explanation: 'RugCheck analyzes token contracts to identify potential red flags like mint authority not being revoked or concentrated token holdings.',
    },
    {
      id: 'mt15',
      type: 'select-all',
      question: 'Which of the following are signs of a potential scam or high-risk token? Select ALL that apply:',
      options: [
        { id: 'a', text: 'Mint authority has not been revoked' },
        { id: 'b', text: 'Top 10 wallets control over 40% of supply' },
        { id: 'c', text: 'Many fresh wallets bought in the first 30 seconds' },
        { id: 'd', text: 'No Twitter, Telegram, or community presence' },
        { id: 'e', text: 'The token has been live for less than 1 hour' },
        { id: 'f', text: 'Multiple wallets with identical purchase amounts' },
      ],
      correctAnswers: ['a', 'b', 'c', 'd', 'f'],
      explanation: 'These are all red flags that suggest potential manipulation or scam activity. A token being new (e) is not inherently a red flag.',
    },
  ],
}

// Helper to get quiz by lesson slug
export function getQuizByLessonSlug(lessonSlug) {
  return NEWCOMER_QUIZZES[lessonSlug] || null
}

// Helper to get module test
export function getModuleTest(moduleSlug) {
  if (moduleSlug === 'newcomer') {
    return NEWCOMER_MODULE_TEST
  }
  return null
}

// All quiz IDs for this module
export const NEWCOMER_QUIZ_IDS = Object.keys(NEWCOMER_QUIZZES)
