/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
  rolloutPercentage?: number;
  allowedUsers?: string[];
  allowedRoles?: string[];
}

@Injectable()
export class FeatureFlagService {
  private readonly logger = new Logger(FeatureFlagService.name);
  private flags: Map<string, FeatureFlag> = new Map();

  constructor(private readonly configService: ConfigService) {
    this.initializeFlags();
  }

  private initializeFlags() {
    const defaultFlags: FeatureFlag[] = [
      {
        key: 'solana_integration',
        enabled: false,
        description: 'Enable Solana blockchain integration',
        rolloutPercentage: 0,
      },
      {
        key: 'polygon_integration',
        enabled: false,
        description: 'Enable Polygon blockchain integration',
        rolloutPercentage: 0,
      },
      {
        key: 'ipfs_storage',
        enabled: false,
        description: 'Enable IPFS for file storage',
        rolloutPercentage: 10,
      },
      {
        key: 'realtime_notifications',
        enabled: true,
        description: 'Enable real-time WebSocket notifications',
        rolloutPercentage: 100,
      },
      {
        key: 'advanced_search',
        enabled: true,
        description: 'Enable advanced full-text search',
        rolloutPercentage: 100,
      },
      {
        key: 'token_gated_communities',
        enabled: false,
        description: 'Enable token-gated communities',
        rolloutPercentage: 0,
      },
    ];

    defaultFlags.forEach((flag) => {
      const envValue = this.configService.get(`FEATURE_${flag.key.toUpperCase()}`);
      if (envValue !== undefined) {
        flag.enabled = envValue === 'true';
      }
      this.flags.set(flag.key, flag);
    });

    this.logger.log(`Initialized ${this.flags.size} feature flags`);
  }

  isEnabled(key: string, userId?: string, userRoles?: string[]): boolean {
    const flag = this.flags.get(key);
    if (!flag) {
      this.logger.warn(`Feature flag ${key} not found`);
      return false;
    }

    if (!flag.enabled) {
      return false;
    }

    // Check user-specific access
    if (userId && flag.allowedUsers && !flag.allowedUsers.includes(userId)) {
      return false;
    }

    // Check role-based access
    if (userRoles && flag.allowedRoles) {
      const hasRequiredRole = flag.allowedRoles.some((role) => userRoles.includes(role));
      if (!hasRequiredRole) {
        return false;
      }
    }

    // Check rollout percentage
    if (flag.rolloutPercentage && flag.rolloutPercentage < 100) {
      const hash = this.hashUserId(userId || 'anonymous');
      const threshold = flag.rolloutPercentage / 100;
      return hash < threshold;
    }

    return true;
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) / 0x7fffffff;
  }

  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  updateFlag(key: string, updates: Partial<FeatureFlag>): FeatureFlag {
    const flag = this.flags.get(key);
    if (!flag) {
      throw new Error(`Feature flag ${key} not found`);
    }

    const updatedFlag = { ...flag, ...updates };
    this.flags.set(key, updatedFlag);
    this.logger.log(`Updated feature flag ${key}`);
    return updatedFlag;
  }

  createFlag(flag: FeatureFlag): FeatureFlag {
    if (this.flags.has(flag.key)) {
      throw new Error(`Feature flag ${flag.key} already exists`);
    }

    this.flags.set(flag.key, flag);
    this.logger.log(`Created feature flag ${flag.key}`);
    return flag;
  }

  deleteFlag(key: string): void {
    if (!this.flags.has(key)) {
      throw new Error(`Feature flag ${key} not found`);
    }

    this.flags.delete(key);
    this.logger.log(`Deleted feature flag ${key}`);
  }
}
