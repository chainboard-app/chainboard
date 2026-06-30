import { Controller, Get, Query } from '@nestjs/common';
import { TipsService } from './tips.service';
import type { TimeWindow, LeaderboardResponse, TipHistoryItem } from './tips.service';

@Controller('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Get('leaderboard')
  getLeaderboard(@Query('window') window: TimeWindow = '30d'): Promise<LeaderboardResponse> {
    return this.tipsService.getLeaderboard(window);
  }

  @Get('history')
  getHistory(@Query('userId') userId: string): Promise<TipHistoryItem[]> {
    return this.tipsService.getHistory(userId);
  }
}
