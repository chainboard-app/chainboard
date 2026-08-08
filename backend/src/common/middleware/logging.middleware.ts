import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, ip } = req;
    const userAgent = req.get('user-agent') || '';

    this.logger.log(`${method} ${url} - ${ip} - ${userAgent}`);

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(`${method} ${url} - ${statusCode}`);
    });

    next();
  }
}
