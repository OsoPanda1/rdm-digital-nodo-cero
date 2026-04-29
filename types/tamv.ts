export interface TamvcrumLog {
  id: string;
  created_at: string;
  ecg_rhythm: number;
  impact_score: number;
  emotional_state: Record<string, unknown> | null;
  federation_id: number | null;
}

export interface EcgPoint {
  time: string;
  rhythm: number;
  pattern: string;
}
