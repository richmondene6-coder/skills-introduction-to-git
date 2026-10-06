import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { STYLES, type Lyrics, type StyleId } from "./types";

// Approximate seconds per sung line, used to size each chunk of the song.
const SECONDS_PER_LINE = 3.5;

/** Renders the lyrics as a sung track and returns MP3 bytes. */
export async function composeSong(lyrics: Lyrics, styleId: StyleId): Promise<{ bytes: Buffer; contentType: string }> {
  if (!process.env.ELEVENLABS_API_KEY) {
    if (process.env.NODE_ENV === "production") throw new Error("ELEVENLABS_API_KEY is not set");
    return { bytes: placeholderTone(), contentType: "audio/wav" };
  }

  const style = STYLES.find((s) => s.id === styleId)!;
  const globalStyles = [...style.prompt.split(", "), "Christmas", "great production quality", "clear vocals"];
  const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

  const chunks = lyrics.sections.map((section, i) => ({
    text: `[${section.name}]\n${section.lines.slice(0, 30).map((l) => l.slice(0, 200)).join("\n")}`,
    durationMs: clamp(Math.round(section.lines.length * SECONDS_PER_LINE * 1000), 8000, 120000),
    // The first chunk sets genre and tone for the whole song.
    positiveStyles: i === 0 ? globalStyles : [style.label, section.name.toLowerCase()],
  }));

  const stream = await client.music.compose({
    modelId: "music_v2_5",
    compositionPlan: { chunks },
    outputFormat: "mp3_44100_128",
  });
  const bytes = Buffer.from(await new Response(stream).arrayBuffer());
  return { bytes, contentType: "audio/mpeg" };
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** A short jingle as a WAV file so the full flow works locally without a music API key. */
function placeholderTone(): Buffer {
  const sampleRate = 22050;
  const notes = [659, 659, 659, 0, 659, 659, 659, 0, 659, 784, 523, 587, 659]; // "Jingle Bells"
  const noteLen = Math.round(sampleRate * 0.28);
  const samples = new Int16Array(notes.length * noteLen);
  notes.forEach((freq, n) => {
    for (let i = 0; i < noteLen; i++) {
      const env = Math.min(1, i / 200) * (1 - i / noteLen);
      samples[n * noteLen + i] = freq ? Math.round(Math.sin((2 * Math.PI * freq * i) / sampleRate) * 9000 * env) : 0;
    }
  });
  const data = Buffer.from(samples.buffer);
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}
