import { afterEach, describe, expect, it, vi } from 'vitest';
import { IsabellaFederatedContextService } from './isabellaFederatedContextService';

describe('IsabellaFederatedContextService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('construye contexto con snippets desde repos y readmes', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            name: 'rdm-digital-2dbd42b0',
            full_name: 'OsoPanda1/rdm-digital-2dbd42b0',
            html_url: 'https://github.com/OsoPanda1/rdm-digital-2dbd42b0',
            description: 'plataforma ai turismo real del monte',
            updated_at: new Date().toISOString(),
          },
        ],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          encoding: 'base64',
          content: Buffer.from('Isabella federated AI XR VR for turismo').toString('base64'),
        }),
      } as Response);

    vi.stubGlobal('fetch', fetchMock);

    const service = new IsabellaFederatedContextService();
    const result = await service.buildContext('isabella ai', { owner: 'OsoPanda1', maxRepos: 10, forceRefresh: true });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.scannedRepos).toBe(1);
    expect(result.snippets.length).toBe(1);
    expect(result.snippets[0].repo).toBe('OsoPanda1/rdm-digital-2dbd42b0');
  });

  it('pagina repositorios para cubrir catálogos grandes del owner', async () => {
    const firstPage = Array.from({ length: 100 }).map((_, idx) => ({
      name: `tamv-${idx}`,
      full_name: `OsoPanda1/tamv-${idx}`,
      html_url: `https://github.com/OsoPanda1/tamv-${idx}`,
      description: 'tamv isabella quantum xr',
      updated_at: new Date().toISOString(),
    }));

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => firstPage,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response)
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          encoding: 'base64',
          content: Buffer.from('tamv isabella quantum').toString('base64'),
        }),
      } as Response);

    vi.stubGlobal('fetch', fetchMock);

    const service = new IsabellaFederatedContextService();
    const result = await service.buildContext('quantum', {
      owner: 'OsoPanda1',
      maxRepos: 194,
      maxSnippets: 20,
      forceRefresh: true,
    });

    expect(result.scannedRepos).toBe(100);
    expect(result.snippets.length).toBeLessThanOrEqual(20);
    expect(fetchMock).toHaveBeenCalled();
  });
});
