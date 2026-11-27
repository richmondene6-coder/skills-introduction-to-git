# CFO: Excel cleanup-and-report service, phase 1 (done-for-you)

Author: cfo agent. Date: 2026-11-27. Method: `founder-cfo` skill (`unit_economics.py`) plus a per-tier grid
computed from the same inputs. Inputs read: `company/strategy/idea-excel-cleanup-service.md`,
`company/strategy/board-excel-cleanup-service.md`, `company/research/excel-cleanup-service.md`.
Tool inputs saved next to this file: `numbers-t2-fiverr.json`, `numbers-t2-upwork.json`, `numbers-t2-fiverr-paidplan.json`.

Not financial, tax or legal advice. **Income tax, self-employment tax/national insurance, whether to register as
a business, and any VAT/sales-tax on marketplace income all need an accountant** before or shortly after the first payout.
All take-home figures below are **before tax**.

## CFO note (read this first)

- **Recommendation: launch Tier 2 (cleanup + pivot report + 2-3 charts + 5-line summary + reconciliation sheet).**
  It is the board's "report you can send your boss", it sits in the open spot the research found ($50-100, 24h,
  verified), and it reaches $1,000/month in about half the orders of Tier 1 for less total work.
- **Platform: Upwork first (Project Catalog listing, no Connects needed; proposals only inside the board's $10 cap),
  Fiverr gig as the free background channel, warm contacts in parallel.** Upwork nets $6 more per $60 order
  (10% vs 20% fee), and the board judged it the likelier first sale. The Upwork fee is variable (0-15%) and confirmed only per contract.
- **Prices: open at $35 for Tier 2 for the first 5 orders** (about half of the $60-75 band, still above the $25
  floor where ~50,000 Fiverr gigs compete), **then $60 after 5 reviews**, and test $75 after ~15 reviews once the job is timed.
  Keep Tier 1 at $30 and Tier 3 at $125 listed as packages, but sell Tier 2.
- **Cash needed before the first sale: $0** (Fiverr + Upwork catalog, existing Claude plan). Worst case $30
  ($10 Connects + $20 plan), which breaks the $20 budget, so do not do both before an order exists.
- **Margin:** fees, refunds and withdrawal costs take 15-27% of each order, so contribution is 73-85% (above the
  70% software line and 40% service line). **The real cost is the founder's time**: effective pay is $18-26/hour
  at full price, $10-13/hour at intro prices, and about $10-12/hour if jobs take 50% longer at 20% lower prices.
- **Biggest financial risk: time, not cash.** If each order takes longer than estimated (likely on the first jobs,
  and with Upwork proposal-writing on top) and prices get pushed down by the crowd, the hourly rate drops to
  around $10, below what the founder could earn elsewhere. **Time the first 3 sample files** before committing to these prices.
- **Board money conditions:** C4 ($0 until a paid order, Connects capped at $10) is met by the recommended plan.
  The $20 plan is only bought if the free tier cannot handle a real paid file.

## Inputs and assumptions

| Input | Value | Source / confidence |
| --- | --- | --- |
| Tier prices modelled (midpoints) | T1 $30, T2 $60, T3 $125 | Research ranges $25-35 / $50-75 / $100-150 (guess-level, conf. M/L) |
| Fiverr seller fee | 20% of order | Research, conf. H |
| Upwork seller fee | 10% | Research: variable 0-15% since May 2025, ~10% is a community estimate, conf. M |
| Refund / redo allowance | 5% of price | **Guess** (new seller, guarantee "totals reconcile or free redo/refund") |
| Withdrawal fees | $0.50 per order allocated | **Guess**; payout fees not verified. Check on each platform |
| AI model cost | $0 per order | Founder assumed to already have a Claude plan (flat fee, no per-token billing). No hosting, no software |
| Claude paid plan, if needed | $20/month | Brief and board: "~$20"; price not verified here |
| Upwork Connects | up to $10 total | Board cap (C4); per-Connect price not verified |
| Payment processing for buyer | $0 to seller | Fiverr charges the buyer 5.5% + small-order fee on top; it does not reduce seller net |

### Founder hours per order (estimates, must be timed on the 3 sample files)

| Task | T1 Basic | T2 Report | T3 Dashboard |
| --- | ---: | ---: | ---: |
| Buyer messages (scoping, questions, delivery note) | 0.25 | 0.30 | 0.50 |
| Run the AI agent, fix what it gets wrong | 0.50 | 0.50 | 0.50 |
| Pivot report + charts | - | 0.50 | 0.50 |
| One-page dashboard layout | - | - | 1.25 |
| Manual Excel check (row counts, totals tied to source, 10-row spot check) | 0.25 | 0.40 | 0.50 |
| Summary edit, file naming, delivery | 0.15 | 0.20 | 0.25 |
| Revision allowance (averaged over orders) | 0.10 | 0.35 | 0.50 |
| **Total** | **1.25 h** | **2.25 h** | **4.0 h** |

Not included: unpaid time to win orders (Upwork proposals, gig setup, samples). If each proposal takes 15 minutes
and 1 in 10 wins (guess), that adds ~2.5 hours per order won by bidding, which would halve the hourly rate on bid jobs.
Catalog and Fiverr orders do not carry this cost.

## Net per order and hourly rate

Net = price - platform fee - 5% refund allowance - $0.50 withdrawal.

| Tier | Platform | Price | Net per order | Hours | Effective $/hour | Fees+refunds as % of price |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| T1 Basic | Fiverr | $30 | $22.00 | 1.25 | $17.60 | 27% |
| T1 Basic | Upwork | $30 | $25.00 | 1.25 | $20.00 | 17% |
| T2 Report | Fiverr | $60 | $44.50 | 2.25 | $19.78 | 26% |
| T2 Report | Upwork | $60 | $50.50 | 2.25 | $22.44 | 16% |
| T3 Dashboard | Fiverr | $125 | $93.25 | 4.0 | $23.31 | 25% |
| T3 Dashboard | Upwork | $125 | $105.75 | 4.0 | $26.44 | 15% |

AI tool cost: $0 per order on an existing plan. With a new $20/month plan it is a fixed $20/month: it adds one
order to the monthly target for T1 and T2 Upwork, nothing for the others (see below), but **it uses the entire $20 budget**.

## Orders per month for take-home targets (before tax)

| Tier | Platform | For $500/mo | For $1,000/mo | Hours/mo at $1,000 | ($500 / $1,000 with $20 plan) |
| --- | --- | ---: | ---: | ---: | --- |
| T1 Basic | Fiverr | 23 | 46 | 58 | 24 / 47 |
| T1 Basic | Upwork | 20 | 40 | 50 | 21 / 41 |
| T2 Report | Fiverr | 12 | 23 | 52 | 12 / 23 |
| T2 Report | Upwork | 10 | 20 | 45 | 11 / 21 |
| T3 Dashboard | Fiverr | 6 | 11 | 44 | 6 / 11 |
| T3 Dashboard | Upwork | 5 | 10 | 40 | 5 / 10 |

Read: Tier 3 needs the fewest orders, but no new seller will sell many $125 dashboards without reviews. Tier 2 is the
realistic route: ~20-23 orders a month (about 1 a working day) for $1,000.

## Cash needed before the first sale

| Case | Cash out before first payout |
| --- | ---: |
| Fiverr gig + Upwork catalog + warm network, existing Claude plan (recommended) | **$0** |
| + Upwork proposals (board cap) | $10 |
| + Claude plan needed for a real customer file | $20 |
| Both | $30 (over the $20 budget) |

Payouts are not instant: marketplaces hold new-seller earnings for a clearance period (length unverified; check
each platform). If a paid plan is bought when the first order lands, the $20 comes out of pocket before the order's
money arrives. Hence: test the free tier on the 3 sample files now; buy the plan only for a confirmed paid order.

## Year 1 (tool output, Tier 2, $60, illustrative ramp)

Ramp (**guess**, orders/month): 1, 3, 5, 7, 9, 10, then 12 a month. Founder labour is not a cost in the tool; at 12 orders that is ~27 hours/month.

| Case | Contribution/order | Year 1 profit before tax | Cash needed |
| --- | ---: | ---: | ---: |
| Upwork, existing plan, $10 Connects | $50.50 (84%) | $5,393 | $10 |
| Fiverr, existing plan | $44.50 (74%) | $4,761 | $0 |
| Fiverr, new $20/mo plan | $44.50; margin at plan 71% | $4,521 | $20 (tool shows $0 because month-1 contribution covers it, but payout delay means it is out of pocket) |

Tool what-ifs (Fiverr base): price -10% -> $4,119; volume -20% -> $3,809; unit costs +15% -> $4,513.
The ramp is the line to watch: volume -20% costs more than any cost change. Month 1 in practice is at intro price.

## Sensitivity (requested)

| Tier / platform | Base $/h | Price -20%: net, $/h, orders for $500 / $1,000 | Jobs take 50% longer: $/h | Both | Intro half price: net, $/h, money forgone over 5 orders |
| --- | ---: | --- | ---: | ---: | --- |
| T1 Fiverr | 17.60 | $17.50, $14.00, 29 / 58 | 11.73 | 9.33 | $10.75, $8.60, $56 |
| T1 Upwork | 20.00 | $19.90, $15.92, 26 / 51 | 13.33 | 10.61 | $12.25, $9.80, $64 |
| T2 Fiverr | 19.78 | $35.50, $15.78, 15 / 29 | 13.19 | 10.52 | $22.00, $9.78, $113 |
| T2 Upwork | 22.44 | $40.30, $17.91, 13 / 25 | 14.96 | 11.94 | $25.00, $11.11, $128 |
| T3 Fiverr | 23.31 | $74.50, $18.62, 7 / 14 | 15.54 | 12.42 | $46.38, $11.59, $234 |
| T3 Upwork | 26.44 | $84.50, $21.12, 6 / 12 | 17.62 | 14.08 | $52.62, $13.16, $266 |

Recommended intro of $35 for Tier 2 (instead of exactly $30): net $25.75 on Fiverr / $29.25 on Upwork, $11.44 / $13.00
an hour, about $94 / $106 forgone over 5 orders versus $60. That is the real "cost" of buying 5 reviews, and it is cheap
compared with any ad spend.

## Three ways to improve the margin (from the grid, not guessed)

1. **Sell Upwork before Fiverr:** +$6.00 per $60 order (+$2.66/hour); 3 fewer orders a month for $1,000.
2. **Raise Tier 2 from $60 to $75 after ~15 reviews:** Upwork net $63.25 (+$12.75), $28.11/hour; $1,000 in 16 orders.
3. **Cut hours with a fixed template and checklist:** Tier 2 at 1.75 h instead of 2.25 h lifts Upwork to $28.86/hour at $60.
   The manual check stays; cut the revision and messaging time with a clear intake form instead.

## What the founder needs to decide

1. Accept Tier 2 as the launch package, Upwork catalog first, Fiverr as background.
2. Accept $35 intro (first 5 orders), then $60.
3. Whether to spend up to $10 on Connects (board cap), and only then if needed, the $20 plan once a paid order exists.
4. Book an accountant conversation about tax and self-employment registration before the first payout.

Next agent: **marketing-director** (gig and catalog copy around Tier 2 and the 3 samples, as drafts), then **ops**
(intake form, check routine, timing the samples so these hour estimates can be replaced with real ones).
