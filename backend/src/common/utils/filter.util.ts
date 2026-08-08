/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';

export interface FilterParams {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  [key: string]: any;
}

@Injectable()
export class FilterUtil {
  buildWhereClause(filters: any): any {
    const where: any = {};

    if (filters.search) {
      where.$or = [
        { title: { $like: `%${filters.search}%` } },
        { content: { $like: `%${filters.search}%` } },
      ];
    }

    if (filters.startDate) {
      where.createdAt = { ...where.createdAt, $gte: filters.startDate };
    }

    if (filters.endDate) {
      where.createdAt = { ...where.createdAt, $lte: filters.endDate };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    return where;
  }
}
