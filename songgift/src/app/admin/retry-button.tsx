"use client";

import { useState } from "react";

export default function RetryButton({ orderId }: { orderId: string }) {
  const [state, setState] = useState<"idle" | "busy" | "started" | "error">("idle");
  async function retry() {
    setState("busy");
    const res = await fetch("/api/admin/retry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    setState(res.ok ? "started" : "error");
  }
  if (state === "started") return <span className="text-pine">Retrying… refresh in a few minutes</span>;
  return (
    <button onClick={retry} disabled={state === "busy"} className="font-semibold text-berry underline disabled:opacity-50">
      {state === "error" ? "Failed, try again" : state === "busy" ? "Starting…" : "Retry"}
    </button>
  );
}
