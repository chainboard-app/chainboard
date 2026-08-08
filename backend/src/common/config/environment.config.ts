export interface EnvironmentConfig {
  nodeEnv: string;
  port: number;
  database: {
    url: string;
    poolSize: number;
    poolMax: number;
    idleTimeout: number;
    connectionTimeout: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cors: {
    allowedOrigins: string[];
  };
  logging: {
    level: string;
  };
}

export const getConfig = (): EnvironmentConfig => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    url: process.env.DATABASE_URL || '',
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
    poolMax: parseInt(process.env.DB_POOL_MAX || '20', 10),
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    connectionTimeout: parseInt(
      process.env.DB_CONNECTION_TIMEOUT || '2000',
      10,
    ),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ],
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

export const isDevelopment = () => getConfig().nodeEnv === 'development';
export const isProduction = () => getConfig().nodeEnv === 'production';
export const isTest = () => getConfig().nodeEnv === 'test';
