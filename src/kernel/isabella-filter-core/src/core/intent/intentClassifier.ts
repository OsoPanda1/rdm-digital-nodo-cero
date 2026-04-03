import type { CleanResult, IntentResult } from '../types';

export async function classifyIntent(clean: CleanResult): Promise<IntentResult> {
  const text = clean.cleanedText.toLowerCase();

  if (text.includes('api') || text.includes('arquitectura') || text.includes('endpoint')) {
    return { intent: 'consulta_tecnica', confidence: 0.9 };
  }

  if (text.includes('triste') || text.includes('bloqueado') || text.includes('ansiedad')) {
    return { intent: 'contencion_emocional', confidence: 0.85 };
  }

  return { intent: 'general', confidence: 0.7 };
}
