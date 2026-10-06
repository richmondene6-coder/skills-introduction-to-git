# SongGift

## What this repo is

- **`songgift/` is the real project**: SongGift, a web shop selling personalized AI Christmas songs as gifts. The owner's goal is **$200,000 in revenue by December 15, 2026**.
- The repo root (`.github/`, `src/`, `README.md`) is an unrelated GitHub Skills "Introduction to Git" exercise. Leave it alone.
- All work is on branch **`claude/app-ideas-revenue-goal-bcapir`**. No pull request yet; the owner hasn't asked for one.
- How to run, test, record walkthroughs and package the zip: **`.claude/skills/songgift/SKILL.md`**.

## Working with the owner

- Non-technical solo founder. Use plain language and short numbered steps, and say clearly what they must do themselves (accounts, keys, payments setup).
- They view progress through files sent with `SendUserFile`: screenshots, the walkthrough video, `SongGift.zip`. They can't open this sandbox's localhost.
- They asked for **Paystack** payments in **USD**.
- **Keys never go in chat, code, commits or the zip.** On Oct 6 they pasted a credential (not an API key) into chat twice. It was not used, and they were told to revoke it. If keys are needed, ask them to add them in the cloud environment settings.

## Stack and key decisions

- Next.js 16 App Router, TypeScript, Tailwind v4. `songgift/AGENTS.md` says to read `node_modules/next/dist/docs/` before writing Next.js code (async `params`, `after()`, `PageProps`).
- **Lyrics:** Claude `claude-opus-5-5` via `@anthropic-ai/sdk` `beta.messages.parse` with a zod schema, effort `medium`, `fallbacks: "default"` (beta `server-side-fallback-2026-07-01`). Prompt in `src/lib/lyrics.ts`. Free preview shows the first verse and chorus; the rest unlocks after payment.
- **Music:** ElevenLabs `music_v2_5` composition plan, one chunk per lyric section (`src/lib/music.ts`).
- **Payments:** Paystack in USD, $29 standard and $49 deluxe (two versions). Checkout records each reference in `order.checkouts`. The callback and the signed webhook both call `settlePayment`, and a one-time claim ensures the song is generated once. Currency and prices are configurable (`NEXT_PUBLIC_CURRENCY`, `NEXT_PUBLIC_PRICE_*`). Promo codes come from the `PROMO_CODES` env. Stripe was removed on Oct 6.
- **Storage:** Upstash Redis (orders, counters, locks) and Vercel Blob (audio). Locally both fall back to `songgift/.data/`.
- **Other:** Resend for email, `/admin` dashboard (`ADMIN_PASSWORD`), Meta and TikTok pixels with UTM/`?ref=` attribution, legal pages, share images.
- **Demo mode** (dev only, no keys): demo lyrics, payment skipped, test jingle.
- **Hosting plan:** Vercel with root directory `songgift`. Generation routes use `maxDuration = 300`.

Owner-facing docs in `songgift/`: `README.md` (how it works, deploy), `LAUNCH.md` (week-by-week plan to Dec 15), `MARKET-RESEARCH.md`, and `.env.example` (friendly settings template; the zip ships it as `.env.local`).

## Status as of October 6, 2026

**Done:** the app is built end to end with Paystack USD, admin dashboard, tracking, legal pages, promo codes and demo mode. The 36-check payment test suite passes. The owner has the walkthrough video, screenshots and `SongGift.zip`.

**Waiting on the owner:**
1. Revoke the credential pasted in chat. Create a real Anthropic API key (starts with `sk-ant-api03-`).
2. Paystack: business verification, ask Paystack to **enable USD**, confirm international cards.
3. An ElevenLabs plan that allows commercial use of generated music.
4. A domain, a Vercel account and a Resend account.
5. Add keys to the cloud environment settings so Claude can test real services.

**Next session (owner said "continue in the evening"):**
1. Deploy to Vercel with the owner, step by step. They need a Vercel account first.
2. With `ANTHROPIC_API_KEY`: generate 10–20 real lyric sets and tune the prompt in `src/lib/lyrics.ts`.
3. With `ELEVENLABS_API_KEY`: make real songs. Check quality, cost per song, and that a deluxe order (two songs in parallel) finishes well under 300 seconds.
4. Paystack test-mode purchase, then one live $29 purchase and refund it.
5. Then follow `LAUNCH.md` week 2: soft launch, reaction videos, real samples in `src/lib/samples.ts`.

**Known gaps and ideas:**
- The Purchase pixel only fires if the buyer revisits their song page. Consider the server-side Meta Conversions API and TikTok Events API.
- No lyric video yet. The plan calls it the biggest marketing lever.
- Legal pages are generic templates. The FAQ promises a 7-day rewrite or refund; confirm that with the owner.
- Each free preview costs one Claude call (rate limited to 5 per hour per IP). Watch the cost once ads run.
- Paystack's `metadata.cancel_action` redirect is unverified.

## Conventions

- Match the existing code: small modules in `songgift/src/lib/`, comments that explain why.
- Run the checks in the skill before committing. End commit messages with the attribution lines from the session's system reminder.
- Update the status section above when something important changes.
