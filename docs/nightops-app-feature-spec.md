# NightOps — Feature Spec & UI Brief (v0.1)

Working name: **NightOps**. Operations platform for a high-volume nightclub / lounge / bar.
Purpose of this doc: give a designer (or design tool) everything needed to draw the screens. Bring the designs back and we will iterate on both UI and build plan.

**Assumptions to confirm (see §12):** West-African market (NGN currency, diesel/generator costs, bank-transfer culture), venue has patchy internet, 1 venue at launch (multi-venue later), bartenders use shared tablets or their own phones.

---

## 1. Product in one paragraph

A POS and back-office that never stops working when the internet drops, records every naira (cash, transfer, card, credit) against a bartender shift, deducts stock by the millilitre on every sale, lets VIP guests run tabs with hard credit limits, and then chases unpaid tabs automatically over WhatsApp/SMS/voice with payment links, reconciling the ledger the moment money lands. Staff can do their job fast; they cannot quietly delete, discount, or forgive anything.

## 2. Users and devices

| Role | Primary device | What they care about |
|---|---|---|
| **Bartender / Waiter** | Shared tablet or phone at bar, landscape or portrait, one-handed, low light | Speed. Ring up an order in ≤3 taps per item. Never blocked by Wi-Fi. |
| **Cashier / Host** | Tablet at door or VIP desk | Open/close tabs, take payments, check guest credit |
| **Kitchen / Grill** | Screen or printer | See tickets, mark ready |
| **Floor / Shift Manager** | Phone | Approve voids/comps, reconcile shifts, count stock |
| **Accountant / Bookkeeper** | Laptop | P&L, expenses, exports, reconciliation |
| **Owner** | Phone + laptop | Live numbers, theft/shrinkage alerts, debt position, approvals |
| **Customer (VIP/patron)** | WhatsApp + mobile web page (no app install) | See what they owe, pay in seconds, get receipt |

**Design the customer-facing pieces too** (WhatsApp message layouts, payment page, receipt, statement). They are part of the product.

## 3. Global design principles

1. **Dark theme by default** (club lighting), light theme available for back-office. High contrast, large tap targets (min 48px, POS buttons 64px+).
2. **Status = colour + icon + text**, never colour alone. Palette roles: OK (green), Near limit/Warning (amber), Frozen/Overdue/Danger (red), Offline (grey-blue), Pending approval (purple).
3. **Always-visible header chips:** connection state (Online / Offline – N queued), shift timer, staff name, venue/section.
4. **Money is always shown with currency and thousand separators** (₦1,250,000.00). Money in/out colours consistent everywhere.
5. **Irreversible or sensitive actions** (void, comp, price edit, forgive debt) always go through the same **Manager PIN modal** — one component, reused everywhere.
6. **Empty, loading, error and offline states** must be designed for every list and form.
7. **Fast paths for repeat behaviour:** favourites, recent items, "repeat last round", quick-qty.
8. Multi-language ready (English first; Pidgin/French later). Avoid text baked into icons.

## 4. App map (surfaces)

```
A. POS (bartender/cashier)         — offline-first tablet/phone app
B. Manager app                      — phone-first
C. Owner dashboard                  — phone + web
D. Back-office (web)                — menu/recipes, inventory, finance, staff, customers, collections setup
E. Kitchen display (KDS)            — simple ticket board
F. Customer touchpoints             — WhatsApp flows, pay-link page, receipt, statement, IVR script
G. Notifications & alerts           — push / WhatsApp / SMS to staff and owner
```

---

## 5. Surface A — POS (Bartender / Cashier)

### A1. Login & shift start
- Staff picker (avatars) → 4–6 digit PIN. Optional fingerprint on supported devices.
- **Open shift:** choose station (Main Bar, VIP Bar, Grill, Door), enter **opening cash float** (denomination counter: ₦1000, ₦500, ₦200, ₦100, ₦50 … coins).
- Shows any unresolved items from last shift (e.g. "Short ₦5,000 – awaiting manager review").

### A2. Floor / Table / Section view (home)
- Tiles for: **Bar Tabs**, **VIP Sections** (e.g. VIP 1–12, bottle-service tables), **Walk-in quick sale**, **Kitchen orders**.
- Each tile shows: guest name, running total, tab status chip, time open, assigned server.
- Filters: My tabs / All tabs / Unpaid / Frozen.
- Big "+ New Order" and "+ New Tab" actions.

### A3. Order screen (core screen — optimise heavily)
- **Left:** category rail — Beer, Spirits, Cocktails, Wine/Champagne, Bottle Service, Soft/Water/Ice, Kitchen/Grill, Specials. Search bar. Favourites + Recent.
- **Centre:** item grid (photo optional; name, price, low-stock badge, out-of-stock greyed).
- **Item modifiers sheet:** size (shot/double/bottle), mixer, ice, cooking preference, notes. Bottles show "sell by bottle or by shot".
- **Right:** cart — qty steppers, line notes, per-line "Send to Kitchen/Bar", running subtotal/service charge/VAT, guest/tab attached.
- **Actions:** Hold, Send, Split bill, Pay, Add customer/tab, Void line (→ PIN if already sent), Discount (→ PIN), Comp (→ PIN + reason).
- **Bottle service bundles:** a bottle + mixers + sparklers as one package that explodes into stock deductions.

### A4. Customer / tab attach
- Search by name/phone, recent guests, "Add new guest" (name, phone with WhatsApp consent checkbox, optional photo, ID/notes).
- **Guest card** shown inline: credit limit, current balance owed, available credit **as a progress meter**, oldest unpaid age, status chip (Good standing / Near limit ≥80% / **Frozen**).
- When balance + new order > available credit → inline warning with the exact shortfall and options: *Take part payment now*, *Request manager override*, *Cancel items*.

### A5. Frozen-tab behaviour
- A frozen tab shows a red banner "Credit limit reached / Overdue" and **disables "Charge to tab"**; other tenders (cash, transfer, card) still work.
- Button: **Request override** → sends approval request to manager (push) → manager approves with PIN and reason, optionally with a one-time extra limit and expiry.

### A6. Payment screen (multi-tender split)
- Amount due at top; tender chips: **Cash, Card/POS terminal, Bank transfer, Charge to tab, Voucher/Prepaid, Comp (manager only)**.
- Add multiple tenders to one bill (e.g. ₦20,000 cash + ₦30,000 to tab); remaining balance updates live.
- **Cash:** quick-notes keypad, auto change calculation.
- **Bank transfer:** generates a **dynamic account number / QR** for this exact bill; screen auto-flips to "Paid ✔" when the payment webhook arrives (or "Waiting…" with manual confirm → manager PIN if no webhook).
- **Card:** shows amount sent to terminal, status (pending/approved/failed).
- **Tab:** shows tab balance after charge and remaining credit.
- Split by item / by seat / by amount / equal split.
- Success screen: receipt options — print, WhatsApp, SMS, email, none.

### A7. Quick Loss Log (one-tap, from anywhere)
- Buttons: **Spillage**, **Breakage**, **Comp (needs PIN)**, **Staff drink**, **Returned/Remade**.
- Pick item or bottle → quantity (ml/shots/units) → reason (dropdown) → optional photo → submit.
- Stock deducts immediately; appears in manager's wastage review.

### A8. Cash management during shift
- **Cash drop** (move excess cash to safe): amount, witness manager PIN.
- **Paid-out** (e.g. buy ice, diesel): amount, category, receipt photo, manager PIN → feeds expenses automatically.
- **No-sale drawer open** is logged and requires reason.

### A9. End-of-shift close
- **Blind count:** bartender enters cash by denomination *without seeing expected total*.
- System compares: opening float + cash sales − paid-outs − drops = expected; shows **variance** (over/short) to manager only; bartender sees "Submitted".
- Also reconciles card/transfer totals vs processor settlement.
- Outputs: X/Z report, shift summary (sales by category, voids count/value, comps, discounts, tabs opened, tabs charged).
- Shift cannot be closed with unsent offline queue (shows blocking sync screen).

### A10. Offline mode (must be designed)
- Persistent header chip: "Offline – 14 sales queued".
- All of A1–A9 work offline: menu, prices, open tabs, guest credit (last-synced snapshot), stock decrement (local).
- Offline limits to design: bank-transfer QR and card tenders show "Unavailable offline"; **credit-limit checks use last-known balance and a conservative offline cap** to prevent over-extension; manager PIN works offline (cached hash, rate-limited).
- On reconnect: queue syncs with conflict resolution screen only if needed ("Item price changed while offline").

---

## 6. Surface B — Manager app (phone)

### B1. Live floor dashboard
- Tonight so far: revenue, vs same night last week, covers, avg ticket, bar/VIP/kitchen split, **bartender leaderboard** (sales, void rate, comps).
- Open tabs list with total exposure ("₦3.2M on open tabs").
- Alerts strip: low stock, cash variance, unusual voids, offline devices.

### B2. Approvals inbox
- Requests: void after send, discount, comp, price override, tab limit override, drawer no-sale, forgive/adjust debt.
- Card shows: who, what, amount, reason, guest, history of this staff member's similar requests. Approve (PIN) / Reject (reason).
- Everything logged to the audit trail.

### B3. Shift reconciliation
- List of closed shifts awaiting review; open one → expected vs counted by tender, variance, flagged transactions (voids, comps, discounts, no-sales), timeline of drawer events.
- Actions: Accept, Accept with note, Escalate to owner, **Record shortage against staff** (feeds payroll deduction suggestion — owner approves).
- Variance rules (config): green ≤ ₦500, amber, red; repeated variance for same staff → flag.

### B4. Stock tools
- **Quick stock count** (barcode scan or tap): per bar, per bottle with *partial bottle* entry (bottle level slider in 10% steps or weigh-in).
- Receive delivery (against PO), transfer between stores/bars, log wastage.
- Low-stock list with "Create PO" button.

### B5. Tab management
- All tabs, filter by status/aging bucket; open a guest to see ledger, send reminder now, call now, extend/reduce limit (PIN), freeze/unfreeze, write-off request.

### B6. Staff
- Clock in/out, who is on shift, device status, quick PIN reset.

---

## 7. Surface C — Owner dashboard (phone + web)

### C1. Home (today / week / month toggle)
- KPI tiles: Gross sales, Net sales, Gross margin %, COGS %, Overheads, **Net profit (real-time)**, Cash variance, Debtors total.
- Sales split chart: **Drinks / VIP & bottle service / Kitchen & grill** (stacked bar over time).
- Top/bottom items by margin and volume.
- Comparison to previous period and same weekday.

### C2. Live P&L
- Revenue → COGS (calculated from recipe-level usage) → Gross profit → Operating costs → Net.
- Cost lines: staff pay, **diesel/generator, ice, breakages**, rent, utilities, security, DJ/entertainment, marketing, licences, repairs, bank/processor fees.
- **CapEx tab:** equipment purchases, renovations, depreciation schedule; excluded from operating profit but shown in cash position.
- Drill-down from any number to the underlying transactions.

### C3. Debt & credit position
- Total owed, number of debtors, **aging buckets: Current, 1–7, 8–14, 15–30, 30+ days** (bar + table).
- Top debtors; promised-to-pay list; recovery rate this month; collections-bot activity feed (sent/delivered/replied/paid).
- Per-guest drill-down: ledger, messages sent, call attempts, promises, notes.

### C4. Loss & shrinkage centre
- Theoretical vs actual stock usage by item (variance in ml and ₦).
- Voids, comps, discounts by staff (rate vs peers), spillage and breakage trends.
- Cash shortages by staff and by shift.
- **Anomaly flags** (e.g. "Bartender X voided 9 items after payment on Friday", "Hennessy usage 18% above sales").

### C5. Reports centre
- Auto-scheduled **daily / weekly / monthly** reports (PDF + sheet) delivered by WhatsApp/email at set times.
- Report types: sales by category, sales by staff, product mix, inventory valuation, wastage, debtor aging, shift reconciliations, tax/VAT summary.
- Export CSV/Excel; accountant share link (read-only).

### C6. Approvals & controls
- Owner-only actions: write off debt, change roles, change credit policy, delete/lock periods, view audit log.

---

## 8. Surface D — Back-office (web)

### D1. Menu & pricing
- Categories, items, sizes, modifiers, bundles (bottle service), happy-hour price rules, tax/service charge settings.
- Price changes are **versioned with who/when/why**; only Manager/Owner role.

### D2. Recipes & units (key for shrinkage control)
- Each sellable item maps to ingredients with quantities: e.g. *Henny & Coke = 50 ml Hennessy + 200 ml Coke + 1 ice scoop*.
- Bottle definitions: size (ml), cost, shots per bottle (e.g. 750 ml → 15 × 50 ml), pour sizes per venue.
- Recipe cost shown live → margin % warning if below target.

### D3. Inventory
- Stock items, units, par levels, reorder points, suppliers, storage locations (cellar, main bar, VIP bar, kitchen).
- Stock ledger per item (every in/out with reason code: sale, comp, spill, breakage, transfer, count adjustment, delivery).
- Stock takes (full/partial) with variance report and approval to post adjustments.
- **Low-stock alert rules** per item: threshold → who gets notified, channel, and "auto-draft PO".
- Purchase orders, goods received notes, supplier invoices, supplier price history.

### D4. Finance
- Expense entry (with receipt photo): categories pre-set incl. diesel, ice, breakages, staff pay, repairs.
- Recurring expenses, petty-cash float, bank reconciliation (import statement, match transfers).
- Payroll sheet: base, commissions, shortage deductions (approved), advances.
- CapEx register with depreciation.
- Chart of accounts + export to accounting software (QuickBooks/Zoho/Xero/CSV).

### D5. Staff & permissions
- Staff profiles, PIN management, device assignments.
- **Role/permission matrix editor** (see §10).

### D6. Customers & credit policy
- Customer database: contact, WhatsApp opt-in status, credit limit, tier (VIP/Regular/Corporate), notes, blacklist.
- Credit policy: default limit per tier, grace days, auto-freeze triggers (limit reached **or** any balance older than X days).
- Guarantor / referrer field for large limits.

### D7. Collections playbook builder
- Visual timeline editor: steps on Day 0, +3, +7, +14, +21, +30 with channel (WhatsApp/SMS/Voice), template, tone (Friendly / Firm / Final), send window (e.g. 10:00–19:00), stop conditions (paid, disputed, promise-to-pay).
- Template editor with variables: `{name}`, `{amount_due}`, `{venue}`, `{pay_link}`, `{bank_details}`, `{days_overdue}`, `{promise_date}`.
- Message previews (WhatsApp bubble UI), approval status of WhatsApp templates.
- Per-tier playbooks. Global kill-switch ("Pause all outreach").
- Compliance settings: quiet hours, max contacts per week, opt-out handling, required identification line.

### D8. Integrations & devices
- Payment provider, WhatsApp Business, SMS/voice provider, accounting export, printers/KDS, card terminals, webhooks log (delivery status, retry).

### D9. Audit log
- Immutable, filterable log: who/what/when/device/before→after for prices, voids, comps, role changes, debt adjustments, approvals, logins, report exports.

### D10. Settings
- Venue profile, taxes/service charge, currency, operating hours/"business day" cut-off (e.g. 6am), receipt design, multi-venue (future).

---

## 9. Surface E, F, G — Kitchen, Customer touchpoints, Notifications

### E. Kitchen display
- Ticket columns: New → Cooking → Ready. Timer per ticket, colour-coded late tickets, item notes prominent. "Bump" button. Printer fallback.

### F1. Customer WhatsApp / SMS conversations (design the chat bubbles)
1. **Tab opened/receipt:** itemised summary, running balance, credit limit.
2. **Friendly reminder (Day 3–7):** "Hi {name}, thanks for visiting {venue}. Your tab of ₦X is open. [Pay now] [See breakdown]".
3. **Reminder with bank details (Day 7–14).**
4. **Firm notice (Day 14–21):** states amount, days overdue, consequences (credit paused), payment link + account number, option to "Promise a date" / "Dispute an item".
5. **Final notice (Day 30):** professional, factual, no threats or public shaming; states next steps and a human contact.
- **Quick-reply buttons:** Pay now · I've paid · Promise to pay on… · Dispute · Talk to a person · Stop messages.
- **Two-way bot flows:** "I've paid" → asks for reference/screenshot → verifies via payment webhook or flags for human review. "Promise date" → date picker → schedules follow-up and pauses escalation until date. "Dispute" → itemised list to pick lines → creates dispute ticket for manager.
- **Payment confirmation message** + digital receipt (PDF/image) + updated balance.

### F2. Pay-link page (mobile web, no login)
- Header: venue + guest name, amount due, itemised accordion.
- Choose: **Pay full / Pay part (amount input) / Bank transfer details with copy button / Card**.
- Result screens: success (with receipt download), pending, failed, expired link.
- Trust cues: venue name, secure badge, support WhatsApp number.

### F3. Statement & receipt
- Digital receipt layout (logo, items, tenders, balance); tab statement with debit/credit lines and ageing.

### F4. Voice / IVR script flow (diagram this)
- Triggered for tabs past grace period (e.g. 14+ days) within allowed call hours.
- Flow: greeting + identity → "Press 1 to receive a payment link by WhatsApp/SMS, 2 to promise a payment date, 3 to speak with someone, 9 to opt out of calls". Call outcome logged on guest timeline (answered/no answer/promise/opt-out).

### G. Staff/owner notifications (push + WhatsApp)
- Low stock, large void, comp over threshold, cash variance, frozen-tab override request, payment received on large tab, daily summary, device offline > N minutes, outreach bot failures.
- Notification centre UI with severity, unread, snooze rules.

---

## 10. Role & permission matrix (design as an editable grid)

| Action | Bartender | Cashier | Manager | Accountant | Owner |
|---|:-:|:-:|:-:|:-:|:-:|
| Ring up sales / open tabs | ✔ | ✔ | ✔ | – | ✔ |
| Void line **before** send | ✔ | ✔ | ✔ | – | ✔ |
| Void **after** send / after payment | ✖ | ✖ | **PIN** | – | ✔ |
| Delete a sales record | ✖ | ✖ | ✖ (void only, logged) | ✖ | ✖ (records are append-only; reversal entries only) |
| Change item price / apply discount | ✖ | ✖ | ✔ (logged) | ✖ | ✔ |
| Comp items | ✖ | ✖ | **PIN** + reason | – | ✔ |
| Charge to tab beyond limit | ✖ | ✖ | **PIN** + expiry | – | ✔ |
| Clear / adjust / forgive customer debt | ✖ | ✖ | Request only | ✖ | ✔ |
| Edit credit limit | ✖ | ✖ | Within band | ✖ | ✔ |
| See expected cash total before blind count | ✖ | ✖ | ✔ | ✔ | ✔ |
| Edit inventory counts / post adjustments | ✖ | ✖ | ✔ | View | ✔ |
| View P&L / margins / costs | ✖ | ✖ | Limited | ✔ | ✔ |
| Edit recipes / menu | ✖ | ✖ | ✔ | ✖ | ✔ |
| Manage roles, PINs | ✖ | ✖ | Reset PINs | ✖ | ✔ |
| Export reports | ✖ | ✖ | Own venue | ✔ | ✔ |
| View audit log | ✖ | ✖ | ✔ | ✔ | ✔ |

**Security UX requirements:** PIN lockout after 3 wrong attempts; inactivity auto-lock (30–60s on POS); device registration; every override stores approver + reason; "Reversal" entries instead of deletions.

---

## 11. Core business rules the UI must express

**Credit & freeze**
- Available credit = limit − outstanding balance. Charging a tab above available credit is blocked.
- Auto-freeze triggers: (a) limit reached, (b) any invoice older than grace days (config, e.g. 14), (c) manual freeze, (d) broken promise-to-pay.
- Unfreeze automatically when balance falls below the limit **and** nothing is past grace.

**Aging buckets:** Current · 1–7 · 8–14 · 15–30 · 30+ days (oldest unpaid charge sets the bucket; partial payments apply FIFO to oldest charges).

**Payment reconciliation:** payment webhook → match by reference → apply to oldest charges → update balance → unfreeze if eligible → send receipt → stop escalation → write ledger and audit entry. Unmatched payments land in a "Needs matching" queue (design this screen).

**Stock deduction:** each sale line explodes through its recipe; bottle level is tracked in ml; partial bottles carry over between shifts; comps/spills/breakages deduct with reason codes; theoretical vs counted variance is surfaced after every stock count.

**Business day:** sales after midnight belong to the previous business day until the configured cut-off.

---

## 12. Screen inventory (checklist for the designer)

POS: Login · Shift open · Floor view · Order screen · Modifier sheet · Customer search/new · Guest credit card · Frozen-tab banner · Override request · Payment (split) · Cash keypad · Transfer QR · Success/receipt · Quick loss log · Cash drop / paid-out · Shift close (blind count) · Sync queue · Offline states.

Manager: Live dashboard · Approvals inbox · Approval detail · Shift reconciliation list/detail · Stock count · Receive delivery · Tab list/detail · Staff on shift.

Owner: Home KPIs · P&L (+ drill-down) · CapEx · Debt aging · Debtor detail · Loss centre · Reports centre · Controls.

Back-office: Menu · Recipe editor · Inventory list/ledger · Stock take · PO/GRN · Expenses · Payroll · Customers · Credit policy · Playbook builder · Template editor · Integrations · Audit log · Roles matrix · Settings.

Customer: WhatsApp thread designs (5 tones) · Pay-link page (4 states) · Receipt · Statement · IVR flow diagram.

---

## 13. Suggested build phases

| Phase | Scope | Outcome |
|---|---|---|
| **1 – Control the till** | POS (offline), shifts, blind count, roles/PINs, audit log, sales reports | Stops cash leakage fast |
| **2 – Control the stock** | Recipes, ml-level deduction, wastage/comp/breakage logging, low-stock alerts, counts | Stops bottle theft and waste |
| **3 – Control the money** | Expenses, CapEx, live P&L, margin dashboards, scheduled reports | Real-time profit view |
| **4 – Control credit** | Customer tabs, limits, aging, auto-freeze, split tenders | VIP credit with guardrails |
| **5 – Recover debt** | WhatsApp/SMS bot, payment links, webhooks, IVR, auto-reconcile, receipts | Cash collected without staff effort |

## 14. Open questions (answers change the design and the vendor choice)

1. **Country / currency / payment rails?** (Assumed Nigeria + NGN — Paystack/Flutterwave-style payment links and virtual accounts.) 
2. **Devices:** staff phones, shared Android tablets, or existing POS hardware? Receipt/kitchen printers? Card terminals?
3. **Scale:** peak transactions per hour, number of bars/stations, one venue or several?
4. **Credit:** typical tab size, how many VIPs on credit, who may grant limits, and is there a guarantor practice?
5. **Debt recovery tone & legal limits:** acceptable contact hours, whether voice calls are allowed, privacy/consent practice for WhatsApp opt-in.
6. **Accounting:** who keeps the books and in what tool (QuickBooks / Zoho / Excel)?
7. **Build vs buy:** custom build on an offline-first POS core, or compose existing POS + ledger + messaging tools? (Recommendation and priced vendor matrix to follow once 1–3 are answered.)
8. **Brand:** venue name, logo, colours, vibe (premium-dark, neon, minimalist).

---

## 15. Prompt you can paste into a design tool

> Design a dark-mode, offline-first hospitality operations app called "NightOps" for a high-volume nightclub. Create: (1) a tablet POS with floor/section view, order screen with category rail + item grid + cart, guest credit meter, frozen-tab banner, split-tender payment screen, quick loss log, and blind-count shift close; (2) a phone manager app with live dashboard, approvals inbox with manager-PIN modal, and shift reconciliation; (3) an owner dashboard with real-time P&L, sales by Drinks/VIP/Kitchen, debt aging buckets (0–7, 8–14, 15–30, 30+), and a shrinkage/anomaly centre; (4) WhatsApp message layouts for friendly → firm debt reminders with quick-reply buttons; (5) a mobile payment-link page. Use large touch targets, status colours with icons, persistent online/offline chip, and a reusable PIN-override component. Refer to the feature spec for flows and states.
