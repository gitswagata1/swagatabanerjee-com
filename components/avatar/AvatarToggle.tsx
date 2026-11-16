"use client";

import { useEffect, useState } from "react";
import { emit, on, store } from "@/lib/events";

/** Nav control: turn Mini Swagata on or off. The choice is remembered. */
export function AvatarToggle() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(store.get("guide-hidden") !== "1");
    return on("guide-visibility", setVisible);
  }, []);

  const toggle = () => {
    const next = !visible;
    if (next) store.remove("guide-hidden");
    else store.set("guide-hidden", "1");
    emit("guide-visibility", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={visible}
      aria-label="Mini Swagata guide"
      title={visible ? "Hide guide" : "Show guide"}
      className="grid size-11 place-items-center rounded-full text-ink transition-colors duration-150 hover:bg-paper-2"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <circle cx="9" cy="10.5" r="0.6" fill="currentColor" />
        <circle cx="15" cy="10.5" r="0.6" fill="currentColor" />
        <path d="M8.5 14.5c2 2 5 2 7 0" />
        {!visible && <path d="M4 4l16 16" />}
      </svg>
    </button>
  );
}
