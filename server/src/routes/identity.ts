import { Router } from 'express';
import { z } from 'zod';
import { sovereignIdentityService } from '../services/sovereignIdentityService';

const router = Router();

const registerSchema = z.object({
  identityId: z.string().min(3),
  publicKey: z.string().min(20),
  roles: z.array(z.enum(['visitante', 'colaborador', 'operador', 'custodio', 'auditor', 'administrador-nucleo'])).optional(),
});

router.post('/register', (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Payload inválido', details: parsed.error.issues });
  }

  return res.status(201).json(sovereignIdentityService.registerIdentity(parsed.data));
});

router.post('/challenge', (req, res) => {
  const parsed = z.object({ identityId: z.string().min(3) }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Payload inválido', details: parsed.error.issues });
  }

  const challenge = sovereignIdentityService.createChallenge(parsed.data.identityId);
  if (!challenge) {
    return res.status(404).json({ error: 'Identidad no encontrada o revocada' });
  }

  return res.json(challenge);
});

router.post('/verify', (req, res) => {
  const parsed = z
    .object({
      identityId: z.string().min(3),
      signatureBase64: z.string().min(10),
    })
    .safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Payload inválido', details: parsed.error.issues });
  }

  const verification = sovereignIdentityService.verifyChallenge(parsed.data);
  if (!verification) {
    return res.status(404).json({ error: 'No se pudo verificar la identidad' });
  }

  return res.json(verification);
});

router.get('/me', (req, res) => {
  const token = req.headers['x-session-token'];
  const session = sovereignIdentityService.getSession(typeof token === 'string' ? token : undefined);
  if (!session) {
    return res.status(401).json({ error: 'Sesión soberana inválida' });
  }

  const identity = sovereignIdentityService.getIdentity(session.identityId);
  return res.json({
    session,
    identity,
  });
});

router.get('/session', (req, res) => {
  const token = req.headers['x-session-token'];
  const session = sovereignIdentityService.getSession(typeof token === 'string' ? token : undefined);
  return res.json({
    active: Boolean(session),
    session,
  });
});

router.post('/revoke', (req, res) => {
  const parsed = z.object({ identityId: z.string().min(3) }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Payload inválido', details: parsed.error.issues });
  }

  const result = sovereignIdentityService.revokeIdentity(parsed.data.identityId);
  if (!result) {
    return res.status(404).json({ error: 'Identidad no encontrada' });
  }

  return res.json(result);
});

router.get('/audit', (req, res) => {
  const limit = Number(req.query.limit);
  const records = sovereignIdentityService.getAuditTrail(Number.isFinite(limit) ? limit : 100);
  return res.json({ records });
});

export default router;
