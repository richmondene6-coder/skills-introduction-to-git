import type { Metadata } from "next";
import LegalPage from "@/components/legal-page";
import { BUSINESS_NAME, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: `Privacy Policy · ${BUSINESS_NAME}` };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 6, 2026">
      <p>This policy explains what {BUSINESS_NAME} collects when you create a song and how it&apos;s used.</p>
      <h2>What we collect</h2>
      <ul>
        <li>The answers you give in the song quiz (names, memories, style choices).</li>
        <li>Your email address, so we can deliver your song.</li>
        <li>Payment details, which are handled by Stripe. We never see or store your full card number.</li>
        <li>Basic usage data and, if you arrive from an ad, which ad or link brought you (through cookies and ad pixels from Meta and TikTok).</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To write and produce your song. Your quiz answers are sent to our AI providers (Anthropic for lyrics, ElevenLabs for music) only for that purpose.</li>
        <li>To email you your song and respond to support requests.</li>
        <li>To measure which ads work, so we can improve our marketing.</li>
      </ul>
      <p>We don&apos;t sell your personal information.</p>
      <h2>Who can see your song</h2>
      <p>Your song page has a private, hard-to-guess link. Anyone you share that link (or the gift card QR code) with can listen to the song and read the lyrics.</p>
      <h2>Service providers</h2>
      <p>We use Stripe (payments), Anthropic and ElevenLabs (song creation), Vercel and Upstash (hosting and storage), Resend (email), and Meta and TikTok (ad measurement).</p>
      <h2>Your choices</h2>
      <p>You can ask us to delete your song and your data at any time by emailing <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a>. You can block ad cookies in your browser settings.</p>
    </LegalPage>
  );
}
