import { z } from "zod";

export const STYLES = [
  { id: "crooner", label: "Classic Christmas crooner", prompt: "classic Christmas big band crooner, warm male vocal, sleigh bells, brass, swing" },
  { id: "pop", label: "Holiday pop", prompt: "upbeat modern holiday pop, catchy chorus, bright female vocal, sleigh bells, glossy production" },
  { id: "country", label: "Country Christmas", prompt: "warm country Christmas ballad, acoustic guitar, pedal steel, heartfelt male vocal" },
  { id: "acoustic", label: "Cozy acoustic", prompt: "cozy fireside acoustic folk, fingerpicked guitar, soft piano, intimate female vocal" },
  { id: "kids", label: "Kids' singalong", prompt: "joyful children's Christmas singalong, bouncy piano, glockenspiel, cheerful vocal, simple melody" },
  { id: "rnb", label: "Smooth R&B", prompt: "smooth soulful R&B Christmas slow jam, warm vocal harmonies, Rhodes piano, gentle groove" },
] as const;

export type StyleId = (typeof STYLES)[number]["id"];
export const STYLE_IDS = STYLES.map((s) => s.id) as [StyleId, ...StyleId[]];

export const RELATIONSHIPS = [
  "partner", "mom", "dad", "grandparent", "child", "sibling", "friend", "family", "coworker", "other",
] as const;

export const TONES = ["heartfelt", "funny", "mix"] as const;

const shortText = (max: number) => z.string().trim().max(max);

export const QuizSchema = z.object({
  recipientName: shortText(60).min(1, "Who is the song for?"),
  relationship: z.enum(RELATIONSHIPS),
  fromName: shortText(60).min(1, "Who is it from?"),
  occasion: shortText(80).default("Christmas"),
  memories: shortText(800).min(10, "Share at least one memory or detail"),
  insideJokes: shortText(400).default(""),
  thisYear: shortText(400).default(""),
  style: z.enum(STYLE_IDS),
  tone: z.enum(TONES),
  email: z.string().trim().email("Enter a valid email so we can deliver the song"),
});

export type Quiz = z.infer<typeof QuizSchema>;

export const LyricsSchema = z.object({
  title: z.string(),
  sections: z.array(
    z.object({
      name: z.string().describe("Section label such as Verse 1, Chorus, Bridge, Outro"),
      lines: z.array(z.string()),
    }),
  ),
});

export type Lyrics = z.infer<typeof LyricsSchema>;

// Prices live in pricing.ts (they depend on the configured currency).
export const TIERS = {
  standard: { label: "The Song", versions: 1, description: "Full personalized song (MP3) + printable gift card" },
  deluxe: { label: "Deluxe Gift", versions: 2, description: "Two versions in different styles + gift card + share page" },
} as const;

export type TierId = keyof typeof TIERS;

export type OrderStatus = "preview" | "paid" | "generating" | "ready" | "failed";

export type SongVersion = {
  styleId: StyleId;
  audioUrl?: string;
};

/** Where the buyer came from (ad, creator link, etc.), captured from the landing URL. */
export type Attribution = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  ref?: string;
};

export type PendingCheckout = {
  tier: TierId;
  amount: number;
  currency: string;
  promoCode?: string;
  createdAt: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  quiz: Quiz;
  lyrics: Lyrics;
  tier?: TierId;
  versions: SongVersion[];
  /** Paystack checkouts started for this order, by reference: only these are accepted as payment. */
  checkouts?: Record<string, PendingCheckout>;
  paymentReference?: string;
  /** Amount charged, in the currency's minor unit (cents, kobo, pesewas). */
  amountPaid?: number;
  currency?: string;
  promoCode?: string;
  paidAt?: string;
  attribution?: Attribution;
  error?: string;
};
