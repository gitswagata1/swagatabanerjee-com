"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

const { timeZone, timeZoneLabel } = profile.identity;
const fmt = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hour12: false });

/** Live local time. Renders a fixed-width dash on the server so nothing shifts on hydration. */
export function IstClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums" aria-label={time ? `Local time ${time} ${timeZoneLabel}` : undefined}>
      <span className="inline-block min-w-[5ch] text-right">{time ?? "--:--"}</span> {timeZoneLabel}
    </span>
  );
}
