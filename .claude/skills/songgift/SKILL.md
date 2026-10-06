---
name: songgift
description: Run, test, screenshot, package or change the SongGift app in songgift/ (Next.js 16, Claude lyrics, ElevenLabs music, Paystack USD payments). Use when asked to start or view the app, test payments, record a walkthrough, send the owner a zip, or before committing changes under songgift/.
---

# Working on SongGift

SongGift sells personalized AI Christmas songs as gifts. The app lives in `songgift/`. The repo root is an unrelated GitHub Skills "Introduction to Git" exercise: don't touch `.github/` or `src/`.

Project status, decisions and next steps are in the root `CLAUDE.md`. Next.js 16 rules are in `songgift/AGENTS.md`: read the relevant guide in `songgift/node_modules/next/dist/docs/` before writing Next.js code.

## Run the app (demo mode)

```bash
cd songgift && npm install && npm run dev   # http://localhost:3000
```

With no keys in `songgift/.env.local`, dev mode writes demo lyrics marked "(demo)", skips payment, plays a 3-second test jingle, and stores orders and audio in `songgift/.data/`. Production never uses these fallbacks.

## Checks before every commit

```bash
cd songgift && npx next typegen && npx tsc --noEmit && npm run lint && npm run build
bash .claude/skills/songgift/scripts/test-payments.sh    # if payments, orders or fulfillment changed
```

`npx next typegen` must run before `tsc`, or the `PageProps<"/song/[id]">` route types fail.

## Scripts (in `.claude/skills/songgift/scripts/`)

| Script | What it does |
|---|---|
| `test-payments.sh` | Starts `mock-paystack.mjs` (a fake Paystack API) and the app with safe test settings, runs `payments-e2e.mjs` (36 checks: success, abandoned, underpaid, wrong currency, forged transactions, bad webhook signatures, promo codes, simultaneous callback + webhook), checks each song was generated exactly once, then stops everything and restores `.data/`. |
| `walkthrough.sh [out-dir]` | Starts the app in demo mode, clicks through it like a customer (`walkthrough.mjs`), and saves 9 screenshots (desktop and phone) plus `SongGift-walkthrough.mp4`. Send results to the owner with `SendUserFile` (`display: "render"`). |
| `package-zip.sh [out-dir]` | Builds `SongGift.zip` for the owner in the repo's layout: the committed `songgift/` app with a blank `.env.local` (from `.env.example`), `CLAUDE.md`, `.claude/skills/`, `START-HERE.md` (from `package/`) and `MARKET-RESEARCH.md`. Refuses to package anything that looks like a real key. Commit first: it packs `HEAD`. |

All scripts take `PORT` (default 3005) and the tests take `MOCK_PORT` (default 4010). They fail fast if a port is busy.

## Sandbox gotchas (learned the hard way)

- **Never `pkill -f` or `pgrep -f` a pattern that appears in your own command line.** It matches your own shell and kills it (exit code 144). To stop dev servers: `for p in $(ps -eo pid,cmd | awk '/next-server|next dev/ && !/awk/ {print $1}'); do kill $p; done`.
- **A dev server left running keeps the port.** A new background `next dev` then dies with `EADDRINUSE`, and tests silently hit the old server with old settings. `lsof -ti:PORT` doesn't show these processes here, so check with `curl` instead.
- `NEXT_PUBLIC_*` values (currency, prices, pixels) are compiled in. Restart the dev server, or redeploy, after changing them.
- Environment variables set on the command line override `.env.local`. The scripts blank Redis, Blob, ElevenLabs, Resend and Anthropic keys so tests never touch real services.
- Playwright: launch with `executablePath: "/opt/pw-browsers/chromium"`. Never run `playwright install`. `walkthrough.mjs` falls back to the global Playwright from `npm root -g`.
- `ffmpeg` is at `/usr/bin/ffmpeg` for webm-to-mp4 conversion.
- `paystack.com` and `elevenlabs.io` are blocked by the sandbox's network proxy. The API details below were verified from Paystack's npm packages (`@paystack/paystack-sdk`, `paystack-sdk`, `paystack-api`) and the `@elevenlabs/elevenlabs-js` types.

## Paystack facts the code relies on

- Base URL `https://api.paystack.co`, header `Authorization: Bearer <secret key>`.
- `POST /transaction/initialize` with `{ email, amount (minor units), currency, reference, callback_url, metadata }` returns `data.authorization_url`.
- `GET /transaction/verify/:reference` returns `data.status` (`"success"`), `amount`, `currency`, `metadata`. An unknown reference returns 400.
- References allow only letters, digits, `-`, `.` and `=` (no underscores): the app uses `sg-<orderId>-<random>`.
- Webhooks: `x-paystack-signature` is the hex HMAC-SHA512 of the raw body, keyed with the secret key. The event is `charge.success`.
- Anyone with the public key can create transactions with made-up metadata. So `settlePayment` only accepts references recorded in `order.checkouts` by our own checkout, at the recorded amount and currency.
- USD only works once Paystack enables it on the merchant account. Unverified: whether Paystack honors the `metadata.cancel_action` redirect (it's harmless if ignored).

## Secrets

- Keys belong only in `songgift/.env.local` (gitignored) or Vercel's environment variables. Never commit, log, package or paste them.
- If the owner pastes a key into chat, don't use it. Tell them to revoke it and add the new one in the cloud environment settings (environment menu → Edit) as `ANTHROPIC_API_KEY`, `PAYSTACK_SECRET_KEY` and so on.
