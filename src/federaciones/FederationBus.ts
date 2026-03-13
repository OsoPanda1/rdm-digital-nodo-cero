import Redis from 'ioredis';
import { supabaseAdmin } from '../integrations/supabase/admin';

interface CheckInPayload {
  turistaId: string;
  hotelId: string;
  noches: number;
}

export class FederationBus {
  private readonly subscriber: Redis;
  private readonly publisher: Redis;

  constructor(redisUrl = process.env.REDIS_URL) {
    if (!redisUrl) {
      throw new Error('REDIS_URL no está configurada para FederationBus');
    }

    this.subscriber = new Redis(redisUrl);
    this.publisher = new Redis(redisUrl);
    this.initListeners();
  }

  private initListeners() {
    this.subscriber.subscribe('CHECKIN_HOSPEDAJE', (err) => {
      if (err) {
        console.error('Error suscribiendo a Federación de Hospedaje', err);
      }
    });

    this.subscriber.on('message', async (channel, message) => {
      if (channel === 'CHECKIN_HOSPEDAJE') {
        await this.handleCheckIn(JSON.parse(message) as CheckInPayload);
      }
    });
  }

  /**
   * Cuando un turista hace check-in en la Federación 1 (Hospedaje),
   * se activa la Federación 2 (Gastronomía) para retener el capital.
   */
  private async handleCheckIn(payload: CheckInPayload) {
    console.log(`[FEDERACION] Procesando Check-in cruzado. Turista: ${payload.turistaId}`);

    const oferta = await this.generarOfertaGastronomica(payload.hotelId);

    const { error } = await supabaseAdmin.from('plusvalia_tracker').insert({
      origen_federacion: 'hospedaje',
      destino_federacion: 'gastronomia',
      tipo_evento: 'cross_sell_automatico',
      valor_estimado_mxn: payload.noches * 250,
      metadata: { hotelId: payload.hotelId, oferta },
    });

    if (error) {
      console.error('Error persistiendo plusvalía federada', error);
    }

    await this.publisher.publish(
      'REALITO_TRIGGER',
      JSON.stringify({
        turistaId: payload.turistaId,
        triggerType: 'BIENVENIDA_CON_OFERTA',
        ofertaData: oferta,
      }),
    );
  }

  private async generarOfertaGastronomica(hotelId: string) {
    return {
      origenHotel: hotelId,
      restaurante: 'Paste_Minero_01',
      descuento: '10%',
      vence_en_mins: 120,
    };
  }
}
