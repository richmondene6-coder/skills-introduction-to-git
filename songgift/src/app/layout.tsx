import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const display = Fraunces({ variable: "--font-display", subsets: ["latin"] });
const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SongGift: a Christmas song written just for them",
  description:
    "Answer a few questions and get a one-of-a-kind Christmas song with their name, your memories and your inside jokes. Ready in minutes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
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
          © {new Date().getFullYear()} SongGift · Every song is written and produced just for you
        </footer>
      </body>
    </html>
  );
}
