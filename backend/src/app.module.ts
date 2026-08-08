/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { TipsModule } from './tips/tips.module';
import { CommunitiesModule } from './communities/communities.module';
import { MessagesModule } from './messages/messages.module';
import { NftsModule } from './nfts/nfts.module';
import { WalletActivityModule } from './wallet-activity/wallet-activity.module';
import { StellarModule } from './stellar/stellar.module';
import { WinstonLogger } from './common/logger/winston.logger';
import { User } from './users/entities/user.entity';
import { Post } from './posts/entities/post.entity';
import { Tip } from './tips/entities/tip.entity';
import { Community } from './communities/entities/community.entity';
import { Message } from './messages/entities/message.entity';
import { PostCoAuthor } from './posts/entities/post-co-author.entity';
import { validate } from './common/validation/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      ttl: 300, // 5 minutes
      max: 100,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100,
      },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [User, Post, Tip, Community, Message, PostCoAuthor],
        synchronize: configService.get('NODE_ENV') !== 'production',
        poolSize: configService.get('DB_POOL_SIZE', 10),
        extra: {
          max: configService.get('DB_POOL_MAX', 20),
          idleTimeoutMillis: configService.get('DB_IDLE_TIMEOUT', 30000),
          connectionTimeoutMillis: configService.get(
            'DB_CONNECTION_TIMEOUT',
            2000,
          ),
        },
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PostsModule,
    CommunitiesModule,
    TipsModule,
    MessagesModule,
    NftsModule,
    WalletActivityModule,
    StellarModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: 'APP_LOGGER',
      useClass: WinstonLogger,
    },
  ],
})
export class AppModule {}
