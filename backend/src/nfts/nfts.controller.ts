import { Controller, Get, Param } from '@nestjs/common';
import { NftsService } from './nfts.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Controller('users/:id/nfts')
export class NftsController {
  constructor(
    private readonly nftsService: NftsService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  @Get()
  async getNFTs(@Param('id') userId: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      return [];
    }
    return this.nftsService.getNFTsForUser(user.walletAddresses);
  }
}
