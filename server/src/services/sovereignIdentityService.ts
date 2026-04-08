import crypto from 'crypto';

type IdentityRole =
  | 'visitante'
  | 'colaborador'
  | 'operador'
  | 'custodio'
  | 'auditor'
  | 'administrador-nucleo';

interface IdentityRecord {
  identityId: string;
  publicKey: string;
  roles: IdentityRole[];
  trustLevel: number;
  revoked: boolean;
  challenge?: string;
}

interface SessionRecord {
  token: string;
  identityId: string;
  createdAt: string;
  trustScore: number;
}

interface AuditRecord {
  event: string;
  identityId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export class SovereignIdentityService {
  private identities = new Map<string, IdentityRecord>();
  private sessions = new Map<string, SessionRecord>();
  private audit: AuditRecord[] = [];

  registerIdentity(input: { identityId: string; publicKey: string; roles?: IdentityRole[] }) {
    const roles = input.roles?.length ? input.roles : ['visitante'];
    const trustLevel = roles.includes('administrador-nucleo') ? 95 : 70;
    const record: IdentityRecord = {
      identityId: input.identityId,
      publicKey: input.publicKey,
      roles,
      trustLevel,
      revoked: false,
    };

    this.identities.set(input.identityId, record);
    this.log('identity.register', input.identityId, { roles });

    return {
      identityId: record.identityId,
      roles: record.roles,
      trustLevel: record.trustLevel,
    };
  }

  createChallenge(identityId: string) {
    const identity = this.identities.get(identityId);
    if (!identity || identity.revoked) {
      return null;
    }

    const challenge = crypto.randomBytes(32).toString('hex');
    identity.challenge = challenge;
    this.identities.set(identityId, identity);
    this.log('identity.challenge', identityId);

    return {
      identityId,
      challenge,
      algorithm: 'ed25519',
    };
  }

  verifyChallenge(input: { identityId: string; signatureBase64: string }) {
    const identity = this.identities.get(input.identityId);
    if (!identity || identity.revoked || !identity.challenge) {
      return null;
    }

    const isValid = crypto.verify(
      null,
      Buffer.from(identity.challenge),
      identity.publicKey,
      Buffer.from(input.signatureBase64, 'base64'),
    );

    if (!isValid) {
      this.log('identity.verify.failed', input.identityId);
      return { verified: false };
    }

    const token = crypto.randomBytes(24).toString('hex');
    const session: SessionRecord = {
      token,
      identityId: input.identityId,
      createdAt: new Date().toISOString(),
      trustScore: identity.trustLevel,
    };

    this.sessions.set(token, session);
    identity.challenge = undefined;
    this.identities.set(input.identityId, identity);
    this.log('identity.verify.success', input.identityId, { token });

    return {
      verified: true,
      sessionToken: token,
      trustScore: identity.trustLevel,
      roles: identity.roles,
    };
  }

  getSession(token?: string) {
    if (!token) {
      return null;
    }
    return this.sessions.get(token) ?? null;
  }

  getIdentity(identityId: string) {
    const identity = this.identities.get(identityId);
    if (!identity) {
      return null;
    }

    return {
      identityId: identity.identityId,
      roles: identity.roles,
      trustLevel: identity.trustLevel,
      revoked: identity.revoked,
    };
  }

  revokeIdentity(identityId: string) {
    const identity = this.identities.get(identityId);
    if (!identity) {
      return null;
    }

    identity.revoked = true;
    this.identities.set(identityId, identity);

    for (const [token, session] of this.sessions.entries()) {
      if (session.identityId === identityId) {
        this.sessions.delete(token);
      }
    }

    this.log('identity.revoke', identityId);

    return {
      identityId,
      revoked: true,
    };
  }

  getAuditTrail(limit = 100) {
    return this.audit.slice(-limit).reverse();
  }

  private log(event: string, identityId: string, metadata?: Record<string, unknown>) {
    this.audit.push({
      event,
      identityId,
      timestamp: new Date().toISOString(),
      metadata,
    });
  }
}

export const sovereignIdentityService = new SovereignIdentityService();
