function StatCard({ label, value }) {
  return (
    <div className="bg-[#141414] border border-[#252525] rounded-xl p-4 text-center">
      <div className="text-2xl font-bold text-[#f5f5f5]">{value}</div>
      <div className="text-sm text-[#666666] mt-1">{label}</div>
    </div>
  )
}

function PatternCard({ pattern }) {
  return (
    <div className="bg-[#141414] border border-[#252525] rounded-xl p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#8b5cf6] mt-2 flex-shrink-0" />
        <h3 className="text-lg font-semibold text-[#f5f5f5]">{pattern.name}</h3>
      </div>
      <p className="text-[#888888] mb-4 leading-relaxed">{pattern.description}</p>
      <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4">
        <div className="text-xs text-[#8b5cf6] uppercase tracking-wide mb-2">Fix</div>
        <p className="text-[#f5f5f5] text-sm leading-relaxed">{pattern.correction}</p>
      </div>
    </div>
  )
}

export default function Results({ analysis, stats, onReset }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={onReset}
          className="text-[#666666] hover:text-[#888888] transition-colors mb-8 flex items-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Analyze another wallet
        </button>

        {/* Verdict */}
        <div className="mb-12">
          <div className="text-xs text-[#8b5cf6] uppercase tracking-widest mb-3">The Verdict</div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#f5f5f5]">
            {analysis.verdict}
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <StatCard label="Total Trades" value={stats.dexTrades} />
          <StatCard label="Buys" value={stats.buys} />
          <StatCard label="Sells" value={stats.sells} />
          <StatCard label="Win Rate" value={analysis.winRate} />
        </div>

        {/* Hold Time */}
        <div className="bg-[#141414] border border-[#252525] rounded-xl p-6 mb-12">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-[#666666]">Average Hold Time</div>
              <div className="text-2xl font-bold text-[#f5f5f5] mt-1">{analysis.avgHoldTime}</div>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
        </div>

        {/* Patterns */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-[#f5f5f5]">Behavioral Patterns</h2>
          <div className="space-y-4">
            {analysis.patterns.map((pattern, i) => (
              <PatternCard key={i} pattern={pattern} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-[#252525]">
          <p className="text-[#666666] mb-4">
            Your patterns are fixable. Awareness is the first step.
          </p>
          <button
            onClick={onReset}
            className="px-8 py-4 bg-[#8b5cf6] text-white font-semibold rounded-xl hover:bg-[#7c4fe0] transition-colors"
          >
            Analyze another wallet
          </button>
        </div>
      </div>
    </div>
  )
}
