import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      id?: string;
      userId?: string;
    }
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Generate unique request ID
  const requestId = uuidv4();
  req.id = requestId;
  
  const startTime = Date.now();
  
  // Log request
  console.log(JSON.stringify({
    type: 'request',
    id: requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString()
  }));
  
  // Log response
  const originalSend = res.send;
  res.send = function (body) {
    const duration = Date.now() - startTime;
    
    console.log(JSON.stringify({
      type: 'response',
      id: requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    }));
    
    return originalSend.call(this, body);
  };
  
  next();
};

export const createLog = (type: string, data: Record<string, unknown>) => {
  console.log(JSON.stringify({
    type,
    ...data,
    timestamp: new Date().toISOString()
  }));
};
