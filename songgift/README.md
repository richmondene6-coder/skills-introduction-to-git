# SongGift

A shop that sells personalized Christmas songs as gifts. The buyer answers a short quiz and reads a free lyric preview written by Claude. After paying with Stripe, they get a fully produced song made with ElevenLabs Music, plus a printable gift card with a QR code.

## How it works

1. **Quiz** (`/create`): names, memories, inside jokes, music style, tone, email.
2. **Free preview** (`POST /api/orders`): Claude writes the lyrics. The first verse and chorus are shown, and the rest stay locked until payment. The preview is limited to 5 per IP address per hour.
3. **Checkout** (`POST /api/checkout`): Stripe Checkout. $29 for one song, or $49 for two versions in different styles.
4. **Fulfillment** (`POST /api/webhooks/stripe`): after payment, the song is made and stored, and the buyer gets an email with a link.
5. **Song page** (`/song/[id]`): player, download button, share link, and the printable gift card (`/song/[id]/card`).

Also included:
- **Admin dashboard** (`/admin`, set `ADMIN_PASSWORD`): revenue, progress toward the goal, preview-to-paid conversion, sales by source, recent orders, and a retry button for failed songs.
- **Ad tracking**: Meta and TikTok pixels (Lead, InitiateCheckout, Purchase), plus first-touch attribution from `?utm_source=…&utm_campaign=…` or `?ref=creatorname` links, saved on each order.
- **Legal pages**: `/terms`, `/privacy`, `/refunds`, which Stripe needs to activate your account. Have them reviewed for your country.
- **Social previews**: share images for the home page and each song link.
- **Sample songs**: add real examples to `src/lib/samples.ts` and they appear on the home page.

See **[LAUNCH.md](LAUNCH.md)** for the week-by-week launch plan.

Code layout: `src/lib/` holds the logic (`lyrics.ts` for Claude, `music.ts` for ElevenLabs, `fulfill.ts`, `store.ts`, `stripe.ts`, `email.ts`), and `src/app/` holds pages and API routes.

## Run locally

```bash
npm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY at minimum
npm run dev
```

You only need `ANTHROPIC_API_KEY` to try the whole flow locally. Without the other keys, dev mode:
- skips payment,
- plays a placeholder jingle instead of a real song,
- saves orders and audio to `.data/`.

## Deploy (Vercel)

1. Import the repo into Vercel and set the **Root Directory** to `songgift`.
2. Add Upstash Redis and Vercel Blob from the Vercel Marketplace. They set their own environment variables.
3. Set `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `EMAIL_FROM` and `NEXT_PUBLIC_SITE_URL`.
4. In Stripe, add a webhook pointing to `https://<your-domain>/api/webhooks/stripe` for the `checkout.session.completed` event, then set `STRIPE_WEBHOOK_SECRET`.
5. Songs are made in the background after the webhook responds (`after()`, `maxDuration = 300`). This needs a Vercel plan that allows 300-second functions.

## Before launch

- Confirm your ElevenLabs plan allows commercial use of the music it generates.
- Make 10–20 test songs, then adjust the lyric prompt in `src/lib/lyrics.ts` and the style prompts in `src/lib/types.ts`.
- The FAQ on the home page promises a rewrite or refund within 7 days. Change it if that isn't your policy.
- If a song fails to generate, the order shows as `failed` in `/admin`, with a Retry button.
