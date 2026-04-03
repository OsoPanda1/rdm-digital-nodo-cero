import crypto from 'node:crypto';
import type {
  BookPIRecord,
  CleanResult,
  EmotionResult,
  IntentResult,
  MiniAIResponse,
  RawMessagePayload,
  RoutePlan,
} from '../types';
import { CircuitBreaker } from '../../utils/circuitBreaker';

export class BookPIClient {
  private readonly breaker = new CircuitBreaker({
    failureThreshold: 3,
    cooldownMs: 5_000,
    successThreshold: 2,
  });

  constructor(private readonly baseUrl: string, private readonly apiKey: string) {}

  async appendFromPipeline(
    payload: RawMessagePayload,
    clean: CleanResult,
    intent: IntentResult,
    emotion: EmotionResult,
    routePlan: RoutePlan,
    miniResults: MiniAIResponse[],
  ): Promise<void> {
    const record: BookPIRecord = {
      id: crypto.randomUUID(),
      userId: payload.userId,
      timestamp: new Date().toISOString(),
      rawHash: this.hash(payload.text),
      cleanText: clean.cleanedText,
      intent: intent.intent,
      emotion: emotion.dominant,
      routePlan,
      decisionSummary: `Mini AIs: ${miniResults.map((r) => r.miniAI).join(', ')}`,
    };

    await this.append(record);
  }

  async append(record: BookPIRecord): Promise<void> {
    if (!this.breaker.canRequest()) {
      return;
    }

    const tryRequest = async (): Promise<void> => {
      const response = await fetch(`${this.baseUrl}/v1/bookpi/append`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify(record),
      });

      if (!response.ok && response.status >= 500) {
        throw new Error(`BookPI 5xx: ${response.status}`);
      }
    };

    await this.retryWithBackoff(tryRequest);
  }

  private async retryWithBackoff(fn: () => Promise<void>): Promise<void> {
    const maxAttempts = 4;
    const baseMs = 150;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        await fn();
        this.breaker.recordSuccess();
        return;
      } catch (error) {
        this.breaker.recordFailure();
        if (attempt === maxAttempts) {
          throw error;
        }

        const delayMs = baseMs * 2 ** attempt;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  private hash(text: string): string {
    return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
  }
}
