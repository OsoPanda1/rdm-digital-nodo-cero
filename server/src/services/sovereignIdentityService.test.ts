import crypto from 'crypto';
import { describe, expect, it } from 'vitest';
import { SovereignIdentityService } from './sovereignIdentityService';

describe('SovereignIdentityService', () => {
  it('registra, desafía y verifica identidad con firma', () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
    const service = new SovereignIdentityService();

    const identity = service.registerIdentity({
      identityId: 'custodio-rdm',
      publicKey: publicKey.export({ type: 'spki', format: 'pem' }).toString(),
      roles: ['custodio'],
    });
    expect(identity.identityId).toBe('custodio-rdm');

    const challenge = service.createChallenge('custodio-rdm');
    expect(challenge?.challenge).toBeTruthy();

    const signature = crypto.sign(
      null,
      Buffer.from(challenge!.challenge),
      privateKey,
    ).toString('base64');

    const verification = service.verifyChallenge({
      identityId: 'custodio-rdm',
      signatureBase64: signature,
    });

    expect(verification?.verified).toBe(true);
    expect(verification?.sessionToken).toBeTruthy();

    const session = service.getSession(verification?.sessionToken);
    expect(session?.identityId).toBe('custodio-rdm');
  });
});
