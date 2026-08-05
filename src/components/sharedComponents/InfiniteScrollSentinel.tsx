"use client";

import { useEffect, useRef } from "react";

// Bottom-of-list marker for infinite-scroll tables. Unlike useInView (which
// fires once and stops), this re-observes every time `enabled` flips back to
// true — i.e. after each page loads and the sentinel settles back into view,
// it can trigger the next page too.
export default function InfiniteScrollSentinel({
  onIntersect,
  hasNextPage,
  isFetchingNextPage,
}: {
  onIntersect: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const enabled = Boolean(hasNextPage) && !isFetchingNextPage;

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersect();
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, onIntersect]);

  if (!hasNextPage && !isFetchingNextPage) return null;

  return (
    <div ref={ref} className="flex items-center justify-center py-4">
      {isFetchingNextPage && (
        <div className="flex items-center gap-2 text-sm text-[#596475]">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#E0E5EB] border-t-[#376EF4]" />
          Loading more…
        </div>
      )}
    </div>
  );
}
