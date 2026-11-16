# swagatabanerjee.com

Personal portfolio for Swagata Banerjee. Next.js (App Router), TypeScript, Tailwind CSS.

## Run it locally

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000.

To get real answers from "Ask Swagata's AI", copy `.env.example` to `.env.local`, add your `ANTHROPIC_API_KEY`, and restart the dev server. Without a key the chat shows its email fallback.

## Editing content

Everything on the site comes from one file: `content/profile.ts`. The sections, the 60-second summary, the AI assistant's knowledge and Mini Swagata's lines all read from it.

- Any string that starts with `[PLACEHOLDER` (or contains `[CONFIRM`) is shown on the site as a visible tag. Replace it with real text and the tag disappears.
- `talks`, `testimonials` and `writing` are empty lists. Testimonials and writing stay hidden until you add entries; never add invented ones.
- The phone number is deliberately not in this file. It belongs only in the résumé PDFs.

### Adding files

| What | Where | Then |
|---|---|---|
| Hero photos (2) | `public/photos/` | set `photos.heroInline[].src` to `/photos/your-file.jpg` |
| Gallery photos | `public/photos/` | add `{ src, alt, caption }` entries to `photos.gallery` |
| Google badges | `public/badges/` | add `{ src, name, date }` entries to `google.badges` |
| Résumé PDFs | `public/resume/swagata-banerjee-pm.pdf` and `public/resume/swagata-banerjee-engineering.pdf` | set `ready: true` on each entry in `resumes` |
| Avatar art | `public/avatar/` | replace `components/avatar/MiniSwagata.tsx` (keep the same `state` names) |

## Project structure

```
app/            page.tsx · work/[slug] · not-found · api/chat · opengraph-image · sitemap · robots
components/     sections/* · avatar/* · chat/* · game/* · demo/FdeDemo.tsx · ui/*
content/        profile.ts   (single source of truth)
lib/            github.ts · ratelimit.ts · knowledge.ts · analytics.ts · events.ts
public/         photos · badges · resume · avatar
```

Design tokens (palette, motion durations, easings) are at the top of `app/globals.css`.

## Deploying to swagatabanerjee.com

### 1. Put the code on GitHub

```bash
git init
```

```bash
git add -A
```

```bash
git commit -m "Initial site"
```

Create an empty repository on GitHub, then follow its "push an existing repository" instructions.

### 2. Create the Vercel project

1. Go to vercel.com, choose **Add New → Project**, and import the GitHub repository. The defaults (Next.js) are correct.
2. Before the first deploy, open **Environment Variables** and add:
   - `ANTHROPIC_API_KEY` — required for the chat.
   - `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` — recommended. Without them the "10 messages per 10 minutes" limit is only best-effort, because serverless instances don't share memory. Create a free Redis database at upstash.com and copy both values from its REST API tab.
3. Deploy. Check the `*.vercel.app` preview URL works before touching DNS.
4. In the project, open **Analytics** and enable Web Analytics (cookie-free). The site already sends four custom events: `resume_download`, `email_copy`, `chat_open`, `game_start`.

### 3. Add the domains in Vercel

In **Project → Settings → Domains**, add these and choose the option shown:

| Domain | Setting |
|---|---|
| `swagatabanerjee.com` | Primary (production) |
| `www.swagatabanerjee.com` | Redirect to `swagatabanerjee.com` (308/301 permanent) |
| `swagatabanerjee.in` | Redirect to `swagatabanerjee.com` |
| `www.swagatabanerjee.in` | Redirect to `swagatabanerjee.com` |

Vercel then shows the exact DNS records each domain needs. **Use the values Vercel shows**; the ones below are the usual ones and may differ for your project.

### 4. Set the DNS records

For each domain (`.com` and `.in`), at whichever registrar holds it:

| Type | Name / Host | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

**Cloudflare**

1. Open the domain → **DNS → Records**.
2. Delete any existing `A`, `AAAA` or `CNAME` records for `@` and `www`.
3. Add the two records above.
4. Set **Proxy status to "DNS only"** (grey cloud) on both. With the orange cloud on, Vercel cannot issue its certificate cleanly.
5. Under **SSL/TLS**, set the mode to **Full (strict)**.

**Namecheap**

1. Domain List → **Manage** → **Advanced DNS**.
2. Remove the default parking records (the `CNAME` for `www` to `parkingpage.namecheap.com` and the URL Redirect record for `@`).
3. Add an **A Record**: Host `@`, Value `76.76.21.21`, TTL Automatic.
4. Add a **CNAME Record**: Host `www`, Value `cname.vercel-dns.com`, TTL Automatic.

DNS changes usually apply within minutes, occasionally up to a day.

### 5. Verify

- Vercel's Domains page shows **Valid Configuration** for all four names. HTTPS certificates are issued automatically and HTTP is redirected to HTTPS.
- `https://www.swagatabanerjee.com` and `https://swagatabanerjee.in` both land on `https://swagatabanerjee.com`. (`next.config.ts` also contains these redirects as a safety net.)
- Paste the URL into LinkedIn's Post Inspector (linkedin.com/post-inspector) and send it to yourself on WhatsApp to confirm the preview card. The card is generated by `app/opengraph-image.tsx`.
- Ask the live chat a question, then send 11 quickly to see the rate limit message.

## Checks

```bash
npm run build
```

```bash
npm run typecheck
```

Lighthouse (mobile, production build, measured locally): performance 90–93 on the home page and 98 on a case study; accessibility, best practices and SEO 100.
