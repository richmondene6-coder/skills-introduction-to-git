# NightOps — Architecture & Build Plan (v0.3)

Companion to `nightops-app-feature-spec.md` and `nightops-saas-platform.md`. This covers *how* to build what the spec describes.

**v0.2 change:** NightOps is a **multi-tenant global SaaS**. Many businesses in many countries share one platform. See §11. Where this doc says "owner" it means a client's Business Owner. Paystack details in §5 apply to Paystack-country clients; other countries plug in other providers.

## 1. Decisions so far

| Topic | Decision | Consequence |
|---|---|---|
| Build vs buy | **Build our own, from scratch** | We own the ledger, offline sync and debt-recovery logic. No third-party POS to integrate with. |
| Product model | **Global SaaS**: monthly subscriptions from businesses; iOS, Android, web | Multi-tenant, self-serve onboarding, subscription billing, Platform Admin, country packs (§11) |
| Guest payments | **Per-business provider**: Paystack (Africa), Stripe (most other markets), more later | Each business connects its own account; guest money never passes through the vendor. Webhooks drive automatic reconciliation. |
| Reporting currency | **Chosen per business** (e.g. USD) | Ledger records the local currency, and reports convert at stored daily FX rates (§5). |
| Guest payments | **Local currency, chosen by location** | Each venue has a local currency. Pay links show local currency first, with USD for foreign cards. Needs multi-currency ledger and FX rates. |
| Devices | **Phones, tablets and computers** | One shared codebase: native app for phones/tablets, web app for computers. |
| Volume | **500–1,000 sales/hour at peak** | Throughput is easy (≈1 sale every 4 seconds). The hard part is **many devices staying consistent while the internet is down**. |
| Credit | **Selling staff accountable from the moment of sale; approvers assigned by each Business Owner** | Rules engine per business: approver list with limits, escalation chain, auto-approve rules, country-gated wage recovery (spec §11, platform §3). |

## 2. System overview

```
           ┌──────────────────────── VENUE (LAN / Wi-Fi) ────────────────────────┐
           │                                                                      │
 Phones ───┤                                                                      │
 Tablets ──┼──►  VENUE HUB (mini-PC + UPS)  ◄──► Receipt / kitchen printers       │
 Laptops ──┤     • local API + database                                           │
           │     • single source of truth for tabs & credit while offline         │
           │     • queues events for the cloud                                    │
           └───────────────┬──────────────────────────────────────────────────────┘
                           │ syncs when internet is up (4G backup router recommended)
                           ▼
           ┌────────────────────────── CLOUD ─────────────────────────────────────┐
           │  API  ·  PostgreSQL (ledger, stock, customers)  ·  Job scheduler      │
           │  Webhook receiver (Paystack, WhatsApp, Voice)  ·  Reports / dashboards│
           │  Owner web + mobile  ·  Pay-link pages  ·  Object storage (receipts)  │
           └───────┬───────────────┬──────────────────┬───────────────────────────┘
                   ▼               ▼                  ▼
               Paystack     WhatsApp Cloud API   SMS + Voice/IVR provider
```

### Why a venue hub?
At 1,000 sales/hour across 10+ devices, a phone that loses Wi-Fi can't see what other phones are doing. Two bartenders could then charge the same VIP tab past its limit, or both sell the last bottle. A small always-on computer on the venue network (with a UPS, because of power cuts) keeps every device consistent **even when the internet is down**. The cloud only needs to catch up later.

**The connection states the UI must show** (spec §5 A10):
1. **Online**: device ↔ hub ↔ cloud all up.
2. **Venue-only**: internet is down but the hub is up. Everything works except online payments; bank-transfer confirmations wait.
3. **Device offline**: the device can't reach the hub. It can take cash sales only. No credit sales or tab charges, and voids/comps need a cached manager PIN. All of it syncs later.

## 3. Recommended stack

| Layer | Recommendation | Why |
|---|---|---|
| Language | **TypeScript everywhere** | One language for app, hub, cloud. Easier hiring. Shared validation and money logic. |
| Phone/tablet app | **React Native (Expo)** with **SQLite** on device | One codebase for Android and iOS. Offline storage. Bluetooth/USB printer libraries exist. |
| Computer app | **React web app** (shares components/logic with the mobile app) | Back-office, owner dashboard and manager desk on laptops. |
| Hub + Cloud API | **Node.js (NestJS or Fastify)** | The same code runs on the hub (Docker on a mini-PC) and in the cloud. |
| Database | **PostgreSQL** in cloud; Postgres or SQLite on hub | Real transactions for the ledger. Strong reporting. |
| Sync | **Append-only event log + outbox**. Every action is an event with a UUID, device, staff, timestamp and idempotency key. | Safe replay, no double-charging, full audit trail by design. (Ready-made sync engines like PowerSync or ElectricSQL are worth evaluating before writing our own.) |
| Jobs | Queue + scheduler (e.g. BullMQ on Redis) | Debt-escalation timeline, scheduled reports, low-stock checks, webhook retries. |
| Files | S3-compatible object storage | Receipt photos, breakage photos, PDFs. |
| Hosting | Managed Postgres + container hosting in a region close to West Africa (e.g. Europe or South Africa) | Low latency and less to manage yourself. |

## 4. Data model (core tables)

- **Business** (tenant: plan, region, reporting currency, credit & approval rules), **Membership** (user ↔ business ↔ role ↔ venues), **Subscription**.
- **Venue** (country, local currency, timezone, business-day cut-off), **Device**, **Staff**, **Role**, **Permission**.
- **Product**, **Recipe line** (product → ingredient + ml/qty), **Stock item** (bottle size ml, cost), **Stock movement** (sale/comp/spill/breakage/transfer/count/delivery; append-only).
- **Order**, **Order line**, **Payment** (tender, currency, amount, FX rate, provider reference).
- **Shift**, **Drawer event** (open float, drop, paid-out, no-sale, count).
- **Customer**, **Credit line** (limit, owner-approved, currency), **Credit charge** (order, amount, *responsible_staff_id*, approval status, due date), **Credit payment** (allocated FIFO to charges).
- **Staff liability** (charge transferred to staff after deadline, repayment plan, payroll deduction records).
- **Ledger entry**: double-entry; never updated or deleted. Corrections are reversal entries.
- **Expense**, **CapEx asset**, **FX rate** (date, pair, rate, source).
- **Outreach step** (channel, template, sent/delivered/read/replied, cost), **Promise to pay**, **Dispute**.
- **Approval request**, **Audit log** (hash-chained so tampering is detectable).

## 5. Payments & currency (Paystack)

**What Paystack's own docs say (verify before relying on them, see Sources):**
- Nigerian businesses can accept NGN and USD. **USD payouts for Nigerian businesses require a Zenith Bank USD domiciliary account** added in Paystack settings.
- NGN payments settle in NGN. **Paystack will not turn your NGN takings into USD for you.** If you want your money in USD, converting NGN revenue is a separate bank/treasury step. The app can *report* everything in USD, but the conversion itself happens at your bank.
- Fees: local NGN transactions are capped at ₦2,000. International/USD cards are 3.9% + ₦100 (Amex 4.5%).
- Paystack only operates in a few African countries. A venue in an unsupported country needs a second payment provider. **Build a payment-provider interface from day one** so Paystack is one plug-in, not hard-wired.

**Currency rules in the app:**
1. Every venue has a **local currency**; prices and sales are recorded in it.
2. The owner's **reporting currency is USD**. Dashboards toggle Local ⇄ USD using a stored daily FX rate (source + manual override; the rate is saved with every report so history doesn't change).
3. Each debt is owed **in the currency it was sold in**. If a guest pays in USD for a NGN debt, the system stores the rate used and books any FX difference to an "FX gain/loss" line.
4. **Pay-link page** defaults to the venue's local currency. A guest with a foreign card can choose USD. The amount is locked for a short window (e.g. 30 min) and then requoted.

**Payment confirmation flow (the heart of automated debt recovery):**
```
Paystack webhook (charge.success)
  → verify signature (x-paystack-signature, HMAC-SHA512 with secret key)
  → re-verify the transaction via Paystack "verify" API (never trust the webhook body alone)
  → idempotency check on reference (ignore duplicates)
  → allocate to the guest's oldest unpaid charges (FIFO)
  → post ledger entries · update balance · unfreeze if eligible
  → stop escalation · notify responsible staff + owner
  → send WhatsApp/SMS receipt to guest
Unmatched payment → "Needs matching" queue for manager.
```

## 6. Messaging & voice (debt outreach)

| Need | Recommendation | Notes |
|---|---|---|
| WhatsApp | **WhatsApp Cloud API direct from Meta** (or through a local reseller if you want local support/billing) | Reminders must be **pre-approved utility templates**. Free-form replies only within 24h after the guest messages you. Guests must have opted in, so the POS captures WhatsApp consent when the tab opens. |
| SMS fallback | Africa's Talking or Termii | For guests without WhatsApp, or when WhatsApp delivery fails. |
| Voice / IVR | Africa's Talking Voice (supports keypad menus) | For tabs past the grace period, inside allowed calling hours. |

**Escalation engine:** a scheduled job runs every 15 minutes. For each open debt it finds the next playbook step that is due. It skips the step if it falls in quiet hours, if the debt is paid or disputed, or if there's an active promise to pay. Otherwise it sends the step and logs delivery status and cost. One "Pause all outreach" switch stops everything.

**Compliance guardrails (built in, not optional):** consent capture and opt-out ("STOP") handling. Contact only within allowed hours, with a weekly contact cap. Messages are factual and polite. **No threats, no contacting third parties, and no public shaming.** Take local legal advice on debt-collection and data-protection rules before switching on voice calls.

## 7. Security

- RBAC with per-action permissions. Manager/owner overrides by **PIN + reason**. PINs hashed (Argon2), lockout after 3 tries.
- Owner and accountant accounts use password + **2-factor**. The owner approves credit from the phone with biometric/PIN.
- **Device registration**: only enrolled devices can log in to the POS. Remote wipe/disable.
- **Append-only ledger and stock movements.** No delete endpoint exists for sales, payments or debts. Corrections are reversals that need approval.
- Hash-chained audit log. Daily encrypted backups, plus a hub backup to the cloud.
- Pay links are single-guest, signed, expiring tokens. The guest-facing page shows nothing beyond that guest's own tab.

## 8. Performance targets

- Add-to-cart < 100 ms on device. Payment completion < 2 s on the hub (excluding card terminal time).
- Hub sized for 2,000 sales/hour (2× peak headroom).
- Sync backlog of a full offline night (≈8,000 events) clears in < 5 minutes once the internet returns.
- Dashboards update within 1 minute when online.

## 9. Building-block costs (indicative, verify before budgeting)

| Item | Indicative price | Source / confidence |
|---|---|---|
| Paystack local NGN payments | Capped at ₦2,000 per transaction (third-party 2026 guides cite 1.5% + ₦100, ₦100 waived under ₦2,500) | Cap: Paystack support. Rate: third-party, verify |
| Paystack international / USD cards | 3.9% + ₦100 (Amex 4.5%) | Paystack support page |
| WhatsApp utility template (Nigeria) | ≈ US$0.0101 per message outside the 24h service window; free inside it | Secondary source. Meta can change rates each quarter. A reported Oct 2026 change to service-message billing is unconfirmed |
| Voice calls (Africa's Talking, Nigeria) | ₦15/min outbound + ₦5,000 + VAT monthly maintenance | Provider help page (over 3 years old, may be stale) |
| SMS (Nigeria) | ≈ ₦1.80–₦6.00 per SMS | Third-party, Feb 2025 |

Rough messaging cost example: 300 debtors/month × 5 WhatsApp reminders × $0.0101 ≈ **$15/month**. Debt outreach is cheap. Paystack fees on collected payments will be the bigger cost.

## 10. Build phases (engineering view)

| Phase | Engineering deliverables |
|---|---|
| 0 – Foundations | Repo/monorepo, multi-tenancy + row-level security, entitlements, i18n, country packs, auth, roles/PINs, device enrolment, event log + sync, venue hub image, design system from your UI designs |
| 1 – Till | POS ordering, payments (cash/transfer/card), shifts, blind count, printers, audit log, basic sales reports |
| 2 – Stock | Recipes, ml-level deduction, wastage/comp/breakage, counts, low-stock alerts, POs |
| 3 – Money | Expenses, CapEx, FX rates, live P&L in local + USD, scheduled reports |
| 4 – Credit | Customers, credit lines, staff-responsible credit charges, owner approvals, aging, freeze, staff liability |
| 5 – Recovery | Paystack pay links + webhooks, WhatsApp templates + two-way bot, SMS/voice, escalation engine, receipts |

**Suggested team:** 1 product designer, 2–3 full-stack TypeScript engineers (one strong on mobile/offline), and a part-time QA/ops person to run a real-venue pilot. Pilot Phase 1 in one bar before rolling out further.

## 11. Multi-tenant SaaS architecture

**Tenancy model**
- Shared database, with a `business_id` on every row, enforced by **PostgreSQL row-level security**. A bug in one query can't leak another client's data.
- Large Enterprise clients can later be moved to a dedicated database without code changes (same schema).
- **Regions:** start with one primary region, then add an **EU region** before selling in the EU (GDPR expectations). A business is pinned to a region at sign-up, and its data, backups and hubs stay there.

**New services**
| Service | Job |
|---|---|
| Identity | Users, logins (email/phone OTP, Google, Apple), 2FA, memberships across businesses, device enrolment |
| Tenant & entitlements | Businesses, venues, plan → feature flags and limits (venues, devices, message quota). The app asks "is feature X on for this business?", never "which plan are they on?" |
| Subscription billing | Billing-provider interface: Paystack (Africa) + Merchant of Record / Stripe (rest of world). Handles trials, renewals, failed-payment retries (dunning) and grace periods, driven by provider webhooks. |
| Country packs | Versioned config per country: currency, tax presets, receipt rules, language defaults, outreach rules (hours, voice allowed, consent), legal gates (e.g. wage recovery), message templates |
| Payment connectors | One interface per guest-payment provider (Paystack, Stripe, Flutterwave…); each business stores its own encrypted credentials or connected-account ID |
| Messaging connectors | WhatsApp Cloud API (one number per business, or a shared platform number with business branding), SMS/voice providers chosen per country |
| Platform Admin API | Powers your vendor console; every support access is consent-based, time-limited and audited |
| Usage metering | Counts messages, calls, devices and venues for plan limits and pass-through billing |

**Apps & releases**
- One React Native (Expo) codebase builds the **iOS and Android** apps, plus the React web app. Over-the-air updates for small fixes; store releases for native changes.
- **Minimum-version check** at login so very old apps can be forced to update (important for ledger/sync changes).
- **Hub mode** is a setting in the same app (any always-on tablet/laptop), not separate hardware. Venues without a Hub fall back to cloud sync + per-device offline rules.
- Translations: all strings in i18n files (ICU message format), with a translation-management service. RTL layout support from the start.

**Operations to international standard**
- Infrastructure as code. Separate staging/production. Automated tests on the ledger, sync and money rules (these must never regress).
- Monitoring: error/crash reporting, uptime checks, public status page, on-call that covers **weekend nights in client time zones**.
- Backups: point-in-time recovery. Target RPO ≤ 5 min and RTO ≤ 1 h. Restore tested quarterly.
- Security: OWASP ASVS/MASVS, dependency scanning, secrets manager, yearly penetration test, SOC 2 path (platform doc §8).

**Venue modes (Restaurant / Nightclub / Bar / Lounge / Mixed)**
- A mode is a **preset**, not separate code. It decides which modules are on, the home screen, labels, menu template, default roles and KPIs. Mode presets and plan entitlements combine: a module shows only if the mode or the owner turns it on **and** the plan includes it.
- Mixed venues: modes attach to **areas** (stations/devices belong to an area) or to a **time schedule** per venue. Every order records its mode/area so reports can split or combine.
- Mode-only modules (reservations, courses/KDS stations, door & capacity, promoters, keg tracking, shisha) are separate packages sharing the same core order/payment/stock/ledger.

**Launch-market specifics (Nigeria, US, Canada, UK)**
- **Tax engine:** several stacked taxes per item (e.g. state + county + city sales tax in the US; GST + PST in Canada; VAT + state consumption tax in Nigeria), tax-inclusive (UK/NG) or tax-exclusive (US/CA) prices. US/Canadian rates come from a tax-rate service rather than hand-entered tables.
- **Tips:** tip lines kept separate from sales in the ledger, with tip pools, tip-out rules and the UK tips-law report.
- **Card-held tabs:** Stripe Terminal pre-authorisation (US/CA/UK), with incremental authorisation and capture at close.
- **Units:** stock stored in a base unit (ml/g); display units per country (fl oz, 25/35 ml measures, pints).
- **Hosting:** two regions at launch: **North America** (US & Canadian clients) and **UK/Europe** (UK & Nigerian clients; good latency from Lagos, with NDPA transfer safeguards).
- **Quebec** blocked in onboarding until a WEB-SRM module exists.

**Phase 0 must include tenancy, entitlements, i18n, country packs and mode presets.** They are cheap to build in at the start and very expensive to retrofit.

## 12. Sources

- Paystack, currencies & USD: https://support.paystack.com/hc/en-us/articles/360009973799-Can-I-accept-payments-in-US-Dollars-USD
- Paystack, international payments: https://support.paystack.com/hc/en-us/articles/360009973779-What-currencies-does-Paystack-accept-Payments-in-
- Paystack, transaction pricing: https://support.paystack.com/hc/en-us/articles/360009881920-What-are-Paystack-s-transaction-charges
- Meta, WhatsApp Business Platform pricing: https://developers.facebook.com/docs/whatsapp/pricing
- WhatsApp 2026 pricing update (secondary): https://yournotify.com/blog/whatsapp-pricing-update-2026/
- Africa's Talking, Nigeria voice pricing: https://help.africastalking.com/en/articles/6054867-voice-pricing-nigeria
- Nigeria SMS pricing (secondary): https://sent.dm/resources/nigeria-sms-pricing
