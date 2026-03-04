import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Validation schemas
const createEventSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  imageUrl: z.string().url().optional(),
  isFeatured: z.boolean().optional()
});

const updateEventSchema = createEventSchema.partial();

// GET /api/events - List all events with filters
router.get('/', async (req, res, next) => {
  try {
    const { 
      isFeatured, 
      startDate, 
      endDate, 
      search, 
      limit = '20', 
      offset = '0' 
    } = req.query;

    const where: any = {
      isActive: true
    };

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) {
        where.startDate.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.startDate.lte = new Date(endDate as string);
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { startDate: 'asc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string)
      }),
      prisma.event.count({ where })
    ]);

    res.json({
      success: true,
      data: events,
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

// GET /api/events/featured - Get featured events
router.get('/featured', async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        isActive: true,
        isFeatured: true
      },
      orderBy: { startDate: 'asc' },
      take: 5
    });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/events/upcoming - Get upcoming events
router.get('/upcoming', async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        isActive: true,
        startDate: {
          gte: new Date()
        }
      },
      orderBy: { startDate: 'asc' },
      take: 10
    });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/events/:id - Get single event
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findFirst({
      where: {
        id,
        isActive: true
      }
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/events - Create new event (admin only)
router.post('/', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const data = createEventSchema.parse(req.body);

    const event = await prisma.event.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null
      }
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
});

// PUT /api/events/:id - Update event
router.put('/:id', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const data = updateEventSchema.parse(req.body);

    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined
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

// DELETE /api/events/:id - Delete event (admin only)
router.delete('/:id', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Soft delete
    await prisma.event.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/events/:id/feature - Toggle featured status (admin)
router.put('/:id/feature', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    const updated = await prisma.event.update({
      where: { id },
      data: { isFeatured: isFeatured ?? !event.isFeatured }
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
