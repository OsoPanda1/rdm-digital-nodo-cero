import { bookpiStore, type Emotion } from './bookpiStore';

export interface IsabellaProcessInput {
  userId: string;
  text: string;
}

export interface IsabellaProcessOutput {
  purifiedMessage: {
    cleanInput: string;
    intent: string;
    emotion: Emotion;
    routePlan: string[];
  };
  miniResults: Record<string, unknown>[];
  finalResponse: string;
  bookpiRecordId: string;
}

export class IsabellaRuntimeService {
  process(input: IsabellaProcessInput): IsabellaProcessOutput {
    const cleanInput = this.cleanNoise(input.text);
    const intent = this.classifyIntent(cleanInput);
    const emotion = this.classifyEmotion(cleanInput);
    const routePlan = this.computeRoute(intent, emotion);
    const miniResults = this.executeMiniAIs(routePlan, cleanInput, emotion);
    const finalResponse = this.synthesize(cleanInput, intent, emotion, miniResults);

    const record = bookpiStore.append({
      userId: input.userId,
      cleanInput,
      intent,
      emotion,
      routePlan,
      miniResults,
    });

    return {
      purifiedMessage: { cleanInput, intent, emotion, routePlan },
      miniResults,
      finalResponse,
      bookpiRecordId: record.id,
    };
  }

  private cleanNoise(text: string): string {
    return text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/(.)\1{3,}/g, '$1$1')
      .trim();
  }

  private classifyIntent(text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes('api') || lower.includes('arquitectura') || lower.includes('deploy')) return 'consulta_tecnica';
    if (lower.includes('bloqueado') || lower.includes('triste') || lower.includes('ansiedad')) return 'contencion_emocional';
    if (lower.includes('fraude') || lower.includes('riesgo')) return 'seguridad';
    return 'general';
  }

  private classifyEmotion(text: string): Emotion {
    const lower = text.toLowerCase();
    if (lower.includes('miedo') || lower.includes('ansiedad')) return 'miedo';
    if (lower.includes('odio') || lower.includes('rabia')) return 'odio';
    if (lower.includes('triste') || lower.includes('bloqueado')) return 'tristeza';
    if (lower.includes('amor') || lower.includes('gracias')) return 'amor';
    if (lower.includes('wow') || lower.includes('asombro')) return 'asombro';
    return 'neutral';
  }

  private computeRoute(intent: string, emotion: Emotion): string[] {
    const routePlan: string[] = ['MiniAI_Auditoria'];
    if (intent === 'consulta_tecnica') routePlan.push('MiniAI_Arquitectura');
    if (intent === 'seguridad' || emotion === 'miedo' || emotion === 'odio') routePlan.push('MiniAI_Etico', 'ANUBIS_Sentinel');
    if (emotion === 'tristeza' || emotion === 'amor') routePlan.push('MiniAI_Emocional');
    return Array.from(new Set(routePlan));
  }

  private executeMiniAIs(routePlan: string[], cleanInput: string, emotion: Emotion): Record<string, unknown>[] {
    return routePlan.map((agent) => ({
      agent,
      score: Number((cleanInput.length / 100).toFixed(2)),
      emotion,
      recommendation: this.buildRecommendation(agent, emotion),
    }));
  }

  private buildRecommendation(agent: string, emotion: Emotion): string {
    if (agent === 'MiniAI_Etico') return 'Aplicar validación ética reforzada y trazabilidad MSR';
    if (agent === 'ANUBIS_Sentinel') return 'Ejecutar validaciones de riesgo y rate-limit';
    if (agent === 'MiniAI_Arquitectura') return 'Proponer plan técnico incremental compatible con TAMVAI';
    if (agent === 'MiniAI_Emocional' && emotion === 'tristeza') return 'Responder con tono contenedor y pasos concretos';
    return 'Registrar resultado en BookPI para auditoría';
  }

  private synthesize(
    cleanInput: string,
    intent: string,
    emotion: Emotion,
    miniResults: Record<string, unknown>[],
  ): string {
    const agents = miniResults.map((result) => String(result.agent)).join(', ');
    return `Isabella procesó: "${cleanInput}" | intent=${intent} | emotion=${emotion} | agentes=${agents}`;
  }
}

export const isabellaRuntimeService = new IsabellaRuntimeService();
