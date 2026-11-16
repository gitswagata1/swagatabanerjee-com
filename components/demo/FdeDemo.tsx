"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Watch an FDE work" — a toy, self-contained simulation.
 * Every value below is made-up sample data. Nothing here comes from a real company.
 */
const MESSY = [
  { id: 1, text: "BRG 6204-ZZ", qty: "40 nos", vendor: "Vendor A", rate: "₹56", group: "bearing" },
  { id: 2, text: "ms pipe 25mm", qty: "120 m", vendor: "Vendor C", rate: "₹210", group: "pipe" },
  { id: 3, text: "Bearing 6204 ZZ", qty: "5 dozen", vendor: "Vendor B", rate: "₹58", group: "bearing" },
  { id: 4, text: "Hex Bolt M8x40", qty: "2 box (200)", vendor: "Vendor B", rate: "₹4", group: "bolt" },
  { id: 5, text: "Mild Steel Pipe 25 MM", qty: "80 mtr", vendor: "Vendor C", rate: "₹212", group: "pipe" },
  { id: 6, text: "6204zz bearing", qty: "25 pcs", vendor: "Vendor A", rate: "₹56", group: "bearing" },
  { id: 7, text: "M8 X 40 HEX BOLT", qty: "150 pcs", vendor: "Vendor A", rate: "₹4.2", group: "bolt" },
  { id: 8, text: "Pipe MS 25mm", qty: "60 m", vendor: "Vendor C", rate: "₹210", group: "pipe" },
] as const;

const GROUPS = [
  { key: "bearing", name: "Ball bearing 6204-ZZ", total: "125 pcs", vendors: "Vendor A, Vendor B" },
  { key: "pipe", name: "MS pipe, 25 mm", total: "260 m", vendors: "Vendor C" },
  { key: "bolt", name: "Hex bolt M8 × 40", total: "350 pcs", vendors: "Vendor A, Vendor B" },
] as const;

const STEPS = [
  { label: "Extraction", detail: "Pull material, quantity, unit, vendor and rate out of each messy line." },
  { label: "Normalisation", detail: "Merge duplicate names and convert units: 5 dozen → 60 pcs, mtr → m." },
  { label: "Retrieval", detail: "Look up each material's vendors and last quarter's rates." },
  { label: "Recommendation", detail: "Compare vendors and flag what the purchase team should act on." },
];

const STEP_MS = 1100;

export function FdeDemo() {
  // 0 = messy pile; 1–4 = pipeline steps; 4 is the finished state.
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);
  const result = useRef<HTMLDivElement>(null);

  const clear = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const run = () => {
    clear();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setStep(4);
    setStep(1);
    for (let s = 2; s <= 4; s++) timers.current.push(window.setTimeout(() => setStep(s), (s - 1) * STEP_MS));
  };
  const reset = () => {
    clear();
    setStep(0);
  };

  useEffect(() => {
    if (step === 4) result.current?.focus({ preventScroll: true });
  }, [step]);

  const sorted = step >= 2;
  const running = step > 0 && step < 4;

  return (
    <figure className="border border-line bg-paper">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
        <span className="font-display text-xl font-semibold">Watch an FDE work</span>
        <span className="border border-accent px-2 py-0.5 font-mono text-[11px] text-accent">
          ILLUSTRATIVE DEMO WITH SAMPLE DATA
        </span>
      </figcaption>

      <div className="grid gap-6 p-4 lg:grid-cols-2">
        <div>
          <p className="sheet-label">{sorted ? "NORMALISED GROUPS" : "PROCUREMENT LINE ITEMS, AS RECEIVED"}</p>

          {!sorted ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {MESSY.map((m, i) => (
                <li
                  key={m.id}
                  className={`border border-line bg-paper-2 px-2 py-1.5 font-mono text-xs transition-colors duration-300 ${step === 1 ? "border-accent" : ""}`}
                  style={{ transform: `rotate(${((i * 37) % 7) - 3}deg)`, transitionDelay: `${i * 50}ms` }}
                >
                  {m.text} · {m.qty} · {m.vendor} · {m.rate}
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-3 space-y-3">
              {GROUPS.map((g, i) => (
                <li key={g.key} className="rise border border-line p-3" style={{ ["--i" as string]: i * 2 }}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium">{g.name}</span>
                    <span className="font-mono text-xs">{g.total}</span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-ink-2">
                    {MESSY.filter((m) => m.group === g.key).length} lines merged · {g.vendors}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {step === 0 ? (
              <button type="button" onClick={run} className="h-11 rounded-full bg-accent px-5 text-sm font-medium text-on-accent">
                Let AI sort it
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                disabled={running}
                className="h-11 rounded-full border border-ink px-5 text-sm font-medium disabled:opacity-40"
              >
                Replay
              </button>
            )}
          </div>
        </div>

        <div>
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((s, i) => {
              const n = i + 1;
              return (
                <li
                  key={s.label}
                  aria-current={step === n && running ? "step" : undefined}
                  className={`border px-2 py-1.5 font-mono text-[11px] transition-colors duration-300 ${
                    step >= n ? "border-accent text-accent" : "border-line text-ink-2"
                  }`}
                >
                  {String(n).padStart(2, "0")} {s.label}
                </li>
              );
            })}
          </ol>

          <div ref={result} tabIndex={-1} aria-live="polite" className="mt-3 min-h-56 text-sm focus:outline-none">
            {step === 0 && (
              <p className="text-ink-2">
                Duplicate material names, inconsistent units, scattered vendors. This is what a purchase team starts
                with.
              </p>
            )}
            {step > 0 && <p className="text-ink-2">{STEPS[Math.min(step, 4) - 1].detail}</p>}

            {step >= 3 && (
              <table className="rise mt-4 w-full border-collapse text-left font-mono text-xs">
                <caption className="sheet-label pb-2 text-left">VENDOR COMPARISON · BALL BEARING 6204-ZZ</caption>
                <thead>
                  <tr className="border-b border-line text-ink-2">
                    <th className="py-1 font-normal">Vendor</th>
                    <th className="py-1 font-normal">Rate now</th>
                    <th className="py-1 font-normal">Last quarter</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line">
                    <td className="py-1.5">Vendor A</td>
                    <td>₹56</td>
                    <td>₹50</td>
                  </tr>
                  <tr>
                    <td className="py-1.5">Vendor B</td>
                    <td>₹58</td>
                    <td>₹57</td>
                  </tr>
                </tbody>
              </table>
            )}

            {step >= 4 && (
              <>
                <ul className="mt-4 space-y-2">
                  <li className="rise border-l-2 border-accent bg-paper-2 px-3 py-2" style={{ ["--i" as string]: 1 }}>
                    <span className="font-medium">Price up 12% vs last quarter</span>
                    <span className="block text-xs text-ink-2">Ball bearing 6204-ZZ, Vendor A: ₹50 → ₹56.</span>
                  </li>
                  <li className="rise border-l-2 border-accent bg-paper-2 px-3 py-2" style={{ ["--i" as string]: 3 }}>
                    <span className="font-medium">Single-vendor risk</span>
                    <span className="block text-xs text-ink-2">MS pipe, 25 mm is bought only from Vendor C.</span>
                  </li>
                </ul>
                <p className="rise mt-4 font-display text-lg font-semibold" style={{ ["--i" as string]: 5 }}>
                  That&apos;s a toy version. The real one runs across 15 plants.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </figure>
  );
}
