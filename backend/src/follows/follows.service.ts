import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async follow(followerId: string, followingId: string): Promise<void> {
    const [follower, following] = await Promise.all([
      this.userRepository.findOneBy({ id: followerId }),
      this.userRepository.findOneBy({ id: followingId }),
    ]);

    if (!follower || !following) {
      throw new NotFoundException('User not found');
    }

    const existingFollow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });

    if (existingFollow) {
      return;
    }

    await this.followRepository.save({ followerId, followingId });

    await this.userRepository.update(followerId, {
      followingCount: follower.followingCount + 1 });
    await this.userRepository.update(followingId, {
      followersCount: following.followersCount + 1 });
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const [follower, following] = await Promise.all([
      this.userRepository.findOneBy({ id: followerId }),
      this.userRepository.findOneBy({ id: followingId }),
    ]);

    if (!follower || !following) {
      throw new NotFoundException('User not found');
    }

    const existingFollow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });

    if (!existingFollow) {
      return;
    }

    await this.followRepository.remove(existingFollow);

    await this.userRepository.update(followerId, {
      followingCount: Math.max(0, follower.followingCount - 1) });
    await this.userRepository.update(followingId, {
      followersCount: Math.max(0, following.followersCount - 1) });
  }

  async getFollowers(userId: string): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { followingId: userId },
      relations: ['follower'],
    });
    return follows.map(follow => follow.follower);
  }

  async getFollowing(userId: string): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { followerId: userId },
      relations: ['following'],
    });
    return follows.map(follow => follow.following);
  }
}
