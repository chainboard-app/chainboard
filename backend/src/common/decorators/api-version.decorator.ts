import { SetMetadata } from '@nestjs/common';

export const API_VERSION_KEY = 'api_version';
export const ApiVersion = (version: string) => SetMetadata(API_VERSION_KEY, version);
