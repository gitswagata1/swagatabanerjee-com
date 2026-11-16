"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { MiniSwagata } from "@/components/avatar/MiniSwagata";
import { Text } from "@/components/ui/Section";
import { store } from "@/lib/events";

/**
 * Game Mode — the Journey as a side-scroller. DOM + one requestAnimationFrame loop, no engine.
 * The loop writes transforms straight to the DOM; React only re-renders when a card is collected.
 */
const { journey } = profile;
const LEVELS = [
  { ...journey.beforeVit, term: "Tutorial" },
  ...journey.semesters.map((s) => ({ ...s, term: s.term ?? "" })),
];
const START = 160;
const GAP = 560;
const FIRST = 520;
const levelX = (i: number) => FIRST + i * GAP;
const FINISH = levelX(LEVELS.length - 1) + 380;
const WORLD = FINISH + 500;
const SPEED = 280; // px/s
const GRAVITY = 1900;
const JUMP = 760; // apex ≈ 150 px
const CARD_Y = 120; // card height above ground
const KEY = "game-collected";

type Keys = { left: boolean; right: boolean; jump: boolean };

export default function GameMode({ onExit }: { onExit: () => void }) {
  const [collected, setCollected] = useState<string[]>(() => (store.get(KEY, true) ?? "").split(",").filter(Boolean));
  const [latest, setLatest] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [sound, setSound] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLDivElement>(null);
  const keys = useRef<Keys>({ left: false, right: false, jump: false });
  const live = useRef({ collected, sound, finished });
  live.current = { collected, sound, finished };
  const audio = useRef<AudioContext | null>(null);

  const blip = useCallback((freq: number) => {
    if (!live.current.sound) return;
    try {
      const ctx = (audio.current ??= new AudioContext());
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  }, []);

  // ── Game loop ─────────────────────────────────────────────────
  useEffect(() => {
    let x = START;
    let y = 0;
    let vy = 0;
    let facing = 1;
    let last = performance.now();
    let raf = 0;
    const svg = player.current?.querySelector("svg");

    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const k = keys.current;
      const dir = (k.right ? 1 : 0) - (k.left ? 1 : 0);
      if (dir) facing = dir;
      x = Math.max(40, Math.min(WORLD - 60, x + dir * SPEED * dt));
      if (k.jump && y === 0) vy = JUMP;
      vy -= GRAVITY * dt;
      y = Math.max(0, y + vy * dt);
      if (y === 0) vy = 0;

      const width = stage.current?.clientWidth ?? 800;
      const cam = Math.max(0, Math.min(WORLD - width, x - width * 0.35));
      if (world.current) world.current.style.transform = `translate3d(${-cam}px,0,0)`;
      if (player.current) player.current.style.transform = `translate3d(${x - 40}px,${-y}px,0) scaleX(${facing})`;
      if (svg) svg.dataset.state = live.current.finished ? "celebrate" : y > 0 ? "wave" : dir ? "walk" : "idle";

      // collect a card: be near it horizontally and high enough
      for (let i = 0; i < LEVELS.length; i++) {
        const id = LEVELS[i].id;
        if (live.current.collected.includes(id)) continue;
        if (Math.abs(x - levelX(i)) < 44 && y > CARD_Y - 80) {
          const next = [...live.current.collected, id];
          live.current.collected = next;
          store.set(KEY, next.join(","), true);
          setCollected(next);
          setLatest(i);
          blip(660 + i * 40);
        }
      }
      if (!live.current.finished && x > FINISH) {
        live.current.finished = true;
        setFinished(true);
        blip(990);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [blip]);

  // ── Input: arrows / WASD / space, Esc to leave, swipe up to jump ──
  useEffect(() => {
    const map: Record<string, keyof Keys> = {
      ArrowLeft: "left", a: "left", A: "left",
      ArrowRight: "right", d: "right", D: "right",
      ArrowUp: "jump", w: "jump", W: "jump", " ": "jump",
    };
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onExit();
      const k = map[e.key];
      if (!k) return;
      e.preventDefault();
      keys.current[k] = true;
    };
    const up = (e: KeyboardEvent) => {
      const k = map[e.key];
      if (k) keys.current[k] = false;
    };
    let touchY = 0;
    const touchStart = (e: TouchEvent) => (touchY = e.touches[0].clientY);
    const touchEnd = (e: TouchEvent) => {
      if (touchY - e.changedTouches[0].clientY > 40) {
        keys.current.jump = true;
        window.setTimeout(() => (keys.current.jump = false), 120);
      }
    };
    const el = stage.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // page scroll position is untouched underneath
    el?.focus();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    el?.addEventListener("touchstart", touchStart, { passive: true });
    el?.addEventListener("touchend", touchEnd, { passive: true });
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      el?.removeEventListener("touchstart", touchStart);
      el?.removeEventListener("touchend", touchEnd);
      audio.current?.close().catch(() => {});
      previous?.focus?.();
    };
  }, [onExit]);

  const hold = (k: keyof Keys) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      keys.current[k] = true;
    },
    onPointerUp: () => (keys.current[k] = false),
    onPointerLeave: () => (keys.current[k] = false),
    onPointerCancel: () => (keys.current[k] = false),
  });

  const total = LEVELS.length;
  const done = collected.length;
  const all = done === total;
  const pad = "grid size-14 place-items-center rounded-full border border-ink bg-paper font-mono text-xl active:bg-ink active:text-paper touch-none select-none";
  const hud = "h-11 rounded-full border border-ink px-4 text-sm font-medium";

  return (
    <div
      ref={stage}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Game Mode: walk through the journey"
      className="fixed inset-0 z-[90] overflow-hidden bg-paper outline-none"
      style={{
        backgroundImage:
          "linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      {/* HUD */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 sm:p-5">
        <div className="min-w-0">
          <p className="sheet-label">GAME MODE / THE JOURNEY</p>
          <p className="mt-1 font-mono text-sm">
            {done} / {total} levels
          </p>
          <div
            role="progressbar"
            aria-label="Levels collected"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
            className="mt-1 h-2 w-40 border border-ink sm:w-56"
          >
            <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${(done / total) * 100}%` }} />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setSound((s) => !s)} aria-pressed={sound} className={`${hud} bg-paper hover:bg-paper-2`}>
            Sound {sound ? "on" : "off"}
          </button>
          <button type="button" onClick={onExit} className={`${hud} bg-ink text-paper`}>
            Exit <span className="hidden font-mono text-xs opacity-70 sm:inline">Esc</span>
          </button>
        </div>
      </div>

      {/* Collected card */}
      <div aria-live="polite" className="absolute inset-x-3 top-24 z-10 mx-auto max-w-md sm:top-28">
        {finished ? (
          <div className="bubble border border-ink bg-paper p-4 shadow-[5px_5px_0_var(--line)]">
            <p className="sheet-label">FINALE</p>
            <p className="mt-1 font-display text-2xl font-semibold">{LEVELS[total - 1].items[0]}</p>
            <p className="mt-1 text-sm text-ink-2">
              {all ? `All ${total} levels collected.` : `${done} / ${total} levels collected. Walk back for the rest.`}
            </p>
            <button type="button" onClick={onExit} className="mt-3 h-11 rounded-full bg-accent px-5 text-sm font-medium text-on-accent">
              Back to the site
            </button>
          </div>
        ) : latest !== null ? (
          <div key={latest} className="bubble border border-line bg-paper p-4 shadow-[5px_5px_0_var(--line)]">
            <p className="sheet-label">
              COLLECTED · {LEVELS[latest].label.toUpperCase()} {LEVELS[latest].term && `· ${LEVELS[latest].term.toUpperCase()}`}
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {LEVELS[latest].items.map((item) => (
                <li key={item}>
                  <Text value={item} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center font-mono text-xs text-ink-2">
            <span className="hidden sm:inline">← → or A D to walk · ↑, W or space to jump · </span>Jump to grab each card.
          </p>
        )}
      </div>

      {finished && all && (
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/3 z-10">
          {Array.from({ length: 24 }, (_, i) => (
            <span key={i} className="confetti" style={{ ["--a" as string]: `${i * 15}deg`, animationDuration: "1.2s", animationIterationCount: 3 }} />
          ))}
        </div>
      )}

      {/* World */}
      <div ref={world} className="absolute bottom-28 left-0 h-72 will-change-transform sm:bottom-24" style={{ width: WORLD }}>
        <div className="absolute inset-x-0 bottom-0 border-t-2 border-ink" />
        <div className="ticks absolute inset-x-0 -bottom-3" aria-hidden="true" />

        {LEVELS.map((level, i) => {
          const got = collected.includes(level.id);
          return (
            <div key={level.id} className="absolute bottom-0" style={{ left: levelX(i) }}>
              <div className="absolute -bottom-10 -translate-x-1/2 whitespace-nowrap text-center font-mono text-xs text-ink-2">
                {String(i).padStart(2, "0")} · {level.label}
              </div>
              <div className="absolute bottom-0 h-16 w-px -translate-x-1/2 bg-line" />
              <div
                className={`absolute grid h-14 w-20 -translate-x-1/2 place-items-center border font-mono text-[11px] transition-all duration-300 ${
                  got ? "border-line text-ink-2 opacity-40" : "border-accent bg-paper text-accent shadow-[3px_3px_0_var(--line)]"
                }`}
                style={{ bottom: CARD_Y }}
              >
                {got ? "✓" : level.label.toUpperCase()}
              </div>
            </div>
          );
        })}

        <div className="absolute bottom-0" style={{ left: FINISH }}>
          <div className="h-40 w-0.5 bg-ink" />
          <div className="absolute left-0.5 top-0 bg-accent px-3 py-1 font-mono text-xs text-on-accent">GRADUATION</div>
        </div>

        <div ref={player} className="absolute bottom-0 left-0 w-20 will-change-transform">
          <MiniSwagata decorative className="size-20" />
        </div>
      </div>

      {/* Touch controls */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-4 [@media(hover:hover)]:hidden">
        <div className="flex gap-3">
          <button type="button" aria-label="Walk left" className={pad} {...hold("left")}>
            ←
          </button>
          <button type="button" aria-label="Walk right" className={pad} {...hold("right")}>
            →
          </button>
        </div>
        <button type="button" aria-label="Jump" className={pad} {...hold("jump")}>
          ↑
        </button>
      </div>
    </div>
  );
}
