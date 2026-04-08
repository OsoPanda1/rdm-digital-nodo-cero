import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { signFederationPayload } from '../lib/federationSignature';

const router = Router();

// Validation schemas
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['tourist', 'business_owner', 'admin']).optional().default('tourist')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Generate JWT token
const generateToken = (userId: string, email: string, role: string) => {
  const federationSig = signFederationPayload({ id: userId, email, role });
  return jwt.sign(
    { id: userId, email, role, federationSig },
    process.env.JWT_SECRET || 'default-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Generate refresh token
const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'default-secret-key',
    { expiresIn: '30d' }
  );
};

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response, next) => {
  try {
    const data = signupSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    // Generate token
    const token = generateToken(user.id, user.email, user.role);
    
    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response, next) => {
  try {
    const data = loginSchema.parse(req.body);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
    
    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }
    
    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is disabled', 403);
    }
    
    // Generate token
    const token = generateToken(user.id, user.email, user.role);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        },
        token
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
});

// POST /api/auth/logout
router.post('/logout', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    // In a more complete implementation, you might want to blacklist the token
    // For now, we just return success and let the client remove the token
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Include related data
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

// PUT /api/auth/profile
router.put('/profile', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { name, avatarUrl } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        name: name || undefined,
        avatarUrl: avatarUrl || undefined
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
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

// PUT /api/auth/change-password
router.put('/change-password', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      throw new AppError('Current password and new password are required', 400);
    }
    
    if (newPassword.length < 6) {
      throw new AppError('New password must be at least 6 characters', 400);
    }
    
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    
    if (!isValidPassword) {
      throw new AppError('Current password is incorrect', 401);
    }
    
    // Update password
    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { passwordHash }
    });
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', async (req: Request, res: Response, next) => {
  try {
    const data = refreshSchema.parse(req.body);
    
    // Verify refresh token
    const decoded = jwt.verify(
      data.refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'default-secret-key'
    ) as { id: string; type: string };
    
    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid refresh token', 401);
    }
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }
    
    // Generate new tokens
    const accessToken = generateToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id);
    
    res.json({
      success: true,
      data: {
        token: accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid refresh token', 401));
    } else {
      next(error);
    }
  }
});

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', async (req: Request, res: Response, next) => {
  try {
    const data = forgotPasswordSchema.parse(req.body);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    // Always return success to prevent email enumeration
    // But still generate token if user exists
    if (user) {
      // Generate reset token (expires in 1 hour)
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      
      // Delete any existing password reset tokens for this user
      await prisma.passwordReset.deleteMany({
        where: { userId: user.id }
      });
      
      // Create new password reset token
      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt
        }
      });
      
      // TODO: Send email with reset link
      // In production, integrate with email provider (SendGrid, etc.)
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/reset-password?token=${resetToken}`;
      console.log(`Password reset URL for ${user.email}: ${resetUrl}`);
      
      // In production: await sendPasswordResetEmail(user.email, resetUrl);
    }
    
    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
});

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', async (req: Request, res: Response, next) => {
  try {
    const data = resetPasswordSchema.parse(req.body);
    
    // Find valid reset token
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token: data.token },
      include: { user: true }
    });
    
    if (!resetRecord) {
      throw new AppError('Invalid reset token', 400);
    }
    
    if (resetRecord.expiresAt < new Date()) {
      throw new AppError('Reset token has expired', 400);
    }
    
    if (resetRecord.usedAt) {
      throw new AppError('Reset token has already been used', 400);
    }
    
    // Hash new password
    const passwordHash = await bcrypt.hash(data.password, 12);
    
    // Update user password
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash }
    });
    
    // Mark token as used
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() }
    });
    
    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
});

// POST /api/auth/verify - Verify email (if email verification is enabled)
router.post('/verify', async (req: Request, res: Response, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      throw new AppError('Verification token is required', 400);
    }
    
    // Find verification record
    const verification = await prisma.emailVerification.findUnique({
      where: { token },
      include: { user: true }
    });
    
    if (!verification) {
      throw new AppError('Invalid verification token', 400);
    }
    
    if (verification.expiresAt < new Date()) {
      throw new AppError('Verification token has expired', 400);
    }
    
    // Mark email as verified (add field to User model if needed)
    // For now, we just delete the verification record
    await prisma.emailVerification.delete({
      where: { id: verification.id }
    });
    
    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/resend-verification - Resend verification email
router.post('/resend-verification', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Delete any existing verification tokens
    await prisma.emailVerification.deleteMany({
      where: { userId: user.id }
    });
    
    // Create new verification token
    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt
      }
    });
    
    // TODO: Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/verify?token=${verificationToken}`;
    console.log(`Email verification URL for ${user.email}: ${verificationUrl}`);
    
    res.json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
