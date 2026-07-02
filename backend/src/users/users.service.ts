import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async search(query: string): Promise<
    Array<Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>>
  > {
    if (!query.trim()) {
      return [];
    }
    const normalized = query.toLowerCase();
    return this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.username) LIKE :query', { query: `%${normalized}%` })
      .orWhere('LOWER(user.displayName) LIKE :query', {
        query: `%${normalized}%`,
      })
      .select(['user.id', 'user.username', 'user.displayName', 'user.avatarUrl'])
      .limit(8)
      .getMany();
  }
}
