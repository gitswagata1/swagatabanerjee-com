import type { AvatarState } from "@/components/avatar/MiniSwagata";

/** Tiny window-event bus so lazy-loaded playful modules stay decoupled from the page. */
type Events = {
  "ask-ai": string; // a question typed in the hero input
  "open-chat": undefined;
  "avatar-state": AvatarState; // chat drives the avatar's face
  celebrate: undefined; // email copied, résumé downloaded
  "guide-visibility": boolean;
  game: boolean; // open or close Game Mode
};

export function emit<K extends keyof Events>(name: K, detail?: Events[K]) {
  return window.dispatchEvent(new CustomEvent(name, { detail, cancelable: true }));
}

export function on<K extends keyof Events>(name: K, handler: (detail: Events[K], e: Event) => void) {
  const listener = (e: Event) => handler((e as CustomEvent).detail, e);
  window.addEventListener(name, listener);
  return () => window.removeEventListener(name, listener);
}

/** localStorage/sessionStorage can throw (private mode, blocked storage) — never let that break the page. */
export const store = {
  get(key: string, session = false) {
    try {
      return (session ? sessionStorage : localStorage).getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string, session = false) {
    try {
      (session ? sessionStorage : localStorage).setItem(key, value);
    } catch {}
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};
