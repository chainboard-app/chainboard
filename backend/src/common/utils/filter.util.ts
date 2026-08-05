export interface FilterParams {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  [key: string]: any;
}

export class FilterHelper {
  static buildWhereClause(filters: FilterParams): any {
    const where: any = {};

    if (filters.search) {
      where.$or = [
        { title: { $ilike: `%${filters.search}%` } },
        { content: { $ilike: `%${filters.search}%` } },
      ];
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.$lte = filters.endDate;
      }
    }

    if (filters.status) {
      where.status = filters.status;
    }

    return where;
  }
}
