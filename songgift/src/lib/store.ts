import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import type { Order } from "./types";

// Upstash Redis in production (set UPSTASH_REDIS_REST_URL / _TOKEN);
// a local JSON-file store for development.
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

const DATA_DIR = path.join(process.cwd(), ".data", "orders");
const key = (id: string) => `order:${id}`;

export async function getOrder(id: string): Promise<Order | null> {
  if (!/^[A-Za-z0-9_-]{6,40}$/.test(id)) return null;
  if (redis) return (await redis.get<Order>(key(id))) ?? null;
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, `${id}.json`), "utf8"));
  } catch {
    return null;
  }
}

export async function saveOrder(order: Order): Promise<void> {
  if (redis) {
    await redis.set(key(order.id), order);
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, `${order.id}.json`), JSON.stringify(order, null, 2));
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order> {
  const order = await getOrder(id);
  if (!order) throw new Error(`Order ${id} not found`);
  const next = { ...order, ...patch };
  await saveOrder(next);
  return next;
}

// Fixed-window rate limit for the free lyric preview (costs a Claude call).
const localHits = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(ip: string, limit = 5, windowSec = 3600): Promise<boolean> {
  const bucket = `rl:${ip}:${Math.floor(Date.now() / 1000 / windowSec)}`;
  if (redis) {
    const count = await redis.incr(bucket);
    if (count === 1) await redis.expire(bucket, windowSec);
    return count <= limit;
  }
  const now = Date.now();
  const entry = localHits.get(bucket);
  if (!entry || entry.resetAt < now) {
    localHits.set(bucket, { count: 1, resetAt: now + windowSec * 1000 });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}
