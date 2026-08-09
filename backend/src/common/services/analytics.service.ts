/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AnalyticsEvent {
  event: string;
  userId?: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly apiKey: string;
  private readonly enabled: boolean;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get('ANALYTICS_API_KEY') || '';
    this.enabled = this.configService.get('ANALYTICS_ENABLED') === 'true';
  }

  async track(event: AnalyticsEvent): Promise<void> {
    if (!this.enabled) return;

    try {
      this.logger.debug(`Tracking event: ${event.event}`);

      // Placeholder for Mixpanel/PostHog integration
      // const mixpanel = require('mixpanel-browser');
      // mixpanel.init(this.apiKey);
      // mixpanel.track(event.event, {
      //   ...event.properties,
      //   distinct_id: event.userId,
      //   time: event.timestamp || new Date(),
      // });
    } catch (error) {
      this.logger.error(`Failed to track event ${event.event}`, error);
    }
  }

  async identify(userId: string, traits: Record<string, any>): Promise<void> {
    if (!this.enabled) return;

    try {
      this.logger.debug(`Identifying user: ${userId}`);

      // Placeholder for user identification
      // mixpanel.people.set(userId, traits);
    } catch (error) {
      this.logger.error(`Failed to identify user ${userId}`, error);
    }
  }

  async alias(previousId: string, newId: string): Promise<void> {
    if (!this.enabled) return;

    try {
      this.logger.debug(`Aliasing user: ${previousId} -> ${newId}`);

      // Placeholder for user aliasing
      // mixpanel.alias(newId, previousId);
    } catch (error) {
      this.logger.error(`Failed to alias user ${previousId} to ${newId}`, error);
    }
  }

  async page(userId: string, name: string, properties?: Record<string, any>): Promise<void> {
    if (!this.enabled) return;

    try {
      this.logger.debug(`Tracking page view: ${name}`);

      // Placeholder for page view tracking
      // analytics.page({
      //   userId,
      //   name,
      //   properties,
      // });
    } catch (error) {
      this.logger.error(`Failed to track page view ${name}`, error);
    }
  }

  // Predefined event helpers
  async trackPostCreated(userId: string, postId: string, communityId?: string): Promise<void> {
    return this.track({
      event: 'post_created',
      userId,
      properties: { postId, communityId },
    });
  }

  async trackTipSent(userId: string, amount: number, currency: string, toUserId: string): Promise<void> {
    return this.track({
      event: 'tip_sent',
      userId,
      properties: { amount, currency, toUserId },
    });
  }

  async trackUserSignedUp(userId: string, method: 'github' | 'wallet'): Promise<void> {
    return this.track({
      event: 'user_signed_up',
      userId,
      properties: { method },
    });
  }

  async trackWalletConnected(userId: string, chain: string): Promise<void> {
    return this.track({
      event: 'wallet_connected',
      userId,
      properties: { chain },
    });
  }
}
