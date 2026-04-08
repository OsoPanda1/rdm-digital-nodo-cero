import { describe, expect, it, vi } from 'vitest';
import { QuantumIntegrityLayerService } from './quantumIntegrityLayerService';

describe('QuantumIntegrityLayerService', () => {
  it('expone metadatos de la subcapa L6.Q', () => {
    const service = new QuantumIntegrityLayerService();
    const architecture = service.getArchitecture();

    expect(architecture.layerId).toBe('L6.Q');
    expect(architecture.systemModel).toContain('Q');
    expect(architecture.capabilities.length).toBeGreaterThan(2);
  });

  it('valida estado con corrección y cumplimiento de epsilon', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.95);
    const service = new QuantumIntegrityLayerService();

    const result = service.validateState({
      stateId: 'tamv-memory-state',
      bits: [1, 0, 1, 1],
      epsilon: 0.01,
      noiseProbability: 0.2,
    });

    expect(result.correctedBits).toEqual([1, 0, 1, 1]);
    expect(result.residualErrorProbability).toBe(0);
    expect(result.verified).toBe(true);
    expect(result.formula).toContain('P(error)');

    randomSpy.mockRestore();
  });

  it('simula resiliencia multi-ronda y retorna estado estable/degradado', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.95);
    const service = new QuantumIntegrityLayerService();

    const report = service.simulateResilience({
      stateId: 'tamv-ledger',
      bits: [1, 1, 0],
      epsilon: 0.02,
      noiseProbability: 0.15,
      rounds: 20,
    });

    expect(report.rounds).toBe(20);
    expect(report.passRate).toBe(1);
    expect(report.status).toBe('stable');
    expect(report.antifragilityIndex).toBe(1);

    randomSpy.mockRestore();
  });
});
