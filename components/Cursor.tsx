"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop-only delights, loaded after the hero is interactive:
 * a soft accent glow that follows the cursor (a nod to the old site's cursor-reactive colour),
 * a ring that grows over links and buttons, and a magnetic pull on [data-magnetic] elements.
 * Skipped on touch devices and when reduced motion is requested. The native cursor stays visible.
 */
export default function Cursor() {
  const glow = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let magnet: HTMLElement | null = null;
    // background doodles drift with the cursor (see components/Backdrop.tsx)
    const backdrop = document.querySelector<HTMLElement>(".backdrop");

    const move = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        backdrop?.style.setProperty("--px", (e.clientX / window.innerWidth - 0.5).toFixed(3));
        backdrop?.style.setProperty("--py", (e.clientY / window.innerHeight - 0.5).toFixed(3));
        const target = e.target as Element | null;
        const interactive = !!target?.closest?.("a, button, [role=button], input");
        if (glow.current) {
          glow.current.style.opacity = "1";
          glow.current.style.transform = `translate3d(${e.clientX - 220}px, ${e.clientY - 220}px, 0)`;
        }
        if (ring.current) {
          ring.current.style.opacity = "1";
          ring.current.style.transform = `translate3d(${e.clientX - 8}px, ${e.clientY - 8}px, 0) scale(${interactive ? 1.6 : 1})`;
        }
        const next = (target?.closest?.("[data-magnetic]") as HTMLElement | null) ?? null;
        if (magnet && magnet !== next) magnet.style.translate = "";
        magnet = next;
        if (magnet) {
          const r = magnet.getBoundingClientRect();
          magnet.style.translate = `${(e.clientX - (r.left + r.width / 2)) * 0.18}px ${(e.clientY - (r.top + r.height / 2)) * 0.25}px`;
        }
      });
    };
    const leave = () => {
      if (glow.current) glow.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
      if (magnet) magnet.style.translate = "";
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div ref={glow} className="cursor-glow" />
      <div ref={ring} className="cursor-ring" />
    </div>
  );
}
