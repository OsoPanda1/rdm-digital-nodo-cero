import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { RepoChainService } from './repoChainService';

describe('RepoChainService', () => {
  const service = new RepoChainService();
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('builds a circular chain and closes loopback to first repo', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, name: 'alpha', full_name: 'o/alpha', html_url: 'http://x/alpha', description: null, archived: false, disabled: false, updated_at: '2026-04-07T00:00:00.000Z' },
        { id: 2, name: 'beta', full_name: 'o/beta', html_url: 'http://x/beta', description: null, archived: false, disabled: false, updated_at: '2026-04-06T00:00:00.000Z' },
        { id: 3, name: 'gamma', full_name: 'o/gamma', html_url: 'http://x/gamma', description: null, archived: false, disabled: false, updated_at: '2026-04-05T00:00:00.000Z' },
      ],
    }) as unknown as typeof fetch;

    const result = await service.buildLoopChain({ owner: 'demo', forceRefresh: true });

    expect(result.nodes.length).toBe(3);
    expect(result.edges.length).toBe(3);
    expect(result.edges[0]).toMatchObject({ from: 'alpha', to: 'beta', mode: 'sequential-sync' });
    expect(result.edges[2]).toMatchObject({ from: 'gamma', to: 'alpha', mode: 'loopback-sync' });
  });

  it('can rotate chain when startRepo is provided', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, name: 'alpha', full_name: 'o/alpha', html_url: 'http://x/alpha', description: null, archived: false, disabled: false, updated_at: '2026-04-07T00:00:00.000Z' },
        { id: 2, name: 'beta', full_name: 'o/beta', html_url: 'http://x/beta', description: null, archived: false, disabled: false, updated_at: '2026-04-06T00:00:00.000Z' },
      ],
    }) as unknown as typeof fetch;

    const result = await service.buildLoopChain({ owner: 'demo', forceRefresh: true, startRepo: 'beta' });
    expect(result.startRepo).toBe('beta');
    expect(result.nodes[0].repo).toBe('beta');
    expect(result.edges[0]).toMatchObject({ from: 'beta', to: 'alpha' });
  });
});
