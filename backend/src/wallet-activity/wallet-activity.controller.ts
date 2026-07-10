import { Controller, Get, Param } from '@nestjs/common';
import { WalletActivityService } from './wallet-activity.service';

@Controller('wallet')
export class WalletActivityController {
  constructor(private readonly walletActivityService: WalletActivityService) {}

  @Get(':userId/activity')
  getWalletActivity(@Param('userId') userId: string) {
    return this.walletActivityService.getWalletActivity(userId);
  }
}
