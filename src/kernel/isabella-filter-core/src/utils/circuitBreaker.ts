export interface CircuitBreakerOptions {
  failureThreshold: number;
  cooldownMs: number;
  successThreshold: number;
}

export class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private nextAttempt = 0;

  constructor(private readonly options: CircuitBreakerOptions) {}

  canRequest(): boolean {
    if (this.state === 'OPEN' && Date.now() > this.nextAttempt) {
      this.state = 'HALF_OPEN';
      return true;
    }

    return this.state !== 'OPEN';
  }

  recordSuccess(): void {
    this.failureCount = 0;

    if (this.state === 'HALF_OPEN') {
      this.successCount += 1;
      if (this.successCount >= this.options.successThreshold) {
        this.state = 'CLOSED';
        this.successCount = 0;
      }
    }
  }

  recordFailure(): void {
    this.failureCount += 1;

    if (this.failureCount >= this.options.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.options.cooldownMs;
    }
  }
}
