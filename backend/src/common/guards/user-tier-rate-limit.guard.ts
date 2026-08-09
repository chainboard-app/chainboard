/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export enum UserTier {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export interface TierRateLimits {
  [UserTier.FREE]: { limit: number; ttl: number };
  [UserTier.PRO]: { limit: number; ttl: number };
  [UserTier.ENTERPRISE]: { limit: number; ttl: number };
}

@Injectable()
export class UserTierRateLimitGuard implements CanActivate {
  private readonly tierLimits: TierRateLimits = {
    [UserTier.FREE]: { limit: 100, ttl: 60000 }, // 100 requests per minute
    [UserTier.PRO]: { limit: 1000, ttl: 60000 }, // 1000 requests per minute
    [UserTier.ENTERPRISE]: { limit: 10000, ttl: 60000 }, // 10000 requests per minute
  };

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true; // Let other guards handle authentication
    }

    const userTier = user.tier || UserTier.FREE;
    const limits = this.tierLimits[userTier];

    // Store tier limits in request for rate limiter to use
    request.tierRateLimits = limits;

    return true;
  }
}
