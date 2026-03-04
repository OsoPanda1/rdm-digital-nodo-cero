import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Log error for debugging (in production, use proper logging service)
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Don't expose stack trace in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(statusCode).json({
    success: false,
    error: {
      message: isProduction && statusCode === 500 ? 'Internal server error' : message,
      ...( !isProduction && { stack: err.stack })
    }
  });
};

export class AppError extends Error {
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleZodError = (error: ZodError) => {
  const errors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
  
  return new AppError('Validation error', 400);
};

export const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError) => {
  if (error.code === 'P2002') {
    // Unique constraint violation
    const field = error.meta?.target as string[];
    return new AppError(`The ${field?.[0] || 'field'} already exists`, 409);
  }
  
  if (error.code === 'P2025') {
    // Record not found
    return new AppError('Record not found', 404);
  }
  
  return new AppError('Database error', 500);
};
