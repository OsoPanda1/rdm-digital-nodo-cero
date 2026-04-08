import { describe, expect, it, vi } from 'vitest';
import { ResilienceSimulationService } from './resilienceSimulationService';

describe('ResilienceSimulationService', () => {
  it('expone catálogo de escenarios críticos', () => {
    const service = new ResilienceSimulationService();
    const scenarios = service.getScenarios();
    expect(scenarios).toContain('quantum_error_burst');
    expect(scenarios.length).toBeGreaterThanOrEqual(6);
  });

  it('ejecuta simulación y devuelve score de resiliencia', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const service = new ResilienceSimulationService();
    const report = service.runScenario({ scenario: 'api_flood', rounds: 15 });

    expect(report.rounds).toBe(15);
    expect(report.finalResilienceScore).toBeGreaterThan(90);
    expect(report.auditableEvents).toBe(45);
    expect(report.quantum.status).toBe('stable');

    randomSpy.mockRestore();
  });
});
