import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Explore endpoint operativo',
    modules: ['turismo', 'cultura', 'negocios', 'notitamv', 'dreamspaces'],
  });
});

export default router;
