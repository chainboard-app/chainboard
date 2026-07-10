import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { NftsService } from './nfts.service';
import { NftsController } from './nfts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [NftsService],
  controllers: [NftsController],
  exports: [NftsService],
})
export class NftsModule {}
