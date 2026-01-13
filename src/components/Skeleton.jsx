/**
 * Skeleton loading components for smooth loading states
 */

// Basic skeleton box with shimmer animation
export function Skeleton({ width, height, borderRadius = '0.5rem', className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem',
        borderRadius,
      }}
    />
  )
}

// Text line skeleton
export function SkeletonText({ lines = 1, width = '100%' }) {
  return (
    <div className="skeleton-text">
      {[...Array(lines)].map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 && lines > 1 ? '60%' : width}
          height="1rem"
          className="skeleton-line"
        />
      ))}
    </div>
  )
}

// Card skeleton for dashboard/journal cards
export function SkeletonCard({ height = '120px' }) {
  return (
    <div className="skeleton-card glass-card">
      <Skeleton height={height} borderRadius="0.75rem" />
    </div>
  )
}

// Stats bar skeleton
export function SkeletonStatsBar() {
  return (
    <div className="skeleton-stats-bar">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-stat-item">
          <Skeleton width="60px" height="1.5rem" />
          <Skeleton width="40px" height="0.75rem" />
        </div>
      ))}
    </div>
  )
}

// Trade card skeleton
export function SkeletonTradeCard() {
  return (
    <div className="skeleton-trade-card glass-card">
      <div className="skeleton-trade-header">
        <Skeleton width="100px" height="1.25rem" />
        <Skeleton width="60px" height="1.25rem" />
        <Skeleton width="80px" height="1rem" />
      </div>
    </div>
  )
}

// Journal page skeleton
export function JournalSkeleton() {
  return (
    <div className="journal-skeleton">
      {/* Stats skeleton */}
      <div className="skeleton-stats glass-card">
        <div className="skeleton-stats-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-stat">
              <Skeleton width="50px" height="2rem" />
              <Skeleton width="60px" height="0.875rem" />
            </div>
          ))}
        </div>
      </div>

      {/* Insights skeleton */}
      <div className="skeleton-insights glass-card">
        <Skeleton width="100px" height="1.25rem" />
        <SkeletonText lines={2} />
      </div>

      {/* Tabs skeleton */}
      <div className="skeleton-tabs">
        <Skeleton width="80px" height="2.5rem" borderRadius="0.5rem" />
        <Skeleton width="80px" height="2.5rem" borderRadius="0.5rem" />
        <Skeleton width="80px" height="2.5rem" borderRadius="0.5rem" />
      </div>

      {/* Trade cards skeleton */}
      <div className="skeleton-trades">
        {[...Array(3)].map((_, i) => (
          <SkeletonTradeCard key={i} />
        ))}
      </div>
    </div>
  )
}

// Dashboard page skeleton
export function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton">
      {/* Stats bar skeleton */}
      <SkeletonStatsBar />

      {/* Journal section skeleton */}
      <div className="skeleton-section glass-card">
        <Skeleton width="120px" height="1.25rem" />
        <div className="skeleton-cards-row">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} width="150px" height="80px" borderRadius="0.75rem" />
          ))}
        </div>
      </div>

      {/* Archetype hero skeleton */}
      <div className="skeleton-hero glass-card">
        <div className="skeleton-hero-content">
          <Skeleton width="60px" height="60px" borderRadius="50%" />
          <div className="skeleton-hero-text">
            <Skeleton width="200px" height="1.5rem" />
            <SkeletonText lines={2} />
          </div>
        </div>
      </div>

      {/* Quick actions skeleton */}
      <div className="skeleton-actions">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} width="120px" height="44px" borderRadius="0.5rem" />
        ))}
      </div>
    </div>
  )
}

export default Skeleton
