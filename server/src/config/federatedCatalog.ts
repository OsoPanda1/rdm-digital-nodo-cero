export type FederadoSecurityTier = 'quantum-hardened' | 'zk-verified' | 'standard';

export interface FederadoNode {
  id: string;
  nombre: string;
  federacion: string;
  repo: string;
  stack: string[];
  securityTier: FederadoSecurityTier;
  estado: 'active' | 'planned';
}

const CORE_REPOS = [
  'civilizational-core',
  'rdm-smart-city-os',
  'real-del-monte-twin',
  'rdm-digital-2dbd42b0',
  'real-del-monte-explorer',
  'RDM-Digital-X',
  'plataforma-real-del-monte',
  'tamv-digital-nexus',
  'real-del-monte-elevated',
  'citemesh-roots',
  'ecosistema-nextgen-tamv',
  'tamvonline-metanextgen',
  'new-beginnings',
  'utamv-elite-masterclass',
  'alamexa-design-system',
  'TAMV-ONLINE-NEXTGEN-1.0',
  'genesis-digytamv-nexus',
  'tamv-horizon',
  'DOCUMENTACION-TAMV-DM-X4-e-ISABELLA-AI',
  'tamv-universe-online',
  'unify-nexus-deployment',
  'web-4.0-genesis',
];

const FEDERADOS_BASE: Omit<FederadoNode, 'repo'>[] = [
  { id: 'dekateotl-ethical', nombre: 'Dekateotl™ Ético', federacion: 'Ethics', stack: ['TS', 'Node', 'SHAP'], securityTier: 'zk-verified', estado: 'active' },
  { id: 'anubis-sentinel', nombre: 'ANUBIS Sentinel™', federacion: 'Security', stack: ['TS', 'Node', 'ZK'], securityTier: 'quantum-hardened', estado: 'active' },
  { id: 'bookpi-ledger', nombre: 'BookPI™ Ledger', federacion: 'Memory', stack: ['TS', 'IPFS', 'MSR'], securityTier: 'zk-verified', estado: 'active' },
  { id: 'datagit-orchestrator', nombre: 'DataGit™ Orchestrator', federacion: 'Data', stack: ['TS', 'LangGraph'], securityTier: 'standard', estado: 'active' },
  { id: 'phoenix-protocol', nombre: 'Phoenix Protocol™', federacion: 'Swarm', stack: ['TS', 'libp2p'], securityTier: 'quantum-hardened', estado: 'active' },
  { id: 'mdd-credits', nombre: 'MDD + TAMV Credits™', federacion: 'Economy', stack: ['TS', 'EVM'], securityTier: 'zk-verified', estado: 'active' },
  { id: 'kaos-hyperrender', nombre: 'KAOS + HyperRender4D', federacion: 'XR', stack: ['TS', 'WebXR', 'WebNN'], securityTier: 'standard', estado: 'active' },
  { id: 'msr-blockchain', nombre: 'Blockchain MSR', federacion: 'Blockchain', stack: ['Go', 'EVM', 'Rollups'], securityTier: 'quantum-hardened', estado: 'active' },
  { id: 'dreamspaces-live', nombre: 'DreamSpaces Live Sync', federacion: 'XR', stack: ['WS', 'Unity', 'Unreal'], securityTier: 'standard', estado: 'active' },
  { id: 'autonomous-routing', nombre: 'Autonomous Router', federacion: 'Agents', stack: ['TS', 'Workers'], securityTier: 'zk-verified', estado: 'active' },
  { id: 'rag-memory', nombre: 'RAG Memory Engine', federacion: 'Memory', stack: ['TS', 'VectorDB'], securityTier: 'standard', estado: 'active' },
  { id: 'audit-provenance', nombre: 'Decision Provenance', federacion: 'Governance', stack: ['TS', 'PDF', 'AR'], securityTier: 'zk-verified', estado: 'active' },
  { id: 'p2p-guild', nombre: 'Gremio P2P', federacion: 'Community', stack: ['TS', 'DAO'], securityTier: 'standard', estado: 'active' },
  { id: 'oracle-finance', nombre: 'MSR Oracle Finance', federacion: 'Economy', stack: ['TS', 'Oracle'], securityTier: 'quantum-hardened', estado: 'active' },
  { id: 'multimodal-sse', nombre: 'Multimodal SSE Core', federacion: 'API', stack: ['REST', 'SSE'], securityTier: 'standard', estado: 'active' },
  { id: 'graphql-federation', nombre: 'GraphQL Federation', federacion: 'API', stack: ['GraphQL'], securityTier: 'zk-verified', estado: 'active' },
  { id: 'sdk-autogen', nombre: 'SDK AutoGen', federacion: 'DevEx', stack: ['OpenAPI', 'tRPC'], securityTier: 'standard', estado: 'active' },
  { id: 'quantum-token-gateway', nombre: 'Quantum Token Gateway', federacion: 'Security', stack: ['Dilithium-5'], securityTier: 'quantum-hardened', estado: 'active' },
  { id: 'web3-bridge', nombre: 'Web3 Standards Bridge', federacion: 'Blockchain', stack: ['IPFS', 'SNARKs'], securityTier: 'zk-verified', estado: 'active' },
  { id: 'geo-twin-sync', nombre: 'Geo Twin Sync', federacion: 'Maps', stack: ['Map', 'Telemetry'], securityTier: 'standard', estado: 'active' },
  { id: 'federado-21', nombre: 'Federado 21', federacion: 'Expansion', stack: ['TS'], securityTier: 'standard', estado: 'planned' },
  { id: 'federado-22', nombre: 'Federado 22', federacion: 'Expansion', stack: ['TS'], securityTier: 'standard', estado: 'planned' },
  { id: 'federado-23', nombre: 'Federado 23', federacion: 'Expansion', stack: ['TS'], securityTier: 'zk-verified', estado: 'planned' },
  { id: 'federado-24', nombre: 'Federado 24', federacion: 'Expansion', stack: ['TS'], securityTier: 'zk-verified', estado: 'planned' },
  { id: 'federado-25', nombre: 'Federado 25', federacion: 'Expansion', stack: ['TS'], securityTier: 'quantum-hardened', estado: 'planned' },
  { id: 'federado-26', nombre: 'Federado 26', federacion: 'Expansion', stack: ['TS'], securityTier: 'standard', estado: 'planned' },
  { id: 'federado-27', nombre: 'Federado 27', federacion: 'Expansion', stack: ['TS'], securityTier: 'standard', estado: 'planned' },
  { id: 'federado-28', nombre: 'Federado 28', federacion: 'Expansion', stack: ['TS'], securityTier: 'zk-verified', estado: 'planned' },
  { id: 'federado-29', nombre: 'Federado 29', federacion: 'Expansion', stack: ['TS'], securityTier: 'quantum-hardened', estado: 'planned' },
  { id: 'federado-30', nombre: 'Federado 30', federacion: 'Expansion', stack: ['TS'], securityTier: 'standard', estado: 'planned' },
  { id: 'federado-31', nombre: 'Federado 31', federacion: 'Expansion', stack: ['TS'], securityTier: 'standard', estado: 'planned' },
  { id: 'federado-32', nombre: 'Federado 32', federacion: 'Expansion', stack: ['TS'], securityTier: 'zk-verified', estado: 'planned' },
  { id: 'federado-33', nombre: 'Federado 33', federacion: 'Expansion', stack: ['TS'], securityTier: 'standard', estado: 'planned' },
  { id: 'federado-34', nombre: 'Federado 34', federacion: 'Expansion', stack: ['TS'], securityTier: 'quantum-hardened', estado: 'planned' },
  { id: 'federado-35', nombre: 'Federado 35', federacion: 'Expansion', stack: ['TS'], securityTier: 'standard', estado: 'planned' },
  { id: 'federado-36', nombre: 'Federado 36', federacion: 'Expansion', stack: ['TS'], securityTier: 'zk-verified', estado: 'planned' },
  { id: 'federado-37', nombre: 'Federado 37', federacion: 'Expansion', stack: ['TS'], securityTier: 'quantum-hardened', estado: 'planned' },
  { id: 'federado-38', nombre: 'Federado 38', federacion: 'Expansion', stack: ['TS'], securityTier: 'standard', estado: 'planned' },
  { id: 'federado-39', nombre: 'Federado 39', federacion: 'Expansion', stack: ['TS'], securityTier: 'zk-verified', estado: 'planned' },
  { id: 'federado-40', nombre: 'Federado 40', federacion: 'Expansion', stack: ['TS'], securityTier: 'standard', estado: 'planned' },
  { id: 'federado-41', nombre: 'Federado 41', federacion: 'Expansion', stack: ['TS'], securityTier: 'standard', estado: 'planned' },
  { id: 'federado-42', nombre: 'Federado 42', federacion: 'Expansion', stack: ['TS'], securityTier: 'quantum-hardened', estado: 'planned' },
  { id: 'federado-43', nombre: 'Federado 43', federacion: 'Expansion', stack: ['TS'], securityTier: 'zk-verified', estado: 'planned' },
  { id: 'federado-44', nombre: 'Federado 44', federacion: 'Expansion', stack: ['TS'], securityTier: 'standard', estado: 'planned' },
  { id: 'federado-45', nombre: 'Federado 45', federacion: 'Expansion', stack: ['TS'], securityTier: 'standard', estado: 'planned' },
  { id: 'federado-46', nombre: 'Federado 46', federacion: 'Expansion', stack: ['TS'], securityTier: 'zk-verified', estado: 'planned' },
  { id: 'federado-47', nombre: 'Federado 47', federacion: 'Expansion', stack: ['TS'], securityTier: 'quantum-hardened', estado: 'planned' },
  { id: 'federado-48', nombre: 'Federado 48', federacion: 'Expansion', stack: ['TS'], securityTier: 'standard', estado: 'planned' },
];

export const FEDERATED_CATALOG: FederadoNode[] = FEDERADOS_BASE.map((federado, index) => ({
  ...federado,
  repo: CORE_REPOS[index % CORE_REPOS.length],
}));
