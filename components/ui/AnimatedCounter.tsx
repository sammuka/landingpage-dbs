"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

// easeOutQuart: fast start, gentle deceleration
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function AnimatedCounter({
  from,
  to,
  duration = 1.8,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inViewRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);
  const isInView = useInView(inViewRef, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView || hasAnimatedRef.current || !ref.current) return;
    hasAnimatedRef.current = true;

    const node = ref.current;
    const fmt = (v: number) => prefix + v.toFixed(decimals) + suffix;
    const durationMs = duration * 1000;
    const startTime = performance.now();
    let rafId: number;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutQuart(progress);
      const current = from + (to - from) * eased;
      node.textContent = fmt(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      // Always show the final value if animation is interrupted
      if (node) node.textContent = fmt(to);
    };
  }, [isInView, from, to, duration, prefix, suffix, decimals]);

  // SSR/initial render: always show the final (to) value.
  // The rAF animation overrides textContent when triggered.
  return (
    <span ref={inViewRef}>
      <span ref={ref} className={className}>
        {prefix}{to.toFixed(decimals)}{suffix}
      </span>
    </span>
  );
}
