# SongGift

A shop that sells personalized Christmas songs as gifts. The buyer answers a short quiz and reads a free lyric preview written by Claude. After paying in US dollars through Paystack, they get a fully produced song made with ElevenLabs Music, plus a printable gift card with a QR code.

## How it works

1. **Quiz** (`/create`): names, memories, inside jokes, music style, tone, email.
2. **Free preview** (`POST /api/orders`): Claude writes the lyrics. The first verse and chorus are shown, and the rest stay locked until payment. The preview is limited to 5 per IP address per hour.
3. **Checkout** (`POST /api/checkout`): Paystack checkout. $29 for one song, or $49 for two versions in different styles. Promo codes are supported.
4. **Payment confirmed**: when the buyer returns from Paystack (`/api/paystack/callback`), and again through Paystack's webhook (`/api/webhooks/paystack`) in case they close the tab. Each payment is checked with Paystack's API and must match the amount and currency the site asked for. The song is made only once, even when both arrive together.
5. **Song page** (`/song/[id]`): player, download button, share link, and the printable gift card (`/song/[id]/card`). The buyer also gets an email with the link.

Also included:
- **Admin dashboard** (`/admin`, set `ADMIN_PASSWORD`): revenue, progress toward the goal, preview-to-paid conversion, sales by source, recent orders, and a Retry button for failed or stuck songs.
- **Ad tracking**: Meta and TikTok pixels (Lead, InitiateCheckout, Purchase), plus first-touch attribution from `?utm_source=…&utm_campaign=…` or `?ref=creatorname` links, saved on each order.
- **Legal pages**: `/terms`, `/privacy`, `/refunds`. Have them reviewed for your country.
- **Social previews**: share images for the home page and each song link.
- **Sample songs**: add real examples to `src/lib/samples.ts` and they appear on the home page.

See **[LAUNCH.md](LAUNCH.md)** for the week-by-week launch plan.

Code layout: `src/lib/` holds the logic (`lyrics.ts` for Claude, `music.ts` for ElevenLabs, `paystack.ts` and `payments.ts` for payments, `pricing.ts`, `promo.ts`, `fulfill.ts`, `store.ts`, `email.ts`), and `src/app/` holds pages and API routes.

## Payments: Paystack in US dollars

- The site charges in **USD** by default ($29 and $49). **Paystack must enable USD payments on your account first.** Ask Paystack support; they'll tell you what they need, which usually includes a USD bank account for payouts. Until it's enabled, checkout fails, and while testing locally the error shows Paystack's reason (for example "Currency not supported by merchant").
- Make sure your account accepts **international cards**, so buyers in the US, UK and elsewhere can pay.
- Use your **test** secret key (`sk_test_…`) and Paystack's test cards first, then switch to the live key (`sk_live_…`).
- To change prices, set `NEXT_PUBLIC_PRICE_STANDARD` and `NEXT_PUBLIC_PRICE_DELUXE` (whole dollars), then redeploy (prices are built into the pages). If Paystack can't enable USD for you, the site can also charge in NGN, GHS, ZAR or KES: set `NEXT_PUBLIC_CURRENCY` and both prices.
- **Promo codes**: set `PROMO_CODES`, e.g. `FAMILY:100:30,MERRY20:20` (code : percent off : optional max uses). A 100%-off code gives a free song without going through Paystack.

## Run locally

```bash
npm install
cp .env.example .env.local   # only if you don't have a .env.local yet; add ANTHROPIC_API_KEY at minimum
npm run dev
```

You only need `ANTHROPIC_API_KEY` to try the whole flow locally. Without the other keys, dev mode:
- skips payment,
- plays a placeholder jingle instead of a real song,
- saves orders and audio to `.data/`.

## Deploy (Vercel)

1. Import the repo into Vercel and set the **Root Directory** to `songgift`.
2. Add Upstash Redis and Vercel Blob from the Vercel Marketplace. They set their own environment variables.
3. Set `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`, `PAYSTACK_SECRET_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SUPPORT_EMAIL` and `NEXT_PUBLIC_SITE_URL` (your real domain, e.g. `https://songgift.co`).
4. In the Paystack dashboard, go to **Settings → API Keys & Webhooks** and set the webhook URL to `https://<your-domain>/api/webhooks/paystack`. You don't need to set a callback URL: the site sends its own with each payment.
5. Songs are made in the background after the payment is confirmed (`after()`, `maxDuration = 300`). This needs a Vercel plan that allows 300-second functions.

## Before launch

- Get USD enabled on Paystack, then make one real live purchase and refund it from the Paystack dashboard.
- Confirm your ElevenLabs plan allows commercial use of the music it generates.
- Make 10–20 test songs, then adjust the lyric prompt in `src/lib/lyrics.ts` and the style prompts in `src/lib/types.ts`.
- The FAQ on the home page promises a rewrite or refund within 7 days. Change it if that isn't your policy.
- If a song fails or gets stuck, it shows in `/admin` with a Retry button.
