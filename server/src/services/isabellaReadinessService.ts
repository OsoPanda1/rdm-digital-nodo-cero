export type ReadinessStatus = 'pass' | 'warn' | 'fail';

export interface IsabellaReadinessCheck {
  key: string;
  required: boolean;
  status: ReadinessStatus;
  message: string;
}

export interface IsabellaReadinessReport {
  timestamp: string;
  owner: string;
  globalStatus: ReadinessStatus;
  checks: IsabellaReadinessCheck[];
  nextSteps: string[];
}

interface ReadinessDependencies {
  probeDatabase: () => Promise<void>;
  probeFederatedContext: (owner: string) => Promise<void>;
}

export class IsabellaReadinessService {
  constructor(private readonly deps: ReadinessDependencies = {
    probeDatabase: async () => {
      const { default: prisma } = await import('../lib/prisma');
      await prisma.$queryRaw`SELECT 1`;
    },
    probeFederatedContext: async (owner: string) => {
      const { isabellaFederatedContextService } = await import('./isabellaFederatedContextService');
      await isabellaFederatedContextService.buildContext('isabella readiness probe', {
        owner,
        maxRepos: 5,
        forceRefresh: true,
      });
    },
  }) {}

  async run(owner?: string): Promise<IsabellaReadinessReport> {
    const selectedOwner = owner ?? process.env.GITHUB_FEDERATION_OWNER ?? 'OsoPanda1';
    const checks: IsabellaReadinessCheck[] = [];

    checks.push({
      key: 'runtime.process',
      required: true,
      status: 'pass',
      message: 'Isabella runtime disponible para procesar prompts.',
    });

    const hasJwtSecret = Boolean(process.env.JWT_SECRET);
    checks.push({
      key: 'env.jwt_secret',
      required: true,
      status: hasJwtSecret ? 'pass' : 'fail',
      message: hasJwtSecret ? 'JWT_SECRET configurado.' : 'JWT_SECRET ausente.',
    });

    const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
    checks.push({
      key: 'env.database_url',
      required: true,
      status: hasDatabaseUrl ? 'pass' : 'fail',
      message: hasDatabaseUrl ? 'DATABASE_URL configurado.' : 'DATABASE_URL ausente.',
    });

    const hasGithubToken = Boolean(process.env.GITHUB_TOKEN);
    checks.push({
      key: 'env.github_token',
      required: false,
      status: hasGithubToken ? 'pass' : 'warn',
      message: hasGithubToken
        ? 'GITHUB_TOKEN configurado para evitar rate limits.'
        : 'GITHUB_TOKEN ausente, puede haber rate limiting.',
    });

    if (hasDatabaseUrl) {
      try {
        await this.deps.probeDatabase();
        checks.push({
          key: 'db.connectivity',
          required: true,
          status: 'pass',
          message: 'Conexión a base de datos verificada.',
        });
      } catch (error) {
        checks.push({
          key: 'db.connectivity',
          required: true,
          status: 'fail',
          message: `No se pudo conectar a BD: ${error instanceof Error ? error.message : 'error desconocido'}`,
        });
      }
    }

    try {
      await this.deps.probeFederatedContext(selectedOwner);
      checks.push({
        key: 'federated.context',
        required: false,
        status: 'pass',
        message: 'Contexto federado de GitHub operativo.',
      });
    } catch (error) {
      checks.push({
        key: 'federated.context',
        required: false,
        status: 'warn',
        message: `Contexto federado degradado: ${error instanceof Error ? error.message : 'error desconocido'}`,
      });
    }

    const hasRequiredFailure = checks.some((check) => check.required && check.status === 'fail');
    const hasWarning = checks.some((check) => check.status === 'warn');
    const globalStatus: ReadinessStatus = hasRequiredFailure ? 'fail' : hasWarning ? 'warn' : 'pass';

    const nextSteps = checks
      .filter((check) => check.status !== 'pass')
      .map((check) => `Resolver ${check.key}: ${check.message}`);

    return {
      timestamp: new Date().toISOString(),
      owner: selectedOwner,
      globalStatus,
      checks,
      nextSteps,
    };
  }
}

export const isabellaReadinessService = new IsabellaReadinessService();
