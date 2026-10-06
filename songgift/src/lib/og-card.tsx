import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared look for social preview images: cream card, pine and berry type. */
export function ogCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#1d4a35", padding: 40 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#fbf7ef",
            borderRadius: 32,
            border: "6px solid #c9973b",
            padding: 60,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 72 }}>🎄</div>
          <div style={{ fontSize: 30, color: "#b3262d", letterSpacing: 6, textTransform: "uppercase", marginTop: 16 }}>{eyebrow}</div>
          <div style={{ fontSize: 76, color: "#143526", fontWeight: 700, marginTop: 20, lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 30, color: "#5d6a62", marginTop: 28 }}>{footer}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
