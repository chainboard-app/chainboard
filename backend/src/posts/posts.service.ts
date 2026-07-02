import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Reaction, ReactionType } from './entities/reaction.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Reaction)
    private reactionsRepository: Repository<Reaction>,
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
}
