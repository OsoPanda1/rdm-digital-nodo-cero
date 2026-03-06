import { Router, Request, Response } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { getUploadService } from '../lib/upload';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Validation schema
const uploadSchema = z.object({
  folder: z.enum(['businesses', 'posts', 'events', 'routes', 'avatars', 'general']).optional().default('general')
});

// POST /api/upload/image - Upload single image
router.post('/image', optionalAuth, upload.single('image'), async (req: AuthRequest, res: Response, next) => {
  try {
    const service = getUploadService();
    const folder = req.body.folder || 'general';

    if (!req.file) {
      throw new AppError('No image file provided', 400);
    }

    const result = await service.upload(
      req.file.buffer,
      req.file.originalname,
      folder
    );

    if (!result.success) {
      throw new AppError(result.error || 'Upload failed', 500);
    }

    res.json({
      success: true,
      data: {
        url: result.url,
        key: result.key
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/upload/images - Upload multiple images
router.post('/images', optionalAuth, upload.array('images', 5), async (req: AuthRequest, res: Response, next) => {
  try {
    const service = getUploadService();
    const folder = req.body.folder || 'general';

    if (!req.files || !Array.isArray(req.files)) {
      throw new AppError('No image files provided', 400);
    }

    const results = await Promise.all(
      req.files.map(file => 
        service.upload(file.buffer, file.originalname, folder)
      )
    );

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    res.json({
      success: true,
      data: {
        uploaded: successful.map(r => ({ url: r.url, key: r.key })),
        failed: failed.length,
        total: results.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/upload/image - Delete image
router.delete('/image', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { key } = req.body;

    if (!key) {
      throw new AppError('Image key is required', 400);
    }

    const service = getUploadService();
    const deleted = await service.delete(key);

    if (!deleted) {
      throw new AppError('Failed to delete image', 500);
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/upload/base64 - Upload base64 encoded image
router.post('/base64', optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { image, folder = 'general', filename = 'image.jpg' } = req.body;

    if (!image) {
      throw new AppError('Base64 image data is required', 400);
    }

    // Extract base64 data
    const matches = image.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      throw new AppError('Invalid base64 image format', 400);
    }

    const buffer = Buffer.from(matches[2], 'base64');
    const ext = matches[1].split('/')[1] || 'jpg';

    const service = getUploadService();
    const result = await service.upload(buffer, `image.${ext}`, folder);

    if (!result.success) {
      throw new AppError(result.error || 'Upload failed', 500);
    }

    res.json({
      success: true,
      data: {
        url: result.url,
        key: result.key
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
