"use client";

import { useCallback, useEffect, useState } from "react";

// Fires once, the first time the ref'd element scrolls into the viewport,
// then stops observing — used to defer mount-time chart animations until
// the chart is actually visible, instead of firing on page load.
//
// `ref` is a CALLBACK ref rather than a RefObject, and that is load-bearing:
// every consumer renders a loading skeleton on its first render and only
// mounts the observed element once data has arrived. With a RefObject,
// ref.current was still null when the mount-time effect ran, and because the
// effect's deps never changed afterwards it never re-ran — so the observer
// was never attached, isInView stayed false forever, and any chart gated on
// `{isInView && ...}` rendered nothing at all. A callback ref re-runs setup
// at the moment the node actually attaches, however late that is.
export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const [node, setNode] = useState<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  const ref = useCallback((next: T | null) => setNode(next), []);

  useEffect(() => {
    if (!node || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, isInView, threshold]);

  return { ref, isInView };
}
