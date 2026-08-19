/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { StellarExceptionFilter } from './common/filters/stellar-exception.filter';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { PerformanceMiddleware } from './common/middleware/performance.middleware';
import { CacheResponseInterceptor } from './common/interceptors/cache-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // CORS with whitelist
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
  ];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global middleware
  app.use(RequestIdMiddleware);
  app.use(LoggingMiddleware);
  app.use(PerformanceMiddleware);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filters
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new StellarExceptionFilter());

  // Global interceptors
  const reflector = app.get(Reflector);
  const cacheManager = app.get(CACHE_MANAGER);
  app.useGlobalInterceptors(new CacheResponseInterceptor(reflector, cacheManager));

  // API Versioning
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('ChainBoard API')
    .setDescription(
      'A feed-style Web3 discussion and tipping platform for multi-chain developer communities',
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('posts', 'Post creation and retrieval')
    .addTag('tips', 'On-chain tipping')
    .addTag('communities', 'Community management')
    .addTag('notifications', 'User notifications')
    .addTag('messages', 'Direct messages')
    .addTag('moderation', 'Content moderation')
    .addTag('nfts', 'NFT management endpoints')
    .addTag('wallet-activity', 'Wallet activity tracking')
    .addTag('stellar', 'Stellar blockchain integration endpoints')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
