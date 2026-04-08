interface GitHubRepoLite {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  archived: boolean;
  disabled: boolean;
  updated_at: string;
}

export interface ChainNode {
  repo: string;
  url: string;
  description: string | null;
  order: number;
}

export interface ChainEdge {
  from: string;
  to: string;
  mode: 'sequential-sync' | 'loopback-sync';
  rationale: string;
}

export interface RepoChainResult {
  owner: string;
  totalRepos: number;
  generatedAt: string;
  startRepo: string;
  nodes: ChainNode[];
  edges: ChainEdge[];
  interoperabilityBlueprints: string[];
}

const INTEROPERABILITY_BLUEPRINTS = [
  'https://github.com/BruinGrowly/Emergent-Code.git',
  'https://github.com/ACES-EU/Autopoietic-Emergent-Scheduler.git',
  'https://github.com/CharlyKeleb/SocialMedia-App.git',
  'https://github.com/Architect-Flow78/ORGANISM-9-AUTOPOIETIC-SOLITON.git',
  'https://github.com/plurigrid/ontology.git',
  'https://github.com/Variable-Fox/ASAN-Architecture.git',
  'https://github.com/masamitsunamioka-a11y/autopoietic-autonomous-intelligence.git',
];

interface ChainOptions {
  owner?: string;
  forceRefresh?: boolean;
  startRepo?: string;
  maxRepos?: number;
}

interface CacheEntry {
  expiresAt: number;
  result: RepoChainResult;
}

export class RepoChainService {
  private readonly ttlMs = 5 * 60 * 1000;
  private cache: CacheEntry | null = null;

  async buildLoopChain(options?: ChainOptions): Promise<RepoChainResult> {
    const owner = options?.owner ?? process.env.GITHUB_FEDERATION_OWNER ?? 'OsoPanda1';
    const startRepo = options?.startRepo;

    if (!options?.forceRefresh && this.cache && this.cache.expiresAt > Date.now() && this.cache.result.owner === owner) {
      return this.withOptionalStart(this.cache.result, startRepo);
    }

    const repos = await this.fetchAllRepos(owner);
    const activeRepos = repos
      .filter((repo) => !repo.archived && !repo.disabled)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    const capped = activeRepos.slice(0, Math.max(1, Math.min(options?.maxRepos ?? activeRepos.length, 250)));

    const nodes = capped.map((repo, index) => ({
      repo: repo.name,
      url: repo.html_url,
      description: repo.description,
      order: index + 1,
    }));

    const edges = this.buildLoopEdges(nodes);

    const result: RepoChainResult = {
      owner,
      totalRepos: nodes.length,
      generatedAt: new Date().toISOString(),
      startRepo: nodes[0]?.repo ?? 'none',
      nodes,
      edges,
      interoperabilityBlueprints: INTEROPERABILITY_BLUEPRINTS,
    };

    this.cache = {
      result,
      expiresAt: Date.now() + this.ttlMs,
    };

    return this.withOptionalStart(result, startRepo);
  }

  private withOptionalStart(result: RepoChainResult, startRepo?: string): RepoChainResult {
    if (!startRepo) {
      return result;
    }

    const idx = result.nodes.findIndex((node) => node.repo.toLowerCase() === startRepo.toLowerCase());
    if (idx < 0) {
      return result;
    }

    const orderedNodes = [...result.nodes.slice(idx), ...result.nodes.slice(0, idx)].map((node, index) => ({
      ...node,
      order: index + 1,
    }));

    return {
      ...result,
      startRepo: orderedNodes[0]?.repo ?? result.startRepo,
      nodes: orderedNodes,
      edges: this.buildLoopEdges(orderedNodes),
    };
  }

  private buildLoopEdges(nodes: ChainNode[]): ChainEdge[] {
    if (nodes.length < 2) {
      return [];
    }

    return nodes.map((node, index) => {
      const next = nodes[(index + 1) % nodes.length];
      const isLoopback = index === nodes.length - 1;

      return {
        from: node.repo,
        to: next.repo,
        mode: isLoopback ? 'loopback-sync' : 'sequential-sync',
        rationale: isLoopback
          ? 'cierra el ciclo y retorna al repo inicial para flujo continuo'
          : 'propaga contexto federado al siguiente repo en la cadena',
      };
    });
  }

  private async fetchAllRepos(owner: string): Promise<GitHubRepoLite[]> {
    const token = process.env.GITHUB_TOKEN;
    const repos: GitHubRepoLite[] = [];

    for (let page = 1; page <= 5; page += 1) {
      const endpoint = `https://api.github.com/users/${owner}/repos?per_page=100&page=${page}&sort=updated`;
      const response = await fetch(endpoint, {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub chain sync failed (${response.status})`);
      }

      const pageRepos = (await response.json()) as GitHubRepoLite[];
      repos.push(...pageRepos);

      if (pageRepos.length < 100) {
        break;
      }
    }

    return repos;
  }
}

export const repoChainService = new RepoChainService();
