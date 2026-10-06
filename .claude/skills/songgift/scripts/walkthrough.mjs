// Clicks through SongGift like a customer and saves screenshots plus a video.
// Run through walkthrough.sh, which starts the app in demo mode.
import { execSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    return require(`${execSync("npm root -g").toString().trim()}/playwright`);
  }
}
const { chromium } = loadPlaywright();

const OUT = process.argv[2];
const APP = process.env.APP_URL || "http://localhost:3005";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "walkthrough-demo";
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium" });

// Desktop walkthrough, recorded as a video
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: OUT, size: { width: 1280, height: 800 } } });
const p = await ctx.newPage();
await p.goto(APP, { waitUntil: "networkidle" });
await p.screenshot({ path: `${OUT}/1-home.png` });
await pause(1500);
await p.mouse.wheel(0, 700);
await pause(1200);
await p.mouse.wheel(0, 700);
await pause(1200);
await p.mouse.wheel(0, -1400);
await pause(600);
await p.click("text=Write my song, free preview");
await p.waitForURL("**/create");
await pause(800);
await p.locator("#recipientName").pressSequentially("Grandma Rose", { delay: 40 });
await p.selectOption("#relationship", "grandparent");
await p.locator("#fromName").pressSequentially("Sam & the kids", { delay: 40 });
await p.fill("#memories", "She makes cinnamon rolls every Christmas morning and always burns the first batch, then blames the oven. She taught all the grandkids to play Jingle Bells on her old piano.");
await p.fill("#insideJokes", "We call her the Cinnamon Queen");
await p.fill("#thisYear", "Got a new puppy named Biscuit and finally learned to video call");
await p.check("input[name=style][value=crooner]");
await p.check("input[name=tone][value=mix]");
await p.fill("#email", "sam@example.com");
await p.screenshot({ path: `${OUT}/2-quiz.png`, fullPage: true });
await p.locator("button[type=submit]").scrollIntoViewIfNeeded();
await pause(800);
await p.click("button[type=submit]");
await p.waitForURL("**/song/**");
await p.waitForLoadState("networkidle");
await pause(1200);
await p.screenshot({ path: `${OUT}/3-lyric-preview.png`, fullPage: true });
const songUrl = p.url();
await p.mouse.wheel(0, 600);
await pause(1500);
await p.click("text=Have a promo code?");
await pause(800);
await p.click("text=Get Deluxe Gift");
await p.waitForURL("**/song/**");
await p.waitForSelector("audio", { timeout: 30000 });
await pause(1500);
await p.screenshot({ path: `${OUT}/4-song-ready.png`, fullPage: true });
await p.click("text=Print the gift card");
await p.waitForURL("**/card");
await p.waitForLoadState("networkidle");
await pause(1500);
await p.screenshot({ path: `${OUT}/5-gift-card.png`, fullPage: true });
await p.goto(`${APP}/admin`);
await p.fill("input[name=password]", ADMIN_PASSWORD);
await p.click("button");
await p.waitForURL("**/admin");
await pause(1500);
await p.screenshot({ path: `${OUT}/6-admin.png`, fullPage: true });
await ctx.close();

// Phone screenshots
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const m = await phone.newPage();
for (const [name, url] of [["7-phone-home", APP], ["8-phone-quiz", `${APP}/create`], ["9-phone-song", songUrl]]) {
  await m.goto(url, { waitUntil: "networkidle" });
  await m.screenshot({ path: `${OUT}/${name}.png` });
}
await phone.close();
await browser.close();
