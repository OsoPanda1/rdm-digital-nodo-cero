import { Router, Response } from 'express';
import { z } from 'zod';
import Stripe from 'stripe';
import prisma from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

// Validation schemas
const createTipSchema = z.object({
  toType: z.enum(['app', 'business']),
  toBusinessId: z.string().optional(),
  amount: z.number().min(10, 'Minimum amount is 10 MXN'),
  currency: z.string().optional().default('MXN'),
  message: z.string().optional()
});

// GET /api/tips - List tips (for admin)
router.get('/', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { status, limit = '20', offset = '0' } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    // Only admins can see all tips
    if (req.user!.role !== 'admin') {
      where.fromUserId = req.user!.id;
    }

    const [tips, total] = await Promise.all([
      prisma.tip.findMany({
        where,
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          toBusiness: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string)
      }),
      prisma.tip.count({ where })
    ]);

    res.json({
      success: true,
      data: tips,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/tips/create-checkout-session - Create Stripe checkout session
router.post('/create-checkout-session', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const data = createTipSchema.parse(req.body);

    if (!stripe) {
      throw new AppError('Payment provider not configured', 503);
    }

    // Validate business exists if tip is to business
    if (data.toType === 'business' && data.toBusinessId) {
      const business = await prisma.business.findUnique({
        where: { id: data.toBusinessId }
      });

      if (!business) {
        throw new AppError('Business not found', 404);
      }
    }

    // Create tip record
    const tip = await prisma.tip.create({
      data: {
        fromUserId: req.user!.id,
        toType: data.toType,
        toBusinessId: data.toBusinessId,
        amount: data.amount,
        currency: data.currency,
        message: data.message,
        paymentProvider: 'stripe',
        providerPaymentId: '', // Will be updated after payment
        status: 'pending'
      }
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: data.currency.toLowerCase(),
            product_data: {
              name: data.toType === 'app' 
                ? 'Donación a RDM Digital' 
                : 'Apoyo a negocio',
              description: data.message || 'Gracias por tu apoyo!'
            },
            unit_amount: Math.round(data.amount * 100) // Stripe uses cents
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/apoya?success=true&tipId=${tip.id}`,
      cancel_url: `${process.env.FRONTEND_URL}/apoya?canceled=true`,
      metadata: {
        tipId: tip.id,
        userId: req.user!.id,
        toType: data.toType,
        toBusinessId: data.toBusinessId || ''
      }
    });

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
});

// POST /api/tips/create-business-upgrade-session - Create session for business premium upgrade
router.post('/create-business-upgrade-session', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { businessId } = req.body;

    if (!stripe) {
      throw new AppError('Payment provider not configured', 503);
    }

    // Find business
    const business = await prisma.business.findUnique({
      where: { id: businessId }
    });

    if (!business) {
      throw new AppError('Business not found', 404);
    }

    // Check ownership
    if (req.user!.role !== 'admin' && business.ownerId !== req.user!.id) {
      throw new AppError('Not authorized', 403);
    }

    // Get upgrade price from environment
    const upgradePrice = parseInt(process.env.BUSINESS_PREMIUM_PRICE || '99900'); // 999 MXN in cents

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: 'Upgrade a Negocio Destacado - RDM Digital',
              description: ' visibility premium en RDM Digital por 30 días'
            },
            unit_amount: upgradePrice
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/directorio?upgraded=true&businessId=${businessId}`,
      cancel_url: `${process.env.FRONTEND_URL}/directorio?canceled=true`,
      metadata: {
        type: 'business_upgrade',
        businessId,
        userId: req.user!.id
      }
    });

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/webhooks/payments - Stripe webhook handler
router.post('/webhooks/payments', async (req: Request, res: Response, next) => {
  try {
    if (!stripe) {
      throw new AppError('Payment provider not configured', 503);
    }

    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      if (webhookSecret && sig) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        // For testing without webhook signature
        event = req.body as Stripe.Event;
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send('Webhook signature verification failed');
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const tipId = session.metadata?.tipId;
        const businessId = session.metadata?.businessId;
        const userId = session.metadata?.userId;
        const type = session.metadata?.type;

        if (type === 'business_upgrade' && businessId) {
          // Update business to premium
          const premiumUntil = new Date();
          premiumUntil.setDate(premiumUntil.getDate() + 30); // 30 days

          await prisma.business.update({
            where: { id: businessId },
            data: {
              isPremium: true,
              premiumUntil
            }
          });

          console.log(`Business ${businessId} upgraded to premium`);
        } else if (tipId) {
          // Update tip status
          await prisma.tip.update({
            where: { id: tipId },
            data: {
              status: 'succeeded',
              providerPaymentId: session.payment_intent as string
            }
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Find and update tip
        const tip = await prisma.tip.findFirst({
          where: {
            providerPaymentId: paymentIntent.id
          }
        });

        if (tip) {
          await prisma.tip.update({
            where: { id: tip.id },
            data: { status: 'failed' }
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});

// GET /api/tips/:id - Get single tip
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;

    const tip = await prisma.tip.findUnique({
      where: { id },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        toBusiness: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!tip) {
      throw new AppError('Tip not found', 404);
    }

    // Check authorization
    if (req.user!.role !== 'admin' && tip.fromUserId !== req.user!.id) {
      throw new AppError('Not authorized', 403);
    }

    res.json({
      success: true,
      data: tip
    });
  } catch (error) {
    next(error);
  }
});

export default router;
