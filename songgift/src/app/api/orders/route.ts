import { NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { readAttribution } from "@/lib/attribution";
import { writeLyrics, LyricsError } from "@/lib/lyrics";
import { rateLimit, saveOrder } from "@/lib/store";
import { QuizSchema, type Order } from "@/lib/types";

export const maxDuration = 120;

const newId = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 12);

/** Takes the quiz answers, writes the lyrics, and creates an unpaid order for the preview. */
export async function POST(request: Request) {
  const parsed = QuizSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid answers" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!(await rateLimit(ip))) {
    return NextResponse.json({ error: "You've made a lot of previews. Please try again in an hour." }, { status: 429 });
  }

  try {
    const lyrics = await writeLyrics(parsed.data);
    const order: Order = {
      id: newId(),
      createdAt: new Date().toISOString(),
      status: "preview",
      quiz: parsed.data,
      lyrics,
      versions: [],
      attribution: readAttribution(request.headers.get("cookie")),
    };
    await saveOrder(order);
    return NextResponse.json({ id: order.id });
  } catch (err) {
    if (err instanceof LyricsError) return NextResponse.json({ error: err.message }, { status: 422 });
    console.error("[orders] lyric generation failed", err);
    return NextResponse.json({ error: "Something went wrong writing your song. Please try again." }, { status: 500 });
  }
}
