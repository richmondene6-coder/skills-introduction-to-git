import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import AttributionCapture from "@/components/attribution-capture";
import Pixels from "@/components/pixels";
import { BUSINESS_NAME, SUPPORT_EMAIL } from "@/lib/site";
import "./globals.css";

const display = Fraunces({ variable: "--font-display", subsets: ["latin"] });
const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "SongGift: a Christmas song written just for them",
  description:
    "Answer a few questions and get a one-of-a-kind Christmas song with their name, your memories and your inside jokes. Ready in minutes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Pixels />
        <AttributionCapture />
        <header className="print:hidden border-b border-line">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-display text-xl font-semibold text-pine">
              🎄 SongGift
            </Link>
            <Link href="/create" className="btn-primary text-sm">
              Create a song
            </Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="print:hidden border-t border-line py-8 text-center text-sm text-muted">
          <nav className="mb-3 flex flex-wrap justify-center gap-x-5 gap-y-1">
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/refunds" className="hover:underline">Refunds</Link>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline">Contact</a>
          </nav>
          © {new Date().getFullYear()} {BUSINESS_NAME} · Every song is written and produced just for you
        </footer>
      </body>
    </html>
  );
}
