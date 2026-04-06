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
  fullName: string;
  url: string;
  description: string | null;
  language: string | null;
  topics: string[];
  score: number;
  updatedAt: string;
  integrationTrack: IntegrationTrack;
}

export interface FusionEdge {
  source: string;
  target: string;
  weight: number;
  reasons: string[];
}

interface IntegrationWorkItem {
  repo: string;
  fullName: string;
  priority: 'P0' | 'P1' | 'P2';
  targetModule: string;
  expectedImpact: string;
}

export interface FusionSyncResult {
  owner: string;
  scannedRepos: number;
  relatedRepos: number;
  generatedAt: string;
  nodes: FusionNode[];
  edges: FusionEdge[];
  backlog: IntegrationWorkItem[];
}

interface CacheEntry {
  expiresAt: number;
  payload: FusionSyncResult;
}

type IntegrationTrack =
  | 'federated-core'
  | 'security-privacy'
  | 'digital-twin'
  | 'orchestration-infra'
  | 'general-ai';

const RDM_KEYWORDS = [
  'rdm',
  'real-del-monte',
  'real del monte',
  'tamv',
  'digital',
  'nexus',
  'civilizational',
  'metanextgen',
  'federated',
  'fedrated',
  'federation',
  'blockchain',
  'grpc',
  'flower',
  'digital twin',
  'heritage',
  'privacy',
  'ddos',
];

const INTERCONNECTION_MIN_WEIGHT = 2;
const FETCH_TIMEOUT_MS = 7000;

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

    const repos = await this.fetchOwnerRepos(owner);
    const payload = this.buildFusionPayload(owner, repos, limit);

    this.cache = {
      payload,
      expiresAt: Date.now() + this.cacheTtlMs,
    };

    return payload;
  }

  async syncFromRepoList(repoFullNames: string[], options?: { limit?: number }): Promise<FusionSyncResult> {
    const limit = Math.max(1, Math.min(options?.limit ?? Math.max(repoFullNames.length, 10), 80));
    const repos = await this.fetchReposByFullName(repoFullNames);

    return this.buildFusionPayload('cross-org', repos, limit);
  }

  private buildFusionPayload(owner: string, repos: GitHubRepo[], limit: number): FusionSyncResult {
    const related = repos
      .filter((repo) => !repo.archived && !repo.disabled)
      .map((repo) => ({ repo, score: this.scoreRepo(repo) }))
      .filter(({ repo, score }) => score > 0 || this.isRdmRelated(repo))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ repo, score }) => ({
        repo: repo.name,
        fullName: repo.full_name,
        url: repo.html_url,
        description: repo.description,
        language: repo.language,
        topics: repo.topics ?? [],
        score,
        updatedAt: repo.updated_at,
        integrationTrack: this.resolveTrack(repo),
      }));

    const edges = this.buildEdges(related);
    const backlog = this.buildBacklog(related);

    return {
      owner,
      scannedRepos: repos.length,
      relatedRepos: related.length,
      generatedAt: new Date().toISOString(),
      nodes: related,
      edges,
      backlog,
    };
  }

  private buildBacklog(nodes: FusionNode[]): IntegrationWorkItem[] {
    return nodes.slice(0, 20).map((node) => {
      const priority: IntegrationWorkItem['priority'] = node.score >= 16 ? 'P0' : node.score >= 10 ? 'P1' : 'P2';

      const targetModule =
        node.integrationTrack === 'security-privacy'
          ? 'server/src/routes/ai.ts'
          : node.integrationTrack === 'digital-twin'
            ? 'src/realito/gen4/ExperienceOrchestrator.ts'
            : node.integrationTrack === 'orchestration-infra'
              ? 'cmd/sovereign-proxy/main.go'
              : 'server/src/services/quantumFederationService.ts';

      const expectedImpact =
        node.integrationTrack === 'security-privacy'
          ? 'detección de anomalías y hardening federado en APIs de RDM'
          : node.integrationTrack === 'digital-twin'
            ? 'simulación urbana/museográfica conectada al gemelo digital'
            : node.integrationTrack === 'orchestration-infra'
              ? 'sincronización distribuida de nodos y coordinación de runtimes'
              : 'mejor convergencia del núcleo federado en catálogo TAMV/RDM';

      return {
        repo: node.repo,
        fullName: node.fullName,
        priority,
        targetModule,
        expectedImpact,
      };
    });
  }

  private async fetchOwnerRepos(owner: string): Promise<GitHubRepo[]> {
    const repos: GitHubRepo[] = [];

    for (let page = 1; page <= 4; page += 1) {
      const endpoint = `https://api.github.com/users/${owner}/repos?per_page=100&page=${page}&sort=updated`;
      const pageRepos = await this.fetchGitHubJson<GitHubRepo[]>(endpoint);
      repos.push(...pageRepos);

      if (pageRepos.length < 100) {
        break;
      }
    }

    return repos;
  }

  private async fetchReposByFullName(repoFullNames: string[]): Promise<GitHubRepo[]> {
    const uniqueRepoNames = [...new Set(repoFullNames.map((repo) => repo.trim()).filter((repo) => repo.length > 0))];
    const chunkSize = 6;
    const allRepos: GitHubRepo[] = [];

    for (let index = 0; index < uniqueRepoNames.length; index += chunkSize) {
      const chunk = uniqueRepoNames.slice(index, index + chunkSize);
      const responses = await Promise.all(
        chunk.map(async (fullName) => {
          try {
            const endpoint = `https://api.github.com/repos/${fullName}`;
            return await this.fetchGitHubJson<GitHubRepo>(endpoint);
          } catch {
            return null;
          }
        }),
      );

      allRepos.push(...responses.filter((repo): repo is GitHubRepo => repo !== null));
    }

    return allRepos;
  }

  private async fetchGitHubJson<T>(endpoint: string): Promise<T> {
    const token = process.env.GITHUB_TOKEN;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`GitHub federation sync failed (${response.status})`);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  private isRdmRelated(repo: GitHubRepo): boolean {
    const bag = [repo.name, repo.full_name, repo.description ?? '', repo.homepage ?? '', ...(repo.topics ?? [])]
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

  private resolveTrack(repo: GitHubRepo): IntegrationTrack {
    const bag = [repo.name, repo.description ?? '', ...(repo.topics ?? [])].join(' ').toLowerCase();

    if (bag.includes('privacy') || bag.includes('ddos') || bag.includes('attack') || bag.includes('security')) {
      return 'security-privacy';
    }

    if (bag.includes('digital twin') || bag.includes('museum') || bag.includes('simulation')) {
      return 'digital-twin';
    }

    if (bag.includes('grpc') || bag.includes('docker') || bag.includes('decentralized') || bag.includes('blockchain')) {
      return 'orchestration-infra';
    }

    if (bag.includes('federated') || bag.includes('fedrated') || bag.includes('flower')) {
      return 'federated-core';
    }

    return 'general-ai';
  }

  private buildEdges(nodes: FusionNode[]): FusionEdge[] {
    const edges: FusionEdge[] = [];

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];

        const sharedTopics = nodeA.topics.filter((topic) => nodeB.topics.includes(topic));
        const sharedKeyword = RDM_KEYWORDS.filter(
          (keyword) => this.repoIncludesKeyword(nodeA, keyword) && this.repoIncludesKeyword(nodeB, keyword),
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

        if (nodeA.integrationTrack === nodeB.integrationTrack) {
          weight += 1;
          reasons.push(`same-track:${nodeA.integrationTrack}`);
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
    const bag = [node.repo, node.description ?? '', ...node.topics, node.integrationTrack].join(' ').toLowerCase();
    return bag.includes(keyword);
  }
}

export const githubRepoFusionService = new GitHubRepoFusionService();
