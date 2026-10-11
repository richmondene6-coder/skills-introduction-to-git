# NightOps — Menu & Product Library (v0.1)

How menus work in NightOps. Businesses start with a ready-made menu, **pick more items from the NightOps Library**, and **create their own items** whenever something isn't in the library.

Seed data lives in `catalog/` (see §10). Companion docs: `nightops-app-feature-spec.md` (screens), `nightops-saas-platform.md` (markets), `nightops-architecture.md` (build).

---

## 1. Four layers

```
NightOps Library (you curate it; shared by every business, no prices)
   │  "Add from library"                         "Create your own item"
   ▼                                                   ▼
Business Catalog  ← every item this business sells: library-linked items + its own custom items
   │  put items on one or more menus, with prices
   ▼
Menus (per venue): Main · Night · VIP · Happy Hour · Brunch … each with a schedule, areas and price overrides
   │
   ▼
POS buttons, kitchen tickets, stock deductions, reports
```

- **NightOps Library:** 280+ sellable items plus ingredients, tagged by market (NG/US/CA/GB) and venue mode. It holds names, categories, pack sizes, sell units, recipes and allergens. It **never holds prices**.
- **Business Catalog:** the business's own list. A library item added here becomes the business's copy, linked back to the library. A **custom item** is created by the business and works exactly the same everywhere in the app (POS, stock, recipes, reports).
- **Menus:** what staff see on the POS at a given time and place. One item can sit on several menus at different prices.

---

## 2. Starter menu (onboarding)

1. Owner picks **country** and **venue mode** (Restaurant / Nightclub / Bar / Lounge / Mixed).
2. NightOps shows the matching **starter menu**: 66–85 popular items for that mode and country, grouped by category. Mixed venues get the starter menu of each mode they use.
3. **Review screen:** every item has a toggle (keep/remove). Categories collapse. Search lets the owner add more from the library right here.
4. **Set prices screen:** a fast price grid, one row per item and one column per sell unit (shot / double / bottle, or glass / bottle). Number keypad, tab to the next cell, and "copy price to all venues". Items without a price are greyed out on the POS until priced.
5. Done. The menu is live and stock items are created automatically (with pack sizes from the country defaults).

Optional modules in a starter menu (e.g. **Shisha**) arrive **switched off** and need the owner to turn them on. The app reminds them to check local laws.

---

## 3. Adding an item: library first, own item second

**One search box:** "Search the NightOps Library or your items…"

| Result state | Shown as | Action |
|---|---|---|
| Already on this menu | ✓ On menu | Edit price |
| In this business's catalog but not on this menu | In your catalog | **Add to menu** |
| In the NightOps Library | Library badge | **Add** → quick sheet |
| Nothing matches | — | **"Create 'Zobo Special' as your own item"**, prefilled with the search text |

**Quick-add sheet (library item):** sizes and sell units already filled → enter price per unit → choose menu(s) → station (bar/kitchen/…) → **Add**. Three taps plus prices.

**Browsing:** library categories with filters (market, mode, type, "popular in your country"). A **"Request an item"** button lets a business ask you to add something to the library.

---

## 4. Creating your own item

A full-screen form, with a short version for speed ("Name + category + price → Save") and "More details" for the rest.

| Section | Fields |
|---|---|
| **Basics** | Name · Category (pick one or **create a new category**) · Type (Drink → spirit/beer/wine/cocktail/soft…; Food; Package; Service/Entry; Other) · Photo (camera/upload) · Description |
| **Selling** | Sell units and price for each (e.g. Shot $8 / Double $14 / Bottle $180, or Glass/Bottle, or a single price) · Menus it appears on · Station that receives the ticket · Tax category (alcohol, food, service, zero-rated…) |
| **Stock** | "Track stock?" · Pack type & size (e.g. 70 cl bottle, 600 ml bottle, keg 50 L, portion) · Pour sizes · Supplier & cost · Par level / low-stock alert |
| **Recipe** *(cocktails, food, packages)* | Ingredient lines picked from library items, catalog items **or new ingredients**, each with qty/unit → live **cost and margin %** |
| **Allergens & dietary** | Allergen checklist (UK's 14 + US major 9), with a required "None" option so the question is always answered (mandatory for food in the UK) · Vegetarian / vegan / halal / spicy tags. Recipe allergens roll up automatically. |
| **Options** | Variants (sizes) · Modifier groups (e.g. "Choose mixer", "Cooking temperature", "Add sauce" with extra prices and stock effects) |
| **Availability** | Areas (rooftop/main floor), times/days, modes (Mixed venues) · Barcode (scan to fill) |

**Guardrails:**
- **"Did you mean…?"** When the new name looks like a library or catalog item ("Henny VS" → *Hennessy VS*), the app offers the existing item first, to keep stock and reports clean.
- **Suggest to NightOps Library** (optional checkbox): sends only the name, category, type and pack size to your review queue, **never prices or recipes**.
- Custom items carry a small "Own item" tag in the back-office (not on the POS).

---

## 5. Editing & keeping in sync

- Businesses can change anything on their copy of a library item: display name, photo, description, sizes, pour, recipe, prices. Their changes always win.
- When you improve a library item (e.g. a corrected allergen or a new bottle size), businesses using it see **"Library update available"** with a before/after view and **Accept / Ignore**. Nothing changes without their OK. (Allergen corrections are highlighted as important.)
- Archiving an item hides it from menus but keeps it in history and reports. Items with sales are never deleted.
- Every price change is logged (who / when / old → new), and only roles allowed to edit prices can do it (default: Manager, Owner).

---

## 6. Menus, prices & availability

- **Multiple menus per venue:** e.g. *Day (Restaurant)*, *Night (Club)*, *VIP*, *Happy Hour*, *Sunday Brunch*. Each has days/times, areas and devices.
- **Price per menu:** the same Hennessy VS bottle can cost more on the VIP menu. Happy-hour pricing is blocked automatically where the region pack forbids alcohol discounts.
- **Out of stock (86):** one tap on any device marks an item unavailable everywhere instantly. Optional auto-86 when tracked stock hits zero. Low-stock badge on POS buttons.
- **Packages & combos:** e.g. *Cognac Bottle Package* = choose any bottle from "Cognac & Brandy" + 4 mixers + ice bucket. Price is fixed or "bottle price + X". Stock deducts each component.
- **Multi-venue businesses:** one shared catalog; prices, menus and availability per venue; "Copy menu to another venue".
- **Translations:** item names and descriptions in several languages (French needed in Quebec). The POS shows the staff language and receipts show the guest's.

---

## 7. Import & bulk tools

- **Excel/CSV import** with a downloadable template. Each row is **auto-matched to the library** ("Henny VS 75cl" → Hennessy VS, 750 ml). The owner confirms matches, and unmatched rows become custom items.
- **Bulk edit:** select many items → change category, station, tax or prices by % or fixed amount, or archive.
- **Export** the whole menu with prices (CSV/PDF) for printing or accountants.
- *Later:* photograph a paper menu and let AI read it into items for review. Import from another POS.

---

## 8. Library curation (your Platform Admin console)

- **Library manager:** add/edit items, set markets and modes, mark starter items, edit recipes and allergens, upload approved images.
- **Suggestions queue:** custom items businesses suggested, grouped by similar names and ranked by how many businesses created them. **Approve** (adds to library and offers those businesses a link-up), **Merge** into an existing item, or **Reject**.
- **Release updates:** publish library changes with notes. Businesses get the "update available" flow (§5).
- **Images:** use your own generic photography or brand-supplied assets with permission. Never copy images from the web.
- **Country rules check:** validation like `catalog/build_catalog.py` runs on every library change (markets, units, allergens, recipe availability).

---

## 9. Screens to design

Starter-menu review (toggles) · Set-prices grid · Menu list (multiple menus with schedules) · Menu editor (drag to reorder categories/items) · **Unified search** with the four result states · Library browser with filters · Quick-add sheet · **Create own item** (short form + full form with all sections) · "Did you mean…?" sheet · Category manager (create/rename/reorder/colour) · Modifier group editor · Package builder · Recipe editor with live cost/margin · Allergen checklist · 86 / out-of-stock toggle on POS · "Library update available" compare sheet · Import mapping screen (match / create) · Bulk edit · Platform Admin: library manager, suggestions queue.

**POS impact:** item buttons come from the active menu. Categories are tabs on the left rail. Custom and library items look the same to staff.

---

## 10. The starter library in this repo

| File | What it is |
|---|---|
| `catalog/library-items.csv` | Every library entry: id, name, category, type, brand, **markets**, **modes**, **starter_in** (modes where it's in the starter menu), pack, sell units, station, allergens, notes. Open it in Excel or Google Sheets. |
| `catalog/recipes.csv` | 29 recipes (cocktails, shots, mocktails) in ml/units, using "House" spirits that each business maps to its own brands |
| `catalog/country-defaults.json` | Per-market bottle/can/pint sizes, standard pours, wine glass sizes, drinking age, tax-inclusive pricing, legal notes |
| `catalog/build_catalog.py` | Checks the data (unknown markets, bad units, missing recipes, ingredients not sold in a market…) and generates the files below |
| `catalog/menu-templates.json` | Generated seed data: starter menu per mode × market, recipes with rolled-up allergens, market defaults |
| `catalog/starter-menus.md` | Generated, readable list of all 16 starter menus |

**Coverage:**

| Market | Restaurant | Nightclub | Bar | Lounge | Library items |
|---|---|---|---|---|---|
| 🇳🇬 Nigeria | 81 | 81 | 82 | 85 | 233 |
| 🇺🇸 United States | 66 | 77 | 77 | 67 | 209 |
| 🇨🇦 Canada | 69 | 75 | 80 | 67 | 211 |
| 🇬🇧 United Kingdom | 69 | 72 | 76 | 69 | 212 |

**To change the library:** edit the CSV files, run `python3 catalog/build_catalog.py`, and commit the regenerated files. The script refuses to build if something is inconsistent.

**Caveats to fix before launch:**
- Allergens are *typical* values. Each business must confirm them against its own recipes. The app makes them do so.
- Brand availability changes. Review the library with pilot venues in each market.
- Product images are not included yet.
