import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Tip } from './entities/tip.entity';
import { User } from '../users/entities/user.entity';

export type TimeWindow = '7d' | '30d' | 'all';

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  amount: number;
}

export interface LeaderboardResponse {
  topTippers: LeaderboardEntry[];
  topEarners: LeaderboardEntry[];
}

export interface TipHistoryItem {
  id: string;
  amount: number;
  chain: string;
  sender: { id: string; displayName: string; username: string; avatarUrl?: string };
  receiver: { id: string; displayName: string; username: string; avatarUrl?: string };
  createdAt: Date;
  postId?: string;
}

@Injectable()
export class TipsService {
  constructor(
    @InjectRepository(Tip)
    private tipsRepository: Repository<Tip>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  private getTimeWindowDate(window: TimeWindow): Date | null {
    const now = new Date();
    switch (window) {
      case '7d':
        return new Date(now.setDate(now.getDate() - 7));
      case '30d':
        return new Date(now.setDate(now.getDate() - 30));
      case 'all':
      default:
        return null;
    }
  }

  async getLeaderboard(window: TimeWindow): Promise<LeaderboardResponse> {
    const cacheKey = `leaderboard:${window}`;
    const cached = await this.cacheManager.get<LeaderboardResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const date = this.getTimeWindowDate(window);
    const tips = date
      ? await this.tipsRepository.find({
          where: { createdAt: MoreThanOrEqual(date) },
          relations: ['sender', 'receiver'],
        })
      : await this.tipsRepository.find({ relations: ['sender', 'receiver'] });

    const tippersMap = new Map<string, { user: User; amount: number }>();
    const earnersMap = new Map<string, { user: User; amount: number }>();

    for (const tip of tips) {
      if (tip.sender) {
        const existing = tippersMap.get(tip.senderId);
        tippersMap.set(tip.senderId, {
          user: tip.sender,
          amount: (existing?.amount || 0) + Number(tip.amount),
        });
      }
      if (tip.receiver) {
        const existing = earnersMap.get(tip.receiverId);
        earnersMap.set(tip.receiverId, {
          user: tip.receiver,
          amount: (existing?.amount || 0) + Number(tip.amount),
        });
      }
    }

    const topTippers = Array.from(tippersMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)
      .map(({ user, amount }) => ({
        userId: user.id,
        displayName: user.displayName,
        username: user.username,
        avatarUrl: user.avatarUrl,
        amount,
      }));

    const topEarners = Array.from(earnersMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)
      .map(({ user, amount }) => ({
        userId: user.id,
        displayName: user.displayName,
        username: user.username,
        avatarUrl: user.avatarUrl,
        amount,
      }));

    const result = { topTippers, topEarners };
    await this.cacheManager.set(cacheKey, result, 60000); // 1 minute cache

    return result;
  }

  async getHistory(userId: string): Promise<TipHistoryItem[]> {
    const tips = await this.tipsRepository.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
    });

    return tips.map((tip) => ({
      id: tip.id,
      amount: Number(tip.amount),
      chain: tip.chain,
      sender: {
        id: tip.sender.id,
        displayName: tip.sender.displayName,
        username: tip.sender.username,
        avatarUrl: tip.sender.avatarUrl,
      },
      receiver: {
        id: tip.receiver.id,
        displayName: tip.receiver.displayName,
        username: tip.receiver.username,
        avatarUrl: tip.receiver.avatarUrl,
      },
      createdAt: tip.createdAt,
      postId: tip.postId,
    }));
  }
}
