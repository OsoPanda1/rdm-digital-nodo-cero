import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Validation schemas
const createBusinessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.enum(['GASTRONOMIA', 'HOSPEDAJE', 'ARTESANIA', 'PLATERIA', 'BAR', 'COMERCIO', 'SERVICIOS', 'TURISMO', 'OTROS']),
  subcategory: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description cannot exceed 500 characters'),
  shortDescription: z.string().max(200).optional(),
  
  // Contact info
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional().nullable(),
  
  // Address
  address: z.string().optional(),
  addressReference: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  
  // Media
  imageUrl: z.string().url().optional(),
  imageUrl2: z.string().url().optional(),
  imageUrl3: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  videoDuration: z.number().max(60, 'Video cannot exceed 60 seconds').optional(),
  
  // Schedule
  schedule: z.any().optional(),
  scheduleDisplay: z.string().optional(),
  
  // Social media
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  
  // Business details
  priceRange: z.enum(['ECONOMICO', 'MODERADO', 'CARO', 'LUJO']).optional(),
  acceptsReservations: z.boolean().default(false),
  hasParking: z.boolean().default(false),
  isAccessible: z.boolean().default(false),
  paymentMethods: z.array(z.string()).default([]),
  languages: z.array(z.string()).default(['es'])
});

const updateBusinessSchema = createBusinessSchema.partial();

// GET /api/businesses - List all businesses with filters (public)
router.get('/', async (req, res, next) => {
  try {
    const { 
      category, 
      isPremium, 
      search, 
      limit = '20', 
      offset = '0',
      featured,
      verified
    } = req.query;

    const where: any = {
      isActive: true
    };

    if (category) {
      where.category = category;
    }

    if (isPremium === 'true') {
      where.isPremium = true;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (verified === 'true') {
      where.isVerified = true;
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
          { isFeatured: 'desc' },
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

// GET /api/businesses/map - Get all businesses with coordinates for map
router.get('/map', async (req, res, next) => {
  try {
    const { category } = req.query;

    const where: any = {
      isActive: true,
      latitude: { not: null },
      longitude: { not: null }
    };

    if (category) {
      where.category = category;
    }

    const businesses = await prisma.business.findMany({
      where,
      select: {
        id: true,
        name: true,
        category: true,
        shortDescription: true,
        imageUrl: true,
        phone: true,
        address: true,
        latitude: true,
        longitude: true,
        isPremium: true,
        isVerified: true
      }
    });

    res.json({
      success: true,
      data: businesses
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

    // Increment views count
    await prisma.business.update({
      where: { id },
      data: { viewsCount: { increment: 1 } }
    });

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

    // Check if user already has a business (unless admin)
    if (req.user!.role !== 'admin') {
      const existingBusiness = await prisma.business.findUnique({
        where: { ownerId: req.user!.id }
      });

      if (existingBusiness) {
        throw new AppError('You already have a business registered', 409);
      }
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

    // If admin creates, auto-approve
    if (req.user!.role === 'admin') {
      await prisma.business.update({
        where: { id: business.id },
        data: {
          approvedAt: new Date(),
          approvedBy: req.user!.id,
          isVerified: true
        }
      });
    }

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

// PUT /api/businesses/:id/approve - Approve business (admin)
router.put('/:id/approve', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;

    const business = await prisma.business.findUnique({
      where: { id }
    });

    if (!business) {
      throw new AppError('Business not found', 404);
    }

    const updated = await prisma.business.update({
      where: { id },
      data: {
        approvedAt: new Date(),
        approvedBy: req.user!.id,
        isVerified: true,
        rejectionReason: null
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

// PUT /api/businesses/:id/reject - Reject business (admin)
router.put('/:id/reject', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const business = await prisma.business.findUnique({
      where: { id }
    });

    if (!business) {
      throw new AppError('Business not found', 404);
    }

    const updated = await prisma.business.update({
      where: { id },
      data: {
        isVerified: false,
        rejectionReason: reason || 'No cumple con los requisitos'
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

// PUT /api/businesses/:id/feature - Toggle featured status (admin)
router.put('/:id/feature', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    const business = await prisma.business.findUnique({
      where: { id }
    });

    if (!business) {
      throw new AppError('Business not found', 404);
    }

    const updated = await prisma.business.update({
      where: { id },
      data: {
        isFeatured: isFeatured ?? true
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

// ADMIN ROUTES - Get all businesses including inactive
router.get('/admin/all', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { 
      category, 
      search, 
      limit = '50', 
      offset = '0',
      status,
      verified
    } = req.query;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    if (verified === 'true') {
      where.isVerified = true;
    } else if (verified === 'false') {
      where.isVerified = false;
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
          { isVerified: 'asc' }, // Pending first
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

// ADMIN - Get pending businesses
router.get('/admin/pending', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const businesses = await prisma.business.findMany({
      where: {
        isVerified: false,
        isActive: true
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json({
      success: true,
      data: businesses,
      count: businesses.length
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN - Get business stats
router.get('/admin/stats', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const [
      total,
      active,
      pending,
      premium,
      byCategory
    ] = await Promise.all([
      prisma.business.count(),
      prisma.business.count({ where: { isActive: true } }),
      prisma.business.count({ where: { isVerified: false, isActive: true } }),
      prisma.business.count({ where: { isPremium: true } }),
      prisma.business.groupBy({
        by: ['category'],
        _count: true
      })
    ]);

    res.json({
      success: true,
      data: {
        total,
        active,
        pending,
        premium,
        byCategory
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
