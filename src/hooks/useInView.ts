"use client";

import { useEffect, useRef, useState } from "react";

// Fires once, the first time the ref'd element scrolls into the viewport,
// then stops observing — used to defer mount-time chart animations until
// the chart is actually visible, instead of firing on page load.
export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
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
  }, [isInView, threshold]);

  return { ref, isInView };
}
