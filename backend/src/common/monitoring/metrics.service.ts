/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  private readonly metrics: Map<string, number> = new Map();
  private readonly histograms: Map<string, number[]> = new Map();
  private readonly enabled: boolean;

  constructor(private readonly configService: ConfigService) {
    this.enabled = this.configService.get('METRICS_ENABLED') === 'true';
  }

  increment(name: string, value: number = 1, labels?: Record<string, string>) {
    if (!this.enabled) return;
    const key = this.buildKey(name, labels);
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, current + value);
  }

  decrement(name: string, value: number = 1, labels?: Record<string, string>) {
    if (!this.enabled) return;
    this.increment(name, -value, labels);
  }

  gauge(name: string, value: number, labels?: Record<string, string>) {
    if (!this.enabled) return;
    const key = this.buildKey(name, labels);
    this.metrics.set(key, value);
  }

  histogram(name: string, value: number, labels?: Record<string, string>) {
    if (!this.enabled) return;
    const key = this.buildKey(name, labels);
    const values = this.histograms.get(key) || [];
    values.push(value);
    this.histograms.set(key, values);
  }

  timing(name: string, value: number, labels?: Record<string, string>) {
    if (!this.enabled) return;
    this.histogram(name, value, labels);
  }

  private buildKey(name: string, labels?: Record<string, string>): string {
    if (!labels) return name;
    const labelString = Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
    return `${name}{${labelString}}`;
  }

  getMetrics(): string {
    if (!this.enabled) return '';

    let output = '';

    // Counters
    for (const [key, value] of this.metrics.entries()) {
      output += `# TYPE ${key.split('{')[0]} counter\n`;
      output += `${key} ${value}\n`;
    }

    // Histograms
    for (const [key, values] of this.histograms.entries()) {
      const baseName = key.split('{')[0];
      const sortedValues = [...values].sort((a, b) => a - b);
      const count = sortedValues.length;
      const sum = sortedValues.reduce((a, b) => a + b, 0);
      const avg = count > 0 ? sum / count : 0;

      output += `# TYPE ${baseName} histogram\n`;
      output += `${key}_count ${count}\n`;
      output += `${key}_sum ${sum}\n`;
      output += `${key}_avg ${avg}\n`;
    }

    return output;
  }

  reset() {
    this.metrics.clear();
    this.histograms.clear();
  }

  // Predefined metrics helpers
  recordHttpRequest(method: string, path: string, statusCode: number, duration: number) {
    this.increment('http_requests_total', 1, { method, path, status: statusCode.toString() });
    this.timing('http_request_duration_ms', duration, { method, path });
  }

  recordDatabaseQuery(operation: string, table: string, duration: number) {
    this.increment('db_queries_total', 1, { operation, table });
    this.timing('db_query_duration_ms', duration, { operation, table });
  }

  recordCacheHit(key: string) {
    this.increment('cache_hits_total', 1, { key });
  }

  recordCacheMiss(key: string) {
    this.increment('cache_misses_total', 1, { key });
  }

  recordExternalApiCall(service: string, endpoint: string, duration: number, success: boolean) {
    this.increment('external_api_calls_total', 1, { service, endpoint, status: success ? 'success' : 'error' });
    this.timing('external_api_duration_ms', duration, { service, endpoint });
  }
}
