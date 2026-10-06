import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";

const LOCAL_DIR = path.join(process.cwd(), ".data", "audio");

/** Stores a finished track and returns a URL the browser can play. */
export async function storeAudio(name: string, bytes: Buffer, contentType: string): Promise<string> {
  const ext = contentType === "audio/mpeg" ? "mp3" : "wav";
  const filename = `${name}.${ext}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`songs/${filename}`, bytes, { access: "public", contentType, addRandomSuffix: true });
    return blob.url;
  }
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_DIR, filename), bytes);
  return `/api/audio/${filename}`;
}

export async function readLocalAudio(filename: string): Promise<Buffer | null> {
  if (!/^[A-Za-z0-9_-]+\.(mp3|wav)$/.test(filename)) return null;
  try {
    return await fs.readFile(path.join(LOCAL_DIR, filename));
  } catch {
    return null;
  }
}
