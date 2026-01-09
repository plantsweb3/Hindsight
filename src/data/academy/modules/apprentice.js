// Apprentice Module - Research & Defense
// Local data file for Trading 101 content

export const apprenticeModule = {
  id: 'apprentice',
  slug: 'apprentice',
  title: 'Apprentice',
  subtitle: 'Research & Defense',
  description: 'Learn to find opportunities and avoid traps',
  icon: '🔍',
  difficulty: 'beginner+',
  lessonCount: 5,
  lessons: [
    {
      id: 'apprentice-1',
      slug: 'research-token',
      title: 'How to Research a Token',
      description: 'Due diligence basics before you ape',
      readTime: 7,
      difficulty: 'beginner',
      order: 1,
      content: `# How to Research a Token

Someone dropped a contract address in chat. Twitter is buzzing about a new token. Before you buy anything, you need to know what you're actually buying.

## Why Research Matters

In crypto, especially memecoins:
- 95%+ of tokens go to zero
- Rugs and scams are constant
- 5 minutes of research can save your portfolio
- The good opportunities are still there after you check

"Aping" without research is gambling. Research turns gambling into trading.

## The 5-Minute Research Checklist

You don't need hours. You need a quick, systematic check.

### Check 1: Token Age and History

**Where to look:** Birdeye, DexScreener, RugCheck

**What to check:**
- When was it created?
- What's the price history?
- Any suspicious spikes and dumps?

**Red flags:**
- Created in last few hours (higher risk)
- Multiple 90%+ dumps in history
- Price only goes down with brief pumps

**Green flags:**
- Survived multiple days/weeks
- Recovered from dips
- Organic-looking price action

### Check 2: Liquidity and Volume

**Where to look:** Birdeye, DexScreener

**What to check:**
- How much liquidity in the pool?
- What's the 24h trading volume?
- Liquidity locked or unlocked?

**Red flags:**
- Under $10K liquidity (can't exit)
- Volume is mostly one wallet
- Unlocked liquidity (dev can pull)

**Green flags:**
- $50K+ liquidity
- Healthy volume from many wallets
- Liquidity locked or burned

### Check 3: Holder Distribution

**Where to look:** Birdeye holders tab, Bubblemaps

**What to check:**
- How many holders?
- What % do top 10 wallets hold?
- Any suspicious wallet clusters?

**Red flags:**
- Top 10 hold 50%+ (excluding burned/locked)
- One wallet with 20%+
- Clustered wallets (same source, likely same person)

**Green flags:**
- Wide distribution
- No single wallet dominates
- Growing holder count

### Check 4: Social and Community

**Where to look:** Twitter, Telegram, website

**What to check:**
- Is there an active community?
- Real engagement or bot activity?
- Dev/team responsive?

**Red flags:**
- No social presence
- All bot comments ("LFG" spam)
- Dead Telegram/Discord
- Anonymous team with no history

**Green flags:**
- Organic conversation
- Active dev engagement
- Growing community
- Team has track record

### Check 5: Contract and Code

**Where to look:** RugCheck, token scanner tools

**What to check:**
- Any dangerous functions in contract?
- Mint function enabled?
- Honeypot risk?

**Red flags:**
- Mint authority not revoked (can create infinite tokens)
- Freeze authority enabled (can freeze your tokens)
- Honeypot detected (can buy, can't sell)
- Copycat contract of another token

**Green flags:**
- Mint revoked
- Freeze revoked
- Clean contract scan
- Verified on explorer

## Quick Research Template

Copy this for every token:

**Token:** _______________
**Contract:** _______________

- Age: _____ (days/hours)
- Liquidity: $_____ (locked? Y/N)
- Top 10 holders: _____%
- Holder count: _____
- Community: Active / Dead / Fake
- Contract scan: Clean / Issues

**Decision:** Buy / Skip / Watchlist
**Reason:** _____________________

## Research Resources

**Price/Liquidity:**
- Birdeye.so
- DexScreener.com
- pump.fun (for pump tokens)

**Holder Analysis:**
- Bubblemaps.io
- Birdeye holders tab

**Contract Scanning:**
- RugCheck.xyz
- SolSniffer.com

**Social:**
- Twitter search
- Telegram (link usually on Birdeye)

## The 5-Minute vs 5-Hour Debate

For memecoins, 5 minutes is usually enough:
- Quick scans catch 90% of obvious rugs
- Opportunities move fast
- Diminishing returns on more research

For larger positions or longer holds, spend more time:
- Deep dive on team
- Understand tokenomics fully
- Read any documentation
- Check competitor landscape

Scale research time to position size.`
    },
    {
      id: 'apprentice-2',
      slug: 'spotting-scams',
      title: 'Spotting Rugs and Scams',
      description: 'Common traps and how to avoid them',
      readTime: 8,
      difficulty: 'beginner',
      order: 2,
      content: `# Spotting Rugs and Scams

Scammers are creative and constantly evolving. But most rugs follow predictable patterns. Learn to recognize them and you'll avoid 90% of traps.

## The Anatomy of a Rug Pull

**What is a rug pull?**
A rug pull is when developers abandon a project and steal investor funds, usually by:
- Removing liquidity
- Dumping their tokens
- Disabling selling
- Abandoning the project after pumping

**Why they work:**
- Greed overrides caution
- FOMO makes people skip research
- Scammers are getting more sophisticated
- New people enter crypto daily

## Type 1: Liquidity Pull

**How it works:**
1. Dev creates token with liquidity
2. Pumps it with marketing/hype
3. When price is high, removes all liquidity
4. Your tokens become worthless (can't sell)

**How to spot:**
- Liquidity not locked or burned
- LP tokens in dev wallet
- Low liquidity relative to market cap

**How to protect:**
- Check if liquidity is locked (and for how long)
- Burned liquidity is safest
- Use RugCheck to verify

## Type 2: Dev Dump

**How it works:**
1. Dev holds large portion of supply
2. Pumps the token
3. Dumps their entire bag at peak
4. Price crashes, dev is gone

**How to spot:**
- One wallet holds 10-20%+ of supply
- Bundled wallets (many wallets from same source)
- Dev wallet not transparent

**How to protect:**
- Check holder distribution
- Use Bubblemaps for wallet clustering
- Avoid tokens where dev holds huge %

## Type 3: Honeypot

**How it works:**
1. You can buy the token
2. When you try to sell, transaction fails
3. Only the dev can sell
4. Your money is trapped

**How to spot:**
- Contract has sell restrictions
- Scanner tools flag it
- Nobody else is successfully selling

**How to protect:**
- Use RugCheck or honeypot detectors
- Check if others are selling (DexScreener transactions)
- Test with tiny amount first if unsure

## Type 4: Slow Rug

**How it works:**
1. Looks legitimate at first
2. Dev gradually sells over days/weeks
3. Price slowly bleeds
4. By the time you notice, you're down 80%

**How to spot:**
- Dev wallet making regular sells
- Constant sell pressure despite good news
- Price only goes down, never recovers

**How to protect:**
- Monitor dev wallet activity
- Watch for consistent selling pattern
- Cut losses if pattern emerges

## Type 5: Copycat/Impersonation

**How it works:**
1. Popular token launches (real one)
2. Scammer creates fake version with similar name
3. People buy the wrong one
4. Fake one rugs

**How to spot:**
- Multiple tokens with same/similar name
- Contract address doesn't match official sources
- Lower liquidity than "the real one"

**How to protect:**
- ALWAYS verify contract address from official source
- Don't trust random links
- Check creation date (real one is usually older)

## Type 6: Pump and Dump Groups

**How it works:**
1. Group coordinates to pump a token
2. Leaders buy first (lowest price)
3. Signal to group to buy (price rises)
4. Leaders dump on group members
5. Late buyers hold bags

**How to spot:**
- Sudden coordinated shilling
- Promises of "guaranteed pump at X time"
- Token has no other reason to exist
- Organizers are always the winners

**How to protect:**
- Avoid organized pump groups
- If you're not first, you're exit liquidity
- By the time you see the signal, it's too late

## Red Flag Quick Reference

**Instant red flags (skip immediately):**
- Honeypot detected on scanner
- Liquidity not locked and under $10K
- One wallet holds 30%+
- Contract less than 1 hour old (usually)
- Can't find any social presence
- Copycat name of trending token

**Warning flags (proceed with extreme caution):**
- Liquidity locked for less than 7 days
- Top 10 wallets hold 40%+
- Dev very active in selling
- Community is mostly bots
- Too-good-to-be-true promises

## The Scam Mindset

Scammers exploit:
- **Greed:** "This will 1000x!"
- **FOMO:** "Getting in before it pumps!"
- **Trust:** "Famous person is involved!" (usually not)
- **Urgency:** "Buy now or miss out!"

When you feel these emotions strongly, slow down. That's often when you're being manipulated.

## If You Get Rugged

It happens to everyone eventually:
1. Accept the loss
2. Analyze what you missed
3. Update your checklist
4. Don't revenge trade
5. Move on wiser

Every rug is tuition. Learn from it.`
    },
    {
      id: 'apprentice-3',
      slug: 'reading-charts',
      title: 'Reading Charts for Beginners',
      description: 'Basic chart reading to time entries better',
      readTime: 8,
      difficulty: 'beginner',
      order: 3,
      content: `# Reading Charts for Beginners

You don't need to be a technical analyst to read charts. Basic chart literacy helps you time entries, spot danger, and avoid buying tops.

## Why Charts Matter

Charts show you:
- Where price has been
- Where buyers and sellers are active
- Whether momentum is up or down
- Potential entry and exit points

You're not predicting the future. You're understanding the present context.

## Candlestick Basics

Each candlestick represents a time period (1 minute, 1 hour, 1 day, etc.)

**The anatomy:**
- Upper wick (high)
- Body (open to close)
- Lower wick (low)

**Green/White candle:** Price went UP (closed higher than opened)
**Red/Black candle:** Price went DOWN (closed lower than opened)

**What wicks tell you:**
- Long upper wick: Sellers pushed price down from high
- Long lower wick: Buyers pushed price up from low
- No wick: Strong conviction in that direction

## Timeframes

**Common timeframes:**
- 1m, 5m, 15m: Very short-term, noisy
- 1H, 4H: Short-term trends
- 1D: Daily trend
- 1W: Longer-term trend

**Rule of thumb:**
- Use higher timeframe for trend direction
- Use lower timeframe for entries
- Don't make decisions on 1-minute chart alone

## Support and Resistance

**Support:** Price level where buying tends to come in (price bounces up)
**Resistance:** Price level where selling tends to come in (price bounces down)

**How to identify:**
- Look for price bouncing off the same level multiple times
- Round numbers often act as support/resistance
- Previous highs become resistance
- Previous lows become support

**How to use:**
- Buy near support (lower risk)
- Be cautious buying near resistance
- If support breaks, it often becomes resistance (and vice versa)

## Basic Trend Identification

**Uptrend:**
- Price making higher highs
- Price making higher lows
- Generally moving up-right on chart

**Downtrend:**
- Price making lower highs
- Price making lower lows
- Generally moving down-right on chart

**Sideways/Range:**
- Price bouncing between support and resistance
- No clear direction
- Waiting for breakout

**Trading with trends:**
- Easier to buy in uptrends
- Harder to buy in downtrends (catching falling knives)
- Ranges can be traded at extremes

## Volume Basics

Volume = how much was traded in that period.

**What volume tells you:**
- High volume + price move = Strong, likely to continue
- Low volume + price move = Weak, might reverse
- Volume spike = Something significant happening

**Volume patterns:**
- Increasing volume on uptrend = Healthy, buyers active
- Decreasing volume on uptrend = Running out of steam
- High volume dump = Possible capitulation (sometimes bullish)

## Chart Patterns You Should Know

### The Pump and Dump

Straight up, straight down. Classic rug or coordinated dump.

**What to do:** Don't chase. If you're in, take profits on the way up.

### Consolidation/Range

Price trading sideways after a move. Building energy.

**What to do:** Wait for breakout direction. Buy breakout or range lows.

### Higher Lows (Bullish)

Each dip is higher than the last. Buyers stepping in earlier.

**What to do:** Good sign. Buy dips, hold positions.

### Lower Highs (Bearish)

Each bounce is lower. Sellers in control.

**What to do:** Bad sign. Don't buy, or wait for trend change.

## Practical Application

**Before buying, check:**
1. What's the trend? (Zoom out to daily)
2. Where's support? (Where did it bounce before?)
3. Where's resistance? (Where did it reject before?)
4. What's volume doing? (Confirming moves?)
5. Am I buying near support or resistance?

**Good entry:** Near support, in uptrend, with volume
**Bad entry:** Near resistance, in downtrend, low volume

## Common Beginner Mistakes

**Mistake 1: Only looking at 1-minute chart**
Too noisy. Zoom out for context.

**Mistake 2: Buying because "it's going up"**
Chasing green candles usually means buying the top.

**Mistake 3: Ignoring obvious downtrend**
"It's cheap now" in a downtrend often gets cheaper.

**Mistake 4: Drawing too many lines**
Keep it simple. Major levels only.

**Mistake 5: Thinking charts predict the future**
Charts show probability, not certainty. Always use stops.`
    },
    {
      id: 'apprentice-4',
      slug: 'building-watchlist',
      title: 'Building Your Watchlist',
      description: 'How to track opportunities without FOMOing',
      readTime: 6,
      difficulty: 'beginner',
      order: 4,
      content: `# Building Your Watchlist

A good watchlist is your defense against FOMO. Instead of reacting to whatever is pumping, you proactively track opportunities and strike when they're ready.

## Why You Need a Watchlist

**Without a watchlist:**
- React to whatever you see
- Chase pumps
- No plan, no levels
- Random results

**With a watchlist:**
- Proactively track opportunities
- Know your entry prices
- Execute with confidence
- Skip what's not on the list

The watchlist transforms you from reactive to proactive.

## Watchlist Structure

### Tier 1: Ready to Buy

Tokens you've fully researched and want to own at specific prices.

**For each Tier 1 token, know:**
- Why you want it (thesis)
- Entry price/zone
- Stop loss level
- Target price
- Position size

When price hits your level, you execute. No hesitation needed.

### Tier 2: Watching Closely

Tokens that interest you but need something to change.

**Examples:**
- Waiting for narrative to develop
- Waiting for price to pull back
- Need more research
- Waiting for catalyst

Check these daily. Move to Tier 1 when ready.

### Tier 3: On the Radar

Tokens you're aware of but not actively tracking.

**Examples:**
- Heard about it, haven't researched
- Interesting concept, not urgent
- Keeping an eye on category

Check these weekly. Move up tiers if they heat up.

## How to Find Watchlist Candidates

### Source 1: Trending with Caution

DexScreener and Birdeye trending lists show what's hot.

**How to use:**
- Don't buy trending tokens
- Research them and watchlist if interesting
- Wait for pullback to add

### Source 2: Smart Money Tracking

Watch what good wallets are accumulating.

**Tools:**
- Cielo Finance
- Birdeye whale tracking
- Arkham Intel

**How to use:**
- Note what they buy
- Research those tokens
- Add to watchlist if thesis makes sense

### Source 3: Narrative Scanning

Stay aware of emerging narratives.

**Where to look:**
- Crypto Twitter
- Telegram groups
- Discord alpha channels

**How to use:**
- Identify narrative early
- Find best tokens in that narrative
- Watchlist for entry opportunities

### Source 4: Your Own Research

Your analysis might uncover gems.

**How:**
- Follow interesting developers
- Track promising projects
- Note tokens before they're popular

## Watchlist Maintenance

### Daily (5 minutes)
- Any Tier 1 tokens at entry levels?
- Any major news on watchlist tokens?
- Any Tier 2 ready to upgrade?

### Weekly (20 minutes)
- Review all tiers
- Remove dead opportunities
- Add new discoveries
- Update entry levels if needed

### Watchlist Hygiene

**Remove tokens that:**
- Thesis is dead
- Already pumped past your entry
- Better opportunities exist
- You've lost conviction

**Don't hoard.** A bloated watchlist is useless. Quality over quantity.

## Watchlist Size Guidelines

- **Tier 1:** 3-5 tokens max
- **Tier 2:** 5-10 tokens
- **Tier 3:** 10-20 tokens

More than this becomes unmanageable.

## Using Alerts

Don't watch charts all day. Set alerts.

**Alert types:**
- Price alerts at your entry levels
- Percentage change alerts
- Volume spike alerts

**Where to set:**
- TradingView
- Birdeye
- DexScreener
- Telegram bots

When alert triggers, then you pay attention.

## The Watchlist Discipline

**The rule:** If it's not on your watchlist, you don't buy it.

This single rule prevents most FOMO trades.

Seeing something pump? Is it on your watchlist?
- Yes: Execute your plan
- No: Watch, research, maybe add for next time

You're not missing opportunities. You're filtering noise.

## Example Watchlist Entry

**TOKEN:** $EXAMPLE
**Tier:** 1 (Ready to Buy)

**THESIS:**
AI narrative, team has track record, early in attention cycle

**LEVELS:**
- Entry zone: $0.08 - $0.10
- Stop loss: $0.065
- Target 1: $0.15
- Target 2: $0.25

**SIZE:** $500 (2% of portfolio)

**ALERTS SET:** Yes, at $0.10

**LAST UPDATED:** Jan 8`
    },
    {
      id: 'apprentice-5',
      slug: 'protecting-wallet',
      title: 'Protecting Your Wallet',
      description: 'Security basics to keep your crypto safe',
      readTime: 7,
      difficulty: 'beginner',
      order: 5,
      content: `# Protecting Your Wallet

You can find the best trades and make huge gains, but none of it matters if someone drains your wallet. Security isn't optional - it's essential.

## The Threat Landscape

**How people lose crypto:**
- Phishing links (fake websites)
- Malicious token approvals
- Seed phrase theft
- Fake airdrops
- Compromised browser extensions
- Social engineering

Most losses are preventable with basic security practices.

## Seed Phrase Security

Your seed phrase is everything. Whoever has it controls your wallet.

**Rules:**
1. NEVER share your seed phrase with anyone
2. NEVER enter it on any website
3. NEVER store it digitally (no photos, no cloud, no notes app)
4. Write it on paper or metal
5. Store in secure location (fireproof safe ideal)
6. Consider splitting it across locations

**No legitimate service will ever ask for your seed phrase.**

If someone asks for your seed phrase, it's a scam. 100% of the time.

## Phishing Protection

Phishing = Fake websites that look real to steal your info.

**How to protect:**
- Bookmark official sites and only use bookmarks
- Double-check URLs (scammers use similar domains)
- Don't click links in DMs or emails
- Verify announcements through official channels
- Use a browser dedicated to crypto

**Common phishing tactics:**
- "Your wallet has been compromised, connect to secure it"
- "Claim your airdrop" (fake site)
- "Verify your wallet" links
- Fake customer support DMs

**When in doubt, don't click.**

## Token Approval Management

When you interact with dApps, you approve token spending.

**The risk:**
- Malicious contracts can drain approved tokens
- Old approvals remain active forever
- One bad approval = everything gone

**How to protect:**
- Revoke unused approvals regularly
- Use: revoke.cash, or similar tools
- Be cautious what you approve
- Revoke after using a new dApp

**Check your approvals monthly.** Revoke anything you don't actively use.

## Wallet Hygiene

### Use Multiple Wallets

**Recommended setup:**
- **Vault wallet:** Long-term holdings, never connects to dApps
- **Trading wallet:** Active trading, regular dApp use
- **Burner wallet:** Sketchy mints, new dApps, testing

If your trading wallet gets compromised, vault is safe.
If your burner wallet gets drained, you lose little.

### Hardware Wallet for Vault

For significant holdings, use a hardware wallet:
- Ledger
- Trezor

Your seed phrase never touches the internet. Much harder to compromise.

### Regular Security Audits

Monthly checklist:
- Reviewed recent transactions for anything suspicious
- Revoked unnecessary token approvals
- Checked for any unknown tokens (don't interact with them)
- Verified backup locations are secure
- Updated any compromised passwords

## Airdrop Safety

Free tokens appear in your wallet. Most are scams.

**The trap:**
1. Scam token appears in wallet
2. You try to sell/interact with it
3. Interaction triggers malicious contract
4. Wallet drained

**Rules:**
- Never interact with unexpected tokens
- Don't try to sell random airdrops
- If you didn't expect it, ignore it
- Hide unknown tokens in wallet UI

Legitimate airdrops are announced through official channels, not random wallet deposits.

## Social Engineering

Scammers manipulate emotions to bypass your logic.

**Common tactics:**
- Urgency: "Act now or lose access!"
- Authority: "I'm from Phantom support"
- Helpfulness: "Let me help you claim your reward"
- Fear: "Your wallet is at risk"

**Protection:**
- No legitimate support will DM you first
- Take time to verify everything
- When emotional, slow down
- Ask yourself: "Why would they help me?"

## If You Get Compromised

If you suspect compromise:

1. **Immediately move funds** to a new wallet with fresh seed phrase
2. **Revoke all approvals** on compromised wallet
3. **Don't reuse** the compromised wallet
4. **Analyze** how it happened
5. **Improve** your security based on learnings

Speed matters. Move first, investigate later.

## Security Checklist Summary

- Seed phrase written on paper, stored securely
- Seed phrase never shared or entered online
- Using multiple wallets (vault/trading/burner)
- Hardware wallet for significant holdings
- Bookmarks for all crypto sites
- Don't click links in DMs
- Regularly revoke token approvals
- Ignore unknown airdrops
- Monthly security audit

**Security is boring until it saves your entire portfolio.**`
    }
  ]
}
