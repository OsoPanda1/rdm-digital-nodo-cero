import { describe, expect, it, vi } from 'vitest';
import { isValidFederationSignature, signFederationPayload } from './federationSignature';

describe('federationSignature', () => {
  it('firma y valida payload con FEDERATION_MASTER_KEY', () => {
    vi.stubEnv('FEDERATION_MASTER_KEY', 'tamv-master-key');

    const payload = { id: 'u-1', email: 'user@tamv.ai', role: 'admin' };
    const signature = signFederationPayload(payload);

    expect(signature).toHaveLength(64);
    expect(isValidFederationSignature({ ...payload, federationSig: signature })).toBe(true);
    expect(isValidFederationSignature({ ...payload, federationSig: 'broken-signature' })).toBe(false);
  });

  it('permite compatibilidad cuando no hay master key configurada', () => {
    vi.unstubAllEnvs();
    const payload = { id: 'u-2', email: 'legacy@tamv.ai', role: 'tourist' };
    expect(isValidFederationSignature(payload)).toBe(true);
  });
});
