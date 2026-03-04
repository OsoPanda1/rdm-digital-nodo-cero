import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// POST /api/analytics/events - Track an analytics event
router.post('/events', async (req, res, next) => {
  try {
    const { eventType, metadata } = req.body;

    if (!eventType) {
      throw new AppError('Event type is required', 400);
    }

    const event = await prisma.analyticsEvent.create({
      data: {
        eventType,
        metadata: metadata || {},
        ipAddress: req.ip || undefined,
        userAgent: req.get('user-agent') || undefined
      }
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/events - Get analytics events (admin only)
router.get('/events', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { eventType, startDate, endDate, limit = '100', offset = '0' } = req.query;

    const where: any = {};

    if (eventType) {
      where.eventType = eventType;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string);
      }
    }

    const [events, total] = await Promise.all([
      prisma.analyticsEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string)
      }),
      prisma.analyticsEvent.count({ where })
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

// GET /api/analytics/summary - Get analytics summary (admin only)
router.get('/summary', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { period = '7d' } = req.query;

    let startDate = new Date();
    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const [
      totalEvents,
      uniqueVisitors,
      eventTypes,
      recentEvents
    ] = await Promise.all([
      prisma.analyticsEvent.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.analyticsEvent.groupBy({
        by: ['ipAddress'],
        where: { createdAt: { gte: startDate } },
        _count: true
      }),
      prisma.analyticsEvent.groupBy({
        by: ['eventType'],
        where: { createdAt: { gte: startDate } },
        _count: true,
        orderBy: { _count: { eventType: 'desc' } },
        take: 10
      }),
      prisma.analyticsEvent.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          eventType: true,
          createdAt: true,
          ipAddress: true
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        period,
        totalEvents,
        uniqueVisitors: uniqueVisitors.length,
        eventTypes: eventTypes.map(e => ({
          type: e.eventType,
          count: e._count
        })),
        recentEvents
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/popular-content - Get popular content (admin only)
router.get('/popular-content', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { period = '7d' } = req.query;

    let startDate = new Date();
    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    // Get page views
    const pageViews = await prisma.analyticsEvent.groupBy({
      by: ['metadata'],
      where: {
        createdAt: { gte: startDate },
        eventType: 'page_view'
      },
      _count: true,
      orderBy: { _count: { eventType: 'desc' } },
      take: 20
    });

    // Extract page paths from metadata
    const pageCounts = pageViews.reduce((acc: any, item) => {
      const page = item.metadata?.page || 'unknown';
      acc[page] = (acc[page] || 0) + item._count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: Object.entries(pageCounts)
        .map(([page, count]) => ({ page, count }))
        .sort((a: any, b: any) => b.count - a.count)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
