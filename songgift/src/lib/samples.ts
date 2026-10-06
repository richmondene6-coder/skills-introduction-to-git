import type { StyleId } from "./types";

export type Sample = {
  title: string;
  recipient: string;
  styleId: StyleId;
  /** Put the MP3 in public/samples/ and reference it as "/samples/file.mp3". */
  audioUrl: string;
  /** A short line from the lyrics, shown on the card. */
  lyric: string;
};

/**
 * Real example songs shown on the home page. The section stays hidden until
 * you add at least one. Use songs you made yourself (with permission from the
 * people named) — real examples are the strongest selling point you have.
 */
export const SAMPLES: Sample[] = [];
