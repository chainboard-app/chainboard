import { Controller, Get, Param } from '@nestjs/common';
import { ReputationService } from './reputation.service';

@Controller('reputation')
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  @Get(':userId')
  getReputation(@Param('userId') userId: string): Promise<{ score: number; userId: string }> {
    return this.reputationService.getReputation(userId);
  }
}
