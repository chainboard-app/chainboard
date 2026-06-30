import { Controller, Get, Query } from '@nestjs/common';
import { TipsService, TimeWindow } from './tips.service';

@Controller('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Get('leaderboard')
  getLeaderboard(@Query('window') window: TimeWindow = '30d') {
    return this.tipsService.getLeaderboard(window);
  }
}
