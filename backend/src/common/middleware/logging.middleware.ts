import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const requestId = req.id;

    this.logger.log(
      `${method} ${originalUrl} - IP: ${ip} - UserAgent: ${userAgent} - RequestID: ${requestId}`,
    );

    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      this.logger.log(
        `${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms - RequestID: ${requestId}`,
      );
    });

    next();
  }
}
