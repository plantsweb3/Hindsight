// Trader Module: Strategy & Execution
// Level: Intermediate
// Prerequisite: Complete Apprentice module

export const traderModule = {
  id: 'trader',
  slug: 'trader',
  title: 'Trader',
  subtitle: 'Strategy & Execution',
  description: 'Size positions and manage risk like a pro',
  icon: '📊',
  difficulty: 'intermediate',
  lessonCount: 5,
  lessons: [
    {
      id: 'position-sizing',
      slug: 'position-sizing',
      title: 'Position Sizing Fundamentals',
      description: 'How much to buy - the most important decision',
      difficulty: 'intermediate',
      readTime: 8,
      content: `# Position Sizing Fundamentals

Entry price matters. Exit timing matters. But position sizing might matter most. Get it wrong and one bad trade destroys your account. Get it right and you can survive anything.

## Why Position Sizing Is Everything

**The math:**
- Great entry + wrong size = Blown account
- Mediocre entry + right size = Survival and growth

Most traders obsess over entries. Professionals obsess over sizing.

## The Core Principle

**Never risk more than you can afford to lose on a single trade.**

This sounds obvious. Almost nobody follows it.

"Afford to lose" means:
- You can take the loss without emotional damage
- Your account survives to trade another day
- You can think clearly about future trades
- Life continues normally if this goes to zero

## The Percentage Rule

**Risk 1-2% of your portfolio per trade maximum.**

**Example: $10,000 portfolio**
- 1% risk = $100 max loss per trade
- 2% risk = $200 max loss per trade

This means:
- 10 consecutive losses = 10-20% drawdown (survivable)
- You can be wrong many times and still trade
- No single trade can hurt you badly

## From Risk to Position Size

Your risk amount determines position size based on stop loss distance.

**Formula:**
\`\`\`
Position Size = Risk Amount ÷ Stop Loss Percentage
\`\`\`

**Example:**
- Portfolio: $10,000
- Risk per trade: 1% = $100
- Stop loss: 20% below entry

Position Size = $100 ÷ 0.20 = $500

You buy $500 worth. If it drops 20%, you lose $100 (1% of portfolio).

**Another example:**
- Portfolio: $10,000
- Risk per trade: 1% = $100
- Stop loss: 50% below entry (wider stop)

Position Size = $100 ÷ 0.50 = $200

Wider stop = smaller position to maintain same risk.

## Position Sizing by Asset Type

Different assets need different sizing:

### Blue Chips (BTC, ETH, SOL)
- Lower volatility
- Can size larger (10-25% of portfolio per position)
- Still respect the risk % on individual trades

### Established Altcoins
- Medium volatility
- Moderate sizing (5-15% per position)
- Standard risk rules apply

### Memecoins / Small Caps
- Extreme volatility
- Small sizing only (1-5% per position)
- Can go to zero overnight
- Size for total loss possibility

### New/Unproven Tokens
- Highest risk
- Smallest sizing (0.5-2% per position)
- "Lottery ticket" money only

## The "Go to Zero" Test

Before sizing any position, ask:

**"If this goes to zero tonight, will I be okay?"**

- If yes: Size is appropriate
- If no: Reduce until answer is yes

This isn't about being pessimistic. It's about sizing for reality.

## Common Sizing Mistakes

### Mistake 1: Sizing by Conviction

"I really believe in this, I'll go bigger."

**Problem:** Conviction doesn't change volatility or risk. You can be convinced AND wrong.

**Fix:** Size by risk rules, not feelings.

### Mistake 2: Sizing by Dollar Amount

"I always buy $1,000 of everything."

**Problem:** $1,000 of BTC ≠ $1,000 of random memecoin in risk terms.

**Fix:** Size by percentage and risk, not fixed dollars.

### Mistake 3: Not Accounting for Stop Distance

"I'll risk 2% but my stop is 50% away."

**Problem:** If stop is 50% and you use 2% of portfolio, you're actually risking 1% - good. But if you size at 2% and stop is 10%, you're only risking 0.2% - undersized.

**Fix:** Always calculate position from stop distance.

### Mistake 4: Adding to Losers

"It's cheaper now, I'll buy more to average down."

**Problem:** You're increasing size on a losing position, compounding risk.

**Fix:** Only add if thesis strengthened (not just cheaper). Pre-plan any averaging.

## Position Sizing Worksheet

Use this for every trade:

\`\`\`
POSITION SIZING CALCULATION

Portfolio value: $_______
Risk percentage: _____%
Risk amount: $_______

Stop loss distance: _____%

Position size = $_______ ÷ _____% = $_______

Sanity check:
- If this goes to zero, I lose: $_______
- That's _____% of my portfolio
- Am I okay with that? Y/N
\`\`\`

## Building the Habit

Every trade. Every time. No exceptions.

It takes 30 seconds. It can save your entire account.

The best traders make this automatic. Before they think about entry, they've calculated their size.`
    },
    {
      id: 'stop-losses',
      slug: 'stop-losses',
      title: 'Stop Losses That Work',
      description: 'Protecting your downside without getting stopped out constantly',
      difficulty: 'intermediate',
      readTime: 8,
      content: `# Stop Losses That Work

A stop loss is your emergency exit. It limits damage when you're wrong. But poorly placed stops either don't protect you or get triggered constantly. Here's how to set stops that actually work.

## Why Stop Losses Are Non-Negotiable

**Without stops:**
- Small losses become big losses
- "I'll watch it" becomes "I'll hope it recovers"
- One bad trade destroys weeks of gains
- Emotional decisions take over

**With stops:**
- Maximum loss is defined
- No hoping or praying
- Live to trade another day
- Emotions removed from exit

## Types of Stop Losses

### Percentage Stop

Set at fixed % below entry.

**Example:** Buy at $1.00, set 20% stop at $0.80

**Pros:**
- Simple to calculate
- Easy to implement

**Cons:**
- Ignores chart structure
- Might be too tight or too loose

**Best for:** Quick trades, unfamiliar assets

### Technical Stop

Set at key support/structure level.

**Example:** Support at $0.75, set stop at $0.73 (just below)

**Pros:**
- Respects market structure
- Logical invalidation point

**Cons:**
- Requires chart reading
- Support might be unclear

**Best for:** Swing trades, chart-based entries

### Volatility Stop (ATR-Based)

Set based on asset's normal volatility.

**Example:** Asset moves 8% daily, set stop at 2x ATR = 16% below entry

**Pros:**
- Adapts to each asset
- Accounts for normal swings

**Cons:**
- More complex
- Requires ATR calculation

**Best for:** Experienced traders, diverse assets

## Where to Place Stops

### Good Stop Placement

- Just below support level
- Below recent swing low
- Below key moving average (20 EMA, 50 EMA)
- At logical invalidation point
- Gives room for normal volatility

### Bad Stop Placement

- At obvious round numbers (everyone's stop is there)
- Too tight (normal move stops you out)
- Too wide (defeats the purpose)
- At your breakeven point (not a technical level)
- "Where you'll be even"

## The Stop Placement Framework

**Step 1:** Identify why you're buying (support bounce, breakout, etc.)

**Step 2:** Identify what proves you wrong (support breaks, breakout fails, etc.)

**Step 3:** Place stop just beyond that invalidation point

**Step 4:** Calculate position size based on stop distance

**Step 5:** If position too small or stop too wide, skip the trade

## Common Stop Loss Mistakes

### Mistake 1: No Stop At All

"I'll watch it and exit manually."

**Reality:** You'll hesitate. You'll hope. Small loss becomes big loss.

**Fix:** Always set an actual stop order (or alert with immediate action).

### Mistake 2: Moving Stop Further Away

"It's getting close to my stop, let me give it more room."

**Reality:** You're not giving it room, you're increasing your loss.

**Fix:** Never move stops away from entry. Only move toward profit.

### Mistake 3: Too Tight Stops

"I'll set a 3% stop to minimize loss."

**Reality:** Normal volatility stops you out, price then moves your direction.

**Fix:** Stops must be beyond normal volatility. Use ATR as guide.

### Mistake 4: Stops at Obvious Levels

"I'll put my stop at exactly $1.00."

**Reality:** Market makers hunt obvious stops. Price hits $0.99, you're out, price reverses.

**Fix:** Place stops slightly beyond obvious levels, use less round numbers.

## Stop Loss and Position Size Interaction

Remember: Wider stop = Smaller position

This means if proper stop is very wide:
- Your position will be small
- Reward might not be worth it
- Consider skipping the trade

**Example:**
- Risk: $100
- Proper stop: 50% below entry
- Position size: $200
- If $200 position isn't meaningful to you, skip the trade

## Trailing Stops

As price moves in your favor, move stop up to lock in gains.

### When to Trail

- After hitting first profit target
- After price makes new highs
- After clear support level forms above entry

### How to Trail

- Move to breakeven after 1x risk in profit
- Move to below new swing lows
- Trail below moving average (20 EMA)
- Use percentage trail (e.g., 15% below peak)

### Trailing Rules

- Only move stop toward profit (never away)
- Don't trail too tight (normal pullbacks will stop you)
- Accept that trailing means sometimes giving back gains for bigger moves

## Mental vs. Actual Stops

**Mental stop:** "I'll sell if it hits $0.80"
**Actual stop:** Order placed at $0.80

**The problem with mental stops:**
- You'll move them when price gets close
- You'll be away when it triggers
- You'll negotiate with yourself

**Solution:** Use actual stop orders when possible. If not (some DEXs), set alerts and commit to immediate action.

## Stop Loss Checklist

Before every trade:

- [ ] Stop level identified
- [ ] Stop is at logical invalidation point
- [ ] Stop gives room for normal volatility
- [ ] Position size calculated from stop
- [ ] Stop order placed (or alert set)
- [ ] Committed to honoring stop`
    },
    {
      id: 'risk-reward',
      slug: 'risk-reward',
      title: 'Risk/Reward and Trade Selection',
      description: 'Only take trades where math is in your favor',
      difficulty: 'intermediate',
      readTime: 8,
      content: `# Risk/Reward and Trade Selection

Every trade is a bet. Risk/reward tells you if the bet makes mathematical sense. This framework transforms random trading into systematic profit-seeking.

## Understanding Risk/Reward

**Risk/Reward Ratio (R:R) = Potential Loss : Potential Gain**

**Example:**
- Entry: $1.00
- Stop loss: $0.80 (risk = $0.20)
- Target: $1.50 (reward = $0.50)
- R:R = 0.20 : 0.50 = 1:2.5

For every $1 you risk, you potentially make $2.50.

## Why R:R Matters More Than Win Rate

**Key insight:** You can lose most of your trades and still make money with good R:R.

**Example: 1:3 R:R, 35% win rate**

10 trades risking $100 each:
- 3.5 wins × $300 = $1,050
- 6.5 losses × $100 = $650
- Net profit: $400

You're wrong 65% of the time but profitable.

**Example: 1:1 R:R, 55% win rate**

10 trades risking $100 each:
- 5.5 wins × $100 = $550
- 4.5 losses × $100 = $450
- Net profit: $100

Better win rate, much less profit.

**The lesson:** High R:R > High win rate

## Minimum R:R Standards

**Rule: Never take a trade below 1:2 R:R**

- 1:1 = Barely worth it, need high win rate
- 1:2 = Standard, profitable with 40%+ win rate
- 1:3 = Good, profitable with 30%+ win rate
- 1:5+ = Great, profitable even with low win rate

Higher R:R = More margin for error.

## Calculating R:R Before Every Trade

**Step 1:** Define entry price
**Step 2:** Define stop loss price
**Step 3:** Define target price
**Step 4:** Calculate R:R

**Template:**
\`\`\`
Entry: $______
Stop: $______ (Risk: ____%)
Target: $______ (Reward: ____%)
R:R = 1: ______
\`\`\`

If R:R is below 1:2, either find better entry or skip.

## Finding High R:R Setups

High R:R trades share characteristics:

### Entry Near Support

- Buy close to support = Tight stop below
- Tight stop = Small risk
- Same target = Better R:R

### Clear Invalidation Point

- Know exactly where you're wrong
- Allows precise stop placement
- No guessing

### Significant Upside

- Strong catalyst or narrative
- Room to run (not near resistance)
- Others will want to buy higher

### Not Already Extended

- Price hasn't already moved significantly
- Not chasing a pump
- Entry isn't above obvious value

## R:R Reality Check

Before entering, verify:

**Is my target realistic?**
- Based on comparable moves
- Based on resistance levels
- Not just wishful thinking

**Is my stop logical?**
- Based on invalidation, not arbitrary %
- Gives room for volatility
- Not so wide it's useless

**Does the R:R make sense?**
- Minimum 1:2 for standard trades
- 1:3+ for less certain setups
- Higher R:R for lower conviction

## Trade Selection Framework

Not every trade deserves your capital. Be selective.

### Tier 1: High Quality (Take These)
- R:R 1:3 or better
- Strong thesis
- Clear setup
- Good entry point
- Size: Full position

### Tier 2: Standard (Take Selectively)
- R:R 1:2 to 1:3
- Decent thesis
- Acceptable setup
- Okay entry
- Size: Standard or reduced

### Tier 3: Marginal (Usually Skip)
- R:R 1:1.5 to 1:2
- Weak thesis
- Messy setup
- Chasing entry
- Size: Skip or tiny

### Tier 4: Bad (Always Skip)
- R:R below 1:1.5
- No real thesis
- No clear setup
- FOMO entry
- Size: Never

## The Opportunity Cost Factor

Every trade uses capital and attention.

Taking a bad trade means:
- Capital locked up
- Can't take better trade
- Mental energy spent
- Possible loss to recover from

**Being selective is profitable.** Skipping bad trades IS a good trade.

## R:R Journal

Track R:R on every trade:

\`\`\`
Trade #: ____
Asset: ____
Planned R:R: 1:____
Actual R:R: 1:____
Result: Win/Loss
Notes: ____
\`\`\`

**Monthly review:**
- What's your average planned R:R?
- What's your average actual R:R?
- Are you hitting targets or stopping out?
- Which R:R levels are most profitable?

## The Quality Over Quantity Mindset

**Amateur:** "I need to trade to make money"
**Professional:** "I need to wait for high-quality setups"

Fewer, better trades > Many, random trades

Your job isn't to trade. Your job is to find asymmetric opportunities.`
    },
    {
      id: 'entry-strategies',
      slug: 'entry-strategies',
      title: 'Entry Strategies',
      description: 'Getting into trades at optimal prices',
      difficulty: 'intermediate',
      readTime: 8,
      content: `# Entry Strategies

You've found a trade. You've sized it. You've set your stop. Now how do you actually get in? Entry strategy determines whether your R:R plays out.

## Entry Timing Matters

**Same trade, different entries:**

Good entry at support ($1.00):
- Stop at $0.85 = 15% risk
- Target at $1.50 = 50% reward
- R:R = 1:3.3

Bad entry chasing ($1.20):
- Stop at $0.85 = 29% risk
- Target at $1.50 = 25% reward
- R:R = 1:0.86 (unprofitable)

Same token. Same stop. Same target. Completely different R:R.

## Entry Strategy 1: Limit at Support

Place limit order at support level and wait.

**How:**
1. Identify support level
2. Place limit order at or slightly above support
3. Wait for price to come to you
4. If fills, you got a great entry

**Pros:**
- Best average price
- Automatic execution
- No chasing

**Cons:**
- Might not fill
- Can miss move entirely
- Requires patience

**Best for:** Swing trades, patient traders, high conviction

## Entry Strategy 2: Buy the Breakout

Enter when price breaks key resistance.

**How:**
1. Identify resistance level
2. Wait for price to break above with volume
3. Enter on confirmed break
4. Stop below breakout level

**Pros:**
- Momentum on your side
- Confirmation before entry
- Trend following

**Cons:**
- Entry above prior resistance
- Can be faked out
- Wider stop needed

**Best for:** Breakout traders, momentum plays

## Entry Strategy 3: Breakout Retest

Wait for breakout, then enter on pullback to prior resistance (now support).

**How:**
1. Identify resistance
2. Wait for clean break
3. Wait for price to pull back to test level
4. Enter if level holds as support

**Pros:**
- Better entry than pure breakout
- Confirmation of break
- Tighter stop possible

**Cons:**
- Might not pull back
- Can miss fast moves
- Requires patience

**Best for:** Best of both worlds, patient traders

## Entry Strategy 4: Scaled Entry

Build position across multiple entries.

**How:**
1. Decide total position size ($1000)
2. Split into portions
3. Entry 1: 30% at first signal ($300)
4. Entry 2: 40% on first dip ($400)
5. Entry 3: 30% on deeper dip or never ($300)

**Pros:**
- Better average if it dips
- Not all-in at one price
- Psychological ease

**Cons:**
- Might only get partial position
- More complex
- Might average into loser

**Best for:** Larger positions, uncertain entries

## Entry Strategy 5: Market Order (Urgent)

Just buy now at market price.

**How:**
1. Press buy
2. Accept whatever fill you get

**Pros:**
- Guaranteed execution
- Speed

**Cons:**
- Worst average price
- Slippage can be significant
- No control

**Best for:** Rarely. Only when speed is critical.

## Choosing Your Entry Strategy

| Situation | Best Strategy |
|-----------|---------------|
| Clear support, patient | Limit at support |
| Breaking out with volume | Buy breakout |
| Breakout but extended | Wait for retest |
| Large position | Scaled entry |
| News/urgent | Market (rare) |

## Entry Rules for Better Fills

### Rule 1: Never Chase Green Candles

If it's currently pumping (green candle), don't buy.
- Wait for it to close
- Wait for pullback
- Or skip

Chasing green candles = buying at worst price.

### Rule 2: Use Limit Orders Default

Market orders should be exception, not rule.
- Limit orders control your price
- Forces patience
- Better average fills

### Rule 3: Let It Come to You

Set your levels, set alerts, wait.
- You defined support
- You set your limit
- Now be patient
- If it doesn't fill, there's always another trade

### Rule 4: If You Miss It, You Miss It

Trade ran without you? That's okay.
- Missing > Chasing
- There's always another setup
- Discipline > This one trade

## Entry Checklist

Before entering any trade:

- [ ] Entry strategy chosen
- [ ] Entry price/zone defined
- [ ] Stop loss already calculated
- [ ] Position size already calculated
- [ ] Not chasing a green candle
- [ ] R:R still makes sense at this entry
- [ ] Order placed or alert set

## Slippage Awareness

On DEXs especially, slippage matters:

**Slippage** = Difference between expected price and actual fill.

**Reduce slippage:**
- Use limit orders
- Check liquidity first
- Split large orders
- Avoid trading during extreme volatility
- Set appropriate slippage tolerance (1-3% usually)

**Factor slippage into R:R:**
- If 2% slippage in and out
- Your effective entry is 2% worse
- Your effective exit is 2% worse
- Account for this in calculations`
    },
    {
      id: 'taking-profits',
      slug: 'taking-profits',
      title: 'Taking Profits',
      description: 'The hardest skill - actually selling your winners',
      difficulty: 'intermediate',
      readTime: 8,
      content: `# Taking Profits

Entry is easy. Taking profits is hard. You'll second-guess every exit. "What if it goes higher?" "Should I have held?" Here's how to take profits without regret.

## Why Taking Profits Is So Hard

**Psychological traps:**
- Greed: "It could go higher"
- Ego: "I'll sell the exact top"
- FOMO: "What if it 10x after I sell?"
- Anchoring: "I'm not selling until it hits $X"

**Reality check:** You will never sell the top. Never. The goal is to sell while it's still going up.

## Profit-Taking Strategies

### Strategy 1: Fixed Target Exit

Set target at entry, exit 100% when hit.

**Example:**
- Entry: $1.00
- Target: $1.50
- When price hits $1.50, sell everything

**Pros:**
- Simple
- No decisions needed
- Target achieved

**Cons:**
- Miss bigger moves
- All-or-nothing

**Best for:** Beginners, simple trades

### Strategy 2: Scaled Exit

Sell in portions at multiple targets.

**Example:**
- Entry: $1.00
- Target 1: $1.30 → Sell 33%
- Target 2: $1.50 → Sell 33%
- Target 3: $1.80 → Sell 34% (or trail)

**Pros:**
- Locks in some profit early
- Lets winners run
- Psychological ease

**Cons:**
- More complex
- Still might miss big move
- Might sell too early

**Best for:** Most traders, most situations

### Strategy 3: Trailing Stop Exit

Move stop up as price rises, exit when stop is hit.

**Example:**
- Entry: $1.00
- Initial stop: $0.85
- Price rises to $1.30, move stop to $1.10
- Price rises to $1.60, move stop to $1.40
- Price drops to $1.40, stopped out with profit

**Pros:**
- Captures big moves
- Automatic (if using trailing stop order)
- No guessing at top

**Cons:**
- Give back some gains
- Can get stopped on pullback
- Requires monitoring or orders

**Best for:** Trending markets, letting winners run

### Strategy 4: Time-Based Exit

Exit after predetermined time regardless of price.

**Example:**
- Entry: Monday
- Exit: Friday regardless of price

**Pros:**
- No agonizing over price
- Frees up capital
- Defines trade duration

**Cons:**
- Might exit too early or late
- Ignores price action

**Best for:** Catalyst trades, swing trades

### Strategy 5: Hybrid (Recommended)

Combine strategies.

**Example:**
- Target 1 ($1.30): Sell 50%, take profit
- Remainder: Trail with stop at $1.15
- Stop hit: Exit
- Or Target 2 ($1.80): Exit fully

This locks in profit while allowing for bigger moves.

## The "Take Initial Out" Rule

**Always get your initial investment back.**

If you invested $1,000 and it's now worth $2,000:
- Sell $1,000 worth (your initial)
- Remaining $1,000 is "house money"
- Much easier to hold psychologically

Now you literally can't lose (on this trade). Whatever happens is profit.

## Setting Targets Properly

**Good targets are based on:**
- Previous resistance levels
- Measured moves (chart patterns)
- Comparable token performance
- Round numbers (psychological)

**Bad targets are based on:**
- "I want to make 10x"
- Random numbers
- "What I need to break even overall"
- Emotions

## The Exit Execution

When target hits:
1. Execute the plan (no hesitation)
2. Don't second-guess
3. Log the trade
4. Move on

**The plan was made when you were rational.** Trust past-you over in-the-moment-you.

## After You Sell

**What NOT to do:**
- Immediately check price
- Calculate "what you could have made"
- Feel regret if it kept going
- Buy back at higher price

**What TO do:**
- Log the trade
- Calculate actual profit
- Appreciate the win
- Find next opportunity

**Profits taken are real. Profits not taken are imaginary.**

## Common Profit-Taking Mistakes

### Mistake 1: Moving Targets Up

"I'll sell at 2x" becomes "Let me wait for 3x" when it hits 2x.

**Fix:** Write targets BEFORE entry. Don't change them higher.

### Mistake 2: Never Taking Profit

"I don't want to sell too early."

**Fix:** Some profit > No profit. At minimum, take initial out.

### Mistake 3: Selling All on First Target

"Locked in profits!" Meanwhile it goes another 5x.

**Fix:** Scale out. Keep some exposure.

### Mistake 4: Buying Back Higher

You sell at $1.50, it goes to $1.80, you buy back, it dumps to $1.20.

**Fix:** Once you exit a trade, you're done with it. Don't re-enter.

## Profit-Taking Checklist

At entry, define:
- [ ] Target 1: Price and % to sell
- [ ] Target 2: Price and % to sell
- [ ] Trailing stop plan (if using)
- [ ] Time limit (if applicable)

At target:
- [ ] Execute plan
- [ ] Don't hesitate
- [ ] Log results
- [ ] Don't look back`
    }
  ]
}

export default traderModule
