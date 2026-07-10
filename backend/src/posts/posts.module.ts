import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Reaction } from './entities/reaction.entity';
import { Tip } from '../tips/entities/tip.entity';
import { PostCoAuthor } from './entities/post-co-author.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Reaction, Tip, PostCoAuthor])],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
