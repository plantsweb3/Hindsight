// Wallet Label Badge Component
// Color coding: Main=purple, Long Hold=blue, Gamble=red, Sniper=yellow, Custom/Unlabeled=gray

const LABEL_COLORS = {
  'Main': { bg: 'rgba(139, 92, 246, 0.2)', border: 'rgba(139, 92, 246, 0.4)', text: '#a78bfa' },
  'Long Hold': { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.4)', text: '#60a5fa' },
  'Gamble': { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.4)', text: '#f87171' },
  'Sniper': { bg: 'rgba(234, 179, 8, 0.2)', border: 'rgba(234, 179, 8, 0.4)', text: '#fbbf24' },
  'Unlabeled': { bg: 'rgba(113, 113, 122, 0.2)', border: 'rgba(113, 113, 122, 0.4)', text: '#a1a1aa' },
}

export default function WalletLabelBadge({ label, size = 'small' }) {
  if (!label || label === 'Unlabeled') return null

  const colors = LABEL_COLORS[label] || LABEL_COLORS['Unlabeled']
  const isSmall = size === 'small'

  return (
    <span
      className="wallet-label-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: isSmall ? '0.125rem 0.5rem' : '0.25rem 0.625rem',
        fontSize: isSmall ? '0.7rem' : '0.75rem',
        fontWeight: 500,
        borderRadius: '9999px',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

export { LABEL_COLORS }
