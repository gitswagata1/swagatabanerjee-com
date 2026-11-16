"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { emit, on } from "@/lib/events";

// Everything playful loads after the hero is interactive, in its own chunks.
const AvatarGuide = dynamic(() => import("@/components/avatar/AvatarGuide"), { ssr: false });
const Cursor = dynamic(() => import("@/components/Cursor"), { ssr: false });
const GameMode = dynamic(() => import("@/components/game/GameMode"), { ssr: false });
const ChatPanel = dynamic(() => import("@/components/chat/ChatPanel"), { ssr: false });

export function Playful() {
  const [ready, setReady] = useState(false);
  const [game, setGame] = useState(false);
  const [chat, setChat] = useState<{ open: boolean; loaded: boolean; ask: { q: string; n: number } | null }>({
    open: false,
    loaded: false,
    ask: null,
  });

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 400));
    const delay = document.documentElement.dataset.loader ? 1200 : 0;
    const t = window.setTimeout(() => idle(() => setReady(true)), delay);
    const offs = [
      on("open-chat", () => setChat((c) => ({ ...c, open: true, loaded: true }))),
      on("ask-ai", (q, e) => {
        e.preventDefault(); // tells the hero input the chat took the question
        setChat((c) => ({ open: true, loaded: true, ask: { q, n: (c.ask?.n ?? 0) + 1 } }));
      }),
    ];
    // Easter eggs: type "play", or enter the Konami code.
    const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let typed: string[] = [];
    const egg = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
      typed = [...typed, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-konami.length);
      if (typed.slice(-4).join("") === "play" || typed.join() === konami.join()) {
        typed = [];
        setGame(true);
      }
    };
    window.addEventListener("keydown", egg);
    offs.push(on("game", (open) => setGame(open)));

    // Mini Swagata celebrates résumé downloads (links marked data-celebrate).
    const celebrate = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.("[data-celebrate]");
      if (!link) return;
      emit("celebrate");
      track("resume_download", { file: link.getAttribute("href") ?? "" });
    };
    document.addEventListener("click", celebrate);
    console.log("%cHi 👋 you inspect pages too? Let's talk.", "font: 600 14px monospace; color: #6d4aff");
    return () => {
      document.removeEventListener("click", celebrate);
      window.removeEventListener("keydown", egg);
      window.clearTimeout(t);
      offs.forEach((off) => off());
    };
  }, []);

  useEffect(() => {
    if (chat.open) track("chat_open");
  }, [chat.open]);
  useEffect(() => {
    if (game) track("game_start");
  }, [game]);

  return (
    <>
      {ready && <Cursor />}
      {ready && !game && <AvatarGuide />}
      {game && <GameMode onExit={() => setGame(false)} />}
      {chat.loaded && (
        <ChatPanel open={chat.open} ask={chat.ask} onClose={() => setChat((c) => ({ ...c, open: false }))} />
      )}
    </>
  );
}
