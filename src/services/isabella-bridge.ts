const API_BASE = "/api/v1";

export type FederatedStatus = "active" | "degraded" | "down" | "planned";

export interface FederatedNode {
  id: string;
  name: string;
  status: FederatedStatus;
  latency: number;
}

export interface BookPIRecord {
  hash: string;
  previousHash: string;
  prompt: string;
  userId: string;
  route: string[];
  timestamp: string;
}

interface FederatedCatalogResponse {
  items?: Array<{
    id: string;
    nombre?: string;
    name?: string;
    estado?: FederatedStatus;
    status?: FederatedStatus;
    avgLatencyMs?: number;
    latency?: number;
  }>;
}

interface IsabellaProcessResponse {
  response?: string;
  output?: string;
}

interface BookPIResponse {
  latest?: Array<{
    hash: string;
    previousHash: string;
    input: string;
    userId: string;
    route: string[];
    createdAt: string;
  }>;
}

function mapNode(node: NonNullable<FederatedCatalogResponse["items"]>[number]): FederatedNode {
  return {
    id: node.id,
    name: node.name ?? node.nombre ?? "Nodo desconocido",
    status: node.status ?? node.estado ?? "down",
    latency: node.latency ?? node.avgLatencyMs ?? 0,
  };
}

function mapRecord(record: NonNullable<BookPIResponse["latest"]>[number]): BookPIRecord {
  return {
    hash: record.hash,
    previousHash: record.previousHash,
    prompt: record.input,
    userId: record.userId,
    route: record.route,
    timestamp: record.createdAt,
  };
}

export const IsabellaBridge = {
  async processPrompt(prompt: string, userId: string): Promise<IsabellaProcessResponse> {
    const response = await fetch(`${API_BASE}/isabella/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: prompt,
        userId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Isabella process failed");
    }

    return response.json();
  },

  async getFederatedPulse(): Promise<FederatedNode[]> {
    const response = await fetch(`${API_BASE}/federados/catalog`);
    if (!response.ok) throw new Error("Federated catalog error");

    const payload = (await response.json()) as FederatedCatalogResponse;
    return (payload.items ?? []).map(mapNode);
  },

  async getBookPILedger(): Promise<BookPIRecord[]> {
    const response = await fetch(`${API_BASE}/isabella/bookpi`);
    if (!response.ok) throw new Error("BookPI fetch error");

    const payload = (await response.json()) as BookPIResponse;
    return (payload.latest ?? []).map(mapRecord);
  },
};
