import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Post } from './entities/post.entity';
import { Reaction, ReactionType } from './entities/reaction.entity';
import { Tip } from '../tips/entities/tip.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Reaction)
    private reactionsRepository: Repository<Reaction>,
    @InjectRepository(Tip)
    private tipsRepository: Repository<Tip>,
  ) {}

  async search(query: string): Promise<Post[]> {
    if (!query.trim()) {
      return [];
    }

    return this.postsRepository
      .createQueryBuilder('post')
      .where(
        "post.searchVector @@ plainto_tsquery('english', :query)",
        { query },
      )
      .orderBy("ts_rank(post.searchVector, plainto_tsquery('english', :query))", 'DESC')
      .leftJoinAndSelect('post.author', 'author')
      .getMany();
  }

  async getTrending(): Promise<Post[]> {
    const posts = await this.postsRepository.find({ relations: ['author'] });
    const now = new Date().getTime();
    
    const scoredPosts = posts.map(post => {
      const hoursSinceCreated = (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
      const hours = Math.max(hoursSinceCreated, 0.01);
      const reactionCount = post.mentions.length;
      const score = (post.upvotes + 2 * reactionCount + 3 * post.tipsReceived) / Math.pow(hours, 1.5);
      return { post, score };
    });

    scoredPosts.sort((a, b) => b.score - a.score);
    return scoredPosts.slice(0, 20).map(sp => sp.post);
  }

  async getReactions(postId: string): Promise<{ [key in ReactionType]: number }> {
    const reactions = await this.reactionsRepository.find({ where: { postId } });
    const counts = { fire: 0, build: 0, handshake: 0 };
    for (const r of reactions) {
      counts[r.type]++;
    }
    return counts;
  }

  async addReaction(postId: string, userId: string, type: ReactionType): Promise<Reaction> {
    const existing = await this.reactionsRepository.findOne({ where: { postId, userId, type } });
    if (existing) return existing;
    const reaction = this.reactionsRepository.create({ postId, userId, type });
    return this.reactionsRepository.save(reaction);
  }

  async removeReaction(postId: string, userId: string, type: ReactionType): Promise<void> {
    await this.reactionsRepository.delete({ postId, userId, type });
  }

  async togglePin(postId: string, userId: string): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ id: postId });
    if (!post) {
      throw new Error('Post not found');
    }
    if (post.authorId !== userId) {
      throw new Error('Not authorized to pin this post');
    }

    if (!post.isPinned) {
      await this.postsRepository.update({ authorId: userId, isPinned: true }, { isPinned: false, pinnedAt: null });
    }

    post.isPinned = !post.isPinned;
    post.pinnedAt = post.isPinned ? new Date() : null;
    return this.postsRepository.save(post);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async publishScheduledPosts() {
    const now = new Date();
    const scheduledPosts = await this.postsRepository
      .createQueryBuilder('post')
      .where('post.status = :status', { status: 'scheduled' })
      .andWhere('post.scheduledAt <= :now', { now })
      .getMany();

    for (const post of scheduledPosts) {
      post.status = 'active';
      post.scheduledAt = null;
      await this.postsRepository.save(post);
    }
  }

  async incrementImpressions(postId: string) {
    const post = await this.postsRepository.findOneBy({ id: postId });
    if (!post) {
      throw new Error('Post not found');
    }
    post.impressions += 1;
    return this.postsRepository.save(post);
  }

  async getAnalytics(userId: string) {
    const posts = await this.postsRepository.find({
      where: { authorId: userId },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const tips = await this.tipsRepository.find({
      where: { receiverId: userId, createdAt: MoreThanOrEqual(thirtyDaysAgo) },
    });

    // Group tips by day
    const tipsByDay = new Map<string, number>();
    for (const tip of tips) {
      const day = tip.createdAt.toISOString().split('T')[0];
      tipsByDay.set(day, (tipsByDay.get(day) || 0) + Number(tip.amount));
    }

    const tipsOverTime = Array.from(tipsByDay.entries()).map(([date, amount]) => ({
      date,
      amount,
    }));

    const topPosts = posts
      .sort((a, b) => (b.upvotes + b.impressions + b.tipsReceived) - (a.upvotes + a.impressions + a.tipsReceived))
      .slice(0, 5);

    return {
      totalImpressions: posts.reduce((sum, post) => sum + post.impressions, 0),
      totalTips: posts.reduce((sum, post) => sum + Number(post.tipsReceived), 0),
      tipsOverTime,
      topPosts,
    };
  }
}
