// GitHub OsoPanda1 — read-only public API. No token required for public repos.
// Cached server-side via Next.js fetch revalidate.

export type GHRepo = {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics: string[]
  stargazers_count: number
  forks_count: number
  size: number
  default_branch: string
  archived: boolean
  fork: boolean
  pushed_at: string
  created_at: string
  updated_at: string
}

export type GHUser = {
  login: string
  name: string | null
  bio: string | null
  blog: string | null
  location: string | null
  public_repos: number
  followers: number
  following: number
  avatar_url: string
  html_url: string
  created_at: string
}

const GH_USER = "OsoPanda1"
const REVALIDATE = 60 * 30 // 30 min

export async function fetchGitHubUser(): Promise<GHUser | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${GH_USER}`, {
      next: { revalidate: REVALIDATE, tags: ["gh-user"] },
      headers: { Accept: "application/vnd.github+json" },
    })
    if (!res.ok) return null
    return (await res.json()) as GHUser
  } catch {
    return null
  }
}

export async function fetchGitHubRepos(): Promise<GHRepo[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`, {
      next: { revalidate: REVALIDATE, tags: ["gh-repos"] },
      headers: { Accept: "application/vnd.github+json" },
    })
    if (!res.ok) return []
    return (await res.json()) as GHRepo[]
  } catch {
    return []
  }
}

export function classifyRepo(repo: GHRepo): { federation: string; classification: string } {
  const text = `${repo.name} ${repo.description ?? ""} ${(repo.topics ?? []).join(" ")}`.toLowerCase()
  if (/kernel|isabella|fann|eros|sentinel|ai\b|llm|model/.test(text))
    return { federation: "tecnologica", classification: "infra-cognitiva" }
  if (/manuscrito|tomo|genesis|libro|compendio|tamv-doc/.test(text))
    return { federation: "cultural", classification: "manuscrito" }
  if (/citemesh|consent|protocol|protocolo|legal|charter/.test(text))
    return { federation: "gubernamental", classification: "protocolo" }
  if (/mercado|comercio|wallet|stripe|payment|pago/.test(text))
    return { federation: "economica", classification: "comercio" }
  if (/educa|escuela|university|curso|academia/.test(text))
    return { federation: "educativa", classification: "pedagógico" }
  if (/salud|clinica|medic|telesalud/.test(text)) return { federation: "salud", classification: "salud" }
  if (/radio|prensa|blog|comunicacion|media/.test(text))
    return { federation: "comunicacion", classification: "medios" }
  if (/nodo|rdm|territorio|federacion|federation/.test(text))
    return { federation: "gubernamental", classification: "canónico" }
  return { federation: "tecnologica", classification: "general" }
}
