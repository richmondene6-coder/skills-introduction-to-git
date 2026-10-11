# NightOps — Feature Spec & UI Brief (v0.5)

> **Designing the UI? Start with `nightops-ui-design-brief.md`.** It lists every screen with IDs, components, flows and design-tool prompts. This spec holds the detailed rules behind those screens.

Working name: **NightOps**. Operations platform for a high-volume nightclub / lounge / bar.
Serves **restaurants, bars, lounges and nightclubs**, each with its own personalised mode. Purpose of this doc: give a designer (or design tool) everything needed to draw the screens. Bring the designs back and we will iterate on both UI and build plan. Technical plan: `nightops-architecture.md`. Global subscription product, onboarding, billing and Platform Admin: `nightops-saas-platform.md`.

**v0.3: NightOps is a global SaaS product.** Businesses download it from the App Store, Google Play or the web, subscribe monthly, and use it in their own country, language and currency. Below, **"Owner" means the client's Business Owner**, and **"Credit Approver" means whoever that owner assigns** (could be the owner, a GM, or a head of VIP). Examples use ₦ but every amount is in the venue's own currency.

**Decisions (v0.2):**
- **Custom build** from scratch.
- **Guest payments:** each business connects its own provider (Paystack in Africa, Stripe elsewhere, more by country). Guests pay in the venue's local currency, with USD/EUR available for foreign cards. Owners pick a **reporting currency** (e.g. USD).
- **Your income:** monthly subscriptions from businesses (see platform doc).
- **Devices:** phones, tablets and computers. Peak **500–1,000 sales/hour**.
- **Staff-responsible credit:** the staff member who sells on credit is responsible for collecting it, from the moment of sale. **Every credit sale needs approval by default.** Each Business Owner chooses who approves, the limits, and whether to relax these rules (§5 A5, §7 C7–C8, §8 D6, §11).
- **Design for:** patchy internet and power, one or many venues per business, any country.

**What changed in v0.5:** menus. Starter menus for each mode and country come from the **NightOps Library**. Businesses add library items or **create their own items** (full spec: `nightops-menu-system.md`; data: `catalog/`). Markets now cover every US state and Canadian province, including Quebec (needs French + WEB-SRM).

**What changed in v0.4:** restaurants included. Every venue picks a **mode**: Restaurant, Nightclub, Bar, Lounge or Mixed. The mode personalises the home screen, navigation, modules, terminology and reports (§4a). Launch markets are Nigeria, US, Canada and UK, which adds tips, card pre-authorised tabs, local drink units and age prompts.

**What changed in v0.3:** NightOps is now a global SaaS product. Credit approvers are configurable per business. New Account/Onboarding/Billing and Platform Admin surfaces. Wage recovery is country-gated.

**What changed from v0.1 (in v0.2):**
- Credit is now owned by the staff member who sold it and approved by the owner.
- Money is multi-currency, with USD reporting for the owner.
- There are 3 connection states, because a venue hub keeps devices in sync offline.
- New screens: My Credit Book, Credit Approvals, Staff Liability, Currency & FX, Staff Exit Settlement.

---

## 1. Product in one paragraph

A POS and back-office that never stops working when the internet drops, records every naira (cash, transfer, card, credit) against a bartender shift, deducts stock by the millilitre on every sale, lets VIP guests run tabs with hard credit limits, and then chases unpaid tabs automatically over WhatsApp/SMS/voice with payment links, reconciling the ledger the moment money lands. Staff can do their job fast; they cannot quietly delete, discount, or forgive anything.

## 2. Users and devices

| Role | Primary device | What they care about |
|---|---|---|
| **Bartender / Waiter** | Shared tablet or phone at bar, landscape or portrait, one-handed, low light | Speed. Ring up an order in ≤3 taps per item. Never blocked by Wi-Fi. Tracks and collects their own credit sales. |
| **Cashier / Host** | Tablet at door or VIP desk | Open/close tabs, take payments, check guest credit |
| **Kitchen / Chef / Expo** | Kitchen screen or printer | Tickets by station, course timing, allergens, mark ready |
| **Host / Door** *(restaurant, club, lounge)* | Tablet at entrance | Reservations, waitlist, guest list, cover charge, capacity count, ID checks |
| **Server / Waiter** *(restaurant, lounge)* | Phone | Table orders by seat and course, send to kitchen, take payment at table, tips |
| **Promoter** *(nightclub, limited external login)* | Phone | Own guest lists, see attributed entries and table spend, commission |
| **Floor / Shift Manager** | Phone | Approve voids/comps, reconcile shifts, count stock |
| **Accountant / Bookkeeper** | Laptop | P&L, expenses, exports, reconciliation |
| **Business Owner** | Phone + laptop | Live numbers in their reporting currency, theft/shrinkage alerts, debt position, sets who approves credit, manages subscription |
| **Credit Approver** (assigned by owner) | Phone | Approves/declines credit sales up to their limit, fast |
| **Customer (VIP/patron)** | WhatsApp + mobile web page (no app install) | See what they owe, pay in seconds, get receipt |

**Design the customer-facing pieces too** (WhatsApp message layouts, payment page, receipt, statement). They are part of the product.

## 3. Global design principles

1. **Theme follows the mode:** dark by default for Nightclub/Bar/Lounge (low light), light by default for Restaurant; either can be switched. High contrast, large tap targets (min 48px, POS buttons 64px+).
2. **Status = colour + icon + text**, never colour alone. Palette roles: OK (green), Near limit/Warning (amber), Frozen/Overdue/Danger (red), Offline (grey-blue), Pending approval (purple).
3. **Always-visible header chips:** connection state (Online / Offline – N queued), shift timer, staff name, venue/section.
4. **Money is always shown with a currency code/symbol and thousand separators** (₦1,250,000.00 · $812.40). Owner/accountant screens have a global **Local ⇄ USD toggle** showing the FX rate used and its date. Never show an amount without its currency. Money in/out colours are consistent everywhere.
5. **Irreversible or sensitive actions** (void, comp, price edit, forgive debt) always go through the same **Manager PIN modal** — one component, reused everywhere.
6. **Empty, loading, error and offline states** must be designed for every list and form.
7. **Fast paths for repeat behaviour:** favourites, recent items, "repeat last round", quick-qty.
8. **Built for the world:** every text string is translatable (allow +40% text length), layouts mirror for right-to-left languages (Arabic), dates/numbers/currency follow the business's locale, and time is shown in the venue's time zone. Accessibility: WCAG 2.2 AA contrast, screen-reader labels, dynamic text size.

## 4. App map (surfaces)

```
A. POS (bartender/cashier)         — offline-first tablet/phone app
B. Manager app                      — phone-first
S. Account, onboarding & billing     — sign-up, setup wizard, subscription (see platform doc §5)
C. Owner dashboard                  — phone + web
D. Back-office (web)                — menu/recipes, inventory, finance, staff, customers, collections setup
E. Kitchen display (KDS)            — simple ticket board
F. Customer touchpoints             — WhatsApp flows, pay-link page, receipt, statement, IVR script
G. Notifications & alerts           — push / WhatsApp / SMS to staff, approvers and owner
P. Platform Admin console (vendor)  — for you: clients, revenue, country packs (platform doc §5 S4)
```

---

## 4a. Venue modes: one app, personalised per business type

At setup each venue picks a **mode**. The mode decides what staff see first, which modules are switched on, the words used, the menu template, default roles, KPIs and reports. **The core is shared by all modes**: POS ordering & payment, stock, cash & shifts, credit tabs, debt recovery, P&L, roles and audit. The owner can switch any extra module on or off later (Settings → Modules).

### Mode picker (onboarding + Settings)
Large illustrated cards: **🍽 Restaurant · 🪩 Nightclub · 🍸 Bar · 🛋 Lounge · 🔀 Mixed**. Each card lists 3 key features. A venue can be changed later; data is kept.

**Mixed venues** (common: restaurant by day, lounge or club by night):
- **By time:** e.g. 12:00–19:59 Restaurant mode, 20:00–04:00 Nightclub mode. The app switches the home screen automatically at the set time, with a banner "Night mode starts in 15 min".
- **By area:** e.g. Ground floor = Restaurant, Rooftop = Lounge, Main hall = Nightclub. Each station/device belongs to an area.
- Reports can be split by mode/area, or combined.

### What each mode personalises
| | 🍽 Restaurant | 🪩 Nightclub | 🍸 Bar | 🛋 Lounge |
|---|---|---|---|---|
| **Home screen** | Table floor plan: covers, course status, time seated | Live night board: capacity counter, door revenue, VIP tables & min-spend progress, bar sales | Fast tab grid + quick-sale keypad | Seating zones with long-running tabs, reservations, shisha timers |
| **Mode-only modules** | Reservations & waitlist · Table merge/transfer/split · **Courses & "fire" to kitchen** · Kitchen display by station + expo · **Allergens & dietary tags** · Order by seat · Takeaway/collection orders · Food recipe costing (g/kg/each) · Prep lists · Food waste log · *(later: QR order-at-table, delivery platforms)* | **Door & entry:** cover charge, ticket scan, guest list, wristbands · **Capacity counter** (in/out, max-occupancy alert) · **ID / age-check log** · **VIP table bookings** with deposit & minimum spend · **Bottle-service packages** & presentation queue · **Promoters** (guest-list attribution, commission) · **Events** (lineup, event P&L) · Coat check · Security incident log | **Speed tools:** favourites, repeat round, one-tap modifiers · **Card-held tabs** (pre-authorised card, closed at end of night) · Happy-hour price rules · **Pour & measure tracking** (25/35/50 ml, 1/1.5 oz) · **Keg/draught tracking** (pints/litres) · Age-check prompt | Reservations with minimum spend · Table service with long tabs · **Shisha/hookah** (where legal): flavours, coal-refresh timers, pipe stock · Membership & loyalty · Small events |
| **Words used** | Table, cover, course, server, check | Table, bottle, entry, guest list, host | Tab, round, pour | Table, session, host |
| **Default roles** | Host, Server, Runner, Chef/Line cook, Expo, Manager | Door/Cashier, Security, VIP host, Bottle server, Bartender, Promoter, Manager | Bartender, Barback, Manager | Host, Server, Shisha attendant, Bartender, Manager |
| **Headline KPIs** | Covers, spend per cover, table turn time, kitchen ticket time, food cost %, labour % | Entries, door revenue, spend per head, VIP min-spend hit rate, bottle sales, promoter return, sales per bartender per hour | Sales per hour, pour cost %, bottle/keg variance, average tab, bartender speed | Spend per table per hour, dwell time, shisha revenue, repeat-guest rate |
| **Menu template** | Starters/mains/desserts/sides, drinks | Bottles by category, bottle packages, shots, mixers, cover charges | Spirits by measure, beers on tap/bottle, cocktails | Cocktails, shisha flavours, small plates |

### Country-aware POS pieces (all modes)
- **Tips:** tip prompt on card payment (US/CA default ON: 15/18/20%/custom), tip pooling & tip-out report, UK tips-law report (all tips to staff). Service charge (UK/Nigeria) as a separate line.
- **Card-held tabs** (US/CA/UK): pre-authorise a card to open a tab, close it at end of night, auto-close with a set tip rule if the guest leaves.
- **Units & measures** follow the country (ml / fl oz / UK 25 ml or 35 ml spirit measures, pints).
- **Age prompt** with the local legal age (18 / 19 / 21) on first alcohol item for flagged guests.

**Design asks:** draw the mode picker, the **home screen for each of the 4 modes**, the Mixed-mode switch banner, and Settings → Modules toggles. Shared screens (order, payment, credit, reports) stay the same component set in every mode, with mode-specific labels.

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
- When balance + new order > available credit → inline warning with the exact shortfall and options: *Take part payment now*, *Request approver override*, *Cancel items*.
- Also shows the **staff member's own credit meter**: "Your outstanding credit: ₦180,000 of ₦250,000 allowed".

### A5. Credit sale ("Charge to tab"): staff-responsible, approver-approved
**Rule:** whoever rings up a credit sale becomes the **Responsible Staff** for that debt **from the moment of sale**. A Credit Approver must approve it (default ON; the Business Owner can change these rules in D6).

Flow to design:
1. Staff taps **Charge to tab**. A confirmation sheet says plainly: *"You are responsible for collecting ₦45,000 from Tunde A. by 18 Oct. If it isn't paid, it may be recovered from you."* Staff confirms with their PIN.
2. **Guest acknowledgement:** the guest gets a WhatsApp/SMS message: "₦45,000 charged to your tab at {venue} by {staff}. Reply YES to confirm". The guest can also confirm with a one-time code on the staff's screen. This protects the staff member, and stops fake credit sales being used to hide theft.
3. **Approval request** goes to the right approver: the first one whose limit covers the amount, escalating up the chain if nobody answers. Sent by push + WhatsApp. The POS shows **"Pending approval · J. Okafor"** (purple chip).
   - *If the guest has a pre-approved credit line*, or an auto-approve rule applies, and the amount fits within it, the charge is **auto-approved** instantly.
   - Otherwise the order can still be served **at the staff member's risk** while pending. The screen says so clearly.
4. Approver decides: **Approve** · **Approve lower amount** · **Decline**. If declined, the staff member must collect payment now or the amount moves straight to their liability.
5. Staff can't sell on credit when they have hit their **personal credit cap**, or have any debt in the Staff-Liability stage (configurable).

**Frozen tab:** a red banner "Credit limit reached / Overdue" and **"Charge to tab" disabled**. Cash, transfer and card still work. **Request override** goes to a Credit Approver (anyone not assigned as approver can view but not approve). The approver can grant a one-time extra limit with an expiry.

### A5a. My Credit Book (staff's own debtors)
- List of every credit sale this staff member is responsible for: guest, amount, currency, sold date, due date, **aging chip**, approval status, guest-acknowledged ✓, outreach status (last message sent / read / replied / promise date).
- Header totals: **Outstanding**, **Due this week**, **Overdue**, **At risk of moving to my liability (date)**, **Collected this month**, optional **recovery bonus earned**.
- Per debt actions: **Send official pay link** (goes from the venue's WhatsApp, never the staff's personal number), **Log a call/visit note**, **Record cash received** (must go into their till drawer and appears in shift close), **Log promise to pay**, **Request transfer** to another staff member (owner approves).
- Banner reminder: "Guests must only pay to the official venue account or pay link."

### A6. Payment screen (multi-tender split)
- Amount due at top; tender chips: **Cash, Card/POS terminal, Bank transfer, Charge to tab, Voucher/Prepaid, Comp (manager only)**.
- Add multiple tenders to one bill (e.g. ₦20,000 cash + ₦30,000 to tab); remaining balance updates live.
- **Cash:** quick-notes keypad, auto change calculation.
- **Bank transfer:** generates a **dynamic account number / QR** for this exact bill; screen auto-flips to "Paid ✔" when the payment webhook arrives (or "Waiting…" with manual confirm → manager PIN if no webhook).
- **Card:** shows amount sent to terminal, status (pending/approved/failed). Tip prompt where the country/mode uses tips.
- **Tab:** shows tab balance after charge and remaining credit, and launches the A5 credit flow (responsible staff + approval).
- **Debt repayment mode:** a guest paying an old tab at the bar. Pick the guest, see their open charges oldest first, take payment, and the oldest charges are cleared first. Cash goes into the drawer, and the Responsible Staff is notified.
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

### A10. Connection states (must be designed: 3 states)
The venue runs a small **hub computer** on its own network so all devices stay in sync even with no internet (see architecture doc).
| State | Header chip | What works |
|---|---|---|
| **Online** | green "Online" | Everything |
| **Venue-only** (internet down, hub up) | amber "No internet – venue sync OK" | All sales, tabs, credit charges (approval request goes to approvers on the venue network, or queues until internet returns, unless guest is pre-approved), stock. Bank-transfer/card confirmations show "Will confirm when internet returns". |
| **Device offline** (can't reach hub) | red "Offline – 14 sales queued" | Cash sales only. **No credit sales or tab charges**. Voids/comps need a cached manager PIN (rate-limited). |
- On reconnect: the queue syncs automatically. A conflict screen appears only if needed ("Item price changed while offline").

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
- All tabs, filter by status / aging bucket / **responsible staff**. Open a guest to see their ledger, send a reminder now, call now, freeze/unfreeze, or request a write-off.
- Managers approve credit **only if the Business Owner has made them a Credit Approver** (with a limit). Otherwise they can view everything and add notes.

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

### C7. Credit approvals (Credit Approver, phone-first, must be fast)
- Push/WhatsApp notification opens a **one-screen decision card**:
  - Guest: name, photo, tier, total owed, oldest debt age, payment history ("paid 9 of 10 tabs, average 6 days late"), guest acknowledged ✓/pending.
  - Sale: items, amount + currency, time, station.
  - **Responsible staff:** name, their current outstanding credit vs cap, their collection rate, and any debts already in liability.
  - Buttons: **Approve** · **Approve lower amount** · **Decline** (reason) · **Approve + set credit line for this guest** (future charges up to X are auto-approved until a chosen date).
- Biometric/PIN to confirm. A queue view handles busy nights ("6 pending · ₦310,000"), with batch approve for small amounts below a threshold the owner sets.
- If the approver doesn't respond within N minutes, the request **escalates** to the next approver in the chain. The charge stays "Pending" at the staff member's risk.
- Shows the approver's own limit ("You can approve up to $300"). Bigger amounts show "Send to Owner".

### C8. Staff credit & liability
- Table per staff member: credit sold (period), outstanding, overdue, **collection rate %**, average days to collect, amount moved to **staff liability**, deductions made, bonuses earned.
- **Liability case** screen (per debt that passed its deadline): timeline of outreach attempts, guest promises, staff notes, then options (Owner, or approvers with that permission):
  - **Extend deadline**
  - **Transfer to another staff member**
  - **Recover from staff**: one-off or instalment plan. **Only shown where the country pack allows it and the business has switched it on.** The staff member's signed agreement is linked here.
  - **Write off**: the venue takes the loss.
  - **Keep chasing guest**: if the guest pays later, any amount already recovered from staff is refunded to them automatically.
- **Staff exit settlement:** before a staff member can be deactivated, the app lists their open credit. Each debt must be transferred, settled or written off.

### C9. Currency & payouts
- Global **Local ⇄ reporting currency** (e.g. USD) toggle on every owner/finance screen. Shows "Rate: 1 USD = ₦X (source, date)".
- Payouts view: Paystack settlements by currency (NGN account, USD domiciliary account), fees paid, pending settlements, and money still to be converted to USD.
- FX gain/loss line in P&L when debts are paid in a different currency than they were sold in.

---

## 8. Surface D — Back-office (web)

### D1. Menu & pricing
**Full spec: `nightops-menu-system.md`.** Starter menu from the NightOps Library per mode and country. Add library items or create your own items. Multiple menus with schedules, price per menu, modifiers, packages (bottle service), out-of-stock (86) toggle, import/bulk edit, translations.
- Categories, items, sizes, modifiers, bundles (bottle service), happy-hour price rules (blocked where the region forbids them), tax/service charge settings.
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
- Customer database: contact, country/phone code, WhatsApp opt-in status, owner-approved credit line (amount, currency, expiry), tier (VIP/Regular/Corporate), notes, blacklist.
- **Guest credit policy:** default limit per tier, grace days, auto-freeze triggers (limit reached **or** any balance older than X days), guest-acknowledgement required (on/off).
- **Staff credit policy:**
  - Personal credit cap per staff member or role.
  - Days until an unpaid debt becomes **staff liability** (e.g. 30).
  - Whether staff with liability debts can keep selling on credit.
  - Recovery bonus % (optional incentive).
  - Maximum payroll deduction per pay period.
  - **Credit Approvers:** pick people/roles, each with a max amount; escalation chain and timeout; whether approval is required at all (default: yes, every sale).
  - Auto-approve rules: pre-approved guest lines, amounts under X, good payment record; batch-approve threshold.
  - When accountability starts: at sale (default) or after N days.
  - Unpaid-debt outcome options: track only / transfer / write off / recover from staff (country-gated, off by default).
- **Staff credit agreement:** upload or e-sign the agreement each staff member signs before credit selling is switched on for them.
- Guarantor / referrer field for large limits.

### D6a. Currency & FX settings
- Venue local currency (from venue country), business reporting currency (e.g. USD).
- Daily FX rate: automatic source + manual override, with a history table.
- Pay-link currency rules: local by default; allow USD for foreign cards (on/off); quote lock time.

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
- Every message is sent **from the venue's official WhatsApp number**, never a staff member's personal phone. It names the staff member who served the guest ("Served by Ada") so the guest recognises the tab, and states "Only pay to the official link/account below".

### F2. Pay-link page (mobile web, no login)
- Header: venue + guest name, amount due **in the debt's currency**, itemised accordion.
- **Currency selector:** defaults to the venue's local currency, detected from the venue country and the guest's phone/location. Guests with foreign cards can choose **USD**, which shows the converted amount, the rate, and a "price held for 30:00" countdown.
- Choose: **Pay full / Pay part (amount input) / Bank transfer details with copy button / Card**.
- Result screens: success (with receipt download), pending, failed, expired link, quote expired (requote).
- Trust cues: venue name, secure badge, support WhatsApp number.

### F3. Statement & receipt
- Digital receipt layout (logo, items, tenders, balance); tab statement with debit/credit lines and ageing.

### F4. Voice / IVR script flow (diagram this)
- Triggered for tabs past grace period (e.g. 14+ days) within allowed call hours.
- Flow: greeting + identity → "Press 1 to receive a payment link by WhatsApp/SMS, 2 to promise a payment date, 3 to speak with someone, 9 to opt out of calls". Call outcome logged on guest timeline (answered/no answer/promise/opt-out).

### G. Staff/approver/owner notifications (push + WhatsApp)
- **Approvers:** credit approval requests (highest priority, actionable from the notification), escalations.
- **Owner:** escalated credit requests (highest priority, actionable from the notification), frozen-tab override requests, low stock, large void, comp over threshold, cash variance, payment received on a large tab, daily summary, venue hub/internet down > N minutes, outreach bot failures.
- **Staff:** your credit sale was approved/declined, your guest paid (with amount), your guest promised/disputed, "debt moves to your liability in 3 days", recovery bonus earned.
- Notification centre UI with severity, unread, snooze rules.

---

## 10. Role & permission matrix (design as an editable grid)

*Defaults below; every row is editable per business by its Owner.*

| Action | Bartender | Cashier | Manager | Accountant | Owner |
|---|:-:|:-:|:-:|:-:|:-:|
| Ring up sales / open tabs | ✔ | ✔ | ✔ | – | ✔ |
| Void line **before** send | ✔ | ✔ | ✔ | – | ✔ |
| Void **after** send / after payment | ✖ | ✖ | **PIN** | – | ✔ |
| Delete a sales record | ✖ | ✖ | ✖ (void only, logged) | ✖ | ✖ (records are append-only; reversal entries only) |
| Change item price / apply discount | ✖ | ✖ | ✔ (logged) | ✖ | ✔ |
| Comp items | ✖ | ✖ | **PIN** + reason | – | ✔ |
| Sell on credit (charge to tab, becomes Responsible Staff) | ✔ within own cap | ✔ within own cap | ✔ within own cap | – | ✔ |
| **Approve a credit sale** | ✖ | ✖ | If assigned approver (up to limit) | ✖ | ✔ (or whoever the Owner assigns) |
| Charge to tab beyond guest limit | ✖ | ✖ | Request only | – | ✔ |
| Clear / adjust / forgive customer debt | ✖ | ✖ | Request only | ✖ | ✔ |
| Edit guest credit line / staff credit cap | ✖ | ✖ | ✖ | ✖ | ✔ |
| Transfer debt responsibility between staff | Request | Request | Request | ✖ | ✔ |
| Recover debt from staff (payroll deduction) | ✖ | ✖ | ✖ | Prepare | ✔ |
| See own credit book | ✔ | ✔ | ✔ | – | ✔ |
| See all staff credit & liability | ✖ | ✖ | ✔ | ✔ | ✔ |
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

**Staff-responsible credit lifecycle** (design this as a status timeline on every credit charge):
```
Requested → Pending approval (escalates up the approver chain) → Approved (or Declined → collect now / staff liability)
   → Open (staff accountable from sale by default) → Due (grace ends) → Overdue (outreach escalates)
   → Unpaid outcome chosen by business (track · transfer · write off · recover from staff where lawful)
   → Paid by guest │ Recovered from staff │ Transferred │ Written off
```
- Each charge has exactly **one Responsible Staff** at a time. Transfers keep the history.
- **Guest acknowledgement** (YES reply / one-time code) is recorded against the charge.
- Staff can't sell on credit above their personal cap, or (configurable) while they have debts in liability.
- If a guest pays after money was recovered from the staff member, the staff member is **refunded automatically**.
- Guests only ever pay the **venue** (Paystack link, official account, or into a till). Never a staff member's personal account.
- **Legal gate:** recovering debts from wages is restricted or unlawful in many countries and states. It is **off by default** and blocked where the country pack says so. Where allowed, it needs a signed staff agreement and the business's acceptance of responsibility (see platform doc §3).

**Aging buckets:** Current · 1–7 · 8–14 · 15–30 · 30+ days (oldest unpaid charge sets the bucket; partial payments apply FIFO to oldest charges).

**Currency:** sales and debts are recorded in the venue's local currency. The owner sees everything in their **reporting currency** (e.g. USD) at the stored daily rate. A payment in a different currency stores its rate, and any difference is booked to FX gain/loss.

**Payment reconciliation:** Paystack webhook → verify → match by reference → apply to oldest charges → update balance → unfreeze if eligible → notify Responsible Staff + approver/owner → send receipt → stop escalation → write ledger and audit entry. Unmatched payments land in a "Needs matching" queue (design this screen).

**Stock deduction:** each sale line explodes through its recipe; bottle level is tracked in ml; partial bottles carry over between shifts; comps/spills/breakages deduct with reason codes; theoretical vs counted variance is surfaced after every stock count.

**Business day:** sales after midnight belong to the previous business day until the configured cut-off.

---

## 12. Screen inventory (checklist for the designer)

Modes (§4a): Mode picker · Restaurant home (floor plan) · Nightclub home (live night board) · Bar home (fast tabs) · Lounge home (zones + shisha timers) · Mixed-mode switch banner · Settings → Modules · Reservations & waitlist · Courses/fire + kitchen display by station · Allergen tags · Door & entry (cover, guest list, capacity, ID log) · VIP table booking with min-spend · Promoter view · Card-held tab open/close · Tip prompt & tip-out report.

POS: Login · Shift open · Floor view · Order screen · Modifier sheet · Customer search/new · Guest credit card (+ staff credit meter) · **Credit responsibility confirm sheet** · **Guest acknowledgement (code) screen** · **Pending-approval state** · Frozen-tab banner · Override request · Payment (split) · **Debt repayment mode** · Cash keypad · Transfer QR · Success/receipt · **My Credit Book + debt detail** · Quick loss log · Cash drop / paid-out · Shift close (blind count) · Sync queue · **3 connection states**.

Manager: Live dashboard · Approvals inbox · Approval detail · Shift reconciliation list/detail · Stock count · Receive delivery · Tab list/detail (filter by staff) · Staff on shift.

Owner: Home KPIs (Local ⇄ reporting currency) · P&L (+ drill-down) · CapEx · Debt aging · Debtor detail · **Credit approval card + queue** (approvers) · **Staff credit & liability table** · **Liability case** · **Staff exit settlement** · **Payouts & currency** · Loss centre · Reports centre · Controls.

Menu (see `nightops-menu-system.md` §9): Starter-menu review · Set-prices grid · Menu list & schedules · Menu editor · **Unified search (library + own items)** · Library browser · Quick-add sheet · **Create own item** (short + full form) · "Did you mean…?" · Category manager · Modifier groups · Package builder · Allergen checklist · Library-update compare · Import mapping · Bulk edit.

Back-office: Menu · Recipe editor · Inventory list/ledger · Stock take · PO/GRN · Expenses · Payroll (incl. approved deductions where lawful) · Customers · Guest & staff credit policy · **Staff credit agreement** · **Currency & FX** · Playbook builder · Template editor · Integrations · Audit log · Roles matrix · Settings.

Account & billing (see platform doc §5): Marketing site + pricing · Sign-up/login · Create business (country picker) · Setup wizard (venue, menu template, invite staff, **Credit & Approvals wizard**, connect payments, pair devices + choose Hub) · Setup checklist · Subscription & billing (plan, usage, invoices, past-due / read-only states) · Cancel flow · Account deletion.

Platform Admin (you): Clients list · Client detail · Revenue (MRR, churn, trials) · Country packs · Message template library · App releases · System health · Announcements.

Customer: WhatsApp thread designs (5 tones + credit-acknowledgement message) · Pay-link page (6 states, with currency selector) · Receipt · Statement · IVR flow diagram.

---

## 13. Suggested build phases

| Phase | Scope | Outcome |
|---|---|---|
| **1 – Control the till** | POS (offline), shifts, blind count, roles/PINs, audit log, sales reports | Stops cash leakage fast |
| **2 – Control the stock** | Recipes, ml-level deduction, was## 14. Questions

**Answered:**
- **Markets:** Nigeria, United States, Canada, United Kingdom (England first). Company registered in Nigeria. Pilot venues available. Name: NightOps.
- **Venue types:** restaurants, nightclubs, bars and lounges, each with its own personalised mode (§4a).
- **Menus:** ready-made starter menus from the NightOps Library. Businesses can pick more library items and create their own.
- **US company:** yes, before the US/CA/UK public launch. **Coverage:** every US state and Canadian province.
- **Product:** global SaaS. Businesses subscribe monthly; you are the vendor; launch on App Store, Google Play and web.
- **Credit:** whoever the Business Owner assigns approves credit (configurable approvers with limits). Approval is required and staff are accountable from the moment of sale by default; each business can adjust this.
- **Clients' devices:** phones, tablets and computers, up to 500–1,000 sales/hour per venue.
- **Build:** custom.

**Still open:**
1. **Pilot venues:** which venues, and which modes are they (club, lounge, restaurant, bar, mixed)? Do any already use a POS we'd need to import menus from?
2. **Starter menus:** review `catalog/starter-menus.md` with your pilot venues. Which items are missing or wrong for Nigeria?
4. **Brand look:** logo, colours, vibe (premium-dark, neon, minimalist). The name **NightOps** is decided; trademark checks are pending.
6. **Pricing:** happy with per-venue monthly plans (Starter / Pro / Enterprise), or do you prefer per-device pricing?

dit sale wait for the owner, or may the owner pre-approve credit lines for trusted guests so those sales go through instantly? (The spec supports both. Which is the default?)
4. **Staff liability:** after how many days does an unpaid debt become the staff member's? Is the recovery a payroll deduction, an instalment plan, or both? Any recovery bonus for staff who collect on time?
5. **Typical tab size and number of VIPs on credit**, to set default caps.
6. **Debt recovery limits:** contact hours, voice calls allowed?
7. **Accounting:** who keeps the books and in what tool (QuickBooks / Zoho / Excel)?
8. **Hardware:** receipt/kitchen printers and card terminals? OK to add a small venue hub computer + UPS + 4G backup router?
9. **Brand:** venue name, logo, colours, vibe (premium-dark, neon, minimalist).

---

## 15. Prompt you can paste into a design tool

> Design "NightOps", an offline-first operations app for restaurants, bars, lounges and nightclubs (dark mode for night venues, light mode option for restaurants), sold worldwide as a subscription on iOS, Android and web (phones, tablets, computers; up to 1,000 sales/hour). Create: (0) onboarding: sign-up, create business with country picker (Nigeria, US, Canada, UK; sets currency/language/tax), a venue-mode picker with illustrated cards (Restaurant, Nightclub, Bar, Lounge, Mixed), a distinct home screen per mode (restaurant table floor plan with courses; nightclub live night board with capacity counter, door revenue and VIP min-spend progress; bar fast-tab grid; lounge seating zones with shisha timers), a Settings → Modules toggle screen, menu setup (starter-menu review with keep/remove toggles, a fast set-prices grid, one search box that finds library items and the business's own items with states "On menu / In your catalog / Add from library / Create your own", and a create-your-own-item form with photo, category, sell units & prices, stock pack size, recipe with live margin and allergen checklist), setup checklist, a "Credit & Approvals" settings screen where the owner assigns approvers with amount limits and an escalation chain, device pairing by QR, and a subscription/billing status screen including past-due and read-only states; (1) a tablet/phone POS with floor/section view, order screen with category rail + item grid + cart, guest credit meter plus the staff member's own credit meter, a "you are responsible for collecting this" credit confirmation sheet, a "pending approval · approver name" state, frozen-tab banner, split-tender payment screen with tip prompt, card-held tab, quick loss log, blind-count shift close, a "My Credit Book" list of the staff member's debtors, and three connection-state header chips (Online / No internet – venue sync OK / Offline); (2) a phone manager app with live dashboard, approvals inbox with PIN modal, and shift reconciliation; (3) an approver/owner app with a one-screen credit-approval card (guest history + responsible staff's track record + approver's limit + Approve / Approve lower / Decline / Send to Owner), real-time P&L with a Local ⇄ reporting-currency toggle, sales by Drinks/VIP/Kitchen, debt aging buckets (0–7, 8–14, 15–30, 30+), a staff credit & accountability table, and a shrinkage/anomaly centre; (4) WhatsApp message layouts for credit acknowledgement and friendly → firm debt reminders with quick-reply buttons; (5) a mobile payment-link page with currency selector; (6) a web Platform Admin console for the vendor (clients, MRR/churn, country packs). Use large touch targets, status colours with icons, a reusable PIN-override component, text that can grow 40% for translation, and layouts that can mirror for right-to-left languages. Currency amounts always show their currency. Refer to the feature spec for flows and states.
