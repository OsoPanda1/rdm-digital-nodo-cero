import type { CleanResult, Emotion, EmotionResult } from '../types';

function neutralScores(): Record<Emotion, number> {
  return { amor: 0, tristeza: 0, miedo: 0, odio: 0, asombro: 0, neutral: 1 };
}

export async function classifyEmotion(clean: CleanResult, _audio?: Buffer): Promise<EmotionResult> {
  const text = clean.cleanedText.toLowerCase();
  const scores = neutralScores();

  if (text.includes('miedo') || text.includes('riesgo')) {
    scores.miedo = 0.8;
    scores.neutral = 0.2;
    return { dominant: 'miedo', scores };
  }

  if (text.includes('odio') || text.includes('rabia')) {
    scores.odio = 0.85;
    scores.neutral = 0.15;
    return { dominant: 'odio', scores };
  }

  if (text.includes('triste') || text.includes('bloqueado')) {
    scores.tristeza = 0.82;
    scores.neutral = 0.18;
    return { dominant: 'tristeza', scores };
  }

  if (text.includes('amor') || text.includes('gracias')) {
    scores.amor = 0.75;
    scores.neutral = 0.25;
    return { dominant: 'amor', scores };
  }

  return { dominant: 'neutral', scores };
}
