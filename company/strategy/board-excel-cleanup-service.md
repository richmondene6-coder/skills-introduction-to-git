# Board verdict: Excel cleanup-and-report service (phase 1) and self-serve agent (phase 2)

Written 2026-11-27 by the board agent. Input: `company/strategy/idea-excel-cleanup-service.md`, `youtube/channel.md`.
The lenses below are summaries of published frameworks (Offers: *$100M Offers*; Monopoly: *Zero to One*;
Product: Isaacson's *Steve Jobs*). They are not the views of those authors.

Process note: the founder-board skill calls for three separate sub-agents. None could be launched from this
session, so the board agent applied each lens in turn and kept them apart. Everything is in this one file
(not in `founder/`), as requested.

## The idea in one sentence
Office workers and small-business staff with a messy spreadsheet pay a one-off fee (price not yet set; the
market-researcher is checking) to get back a cleaned file, a report and a plain-English summary within 24 hours.
Later (phase 2), the most-requested job becomes a $19-29 do-it-yourself agent they run in their own Claude or ChatGPT account.

## Vote

| Lens | Score | Vote |
|---|---|---|
| Offers | 5/10 | FUND IF |
| Monopoly | 3/10 | PASS |
| Product | 5/10 | FUND IF |
| **Board** | **avg 4.3/10** | **2 fund if, 1 pass: FUND WITH CONDITIONS, phase 1 only** |

- **Phase 1 (done-for-you service): fund with conditions.** It is a cheap, fast, reversible test that uses the
  founder's Excel skills and needs no code. It is a test that buys cash and customer data, not a durable business.
- **Phase 2 (the $19-29 self-serve agent): not funded yet.** Re-pitch once phase 1 has evidence (see conditions).
  As described today it is the weakest part of the plan.

---

## Offers lens. Score 5 | FUND IF
### What is strong
- The buyer already wants this exact outcome and posts it as a job ("clean this file", "make a report").
  You don't have to teach anyone that they need it.
- Value equation: time (24 h) and effort (upload one file) both score well. The outcome (a finished report
  plus a summary they can send to their boss) is worth more to the buyer than "cleaned data".
### What would kill it
1. **Likelihood is close to zero on day 1.** A new seller has no reviews, no portfolio and no proof, and
   buyers choose on reviews. Without before-and-after samples, nobody believes it will work.
2. **Commodity pricing.** If the only pitch is "Excel cleanup", it competes with many low-priced sellers
   (the size of that crowd is unverified; the market-researcher is checking). Being cheaper is a race to the bottom.
3. **Weak market on two of the four tests.** The pain is real but small per job. Marketplace buyers often
   have small budgets. Buyers are easy to reach, but free AI tools are taking over the simple jobs.
### Questions for the founder
Which one job will you be known for? What guarantee can you afford (for example "totals reconcile to your
source file, or a free redo or full refund")? Would anyone pay twice the floor price for the summary and the 24-hour turnaround?
### Conditions
- One specific outcome in the gig title, not "any spreadsheet".
- Three before-and-after samples built from made-up or public data before the gig goes live.
- A guarantee tied to a check the founder can actually run: row counts and column totals match the source.

## Monopoly lens. Score 3 | PASS
### What is strong
- Distribution exists on day 1: the marketplaces already bring buyers, which is rare for a $20 start.
- A small market could be owned later if the founder narrows hard (for example one export type for one kind of buyer).
### What would kill it
1. **No secret, no moat.** Thousands of people can run the same prompt. There is no proprietary
   know-how, no network effect, no scale advantage and no brand yet.
2. **Platforms are shipping this for free.** Excel's own AI assistant and the chat apps' data-analysis
   features target exactly this job. Each release eats the simple end of the market. (Specific product
   features change fast; verify what is live today before relying on this.)
3. **Distribution belongs to someone else.** The marketplace algorithm decides who gets seen, takes a cut
   and forbids taking buyers off-platform. The YouTube channel is not live and won't help within 30 days.
### Questions for the founder
What small market can you own first? What will you know after 50 jobs that a copycat doesn't? What stops a
copycat in month six? (For the service: your reviews and your review step. For the prompt product: nothing.)
### Why pass and not fund-if
As a company, this has no route to durability today. The lens would accept phase 1 only as paid market
research: the goal is to find the niche worth owning.

## Product lens. Score 5 | FUND IF
### What is strong
- The moment of use is clear and good: drop in a file, and the next day a clean file, a report and three
  sentences you could paste into an email arrive.
- The plain-English summary is the part of the product the buyer will remember. Keep it.
### What would kill it
1. **No focus.** "Sales export, timesheet, inventory, bank download" is four products. Each has different
   failure modes, and none gets polished. Cut to one.
2. **Seams where errors slip through.** Customer -> marketplace -> founder -> AI chat -> founder -> customer.
   A single silent error (dates flipped between day-first and month-first, dropped rows, a wrong total)
   reaching a buyer means a 1-star review that ends a new seller.
3. **The first five minutes are scary for the buyer.** They have to upload company data to a stranger who
   uses AI. If you don't say clearly how the data is handled, careful buyers leave.
### Questions for the founder
What is the one job? What does the delivery look like, down to the file name and the summary layout? Where
exactly do you check the AI's work, and how?
### Conditions
- One job, one template, one delivery format.
- A written check run before every delivery: row count before and after, key totals tied to the source,
  and a sample of 10 rows checked by eye. The founder does it in Excel, not the AI.
- A short data-handling statement in the gig (what tool is used, deleted after delivery, no files with
  sensitive personal data). Its legal wording needs a professional; see risks.

---

## Agent-business check
- **Reliable enough to charge for?** Phase 1: yes, but only because a human (the founder, who knows Excel) checks every
  file. A language model working through a chat window can drop rows, misread dates or invent totals.
  Phase 2: much weaker. The buyer runs it with nobody checking, on files we never see, in a model and
  account tier we don't control. Expect support requests and refunds.
- **When the model or app changes:** phase 1 runs through a consumer chat app, so file-handling limits,
  plan pricing or behaviour can change without notice. Keep 3-5 test files with known correct answers and
  re-run them weekly and after any app update. Phase 2 breaks for every buyer at once, across two
  vendors (Claude and ChatGPT), with no version pinning.
- **Could a big platform ship it free?** Phase 2: yes, and they largely are. Phase 1 holds up better,
  because the buyer is paying to not do it themselves and for someone to stand behind the result.
- **Hidden cost against the $20:** if the free tier of the chat app can't handle real customer files, a
  paid plan may use up the whole budget (plan prices unverified; the market-researcher or cfo should
  confirm). Marketplace fees and payout holding periods also delay when cash arrives (unverified).

## Can it get a first paid sale in 30 days on $20 with no coding?
**Possible, not likely from Fiverr alone.** (A guess with stated reasons, not a measured rate.)
- No coding is needed. The hard part is getting the first order, not delivering it.
- A new Fiverr gig with no reviews often gets little visibility for weeks. That alone makes 30 days a coin flip at best.
- Upwork is better for a first sale because buyers post the exact job and you answer it. Sending proposals
  costs paid "Connects", so it uses part of the $20 (cost unverified).
- The fastest first sale is usually warm: office-worker contacts the founder already knows. Any outreach
  needs the founder's own decision and wording; this board drafts nothing and sends nothing.
- Recommended split: Fiverr gig (free) + a capped Upwork spend + a warm-network offer, all for the same
  single job. Spend $0 on the AI chat plan until a paid order is actually in hand.

## Top risks (raised by more than one lens first)
1. **No proof and a crowded, low-price marketplace (Offers + Monopoly + Product).** Leads to no orders in 30 days.
2. **An AI error reaches a customer (Product + agent check).** One bad review can end a new gig.
3. **Customer data confidentiality (Product + brief).** Uploading client files to a third-party AI raises privacy and contract
   questions (for example data-protection law, and whether the buyer is even allowed to share the file).
   **Not legal advice. Get a professional to review the data statement and terms before taking files
   that contain personal data.**
4. **Phase 2 is copyable and being shipped free by the platforms (Monopoly + agent check).**
5. **Budget squeeze:** a paid AI plan plus Connects could exceed $20 before the first sale.

## Conditions (checklist for the rest of the team)
- [ ] **C1. One job, one buyer.** Pick a single repeatable job (e.g. "turn your CRM/sales export into a
      monthly sales report with summary" or "dedupe and standardise a contact list for import"). Choose
      using the market-researcher's demand and price data. Gig title names the outcome.
- [ ] **C2. Proof before launch.** 3 before-and-after samples from made-up or public data, plus a written
      pre-delivery check (row counts, totals tied to source, 10-row spot check) done by the founder in Excel.
- [ ] **C3. Data rule.** No files with sensitive personal data (health, ID numbers, full bank details) at
      launch. A plain data-handling statement in the gig, reviewed by a professional before it carries any legal promise.
- [ ] **C4. Money rule.** $0 spent until a paid order exists, except a capped Upwork Connects test (founder
      sets the cap, max $10). Founder approves every spend.
- [ ] **C5. Kill or pivot dates.** Day 14: if the gig has almost no impressions and no buyer messages,
      change the title, niche or channel. Day 30: no paid order across all three channels means drop this
      framing and re-pitch one of the alternatives, or go narrower.
- [ ] **C6. Phase 2 gate.** Don't build the self-serve agent until there are about 10 paid orders,
      the same job requested at least 5 times, and 3 buyers saying they would do it themselves for $19-29.
      Re-pitch to the board then. Consider a monthly done-for-you report (recurring revenue) as the phase 2
      alternative, because the human check is the part platforms can't copy cheaply.

## Numbers the board needs (market-researcher and cfo)
- Fiverr: number of competing gigs and the price range for the chosen job, and what the top sellers charge for a report with summary.
- Upwork: how many matching jobs are posted per week, typical budgets, Connects per proposal and cost per Connect.
- Marketplace fees and payout holding periods for new sellers.
- Whether the free tier of Claude or ChatGPT can handle a typical customer file (size, number of uploads), and the paid-plan price.
- Founder hours per order (guess: 1-2 h including the check; must be timed on the sample files) -> effective hourly rate after fees.
- Phase 2: Gumroad fees, and whether comparable spreadsheet prompt packs or agents actually sell, and at what price.

## The strongest version the board can see
Not "Excel cleanup", which is a commodity. Instead: **"Your messy [one export type] turned into a report you can
send your boss, checked by an Excel person, in 24 hours."** Sold first to warm contacts and on Upwork, with
Fiverr as a slow background channel. Each delivery doubles as a case study for the YouTube series "Spreadsheet to report".
If a repeat job appears, the next step is a monthly recurring report for the same buyer, not a $19 prompt pack. This
differs from the pitch: the board would replace phase 2 unless the phase 2 gate in C6 is met.

## Next
The founder decides: accept the conditions, and pick the single job (after the market-researcher's data).
Next agent: **market-researcher** (finish prices and demand for the candidate jobs), then **cfo** (fees, hours per order,
and whether the $20 holds), then **marketing-director** for the gig copy and samples, as drafts for founder approval.
