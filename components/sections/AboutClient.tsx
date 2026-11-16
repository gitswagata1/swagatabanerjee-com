"use client";

import { useRef, useState } from "react";
import { profile } from "@/content/profile";
import { track } from "@/lib/analytics";
import { emit } from "@/lib/events";

/** Micro-toy: drag the letters of the name around — they spring back. */
export function LetterToy() {
  const letters = profile.identity.shortName.toUpperCase().split("");
  return (
    <div>
      <p aria-hidden="true" className="flex select-none font-display text-[clamp(3rem,12vw,8rem)] font-semibold leading-none">
        {letters.map((ch, i) => (
          <Letter key={i} ch={ch} />
        ))}
      </p>
      <p className="sr-only">{profile.identity.shortName}</p>
      <p className="mt-2 font-mono text-xs text-ink-2">↑ Drag a letter. It comes back.</p>
    </div>
  );
}

function Letter({ ch }: { ch: string }) {
  const [pos, setPos] = useState({ x: 0, y: 0, held: false });
  const origin = useRef({ x: 0, y: 0 });

  return (
    <span
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        origin.current = { x: e.clientX, y: e.clientY };
        setPos({ x: 0, y: 0, held: true });
      }}
      onPointerMove={(e) => {
        if (pos.held) setPos({ x: e.clientX - origin.current.x, y: e.clientY - origin.current.y, held: true });
      }}
      onPointerUp={() => setPos({ x: 0, y: 0, held: false })}
      onPointerCancel={() => setPos({ x: 0, y: 0, held: false })}
      className={`inline-block cursor-grab touch-none hover:text-accent ${pos.held ? "cursor-grabbing text-accent" : "transition-transform duration-[600ms] ease-spring"}`}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.x / 12}deg)` }}
    >
      {ch}
    </span>
  );
}

/** Email with copy-to-clipboard and a small celebration. */
export function CopyEmail() {
  const { email } = profile.contact;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return; // clipboard blocked: the mailto link beside this still works
    }
    setCopied(true);
    emit("celebrate");
    track("email_copy");
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={`mailto:${email}`}
        className="break-all font-display text-2xl font-semibold underline decoration-accent decoration-2 underline-offset-8 sm:text-4xl"
      >
        {email}
      </a>
      <span className="relative">
        <button
          type="button"
          onClick={copy}
          className="h-11 rounded-full border border-ink px-4 text-sm font-medium hover:bg-ink hover:text-paper"
        >
          {copied ? "Copied" : "Copy email"}
        </button>
        {copied && (
          <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="confetti" style={{ ["--a" as string]: `${i * 36}deg` }} />
            ))}
          </span>
        )}
      </span>
      <span role="status" className="sr-only">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </div>
  );
}
