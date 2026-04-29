const WINDOW_MS = 60_000;
const MAX_REQUESTS = 100;

type Bucket = { count: number; resetAt: number };
const memoryBuckets = new Map<string, Bucket>();

export async function rateLimit(ip: string) {
  const key = `rate:${ip}`;
  const now = Date.now();
  const bucket = memoryBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  bucket.count += 1;
  if (bucket.count > MAX_REQUESTS) {
    throw new Error("Too many requests");
  }
}
