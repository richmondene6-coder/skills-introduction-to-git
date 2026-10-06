# SongGift: start here

Everything for your personalized Christmas song gift business, in one folder.

| File or folder | What it is |
|---|---|
| `MARKET-RESEARCH.md` | Why this niche, competitors and their revenue, the math to $200k |
| `app/LAUNCH.md` | Week-by-week launch plan from now to December 15 |
| `app/README.md` | How the app works, Paystack setup, and how to put it online |
| `app/.env.local` | Your settings file: put your keys here (it stays on your computer) |
| `app/` | The full app code |

## Payments: Paystack, in US dollars

- Customers pay **$29** (one song) or **$49** (two versions) in USD through Paystack.
- **Ask Paystack support to enable USD payments on your account.** Until they do, dollar checkouts are refused.
- Also make sure your Paystack account accepts **international cards**, so buyers abroad can pay.

## Run the app on your computer

1. Install Node.js (version 20 or newer) from https://nodejs.org.
2. Open a terminal in the `app` folder and run `npm install`, then `npm run dev`.
3. Open http://localhost:3000 and click through it. **No keys needed to try it**: it uses demo lyrics, skips payment and plays a short test jingle.
4. When you get each account, open `app/.env.local` in a text editor and fill in that key.
   - Mac: if you can't see the file, press Cmd+Shift+. in Finder.
   - Windows: in File Explorer, turn on View → Show → Hidden items.

## Keep your keys private

- Never paste API keys into chats, emails or code files.
- Keys go only in `.env.local` (your computer) or Vercel's Environment Variables (the live site).

The code is also on GitHub: `richmondene6-coder/skills-introduction-to-git`, branch `claude/app-ideas-revenue-goal-bcapir`, folder `songgift`.
