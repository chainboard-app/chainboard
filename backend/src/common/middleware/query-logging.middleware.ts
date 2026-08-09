/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class QueryLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(QueryLoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { method, originalUrl } = req;
      const { statusCode } = res;

      if (duration > 1000) {
        this.logger.warn(
          `Slow query detected: ${method} ${originalUrl} - ${statusCode} - ${duration}ms`,
        );
      }
    });

    next();
  }
}
