import type { EmotionResult, MiniAIOutput } from '../types';

export interface MiniAIInput {
  text: string;
  userId: string;
  emotion: EmotionResult;
}

interface MiniAIHandler {
  name: string;
  priority: number;
  handle(input: MiniAIInput): Promise<MiniAIOutput>;
}

const MiniAI_Arquitectura: MiniAIHandler = {
  name: 'MiniAI_Arquitectura',
  priority: 90,
  async handle() {
    return { kind: 'arquitectura', data: { summary: 'Análisis técnico preliminar TAMVAI/API.' } };
  },
};

const MiniAI_Emocional: MiniAIHandler = {
  name: 'MiniAI_Emocional',
  priority: 100,
  async handle(input) {
    return {
      kind: 'emocional',
      data: {
        suggestedTone: input.emotion.dominant === 'tristeza' ? 'suave' : 'neutral',
      },
    };
  },
};

const MiniAI_Etico: MiniAIHandler = {
  name: 'MiniAI_Etico',
  priority: 110,
  async handle() {
    return { kind: 'etico', data: { decision: 'allow', policy: 'dekateotl-baseline' } };
  },
};

const registry: Record<string, MiniAIHandler> = {
  [MiniAI_Arquitectura.name]: MiniAI_Arquitectura,
  [MiniAI_Emocional.name]: MiniAI_Emocional,
  [MiniAI_Etico.name]: MiniAI_Etico,
};

export function sortByPriority(names: string[]): string[] {
  return [...names].sort((a, b) => (registry[b]?.priority ?? 0) - (registry[a]?.priority ?? 0));
}

export async function routeMiniAIs(name: string, ctx: MiniAIInput): Promise<MiniAIOutput | { error: string }> {
  const handler = registry[name];
  if (!handler) {
    return { error: `Mini AI not found: ${name}` };
  }

  return handler.handle(ctx);
}
