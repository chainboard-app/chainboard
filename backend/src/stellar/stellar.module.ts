import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StellarService } from './stellar.service';
import { StellarController } from './stellar.controller';
import { WalletConnectionService } from './wallet-connection.service';
import { MemoService } from './memo.service';

@Module({
  imports: [ConfigModule],
  controllers: [StellarController],
  providers: [StellarService, WalletConnectionService, MemoService],
  exports: [StellarService, WalletConnectionService, MemoService],
})
export class StellarModule {}
