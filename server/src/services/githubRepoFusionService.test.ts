import { afterEach, describe, expect, it, vi } from 'vitest';
import { GitHubRepoFusionService } from './githubRepoFusionService';

describe('GitHubRepoFusionService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('filtra repos RDM y construye interconexiones', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          name: 'rdm-digital-2dbd42b0',
          full_name: 'OsoPanda1/rdm-digital-2dbd42b0',
          html_url: 'https://github.com/OsoPanda1/rdm-digital-2dbd42b0',
          description: 'plataforma digital real del monte',
          homepage: null,
          language: 'TypeScript',
          topics: ['rdm', 'digital', 'tourism'],
          stargazers_count: 3,
          forks_count: 1,
          updated_at: new Date().toISOString(),
          archived: false,
          disabled: false,
        },
        {
          id: 2,
          name: 'tamv-digital-nexus',
          full_name: 'OsoPanda1/tamv-digital-nexus',
          html_url: 'https://github.com/OsoPanda1/tamv-digital-nexus',
          description: 'federated tamv digital nexus',
          homepage: null,
          language: 'TypeScript',
          topics: ['tamv', 'digital', 'nexus'],
          stargazers_count: 4,
          forks_count: 2,
          updated_at: new Date().toISOString(),
          archived: false,
          disabled: false,
        },
      ],
    } as Response);

    vi.stubGlobal('fetch', fetchMock);

    const service = new GitHubRepoFusionService();
    const result = await service.syncRelatedRepos({ owner: 'OsoPanda1', limit: 10, forceRefresh: true });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.relatedRepos).toBe(2);
    expect(result.nodes[0].repo).toBe('tamv-digital-nexus');
    expect(result.edges.length).toBeGreaterThan(0);
    expect(result.edges[0].reasons.some((item) => item.startsWith('same-language:'))).toBe(true);
  });

  it('genera plan de unificación hacia tamv-digital-nexus', async () => {
    const repos = Array.from({ length: 12 }).map((_, index) => ({
      id: index + 1,
      name: index === 0 ? 'tamv-digital-nexus' : `tamv-module-${index}`,
      full_name: `OsoPanda1/${index === 0 ? 'tamv-digital-nexus' : `tamv-module-${index}`}`,
      html_url: `https://github.com/OsoPanda1/${index === 0 ? 'tamv-digital-nexus' : `tamv-module-${index}`}`,
      description: 'tamv digital module',
      homepage: null,
      language: index % 2 === 0 ? 'TypeScript' : 'Go',
      topics: ['tamv', 'digital', 'nexus'],
      stargazers_count: 1,
      forks_count: 1,
      updated_at: new Date().toISOString(),
      archived: false,
      disabled: false,
    }));

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => repos,
      } as Response),
    );

    const service = new GitHubRepoFusionService();
    const plan = await service.buildUnificationPlan({
      owner: 'OsoPanda1',
      targetRepo: 'tamv-digital-nexus',
      maxRepos: 177,
      forceRefresh: true,
    });

    expect(plan.targetRepo).toBe('tamv-digital-nexus');
    expect(plan.selectedRepos).toBe(11);
    expect(plan.phases.length).toBe(3);
    expect(plan.bootstrapCommands[0]).toContain('tamv-digital-nexus');
    expect(plan.bootstrapScript).toContain('git clone');
  });

  it('inyecta repos externos de referencia cuántica al plan de bootstrap', async () => {
    const repos = Array.from({ length: 11 }).map((_, index) => ({
      id: index + 1,
      name: index === 0 ? 'tamv-digital-nexus' : `tamv-node-${index}`,
      full_name: `OsoPanda1/${index === 0 ? 'tamv-digital-nexus' : `tamv-node-${index}`}`,
      html_url: `https://github.com/OsoPanda1/${index === 0 ? 'tamv-digital-nexus' : `tamv-node-${index}`}`,
      description: 'tamv digital module',
      homepage: null,
      language: 'TypeScript',
      topics: ['tamv', 'digital', 'nexus'],
      stargazers_count: 1,
      forks_count: 0,
      updated_at: new Date().toISOString(),
      archived: false,
      disabled: false,
    }));

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => repos,
      } as Response),
    );

    const service = new GitHubRepoFusionService();
    const plan = await service.buildUnificationPlan({
      owner: 'OsoPanda1',
      targetRepo: 'tamv-digital-nexus',
      externalRepoUrls: [
        'https://github.com/microsoft/Quantum.git',
        'PennyLaneAI/pennylane',
      ],
      forceRefresh: true,
    });

    expect(plan.externalSeeds).toEqual([
      'https://github.com/microsoft/Quantum',
      'https://github.com/PennyLaneAI/pennylane',
    ]);
    expect(plan.bootstrapCommands.some((cmd) => cmd.includes('ext-Quantum'))).toBe(true);
    expect(plan.bootstrapCommands.some((cmd) => cmd.includes('ext-pennylane'))).toBe(true);
  });

  it('permite sincronizar más de 50 repos cuando se solicita un límite alto', async () => {
    const repos = Array.from({ length: 80 }).map((_, index) => ({
      id: index + 1,
      name: `tamv-node-${index}`,
      full_name: `OsoPanda1/tamv-node-${index}`,
      html_url: `https://github.com/OsoPanda1/tamv-node-${index}`,
      description: 'tamv rdm digital repo',
      homepage: null,
      language: 'TypeScript',
      topics: ['tamv', 'digital'],
      stargazers_count: 0,
      forks_count: 0,
      updated_at: new Date().toISOString(),
      archived: false,
      disabled: false,
    }));

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => repos,
      } as Response),
    );

    const service = new GitHubRepoFusionService();
    const result = await service.syncRelatedRepos({
      owner: 'OsoPanda1',
      forceRefresh: true,
      limit: 177,
    });

    expect(result.relatedRepos).toBe(80);
  });
});
