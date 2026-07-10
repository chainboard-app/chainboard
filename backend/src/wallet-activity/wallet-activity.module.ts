import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Tip } from '../tips/entities/tip.entity';
import { WalletActivityService } from './wallet-activity.service';
import { WalletActivityController } from './wallet-activity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tip])],
  providers: [WalletActivityService],
  controllers: [WalletActivityController],
  exports: [WalletActivityService],
})
export class WalletActivityModule {}
