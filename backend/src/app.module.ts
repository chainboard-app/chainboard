import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommunitiesModule } from './communities/communities.module';
import { ReputationModule } from './reputation/reputation.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TipsModule } from './tips/tips.module';
import { User } from './users/entities/user.entity';
import { Post } from './posts/entities/post.entity';
import { Tip } from './tips/entities/tip.entity';
import { Community } from './communities/entities/community.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'chainboard',
      entities: [User, Post, Tip, Community],
      synchronize: true,
    }),
    UsersModule,
    PostsModule,
    CommunitiesModule,
    ReputationModule,
    NotificationsModule,
    TipsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
