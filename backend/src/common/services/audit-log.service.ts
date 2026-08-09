/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  TIP = 'TIP',
  POST = 'POST',
  COMMENT = 'COMMENT',
}

export interface AuditLogEntry {
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  async log(entry: AuditLogEntry): Promise<void> {
    try {
      this.logger.log(
        `Audit: ${entry.userId} - ${entry.action} - ${entry.entityType}${entry.entityId ? `:${entry.entityId}` : ''}`,
      );

      // In production, save to database
      // await this.auditLogRepository.save({
      //   ...entry,
      //   timestamp: new Date(),
      // });
    } catch (error) {
      this.logger.error('Failed to log audit entry', error);
    }
  }

  async getUserActivity(userId: string, limit: number = 100): Promise<any[]> {
    // Placeholder for database query
    return [];
  }

  async getEntityHistory(entityType: string, entityId: string): Promise<any[]> {
    // Placeholder for database query
    return [];
  }
}
