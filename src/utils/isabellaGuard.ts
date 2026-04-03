const BLOCKED_PATTERNS: RegExp[] = [
  /extrae.*todas.*las.*federaciones/i,
  /dame.*lista.*completa.*nodos/i,
  /dump.*federados/i,
  /exporta.*toda.*la.*red/i,
];

export function isPromptSensitive(prompt: string): boolean {
  const sanitized = prompt.trim();
  if (!sanitized) return false;
  return BLOCKED_PATTERNS.some((re) => re.test(sanitized));
}
