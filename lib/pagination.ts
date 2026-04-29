export type CursorPage<T> = {
  items: T[]
  nextCursor: string | null
}

export function encodeCursor(value: { createdAt: string; id: string }) {
  return Buffer.from(JSON.stringify(value)).toString("base64url")
}

export function decodeCursor(cursor?: string | null): { createdAt: string; id: string } | null {
  if (!cursor) return null
  try {
    return JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as { createdAt: string; id: string }
  } catch {
    return null
  }
}
