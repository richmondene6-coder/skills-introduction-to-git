import { readLocalAudio } from "@/lib/audio-storage";

/** Serves locally stored tracks in development (production uses Vercel Blob URLs). */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const bytes = await readLocalAudio(file);
  if (!bytes) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(bytes), {
    headers: { "Content-Type": file.endsWith(".mp3") ? "audio/mpeg" : "audio/wav" },
  });
}
