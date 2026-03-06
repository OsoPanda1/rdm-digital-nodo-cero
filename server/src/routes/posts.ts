import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth, optionalAuth, requireRole, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Validation schemas
const createPostSchema = z.object({
  placeName: z.string().min(2, 'Place name is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  imageUrl: z.string().url().optional()
});

const updatePostSchema = z.object({
  content: z.string().min(10).optional(),
  imageUrl: z.string().url().optional()
});

const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required')
});

// GET /api/posts - List all posts
router.get('/', async (req, res, next) => {
  try {
    const { placeName, search, limit = '20', offset = '0' } = req.query;

    const where: any = {
      isHidden: false  // Only show non-hidden posts by default
    };

    if (placeName) {
      where.placeName = { contains: placeName as string, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { content: { contains: search as string, mode: 'insensitive' } },
        { placeName: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true
            }
          },
          likes: {
            take: 1
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ],
        take: parseInt(limit as string),
        skip: parseInt(offset as string)
      }),
      prisma.post.count({ where })
    ]);

    // Transform to add like count and check if current user liked
    const postsWithLikes = posts.map(post => ({
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLiked: post.likes.length > 0
    }));

    res.json({
      success: true,
      data: postsWithLikes,
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

// GET /api/posts/places - Get unique place names
router.get('/places', async (req, res, next) => {
  try {
    const places = await prisma.post.findMany({
      select: { placeName: true },
      distinct: ['placeName'],
      orderBy: { placeName: 'asc' }
    });

    res.json({
      success: true,
      data: places.map(p => p.placeName)
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/:id - Get single post with comments
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findFirst({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    res.json({
      success: true,
      data: {
        ...post,
        likesCount: post.likes.length,
        isLiked: post.likes.length > 0
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/posts - Create new post
router.post('/', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const data = createPostSchema.parse(req.body);

    const post = await prisma.post.create({
      data: {
        ...data,
        userId: req.user!.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
});

// PUT /api/posts/:id - Update post
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const data = updatePostSchema.parse(req.body);

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Check authorization (author or admin)
    if (req.user!.role !== 'admin' && post.userId !== req.user!.id) {
      throw new AppError('Not authorized to update this post', 403);
    }

    const updated = await prisma.post.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
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

// DELETE /api/posts/:id - Delete post
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Check authorization (author or admin)
    if (req.user!.role !== 'admin' && post.userId !== req.user!.id) {
      throw new AppError('Not authorized to delete this post', 403);
    }

    await prisma.post.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/posts/:id/like - Like a post
router.post('/:id/like', optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // If user is authenticated, record their like
    if (req.user) {
      const existingLike = await prisma.postLike.findUnique({
        where: {
          postId_userId: {
            postId: id,
            userId: req.user.id
          }
        }
      });

      if (existingLike) {
        // Unlike
        await prisma.postLike.delete({
          where: { id: existingLike.id }
        });

        await prisma.post.update({
          where: { id },
          data: { likesCount: { decrement: 1 } }
        });

        res.json({
          success: true,
          message: 'Post unliked',
          isLiked: false
        });
      } else {
        // Like
        await prisma.postLike.create({
          data: {
            postId: id,
            userId: req.user.id
          }
        });

        await prisma.post.update({
          where: { id },
          data: { likesCount: { increment: 1 } }
        });

        res.json({
          success: true,
          message: 'Post liked',
          isLiked: true
        });
      }
    } else {
      // Anonymous like - just increment count
      await prisma.post.update({
        where: { id },
        data: { likesCount: { increment: 1 } }
      });

      res.json({
        success: true,
        message: 'Post liked (anonymous)',
        isLiked: true
      });
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/posts/:id/comments - Add comment to post
router.post('/:id/comments', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const data = createCommentSchema.parse(req.body);

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const comment = await prisma.postComment.create({
      data: {
        postId: id,
        userId: req.user!.id,
        content: data.content
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    // Update comment count
    await prisma.post.update({
      where: { id },
      data: { commentsCount: { increment: 1 } }
    });

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
});

// DELETE /api/posts/:id/comments/:commentId - Delete comment
router.delete('/:id/comments/:commentId', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { commentId } = req.params;

    const comment = await prisma.postComment.findUnique({
      where: { id: commentId },
      include: { post: true }
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    // Check authorization (author, post author, or admin)
    if (
      req.user!.role !== 'admin' &&
      comment.userId !== req.user!.id &&
      comment.post.userId !== req.user!.id
    ) {
      throw new AppError('Not authorized to delete this comment', 403);
    }

    await prisma.postComment.delete({
      where: { id: commentId }
    });

    // Update comment count
    await prisma.post.update({
      where: { id: comment.postId },
      data: { commentsCount: { decrement: 1 } }
    });

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ==================== ADMIN MODERATION ====================

// GET /api/posts/admin/all - Get all posts including hidden (admin)
router.get('/admin/all', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { isHidden, isFeatured, isModerated, limit = '50', offset = '0' } = req.query;

    const where: any = {};

    if (isHidden !== undefined) {
      where.isHidden = isHidden === 'true';
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured === 'true';
    }

    if (isModerated !== undefined) {
      where.isModerated = isModerated === 'true';
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string)
      }),
      prisma.post.count({ where })
    ]);

    res.json({
      success: true,
      data: posts,
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

// PUT /api/posts/:id/moderate - Moderate a post (admin)
router.put('/:id/moderate', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const { isHidden, isFeatured, isModerated } = req.body;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        isHidden: isHidden ?? post.isHidden,
        isFeatured: isFeatured ?? post.isFeatured,
        isModerated: isModerated ?? post.isModerated,
        moderatedAt: new Date(),
        moderatedBy: req.user!.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
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

// PUT /api/posts/:id/feature - Toggle featured status (admin)
router.put('/:id/feature', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const updated = await prisma.post.update({
      where: { id },
      data: { isFeatured: isFeatured ?? !post.isFeatured }
    });

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/posts/:id/hide - Hide/show post (admin)
router.put('/:id/hide', requireAuth, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const { isHidden } = req.body;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        isHidden: isHidden ?? !post.isHidden,
        moderatedAt: new Date(),
        moderatedBy: req.user!.id
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
