# The Company: an all-online, one-person business run by AI agents

You are the CEO. 21 AI agents do the work. Each one is a Claude Code subagent defined in
[`.claude/agents/`](../.claude/agents/) and uses the founder skills in [`.claude/skills/`](../.claude/skills/).

**The business:** build and sell AI agents, and market digital products, all online.

## How to use the team

Open this repository in Claude Code and ask for an agent by name:

> Use the **board** agent to test this idea: an AI agent that writes weekly reports for small accounting firms.

> Ask the **cfo** agent whether $49/month covers model costs at 200 tasks per customer.

> Have the **ops-assistant** give me today's top 3 priorities.

Type `/agents` in Claude Code to see the whole team.

Agents save their work in this `company/` folder, so each one can build on the others' work.

## The one rule

**Agents draft, you approve.** No agent sends email, posts, publishes, spends money, changes a price or contacts a
customer without your explicit yes. It is written into every agent's instructions.

## The team (⭐ = launch team, hire first)

### Strategy & Finance

| | Agent | Call it with | What it does |
|---|---|---|---|
| ⭐ | Board / Idea Tester | `board` | Pressure-tests a new product, agent or business idea before anything is built |
| ⭐ | Market Researcher | `market-researcher` | Maps competitors, substitutes, prices and the gap a new product or agent can own, from public sources only |
| ⭐ | CFO | `cfo` | Builds unit economics, pricing and cash plans, including AI model and API cost per customer |
|  | Bookkeeper | `bookkeeper` | Categorises income and expenses, reconciles accounts, tracks subscriptions and prepares monthly numbers for an accountant |
|  | Business Planner | `plan-compiler` | Compiles everything the other agents produced into one business plan with a computed profitability verdict |

### Product

| | Agent | Call it with | What it does |
|---|---|---|---|
| ⭐ | Product Manager | `product-manager` | Turns customer problems into agent and product specs, writes acceptance criteria and keeps the roadmap |
| ⭐ | Agent Builder (Engineer) | `agent-builder` | Builds the AI agents and products the company sells: prompts, tools, MCP servers, integrations and code |
|  | QA / Evals Tester | `qa-tester` | Tests agents before release: writes evals, checks accuracy, edge cases, safety and regressions |
|  | DevOps & Security | `devops-security` | Handles hosting, deployment, uptime, monitoring, API-key safety and security reviews |
|  | Technical Writer | `technical-writer` | Writes docs, setup guides, FAQs and demo scripts for each agent and product |

### Marketing

| | Agent | Call it with | What it does |
|---|---|---|---|
| ⭐ | Marketing Director | `marketing-director` | Owns positioning, channel strategy, campaign calendar and budget. Coordinates the other marketing agents |
|  | Content Writer | `content-writer` | Drafts blog posts, social posts, landing pages, case studies and product descriptions |
|  | SEO & Growth | `seo-growth` | Keyword research, SEO audits, content gaps, marketplace listings and lead-generation experiments |
|  | Email & Funnel | `email-funnel` | Designs and writes email sequences and sales funnels: lead magnets, nurture, onboarding, trial-to-paid, win-back |
|  | Brand Designer | `brand-designer` | Names products, writes brand voice and taglines, and briefs logos, visuals and ad creatives |
|  | Video & Social | `video-social` | Plans and scripts short-form video, faceless YouTube content and social calendars |

### Sales & Customers

| | Agent | Call it with | What it does |
|---|---|---|---|
|  | Sales & Outreach | `sales-outreach` | Qualifies leads, writes personalised outreach and follow-ups, prepares demo notes and proposals |
|  | Customer Support | `customer-support` | Drafts answers to customer questions, triages tickets, maintains the FAQ and escalates problems |
|  | Customer Success | `customer-success` | Runs onboarding, check-ins, feedback collection and churn prevention for paying customers |

### Operations

| | Agent | Call it with | What it does |
|---|---|---|---|
| ⭐ | Ops & Admin Assistant | `ops-assistant` | Runs the business day to day: task board, inbox triage, calendar, SOPs, suppliers and tools |
|  | Analyst | `analyst` | Builds the weekly dashboard of revenue, funnel, agent usage and marketing results and explains what to change |

### Not agents: get a human
- **Lawyer (once):** terms of service, privacy policy, trademark, and liability for what your agents do.
- **Accountant:** signs off on tax. The bookkeeper prepares, the accountant files.
- **Payment provider:** Stripe, Lemon Squeezy or Gumroad. These are tools, not agents.

## Standard workflows

### 1. New product or agent idea
`board` → `market-researcher` → `founder-consumer` skill (buyer panel) → `cfo` (pricing + margins) → `plan-compiler`.
Build only if the verdict is **Profitable**, or **Not yet** with a fix you can make.

### 2. Build and ship an agent
`product-manager` (spec) → `agent-builder` (build, tests first) → `qa-tester` (evals) →
`devops-security` (deploy checklist) → `technical-writer` (docs).

### 3. Launch and market it
`brand-designer` → `marketing-director` (positioning, campaign, launch plan) →
`content-writer` + `seo-growth` + `email-funnel` + `video-social` → you approve and publish.

### 4. Sell and keep customers
`sales-outreach` → you close → `customer-success` (onboarding) → `customer-support` (tickets) →
`product-manager` (feedback becomes roadmap).

### 5. Run the business every week
Monday: `ops-assistant` plans the week. Friday: `analyst` reports what worked. Month end: `bookkeeper` closes the books.

## Hiring order
1. **Week 1:** board, market-researcher, cfo. Pick one agent to build for one niche.
2. **Weeks 2–4:** product-manager, agent-builder, marketing-director, ops-assistant. Build and launch.
3. **After first sale:** qa-tester, customer-support, content-writer, email-funnel.
4. **At steady revenue:** everyone else.

## Folder map
```
company/
  strategy/   board verdicts
  research/   competitors and markets
  finance/    unit economics, pricing, ledger
  product/    specs, roadmap, QA reports
  marketing/  campaigns, content, funnel, experiments
  brand/      name, voice, visuals
  sales/      leads and proposals
  support/    tickets and FAQ
  ops/        SOPs and tools
  reports/    weekly dashboards
  plan/       the business plan
products/     the agents and products you sell, one folder each
```
