"use client";

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-primary">
      Print gift card
    </button>
  );
}
