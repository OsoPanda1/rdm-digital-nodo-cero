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
  owner: string;
  payload: FusionSyncResult;
}

export interface RepositoryDiagnostic {
  repo: string;
  url: string;
  language: string | null;
  topics: string[];
  updatedAt: string;
  score: number;
  staleDays: number;
  hasReadme: boolean;
  readmeExcerpt: string | null;
  blockers: string[];
  suggestedActions: string[];
}

export interface RepositoryKnowledgeBase {
  owner: string;
  generatedAt: string;
  scannedRepos: number;
  analyzedRepos: number;
  targetHub: string;
  repos: RepositoryDiagnostic[];
  summary: {
    ready: number;
    needsWork: number;
    critical: number;
  };
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

    if (!options?.forceRefresh && this.cache && this.cache.expiresAt > Date.now() && this.cache.owner === owner) {
      return {
        ...this.cache.payload,
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
      owner,
      payload,
      expiresAt: Date.now() + this.cacheTtlMs,
    };

    return payload;
  }

  async buildRepositoryKnowledgeBase(options?: {
    owner?: string;
    maxRepos?: number;
    forceRefresh?: boolean;
    targetHub?: string;
    includeReadme?: boolean;
  }): Promise<RepositoryKnowledgeBase> {
    const owner = options?.owner ?? process.env.GITHUB_FEDERATION_OWNER ?? 'OsoPanda1';
    const targetHub = options?.targetHub ?? 'tamv-digital-nexus';
    const maxRepos = Math.max(1, Math.min(options?.maxRepos ?? 177, 400));
    const includeReadme = options?.includeReadme ?? false;

    const allRepos = await this.fetchAllRepos(owner);
    const activeRepos = allRepos
      .filter((repo) => !repo.archived && !repo.disabled)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, maxRepos);

    const repos = await Promise.all(
      activeRepos.map(async (repo) => {
        const staleDays = Math.max(
          0,
          Math.floor((Date.now() - new Date(repo.updated_at).getTime()) / (24 * 60 * 60 * 1000)),
        );
        const blockers: string[] = [];
        const suggestedActions: string[] = [];

        if (!repo.description?.trim()) {
          blockers.push('missing-description');
          suggestedActions.push('Agregar descripción técnica del módulo y su rol en el hub.');
        }
        if (!repo.topics || repo.topics.length === 0) {
          blockers.push('missing-topics');
          suggestedActions.push('Definir topics (tamv, rdm, nexus, module) para trazabilidad.');
        }
        if (staleDays > 180) {
          blockers.push('stale-over-180-days');
          suggestedActions.push('Programar actualización mínima de salud (README/changelog/tests).');
        }
        if (!repo.language) {
          blockers.push('unknown-language');
          suggestedActions.push('Declarar stack principal para facilitar estrategia de merge.');
        }

        const readme = includeReadme ? await this.fetchReadme(owner, repo.name) : null;
        if (includeReadme && !readme) {
          blockers.push('missing-readme');
          suggestedActions.push('Crear README con instrucciones de build e integración federada.');
        }

        return {
          repo: repo.name,
          url: repo.html_url,
          language: repo.language,
          topics: repo.topics ?? [],
          updatedAt: repo.updated_at,
          score: this.scoreRepo(repo),
          staleDays,
          hasReadme: Boolean(readme),
          readmeExcerpt: readme,
          blockers,
          suggestedActions,
        } satisfies RepositoryDiagnostic;
      }),
    );

    const summary = repos.reduce(
      (acc, repo) => {
        if (repo.blockers.length === 0) {
          acc.ready += 1;
        } else if (repo.blockers.some((item) => item.includes('stale') || item.includes('missing-readme'))) {
          acc.critical += 1;
        } else {
          acc.needsWork += 1;
        }
        return acc;
      },
      { ready: 0, needsWork: 0, critical: 0 },
    );

    return {
      owner,
      generatedAt: new Date().toISOString(),
      scannedRepos: allRepos.length,
      analyzedRepos: repos.length,
      targetHub,
      repos,
      summary,
    };
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

  private async fetchReadme(owner: string, repo: string): Promise<string | null> {
    const token = process.env.GITHUB_TOKEN;
    const endpoint = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { content?: string; encoding?: string };
    if (!payload.content || payload.encoding !== 'base64') {
      return null;
    }

    try {
      const decoded = Buffer.from(payload.content, 'base64').toString('utf8').trim();
      return decoded.length > 500 ? `${decoded.slice(0, 500)}…` : decoded;
    } catch {
      return null;
    }
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
