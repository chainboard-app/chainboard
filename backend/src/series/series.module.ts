import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Series } from './entities/series.entity';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Series, Post, User])],
  providers: [SeriesService],
  controllers: [SeriesController],
  exports: [SeriesService],
})
export class SeriesModule {}
