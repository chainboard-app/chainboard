import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

export interface ApiDocsOptions {
  summary: string;
  description?: string;
  tags?: string[];
  responses?: Record<number, { description: string; type?: any }>;
  bearerAuth?: boolean;
  queries?: Array<{ name: string; description: string; required?: boolean; type?: any }>;
  params?: Array<{ name: string; description: string; type?: any }>;
  body?: { type: any; description?: string };
}

export function ApiDocs(options: ApiDocsOptions) {
  const decorators = [];

  if (options.tags) {
    decorators.push(ApiTags(...options.tags));
  }

  decorators.push(
    ApiOperation({
      summary: options.summary,
      description: options.description,
    }),
  );

  if (options.bearerAuth) {
    decorators.push(ApiBearerAuth());
  }

  if (options.queries) {
    options.queries.forEach((query) => {
      decorators.push(
        ApiQuery({
          name: query.name,
          description: query.description,
          required: query.required || false,
          type: query.type,
        }),
      );
    });
  }

  if (options.params) {
    options.params.forEach((param) => {
      decorators.push(
        ApiParam({
          name: param.name,
          description: param.description,
          type: param.type,
        }),
      );
    });
  }

  if (options.body) {
    decorators.push(
      ApiBody({
        type: options.body.type,
        description: options.body.description,
      }),
    );
  }

  if (options.responses) {
    Object.entries(options.responses).forEach(([statusCode, response]) => {
      decorators.push(
        ApiResponse({
          status: parseInt(statusCode),
          description: response.description,
          type: response.type,
        }),
      );
    });
  }

  return applyDecorators(...decorators);
}
