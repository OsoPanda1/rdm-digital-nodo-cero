export type Emotion = 'amor' | 'tristeza' | 'miedo' | 'odio' | 'asombro' | 'neutral';

export interface RawMessagePayload {
  userId: string;
  text: string;
  audioBuffer?: Buffer;
  metadata?: Record<string, unknown>;
}

export interface CleanResult {
  cleanedText: string;
  noiseScore: number;
  piiMasked: boolean;
}

export interface IntentResult {
  intent: string;
  confidence: number;
}

export interface EmotionResult {
  dominant: Emotion;
  scores: Record<Emotion, number>;
}

export interface RoutePlan {
  miniAIs: string[];
  flowSpeed: 'lento' | 'medio' | 'rapido';
}

export interface MiniAIOutput {
  kind: 'arquitectura' | 'emocional' | 'etico' | 'auditoria' | 'xr';
  data: Record<string, unknown>;
}

export interface MiniAIResponse {
  miniAI: string;
  payload: MiniAIOutput | { error: string };
}

export interface IsabellaInput {
  userId: string;
  cleanText: string;
  intent: IntentResult;
  emotion: EmotionResult;
  miniResults: MiniAIResponse[];
  metadata?: Record<string, unknown>;
}

export interface BookPIRecord {
  id: string;
  userId: string;
  timestamp: string;
  rawHash: string;
  cleanText: string;
  intent: string;
  emotion: Emotion;
  routePlan: RoutePlan;
  decisionSummary?: string;
}
