import { Router, Request, Response } from 'express';
import { z } from 'zod';
import Stripe from 'stripe';
import prisma from '../lib/prisma';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Initialize Stripe (will be null if no API key)
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

// Validation schemas
const donationCheckoutSchema = z.object({
  amount: z.number().min(50, 'Minimum donation is 50 MXN'), // 50 cents minimum
  currency: z.string().optional().default('mxn'),
  message: z.string().optional()
});

const premiumCheckoutSchema = z.object({
  businessId: z.string().uuid('Invalid business ID'),
  plan: z.enum(['monthly', 'yearly']).default('monthly')
});

// Prices (in cents)
const PREMIUM_PRICES = {
  monthly: {
    mxn: 9900, // 99 MXN per month
    usd: 599   // $5.99 per month
  },
  yearly: {
    mxn: 99000, // 990 MXN per year
    usd: 4999   // $49.99 per year
  }
};

// GET /api/payments/config - Get payment configuration
router.get('/config', async (req: Request, res: Response, next) => {
  try {
    res.json({
      success: true,
      data: {
        stripePublicKey: process.env.STRIPE_PUBLIC_KEY || '',
        currency: 'mxn',
        premiumPrices: PREMIUM_PRICES,
        donationMin: 50
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/payments/donations/checkout - Create donation checkout session
router.post('/donations/checkout', optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const data = donationCheckoutSchema.parse(req.body);
    
    if (!stripe) {
      throw new AppError('Payment processing not configured', 503);
    }

    const userId = req.user?.id;
    const { amount, currency, message } = data;
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'Donación a RDM Digital',
              description: 'Apoya el desarrollo de la plataforma turística de Real del Monte'
            },
            unit_amount: amount * 100 // Convert to cents
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/apoya?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/apoya?canceled=true`,
      metadata: {
        type: 'donation',
        userId: userId || '',
        message: message || ''
      }
    });

    // Create pending donation record
    await prisma.donation.create({
      data: {
        userId: userId || null,
        amount,
        currency: currency.toUpperCase(),
        type: 'donation',
        status: 'pending',
        stripeSessionId: session.id,
        message: message || null
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

// POST /api/payments/business/checkout - Create premium business checkout session
router.post('/business/checkout', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const data = premiumCheckoutSchema.parse(req.body);
    
    if (!stripe) {
      throw new AppError('Payment processing not configured', 503);
    }

    const { businessId, plan } = data;
    const userId = req.user!.id;
    
    // Verify business ownership
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: userId
      }
    });

    if (!business) {
      throw new AppError('Business not found or not owned by you', 404);
    }

    // Get currency from request or default to MXN
    const currency = (req.body.currency || 'mxn').toLowerCase();
    const price = PREMIUM_PRICES[plan][currency as keyof typeof PREMIUM_PRICES.monthly];
    
    if (!price) {
      throw new AppError('Invalid currency', 400);
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Premium ${plan === 'monthly' ? 'Mensual' : 'Anual'} - ${business.name}`,
              description: plan === 'monthly' 
                ? 'Destaca tu negocio con Premium mensual' 
                : 'Destaca tu negocio con Premium anual'
            },
            unit_amount: price
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/directorio/${businessId}?premium=success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/directorio/${businessId}?premium=canceled`,
      metadata: {
        type: 'premium',
        businessId,
        userId,
        plan
      }
    });

    // Create pending donation (premium payment)
    await prisma.donation.create({
      data: {
        userId,
        businessId,
        amount: price / 100, // Convert from cents
        currency: currency.toUpperCase(),
        type: 'premium',
        status: 'pending',
        stripeSessionId: session.id
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

// POST /api/payments/webhook - Stripe webhook handler
router.post('/webhook', async (req: Request, res: Response, next) => {
  try {
    if (!stripe) {
      throw new AppError('Payment processing not configured', 503);
    }

    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    // Verify webhook signature
    if (webhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        res.status(400).send(`Webhook Error: ${err}`);
        return;
      }
    } else {
      // For testing without webhook secret
      event = req.body as Stripe.Event;
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Find the pending donation
        const donation = await prisma.donation.findFirst({
          where: { stripeSessionId: session.id }
        });

        if (donation) {
          // Update donation status
          await prisma.donation.update({
            where: { id: donation.id },
            data: {
              status: 'completed',
              stripePaymentId: session.payment_intent as string,
              stripeCustomerId: session.customer as string || undefined
            }
          });

          // If it's a premium payment, update the business
          if (donation.type === 'premium' && donation.businessId) {
            const plan = session.metadata?.plan || 'monthly';
            const premiumUntil = new Date();
            
            if (plan === 'yearly') {
              premiumUntil.setFullYear(premiumUntil.getFullYear() + 1);
            } else {
              premiumUntil.setMonth(premiumUntil.getMonth() + 1);
            }

            await prisma.business.update({
              where: { id: donation.businessId },
              data: {
                isPremium: true,
                premiumUntil
              }
            });
          }

          // Log analytics
          await prisma.analyticsEvent.create({
            data: {
              userId: donation.userId,
              eventType: 'payment_completed',
              metadata: {
                donationId: donation.id,
                type: donation.type,
                amount: donation.amount,
                currency: donation.currency
              }
            }
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Find and update failed donation
        const donation = await prisma.donation.findFirst({
          where: { stripePaymentId: paymentIntent.id }
        });

        if (donation) {
          await prisma.donation.update({
            where: { id: donation.id },
            data: { status: 'failed' }
          });
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        
        // Find and update refunded donation
        const donation = await prisma.donation.findFirst({
          where: { stripePaymentId: charge.payment_intent as string }
        });

        if (donation) {
          await prisma.donation.update({
            where: { id: donation.id },
            data: { status: 'refunded' }
          });

          // If it was premium, remove premium status
          if (donation.type === 'premium' && donation.businessId) {
            await prisma.business.update({
              where: { id: donation.businessId },
              data: {
                isPremium: false,
                premiumUntil: null
              }
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// GET /api/payments/donations - Get user's donations (admin or own)
router.get('/donations', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const isAdmin = req.user!.role === 'admin';

    const donations = await prisma.donation.findMany({
      where: isAdmin ? {} : { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        business: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: donations
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/payments/donations/:id - Get single donation
router.get('/donations/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const isAdmin = req.user!.role === 'admin';

    const donation = await prisma.donation.findFirst({
      where: isAdmin ? { id } : { id, userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        business: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!donation) {
      throw new AppError('Donation not found', 404);
    }

    res.json({
      success: true,
      data: donation
    });
  } catch (error) {
    next(error);
  }
});

export default router;
