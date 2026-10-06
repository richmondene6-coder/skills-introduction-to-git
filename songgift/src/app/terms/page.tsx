import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal-page";
import { BUSINESS_NAME, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: `Terms of Service · ${BUSINESS_NAME}` };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="October 6, 2026">
      <p>These terms apply when you use {BUSINESS_NAME} to create and buy a personalized song. By placing an order you agree to them.</p>
      <h2>What you get</h2>
      <p>You describe the person and moments the song is about. We use AI tools to write lyrics and produce a recorded song, delivered as a downloadable audio file and a private link. Each song is generated for your order; results vary, and similar requests can produce different songs.</p>
      <h2>Your content</h2>
      <ul>
        <li>Only share details you have the right to share, and nothing unlawful, hateful, or harassing.</li>
        <li>Don&apos;t ask for songs that use other artists&apos; lyrics, melodies or voices, or that impersonate a real performer.</li>
        <li>We may refuse or cancel an order that breaks these rules, with a refund.</li>
      </ul>
      <h2>How you can use your song</h2>
      <p>Your song is for personal, non-commercial use: giving it as a gift, playing it at home or at events, and sharing it with family and friends, including on your personal social media. Contact us before using it commercially (for example in advertising or on streaming services).</p>
      <h2>Payment and delivery</h2>
      <p>Prices are shown in US dollars before checkout and are charged once, through Stripe. Most songs are delivered within minutes; occasionally it takes longer. If delivery fails, we will fix it or refund you.</p>
      <h2>Refunds</h2>
      <p>See our <Link href="/refunds" className="underline">refund policy</Link>.</p>
      <h2>Liability</h2>
      <p>The service is provided as is. To the extent the law allows, our total liability for any order is limited to the amount you paid for it.</p>
      <h2>Changes and contact</h2>
      <p>We may update these terms; the version shown when you place an order applies to it. Questions: <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a>.</p>
    </LegalPage>
  );
}
