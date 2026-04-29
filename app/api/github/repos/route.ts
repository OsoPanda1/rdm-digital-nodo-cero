import { fetchGitHubRepos } from "@/lib/github"
import { decodeCursor, encodeCursor, type CursorPage } from "@/lib/pagination"

type RepoItem = {
  id: string
  name: string
  description: string | null
  url: string
  language: string | null
  stars: number
  updatedAt: string
}

function paginateRepos(items: RepoItem[], cursor: string | null, limit: number): CursorPage<RepoItem> {
  const parsed = decodeCursor(cursor)
  let startIndex = 0
  if (parsed) {
    const idx = items.findIndex((item) => item.id === parsed.id && item.updatedAt === parsed.createdAt)
    startIndex = idx >= 0 ? idx + 1 : 0
  }
  const sliced = items.slice(startIndex, startIndex + limit)
  const last = sliced[sliced.length - 1]
  return {
    items: sliced,
    nextCursor: last && startIndex + limit < items.length ? encodeCursor({ id: last.id, createdAt: last.updatedAt }) : null,
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get("cursor")
  const limitRaw = Number.parseInt(searchParams.get("limit") ?? "20", 10)
  const limit = Math.min(100, Math.max(1, Number.isFinite(limitRaw) ? limitRaw : 20))

  const repos = await fetchGitHubRepos()
  const normalized: RepoItem[] = repos
    .filter((r) => !r.fork)
    .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
    .map((r) => ({
      id: String(r.id),
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      updatedAt: r.updated_at,
    }))
  return Response.json(paginateRepos(normalized, cursor, limit))
}
