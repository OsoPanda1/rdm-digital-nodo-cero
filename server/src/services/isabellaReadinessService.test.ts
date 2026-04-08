import { describe, expect, it, vi } from 'vitest';
import { IsabellaReadinessService } from './isabellaReadinessService';

describe('IsabellaReadinessService', () => {
  it('reporta fail cuando faltan variables obligatorias', async () => {
    const service = new IsabellaReadinessService({
      probeDatabase: vi.fn().mockResolvedValue(undefined),
      probeFederatedContext: vi.fn().mockResolvedValue(undefined),
    });

    const originalJwt = process.env.JWT_SECRET;
    const originalDb = process.env.DATABASE_URL;
    delete process.env.JWT_SECRET;
    delete process.env.DATABASE_URL;

    const report = await service.run('OsoPanda1');

    process.env.JWT_SECRET = originalJwt;
    process.env.DATABASE_URL = originalDb;

    expect(report.globalStatus).toBe('fail');
    expect(report.checks.some((check) => check.key === 'env.jwt_secret' && check.status === 'fail')).toBe(true);
    expect(report.checks.some((check) => check.key === 'env.database_url' && check.status === 'fail')).toBe(true);
  });

  it('reporta pass cuando checks obligatorios y opcionales están saludables', async () => {
    const service = new IsabellaReadinessService({
      probeDatabase: vi.fn().mockResolvedValue(undefined),
      probeFederatedContext: vi.fn().mockResolvedValue(undefined),
    });

    const originalJwt = process.env.JWT_SECRET;
    const originalDb = process.env.DATABASE_URL;
    const originalGh = process.env.GITHUB_TOKEN;
    process.env.JWT_SECRET = 'test-secret';
    process.env.DATABASE_URL = 'postgres://localhost:5432/testdb';
    process.env.GITHUB_TOKEN = 'ghp_test';

    const report = await service.run('OsoPanda1');

    process.env.JWT_SECRET = originalJwt;
    process.env.DATABASE_URL = originalDb;
    process.env.GITHUB_TOKEN = originalGh;

    expect(report.globalStatus).toBe('pass');
    expect(report.checks.some((check) => check.key === 'db.connectivity' && check.status === 'pass')).toBe(true);
    expect(report.checks.some((check) => check.key === 'federated.context' && check.status === 'pass')).toBe(true);
  });
});
