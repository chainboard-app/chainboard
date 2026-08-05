import { SetMetadata } from '@nestjs/common';

export const HEALTH_CHECK_KEY = 'healthCheck';
export const HealthCheck = () => SetMetadata(HEALTH_CHECK_KEY, true);
