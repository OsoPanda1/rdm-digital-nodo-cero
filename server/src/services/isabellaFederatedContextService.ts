interface GitHubRepoSummary {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  updated_at: string;
}

interface GitHubReadmeResponse {
  content?: string;
  encoding?: string;
}

export interface IsabellaContextSnippet {
  repo: string;
  repoUrl: string;
  score: number;
  summary: string;
  updatedAt: string;
}

export interface IsabellaFederatedContext {
  owner: string;
  generatedAt: string;
  scannedRepos: number;
  snippets: IsabellaContextSnippet[];
}

interface CacheEntry {
  expiresAt: number;
  payload: IsabellaFederatedContext;
}

const CONTEXT_KEYWORDS = [
  'isabella',
  'rdm',
  'tamv',
  'federated',
  'digital twin',
  'xr',
  'vr',
  'ai',
  'turismo',
  'real del monte',
  'blockchain',
  'quantum',
];

export class IsabellaFederatedContextService {
  private cache: CacheEntry | null = null;
  private readonly cacheTtlMs = 5 * 60 * 1000;

  async buildContext(query: string, options?: { owner?: string; maxRepos?: number; forceRefresh?: boolean }): Promise<IsabellaFederatedContext> {
    const owner = options?.owner ?? process.env.GITHUB_FEDERATION_OWNER ?? 'OsoPanda1';
    const maxRepos = Math.max(5, Math.min(options?.maxRepos ?? 20, 50));

    if (!options?.forceRefresh && this.cache && this.cache.expiresAt > Date.now()) {
      return {
        ...this.cache.payload,
        snippets: this.rankByQuery(this.cache.payload.snippets, query).slice(0, 8),
      };
    }

    const repos = await this.fetchOwnerRepos(owner, maxRepos);
    const snippets = await this.fetchRepoSnippets(repos, query);

    const payload: IsabellaFederatedContext = {
      owner,
      generatedAt: new Date().toISOString(),
      scannedRepos: repos.length,
      snippets: snippets.slice(0, 8),
    };

    this.cache = {
      payload,
      expiresAt: Date.now() + this.cacheTtlMs,
    };

    return payload;
  }

  private async fetchOwnerRepos(owner: string, maxRepos: number): Promise<GitHubRepoSummary[]> {
    const endpoint = `https://api.github.com/users/${owner}/repos?per_page=${maxRepos}&sort=updated`;
    const repos = await this.fetchGitHubJson<GitHubRepoSummary[]>(endpoint);
    return repos.slice(0, maxRepos);
  }

  private async fetchRepoSnippets(repos: GitHubRepoSummary[], query: string): Promise<IsabellaContextSnippet[]> {
    const snippets: IsabellaContextSnippet[] = [];

    for (const repo of repos) {
      const readme = await this.fetchReadme(repo.full_name);
      const decodedReadme = this.decodeReadme(readme?.content, readme?.encoding);
      const baseSummary = `${repo.description ?? ''} ${decodedReadme}`.trim();
      const score = this.computeScore(baseSummary, query);

      if (score > 0) {
        snippets.push({
          repo: repo.full_name,
          repoUrl: repo.html_url,
          score,
          summary: this.summarize(baseSummary),
          updatedAt: repo.updated_at,
        });
      }
    }

    return this.rankByQuery(snippets, query);
  }

  private rankByQuery(snippets: IsabellaContextSnippet[], query: string): IsabellaContextSnippet[] {
    const cleanedQuery = query.toLowerCase();
    return [...snippets].sort((a, b) => {
      const aBoost = cleanedQuery.length > 0 && a.summary.toLowerCase().includes(cleanedQuery) ? 2 : 0;
      const bBoost = cleanedQuery.length > 0 && b.summary.toLowerCase().includes(cleanedQuery) ? 2 : 0;
      return b.score + bBoost - (a.score + aBoost);
    });
  }

  private summarize(text: string): string {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    return cleaned.length > 360 ? `${cleaned.slice(0, 357)}...` : cleaned;
  }

  private computeScore(text: string, query: string): number {
    const bag = `${text} ${query}`.toLowerCase();
    return CONTEXT_KEYWORDS.reduce((acc, keyword) => (bag.includes(keyword) ? acc + 2 : acc), 0);
  }

  private async fetchReadme(fullName: string): Promise<GitHubReadmeResponse | null> {
    try {
      return await this.fetchGitHubJson<GitHubReadmeResponse>(`https://api.github.com/repos/${fullName}/readme`);
    } catch {
      return null;
    }
  }

  private decodeReadme(content?: string, encoding?: string): string {
    if (!content || encoding !== 'base64') {
      return '';
    }

    try {
      return Buffer.from(content, 'base64').toString('utf-8');
    } catch {
      return '';
    }
  }

  private async fetchGitHubJson<T>(endpoint: string): Promise<T> {
    const token = process.env.GITHUB_TOKEN;
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Isabella GitHub sync failed (${response.status})`);
    }

    return (await response.json()) as T;
  }
}

export const isabellaFederatedContextService = new IsabellaFederatedContextService();
