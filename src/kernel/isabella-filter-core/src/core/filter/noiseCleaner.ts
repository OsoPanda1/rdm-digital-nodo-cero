import type { CleanResult } from '../types';

const RE_HTML = /<[^>]*>/g;
const RE_MULTI_SPACE = /\s+/g;
const RE_REPEAT_CHARS = /(.)\1{3,}/g;
const RE_EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

export function cleanNoise(text: string): CleanResult {
  let cleaned = text.replace(RE_HTML, ' ');
  cleaned = cleaned.replace(RE_MULTI_SPACE, ' ').trim();
  cleaned = cleaned.replace(RE_REPEAT_CHARS, '$1$1');

  const hadPII = RE_EMAIL.test(cleaned);
  cleaned = cleaned.replace(RE_EMAIL, '[EMAIL_MASKED]');

  if (cleaned.length > 4000) {
    cleaned = `${cleaned.slice(0, 4000)} …[TRUNCATED]`;
  }

  return {
    cleanedText: cleaned,
    noiseScore: computeNoiseScore(text, cleaned),
    piiMasked: hadPII,
  };
}

function computeNoiseScore(original: string, cleaned: string): number {
  const diff = Math.max(0, original.length - cleaned.length);
  return Math.min(1, diff / Math.max(1, original.length));
}
