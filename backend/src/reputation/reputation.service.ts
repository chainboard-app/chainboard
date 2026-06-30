import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReputationService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async calculateReputation(userId: string): Promise<number> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      return 0;
    }

    const tipsReceivedScore = user.totalTipsReceived * 10;
    const upvotesScore = user.totalUpvotes * 0.5;
    const followersScore = user.followersCount * 2;

    return Math.floor(tipsReceivedScore + upvotesScore + followersScore);
  }

  async getReputation(
    userId: string,
  ): Promise<{ score: number; userId: string }> {
    const score = await this.calculateReputation(userId);
    return { score, userId };
  }
}
