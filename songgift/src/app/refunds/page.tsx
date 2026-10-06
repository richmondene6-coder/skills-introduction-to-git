import type { Metadata } from "next";
import LegalPage from "@/components/legal-page";
import { BUSINESS_NAME, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: `Refund Policy · ${BUSINESS_NAME}` };

export default function RefundsPage() {
  return (
    <LegalPage title="Refund Policy" updated="October 6, 2026">
      <p>We want every song to be something you&apos;re proud to give.</p>
      <h2>Love it or we&apos;ll make it right</h2>
      <p>If you&apos;re not happy with your song, email <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a> within 7 days of purchase with your order link. We&apos;ll rewrite and re-record it once at no cost, or refund you in full if you prefer.</p>
      <h2>Delivery problems</h2>
      <p>If your song isn&apos;t delivered within 24 hours of payment, we&apos;ll refund you in full on request.</p>
      <h2>How refunds are paid</h2>
      <p>Refunds go back to your original payment method through Stripe and usually appear within 5–10 business days.</p>
    </LegalPage>
  );
}
