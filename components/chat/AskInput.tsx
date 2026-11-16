"use client";

import { useState } from "react";
import { profile } from "@/content/profile";

const { chat, contact } = profile;

/**
 * Hero entry point to "Ask Swagata's AI". It dispatches an `ask-ai` event that the chat
 * panel (next build step) listens for. Until that exists, it shows the documented fallback.
 */
export function AskInput() {
  const [note, setNote] = useState(false);

  return (
    <form
      className="w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
        if (!q) return;
        const handled = !window.dispatchEvent(new CustomEvent("ask-ai", { detail: q, cancelable: true }));
        setNote(!handled);
      }}
    >
      <label htmlFor="ask-ai" className="sr-only">
        {chat.label}
      </label>
      <div className="flex items-center gap-2 rounded-full border border-accent bg-paper py-1 pl-4 pr-1 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="var(--accent)" aria-hidden="true">
          <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
          <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
        </svg>
        <input
          id="ask-ai"
          name="q"
          type="text"
          maxLength={chat.maxChars}
          placeholder={chat.placeholder}
          autoComplete="off"
          className="h-10 min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-2 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Ask"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-150 hover:scale-105"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      <p role="status" className="mt-2 min-h-5 text-xs text-ink-2">
        {note && (
          <>
            {chat.fallback}{" "}
            <a className="text-accent underline" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </>
        )}
      </p>
    </form>
  );
}
