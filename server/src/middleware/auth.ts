import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { isValidFederationSignature } from '../lib/federationSignature';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
    federationSig?: string;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { message: 'No token provided' }
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key') as {
      id: string;
      email: string;
      role: Role;
      federationSig?: string;
    };

    if (!isValidFederationSignature(decoded)) {
      return res.status(401).json({
        success: false,
        error: { message: 'Token rejected by federation constitutional layer' }
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token' }
    });
  }
};

export const requireRole = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Insufficient permissions' }
      });
    }
    
    next();
  };
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key') as {
      id: string;
      email: string;
      role: Role;
      federationSig?: string;
    };

    if (isValidFederationSignature(decoded)) {
      req.user = decoded;
    }
  } catch (error) {
    // Token invalid, but continue anyway for optional auth
  }
  
  next();
};
