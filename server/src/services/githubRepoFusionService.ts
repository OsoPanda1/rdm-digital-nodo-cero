interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  archived: boolean;
  disabled: boolean;
}

export interface FusionNode {
  repo: string;
  url: string;
  description: string | null;
  language: string | null;
  topics: string[];
  score: number;
  updatedAt: string;
}

export interface FusionEdge {
  source: string;
  target: string;
  weight: number;
  reasons: string[];
}

export interface FusionSyncResult {
  owner: string;
  scannedRepos: number;
  relatedRepos: number;
  generatedAt: string;
  nodes: FusionNode[];
  edges: FusionEdge[];
}

interface CacheEntry {
  expiresAt: number;
  payload: FusionSyncResult;
}

const RDM_KEYWORDS = [
  'rdm',
  'real-del-monte',
  'real del monte',
  'tamv',
  'digital',
  'nexus',
  'civilizational',
  'metanextgen',
];

const INTERCONNECTION_MIN_WEIGHT = 2;

export class GitHubRepoFusionService {
  private cache: CacheEntry | null = null;
  private readonly cacheTtlMs = 10 * 60 * 1000;

  async syncRelatedRepos(options?: { owner?: string; limit?: number; forceRefresh?: boolean }): Promise<FusionSyncResult> {
    const owner = options?.owner ?? process.env.GITHUB_FEDERATION_OWNER ?? 'OsoPanda1';
    const limit = Math.max(1, Math.min(options?.limit ?? 10, 50));

    if (!options?.forceRefresh && this.cache && this.cache.expiresAt > Date.now()) {
      return {
        ...this.cache.payload,
        owner,
        nodes: this.cache.payload.nodes.slice(0, limit),
      };
    }

    const repos = await this.fetchAllRepos(owner);
    const related = repos
      .filter((repo) => !repo.archived && !repo.disabled)
      .map((repo) => ({ repo, score: this.scoreRepo(repo) }))
      .filter(({ repo, score }) => score > 0 || this.isRdmRelated(repo))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ repo, score }) => ({
        repo: repo.name,
        url: repo.html_url,
        description: repo.description,
        language: repo.language,
        topics: repo.topics ?? [],
        score,
        updatedAt: repo.updated_at,
      }));

    const edges = this.buildEdges(related);

    const payload: FusionSyncResult = {
      owner,
      scannedRepos: repos.length,
      relatedRepos: related.length,
      generatedAt: new Date().toISOString(),
      nodes: related,
      edges,
    };

    this.cache = {
      payload,
      expiresAt: Date.now() + this.cacheTtlMs,
    };

    return payload;
  }

  private async fetchAllRepos(owner: string): Promise<GitHubRepo[]> {
    const token = process.env.GITHUB_TOKEN;
    const repos: GitHubRepo[] = [];

    for (let page = 1; page <= 4; page += 1) {
      const endpoint = `https://api.github.com/users/${owner}/repos?per_page=100&page=${page}&sort=updated`;
      const response = await fetch(endpoint, {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub federation sync failed (${response.status})`);
      }

      const pageRepos = (await response.json()) as GitHubRepo[];
      repos.push(...pageRepos);

      if (pageRepos.length < 100) {
        break;
      }
    }

    return repos;
  }

  private isRdmRelated(repo: GitHubRepo): boolean {
    const bag = [
      repo.name,
      repo.full_name,
      repo.description ?? '',
      repo.homepage ?? '',
      ...(repo.topics ?? []),
    ]
      .join(' ')
      .toLowerCase();

    return RDM_KEYWORDS.some((keyword) => bag.includes(keyword));
  }

  private scoreRepo(repo: GitHubRepo): number {
    const bag = [repo.name, repo.description ?? '', ...(repo.topics ?? [])].join(' ').toLowerCase();
    const keywordHits = RDM_KEYWORDS.reduce((acc, keyword) => (bag.includes(keyword) ? acc + 1 : acc), 0);

    const daysSinceUpdate = Math.floor((Date.now() - new Date(repo.updated_at).getTime()) / (24 * 60 * 60 * 1000));
    const freshnessScore = daysSinceUpdate <= 30 ? 3 : daysSinceUpdate <= 120 ? 2 : 1;

    return keywordHits * 4 + freshnessScore + Math.min(repo.stargazers_count, 10) + Math.min(repo.forks_count, 5);
  }

  private buildEdges(nodes: FusionNode[]): FusionEdge[] {
    const edges: FusionEdge[] = [];

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];

        const sharedTopics = nodeA.topics.filter((topic) => nodeB.topics.includes(topic));
        const sharedKeyword = RDM_KEYWORDS.filter(
          (keyword) =>
            this.repoIncludesKeyword(nodeA, keyword) &&
            this.repoIncludesKeyword(nodeB, keyword),
        );

        let weight = sharedTopics.length + sharedKeyword.length;
        const reasons: string[] = [];

        if (sharedTopics.length > 0) {
          reasons.push(`shared-topics:${sharedTopics.join(',')}`);
        }

        if (sharedKeyword.length > 0) {
          reasons.push(`shared-keywords:${sharedKeyword.join(',')}`);
        }

        if (nodeA.language && nodeA.language === nodeB.language) {
          weight += 1;
          reasons.push(`same-language:${nodeA.language}`);
        }

        if (weight >= INTERCONNECTION_MIN_WEIGHT) {
          edges.push({
            source: nodeA.repo,
            target: nodeB.repo,
            weight,
            reasons,
          });
        }
      }
    }

    return edges.sort((a, b) => b.weight - a.weight);
  }

  private repoIncludesKeyword(node: FusionNode, keyword: string): boolean {
    const bag = [node.repo, node.description ?? '', ...node.topics].join(' ').toLowerCase();
    return bag.includes(keyword);
  }
}

export const githubRepoFusionService = new GitHubRepoFusionService();
