"use client";

import { useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";
const order: Theme[] = ["system", "light", "dark"];

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {}
  }, []);

  const cycle = () => {
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    const root = document.documentElement;
    try {
      if (next === "system") {
        delete root.dataset.theme;
        localStorage.removeItem("theme");
      } else {
        root.dataset.theme = next;
        localStorage.setItem("theme", next);
      }
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${theme}. Change theme`}
      title={`Theme: ${theme}`}
      className="grid size-11 place-items-center rounded-full text-ink transition-colors duration-150 hover:bg-paper-2"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        {theme === "dark" ? (
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        ) : theme === "light" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 4v16a8 8 0 0 0 0-16z" fill="currentColor" />
          </>
        )}
      </svg>
    </button>
  );
}
