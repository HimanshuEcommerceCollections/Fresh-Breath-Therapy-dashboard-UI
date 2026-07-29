// src/components/ui/Skeleton.tsx
//
// Base skeleton primitive — a shimmering placeholder shape. Every shaped
// variant in this folder (SummaryCardSkeleton, ChartSkeleton, etc.) is
// built from this. Uses the .skeleton-shimmer sweep defined in
// globals.css rather than Tailwind's flat animate-pulse — closer to the
// "shining lights" effect this app's cards call for.

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded-md ${className}`} />;
}
