# NightOps — Global SaaS Platform Plan (v0.1)

Third doc in the set:
- `nightops-app-feature-spec.md`: what the app does and what each screen shows.
- `nightops-architecture.md`: how it's built.
- **This doc:** how NightOps works as a **global subscription product**, sold to bars, lounges and nightclubs through the **Apple App Store, Google Play and the web**.

> **Who is who from now on**
> - **You** = the **Platform owner / vendor** (you sell NightOps).
> - **Client** = a **Business** that subscribes (its **Business Owner** is the account holder).
> - **Venue** = a bar/club location of that business. **Staff** = the client's employees.
> - **Guest** = the client's customer (the person drinking and running a tab).

---

## 1. Decisions (v0.3)

| # | Decision | What it means for the product |
|---|---|---|
| 1 | **Revenue = monthly subscription paid by businesses** | Self-serve sign-up, plans, trials, billing, invoices and dunning. Plus a **Platform Admin console** for you. |
| 2 | **Who approves credit is decided by each Business Owner** | Approvers are **configurable per business**: any person or role, each with an amount limit, plus an escalation chain. |
| 3 | **Approval is required from day 1, but adjustable** | Defaults: every credit sale needs approval, and the selling staff member is accountable **from the moment of sale**. Each business can change these rules. |
| 4 | **Global launch on iOS, Android and web** | Multi-language, multi-currency, multi-tax and multi-timezone. Country-specific legal rules. App-store compliance. International security and privacy standards. |

---

## 2. Account structure (multi-tenant)

```
Platform (you)
 └── Business (subscriber / billing account)      e.g. "Skyline Hospitality Ltd"
      ├── Subscription & plan, payment method, invoices
      ├── Business settings: country, currency, languages, tax, credit & approval rules
      ├── Venue 1  e.g. "Skyline Lagos"  ── stations ── devices (one can act as Hub)
      ├── Venue 2  e.g. "Skyline Accra"
      └── People: Business Owner · Admins · Approvers · Managers · Staff (per-venue roles)
```
- One person can belong to **several businesses** (e.g. a DJ-bartender working at two clubs). Their login is personal; their role is per business/venue.
- Every piece of data belongs to exactly one Business. Clients can never see each other's data.

---

## 3. Credit approval & accountability (configurable per business)

**Defaults on a new account (your "day 1" rules):**
- Every credit sale needs approval. The default approver is the Business Owner.
- The selling staff member is the **Responsible Staff from the moment of sale**.
- Guest acknowledgement (WhatsApp/SMS "YES" or one-time code) is on.

**What the Business Owner can change** (Settings → Credit & Approvals; design this screen):
- **Approvers:** add people or roles (e.g. "General Manager", "Head of VIP"), each with a **max amount they can approve** (e.g. GM up to $300, Owner unlimited).
- **Escalation chain:** if approver A doesn't respond in N minutes, ask B, then the Owner.
- **Auto-approve rules:** trusted guest credit lines, amounts under X, or guests with a good payment record.
- **When accountability starts:** at sale (default), or after N days unpaid.
- **Staff caps:** max outstanding credit per staff member or role.
- **What happens when a debt goes unpaid:** track only / transfer / write-off / **recover from staff** (see legal gate below).
- **Owner approval itself can be switched off** (e.g. a small bar where the owner is always behind the counter).

**⚠ Legal gate for "recover from staff":** taking money from staff wages for unpaid customer tabs is **restricted or illegal in many countries and states**. NightOps must therefore:
1. Ship this option **off by default**, with a per-country rule pack that can block it entirely where it's unlawful.
2. Make the business accept an in-app notice ("You are responsible for complying with local employment law") before enabling it.
3. Only **record** agreed recoveries. NightOps never touches payroll money itself.

Accountability *tracking* (who sold it, who's collecting it, collection rates) is fine everywhere and is the core value.

---

## 4. Business model & subscription

### 4.1 Plan structure (hypothesis: validate with 15–20 venue owners before fixing prices)
| Plan | For | Includes | Price idea (USD/month, per venue) |
|---|---|---|---|
| **Starter** | Small bar/lounge | POS, shifts & blind count, stock with recipes, basic reports, 3 devices | $39–59 |
| **Pro** *(main plan)* | Busy bar/club | Everything in Starter + credit tabs, approvals, debt-recovery bot (WhatsApp/SMS), live P&L, USD/local reporting, unlimited devices | $99–149 |
| **Enterprise** | Groups, multi-venue | Pro + multi-venue roll-ups, API & webhooks, SSO, priority support, data residency | Custom |

- **Add-ons:** voice/IVR debt calls, extra venues, accounting integrations.
- **Usage pass-through:** WhatsApp/SMS/voice usage billed at cost + margin, shown in a usage meter.
- **14-day free trial**, no card needed. **Annual billing** at ~2 months free.
- **Regional pricing:** lower prices in lower-income markets (e.g. Africa, LatAm, South Asia) and standard prices in the US/UK/EU. Prices stored per country/currency.

### 4.2 Collecting your subscription money
| Market | Recommended | Why |
|---|---|---|
| Africa (Paystack countries) | **Paystack** subscriptions, USD where enabled (Nigeria: USD settles to a Zenith USD domiciliary account) | Your preferred rail. Local cards and transfers work. |
| Rest of world | A **Merchant of Record** (e.g. Paddle, or Stripe's managed payments where eligible) | When you sell software into the EU/UK/US you owe VAT/GST/sales tax in many places. A Merchant of Record becomes the legal seller and handles tax for you. It costs more per transaction (Paddle quotes 5% + $0.50), but it saves you registering for tax in dozens of countries. **Check that it supports a Nigeria-based seller**, or set up a company abroad (e.g. US/UK). |

Build a **billing-provider interface** so both can run side by side. The app only asks "is this business's subscription active, and on which plan?"

### 4.3 App Store & Google Play rules (important for design)
Apple and Google normally require their own in-app purchase for digital subscriptions (taking a 15–30% commission). For **business software sold to organisations**, the usual approach is:
- **Sell and manage subscriptions on your website.** The iOS/Android apps are free downloads where users **log in**.
- **No prices, "Subscribe" buttons or links to your pricing page inside the iOS app**, unless the storefront allows it. Apple guideline 3.1.3(c) "Enterprise Services" and 3.1.3(f) "Free stand-alone apps" are the relevant ones.
- On Android, Google's Payments policy has similar rules. US rules have been relaxed by court orders since 2025. **Re-check both stores' current policies before submission.**
- **Option for later:** add in-app purchase for owners who sign up on their phone. Weigh the store fee against the extra conversions.
- **Design consequence:** sign-up can start in the app, but **plan choice and payment screens live on the web**. The app shows "Manage your subscription at nightops.app" (text only, no link) on iOS, plus a subscription *status* screen.

Other store requirements to design for:
- **in-app account deletion** (Apple requirement)
- privacy labels (Apple) and the Data safety form (Google)
- a privacy-focused login option if you offer Google/Facebook sign-in (e.g. Sign in with Apple)
- a demo account for app reviewers

---

## 5. New surfaces to design

### S0. Marketing website (web)
Landing page (problem → product → proof), features per role, **pricing page with currency switcher**, demo booking, help centre, legal pages (Terms, Privacy, DPA, Subprocessors, Acceptable Use), status page link.

### S1. Sign-up & onboarding (web + app). Goal: first test sale in under 15 minutes
1. Sign up: email or phone + OTP, or Google / Apple.
2. **Create business:** name, type (bar, lounge, nightclub, restaurant-bar), **country**. The country auto-sets currency, tax defaults, language, date/number formats and the legal rule pack.
3. **Add first venue:** address, opening hours, business-day cut-off (e.g. 6 am), time zone.
4. **Menu setup:** start from a template for the venue type (pre-filled common drinks and bottle sizes), import CSV/Excel, or start empty.
5. **Invite staff:** by phone/WhatsApp/email, with role and venue. Staff get a link and set their PIN.
6. **Credit & approvals wizard** (§3): who approves, limits, accountability rules, legal notice.
7. **Connect guest payments:** Paystack / Stripe / others for the business's *own* guest payments (§6). Skippable.
8. **Pair devices:** scan QR on each phone/tablet and **choose the Hub device** (§7).
9. **Choose plan / start trial** (web).
10. **Setup checklist** stays on the home screen until done ("Make a test sale ✓").

### S2. Subscription & billing (Business Owner, web; status-only in app)
- Current plan, renewal date, venues/devices used vs plan limits, usage meters (messages, calls).
- Upgrade/downgrade, add venue, switch monthly/annual, payment method, invoices (download PDF), tax ID (VAT/GST number), billing contact.
- **Payment failure states** to design:
  - **Past due:** banner, "Update card", days of grace remaining.
  - **Grace ended:** read-only mode. **The POS keeps working for X days**, because a club can't be stopped mid-Saturday. Data export is always available.
- Cancel flow: reason survey → offer pause → confirm → export data.

### S3. Business settings (Business Owner/Admin)
- Business profile, venues, languages, currency & FX, taxes (inclusive/exclusive, multiple rates), receipt layout and legal footer, credit & approvals (§3), roles & permissions editor, integrations, data export, audit log, **delete business** (with grace period).

### S4. Platform Admin console (you and your team, web only)
- **Clients:** search businesses, plan, MRR, country, venues, devices, last active, health score (are they actually using it?).
- **Revenue:** MRR, new/expansion/churned revenue, trials converting, ARPA by country, failed payments queue.
- **Client detail:** subscription history, usage, support notes, feature flags, **support access**. Viewing a client's account only with their consent, time-limited and fully logged.
- **Country packs:** currency, tax presets, legal gates (e.g. staff-recovery allowed?), outreach rules (contact hours, voice allowed?), receipt requirements, default languages and message templates.
- **Messaging templates:** WhatsApp template library per language, plus Meta approval status.
- **App releases:** minimum supported app version, force-update switch, release notes, staged rollout.
- **System health:** sync backlog per venue, webhook failures, message delivery rates, error rates.
- **Announcements:** in-app banners to all or some clients.
- Platform staff roles: Super-admin, Support, Finance, Read-only.

---

## 6. Guest payments for clients worldwide

Each Business connects **its own** payment account, so guest money goes straight to the business, never through you. This keeps you out of money-transmission licensing.

| Region | Provider options (plug-ins behind one interface) |
|---|---|
| Nigeria, Ghana, Kenya, South Africa, Côte d'Ivoire, etc. | Paystack (check its current country list) |
| Wider Africa | Flutterwave as a second option |
| US, UK, EU, Canada, Australia, many more | Stripe (Connect for onboarding; Terminal for card readers) |
| Fallback anywhere | Manual bank transfer with reference matching + cash |

- Pay-link currency = the venue's currency by default. Guests with foreign cards can pay in USD/EUR where the provider supports it.
- **Never store card numbers.** Use the provider's hosted pages/fields, which keeps PCI DSS scope minimal (SAQ A).

---

## 7. Making it work for download-and-go customers

- **The Hub is a mode, not special hardware.** Any always-on tablet or laptop at the venue can be set as the Hub. Recommend a cheap dedicated tablet on a charger. Venues with no Hub still work: each device syncs via the cloud and falls back to per-device offline rules.
- Supported hardware list on the website: tested receipt printers (Bluetooth/network ESC/POS), cash drawers, card readers per provider, recommended tablets.
- Menu templates and sample data so the app looks alive on first open.

---

## 8. "International standard" checklist

| Area | Standard / requirement | Ship when |
|---|---|---|
| **Security** | OWASP ASVS (backend) + MASVS (mobile); encryption in transit/at rest; 2FA for owners/admins; external penetration test | Pen test before public launch |
| **Security certification** | SOC 2 Type II (expected by larger/US/EU groups); ISO 27001 optional | Within 12–18 months |
| **Payments** | PCI DSS via provider-hosted fields (SAQ A) | Launch |
| **Privacy** | GDPR & UK GDPR, US state laws (e.g. CCPA/CPRA), Nigeria NDPA, South Africa POPIA, Kenya DPA; DPA contract; subprocessor list; data export & deletion; **EU data region** option | Launch (EU region by EU launch) |
| **Messaging & calls** | WhatsApp Business policy (opt-in, approved templates); US TCPA (prior consent for automated texts/calls); local debt-collection rules. Enforced by the country packs. | Launch |
| **Fiscal / receipt law** | Some countries require certified/fiscalised POS (e.g. Germany TSE, France NF525, Italy, Austria, Portugal). **Don't sell in those until a country module exists.** | Per country |
| **Accessibility** | WCAG 2.2 AA (contrast, dynamic text size, screen reader labels, no colour-only meaning) | Launch |
| **Localisation** | Languages: English first, then French, Spanish, Portuguese, then Arabic (right-to-left). All text in translation files. Local formats for currency, date, number and time zone. | English at launch, others by market |
| **Reliability** | 99.9% uptime target, public status page, backups with tested restore, offline-first POS | Launch |
| **Support** | Help centre, in-app chat, **support hours that cover nightlife hours** in each client's time zone (Friday/Saturday nights!) | Launch |
| **Integrations** | CSV import/export, accounting (QuickBooks Online, Xero), public API & webhooks | Export at launch; integrations within 6 months |
| **App stores** | Privacy labels / Data safety, account deletion, reviewer demo account, crash-free rate ≥ 99.5% | Launch |
| **Brand/legal** | Trademark search for "NightOps" (or your chosen name) in launch countries; company terms of service | Before public launch |

---

## 9. Launch path (recommended)

1. **Pilot (1–3 venues you can visit)** in your home market: Phase 1–2 features (till + stock). Fix what real nights break.
2. **Paid beta (10–30 venues)** in Paystack countries: add credit, approvals, debt recovery, subscriptions.
3. **Public launch** on web, Google Play and App Store in English-speaking markets with low fiscal-law burden. Turn on the Merchant of Record for international clients.
4. **Expand by country pack:** language + tax + payment provider + legal gates + local message templates per market, starting where demand shows up.

A single app that works everywhere on day one isn't realistic for a POS (tax and receipt laws differ too much). A **platform built for every country from day one**, switched on market by market, is how international POS companies do it.

## 10. Sources
- Apple App Review Guidelines (3.1.3): https://developer.apple.com/support/downloads/terms/app-review-guidelines/App-Review-Guidelines-English-UK.pdf
- Apple developer forum, Enterprise Services 3.1.3(c): https://developer.apple.com/forums/thread/773357
- Apple developer forum, cross-platform service pattern: https://developer.apple.com/forums/thread/825551
- Google Play Payments policy: https://support.google.com/googleplay/android-developer/answer/9858738
- Paddle vs Stripe (merchant of record, fees): https://freemius.com/blog/paddle-vs-stripe/
- Paystack USD acceptance: https://support.paystack.com/hc/en-us/articles/360009973799-Can-I-accept-payments-in-US-Dollars-USD
