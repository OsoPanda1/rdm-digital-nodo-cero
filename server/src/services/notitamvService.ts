import crypto from 'crypto';

export type DeliveryChannel = 'push' | 'webpush' | 'iot' | 'xr';

export interface NotitamvRequest {
  title: string;
  message: string;
  locale?: string;
  eventType: 'celebration' | 'alert' | 'community' | 'reminder';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  mood?: 'festive' | 'neutral' | 'ceremonial' | 'emergency';
  preferredChannels?: DeliveryChannel[];
  userId?: string;
}

interface SonicProfile {
  id: string;
  label: string;
  genres: string[];
  spatialAudio: '2D' | '3D' | 'Atmos';
}

export interface NotitamvDecision {
  traceId: string;
  selectedChannel: DeliveryChannel;
  fallbackChannels: DeliveryChannel[];
  sonicProfile: SonicProfile;
  visualEffect: string;
  priorityScore: number;
  policy: {
    storeAnalytics: boolean;
    retentionHours: number;
  };
  sourceBlueprints: string[];
}

const CHANNEL_WEIGHTS: Record<DeliveryChannel, number> = {
  push: 0.86,
  webpush: 0.78,
  iot: 0.72,
  xr: 0.88,
};

const URGENCY_WEIGHT: Record<NotitamvRequest['urgency'], number> = {
  low: 0.4,
  medium: 0.65,
  high: 0.84,
  critical: 0.98,
};

const sonicProfiles: Record<NotitamvRequest['eventType'], SonicProfile[]> = {
  celebration: [
    { id: 'alma-cumbia', label: 'Alma Cumbia Solar', genres: ['cumbia', 'electro-latino'], spatialAudio: 'Atmos' },
    { id: 'fiesta-andina', label: 'Fiesta Andina Viva', genres: ['andino', 'percusión'], spatialAudio: '3D' },
  ],
  alert: [
    { id: 'guardian-latam', label: 'Guardían LATAM', genres: ['minimal', 'synth'], spatialAudio: '2D' },
    { id: 'sirena-clara', label: 'Sirena Clara', genres: ['ambient', 'pulse'], spatialAudio: '3D' },
  ],
  community: [
    { id: 'raiz-conecta', label: 'Raíz Conecta', genres: ['folk digital', 'ambient'], spatialAudio: '3D' },
    { id: 'barrio-wave', label: 'Barrio Wave', genres: ['neo-perreo', 'lofi'], spatialAudio: '2D' },
  ],
  reminder: [
    { id: 'brisa-pacifico', label: 'Brisa del Pacífico', genres: ['soft marimba', 'ambient'], spatialAudio: '2D' },
    { id: 'campana-maya', label: 'Campana Maya', genres: ['ritual', 'chill'], spatialAudio: '3D' },
  ],
};

const sourceBlueprints = [
  'https://github.com/plurigrid/ontology',
  'https://github.com/Variable-Fox/ASAN-Architecture',
  'https://github.com/masamitsunamioka-a11y/autopoietic-autonomous-intelligence',
];

export class NotitamvService {
  private orchestrations = 0;

  public orchestrate(payload: NotitamvRequest): NotitamvDecision {
    this.orchestrations += 1;

    const requestedChannels = payload.preferredChannels?.length ? payload.preferredChannels : (['push', 'webpush', 'xr'] satisfies DeliveryChannel[]);
    const urgencyFactor = URGENCY_WEIGHT[payload.urgency];

    const rankedChannels = requestedChannels
      .map((channel) => ({
        channel,
        score: CHANNEL_WEIGHTS[channel] * urgencyFactor + (channel === 'xr' && payload.eventType === 'celebration' ? 0.1 : 0),
      }))
      .sort((a, b) => b.score - a.score);

    const selectedChannel = rankedChannels[0]?.channel ?? 'push';
    const fallbackChannels = rankedChannels.slice(1).map((item) => item.channel);

    const profileList = sonicProfiles[payload.eventType];
    const sonicProfile = payload.urgency === 'critical' ? profileList[0] : profileList[Math.min(profileList.length - 1, this.orchestrations % profileList.length)];

    return {
      traceId: `notitamv-${crypto.randomUUID()}`,
      selectedChannel,
      fallbackChannels,
      sonicProfile,
      visualEffect: this.pickVisualEffect(payload),
      priorityScore: Number((urgencyFactor * 100).toFixed(1)),
      policy: {
        storeAnalytics: payload.urgency !== 'critical',
        retentionHours: payload.urgency === 'critical' ? 6 : 72,
      },
      sourceBlueprints,
    };
  }

  public getStats() {
    return {
      orchestrations: this.orchestrations,
      supportedChannels: Object.keys(CHANNEL_WEIGHTS),
      identity: 'NOTITAMV — Pulso sensorial latino',
    };
  }

  private pickVisualEffect(payload: NotitamvRequest): string {
    if (payload.eventType === 'celebration') return 'particle-carnaval-wave';
    if (payload.urgency === 'critical') return 'focus-ring-red-alert';
    if (payload.eventType === 'community') return 'aurora-latam-gradient';
    return 'soft-pulse-gold';
  }
}

export const notitamvService = new NotitamvService();
