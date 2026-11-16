"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { profile, type SectionId } from "@/content/profile";
import { MiniSwagata, type AvatarState } from "@/components/avatar/MiniSwagata";
import { emit } from "@/lib/events";

const { chat, contact } = profile;

type Msg = { role: "user" | "assistant"; content: string; error?: "fallback" | "rate" };
type Status = "idle" | "waiting" | "streaming";

const HISTORY = 8; // messages sent back for context; nothing is stored anywhere

/** Renders plain text, turning [[section:id]] markers into smooth-scroll buttons. */
function Reply({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  const parts = text.split(/\[\[section:([a-z-]+)\]\]/g);
  const links: SectionId[] = [];
  const body = parts.map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    if (part in chat.sectionLabels && document.getElementById(part)) links.push(part as SectionId);
    return null;
  });
  return (
    <>
      <p className="whitespace-pre-wrap">{body}</p>
      {links.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => {
            const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
            document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
            onNavigate();
          }}
          className="mt-2 inline-flex h-9 items-center rounded-full border border-accent px-3 text-xs font-medium text-accent"
        >
          {chat.sectionLabels[id]} →
        </button>
      ))}
    </>
  );
}

export default function ChatPanel({
  open,
  ask,
  onClose,
}: {
  open: boolean;
  ask: { q: string; n: number } | null;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [draft, setDraft] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);
  const live = useRef({ messages, status });
  live.current = { messages, status };
  const busy = useRef(false); // synchronous guard: state updates land a render later
  const handledAsk = useRef(0);

  const face: AvatarState = status === "waiting" ? "think" : status === "streaming" ? "talk" : "idle";

  const send = useCallback(async (raw: string) => {
    const q = raw.trim().slice(0, chat.maxChars);
    if (!q || busy.current) return;
    busy.current = true;
    const history = [...live.current.messages.filter((m) => !m.error), { role: "user" as const, content: q }];
    setMessages((m) => [...m, { role: "user", content: q }, { role: "assistant", content: "" }]);
    setDraft("");
    setStatus("waiting");

    const patch = (fn: (last: Msg) => Msg) => setMessages((m) => [...m.slice(0, -1), fn(m[m.length - 1])]);
    try {
      abort.current = new AbortController();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-HISTORY).map(({ role, content }) => ({ role, content })) }),
        signal: abort.current.signal,
      });
      if (res.status === 429) return patch((l) => ({ ...l, error: "rate" }));
      if (!res.ok || !res.body) throw new Error(String(res.status));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setStatus("streaming");
        patch((l) => ({ ...l, content: text }));
      }
      if (!text.trim()) throw new Error("empty");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      patch((l) => (l.content ? l : { ...l, error: "fallback" }));
    } finally {
      busy.current = false;
      setStatus("idle");
    }
  }, []);

  // A question typed in the hero arrives here.
  useEffect(() => {
    if (!ask || handledAsk.current === ask.n) return;
    handledAsk.current = ask.n;
    void send(ask.q);
  }, [ask, send]);

  // The docked avatar mirrors the chat: think while waiting, talk while streaming.
  useEffect(() => {
    emit("avatar-state", face);
  }, [face]);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => () => abort.current?.abort(), []);

  if (!open) return null;

  return (
    <section
      role="dialog"
      aria-label={chat.label}
      className="chat-panel fixed inset-x-2 bottom-2 z-[45] flex max-h-[min(34rem,80dvh)] flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[6px_6px_0_var(--line)] sm:inset-x-auto sm:bottom-28 sm:right-5 sm:w-[23.5rem]"
    >
      <header className="flex items-center gap-3 border-b border-line px-4 py-2">
        <MiniSwagata state={face} decorative className="size-11 shrink-0" />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-medium">{chat.label}</h2>
          <p className="sheet-label !text-[11px]">
            {status === "waiting" ? "THINKING…" : status === "streaming" ? "ANSWERING…" : "ANSWERS FROM HER PROFILE ONLY"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="grid size-11 place-items-center rounded-full text-lg hover:bg-paper-2"
        >
          ×
        </button>
      </header>

      <div ref={scroller} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm leading-relaxed">
        <p className="text-ink-2">{chat.intro}</p>

        {messages.map((m, i) =>
          m.role === "user" ? (
            <p key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-ink px-3 py-2 text-paper">
              {m.content}
            </p>
          ) : (
            <div key={i} className="w-fit max-w-[90%] rounded-2xl rounded-bl-sm border border-line bg-paper-2 px-3 py-2">
              {m.error ? (
                <p>
                  {m.error === "rate" ? chat.rateLimited : chat.fallback}{" "}
                  <a className="text-accent underline" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                </p>
              ) : m.content ? (
                <Reply text={m.content} onNavigate={onClose} />
              ) : (
                <span className="font-mono text-ink-2" aria-label="Thinking">
                  · · ·
                </span>
              )}
            </div>
          ),
        )}

        {messages.length === 0 && (
          <ul className="flex flex-wrap gap-2 pt-1">
            {chat.starters.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => void send(s)}
                  className="min-h-9 rounded-full border border-line px-3 py-1.5 text-left text-xs hover:border-accent hover:text-accent"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        className="flex items-center gap-2 border-t border-line p-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send(draft);
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          Your question
        </label>
        <input
          id="chat-input"
          ref={input}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={chat.maxChars}
          placeholder={chat.placeholder}
          autoComplete="off"
          className="h-11 min-w-0 flex-1 rounded-full border border-line bg-transparent px-4 text-sm placeholder:text-ink-2 focus:border-accent focus:outline-none"
        />
        {draft.length > chat.maxChars - 100 && (
          <span className="font-mono text-[11px] text-ink-2" aria-hidden="true">
            {draft.length}/{chat.maxChars}
          </span>
        )}
        <button
          type="submit"
          disabled={status !== "idle" || !draft.trim()}
          aria-label="Send"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-on-accent disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
    </section>
  );
}
