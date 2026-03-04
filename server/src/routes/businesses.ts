import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Validation schemas
const createBusinessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  imageUrl: z.string().url().optional(),
  website: z.string().url().optional().nullable(),
  email: z.string().email().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

const updateBusinessSchema = createBusinessSchema.partial();

// GET /api/businesses - List all businesses with filters
router.get('/', async (req, res, next) => {
  try {
    const { category, isPremium, search, limit = '20', offset = '0' } = req.query;

    const where: any = {
      isActive: true
    };

    if (category) {
      where.category = category;
    }

    if (isPremium === 'true') {
      where.isPremium = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: [
          { isPremium: 'desc' },
          { createdAt: 'desc' }
        ],
        take: parseInt(limit as string),
        skip: parseInt(offset as string)
      }),
      prisma.business.count({ where })
    ]);

    res.json({
      success: true,
      data: businesses,
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

// GET /api/businesses/categories - Get all unique categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.business.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category']
    });

    res.json({
      success: true,
      data: categories.map(c => c.category)
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/businesses/:id - Get single business
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const business = await prisma.business.findFirst({
      where: {
        id,
        isActive: true
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tipsReceived: {
          where: { status: 'succeeded' },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!business) {
      throw new AppError('Business not found', 404);
    }

    res.json({
      success: true,
      data: business
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/businesses - Create new business
router.post('/', requireAuth, requireRole('business_owner', 'admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const data = createBusinessSchema.parse(req.body);

    // Check if user already has a business
    const existingBusiness = await prisma.business.findUnique({
      where: { ownerId: req.user!.id }
    });

    if (existingBusiness) {
      throw new AppError('You already have a business registered', 409);
    }

    const business = await prisma.business.create({
      data: {
        ...data,
        ownerId: req.user!.id
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: business
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
});

// PUT /api/businesses/:id - Update business
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const data = updateBusinessSchema.parse(req.body);

    // Find business
    const business = await prisma.business.findUnique({
      where: { id }
    });

    if (!business) {
      throw new AppError('Business not found', 404);
    }

    // Check authorization
    if (req.user!.role !== 'admin' && business.ownerId !== req.user!.id) {
      throw new AppError('Not authorized to update this business', 403);
    }

    const updated = await prisma.business.update({
      where: { id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
});

// DELETE /api/businesses/:id - Delete business (admin only)
router.delete('/:id', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;

    const business = await prisma.business.findUnique({
      where: { id }
    });

    if (!business) {
      throw new AppError('Business not found', 404);
    }

    // Soft delete
    await prisma.business.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Business deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/businesses/:id/premium - Toggle premium status (admin)
router.put('/:id/premium', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const { isPremium, premiumUntil } = req.body;

    const business = await prisma.business.findUnique({
      where: { id }
    });

    if (!business) {
      throw new AppError('Business not found', 404);
    }

    const updated = await prisma.business.update({
      where: { id },
      data: {
        isPremium: isPremium ?? true,
        premiumUntil: premiumUntil ? new Date(premiumUntil) : null
      }
    });

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

export default router;
