import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommunitiesModule } from './communities/communities.module';
import { ReputationModule } from './reputation/reputation.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TipsModule } from './tips/tips.module';
import { MessagesModule } from './messages/messages.module';
import { ModerationModule } from './moderation/moderation.module';
import { User } from './users/entities/user.entity';
import { Post } from './posts/entities/post.entity';
import { Tip } from './tips/entities/tip.entity';
import { Community } from './communities/entities/community.entity';
import { Message } from './messages/entities/message.entity';
import { Report } from './moderation/entities/report.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'chainboard',
      entities: [User, Post, Tip, Community, Message, Report],
      synchronize: true,
    }),
    UsersModule,
    PostsModule,
    CommunitiesModule,
    ReputationModule,
    NotificationsModule,
    TipsModule,
    MessagesModule,
    ModerationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
