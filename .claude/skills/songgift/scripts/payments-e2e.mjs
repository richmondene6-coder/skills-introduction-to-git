// End-to-end payment tests against a running SongGift dev server wired to mock-paystack.mjs.
// Run through test-payments.sh, which starts both servers with the right settings.
import { createHmac } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const APP = process.env.APP_URL || "http://localhost:3005";
const MOCK = process.env.MOCK_URL || "http://localhost:4010";
const SECRET = process.env.MOCK_PAYSTACK_SECRET || "sk_test_mock";
const DATA = process.env.DATA_DIR || path.resolve(here, "../../../../songgift/.data/orders");

// Seed unpaid orders
const base = {
  createdAt: new Date().toISOString(),
  status: "preview",
  quiz: { recipientName: "Grandma Rose", relationship: "grandparent", fromName: "Sam", occasion: "Christmas", memories: "Burns the first batch of cinnamon rolls", insideJokes: "", thisYear: "", style: "crooner", tone: "mix", email: "buyer@example.com" },
  lyrics: { title: "Cinnamon Christmas", sections: [{ name: "Verse 1", lines: ["a", "b"] }, { name: "Chorus", lines: ["c"] }, { name: "Verse 2", lines: ["d"] }] },
  versions: [],
};
const ids = ["callbackone", "webhookone", "failedpay1", "underpaid1", "forgedpay1", "freeorder1", "freeorder2", "merrytwenty", "concurrent1", "concurrent2", "concurrent3"];
mkdirSync(DATA, { recursive: true });
for (const id of ids) writeFileSync(`${DATA}/${id}.json`, JSON.stringify({ ...base, id }));

const order = (id) => JSON.parse(readFileSync(`${DATA}/${id}.json`, "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let pass = 0;
let fail = 0;
const check = (name, ok, extra = "") => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? `  (${extra})` : ""}`);
};
const checkout = (orderId, tier, promoCode) =>
  fetch(`${APP}/api/checkout`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderId, tier, promoCode }) }).then(async (r) => ({ status: r.status, ...(await r.json()) }));
const callback = (ref) => fetch(`${APP}/api/paystack/callback?trxref=${ref}&reference=${ref}`, { redirect: "manual" });
const webhook = (body, sig) => {
  const raw = JSON.stringify(body);
  return fetch(`${APP}/api/webhooks/paystack`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-paystack-signature": sig ?? createHmac("sha512", SECRET).update(raw).digest("hex") },
    body: raw,
  });
};
const inits = async () => (await fetch(`${MOCK}/__inits`)).json();
const lastInit = async () => (await inits()).at(-1);
const setTx = (ref, patch) => fetch(`${MOCK}/__set/${ref}`, { method: "POST", body: JSON.stringify(patch) });
const waitStatus = async (id, want, ms = 30000) => {
  const start = Date.now();
  while (Date.now() - start < ms) {
    if (order(id).status === want) return true;
    await sleep(500);
  }
  return false;
};

// 1. Normal purchase: checkout -> Paystack -> buyer comes back (and the webhook also arrives)
let r = await checkout("callbackone", "deluxe");
let init = await lastInit();
check("checkout returns Paystack payment URL", r.url?.startsWith("https://checkout.paystack.test/sg-callbackone-"), r.url ?? r.error);
check("charges deluxe price in USD minor units", init?.amount === 4900 && init?.currency === "USD", `${init?.amount} ${init?.currency}`);
check("reference uses only allowed characters", /^[A-Za-z0-9.=-]+$/.test(init?.reference ?? ""), init?.reference);
check("callback URL points back to the app", init?.callback_url === `${APP}/api/paystack/callback`, init?.callback_url);
check("buyer email sent to Paystack", init?.email === "buyer@example.com");
const ref1 = init.reference;
let res = await callback(ref1);
check("callback redirects to song page with paid=1", res.status === 303 && res.headers.get("location")?.endsWith("/song/callbackone?paid=1"), `${res.status} ${res.headers.get("location")}`);
res = await webhook({ event: "charge.success", data: { reference: ref1 } });
check("duplicate webhook accepted (200)", res.status === 200);
check("order becomes ready", await waitStatus("callbackone", "ready"));
let o = order("callbackone");
check("payment recorded on order", o.amountPaid === 4900 && o.currency === "USD" && o.paymentReference === ref1 && o.tier === "deluxe");
check("two song versions produced", o.versions.length === 2 && o.versions.every((v) => v.audioUrl));

// 2. Buyer closes the tab: only the webhook arrives
await checkout("webhookone", "standard");
const ref2 = (await lastInit()).reference;
res = await webhook({ event: "charge.success", data: { reference: ref2 } }, "bad-signature");
check("webhook with bad signature rejected (401)", res.status === 401);
check("order still unpaid after forged webhook", order("webhookone").status === "preview");
res = await webhook({ event: "charge.success", data: { reference: ref2 } });
check("signed webhook accepted", res.status === 200);
check("webhook-only order becomes ready", await waitStatus("webhookone", "ready"));
res = await webhook({ event: "transfer.success", data: { reference: "x" } });
check("unrelated webhook events ignored with 200", res.status === 200);

// 3. Payment abandoned
await checkout("failedpay1", "standard");
const ref3 = (await lastInit()).reference;
await setTx(ref3, { status: "abandoned" });
res = await callback(ref3);
check("failed payment redirects with payment=failed", res.headers.get("location")?.endsWith("/song/failedpay1?payment=failed"), res.headers.get("location"));
check("failed payment leaves order unpaid", order("failedpay1").status === "preview");

// 4. Underpaid / wrong currency
await checkout("underpaid1", "deluxe");
const ref4 = (await lastInit()).reference;
await setTx(ref4, { amount: 100 });
await callback(ref4);
await webhook({ event: "charge.success", data: { reference: ref4 } });
check("underpaid transaction rejected", order("underpaid1").status === "preview");
await checkout("underpaid1", "standard");
const ref4b = (await lastInit()).reference;
await setTx(ref4b, { currency: "NGN" });
await callback(ref4b);
check("wrong-currency transaction rejected", order("underpaid1").status === "preview");

// 5. A real Paystack transaction this server never started (e.g. made with the public key)
const forged = "sg-forgedpay1-zzzzzzzz";
await fetch(`${MOCK}/__create`, { method: "POST", body: JSON.stringify({ reference: forged, amount: 4900, currency: "USD", status: "success", metadata: { orderId: "forgedpay1", tier: "deluxe" } }) });
await webhook({ event: "charge.success", data: { reference: forged } });
res = await callback(forged);
check("transaction not started by this server rejected", order("forgedpay1").status === "preview" && res.headers.get("location")?.includes("payment=failed"));
res = await callback("not-a-real-ref");
check("garbage reference redirects home", res.status === 303 && new URL(res.headers.get("location")).pathname === "/");

// 6. Promo codes (server runs with PROMO_CODES=FAMILY:100:1,MERRY20:20)
r = await checkout("freeorder1", "deluxe", "nope");
check("invalid promo code rejected", r.status === 400 && /isn't valid/.test(r.error ?? ""), r.error);
const before = (await inits()).length;
r = await checkout("freeorder1", "deluxe", "family");
check("100% code skips Paystack, goes to song", r.url === "/song/freeorder1" && (await inits()).length === before, r.url ?? r.error);
check("free order produced", await waitStatus("freeorder1", "ready"));
o = order("freeorder1");
check("free order recorded with code and 0 paid", o.amountPaid === 0 && o.promoCode === "FAMILY");
r = await checkout("freeorder2", "standard", "FAMILY");
check("code with max 1 use refused second time", r.status === 400 && /fully used/.test(r.error ?? ""), r.error);
await checkout("merrytwenty", "deluxe", "Merry20");
init = await lastInit();
check("20% code discounts Paystack amount", init.amount === 3920, String(init.amount));
await callback(init.reference);
check("discounted order settles", await waitStatus("merrytwenty", "ready"));
check("discounted order records promo", order("merrytwenty").promoCode === "MERRY20" && order("merrytwenty").amountPaid === 3920);

// 7. Checkout on an already-paid order just returns the song page
r = await checkout("callbackone", "deluxe");
check("checkout on paid order returns song page", r.url === "/song/callbackone");

// 8. Redirect and webhooks arriving at the same moment (song must be made once; the runner checks the log)
for (const id of ["concurrent1", "concurrent2", "concurrent3"]) {
  await checkout(id, "deluxe");
  const ref = (await lastInit()).reference;
  const results = await Promise.all([callback(ref), webhook({ event: "charge.success", data: { reference: ref } }), webhook({ event: "charge.success", data: { reference: ref } }), callback(ref)]);
  check(`${id}: simultaneous callbacks/webhooks all succeed`, results.every((x) => x.status === 303 || x.status === 200), results.map((x) => x.status).join(","));
  check(`${id}: order becomes ready`, await waitStatus(id, "ready"));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
