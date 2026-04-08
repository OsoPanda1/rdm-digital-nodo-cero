import { quantumIntegrityLayerService } from './quantumIntegrityLayerService';

export type AttackScenario =
  | 'replay_identity'
  | 'api_flood'
  | 'quantum_error_burst'
  | 'database_timeout'
  | 'federation_collapse'
  | 'session_hijack';

export class ResilienceSimulationService {
  getScenarios() {
    return [
      'replay_identity',
      'api_flood',
      'quantum_error_burst',
      'database_timeout',
      'federation_collapse',
      'session_hijack',
    ] as AttackScenario[];
  }

  runScenario(input: { scenario: AttackScenario; rounds?: number }) {
    const rounds = Math.max(1, Math.min(input.rounds ?? 10, 200));
    const quantum = quantumIntegrityLayerService.simulateResilience({
      stateId: `scenario-${input.scenario}`,
      bits: [1, 0, 1, 1, 0, 1],
      noiseProbability: input.scenario === 'quantum_error_burst' ? 0.25 : 0.1,
      epsilon: 0.08,
      rounds,
    });

    const detectionMs = input.scenario === 'api_flood' ? 350 : 210;
    const recoveryMs = quantum.status === 'stable' ? 680 : 2200;
    const integrityLoss = Number((1 - quantum.passRate).toFixed(4));

    return {
      scenario: input.scenario,
      rounds,
      initialState: 'operational',
      injectedFault: input.scenario,
      kernelReaction: quantum.status === 'stable' ? 'auto-corrected' : 'degraded-safe-mode',
      recovered: quantum.status === 'stable',
      detectionMs,
      recoveryMs,
      integrityLoss,
      preservedSessions: quantum.status === 'stable' ? 0.98 : 0.72,
      auditableEvents: rounds * 3,
      rollbackSuccessRate: quantum.status === 'stable' ? 0.99 : 0.81,
      finalResilienceScore: Number((Math.max(0, 1 - integrityLoss) * 100).toFixed(2)),
      quantum,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const resilienceSimulationService = new ResilienceSimulationService();
