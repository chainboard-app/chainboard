/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface FilterQuery {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  [key: string]: any;
}

export const Filter = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const search = query.search as string;
    const startDate = query.startDate as Date;
    const endDate = query.endDate as Date;
    const status = query.status as string;

    return {
      search,
      startDate,
      endDate,
      status,
    };
  },
);
