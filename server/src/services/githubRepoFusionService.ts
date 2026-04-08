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

export interface UnificationPlanPhase {
  phase: string;
  objective: string;
  repos: FusionNode[];
}

export interface UnificationPlan {
  owner: string;
  targetRepo: string;
  generatedAt: string;
  scannedRepos: number;
  selectedRepos: number;
  estimatedBranches: number;
  externalSeeds: string[];
  phases: UnificationPlanPhase[];
  mergeSequence: string[];
  bootstrapCommands: string[];
  bootstrapScript: string;
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
    const limit = Math.max(1, Math.min(options?.limit ?? 10, 400));

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

  async buildUnificationPlan(options?: {
    owner?: string;
    targetRepo?: string;
    maxRepos?: number;
    forceRefresh?: boolean;
    externalRepoUrls?: string[];
  }): Promise<UnificationPlan> {
    const owner = options?.owner ?? process.env.GITHUB_FEDERATION_OWNER ?? 'OsoPanda1';
    const targetRepo = options?.targetRepo ?? 'tamv-digital-nexus';
    const maxRepos = Math.max(10, Math.min(options?.maxRepos ?? 177, 400));

    const allRepos = await this.fetchAllRepos(owner);
    const activeRepos = allRepos.filter((repo) => !repo.archived && !repo.disabled);
    const selectedRepos = activeRepos
      .filter((repo) => repo.name !== targetRepo)
      .map((repo) => ({
        repo: repo.name,
        url: repo.html_url,
        description: repo.description,
        language: repo.language,
        topics: repo.topics ?? [],
        score: this.scoreRepo(repo),
        updatedAt: repo.updated_at,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, maxRepos);

    const tsAndJsRepos = selectedRepos.filter((repo) => ['TypeScript', 'JavaScript'].includes(repo.language ?? ''));
    const infraAndGoRepos = selectedRepos.filter((repo) => ['Go', 'Shell', 'Dockerfile', 'HCL'].includes(repo.language ?? ''));
    const remainingRepos = selectedRepos.filter(
      (repo) => !tsAndJsRepos.includes(repo) && !infraAndGoRepos.includes(repo),
    );

    const phases: UnificationPlanPhase[] = [
      {
        phase: 'P0-foundation',
        objective: 'Consolidar plataforma web + APIs principales en el hub',
        repos: tsAndJsRepos,
      },
      {
        phase: 'P1-runtime-infra',
        objective: 'Integrar sovereign-proxy, runtime de agentes e infraestructura',
        repos: infraAndGoRepos,
      },
      {
        phase: 'P2-domain-extensions',
        objective: 'Absorber módulos especializados, experimentales y de archivo',
        repos: remainingRepos,
      },
    ];

    const mergeSequence = selectedRepos
      .slice()
      .sort((a, b) => b.score - a.score)
      .map((repo) => repo.repo);

    const externalSeeds = this.normalizeExternalRepoUrls(options?.externalRepoUrls);

    const bootstrapCommands = [
      `git clone https://github.com/${owner}/${targetRepo}.git`,
      `cd ${targetRepo}`,
      ...externalSeeds.map((seed) => `git remote add ext-${seed.repo} https://github.com/${seed.owner}/${seed.repo}.git`),
      ...mergeSequence.slice(0, 10).map((repo) => `git remote add ${repo} https://github.com/${owner}/${repo}.git`),
      '# repetir fetch/cherry-pick por lotes hasta cubrir toda la secuencia',
    ];

    const bootstrapScript = bootstrapCommands.join('\n');

    return {
      owner,
      targetRepo,
      generatedAt: new Date().toISOString(),
      scannedRepos: allRepos.length,
      selectedRepos: selectedRepos.length,
      estimatedBranches: selectedRepos.length + 1,
      externalSeeds: externalSeeds.map((seed) => `https://github.com/${seed.owner}/${seed.repo}`),
      phases,
      mergeSequence,
      bootstrapCommands,
      bootstrapScript,
    };
  }

  private normalizeExternalRepoUrls(urls?: string[]): Array<{ owner: string; repo: string }> {
    if (!urls || urls.length === 0) {
      return [];
    }

    const seeds = urls
      .map((raw) => raw.trim())
      .filter(Boolean)
      .map((url) => {
        const httpsMatch = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/i);
        if (httpsMatch) {
          return { owner: httpsMatch[1], repo: httpsMatch[2] };
        }

        const shortMatch = url.match(/^([^/]+)\/([^/]+)$/);
        if (shortMatch) {
          return { owner: shortMatch[1], repo: shortMatch[2] };
        }

        return null;
      })
      .filter((seed): seed is { owner: string; repo: string } => Boolean(seed));

    const uniqueMap = new Map<string, { owner: string; repo: string }>();
    for (const seed of seeds) {
      uniqueMap.set(`${seed.owner}/${seed.repo}`.toLowerCase(), seed);
    }

    return Array.from(uniqueMap.values());
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
