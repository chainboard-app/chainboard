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
}
