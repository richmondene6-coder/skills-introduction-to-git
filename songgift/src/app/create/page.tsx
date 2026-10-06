import type { Metadata } from "next";
import QuizForm from "./quiz-form";

export const metadata: Metadata = { title: "Create your song · SongGift" };

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold text-pine-dark sm:text-4xl">Tell us about them</h1>
      <p className="mt-2 text-muted">
        The more specific you are, the more the song will feel like theirs. You&apos;ll read the lyrics before you pay.
      </p>
      <QuizForm />
    </div>
  );
}
