import { track as vercelTrack } from "@vercel/analytics";

/** Cookie-free Vercel Analytics events. Never throws; a blocked script must not break the page. */
export type AnalyticsEvent = "resume_download" | "email_copy" | "chat_open" | "game_start";

export function track(event: AnalyticsEvent, data?: Record<string, string>) {
  try {
    vercelTrack(event, data);
  } catch {}
}
