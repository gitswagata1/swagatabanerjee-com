import Anthropic from "@anthropic-ai/sdk";
import { profile } from "@/content/profile";
import { systemPrompt } from "@/lib/knowledge";
import { allow } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;
export const dynamic = "force-dynamic";

// Claude Haiku 5.5: the small, inexpensive model. Override with CHAT_MODEL if needed.
const MODEL = process.env.CHAT_MODEL || "claude-haiku-5-5";
const MAX_USER_CHARS = profile.chat.maxChars;
const MAX_ASSISTANT_CHARS = 4000;
const MAX_MESSAGES = 8;

const json = (status: number, error: string) =>
  Response.json({ error }, { status, headers: { "cache-control": "no-store" } });

/** Accepts only a short, well-formed user/assistant history ending in a user message. */
function parse(body: unknown): Anthropic.MessageParam[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) return null;
  const messages: Anthropic.MessageParam[] = [];
  for (const m of raw) {
    const role = (m as { role?: unknown })?.role;
    const content = (m as { content?: unknown })?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim();
    if (!text || text.length > (role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS)) return null;
    messages.push({ role, content: text });
  }
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return null;
  return messages;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!(await allow(ip))) return json(429, "rate_limited");

  let messages: Anthropic.MessageParam[] | null = null;
  try {
    messages = parse(await request.json());
  } catch {}
  if (!messages) return json(400, "invalid_request");

  // No conversation is stored: the request is forwarded, streamed back and forgotten.
  let iterator: AsyncIterator<Anthropic.MessageStreamEvent>;
  let first: string | null = null;
  let stream: ReturnType<Anthropic["messages"]["stream"]>;
  try {
    const client = new Anthropic(); // key comes from ANTHROPIC_API_KEY on the server, never the client
    stream = client.messages.stream(
      {
        model: MODEL,
        max_tokens: 1024, // answers are 2–4 sentences; this is a deliberate cost cap
        output_config: { effort: "low" },
        system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
        messages,
      },
      { signal: request.signal },
    );
    iterator = stream[Symbol.asyncIterator]();
    // Wait for the first text before committing to a 200, so failures become a clean error status.
    first = await nextText(iterator);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return json(429, "rate_limited");
    if (error instanceof Anthropic.APIError) console.error(`chat: API error ${error.status}`);
    else console.error("chat: unavailable");
    return json(503, "unavailable");
  }
  if (first === null) return json(503, "unavailable"); // refusal or empty reply → client shows the fallback

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encoder.encode(first));
      try {
        for (let text = await nextText(iterator); text !== null; text = await nextText(iterator)) {
          controller.enqueue(encoder.encode(text));
        }
      } catch {
        // mid-stream failure: end the reply where it is
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

/** Next chunk of answer text, or null when the message has ended. */
async function nextText(iterator: AsyncIterator<Anthropic.MessageStreamEvent>): Promise<string | null> {
  for (;;) {
    const { done, value } = await iterator.next();
    if (done) return null;
    if (value.type === "content_block_delta" && value.delta.type === "text_delta" && value.delta.text) {
      return value.delta.text;
    }
  }
}
