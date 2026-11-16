"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile, type SectionId } from "@/content/profile";
import { emit, on, store } from "@/lib/events";
import { MiniSwagata, type AvatarState } from "./MiniSwagata";

const { avatar } = profile;
const SLEEP_AFTER = 30_000;

type Bubble = { text: string; actions?: { label: string; run: () => void }[]; auto?: boolean } | null;
const AUTO_DISMISS = 6000; // contextual lines clear themselves so they never sit on top of content

/** Sections that exist on the page right now and have a line to say. */
const tourStops = () =>
  avatar.tourOrder.filter((id) => avatar.lines[id] && document.getElementById(id)) as SectionId[];

export default function AvatarGuide() {
  const [hidden, setHidden] = useState(() => store.get("guide-hidden") === "1");
  const [state, setState] = useState<AvatarState>("idle");
  const [bubble, setBubble] = useState<Bubble>(null);
  const [entering, setEntering] = useState(false);
  const touring = useRef(false);
  const chatBusy = useRef(false);
  const wrap = useRef<HTMLDivElement>(null);

  const rest = useCallback(() => setState("idle"), []);

  const hide = useCallback(() => {
    store.set("guide-hidden", "1");
    setHidden(true);
    emit("guide-visibility", false);
  }, []);

  // ── Tour ──────────────────────────────────────────────────────
  const endTour = useCallback(() => {
    touring.current = false;
    setBubble(null);
    rest();
  }, [rest]);

  const goTo = useCallback(
    (stops: SectionId[], i: number) => {
      const id = stops[i];
      if (!id) return endTour();
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      setState("walk");
      setBubble(null);
      window.setTimeout(
        () => {
          if (!touring.current) return;
          setState("point");
          const last = i === stops.length - 1;
          setBubble({
            text: avatar.lines[id] ?? "",
            actions: last
              ? [{ label: "Done", run: endTour }]
              : [
                  { label: "Next", run: () => goTo(stops, i + 1) },
                  { label: "End tour", run: endTour },
                ],
          });
        },
        reduce ? 0 : 700,
      );
    },
    [endTour],
  );

  const startTour = useCallback(() => {
    const stops = tourStops();
    if (!stops.length) return;
    touring.current = true;
    goTo(stops, 0);
  }, [goTo]);

  // ── First visit: walk in, wave, offer the tour ────────────────
  useEffect(() => {
    if (hidden) return;
    if (store.get("guide-greeted") || !tourStops().length) return;
    store.set("guide-greeted", "1");
    setEntering(true);
    setState("wave");
    setBubble({
      text: avatar.greeting,
      actions: [
        { label: avatar.tourYes, run: startTour },
        { label: avatar.tourNo, run: () => (setBubble(null), rest()) },
      ],
    });
  }, [hidden, startTour, rest]);

  // ── One contextual line per section, once per session ─────────
  useEffect(() => {
    if (hidden) return;
    const seen = new Set((store.get("guide-seen", true) ?? "").split(",").filter(Boolean));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          if (!entry.isIntersecting || seen.has(id) || touring.current || chatBusy.current) continue;
          seen.add(id);
          store.set("guide-seen", [...seen].join(","), true);
          setBubble((current) => (!current || current.auto ? { text: avatar.lines[id] ?? "", auto: true } : current));
        }
      },
      { threshold: 0.4 },
    );
    for (const id of Object.keys(avatar.lines)) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [hidden]);

  useEffect(() => {
    if (!bubble?.auto) return;
    const t = window.setTimeout(() => setBubble((b) => (b === bubble ? null : b)), AUTO_DISMISS);
    return () => window.clearTimeout(t);
  }, [bubble]);

  // ── Sleep after 30 s idle, wake on movement; eyes follow the cursor ──
  useEffect(() => {
    if (hidden) return;
    let timer = 0;
    let frame = 0;
    const arm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!touring.current && !chatBusy.current) setState("sleep");
      }, SLEEP_AFTER);
    };
    const wake = () => {
      setState((s) => (s === "sleep" ? "idle" : s));
      arm();
    };
    const look = (e: PointerEvent) => {
      wake();
      if (e.pointerType !== "mouse" || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = wrap.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        el.style.setProperty("--lx", (dx / d).toFixed(2));
        el.style.setProperty("--ly", (dy / d).toFixed(2));
      });
    };
    // blink now and then (a class toggle, not a constantly running animation)
    const blink = window.setInterval(() => {
      const el = wrap.current;
      if (!el) return;
      el.dataset.blink = "";
      window.setTimeout(() => delete el.dataset.blink, 140);
    }, 4500);
    arm();
    window.addEventListener("pointermove", look, { passive: true });
    window.addEventListener("keydown", wake);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("touchstart", wake, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(blink);
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", look);
      window.removeEventListener("keydown", wake);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("touchstart", wake);
    };
  }, [hidden]);

  // ── Events from the rest of the site ──────────────────────────
  useEffect(() => {
    const offs = [
      on("guide-visibility", (visible) => setHidden(!visible)),
      on("avatar-state", (s) => {
        chatBusy.current = s === "think" || s === "talk";
        if (chatBusy.current) setBubble(null);
        setState(s);
      }),
      on("celebrate", () => {
        setState("celebrate");
        window.setTimeout(rest, 1600);
      }),
    ];
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (touring.current) endTour();
      else setBubble(null);
    };
    window.addEventListener("keydown", esc);
    return () => {
      offs.forEach((off) => off());
      window.removeEventListener("keydown", esc);
    };
  }, [endTour, rest]);

  if (hidden) return null;

  return (
    <div
      ref={wrap}
      className={`pointer-events-none fixed bottom-3 right-3 z-40 flex flex-col items-end gap-2 sm:bottom-5 sm:right-5 ${entering ? "guide-in" : ""}`}
    >
      <div aria-live="polite" className="pointer-events-auto max-w-[min(17rem,calc(100vw-1.5rem))]">
        {bubble && (
          <div className="bubble rounded-2xl rounded-br-sm border border-line bg-paper p-3 text-sm shadow-[4px_4px_0_var(--line)]">
            <div className="flex items-start gap-2">
              <p className="flex-1">{bubble.text}</p>
              <button
                type="button"
                onClick={() => (touring.current ? endTour() : (setBubble(null), rest()))}
                aria-label="Dismiss"
                className="-mr-1 -mt-1 grid size-7 shrink-0 place-items-center rounded-full text-ink-2 hover:bg-paper-2"
              >
                ×
              </button>
            </div>
            {bubble.actions && (
              <div className="mt-2 flex flex-wrap gap-2">
                {bubble.actions.map((a, i) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={a.run}
                    className={`h-9 rounded-full px-3 text-xs font-medium ${i === 0 ? "bg-accent text-on-accent" : "border border-ink"}`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="group pointer-events-auto relative">
        <button
          type="button"
          onClick={() => emit("open-chat")}
          aria-label={`${profile.chat.label}: open chat`}
          className="block rounded-full transition-transform duration-150 ease-spring hover:scale-105"
        >
          <MiniSwagata state={state} decorative className="size-12 sm:size-20" />
        </button>
        <button
          type="button"
          onClick={hide}
          aria-label="Hide guide"
          title="Hide guide"
          className="absolute -left-2 -top-2 grid size-6 place-items-center rounded-full border border-line bg-paper text-xs text-ink-2 opacity-0 transition-opacity duration-150 focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  );
}
