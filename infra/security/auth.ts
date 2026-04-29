import { createHash, timingSafeEqual } from "node:crypto";

export type AuthClaims = { sub: string };

export function verifyToken(token: string): AuthClaims {
  const expected = process.env.SSE_BEARER_TOKEN;
  if (!expected) {
    throw new Error("SSE_BEARER_TOKEN is not configured");
  }

  const a = createHash("sha256").update(token).digest();
  const b = createHash("sha256").update(expected).digest();
  if (!timingSafeEqual(a, b)) {
    throw new Error("invalid token");
  }

  return { sub: "stream-client" };
}
