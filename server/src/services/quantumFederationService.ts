import { FEDERATED_CATALOG, type FederadoNode } from '../config/federatedCatalog';

export interface FederatedPulse {
  federadoId: string;
  quantumLoad: number;
  integrity: number;
  latencyMs: number;
  timestamp: string;
}

export interface FederationOverview {
  totalFederados: number;
  activeFederados: number;
  plannedFederados: number;
  quantumHardened: number;
  zkVerified: number;
}

export class QuantumFederationService {
  getCatalog(): FederadoNode[] {
    return FEDERATED_CATALOG;
  }

  getOverview(): FederationOverview {
    const totalFederados = FEDERATED_CATALOG.length;
    const activeFederados = FEDERATED_CATALOG.filter((f) => f.estado === 'active').length;
    const plannedFederados = totalFederados - activeFederados;
    const quantumHardened = FEDERATED_CATALOG.filter((f) => f.securityTier === 'quantum-hardened').length;
    const zkVerified = FEDERATED_CATALOG.filter((f) => f.securityTier === 'zk-verified').length;

    return { totalFederados, activeFederados, plannedFederados, quantumHardened, zkVerified };
  }

  getPulse(federadoId: string): FederatedPulse | null {
    const federado = FEDERATED_CATALOG.find((item) => item.id === federadoId);
    if (!federado) return null;

    const seed = federadoId.length * 13;
    const quantumLoad = Number(((seed % 91) / 100 + 0.05).toFixed(2));
    const integrity = Number((1 - quantumLoad / 2).toFixed(2));
    const latencyMs = Math.max(18, Math.round((quantumLoad * 100 + seed) % 210));

    return {
      federadoId,
      quantumLoad,
      integrity,
      latencyMs,
      timestamp: new Date().toISOString(),
    };
  }
}

export const quantumFederationService = new QuantumFederationService();
