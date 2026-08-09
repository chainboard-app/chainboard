/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApmService {
  private readonly logger = new Logger(ApmService.name);
  private readonly enabled: boolean;
  private readonly serviceName: string;

  constructor(private readonly configService: ConfigService) {
    this.enabled = this.configService.get('APM_ENABLED') === 'true';
    this.serviceName = this.configService.get('APM_SERVICE_NAME') || 'chainboard-backend';

    if (this.enabled) {
      this.initializeApm();
    }
  }

  private initializeApm() {
    try {
      // Placeholder for APM initialization (e.g., New Relic, Datadog, Elastic APM)
      this.logger.log(`APM initialized for service: ${this.serviceName}`);
    } catch (error) {
      this.logger.error('Failed to initialize APM', error);
    }
  }

  startTransaction(name: string, type: string = 'custom') {
    if (!this.enabled) return null;
    // Placeholder for transaction start
    return { end: () => {} };
  }

  startSpan(name: string, type: string = 'custom') {
    if (!this.enabled) return null;
    // Placeholder for span start
    return { end: () => {} };
  }

  captureError(error: Error, context?: any) {
    if (!this.enabled) return;
    this.logger.error(`APM Error captured: ${error.message}`, { error, context });
  }

  setCustomContext(context: any) {
    if (!this.enabled) return;
    // Placeholder for custom context
  }

  addLabels(labels: Record<string, string | number | boolean>) {
    if (!this.enabled) return;
    // Placeholder for adding labels
  }

  setUser(userId: string, email?: string, username?: string) {
    if (!this.enabled) return;
    // Placeholder for user context
  }

  flush() {
    if (!this.enabled) return;
    // Placeholder for flushing APM data
  }
}
