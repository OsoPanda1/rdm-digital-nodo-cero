import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  avatarUrl: z.string().url().optional(),
  homeCity: z.string().optional(),
  travelStyle: z.enum(['relax', 'adventure', 'family', 'culture', 'foodie']).optional(),
  preferredDuration: z.number().optional(),
  hasKids: z.boolean().optional(),
  notes: z.string().optional(),
  language: z.string().optional(),
  notificationsEnabled: z.boolean().optional()
});

// GET /api/users/me/profile - Get current user's profile
router.get('/me/profile', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        touristProfile: true,
        business: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/me/profile - Update current user's profile
router.put('/me/profile', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const data = updateProfileSchema.parse(req.body);

    // Update user
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        name: data.name,
        avatarUrl: data.avatarUrl
      }
    });

    // Update tourist profile if exists
    if (data.homeCity !== undefined || data.travelStyle !== undefined || 
        data.preferredDuration !== undefined || data.hasKids !== undefined ||
        data.notes !== undefined || data.language !== undefined ||
        data.notificationsEnabled !== undefined) {
      
      await prisma.touristProfile.upsert({
        where: { userId: req.user!.id },
        create: {
          userId: req.user!.id,
          homeCity: data.homeCity,
          travelStyle: data.travelStyle,
          preferredDuration: data.preferredDuration,
          hasKids: data.hasKids,
          notes: data.notes,
          language: data.language,
          notificationsEnabled: data.notificationsEnabled
        },
        update: {
          homeCity: data.homeCity,
          travelStyle: data.travelStyle,
          preferredDuration: data.preferredDuration,
          hasKids: data.hasKids,
          notes: data.notes,
          language: data.language,
          notificationsEnabled: data.notificationsEnabled
        }
      });
    }

    // Get updated profile
    const updatedUser = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        touristProfile: true,
        business: true
      }
    });

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
});

// GET /api/users/:id - Get user by ID (public profile)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        touristProfile: true,
        business: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users - List users (admin only)
router.get('/', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { role, search, limit = '20', offset = '0' } = req.query;

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          isActive: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string)
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: users,
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

// PUT /api/users/:id/role - Update user role (admin only)
router.put('/:id/role', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['tourist', 'business_owner', 'admin'].includes(role)) {
      throw new AppError('Invalid role', 400);
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/:id/active - Toggle user active status (admin only)
router.put('/:id/active', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

export default router;
