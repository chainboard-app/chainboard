import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  private readonly logger = new Logger(PerformanceMiddleware.name);
  private readonly slowRequestThreshold = 1000; // 1 second

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { method, originalUrl } = req;
      const requestId = req.id;

      if (duration > this.slowRequestThreshold) {
        this.logger.warn(
          `Slow request detected: ${method} ${originalUrl} - Duration: ${duration}ms - RequestID: ${requestId}`,
        );
      }
    });

    next();
  }
}
