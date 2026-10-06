"use client";

import { useEffect } from "react";
import { ATTRIBUTION_COOKIE } from "@/lib/attribution";

/**
 * Remembers which ad or creator link brought the visitor (first touch, 30 days),
 * e.g. /?utm_source=tiktok&utm_campaign=creator_jane or /?ref=jane
 */
export default function AttributionCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = {
      source: params.get("utm_source") ?? undefined,
      medium: params.get("utm_medium") ?? undefined,
      campaign: params.get("utm_campaign") ?? undefined,
      content: params.get("utm_content") ?? undefined,
      ref: params.get("ref") ?? undefined,
    };
    if (!Object.values(data).some(Boolean)) return;
    if (document.cookie.includes(`${ATTRIBUTION_COOKIE}=`)) return;
    document.cookie = `${ATTRIBUTION_COOKIE}=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
  }, []);
  return null;
}
