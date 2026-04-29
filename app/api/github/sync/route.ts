import { fetchGitHubRepos, classifyRepo, type GHRepo } from "@/lib/github"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const revalidate = 0

export async function GET() {
  try {
    const repos = await fetchGitHubRepos()
    const supabase = await createClient()

    const rows = repos.map((r: GHRepo) => {
      const c = classifyRepo(r)
      return {
        id: r.name,
        name: r.name,
        full_name: r.full_name,
        description: r.description,
        url: r.html_url,
        homepage: r.homepage,
        language: r.language,
        topics: r.topics ?? [],
        stars: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        size_kb: r.size ?? 0,
        default_branch: r.default_branch ?? "main",
        is_archived: r.archived ?? false,
        is_fork: r.fork ?? false,
        federation_id: c.federation,
        classification: c.classification,
        pushed_at: r.pushed_at,
        created_at_gh: r.created_at,
        synced_at: new Date().toISOString(),
      }
    })

    const { error } = await supabase.from("repositories").upsert(rows, { onConflict: "id" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const summary = rows.reduce<Record<string, number>>((acc, r) => {
      const k = r.classification ?? "unclassified"
      acc[k] = (acc[k] ?? 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      synced: rows.length,
      timestamp: new Date().toISOString(),
      classification_summary: summary,
    })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "sync failed" }, { status: 500 })
  }
}
