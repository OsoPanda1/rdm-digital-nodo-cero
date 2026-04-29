export function traceDecision<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now();
    try {
      return fn(...args);
    } finally {
      const duration = Math.round(performance.now() - start);
      console.info(`[trace] decision duration_ms=${duration}`);
    }
  }) as T;
}
