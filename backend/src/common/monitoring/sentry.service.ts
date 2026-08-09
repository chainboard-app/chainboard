/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SentryService {
  private readonly logger = new Logger(SentryService.name);
  private readonly enabled: boolean;
  private readonly dsn: string;

  constructor(private readonly configService: ConfigService) {
    this.enabled = this.configService.get('SENTRY_ENABLED') === 'true';
    this.dsn = this.configService.get('SENTRY_DSN') || '';

    if (this.enabled && this.dsn) {
      this.initializeSentry();
    }
  }

  private initializeSentry() {
    try {
      // Placeholder for Sentry initialization
      // const Sentry = require('@sentry/node');
      // Sentry.init({
      //   dsn: this.dsn,
      //   environment: this.configService.get('NODE_ENV') || 'development',
      //   tracesSampleRate: 1.0,
      // });

      this.logger.log('Sentry initialized');
    } catch (error) {
      this.logger.error('Failed to initialize Sentry', error);
    }
  }

  captureException(error: Error, context?: any) {
    if (!this.enabled) return;
    this.logger.error(`Sentry: ${error.message}`, { error, context });
    // Sentry.captureException(error, { extra: context });
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: any) {
    if (!this.enabled) return;
    this.logger.log(`Sentry: ${message}`, { level, context });
    // Sentry.captureMessage(message, level, { extra: context });
  }

  setUser(user: { id: string; email?: string; username?: string }) {
    if (!this.enabled) return;
    // Sentry.setUser(user);
  }

  setTag(key: string, value: string) {
    if (!this.enabled) return;
    // Sentry.setTag(key, value);
  }

  setContext(key: string, context: any) {
    if (!this.enabled) return;
    // Sentry.setContext(key, context);
  }

  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: 'info' | 'warning' | 'error';
    data?: any;
  }) {
    if (!this.enabled) return;
    // Sentry.addBreadcrumb(breadcrumb);
  }

  flush(timeout: number = 2000): Promise<void> {
    if (!this.enabled) return Promise.resolve();
    // return Sentry.flush(timeout);
    return Promise.resolve();
  }
}
