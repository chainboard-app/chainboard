import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { PerformanceMiddleware } from './common/middleware/performance.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security headers with Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));
  
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
  
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('ChainBoard API')
    .setDescription('A feed-style Web3 discussion and tipping platform for multi-chain developer communities')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('posts', 'Post creation and retrieval')
    .addTag('tips', 'On-chain tipping')
    .addTag('communities', 'Community management')
    .addTag('notifications', 'User notifications')
    .addTag('messages', 'Direct messages')
    .addTag('moderation', 'Content moderation')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
