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
    expect(result.backlog.length).toBe(2);
  });

  it('normaliza lista de repos duplicados antes de sincronizar cross-org', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 11,
        name: 'federated-learning-with-grpc-docker',
        full_name: 'mayankshah1607/federated-learning-with-grpc-docker',
        html_url: 'https://github.com/mayankshah1607/federated-learning-with-grpc-docker',
        description: 'federated learning with grpc and docker',
        homepage: null,
        language: 'Python',
        topics: ['federated-learning', 'grpc', 'docker'],
        stargazers_count: 19,
        forks_count: 7,
        updated_at: new Date().toISOString(),
        archived: false,
        disabled: false,
      }),
    } as Response);

    vi.stubGlobal('fetch', fetchMock);

    const service = new GitHubRepoFusionService();
    const result = await service.syncFromRepoList([
      ' MAYANKSHAH1607/federated-learning-with-grpc-docker ',
      'mayankshah1607/federated-learning-with-grpc-docker',
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.nodes.length).toBe(1);
    expect(result.nodes[0].integrationTrack).toBe('orchestration-infra');
  });
});
