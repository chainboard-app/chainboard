/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SecurityMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // Log suspicious activity
    const suspiciousPatterns = [
      /\.\./, // Path traversal
      /<script/i, // XSS
      /javascript:/i, // XSS
      /on\w+\s*=/i, // Event handler injection
      /union.*select/i, // SQL injection
      /exec\(/i, // Command injection
    ];

    const checkValue = (value: any, path: string) => {
      if (typeof value === 'string') {
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(value)) {
            this.logger.warn(`Suspicious input detected at ${path}: ${value}`);
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([key, val]) => checkValue(val, `${path}.${key}`));
      }
    };

    checkValue(req.query, 'query');
    checkValue(req.body, 'body');
    checkValue(req.params, 'params');

    next();
  }
}
