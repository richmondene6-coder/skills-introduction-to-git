# SongGift launch plan

**Goal:** $200,000 in revenue by December 15. That's about **5,000 orders at an average of $40**, and most of it will come between November 20 and December 15.

**Rule for every week:** check `/admin` daily. Spend more on the sources that bring sales, and cut the ones that don't.

---

## Week 1 · Oct 6–12 · Get set up and live

Accounts (start Paystack first, because business verification and enabling USD can take several days):

- [ ] **Paystack**: sign up and submit your business details for verification. Paystack checks that the site has Terms, Privacy and Refund pages; those are already built.
- [ ] **Paystack USD**: ask Paystack support to **enable USD payments** on your account. They'll tell you what's needed (usually a USD bank account for payouts). Until this is done, dollar checkouts are refused.
- [ ] **Paystack international cards**: confirm your account accepts cards from abroad (US, UK, Canada and so on).
- [ ] **Anthropic**: create an API key (starts with `sk-ant-api03-`). Add billing.
- [ ] **ElevenLabs**: pick a plan that **allows commercial use** of generated music. Check the cost per song so you know your margin.
- [ ] **Domain**: buy one (e.g. `songgift.co`). Set up email at it for support.
- [ ] **Resend**: verify the domain so "your song is ready" emails don't land in spam.
- [ ] **Vercel**: import the repo, set the root directory to `songgift`, and add Upstash Redis and Vercel Blob from the Marketplace.
- [ ] Add every environment variable from `.env.example`, including `PAYSTACK_SECRET_KEY`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SUPPORT_EMAIL` and `NEXT_PUBLIC_SITE_URL`.
- [ ] Paystack webhook: **Settings → API Keys & Webhooks** → webhook URL `https://<domain>/api/webhooks/paystack`.

Quality:

- [ ] Make **15–20 test songs** in different styles and tones. Fix anything weak in the prompts (`src/lib/lyrics.ts`, `src/lib/types.ts`).
- [ ] Test the whole purchase with your Paystack **test** key and Paystack's test cards.
- [ ] Switch to the **live** key, make one **real purchase** in USD, check the email arrives and the gift card QR works on a phone, then refund yourself from the Paystack dashboard.

## Week 2 · Oct 13–19 · Soft launch to people you know

- [ ] Give 20–30 songs to friends and family for free: add a 100%-off code with a usage limit, e.g. `PROMO_CODES=FAMILY:100:30`.
- [ ] **Film their reactions** (with permission). These videos are your main marketing for the rest of the season.
- [ ] Add your 3 best songs to `src/lib/samples.ts` (files go in `public/samples/`).
- [ ] Collect 5–10 short testimonials.
- [ ] Open TikTok and Instagram accounts. Start posting **one reaction video every day**.
- [ ] Create a Meta pixel and a TikTok pixel, then add their IDs (`NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`).

**Checkpoint:** do at least 15% of people who see a preview buy? If not, fix the lyrics or the preview page before spending money on ads.

## Weeks 3–4 · Oct 20–Nov 2 · First 100 paid customers

- [ ] Recruit **10 UGC creators** ($50–150 per video, or 20% commission). Give each a tracking link like `https://<domain>/?ref=jane`. The dashboard shows sales per link.
- [ ] Post in gift ideas groups, parent groups and wedding/couples communities, following their rules.
- [ ] Test small ads: $20–30/day on Meta and TikTok, 3–5 different videos. Tag links with `?utm_source=meta&utm_campaign=<video-name>`.
- [ ] Answer every support email the same day.

**Checkpoint:** what does a sale cost you in ad spend? Under $15 means ads can scale profitably at a $40 average order.

## Nov 3–23 · Scale what works

- [ ] Put more money into the 2–3 videos and creators with the best sales per dollar. Cut the rest every few days.
- [ ] Grow to 20–40 creators. Make new videos weekly so ads don't go stale.
- [ ] Raise ad spend step by step (e.g. $100 → $300 → $1,000/day) only while the cost per sale holds.

## Nov 24–Dec 1 · Black Friday and Cyber Monday

- [ ] Add a promo code (e.g. `MERRY20:20` in `PROMO_CODES` for 20% off) and push it in ads, posts and to past buyers. Remove it after Cyber Monday.
- [ ] Email everyone who previewed but didn't buy (their emails are in the dashboard).

## Dec 1–15 · Peak season

- [ ] Message angle: **"the last-minute gift with no shipping, ready in 10 minutes."**
- [ ] Check `/admin` several times a day for failed songs and retry them right away.
- [ ] Keep posting and testing new videos. Most of the revenue lands in this window.

---

## Rough weekly revenue targets

| Weeks | Target | Running total |
|---|---|---|
| Oct 6–Nov 2 | $4,000 | $4,000 |
| Nov 3–16 | $20,000 | $24,000 |
| Nov 17–30 | $60,000 | $84,000 |
| Dec 1–15 | $116,000 | $200,000 |

If you're far behind by mid-November, the goal is unlikely. Keep going anyway: December is the strongest month, and the business can keep earning after Christmas (Valentine's Day, Mother's Day, birthdays, weddings).

## Budget to plan for

- **Ad spend:** at about $12–15 per sale, 5,000 sales means **$60,000–75,000** in ads, paid as you go and covered by the sales they bring in.
- **Per song:** Claude lyrics cost a few cents. Check ElevenLabs' per-song cost for your plan and the `music_v2_5` model.
- **Paystack:** a fee per order, higher for international cards than local ones. Check paystack.com/pricing for your country and for USD payments.
- **Creators:** $500–5,000 depending on how many you hire.
