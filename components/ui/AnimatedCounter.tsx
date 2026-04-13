"use client";

import { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
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

    const controls = animate(from, to, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (value) => {
        node.textContent = fmt(value);
      },
    });

    return () => {
      controls.stop();
      // Always show the final value if animation is interrupted
      // (e.g., by React Strict Mode double-mount or re-render)
      if (node) node.textContent = fmt(to);
    };
  }, [isInView, from, to, duration, prefix, suffix, decimals]);

  // SSR/initial render: always show the final (to) value
  return (
    <span ref={inViewRef}>
      <span ref={ref} className={className}>
        {prefix}{to.toFixed(decimals)}{suffix}
      </span>
    </span>
  );
}
