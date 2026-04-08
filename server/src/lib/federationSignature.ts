import crypto from 'crypto';

export const signFederationPayload = (payload: { id: string; email: string; role: string }): string => {
  const masterKey = process.env.FEDERATION_MASTER_KEY;
  if (!masterKey) {
    return 'federation-key-disabled';
  }

  const raw = `${payload.id}:${payload.email}:${payload.role}`;
  return crypto.createHmac('sha256', masterKey).update(raw).digest('hex');
};

export const isValidFederationSignature = (
  payload: { id: string; email: string; role: string; federationSig?: string },
): boolean => {
  const masterKey = process.env.FEDERATION_MASTER_KEY;
  if (!masterKey) {
    return true;
  }

  if (!payload.federationSig) {
    return false;
  }

  const expected = signFederationPayload(payload);
  if (payload.federationSig.length !== expected.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(payload.federationSig));
};
