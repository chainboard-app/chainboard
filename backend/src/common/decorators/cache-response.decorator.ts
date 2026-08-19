import { SetMetadata } from '@nestjs/common';

export const CACHE_RESPONSE_KEY = 'cache_response';
export const CACHE_TTL_KEY = 'cache_ttl';

export const CacheResponse = (ttl: number = 300) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_RESPONSE_KEY, true);
    SetMetadata(CACHE_TTL_KEY, ttl);
    return descriptor;
  };
};
