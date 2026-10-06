// A fake Paystack API for local tests: transaction/initialize, transaction/verify,
// plus test-only controls (/__inits, /__set/<ref>, /__create). Mirrors the shapes
// of the real API at https://api.paystack.co.
import http from "node:http";

const PORT = Number(process.env.MOCK_PAYSTACK_PORT || 4010);
const SECRET = process.env.MOCK_PAYSTACK_SECRET || "sk_test_mock";
const txs = new Map();
const inits = [];

const send = (res, code, body) => {
  res.writeHead(code, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
};

http
  .createServer(async (req, res) => {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    const body = raw ? JSON.parse(raw) : {};

    // Test controls
    if (req.url === "/__inits") return send(res, 200, inits);
    if (req.url.startsWith("/__set/")) {
      Object.assign(txs.get(decodeURIComponent(req.url.slice(7))) ?? {}, body);
      return send(res, 200, { ok: true });
    }
    if (req.url === "/__create") {
      txs.set(body.reference, { ...body });
      return send(res, 200, { ok: true });
    }

    if (req.headers.authorization !== `Bearer ${SECRET}`) return send(res, 401, { status: false, message: "Invalid key" });

    if (req.method === "POST" && req.url === "/transaction/initialize") {
      inits.push(body);
      txs.set(body.reference, { ...body, status: "success" });
      return send(res, 200, {
        status: true,
        message: "Authorization URL created",
        data: { authorization_url: `https://checkout.paystack.test/${body.reference}`, access_code: "ac_test", reference: body.reference },
      });
    }
    const verify = /^\/transaction\/verify\/(.+)$/.exec(req.url);
    if (req.method === "GET" && verify) {
      const tx = txs.get(decodeURIComponent(verify[1]));
      if (!tx) return send(res, 400, { status: false, message: "Transaction reference not found" });
      return send(res, 200, {
        status: true,
        message: "Verification successful",
        data: { status: tx.status, reference: tx.reference, amount: tx.amount, currency: tx.currency, metadata: tx.metadata },
      });
    }
    send(res, 404, { status: false, message: "Not found" });
  })
  .listen(PORT, () => console.log(`mock paystack on ${PORT}`));
