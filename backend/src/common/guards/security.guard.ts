/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SecurityGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Check for SQL injection patterns
    const suspiciousPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(\b(OR|AND)\s+\w+\s*=\s*\w+)/i,
      /(--|;|\/\*|\*\/)/,
      /(\b(xp_|sp_)\w+)/i,
    ];

    const checkString = (value: any) => {
      if (typeof value === 'string') {
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(value)) {
            throw new ForbiddenException('Suspicious input detected');
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        Object.values(value).forEach(checkString);
      }
    };

    // Check query params
    checkString(request.query);

    // Check body
    checkString(request.body);

    // Check params
    checkString(request.params);

    return true;
  }
}
