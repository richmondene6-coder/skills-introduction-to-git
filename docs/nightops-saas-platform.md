# NightOps — Global SaaS Platform Plan (v0.3)

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

## 1. Decisions

| # | Decision | What it means for the product |
|---|---|---|
| 1 | **Revenue = monthly subscription paid by businesses** | Self-serve sign-up, plans, trials, billing, invoices and dunning. Plus a **Platform Admin console** for you. |
| 2 | **Who approves credit is decided by each Business Owner** | Approvers are **configurable per business**: any person or role, each with an amount limit, plus an escalation chain. |
| 3 | **Approval is required from day 1, but adjustable** | Defaults: every credit sale needs approval, and the selling staff member is accountable **from the moment of sale**. Each business can change these rules. |
| 4 | **Global launch on iOS, Android and web** | Multi-language, multi-currency, multi-tax and multi-timezone. Country-specific legal rules. App-store compliance. International security and privacy standards. |
| 5 | **Launch markets: Nigeria, United States, Canada, United Kingdom (England)**, covering **every US state and every Canadian province** | Four country packs, plus **region packs** for each US state and Canadian province (taxes, tips, wage rules, happy-hour rules, drinking age). **Quebec is in scope**, so a certified WEB-SRM billing module and French are required before the Canada launch (§9). |
| 6 | **Your company is registered in Nigeria; you'll form a US company too** | Paystack for subscription billing from day one. The US company unlocks Stripe Billing/Tax/Connect for US, CA and UK clients (§4.2). |
| 7 | **Pilot venues available** | Pilot in Nigeria first (§10). |
| 8 | **Name: NightOps** | Trademark and domain checks in all 4 markets (§9.3). |
| 9 | **Restaurants included, with a personalised mode per business type** | Restaurant / Nightclub / Bar / Lounge modes, plus hybrids (feature spec §4a). |
| 10 | **Ready-made menus + own items** | NightOps Library with starter menus per mode × country. Businesses pick from the library or create their own items (`nightops-menu-system.md`, `catalog/`). |

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

### 4.2 Collecting your subscription money (you're a Nigeria-registered company)
**What we found** (verify, see Sources):
- **Stripe doesn't let Nigeria-registered businesses sign up directly.** Nigeria is routed to Paystack (which Stripe owns).
- **Paystack** can charge international cards in **USD** (3.9% + ₦100) and pay you out in USD to a Zenith USD domiciliary account.
- **Paddle** (Merchant of Record) says it supports sellers in 200+ countries, but we couldn't confirm Nigeria. Ask them directly.

**Recommended path:**
| Stage | Nigerian clients | US / Canadian / UK clients |
|---|---|---|
| **Pilot & early beta** | Paystack subscriptions in NGN (or USD) | Paystack USD card billing. Works from day one; clients see USD prices. |
| **Before public launch in US/CA/UK** *(decided: yes)* | Paystack | Set up a **US company** (e.g. Delaware via Stripe Atlas) owned by your Nigerian company. This unlocks **Stripe Billing + Stripe Tax** (sales tax/GST tracking, local-currency prices in USD/CAD/GBP, better card approval rates) and a **Stripe Connect platform** for clients' guest payments. Alternative: a Merchant of Record such as Paddle, if it accepts you. |

- **Taxes on your subscriptions** (talk to an accountant in Nigeria and the US):
  - **UK:** business clients normally account for the VAT themselves (reverse charge).
  - **Canada:** non-resident digital-service sellers must register for GST/HST above a sales threshold.
  - **US:** some states tax SaaS once you pass their sales thresholds.
  - Stripe Tax or a Merchant of Record tracks these for you.
- **US company upkeep:** yearly filings, including Form 5472 for foreign-owned US companies, with heavy penalties if missed. Budget for a US accountant.

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
2. **Create business:** name and **country** (Nigeria / US / Canada / UK at launch, with state/province picked from the address). Country sets currency, taxes, units, language, drinking age and legal rules.
3. **Choose venue mode:** big illustrated cards: **Restaurant · Nightclub · Bar · Lounge · Mixed** (e.g. restaurant by day, lounge by night). This personalises the whole app (feature spec §4a).
4. **Add first venue:** address, opening hours, business-day cut-off (e.g. 6 am), time zone.
5. **Menu setup:** review the **starter menu** for the chosen mode and country (66–85 items from the NightOps Library), set prices in a fast grid, add more from the library or **create your own items**. Or import CSV/Excel, or start empty (`nightops-menu-system.md`).
6. **Invite staff:** by phone/WhatsApp/email, with role and venue. Staff get a link and set their PIN.
7. **Credit & approvals wizard** (§3): who approves, limits, accountability rules, legal notice. Optional; suggested by default in Nigeria and offered as an add-on in US/CA/UK, where tabs usually close the same night.
8. **Connect guest payments:** Paystack / Stripe / others for the business's *own* guest payments (§6). Skippable.
9. **Pair devices:** scan QR on each phone/tablet and **choose the Hub device** (§7).
10. **Choose plan / start trial** (web).
11. **Setup checklist** stays on the home screen until done ("Make a test sale ✓").

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
- **NightOps Library:** add/edit items, starter menus per mode × market, review items businesses suggest (`nightops-menu-system.md` §8).
- **Country & region packs:** currency, tax presets, legal gates (e.g. staff-recovery allowed?), outreach rules (contact hours, voice allowed?), receipt requirements, default languages and message templates.
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

## 9. Launch markets & country packs

### 9.1 What each country pack contains
| | 🇳🇬 Nigeria | 🇺🇸 United States | 🇨🇦 Canada | 🇬🇧 United Kingdom (England first) |
|---|---|---|---|---|
| **Currency** | NGN | USD | CAD | GBP |
| **Guest payments** | Paystack (online, transfer, pay links; check Paystack card terminals) | Stripe + Stripe Terminal card readers | Stripe + Stripe Terminal | Stripe + Stripe Terminal |
| **Sales taxes** | VAT 7.5% + **state taxes** such as Lagos State consumption tax on restaurants/hotels/events | State + county + city sales tax, some liquor taxes. Use a tax-rate service | GST/HST/PST by province, plus liquor taxes | VAT 20%. Export VAT records for Making Tax Digital software |
| **Receipt / fiscal law** | No fiscal device today (watch the tax authority's e-invoicing rollout) | None generally | **Quebec requires certified sales-recording (WEB-SRM) for restaurants & bars.** Because Quebec is in scope, NightOps must pass Revenu Québec's certification before the Canada launch | None (VAT records via MTD) |
| **How "tabs" work** | **Long-term credit is common.** Credit + debt recovery is a headline feature | Tab = card held/pre-authorised and closed the same night. Long-term credit is rare | Same as US | Same as US |
| **What sells the product** | Credit control, theft & stock control, USD reporting | Speed, theft & pour control, tips, labour | Same as US | Same as US + tips law compliance |
| **Tips** | Occasional; service charge common | **Heavy tipping:** tip prompts, tip pooling, tip-out reports | Heavy tipping; pooling rules vary by province | **Tips law (2024):** all tips must go to workers; written tipping policy; records kept |
| **Recover tabs from staff wages** | Possible only with clear written consent (lawyer to confirm) | **Blocked by default.** Many states (e.g. California, New York) restrict deductions | **Blocked.** Ontario, BC and others forbid deductions for cash shortages | Only with prior written agreement; for retail-type workers, cash-shortage deductions **capped at 10% of gross pay per payday** |
| **Debt reminders** | WhatsApp first, SMS fallback; NDPA consent | **SMS first** (carrier registration required for business texting); TCPA consent for automated texts/calls; California's Rosenthal Act covers businesses collecting their *own* debts | SMS + email; CASL consent rules; provincial consumer rules | WhatsApp + SMS; UK GDPR + PECR consent |
| **Interest/late fees on tabs** | Off by default | Off by default (lending laws) | Off by default | Off by default. Interest-free short-term credit is usually exempt from FCA consumer-credit rules, but fees can change that |
| **Language** | English | English (Spanish later) | **English + French** (French required in Quebec for the app, receipts and guest messages) | English |
| **Drink units** | ml | US fl oz | oz and ml | 25/35 ml spirit measures, pints |
| **Legal drinking-age prompt** | 18 | 21 | 18 or 19 by province | 18 (Challenge 25 prompt) |
| **Data hosting** | UK/EU region, with NDPA transfer safeguards | North America region | North America (Canada region option) | UK/EU region |
| **Accounting exports** | QuickBooks, Zoho, Sage, Excel | QuickBooks Online, Xero | QuickBooks Online, Xero | Xero, QuickBooks, Sage |

> Also check in each market: **rules on selling alcohol on credit**, and licensing rules for door entry and capacity (nightclubs). These belong in the country pack once confirmed.

### 9.2 Launch order (recommended)
1. **Nigeria pilot**: 1–3 of your pilot venues (§10).
2. **Nigeria paid beta**: 10–30 venues; subscriptions via Paystack. Form the US company in parallel.
3. **United Kingdom (England)**: one VAT rate, no fiscal device, WhatsApp is common, and the tips law is a selling point.
4. **United States, all states**: the region packs carry state/local sales tax (from a tax-rate service), tip and wage rules, happy-hour bans and dram-shop notes. Open sign-ups to every state at once. Pick a few states for launch marketing and in-person support.
5. **Canada, all provinces**: English + French from day one, region packs for GST/HST/PST, drinking age (18/19) and tips. **Quebec needs WEB-SRM certification by Revenu Québec.** Start that process early (it involves testing with their systems) so Quebec isn't the thing that delays the whole Canada launch.

### 9.2a Region packs (US states & Canadian provinces)
A region pack sits on top of the country pack. It holds:
- sales-tax rules
- drinking age
- wage-deduction and tip-pooling rules
- whether alcohol happy-hour discounts are allowed
- consent rules for reminder texts and calls
- receipt requirements (e.g. Quebec WEB-SRM)
- the language to use (e.g. French in Quebec)

The venue's address picks its region pack automatically. Your Platform Admin console shows which region packs are **verified by a local advisor** and which are still **draft**. Sign-ups from draft regions are allowed but flagged.

### 9.3 Name & brand checks for "NightOps"
- Trademark searches in **Nigeria (Trademarks Registry), US (USPTO), Canada (CIPO), UK (UKIPO)** for software (class 9) and SaaS (class 42). Then file in the launch markets.
- Domains (e.g. nightops.app / .com / .ng / .co.uk) and social handles.
- Because restaurants are included, use a tagline that says so, e.g. *"NightOps: run your restaurant, bar, lounge or club."*

## 10. Pilot plan (Nigeria)
- **Pick venues that cover the modes:** ideally one nightclub/lounge (your original brief) and one restaurant or restaurant-bar.
- **Scope:** Phase 1–2 (till + stock) first, then credit & approvals once the till is trusted.
- **Success measures** (agree them with each venue before starting):
  - cash variance per shift down
  - stock variance down
  - time to ring a sale ≤ 5 s
  - zero lost sales during internet outages
  - debt collected within 14 days up
- **Run of play:** set up with them, attend the first 2–3 busy nights in person, then hold weekly feedback calls. Every bug found on a Saturday night gets fixed before the next one.
- **Pilot pricing:** free during pilot, then a founding-client discount in exchange for a testimonial or case study.

## 11. Sources
- Apple App Review Guidelines (3.1.3): https://developer.apple.com/support/downloads/terms/app-review-guidelines/App-Review-Guidelines-English-UK.pdf
- Apple developer forum, Enterprise Services 3.1.3(c): https://developer.apple.com/forums/thread/773357
- Apple developer forum, cross-platform service pattern: https://developer.apple.com/forums/thread/825551
- Google Play Payments policy: https://support.google.com/googleplay/android-developer/answer/9858738
- Paddle vs Stripe (merchant of record, fees): https://freemius.com/blog/paddle-vs-stripe/
- Paystack USD acceptance: https://support.paystack.com/hc/en-us/articles/360009973799-Can-I-accept-payments-in-US-Dollars-USD
- Paddle supported countries: https://developer.paddle.com/concepts/sell/supported-countries-locales
- Stripe & Nigeria (secondary): https://incorpuk.com/blog/stripe-for-nigerians/
- Stripe Atlas for African founders (secondary): https://techcabal.com/?p=44169
- Revenu Québec, restaurant-sector mandatory billing (WEB-SRM): https://www.revenuquebec.ca/en/one-mission-concrete-actions/ensuring-tax-compliance/tax-evasion/tax-evasion-in-the-restaurant-sector
