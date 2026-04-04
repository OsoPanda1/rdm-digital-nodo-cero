import crypto from 'crypto';
import { Router, Response } from 'express';
import { z } from 'zod';
import Stripe from 'stripe';

import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, optionalAuth, requireAuth } from '../middleware/auth';

const router = Router();

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

const createCheckoutSchema = z.object({
  songId: z.string().uuid('ID de canción inválido'),
  amount: z.number().int().min(10, 'El monto mínimo es 10 MXN').max(50000, 'El monto máximo es 50,000 MXN'),
});

router.get('/songs', optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const songs = await prisma.song.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        basePrice: true,
        audioUrl: true,
        coverUrl: true,
        createdAt: true,
      },
    });

    if (req.user?.id) {
      await prisma.analyticsEvent.create({
        data: {
          userId: req.user.id,
          eventType: 'song_catalog_viewed',
          metadata: { scope: 'music_catalog' },
          ipAddress: req.ip,
          userAgent: req.get('user-agent') || undefined,
        },
      });
    }

    res.json({ success: true, data: songs });
  } catch (error) {
    next(error);
  }
});

router.post('/checkout', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    if (!stripe) {
      throw new AppError('Payment processing not configured', 503);
    }

    const { songId, amount } = createCheckoutSchema.parse(req.body);

    const song = await prisma.song.findFirst({
      where: { id: songId, isActive: true },
    });

    if (!song) {
      throw new AppError('Canción no encontrada', 404);
    }

    if (amount < song.basePrice) {
      throw new AppError(`El apoyo mínimo para esta canción es ${song.basePrice} MXN`, 400);
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: song.title,
              description: song.description || 'Activo cultural de RDM',
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${frontendUrl}/musica?success=true`,
      cancel_url: `${frontendUrl}/musica?canceled=true`,
      metadata: {
        type: 'song_purchase',
        userId: req.user!.id,
        songId,
      },
    });

    const purchase = await prisma.songPurchase.create({
      data: {
        userId: req.user!.id,
        songId,
        amount,
        stripeSessionId: session.id,
        status: 'pending',
      },
    });

    const ledgerPayload = {
      purchaseId: purchase.id,
      userId: req.user!.id,
      songId,
      amount,
      stripeSessionId: session.id,
    };

    const hash = crypto.createHash('sha256').update(JSON.stringify(ledgerPayload)).digest('hex');

    await prisma.bookpiLedger.create({
      data: {
        eventType: 'song_purchase_created',
        payload: ledgerPayload,
        hash,
      },
    });

    await prisma.analyticsEvent.create({
      data: {
        userId: req.user!.id,
        eventType: 'checkout_initiated',
        metadata: { songId, amount, purchaseId: purchase.id },
        ipAddress: req.ip,
        userAgent: req.get('user-agent') || undefined,
      },
    });

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
      return;
    }

    next(error);
  }
});

router.post('/webhook', async (req, res, next) => {
  try {
    if (!stripe) {
      throw new AppError('Payment processing not configured', 503);
    }

    const sig = req.headers['stripe-signature'] as string | undefined;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = req.body as Stripe.Event;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const purchase = await prisma.songPurchase.findUnique({
        where: { stripeSessionId: session.id },
      });

      if (purchase) {
        await prisma.songPurchase.update({
          where: { id: purchase.id },
          data: {
            status: 'paid',
            stripePaymentId: (session.payment_intent as string) || null,
          },
        });

        const payload = {
          sessionId: session.id,
          paymentIntent: session.payment_intent,
          amountTotal: session.amount_total,
          purchaseId: purchase.id,
        };
        const hash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');

        await prisma.bookpiLedger.create({
          data: {
            eventType: 'payment_confirmed',
            payload,
            hash,
          },
        });

        await prisma.analyticsEvent.create({
          data: {
            userId: purchase.userId,
            eventType: 'payment_success',
            metadata: { purchaseId: purchase.id, songId: purchase.songId, amount: purchase.amount },
          },
        });
      }
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
