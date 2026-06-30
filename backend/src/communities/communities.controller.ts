import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { Community } from './entities/community.entity';
import type { Chain } from '../common/types';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Get()
  findAll(): Promise<Community[]> {
    return this.communitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Community | null> {
    return this.communitiesService.findOne(id);
  }

  @Get(':id/check-access')
  async checkAccess(
    @Param('id') id: string,
    @Query('walletAddress') walletAddress: string,
    @Query('chain') chain: Chain,
  ): Promise<{ hasAccess: boolean }> {
    const community = await this.communitiesService.findOne(id);
    if (!community) {
      return { hasAccess: false };
    }
    const hasAccess = await this.communitiesService.checkAccess(
      community,
      walletAddress,
      chain,
    );
    return { hasAccess };
  }
}
