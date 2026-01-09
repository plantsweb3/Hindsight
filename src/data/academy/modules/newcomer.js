// Newcomer Module - Your First Steps
// Local data file for Trading 101 content

export const newcomerModule = {
  id: 'newcomer',
  slug: 'newcomer',
  title: 'Newcomer',
  subtitle: 'Your First Steps',
  description: 'Get set up and make your first moves',
  icon: '🌱',
  difficulty: 'beginner',
  lessonCount: 5,
  lessons: [
    {
      id: 'newcomer-1',
      slug: 'wallet-setup',
      title: 'Setting Up Your Solana Wallet',
      description: 'What a wallet is, how to install Phantom, and critical security practices',
      readTime: 5,
      difficulty: 'beginner',
      order: 1,
      content: `## What You'll Learn
- What a Solana wallet actually is and why you need one
- How to install and set up Phantom (the most popular Solana wallet)
- Critical security practices that will protect your money

---

## Your Wallet Is Your Identity

In traditional finance, you have a bank account. In crypto, you have a wallet. But here's the key difference: **there's no bank**. You are your own bank. No customer service hotline. No fraud protection. No password reset.

This is the most important thing to understand before you start trading memecoins: **if you lose access to your wallet or someone steals your keys, your money is gone forever.** No one can reverse the transaction. No one can recover your funds.

Sound scary? Good. That healthy fear will keep you safe. Now let's set you up properly.

---

## Why Phantom?

Phantom is the most widely used wallet in the Solana ecosystem, with over 15 million users. It's the "MetaMask of Solana" - meaning it's the standard that most apps expect you to have.

**Why traders choose Phantom:**
- Built specifically for Solana (fast and optimized)
- Available as browser extension and mobile app
- Built-in swap feature, staking, and NFT gallery
- Transaction preview shows you what you're signing before you approve
- Supports hardware wallet connection for extra security
- Now also supports Ethereum, Polygon, and Bitcoin

Other solid options exist (Solflare, Backpack), but Phantom is where most beginners should start.

---

## Installation: Step by Step

### Desktop (Recommended for Trading)

1. **Go directly to phantom.app** - Never Google "Phantom wallet" and click an ad. Scammers run fake sites. Type the URL yourself or use this link: https://phantom.app

2. **Click "Download" and select your browser** - Phantom works on Chrome, Brave, Firefox, and Edge

3. **Add the extension** - Click "Add to Chrome" (or your browser) and confirm

4. **Create a new wallet** - Click the Phantom icon in your browser toolbar and select "Create a new wallet"

5. **SET A STRONG PASSWORD** - This password locks your wallet on this device. Make it unique and strong.

6. **WRITE DOWN YOUR SEED PHRASE** - This is the most critical step. More on this below.

### Mobile

1. Download Phantom from the official App Store (iOS) or Google Play (Android)
2. Open the app and tap "Create a new wallet"
3. Set up biometric unlock (Face ID, fingerprint)
4. Write down your seed phrase

---

## Your Seed Phrase: The Master Key

When you create your wallet, Phantom gives you a **seed phrase** - a list of 12 random words in a specific order. This phrase IS your wallet. Anyone who has these words can access your funds from any device, anywhere in the world.

### The Rules (Non-Negotiable)

**DO:**
- Write it down on paper immediately
- Store it somewhere secure (safe, lockbox, fireproof container)
- Consider making multiple copies stored in different locations
- Keep it offline forever

**DO NOT:**
- Take a screenshot
- Save it in your notes app
- Email it to yourself
- Store it in cloud storage (Google Drive, iCloud, Dropbox)
- Store it in a password manager
- Tell anyone - ever
- Enter it on any website except when restoring YOUR wallet

### Why This Matters

If your computer gets hacked, your phone gets stolen, or you fall for a phishing scam, the attacker needs your seed phrase to steal your funds. If it only exists on paper locked in your safe, they can't get it remotely.

**Real talk:** Most people who lose crypto don't get "hacked" by sophisticated attackers. They either lose their seed phrase, store it somewhere insecure, or enter it on a fake website. Don't be that person.

---

## Wallet Hygiene: Best Practices

### Use Multiple Wallets

Experienced traders don't use one wallet for everything. They separate:

1. **Vault Wallet** - Long-term holds and larger amounts. Rarely connects to apps. Consider pairing with a hardware wallet (Ledger) for maximum security.

2. **Trading Wallet** - Active trading, connects to DEXs and trading terminals. Only keep what you're willing to risk.

3. **Burner Wallet** - Testing sketchy sites, claiming airdrops, minting unknown NFTs. Treat funds here as expendable.

You can create multiple wallets in Phantom by clicking your profile and "Add / Connect Wallet" → "Create a new wallet."

### Check Before You Sign

Phantom shows you a preview of every transaction before you approve it. **Read it.** Look for:
- What are you approving?
- What tokens are being moved?
- Does this match what you expected?

If something looks off, reject the transaction. Scammers create fake sites that look identical to real ones but ask you to sign transactions that drain your wallet.

### Revoke Permissions Regularly

When you connect your wallet to apps, you grant them permissions. Periodically review and revoke access from apps you no longer use. You can do this at revoke.solscan.io.

---

## Quick Start Checklist

- Installed Phantom from phantom.app (not from Google search)
- Created new wallet with strong password
- Wrote down seed phrase on paper
- Stored seed phrase in secure location (not digitally)
- Understand that losing seed phrase = losing funds forever
- Know never to enter seed phrase on any website

---

## What's Next

Your wallet is ready. But it's empty. In the next lesson, you'll learn how to get SOL into your wallet so you can start trading.`
    },
    {
      id: 'newcomer-2',
      slug: 'funding-wallet',
      title: 'Funding Your Wallet: CEX to DEX',
      description: 'How to get SOL into your wallet via different methods',
      readTime: 5,
      difficulty: 'beginner',
      order: 2,
      content: `## What You'll Learn
- How to get SOL (Solana's native token) into your wallet
- The difference between CEX and DEX trading
- Multiple methods to fund your wallet, from easiest to cheapest

---

## Why You Need SOL

Before you can trade memecoins, you need SOL in your wallet. SOL is Solana's native token, and it serves two purposes:

1. **Gas fees** - Every transaction on Solana costs a tiny amount of SOL (usually less than $0.01). Without SOL, you literally cannot do anything.

2. **Trading capital** - You'll swap SOL for the memecoins you want to buy. SOL is the base currency for most trading pairs.

**Recommendation:** Start with a small amount while you're learning. $50-100 is enough to get familiar with the ecosystem without risking serious money.

---

## Method 1: Buy Directly in Phantom (Easiest)

Phantom lets you buy SOL without leaving the app using Apple Pay, Google Pay, or card.

**How to do it:**
1. Open Phantom and tap "Buy"
2. Select SOL
3. Enter the dollar amount you want
4. Choose your payment method (Coinbase Pay, MoonPay, Robinhood)
5. Complete the purchase

**Pros:**
- Fastest option (funds arrive in minutes)
- No extra accounts needed
- Simple for beginners

**Cons:**
- Higher fees (payment processors take 2-5%)
- Amount limits vary by provider
- Requires identity verification

This is the easiest option for getting started quickly.

---

## Method 2: Buy on an Exchange and Transfer (Cheapest)

For lower fees and higher limits, buy SOL on a centralized exchange (CEX) and send it to your Phantom wallet.

### Step 1: Set Up an Exchange Account

Popular exchanges for buying SOL:
- **Coinbase** - Most beginner-friendly, widely trusted in the US
- **Kraken** - Good security reputation, lower fees than Coinbase
- **Binance** - Lowest fees, largest volume (not available in some US states)

Create an account, verify your identity (required by law), and link your bank account or card.

### Step 2: Buy SOL

Navigate to SOL on the exchange and place a buy order. For beginners, a "market order" is simplest - you'll get SOL at the current price immediately.

### Step 3: Withdraw to Phantom

This is the critical step. You're moving YOUR SOL from the exchange (where they hold it for you) to YOUR wallet (where only you control it).

1. In Phantom, tap "Receive" or click your wallet address to copy it
2. In your exchange, go to "Withdraw" or "Send"
3. Select SOL as the asset
4. **SELECT SOLANA NETWORK** - This is crucial. Exchanges offer multiple networks. You MUST choose Solana. Sending on the wrong network = lost funds.
5. Paste your Phantom wallet address
6. Double-check the address (at least first and last 4 characters)
7. Confirm the withdrawal
8. Wait a few minutes for funds to arrive

**Warning:** Always send a small test amount first (like $5 worth) to make sure everything works before sending larger amounts.

---

## Method 3: Swap From Another Crypto

If you already hold crypto on another chain (ETH, USDC on Ethereum, etc.), you can bridge it to Solana.

**Options:**
- **Phantom's Crosschain Swapper** - Swap ETH, USDC, or other tokens directly to SOL within Phantom
- **Jupiter Bridge** - At jup.ag, you can bridge assets from Ethereum and other chains

Bridging is more advanced and has its own risks and fees. For beginners, Methods 1 or 2 are recommended.

---

## CEX vs DEX: Know the Difference

**CEX (Centralized Exchange)** - Coinbase, Kraken, Binance
- They hold your crypto for you
- Easy to use, customer support exists
- Requires identity verification
- "Not your keys, not your crypto"

**DEX (Decentralized Exchange)** - Jupiter, Raydium, pump.fun
- You control your own wallet
- No identity verification
- Trade directly from your wallet
- You're responsible for your own security

When you trade memecoins, you'll use DEXs because:
1. Memecoins aren't listed on CEXs (they're too new/risky)
2. DEXs let you trade instantly without asking permission
3. You maintain custody of your funds

---

## How Much SOL Do You Need?

**For learning:** $50-100
- Enough to make several trades
- Small enough that mistakes don't hurt
- Covers gas fees for weeks

**For active trading:** Whatever you can afford to lose
- Seriously - only trade with money you're prepared to lose completely
- Start small, scale up only after proving consistency

**Keep some SOL reserved:**
- Always keep 0.05-0.1 SOL for gas fees
- Running out of SOL means you can't make transactions (including selling)

---

## Common Mistakes to Avoid

**Wrong network selection:** When withdrawing from an exchange, selecting the wrong network (like BSC or Ethereum instead of Solana) sends your funds to the wrong chain. They're not "lost" but recovering them is complicated. Triple-check you're on the Solana network.

**Sending to wrong address:** Crypto transactions are irreversible. If you send to a wrong address, it's gone. Always copy/paste addresses (never type them) and verify before sending.

**Sending all your SOL:** Keep some for gas. If you swap all your SOL for a memecoin, you won't have gas to sell it later.

---

## Quick Checklist

- Understand that you need SOL for both gas fees and trading
- Chose a funding method (direct buy or exchange transfer)
- If using an exchange, understand to select Solana network when withdrawing
- Know to always send a test transaction first
- Have SOL in your Phantom wallet
- Keeping some SOL reserved for gas fees

---

## What's Next

You've got SOL in your wallet. Now let's understand what you're actually trading - what are memecoins and why do people trade them?`
    },
    {
      id: 'newcomer-3',
      slug: 'what-are-memecoins',
      title: 'What Are Memecoins?',
      description: 'Understanding memecoins, market cap, supply, liquidity, and the brutal statistics',
      readTime: 5,
      difficulty: 'beginner',
      order: 3,
      content: `## What You'll Learn
- What makes a memecoin different from other crypto
- Why people trade them (and why they're risky)
- Key concepts: market cap, supply, and liquidity
- The brutal reality of memecoin statistics

---

## Memecoins Explained

A memecoin is a cryptocurrency based on internet culture, jokes, trends, or community vibes rather than technology or utility. They have no product roadmap, no team building anything, no "fundamentals" in the traditional sense.

**Examples you might recognize:**
- Dogecoin (DOGE) - The original, based on the Shiba Inu meme
- Shiba Inu (SHIB) - Dog theme, rode the 2021 meme wave
- BONK - Solana's dog coin, major ecosystem token
- TRUMP - Launched days before the 2025 inauguration, went viral

**What memecoins are NOT:**
- Investments in technology or companies
- Backed by anything tangible
- Predictable or rational
- Safe

---

## Why Do People Trade Memecoins?

**The appeal:**
1. **Massive potential returns** - Early buyers can see 10x, 100x, even 1000x gains
2. **Fast action** - Markets move in minutes, not months
3. **Low barrier to entry** - Anyone can participate with any amount
4. **Cultural relevance** - Trading what's trending on the internet
5. **Community energy** - The "fun" of being part of something viral

**The reality:**
1. **Most memecoins go to zero** - Over 98% of pump.fun tokens fail
2. **It's a zero-sum game** - For every winner, there are losers
3. **Insiders have advantages** - Creators and early wallets often dump on retail
4. **It's gambling** - Pure speculation with no underlying value

This isn't a judgment - it's context. If you're going to play this game, go in with eyes open.

---

## Key Concepts You Must Understand

### Market Cap

**Market Cap = Price × Circulating Supply**

If a token costs $0.001 and there are 1 billion tokens, the market cap is $1 million.

**Why it matters:**
- A $0.001 token isn't "cheap" - market cap tells the real story
- A 10x from $1M market cap means reaching $10M (possible)
- A 10x from $100M market cap means reaching $1B (much harder)

**Typical memecoin market cap ranges:**
- Under $100K - Extremely early, high risk, most die here
- $100K - $1M - "Micro caps," still very risky
- $1M - $10M - Established some traction
- $10M - $100M - Significant community and volume
- $100M+ - Major memecoin, reduced upside from this point

### Supply

Most memecoins launch with a fixed supply (commonly 1 billion tokens). Unlike traditional companies that can issue more shares, the supply is typically locked.

**Watch for:**
- Who holds the supply? (Check top wallets)
- Are tokens concentrated in a few wallets? (Dump risk)
- Is there a mechanism to create more tokens? (Inflation risk - rare in memecoins)

### Liquidity

Liquidity is how easily you can buy or sell without moving the price.

**High liquidity:** Large buys/sells don't affect price much
**Low liquidity:** Even small trades cause big price swings

**Why it matters:**
- Low liquidity = high slippage (you get worse prices)
- Low liquidity = vulnerable to manipulation
- Low liquidity = harder to exit your position

---

## The Pump.fun Era

Before pump.fun, launching a token on Solana required technical knowledge, initial capital for liquidity, and lots of setup. Pump.fun changed everything.

**What pump.fun did:**
- Made token creation free and instant (anyone can do it)
- Provided built-in liquidity via a "bonding curve"
- Created a fair launch system (no pre-sales, no team tokens on curve)
- Made memecoins 10x more accessible... and 100x more abundant

**The result:**
- Thousands of new tokens launch daily
- 99%+ are worthless
- A tiny fraction become tradeable plays
- The game became faster and more competitive

---

## The Statistics You Need to Accept

**According to industry analysis:**
- Less than 2% of pump.fun tokens ever "graduate" to a DEX
- The vast majority of tokens die within hours
- Many are intentional scams (rug pulls, dev dumps)
- Even legitimate tokens mostly fail to gain traction

**What this means for you:**
- Expect to lose on most trades
- Never put in more than you can lose completely
- Small position sizes are your defense
- One winner needs to pay for many losers

---

## What Makes a Memecoin "Work"?

The few that succeed typically have:

1. **Strong narrative** - Ties to current events, trends, or cultural moments
2. **Community energy** - Active discussion on Twitter (CT), Telegram
3. **Meme quality** - Good visuals, shareable content
4. **Timing** - Right place, right time
5. **Clean launch** - No obvious scam signals, fair distribution

Notice what's NOT on this list: technology, utility, partnerships. In memecoins, attention is everything.

---

## Quick Checklist

- Understand memecoins have no underlying value - pure speculation
- Know how to think about market cap vs price
- Recognize that most memecoins fail
- Accept that this is high-risk, high-reward gambling
- Committed to only risking what you can afford to lose

---

## What's Next

You understand what memecoins are and the risks involved. Now let's make your first actual trade using Jupiter, the main DEX aggregator on Solana.`
    },
    {
      id: 'newcomer-4',
      slug: 'first-trade-jupiter',
      title: 'Your First Trade on Jupiter',
      description: 'Connect your wallet, understand slippage, and make your first swap',
      readTime: 5,
      difficulty: 'beginner',
      order: 4,
      content: `## What You'll Learn
- What Jupiter is and why traders use it
- How to connect your wallet and make a swap
- Understanding slippage, routes, and fees
- Making your first real trade

---

## What Is Jupiter?

Jupiter is Solana's leading DEX aggregator. Instead of trading on one exchange, Jupiter scans multiple exchanges (Raydium, Orca, Meteora, and more) to find you the best price.

**Think of it like this:** If you wanted to buy a TV, you could check one store's price, or you could use a price comparison site that checks all stores. Jupiter is the price comparison site for Solana tokens.

**Why use Jupiter:**
- Best prices by aggregating multiple liquidity sources
- Smart routing splits large trades across exchanges
- User-friendly interface
- Handles over 50% of all DEX volume on Solana
- Supports limit orders and DCA (Dollar Cost Averaging)

**Website:** jup.ag

---

## Connecting Your Wallet

1. Go to **jup.ag** (type it directly - never click links from random sources)
2. Click "Connect Wallet" in the top right
3. Select "Phantom"
4. Approve the connection in Phantom

You're now connected. Jupiter can see your token balances but cannot move funds without your approval on each transaction.

---

## Understanding the Swap Interface

Jupiter's interface shows:

**Top field:** What you're swapping FROM (usually SOL)
**Bottom field:** What you're swapping TO (the token you want)

**Route info:** Jupiter shows you which exchanges it's using and why

**Price impact:** How much your trade will move the price (bigger trades = bigger impact)

**Minimum received:** The worst-case amount you'll get after slippage

---

## Slippage: What It Is and How to Set It

**Slippage** is the difference between the price you expect and the price you actually get. It happens because prices change between when you submit a transaction and when it executes.

**Why it matters for memecoins:**
- Volatile tokens move fast
- Low liquidity means bigger price swings
- If price moves beyond your slippage tolerance, the transaction fails

**How to set it:**
1. Click the settings gear icon
2. Set slippage tolerance (default is usually 0.5%)
3. For memecoins, you'll often need 5-15% due to volatility
4. Higher slippage = more likely to succeed, but potentially worse price

**Rule of thumb:**
- Established tokens (SOL, USDC): 0.5-1%
- Active memecoins: 5-10%
- New or volatile tokens: 10-15%

---

## Making Your First Trade

Let's walk through swapping SOL for USDC (a stablecoin) as a safe first trade:

1. **In the "You pay" field:** Select SOL, enter a small amount (like 0.1 SOL)

2. **In the "You receive" field:** Select USDC (search for it if needed)

3. **Review the details:**
   - Check the exchange rate
   - Check the price impact (should be nearly 0% for this pair)
   - Check the route Jupiter is using

4. **Click "Swap"**

5. **Approve in Phantom:**
   - A popup shows transaction details
   - Verify it matches what you expected
   - Click "Approve"

6. **Wait for confirmation:**
   - Transaction processes in seconds
   - Your USDC appears in your wallet

Congratulations - you've made your first on-chain trade.

---

## Buying Your First Memecoin

Now let's do it with a real memecoin:

1. **Find the token address** - You need the exact contract address (also called "mint address" or "CA"). Get this from reliable sources like:
   - DexScreener (dexscreener.com)
   - Birdeye (birdeye.so)
   - The project's official Twitter

   **Never** trust random addresses from DMs or comments.

2. **Paste the address in Jupiter** - In the "You receive" field, paste the token address. Jupiter will find it.

3. **Set appropriate slippage** - For memecoins, start with 10%

4. **Use a small amount** - For your first trade, use 0.05-0.1 SOL maximum

5. **Swap and approve** - Same process as before

**Warning:** If Jupiter shows "route not found" or very high price impact, the token might have low liquidity. This is risky.

---

## After the Trade

Your tokens now appear in your Phantom wallet. If you don't see them:
- Scroll down in your asset list
- Search for the token
- Sometimes takes a few seconds to appear

**To sell later:**
- Return to Jupiter
- Swap the memecoin back to SOL
- Same process, reversed

---

## What You're Actually Paying

**Solana network fees:** Usually < $0.01 per transaction (you pay this in SOL)

**Jupiter platform fee:** 0.1-0.5% depending on the route (built into the quote)

**Price impact:** On low liquidity tokens, you might get a worse price than displayed

**Slippage:** If the price moves against you before execution

For most trades, you'll pay under $0.10 total in fees - one of Solana's big advantages over other chains.

---

## Common First-Trade Mistakes

**Buying the wrong token:** Scammers create fake tokens with similar names. Always verify the contract address, not just the name.

**Setting slippage too low:** Transaction fails repeatedly because price moved. Increase slippage.

**Setting slippage too high:** You might get a bad fill if the token is being manipulated. Start at 10%, adjust as needed.

**Trading all your SOL:** Keep some for gas, or you can't make any more transactions.

---

## Quick Checklist

- Connected wallet to jup.ag
- Made a test swap (SOL to USDC and back is fine)
- Understand slippage and how to set it
- Know how to find token contract addresses
- Keeping SOL reserved for transaction fees

---

## What's Next

You can make trades on Jupiter. But most memecoin action happens on pump.fun, where tokens launch. Let's learn how pump.fun works and how tokens "graduate" to become tradeable on Jupiter.`
    },
    {
      id: 'newcomer-5',
      slug: 'pumpfun-basics',
      title: 'Understanding Pump.fun Basics',
      description: 'How pump.fun works, bonding curves, graduation, and basic safety checks',
      readTime: 5,
      difficulty: 'beginner',
      order: 5,
      content: `## What You'll Learn
- How pump.fun works and why it dominates memecoin launches
- The bonding curve mechanism explained simply
- What "graduation" means and why it matters
- Basic safety checks before buying any token

---

## What Is Pump.fun?

Pump.fun is a memecoin launchpad on Solana that lets anyone create and trade tokens instantly with no coding, no initial capital, and no permission needed.

**Before pump.fun:** Launching a token required:
- Technical knowledge to create the contract
- SOL to seed the liquidity pool
- Setting up on a DEX like Raydium
- Often days of work

**With pump.fun:** Anyone can:
- Create a token in minutes
- Start trading immediately
- No upfront cost beyond tiny gas fees

**The result:** Thousands of tokens launch daily. Most fail. A few become tradeable. This is the new memecoin meta.

---

## The Bonding Curve: How It Works

When a token launches on pump.fun, it doesn't immediately have a liquidity pool like normal tokens. Instead, it uses a **bonding curve** - a mathematical formula that sets the price based on supply.

**How it works in practice:**

1. **Token creates with 1 billion supply**
2. **800 million tokens go on the bonding curve** - These are available for anyone to buy
3. **Price starts near zero** - First buyers get massive amounts of tokens for small SOL
4. **As people buy, price increases** - The curve makes each subsequent purchase more expensive
5. **As people sell, price decreases** - Selling returns SOL and decreases price along the curve

**Simple example:**
- Buyer 1 spends 0.5 SOL, gets 50 million tokens
- Buyer 2 spends 0.5 SOL, gets 40 million tokens (price already higher)
- Buyer 3 spends 0.5 SOL, gets 30 million tokens (price even higher)

Early buyers always have an advantage in both token amount and entry price.

---

## Graduation: The Magic Threshold

When enough people buy and the bonding curve is fully sold (all 800M tokens purchased), the token **graduates**.

**What happens at graduation:**
1. Token reaches approximately $69K market cap threshold
2. Liquidity moves to PumpSwap (pump.fun's own DEX)
3. The remaining 200M tokens become tradeable
4. Normal AMM (automated market maker) trading begins
5. Token becomes accessible on Jupiter and other aggregators

**Before graduation:** Token only tradeable on pump.fun, via bonding curve

**After graduation:** Token tradeable everywhere on Solana DEXs

**Why graduation matters:**
- Most tokens never graduate (under 2% do)
- Graduation means the token attracted enough buyers
- It's a milestone showing real demand
- More liquidity and visibility after graduation

---

## PumpSwap: Where Graduated Tokens Trade

Since March 2025, graduated tokens automatically move to PumpSwap - pump.fun's native DEX - instead of Raydium.

**Key differences:**
- 0.25% trading fee (0.2% to LPs, 0.05% to protocol)
- No migration fee for creators
- Future creator revenue sharing planned
- Works like a standard AMM (similar to Uniswap/Raydium)

After graduation, you can trade on PumpSwap directly or via aggregators like Jupiter.

---

## Basic Safety Checks Before Buying

Before you ape into any token on pump.fun, do these basic checks:

### 1. Check RugCheck (rugcheck.xyz)

Paste the token address into rugcheck.xyz. It analyzes:
- Mint authority (can dev create more tokens?)
- Freeze authority (can dev freeze your wallet?)
- Top holder distribution
- Liquidity status
- Known scam patterns

**Green flags:** Authority revoked, reasonable distribution
**Red flags:** Authorities active, concentrated holdings

### 2. Look at Holder Distribution

On pump.fun or DexScreener, check the top holders:
- Are the top 10 wallets holding 30%+? Risky.
- Do multiple wallets have suspiciously similar amounts? Could be bundled (same person).
- Did many wallets buy in the first few seconds? Possible insider sniping.

### 3. Check the Socials

Click through to any linked Twitter/Telegram:
- Does the Twitter account exist?
- Is it new or established?
- Is there actual community engagement?
- Or just bot comments?

No socials at all is a red flag for anything but pure gambling plays.

### 4. Watch the Buys and Sells

On the pump.fun page, watch the transaction flow:
- Is there organic buying from different wallets?
- Or are the same wallets buying back and forth (wash trading)?
- Are dev/insider wallets selling into every pump?

---

## The Reality of Pump.fun Trading

**Brutal truth:** The majority of pump.fun tokens are:
- Cash grabs by creators who dump immediately
- Copycat tokens with no original concept
- Bot farms washing volume
- Or simply ignored and dead within hours

**The opportunity:** Among thousands of daily launches, a handful gain real traction. Finding those before they graduate is the game.

**The skill:** Learning to distinguish signal from noise, real buying from fake, and actual communities from manufactured ones.

---

## Your First Pump.fun Experience

1. Go to pump.fun
2. Browse the "Trending" or "New" sections
3. Click on tokens to see their pages
4. Look at charts, holder distribution, and transaction flow
5. Run checks on rugcheck.xyz
6. **Don't buy anything yet** - just observe

Watch how fast things move. See how many tokens die. Notice the patterns. This observation is more valuable than any trade right now.

---

## Quick Checklist

- Understand bonding curve mechanics (early = cheaper)
- Know what graduation means and why it matters
- Can run basic safety checks before buying
- Observed pump.fun without trading (recommended first step)
- Accept that most tokens will fail

---

## Module 1 Complete!

You now understand:
- How to set up and secure your wallet
- How to fund your wallet with SOL
- What memecoins are and their risks
- How to trade on Jupiter
- How pump.fun and bonding curves work

**Next Steps:**
- Practice making small trades on Jupiter
- Watch pump.fun to understand the flow
- Move to Module 2: Apprentice to learn research and defense

Welcome to the trenches. Trade small. Learn fast. Protect your capital.`
    }
  ]
}
