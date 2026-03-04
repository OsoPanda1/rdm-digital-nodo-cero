import { Router, Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Newsletter subscription model (separate from User)
const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().optional().default('website'),
  name: z.string().optional()
});

// GET /api/newsletter/check - Check if email is subscribed
router.get('/check', async (req: Request, res: Response, next) => {
  try {
    const { email } = req.query;
    
    if (!email || typeof email !== 'string') {
      throw new AppError('Email is required', 400);
    }
    
    const subscriber = await prisma.analyticsEvent.findFirst({
      where: {
        eventType: 'newsletter_subscription',
        metadata: { path: ['email'], equals: email.toLowerCase() }
      }
    });
    
    res.json({
      success: true,
      data: { subscribed: !!subscriber }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/newsletter/subscribe - Subscribe to newsletter
router.post('/subscribe', async (req: Request, res: Response, next) => {
  try {
    const data = newsletterSchema.parse(req.body);
    const email = data.email.toLowerCase();
    
    // Check if already subscribed
    const existingSubscriber = await prisma.analyticsEvent.findFirst({
      where: {
        eventType: 'newsletter_subscription',
        metadata: { path: ['email'], equals: email }
      }
    });
    
    if (existingSubscriber) {
      throw new AppError('Email already subscribed', 409);
    }
    
    // Store subscription in analytics events (or create separate table in production)
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'newsletter_subscription',
        metadata: {
          email,
          source: data.source,
          name: data.name,
          subscribedAt: new Date().toISOString()
        },
        ipAddress: req.ip || undefined,
        userAgent: req.get('user-agent') || undefined
      }
    });
    
    // TODO: Integrate with external provider (Mailchimp, Brevo, etc.)
    // This would typically call the provider's API here
    const providerApiKey = process.env.NEWSLETTER_PROVIDER_API_KEY;
    if (providerApiKey) {
      // await subscribeToProvider(email, data.name);
      console.log('Would subscribe to provider:', email);
    }
    
    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: { email }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
});

// POST /api/newsletter/unsubscribe - Unsubscribe from newsletter
router.post('/unsubscribe', async (req: Request, res: Response, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      throw new AppError('Email is required', 400);
    }
    
    const emailLower = email.toLowerCase();
    
    // Find and mark as unsubscribed
    const subscription = await prisma.analyticsEvent.findFirst({
      where: {
        eventType: 'newsletter_subscription',
        metadata: { path: ['email'], equals: emailLower }
      }
    });
    
    if (!subscription) {
      throw new AppError('Email not found in subscriptions', 404);
    }
    
    // Update to mark as unsubscribed
    await prisma.analyticsEvent.update({
      where: { id: subscription.id },
      data: {
        metadata: {
          ...subscription.metadata as object,
          unsubscribedAt: new Date().toISOString()
        }
      }
    });
    
    // TODO: Call provider to unsubscribe
    const providerApiKey = process.env.NEWSLETTER_PROVIDER_API_KEY;
    if (providerApiKey) {
      console.log('Would unsubscribe from provider:', emailLower);
    }
    
    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/newsletter/webhook - Webhook for provider events (bounces, unsubscribes)
router.post('/webhook', async (req: Request, res: Response, next) => {
  try {
    const signature = req.headers['x-provider-signature'] as string;
    const webhookSecret = process.env.NEWSLETTER_WEBHOOK_SECRET;
    
    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(req.body, signature, webhookSecret);
      if (!isValid) {
        throw new AppError('Invalid webhook signature', 401);
      }
    }
    
    const { type, email } = req.body;
    
    switch (type) {
      case 'bounce':
        // Handle bounce
        console.log('Newsletter bounce for:', email);
        break;
      case 'unsubscribe':
        // Handle unsubscribe
        console.log('Newsletter unsubscribe for:', email);
        break;
      case 'complaint':
        // Handle spam complaint
        console.log('Newsletter complaint for:', email);
        break;
      default:
        console.log('Unknown newsletter webhook type:', type);
    }
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Helper function to verify webhook signature
function verifyWebhookSignature(body: any, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(body)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export default router;
