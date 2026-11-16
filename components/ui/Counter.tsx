"use client";

import { useEffect, useRef } from "react";
import type { Stat } from "@/content/profile";

const format = (n: number, decimals = 0) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Server-renders the final value; counts up once when scrolled into view.
 * The count-up writes text straight to one contained node, so it never re-renders React
 * or triggers page-wide layout.
 */
export function Counter({ value, prefix = "", suffix = "", decimals = 0 }: Omit<Stat, "label">) {
  const el = useRef<HTMLSpanElement>(null);
  const live = useRef<HTMLSpanElement>(null);
  const final = `${prefix}${format(value, decimals)}${suffix}`;

  useEffect(() => {
    const node = live.current;
    if (!node || !el.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const delay = document.documentElement.dataset.loader ? 1100 : 150;
    const duration = 600;
    let raf = 0;
    let start = 0;
    let wrote = 0;
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      // ~12 visible steps is plenty; writing text on every frame costs layout for no visible gain
      if (t === 1 || now - wrote > 50) {
        wrote = now;
        node.textContent = t < 1 ? `${prefix}${format(value * (1 - Math.pow(1 - t, 3)), decimals)}${suffix}` : final;
      }
      if (t < 1) raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      start = performance.now() + delay;
      raf = requestAnimationFrame(step);
    });
    io.observe(el.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      node.textContent = final;
    };
  }, [value, prefix, suffix, decimals, final]);

  return (
    <span ref={el} className="relative inline-block whitespace-nowrap tabular-nums">
      {/* the final value reserves the width and is what screen readers hear */}
      <span className="invisible" aria-hidden="true">{final}</span>
      <span className="sr-only">{final}</span>
      <span ref={live} className="absolute inset-0 [contain:strict]" aria-hidden="true">
        {final}
      </span>
    </span>
  );
}
