# NightOps — UI Design Brief (for the design tool)

**One document with everything needed to design an interactive prototype of NightOps.**
NightOps is an offline-first, subscription operations app for **restaurants, bars, lounges and nightclubs**. It runs on phones, tablets and computers in **Nigeria, the US (all states), Canada (all provinces) and the UK**.

Deeper background, if the designer needs it: `nightops-app-feature-spec.md` (rules & behaviour), `nightops-menu-system.md` (menus), `nightops-saas-platform.md` (subscriptions, markets), `catalog/starter-menus.md` (real menu items to use in mockups).

---

## 0. How to use this brief

1. Design in this order: **§2 foundations → §3 components → §5 screens → §6 flows**.
2. **Name every frame with its screen ID**, e.g. `POS-11 Payment – split tender`. When the designs come back for the backend, every screen maps straight to its data and API.
3. Build each component once with variants (e.g. Status chip: OK / Warning / Danger / Pending / Offline) and reuse it everywhere.
4. Wire the **clickable flows in §6**. Those are the journeys we'll test with pilot venues.
5. Use the realistic sample data in §7. Avoid lorem ipsum.
6. When done, bring back what §9 lists.

---

## 1. Apps, devices & frame sizes

| # | App | Who | Devices | Frame size |
|---|---|---|---|---|
| A | **NightOps app** (iOS + Android). **One app, role-based home:** Staff POS · Manager · Owner/Approver | Staff, managers, owners | Phone (portrait), tablet (landscape for POS) | Phone 390×844 · Tablet 1180×820 |
| B | **NightOps web app** | Owners, admins, accountants, managers | Laptop/desktop | 1440×900 (also check at 1280) |
| C | **Kitchen display** | Kitchen, bar presentation | Wall/counter screen | 1920×1080 |
| D | **Guest pages** (no login) + **WhatsApp/SMS message designs** | Guests | Phone browser / WhatsApp | 390×844 |
| E | **Platform Admin console** | You (the vendor) and your team | Desktop | 1440×900 |
| F | **Marketing website** | Prospective clients | Desktop + phone | 1440 / 390 wide |

**App-store rule that affects design:** on iOS there must be **no prices, "Subscribe" buttons or links to the pricing page**. Plan selection and payment screens exist **on the web only**. The iOS app shows subscription **status** with plain text: "Manage your subscription at nightops.app".

---

## 2. Design foundations

### 2.1 Themes
- **Dark theme** is the default for Nightclub, Bar and Lounge (low light). **Light theme** is the default for Restaurant and for the web back-office. Users can switch either way.
- Define colours as **tokens with roles**, not raw colours:
  - Backgrounds: `bg/base`, `bg/raised`, `bg/overlay`
  - Text: `text/primary`, `text/secondary`, `text/disabled`
  - Accent: `accent/brand`
  - Status: `status/ok` (green), `status/warning` (amber), `status/danger` (red), `status/pending` (purple), `status/offline` (blue-grey), `status/info` (blue)
  - Money: `money/in`, `money/out`
- **Status is always colour + icon + text**, never colour alone.

### 2.2 Type, spacing, touch
- One clean sans-serif family with **tabular (fixed-width) numbers** for money and counts.
- Sizes: Display 32 / H1 24 / H2 20 / Body 16 / Small 14 / Caption 12. POS item names ≥ 16, totals ≥ 28.
- Spacing on a 4-pt grid. **Minimum touch target 48 px; POS buttons 64 px+.**
- Corner radius: 8 (inputs, chips) and 12–16 (cards, sheets).

### 2.3 Money, numbers, language
- Money always shows its currency: ₦145,000.00 · $86.50 · C$64.25 · £42.80.
- Owner screens have a **Local ⇄ Reporting currency** toggle (e.g. ₦ ⇄ $) showing "Rate: 1 USD = ₦X · 11 Oct".
- US/Canada show tax **on top of** prices. UK/Nigeria prices **include** tax.
- Drink volumes in the local unit: ml, US fl oz, or UK 25/35 ml measures.
- Allow **+40% text length** for French (Quebec) and other translations, and keep layouts **mirror-ready** for right-to-left languages later.
- Dates and times in the venue's time zone and local format.

### 2.4 Accessibility & motion
- WCAG 2.2 AA contrast in both themes. Every icon button has a label. Supports large/dynamic text.
- Motion is short (150–250 ms) and purposeful: sheet slide-up, success tick, approval arriving. Respect "reduce motion".

### 2.5 States every screen needs
**Loading (skeleton) · Empty (with a helpful action) · Error (with retry) · Offline / limited (see C-01) · No permission ("Ask a manager")**.

---

## 3. Core components (build once, reuse everywhere)

| ID | Component | Variants / notes |
|---|---|---|
| C-01 | **App header** with **connection chip** | Chip states: 🟢 Online · 🟠 "No internet – venue sync OK" · 🔴 "Offline – 14 sales queued". Also shows staff name, venue/area, shift timer |
| C-02 | **PIN pad** | 4–6 digits, shake on error, lockout after 3 tries, biometric button |
| C-03 | **Override (PIN) modal** | Title (e.g. "Void after send"), reason picker, approver PIN, Approve/Cancel. Used for every sensitive action |
| C-04 | **Status chip** | OK, Near limit, Frozen, Overdue, Pending approval, Paid, Disputed, Promise, Offline, Own item, Library |
| C-05 | **Money display** | Normal / large total / positive / negative, with currency |
| C-06 | **Credit meter** | Guest credit (limit vs used) and **staff credit meter** (outstanding vs personal cap). Green → amber at 80% → red |
| C-07 | **Item button** (POS) | Name, price, optional photo, badges: low stock · 86 (out) · popular · allergen dot |
| C-08 | **Category rail** | Vertical (tablet) / horizontal scroll (phone) |
| C-09 | **Cart line** | Qty stepper, modifiers, note, seat/course tag, sent/unsent state, swipe to void (→ C-03 if sent) |
| C-10 | **Tender chip** | Cash, Card, Transfer, Tab/Credit, Voucher, Comp (locked icon if not allowed) |
| C-11 | **Number keypad** | Quick-cash notes for the local currency |
| C-12 | **Denomination counter** | Rows per note/coin with +/−, running total (₦/$/C$/£ sets) |
| C-13 | **Approval card** | Who / what / amount / reason / context, Approve / Approve lower / Decline |
| C-14 | **KPI tile** | Value, change vs last period, sparkline, info tooltip |
| C-15 | **Chart cards** | Stacked bar (sales by category), line (trend), aging bar (0–7 / 8–14 / 15–30 / 30+) |
| C-16 | **Timeline** | Events with icons (sale, approval, message sent/read, payment, note) |
| C-17 | **Data table** | Sort, filter bar, column chooser, bulk-select, CSV export, sticky header |
| C-18 | **Bottom sheet / side panel** | Phone: bottom sheet. Tablet/desktop: side panel |
| C-19 | **Search with result states** | Result tags: ✓ On menu · In your catalog · Library · "Create '…' as your own item" |
| C-20 | **Price grid** | Spreadsheet-like rows × sell units, keyboard/keypad entry |
| C-21 | **Stepper / progress** | Onboarding steps, setup checklist |
| C-22 | **Banner** | Info, warning (past due), danger (frozen tab), mode-switch ("Night mode starts in 15 min") |
| C-23 | **Toast & notification card** | Success, error, actionable (Approve from notification) |
| C-24 | **Mode card** | Illustrated Restaurant / Nightclub / Bar / Lounge / Mixed |
| C-25 | **Plan card** | Web only: name, price, features, CTA |
| C-26 | **Table/zone tile** (floor plans) | Free, seated, ordered, course fired, bill requested, paid, reserved, min-spend progress ring |
| C-27 | **Countdown/timer chip** | Shisha coal refresh, approval escalation, quote hold, ticket age |
| C-28 | **Empty state** | Illustration + one-line help + primary action |
| C-29 | **WhatsApp bubble** | Venue message, quick-reply buttons, link preview, read ticks |
| C-30 | **Form section** | Title, help text, fields, inline validation, "More details" expander |

---

## 4. Navigation & roles

**NightOps app: home depends on the role (and the venue mode):**
- **Bartender / Server / Cashier / Door:** POS home for the venue mode → Orders · Tabs · My Credit Book · Notifications · More (shift, loss log, cash).
- **Manager:** Live dashboard · Approvals · Shifts · Stock · Tabs · Staff. They can jump into POS.
- **Owner / Credit Approver:** Home KPIs · Approvals · Debts · Staff credit · Reports · More. Venue switcher at the top for multi-venue businesses.

**Web app sidebar:** Dashboard · Sales & Reports · Menu · Inventory · Finance · Customers & Credit · Collections · Staff · Settings · Billing.

**Rule:** if a role can't do something, **hide it**. Where staff might expect it (e.g. Comp), **show it locked** and route it to C-03 or "Request approval".

---

## 5. Screens & features (by module)

### 5.1 Sign-up & onboarding: `ONB` (app + web)
| ID | Screen | Key features & interactions |
|---|---|---|
| ONB-01 | Welcome | 3-slide value carousel (Control cash · Control stock · Collect debts), Sign up, Log in. No pricing on iOS |
| ONB-02 | Sign up | Email or phone (+OTP), Google, Apple. Accept terms |
| ONB-03 | Verify code | 6-digit OTP, resend timer |
| ONB-04 | Log in | Email/phone + password or OTP → 2FA step for owners/admins. "Staff? Use the venue device" link |
| ONB-05 | Create business | Business name, country (🇳🇬 🇺🇸 🇨🇦 🇬🇧), state/province, reporting currency, language (EN/FR) |
| ONB-06 | Choose venue mode | C-24 cards. **Mixed** opens: split *by time* (e.g. Restaurant 12:00–19:59, Club 20:00–04:00) or *by area* (Ground = Restaurant, Rooftop = Lounge) |
| ONB-07 | Add venue | Address autocomplete (sets tax/region rules), opening hours, business-day cut-off (e.g. 6 am), time zone, areas |
| ONB-08 | Starter menu review | = MNU-01 |
| ONB-09 | Set prices | = MNU-02 |
| ONB-10 | Invite staff | Rows: name, phone/email, role, venue. Send via WhatsApp/SMS/email. Skip |
| ONB-11 | Credit & approvals wizard | Turn credit tabs on/off (on by default in Nigeria, optional elsewhere) → approvers + max amounts → escalation order + timeout → when staff accountability starts (at sale by default) → auto-approve rules → legal notice. "Recover from staff pay" appears **only where the region allows it** |
| ONB-12 | Connect guest payments | Cards: Paystack (NG) / Stripe (US, CA, UK). Connected ✓ state. Skip |
| ONB-13 | Pair devices | Big QR to scan from each device, list of paired devices, **"Make this the Hub"** toggle |
| ONB-14 | Choose plan / trial | **Web only**: plan cards (C-25), monthly/annual toggle, local currency, "Start 14-day free trial" |
| ONB-15 | Setup checklist | Card on home with progress ring: Menu priced · Staff invited · Payments · Devices · **Make a test sale** |
| ONB-16 | Staff invite accepted | Staff opens link → name, photo, create PIN, accept staff credit agreement (if credit is on) → done |

### 5.2 POS (staff): `POS` (tablet landscape first, then phone)
| ID | Screen | Key features & interactions |
|---|---|---|
| POS-01 | Device lock / staff picker | Staff avatars → C-02 PIN pad. Auto-locks after inactivity |
| POS-02 | Open shift | Station picker, **opening float** (C-12), any unresolved issue from last shift |
| POS-03 | Mode home | Replaced by RST-01 / CLB-01 / BAR-01 / LNG-01 depending on mode |
| POS-04 | **Order screen** (core) | C-01 header · C-08 category rail · search · Favourites/Recent · C-07 item grid · cart panel (C-09) with guest/tab/table name, subtotal, tax/service, total · actions: Send, Hold, Split, Pay, Attach guest, Discount 🔒, Comp 🔒 · "Repeat round" |
| POS-05 | Item options sheet | Size (shot/double/bottle; glass/bottle; pint/half), required/optional modifiers, notes, allergen info, qty |
| POS-06 | Attach guest / tab | Search by name/phone, recent guests, **New guest** (name, phone with country code, WhatsApp consent ☐, photo). Guest card: C-06 credit meter, owed, oldest debt age, status chip |
| POS-07 | **Credit charge confirm** | Plain statement: "You are responsible for collecting ₦45,000 from Tunde A. by 18 Oct." Staff credit meter, due date, PIN to confirm |
| POS-08 | Guest acknowledgement | Shows 4-digit code for the guest **or** "Waiting for guest to reply YES" with a live tick. "Skip (needs approver)" |
| POS-09 | Pending approval | Purple banner on the tab: "Pending approval · J. Okafor · 2:14". Escalation countdown, "Served at your risk" note, → Approved ✓ / Declined states |
| POS-10 | Frozen tab | Red banner "Credit limit reached / Overdue". Charge-to-tab disabled. **Request override** → approver |
| POS-11 | **Payment** | Amount due, C-10 tender chips, add several tenders (e.g. cash + tab), remaining balance, split by item/seat/amount/equal, **tip prompt** (US/CA: 15/18/20%/custom), service charge line |
| POS-12 | Cash | C-11 keypad with quick notes, change due |
| POS-13 | Bank transfer | QR + account number for this bill, copy button, "Waiting…" → "Paid ✓" auto-flip; "Unavailable offline" state |
| POS-14 | Card | Card reader status: Present card → Processing → Approved / Declined / Retry |
| POS-15 | Card-held tab (US/CA/UK) | Open tab by holding a card (name, last 4 digits), close at end of night, auto-close rule |
| POS-16 | Success & receipt | Big tick, change due, receipt: Print / WhatsApp / SMS / Email / None |
| POS-17 | Debt repayment | Pick guest → their open charges oldest first → take payment → which charges it cleared |
| POS-18 | Void / discount / comp | Choose lines → reason → C-03 approver PIN (if needed) → audit note |
| POS-19 | Quick loss log | Buttons: Spill · Breakage · Staff drink · Remake · Comp 🔒 → item, amount (ml/shots/units), reason, photo |
| POS-20 | Cash drop / paid-out / no-sale | Amount, category (ice, diesel…), receipt photo, approver PIN |
| POS-21 | Close shift (blind count) | Count cash by denomination **without seeing the expected amount**, card/transfer totals → "Submitted" (no variance shown to staff) |
| POS-22 | **My Credit Book** | Totals: Outstanding · Due this week · Overdue · Collected this month. List of my debts with aging chip, approval ✓, guest acknowledged ✓, last reminder (sent/read/replied) |
| POS-23 | My debt detail | C-16 timeline. Actions: **Send official pay link**, Log call/visit, Record cash received, Log promise date, Request transfer |
| POS-24 | Connection & sync | 3 states explained, queued items, last sync, conflict resolution |
| POS-25 | Notifications (staff) | "Approved", "Declined", "Your guest paid ₦45,000", "Promise to pay 20 Oct" |
| POS-26 | Out of stock (86) | Search item → toggle unavailable everywhere |

### 5.3 Mode screens
**🍽 Restaurant: `RST`**
| ID | Screen | Key features |
|---|---|---|
| RST-01 | Floor plan (home) | Area tabs, C-26 table tiles (status colour + covers + time seated), tap → seat / order / bill. Merge, transfer, split tables |
| RST-02 | Reservations | Day timeline + list, new booking (name, phone, party size, time, notes, deposit), confirm via WhatsApp/SMS |
| RST-03 | Waitlist | Party, quoted wait, "Table ready" message, seat |
| RST-04 | Table order | Seat selector (1…n), course chips (Starter/Main/Dessert), **Fire course** button, allergen alerts |
| RST-05 | Takeaway / collection | Name, phone, pickup time, status |

**🪩 Nightclub: `CLB`**
| ID | Screen | Key features |
|---|---|---|
| CLB-01 | Live night board (home) | **Capacity gauge** (in / out / max, alert near max), door revenue, bar sales, VIP table grid with min-spend rings, alerts |
| CLB-02 | Door & entry | Ticket QR scan, entry buttons (Regular · VIP · Guest list · Early bird), take cover charge, **ID check** (date of birth → age vs local legal age), banned-guest warning, in/out counter |
| CLB-03 | Guest lists | Lists by promoter, check-in, plus-ones |
| CLB-04 | VIP table bookings | Table map, booking form (deposit, minimum spend, host), status |
| CLB-05 | VIP table detail | Min-spend progress, live tab, add bottle, presentation request |
| CLB-06 | Bottle service builder | Choose package → pick bottle → mixers → sparkler → send presentation |
| CLB-07 | Presentation queue | Upcoming "parades": table, bottle, time, Done |
| CLB-08 | Promoter view (limited login) | My guest lists, entries, table spend, commission |
| CLB-09 | Events | Event list, lineup, ticket types, event P&L |
| CLB-10 | Incident log | Type, time, people, photo, staff, follow-up |
| CLB-11 | Coat check | Ticket number in/out |

**🍸 Bar: `BAR`**
| ID | Screen | Key features |
|---|---|---|
| BAR-01 | Fast tab grid (home) | Tab tiles (name, total, time open, card-held icon), quick-sale keypad, repeat round |
| BAR-02 | Happy hour | Banner + price rule (hidden where the region bans it) |
| BAR-03 | Kegs | Kegs on tap, estimated level, change keg |
| BAR-04 | Age-check prompt | Modal on first alcohol item: confirm ID / enter DOB |

**🛋 Lounge: `LNG`**
| ID | Screen | Key features |
|---|---|---|
| LNG-01 | Seating zones (home) | Zones with tables, long-tab totals, dwell time, upcoming reservations |
| LNG-02 | Shisha board | Active pipes: flavour, start time, **coal refresh countdown** (C-27), attendant. Refresh, new head, end. *Module off by default* |
| LNG-03 | Members & loyalty | Member lookup, tier, points, perks |

**🔀 Mixed: `MIX`**
- **MIX-01 Mode switch:** banner "Night mode starts in 15 min", schedule editor, area ↔ mode mapping

**Kitchen display: `KDS`**
- **KDS-01 Ticket board:** columns New → Cooking → Ready, station filter (grill, kitchen, bar), ticket timers (amber/red when late), **allergen flags**, Bump
- **KDS-02 Expo view:** whole-table view, all courses, "Call server"

### 5.4 Manager: `MGR` (phone + tablet)
| ID | Screen | Key features |
|---|---|---|
| MGR-01 | Live dashboard | Tonight vs same night last week, sales by category, covers/entries, staff leaderboard (sales, voids, comps), open-tab exposure, alerts strip |
| MGR-02 | Approvals inbox | Voids, discounts, comps, price overrides, no-sales, debt adjustments, credit (only if assigned approver). Filters |
| MGR-03 | Approval detail | C-13, the staff member's history of similar requests, approve with PIN / reject with reason |
| MGR-04 | Shifts to review | List with variance chips |
| MGR-05 | Shift reconciliation | Expected vs counted per tender, variance (green/amber/red), timeline of drawer events and flagged sales. Accept / Accept with note / Escalate |
| MGR-06 | Stock count | By location, scan/tap, **partial bottle slider (10% steps)** or weight entry, submit |
| MGR-07 | Receive delivery | PO lines, qty received, price changes, invoice photo |
| MGR-08 | Stock transfer | From/to location, items, qty |
| MGR-09 | Wastage review | Spills, breakages, comps by staff, approve/query |
| MGR-10 | Tabs & debts | Filter by staff / aging / status, guest detail, send reminder now |
| MGR-11 | Staff on shift | Clock in/out, devices, PIN reset |

### 5.5 Owner & Credit Approver: `OWN` (phone + web)
| ID | Screen | Key features |
|---|---|---|
| OWN-01 | Home KPIs | Period toggle (Today/Week/Month/Custom), **₦ ⇄ $ toggle**, venue switcher, C-14 tiles (Gross sales, Net, Gross margin %, Overheads, **Net profit**, Cash variance, Debtors), sales-by-category chart, alerts |
| OWN-02 | **Credit approval card** | Opens from the push notification. Guest (photo, tier, owed, payment record "paid 9 of 10, avg 6 days late"), sale lines, **responsible staff** (outstanding vs cap, collection rate), your limit ("You can approve up to $300"). Approve · Approve lower · Decline · Approve + set credit line · Send to Owner. Biometric confirm |
| OWN-03 | Approval queue | "6 pending · ₦310,000", batch-approve small ones |
| OWN-04 | Live P&L | Revenue → cost of goods → gross profit → expenses (staff, diesel, ice, breakages, rent…) → net. Tap any line to drill into transactions. Compare periods |
| OWN-05 | Debts overview | Total owed, aging bar (0–7 / 8–14 / 15–30 / 30+), top debtors, promises due, recovery rate, reminder-bot activity feed |
| OWN-06 | Guest (debtor) detail | Ledger, messages & calls timeline, promises, disputes, notes, credit line edit, freeze toggle |
| OWN-07 | Staff credit & accountability | Table per staff: sold on credit, outstanding, overdue, collection rate %, avg days to collect, cases |
| OWN-08 | Accountability case | Timeline → options: Extend · Transfer · Recover from staff (**region-gated**) · Write off · Keep chasing |
| OWN-09 | Staff exit settlement | Open debts of a leaving staff member: transfer / settle / write off each |
| OWN-10 | Loss & shrinkage | Expected vs actual stock use (ml and money), voids/comps by staff, cash shortages, **anomaly cards** ("Hennessy usage 18% above sales") |
| OWN-11 | Reports centre | Report list, schedule (daily/weekly/monthly via WhatsApp/email), export PDF/CSV |
| OWN-12 | Payouts & currency | Settlements by provider and currency, fees, pending, FX gain/loss |
| OWN-13 | Tips (US/CA/UK) | Tip pool, tip-out per staff, UK tips-law report |
| OWN-14 | Audit log | Filter by person/action/date, before → after |

### 5.6 Menu: `MNU` (web + tablet)
| ID | Screen | Key features |
|---|---|---|
| MNU-01 | Starter menu review | Items for your mode + country by category, keep/remove toggles, "Add more" search |
| MNU-02 | Set-prices grid | C-20: item rows × sell units (Shot/Double/Bottle…), unpriced items highlighted |
| MNU-03 | Menus & schedules | Main, Night, VIP, Happy Hour, Brunch: days/times, areas, devices |
| MNU-04 | Menu editor | Drag to reorder categories/items, price per menu, hide/show |
| MNU-05 | **Unified search** | C-19: library + own items with result states |
| MNU-06 | Library browser | Filters: type, mode, "popular in your country" · "Request an item" |
| MNU-07 | Quick-add sheet | Sizes pre-filled → prices → menus → station → Add |
| MNU-08 | **Create own item** (short) | Name, category (or new), price → Save |
| MNU-09 | Create own item (full) | Basics (photo, type, description) · Selling (units & prices, menus, station, tax) · Stock (pack size, pour, supplier, cost, par level) · Recipe · Allergens & dietary (must answer, "None" allowed) · Options · Availability · Barcode · ☐ Suggest to NightOps Library |
| MNU-10 | "Did you mean…?" | Similar library/catalog items with "Use this", or "No, create mine" |
| MNU-11 | Categories | Create, rename, colour, reorder |
| MNU-12 | Modifier groups | e.g. "Choose mixer": options, extra price, required/optional, stock effect |
| MNU-13 | Package builder | Bottle service: choose-one-from category + included items, price rule |
| MNU-14 | Recipe editor | Ingredient lines, qty/unit, **live cost & margin %** |
| MNU-15 | Library update | Before/after compare, Accept / Ignore |
| MNU-16 | Import | Upload Excel/CSV → auto-match to library → confirm / create own |
| MNU-17 | Bulk edit | Multi-select → change price %, category, station, tax, archive |

### 5.7 Inventory: `INV` (web, some on tablet)
INV-01 Stock list (on hand, par, value, status) · INV-02 Item detail + movement ledger (sales, comps, spills, deliveries, counts) · INV-03 Full stock take · INV-04 Variance report + approve adjustments · INV-05 Purchase orders (create, send to supplier) · INV-06 Suppliers · INV-07 Low-stock alert rules (threshold, who, channel, auto-draft PO) · INV-08 Locations (cellar, main bar, VIP bar, kitchen)

### 5.8 Finance: `FIN` (web)
FIN-01 Expenses (add with receipt photo; categories incl. diesel, ice, breakages, staff pay, repairs) · FIN-02 Recurring expenses · FIN-03 CapEx register + depreciation · FIN-04 **Payments to match** (unmatched transfers → pick guest/bill) · FIN-05 Payroll sheet (base, commission, tips, approved recoveries) · FIN-06 Tax summary (VAT/GST/HST/sales tax) · FIN-07 Accounting export (QuickBooks, Xero, Sage, CSV) · FIN-08 FX rates (auto + manual override, history)

### 5.9 Staff: `STF` (web + manager app)
STF-01 Staff list · STF-02 Staff profile (roles per venue, PIN reset, personal credit cap, signed agreement, performance) · STF-03 **Roles & permissions grid** (actions × roles, toggles, "approver up to amount") · STF-04 Timesheets / clock-ins

### 5.10 Customers, credit & collections: `CUS` / `COL` (web)
| ID | Screen | Key features |
|---|---|---|
| CUS-01 | Guests | Tier, owed, status, WhatsApp consent, last visit, filters |
| CUS-02 | Guest profile | = OWN-06 on the web, plus visit history and favourite items |
| CUS-03 | Credit policy | Default limits per tier, grace days, freeze rules, guest acknowledgement on/off, staff caps |
| COL-01 | **Reminder playbook builder** | Visual timeline (Day 0, +3, +7, +14, +21, +30): channel (WhatsApp/SMS/Voice), tone (Friendly/Firm/Final), send window, stop conditions. "Pause all reminders" switch |
| COL-02 | Message template editor | Variables ({name}, {amount_due}, {pay_link}, {days_overdue}…), **live C-29 WhatsApp preview**, language, WhatsApp approval status |
| COL-03 | Reminder activity | Sent / delivered / read / replied / paid, cost per message |
| COL-04 | Disputes | Guest-disputed items → review → adjust / reject with reason |
| COL-05 | Compliance settings | Quiet hours, max contacts per week, voice calls on/off (region rules shown), opt-out list |

### 5.11 Settings & billing: `SET` / `BIL` (web; status-only in iOS app)
SET-01 Business profile · SET-02 Venues & areas (mode per area/time) · SET-03 **Modules** (toggles: Reservations, Door & entry, Shisha, Promoters, Kegs, Card-held tabs, Credit tabs, Tips…) · SET-04 Taxes & service charge · SET-05 Receipt designer (logo, footer, legal text, preview) · SET-06 Credit & approvals (= ONB-11) · SET-07 Integrations (Paystack/Stripe, WhatsApp, SMS/voice, accounting, printers) · SET-08 Devices & Hub · SET-09 Language & currency · SET-10 Data export & delete business · SET-11 **My account** (profile, 2FA, sessions, **delete my account**, which the app stores require)

BIL-01 Subscription overview (plan, renewal, usage meters: venues, devices, messages) · BIL-02 Change plan · BIL-03 Invoices · BIL-04 Payment method · BIL-05 **Past-due banner → grace → read-only** states ("POS keeps working for 7 more days") · BIL-06 Cancel flow (reason → pause offer → export → confirm) · BIL-07 iOS/Android subscription status (text only, no links/prices on iOS)

### 5.12 Notifications: `NTF`
NTF-01 Notification centre (severity, unread, filters) · NTF-02 **Push designs**: credit approval *with Approve/Decline actions*, escalation, low stock, cash variance, large void, guest paid, Hub offline · NTF-03 Notification settings per type/channel

### 5.13 Guest-facing: `GST` (web, no login) + messages `MSG`
| ID | Screen | Key features |
|---|---|---|
| GST-01 | **Pay link** | Venue + guest name, amount due, itemised list, **currency selector** (local default; USD for foreign cards, with rate + "price held 30:00"), Pay full / Pay part / Bank transfer (copy) / Card |
| GST-02 | Paid ✓ | Receipt download, new balance |
| GST-03 | Pending | "Confirming your transfer…" |
| GST-04 | Failed | Reason, retry |
| GST-05 | Expired | Link or price-hold expired → refresh |
| GST-06 | Receipt | Logo, items, tenders, tax, balance |
| GST-07 | Statement | Charges and payments, aging |
| GST-08 | Dispute | Pick items → reason → submit |
| GST-09 | Promise to pay | Date picker → confirmation |
| GST-10 | Stop messages | Opt-out confirmation |
| MSG-01…08 | WhatsApp designs (C-29) | 01 Credit acknowledgement "Reply YES" · 02 Receipt · 03 Friendly reminder · 04 Reminder + bank details · 05 Firm notice · 06 Final notice · 07 Payment received · 08 Promise confirmed. Quick replies: Pay now · I've paid · Promise date · Dispute · Talk to a person · Stop. Every message names the venue and the staff member ("Served by Ada") and says "Only pay to the official link/account" |
| MSG-09 | SMS versions | Short text + link (US/CA default channel) |
| MSG-10 | Reservation messages | Confirmation, reminder, "table ready" |
| IVR-01 | Call flow diagram | Greeting → press 1 pay link / 2 promise date / 3 talk to someone / 9 stop calls |

### 5.14 Platform Admin (you): `ADM` (desktop)
ADM-01 Dashboard (MRR, trials, conversions, churn, by country) · ADM-02 Clients list (plan, country, venues, last active, **health score**) · ADM-03 Client detail (subscription, usage, devices, notes, support access *with client consent*) · ADM-04 Revenue & failed payments · ADM-05 **Library manager** (items, markets, modes, starter flags, recipes, allergens, images) · ADM-06 **Suggestions queue** (approve / merge / reject client items) · ADM-07 Country & region packs (status: Verified / Draft) · ADM-08 Message template library · ADM-09 App releases (minimum version, force update) · ADM-10 System health (sync backlog, webhook failures, delivery rates) · ADM-11 Announcements · ADM-12 Platform team & roles

### 5.15 Marketing website: `WEB`
WEB-01 Home (hero, the problem, product tour, testimonials, CTA) · WEB-02 Solutions pages ×4 (Restaurant, Nightclub, Bar, Lounge) · WEB-03 **Pricing** (currency switcher ₦/$/C$/£, plan cards, FAQ) · WEB-04 Book a demo · WEB-05 Help centre · WEB-06 Legal (Terms, Privacy, DPA, Subprocessors) · WEB-07 Sign-up start (→ ONB-02) · EN/FR switch

---

## 6. Clickable flows to prototype

| Flow | Path |
|---|---|
| **F1 Onboarding** | ONB-01 → 02 → 03 → 05 → 06 → 07 → MNU-01 → MNU-02 → ONB-10 → 11 → 12 → 13 → 14 (web) → 15 |
| **F2 Fast cash sale (bar)** | POS-01 → BAR-01 → POS-04 → POS-05 → POS-11 → POS-12 → POS-16 |
| **F3 Credit sale with approval** | POS-04 → POS-06 → POS-07 → POS-08 → POS-09 · *approver phone:* NTF-02 → OWN-02 Approve → *back on POS:* POS-09 "Approved ✓" |
| **F4 Frozen tab override** | POS-06 (frozen guest) → POS-10 → OWN-02 (one-time extra limit) → POS-11 |
| **F5 Split payment + tip** | POS-11 (cash + tab + tip) → POS-12 → POS-16 |
| **F6 Debt collected automatically** | MSG-03 → GST-01 → GST-02 → MSG-07 · POS-25 "Your guest paid" · OWN-05 updated |
| **F7 Void after send** | POS-04 swipe line → POS-18 → C-03 PIN → MGR-02 shows it in the log |
| **F8 Shift close** | POS-21 → MGR-04 → MGR-05 → Accept |
| **F9 Restaurant service** | RST-01 → seat table → RST-04 → Fire mains → KDS-01 → Bump → bill → POS-11 |
| **F10 Nightclub door & VIP** | CLB-02 (scan + ID check) → CLB-04 → CLB-05 → CLB-06 → CLB-07 |
| **F11 Add menu item** | MNU-05 search "Hennessy" → MNU-07 · search "Zobo Special" → MNU-08 → MNU-10 → Save |
| **F12 Internet drops** | POS-04 chip 🟢 → 🟠 → 🔴 → POS-24 → reconnect, queue syncs |
| **F13 Accountability case** | OWN-07 → OWN-08 → Transfer / Write off |
| **F14 Payment failed (subscription)** | BIL-05 banner → BIL-04 update card → banner clears |
| **F15 Mixed venue switch** | MIX-01 banner → home switches RST-01 → CLB-01 |

---

## 7. Sample data for mockups (fictional)

| | 🇳🇬 Nigeria | 🇺🇸 United States | 🇨🇦 Canada | 🇬🇧 United Kingdom |
|---|---|---|---|---|
| Venue | Skyline Lounge, Lagos (Lounge + Club at night) | Velvet Room, Atlanta (Nightclub) | Harbour Kitchen & Bar, Toronto (Restaurant) | The Copper Fox, Manchester (Bar) |
| Staff | Ada (bartender), Kemi (cashier), Tayo (manager) | Jordan (bartender), Maya (VIP host), Chris (manager) | Priya (server), Luc (chef), Sam (manager) | Ellie (bartender), Tom (bar manager) |
| Owner / approver | J. Okafor (owner), Tayo (approver ≤ ₦200,000) | D. Carter | A. Singh | R. Hughes |
| Guest | Tunde A. owes ₦145,000 (12 days, 8–14 bucket) | Marcus T., tab $186.40 | Sophie L., bill C$64.25 + tip | Liam K., tab £42.80 |
| Typical items | Hennessy VS bottle, Star Lager, Asun, Chapman, Small chops | Patrón Silver, Bud Light, Wings, Espresso Martini | Caesar, Molson Canadian, Poutine | Carling pint, Gin & Tonic, Fish & Chips |
| Tonight | ₦4.8M sales, 312 entries, 3 pending approvals | $21,480 sales, capacity 480/550 | 142 covers, avg C$58/cover | £6,940 sales |

Real item names for each mode and country: `catalog/starter-menus.md`.

---

## 8. Prompts to paste into the design tool (one per part)

**P1 Design system:** "Create a design system for 'NightOps', an operations app for restaurants, bars, lounges and nightclubs. Include dark and light themes with role-based colour tokens (background, text, brand accent, status OK/warning/danger/pending/offline/info, money in/out); a sans-serif type scale with tabular numbers; a 4-pt spacing grid; 48 px minimum touch targets and 64 px POS buttons. Components: app header with connection chip (Online / No internet – venue sync OK / Offline – N queued), PIN pad, approver-PIN override modal, status chips, money display with currency, credit meter, POS item button with low-stock/out-of-stock badges, category rail, cart line, tender chips, number keypad, cash denomination counter, approval card, KPI tile, charts (stacked bar, line, aging bar), timeline, data table, bottom sheet/side panel, search with result tags, price grid, stepper, banners, toasts, mode cards, plan card, table tiles with status, countdown chip, empty state, WhatsApp message bubble with quick replies, form sections."

**P2 POS tablet app:** "Using the NightOps design system, design a landscape tablet POS (1180×820, dark theme): staff PIN login, open shift with cash float counter, order screen (category rail, item grid, cart panel, header with connection chip), item options sheet, attach guest with credit meter, credit-charge confirmation ('You are responsible for collecting ₦45,000 from Tunde A. by 18 Oct'), guest acknowledgement code, pending-approval banner with countdown, frozen-tab banner, split-tender payment with tip prompt, cash keypad, bank-transfer QR, card reader status, success/receipt options, debt repayment, void with approver PIN, quick loss log, cash drop, blind-count shift close, 'My Credit Book' list and debt detail, sync status. Also phone versions of order and payment."

**P3 Venue-mode home screens:** "Design four NightOps home screens and their key sub-screens: Restaurant (light theme): table floor plan with status tiles, reservations, waitlist, order by seat and course with 'Fire course', kitchen display board. Nightclub: live night board with capacity gauge, door revenue, VIP tables with minimum-spend rings; door entry with ticket scan and ID age check; VIP booking; bottle-service builder; presentation queue; promoter view. Bar: fast tab grid with card-held tabs, happy-hour banner, keg levels, age-check prompt. Lounge: seating zones, shisha board with coal-refresh countdowns, members. Plus a mode picker with illustrated cards and a mixed-venue 'Night mode starts in 15 min' banner."

**P4 Manager & owner phone app:** "Design the NightOps phone app (390×844) for managers and owners: live dashboard, approvals inbox and detail with PIN, shift reconciliation (expected vs counted, variance colours), stock count with partial-bottle slider, owner home KPIs with period and ₦⇄$ currency toggles, a one-screen credit approval card (guest payment history, responsible staff's collection record, approver's limit; Approve / Approve lower / Decline / Send to Owner), approval queue, live P&L with drill-down, debts overview with aging buckets, guest debtor detail timeline, staff credit & accountability table and case screen, loss & shrinkage anomaly cards, push notification designs with Approve/Decline actions."

**P5 Web back-office:** "Design the NightOps web app (1440×900, light theme, left sidebar): menu setup (starter-menu review with toggles, spreadsheet-style price grid, unified search with tags 'On menu / In your catalog / Library / Create your own', create-own-item form with photo, category, sell units and prices, stock pack size, recipe with live margin, allergen checklist, 'Did you mean…?' sheet, modifier groups, package builder, import mapping), inventory (stock list, item ledger, stock take, purchase orders), finance (expenses with receipt photo, CapEx, payments to match, payroll, FX rates), staff and a roles-and-permissions grid, guests and credit policy, reminder playbook timeline builder with WhatsApp preview, settings (venues & areas, modules toggles, taxes, receipt designer, integrations, devices & hub, my account with delete account), billing (plan, usage, invoices, past-due and read-only states, cancel flow)."

**P6 Guest pages & messages:** "Design NightOps guest-facing mobile web pages (390×844, venue-branded, no login): pay link with itemised bill, currency selector and price-hold timer, pay full/part, bank transfer details with copy, card; paid, pending, failed and expired states; receipt; statement; dispute items; promise-to-pay date picker; stop messages. Also WhatsApp conversation designs: credit acknowledgement (Reply YES), receipt, friendly → firm → final reminders with quick replies (Pay now, I've paid, Promise date, Dispute, Talk to a person, Stop), payment received. Tone is polite and professional, never threatening."

**P7 Platform Admin & website:** "Design the NightOps Platform Admin console (desktop): dashboard with MRR, trials and churn by country; clients list with health score; client detail; library manager for menu items; suggestions queue (approve/merge/reject); country & region packs with Verified/Draft status; message template library; app releases; system health. And the marketing website: home page, four solution pages (Restaurant, Nightclub, Bar, Lounge), pricing page with ₦/$/C$/£ switcher, book a demo, help centre, EN/FR switch."

---

## 9. What to bring back for the backend

1. **The design file link** (Figma works best: share a view link and I can read the frames directly), or exported PNG/PDF of every screen plus the prototype link.
2. Frames **named with screen IDs** (e.g. `OWN-02 Credit approval card`).
3. Any **new screens, fields or buttons** you added that aren't in this brief, with a one-line note on what they do.
4. The **component library** and colour/type tokens (Figma variables or a token export).
5. Anything you **removed or merged**, and any open questions from the design process.

With that, the next step is the backend: data models, API endpoints for each screen ID, offline sync, payments (Paystack/Stripe), WhatsApp/SMS reminders, subscriptions, and the menu library seeded from `catalog/`.
