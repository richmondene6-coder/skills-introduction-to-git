import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { LyricsSchema, STYLES, type Lyrics, type Quiz } from "./types";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a professional songwriter who writes personalized songs that people give as gifts. Your lyrics make the listener feel seen: they use the specific names, memories and inside jokes the buyer shares, rather than generic holiday filler.

Craft guidelines:
- Structure: Verse 1, Chorus, Verse 2, Chorus, Bridge, Final Chorus. Choruses repeat with the same lines (small tweaks in the final chorus are fine).
- Each verse and the bridge have 4-6 lines; each chorus has 4 lines. Lines are short enough to sing comfortably (under 12 words).
- Put the recipient's name in the chorus so it is the hook people remember.
- Use at least three concrete details from the buyer's answers. Turn them into images and moments, not a list.
- Match the requested tone: heartfelt means warm and sincere, funny means playful and teasing but never mean, mix means mostly warm with one or two laugh lines.
- Rhyme and meter should feel natural for the requested genre.
- Keep it family-friendly. Do not include real copyrighted lyrics or melodies.
- The title is short (2-6 words) and personal.`;

export async function writeLyrics(quiz: Quiz): Promise<Lyrics> {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN && process.env.NODE_ENV !== "production") {
    console.warn("[lyrics] ANTHROPIC_API_KEY is not set: using demo lyrics");
    return demoLyrics(quiz);
  }
  const style = STYLES.find((s) => s.id === quiz.style)!;
  const brief = `Write a ${quiz.occasion} song.

Recipient: ${quiz.recipientName} (the buyer's ${quiz.relationship})
From: ${quiz.fromName}
Genre: ${style.label}
Tone: ${quiz.tone}

Memories and details:
${quiz.memories}

Inside jokes or nicknames:
${quiz.insideJokes || "(none given)"}

What happened this year:
${quiz.thisYear || "(none given)"}`;

  const response = await client.beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: betaZodOutputFormat(LyricsSchema) },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: brief }],
  });

  if (response.stop_reason === "refusal") {
    throw new LyricsError("We couldn't write a song from those details. Please adjust your answers and try again.");
  }
  if (!response.parsed_output || response.parsed_output.sections.length === 0) {
    throw new LyricsError("Lyric generation failed. Please try again.");
  }
  return response.parsed_output;
}

export class LyricsError extends Error {}

/** Clearly-marked placeholder lyrics so the app can be clicked through locally before a Claude key is added. */
function demoLyrics(quiz: Quiz): Lyrics {
  const name = quiz.recipientName;
  const chorus = [
    `Oh ${name}, this song is just for you`,
    "For every Christmas we've come through",
    "The lights are on, the fire's bright",
    `Merry Christmas, ${name}, tonight`,
  ];
  return {
    title: `A Christmas Song for ${name} (demo)`,
    sections: [
      {
        name: "Verse 1",
        lines: ["The snow is soft against the glass", "Another year has rushed on past", "But every candle, every bell", "Brings back the moments we know well"],
      },
      { name: "Chorus", lines: chorus },
      {
        name: "Verse 2",
        lines: [`From ${quiz.fromName}, with all our love`, "A little wish from up above", "For laughter, light and cocoa warm", "And you beside us through the storm"],
      },
      { name: "Chorus", lines: chorus },
      {
        name: "Bridge",
        lines: ["These are demo lyrics for testing", "Add a Claude key to get the real song", "Written from your memories and jokes"],
      },
      { name: "Final Chorus", lines: chorus },
    ],
  };
}
