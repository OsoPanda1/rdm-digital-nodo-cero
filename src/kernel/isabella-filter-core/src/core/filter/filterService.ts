import { BookPIClient } from '../bookpi/bookpiClient';
import { classifyEmotion } from '../emotion/emotionClassifier';
import { cleanNoise } from './noiseCleaner';
import { classifyIntent } from '../intent/intentClassifier';
import { routeMiniAIs, sortByPriority } from '../router/routerMiniAIs';
import type { EmotionResult, IsabellaInput, MiniAIResponse, RawMessagePayload, RoutePlan } from '../types';

export class FilterService {
  constructor(private readonly bookpi: BookPIClient) {}

  async handleIncoming(payload: RawMessagePayload): Promise<IsabellaInput> {
    const cleaned = cleanNoise(payload.text);
    const intent = await classifyIntent(cleaned);
    const emotion = await classifyEmotion(cleaned, payload.audioBuffer);
    const plan = this.computeRoutePlan(intent.intent, emotion);
    const miniResults = await this.runMiniAIs(plan, cleaned.cleanedText, payload.userId, emotion);

    const input: IsabellaInput = {
      userId: payload.userId,
      cleanText: cleaned.cleanedText,
      intent,
      emotion,
      miniResults,
      metadata: payload.metadata,
    };

    await this.bookpi.appendFromPipeline(payload, cleaned, intent, emotion, plan, miniResults);

    return input;
  }

  private computeRoutePlan(intent: string, emotion: EmotionResult): RoutePlan {
    const miniAIs: string[] = [];

    if (intent.includes('tecnica')) miniAIs.push('MiniAI_Arquitectura');
    if (emotion.dominant === 'tristeza' || emotion.dominant === 'miedo') miniAIs.push('MiniAI_Emocional');
    if (emotion.dominant === 'odio') miniAIs.push('MiniAI_Etico');

    const flowSpeed: RoutePlan['flowSpeed'] =
      emotion.dominant === 'tristeza' ? 'lento' : emotion.dominant === 'amor' || emotion.dominant === 'asombro' ? 'rapido' : 'medio';

    return { miniAIs: sortByPriority(miniAIs), flowSpeed };
  }

  private async runMiniAIs(
    plan: RoutePlan,
    text: string,
    userId: string,
    emotion: EmotionResult,
  ): Promise<MiniAIResponse[]> {
    const jobs = plan.miniAIs.map(async (name) => ({
      miniAI: name,
      payload: await routeMiniAIs(name, { text, userId, emotion }),
    }));

    return Promise.all(jobs);
  }
}
