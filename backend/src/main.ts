import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
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
