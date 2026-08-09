/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMIT_KEY, RateLimitOptions } from '../decorators/rate-limit.decorator';

@Injectable()
export class CustomRateLimitGuard {
  constructor(private readonly reflector: Reflector) {}

  getLimit(handler: any): number {
    const customLimit = this.reflector.get<RateLimitOptions>(RATE_LIMIT_KEY, handler);
    return customLimit?.limit || 100;
  }

  getTtl(handler: any): number {
    const customLimit = this.reflector.get<RateLimitOptions>(RATE_LIMIT_KEY, handler);
    return customLimit?.ttl || 60000;
  }
}
