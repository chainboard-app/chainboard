import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const requestId = req.headers['x-request-id'] as string || this.generateRequestId();
    const userId = (req as any).user?.id || 'anonymous';
    
    // Add request ID to request object for use in other middleware/controllers
    (req as any).requestId = requestId;

    const startTime = Date.now();

    // Enhanced request logging with context
    this.logger.log({
      message: 'Incoming request',
      requestId,
      method,
      url,
      ip,
      userAgent,
      userId,
      timestamp: new Date().toISOString(),
    });

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;
      const contentLength = res.get('content-length') || '0';

      // Enhanced response logging with timing and context
      const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'log';
      
      this.logger[logLevel]({
        message: 'Request completed',
        requestId,
        method,
        url,
        statusCode,
        responseTime: `${responseTime}ms`,
        contentLength,
        userId,
        timestamp: new Date().toISOString(),
      });
    });

    next();
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
