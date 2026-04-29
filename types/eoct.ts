export interface FederationNode {
  id: string;
  created_at: string;
  federation_id: number;
  ecg_rhythm: number;
  quantum_hash: string;
  status?: "OK" | "SATURATING" | "OFFLINE" | "BOOTSTRAP";
}
