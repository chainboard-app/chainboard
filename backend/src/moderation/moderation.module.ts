import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Post } from '../posts/entities/post.entity';
import { ModerationService } from './moderation.service';
import { ModerationController } from './moderation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Post])],
  controllers: [ModerationController],
  providers: [ModerationService],
  exports: [ModerationService],
})
export class ModerationModule {}
