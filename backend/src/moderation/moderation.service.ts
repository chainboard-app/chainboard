import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportReason } from './entities/report.entity';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class ModerationService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async reportPost(postId: string, reporterId: string, reason: ReportReason) {
    const post = await this.postsRepository.findOneBy({ id: postId });
    if (!post) {
      throw new Error('Post not found');
    }
    const report = this.reportsRepository.create({
      postId,
      reporterId,
      reason,
    });
    return this.reportsRepository.save(report);
  }

  async getModerationQueue() {
    const reports = await this.reportsRepository.find({
      relations: ['post', 'post.author'],
    });

    const groupedReports = new Map<string, { post: Post; reports: Report[]; count: number }>();

    for (const report of reports) {
      if (!groupedReports.has(report.postId)) {
        groupedReports.set(report.postId, {
          post: report.post,
          reports: [],
          count: 0,
        });
      }
      const group = groupedReports.get(report.postId)!;
      group.reports.push(report);
      group.count += 1;
    }

    return Array.from(groupedReports.values()).sort((a, b) => b.count - a.count);
  }

  async dismissReports(postId: string) {
    await this.reportsRepository.delete({ postId });
  }

  async removePost(postId: string) {
    const post = await this.postsRepository.findOneBy({ id: postId });
    if (post) {
      post.status = 'deleted';
      await this.postsRepository.save(post);
    }
    await this.reportsRepository.delete({ postId });
  }
}
