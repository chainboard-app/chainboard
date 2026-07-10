import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Series } from './entities/series.entity';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private seriesRepository: Repository<Series>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createSeries(authorId: string, title: string, description?: string): Promise<Series> {
    const author = await this.userRepository.findOneBy({ id: authorId });
    if (!author) {
      throw new NotFoundException('User not found');
    }
    const series = this.seriesRepository.create({
      title,
      description,
      authorId,
    });
    return this.seriesRepository.save(series);
  }

  async getSeriesById(id: string): Promise<Series & { posts: Post[] }> {
    const series = await this.seriesRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!series) {
      throw new NotFoundException('Series not found');
    }

    const posts = await this.postRepository.find({
      where: { seriesId: id },
      order: { seriesOrder: 'ASC', createdAt: 'ASC' },
      relations: ['author', 'coAuthors', 'coAuthors.user'],
    });

    return { ...series, posts };
  }

  async getSeriesByAuthor(authorId: string): Promise<Series[]> {
    return this.seriesRepository.find({
      where: { authorId },
      order: { createdAt: 'DESC' },
    });
  }

  async addPostToSeries(seriesId: string, postId: string, order: number): Promise<Post> {
    const series = await this.seriesRepository.findOneBy({ id: seriesId });
    if (!series) {
      throw new NotFoundException('Series not found');
    }

    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.seriesId = seriesId;
    post.seriesOrder = order;
    return this.postRepository.save(post);
  }
}
