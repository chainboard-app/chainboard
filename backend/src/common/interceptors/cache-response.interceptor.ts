import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_RESPONSE_KEY, CACHE_TTL_KEY } from '../decorators/cache-response.decorator';

@Injectable()
export class CacheResponseInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const cacheResponse = this.reflector.get<boolean>(CACHE_RESPONSE_KEY, context.getHandler());
    const cacheTTL = this.reflector.get<number>(CACHE_TTL_KEY, context.getHandler()) || 300;

    if (!cacheResponse) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const cacheKey = this.generateCacheKey(request);

    return this.cacheManager.get(cacheKey).then(cachedResponse => {
      if (cachedResponse) {
        return of(cachedResponse);
      }

      return next.handle().pipe(
        tap(response => {
          this.cacheManager.set(cacheKey, response, cacheTTL);
        }),
      );
    });
  }

  private generateCacheKey(request: any): string {
    return `${request.method}:${request.url}:${JSON.stringify(request.query)}`;
  }
}
