import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Validation schemas
const createMarkerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.enum(['site', 'business', 'viewpoint', 'nature', 'culture', 'food']),
  description: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  imageUrl: z.string().url().optional(),
  isPremiumBusiness: z.boolean().optional()
});

// GET /api/markers - List all markers
router.get('/', async (req, res, next) => {
  try {
    const { category, isPremiumBusiness, search, limit = '100', offset = '0' } = req.query;

    const where: any = {
      isActive: true
    };

    if (category) {
      where.category = category;
    }

    if (isPremiumBusiness === 'true') {
      where.isPremiumBusiness = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [markers, total] = await Promise.all([
      prisma.marker.findMany({
        where,
        orderBy: { name: 'asc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string)
      }),
      prisma.marker.count({ where })
    ]);

    res.json({
      success: true,
      data: markers,
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

// GET /api/markers/categories - Get all unique categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.marker.findMany({
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

// GET /api/markers/:id - Get single marker
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const marker = await prisma.marker.findFirst({
      where: {
        id,
        isActive: true
      }
    });

    if (!marker) {
      throw new AppError('Marker not found', 404);
    }

    res.json({
      success: true,
      data: marker
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/markers - Create new marker (admin only)
router.post('/', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const data = createMarkerSchema.parse(req.body);

    const marker = await prisma.marker.create({
      data
    });

    res.status(201).json({
      success: true,
      data: marker
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
});

// PUT /api/markers/:id - Update marker
router.put('/:id', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const data = createMarkerSchema.partial().parse(req.body);

    const marker = await prisma.marker.findUnique({
      where: { id }
    });

    if (!marker) {
      throw new AppError('Marker not found', 404);
    }

    const updated = await prisma.marker.update({
      where: { id },
      data
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

// DELETE /api/markers/:id - Delete marker (admin only)
router.delete('/:id', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;

    const marker = await prisma.marker.findUnique({
      where: { id }
    });

    if (!marker) {
      throw new AppError('Marker not found', 404);
    }

    // Soft delete
    await prisma.marker.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Marker deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
