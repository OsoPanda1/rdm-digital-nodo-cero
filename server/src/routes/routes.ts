import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Validation schemas
const createRouteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  durationMinutes: z.number().min(1),
  distanceKm: z.number().optional(),
  imageUrl: z.string().url().optional(),
  isNightRoute: z.boolean().optional(),
  isFamilyFriendly: z.boolean().optional(),
  points: z.array(z.object({
    order: z.number(),
    markerId: z.string().optional(),
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    description: z.string().optional()
  })).optional()
});

const updateRouteSchema = createRouteSchema.partial();

// GET /api/routes - List all routes
router.get('/', async (req, res, next) => {
  try {
    const { 
      difficulty, 
      isNightRoute, 
      isFamilyFriendly, 
      search, 
      limit = '20', 
      offset = '0' 
    } = req.query;

    const where: any = {
      isActive: true
    };

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (isNightRoute === 'true') {
      where.isNightRoute = true;
    }

    if (isFamilyFriendly === 'true') {
      where.isFamilyFriendly = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        where,
        include: {
          points: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { name: 'asc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string)
      }),
      prisma.route.count({ where })
    ]);

    res.json({
      success: true,
      data: routes,
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

// GET /api/routes/featured - Get featured routes
router.get('/featured', async (req, res, next) => {
  try {
    const routes = await prisma.route.findMany({
      where: { isActive: true },
      include: {
        points: {
          orderBy: { order: 'asc' },
          take: 3
        }
      },
      take: 5
    });

    res.json({
      success: true,
      data: routes
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/routes/difficulties - Get all difficulty levels
router.get('/difficulties', async (req, res, next) => {
  try {
    const difficulties = await prisma.route.findMany({
      where: { isActive: true },
      select: { difficulty: true },
      distinct: ['difficulty']
    });

    res.json({
      success: true,
      data: difficulties.map(d => d.difficulty)
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/routes/:id - Get single route
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const route = await prisma.route.findFirst({
      where: {
        id,
        isActive: true
      },
      include: {
        points: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!route) {
      throw new AppError('Route not found', 404);
    }

    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/routes - Create new route (admin only)
router.post('/', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const data = createRouteSchema.parse(req.body);

    const { points, ...routeData } = data;

    const route = await prisma.route.create({
      data: {
        ...routeData,
        points: points ? {
          create: points
        } : undefined
      },
      include: {
        points: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: route
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
});

// PUT /api/routes/:id - Update route
router.put('/:id', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const data = updateRouteSchema.parse(req.body);

    const route = await prisma.route.findUnique({
      where: { id }
    });

    if (!route) {
      throw new AppError('Route not found', 404);
    }

    const { points, ...routeData } = data;

    const updated = await prisma.route.update({
      where: { id },
      data: {
        ...routeData,
        points: points ? {
          deleteMany: {},
          create: points
        } : undefined
      },
      include: {
        points: {
          orderBy: { order: 'asc' }
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

// DELETE /api/routes/:id - Delete route (admin only)
router.delete('/:id', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;

    const route = await prisma.route.findUnique({
      where: { id }
    });

    if (!route) {
      throw new AppError('Route not found', 404);
    }

    // Soft delete
    await prisma.route.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
