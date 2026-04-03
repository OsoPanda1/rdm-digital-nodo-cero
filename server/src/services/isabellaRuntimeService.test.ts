import { describe, expect, it } from 'vitest';
import { isabellaRuntimeService } from './isabellaRuntimeService';

describe('isabellaRuntimeService', () => {
  it('procesa mensaje y genera route plan + record', () => {
    const result = isabellaRuntimeService.process({
      userId: 'u-test',
      text: 'Estoy bloqueado con el deploy de mi API de TAMVAI',
    });

    expect(result.purifiedMessage.intent).toBe('consulta_tecnica');
    expect(result.purifiedMessage.routePlan).toContain('MiniAI_Arquitectura');
    expect(result.bookpiRecordId.length).toBeGreaterThan(10);
  });
});
