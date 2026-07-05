import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ModerationService } from './moderation.service';

@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('posts/:id/report')
  reportPost(
    @Param('id') id: string,
    @Body() body: { reporterId: string; reason: string },
  ) {
    return this.moderationService.reportPost(id, body.reporterId, body.reason);
  }

  @Get('queue')
  getQueue() {
    return this.moderationService.getModerationQueue();
  }

  @Post('posts/:id/dismiss')
  dismissReports(@Param('id') id: string) {
    return this.moderationService.dismissReports(id);
  }

  @Delete('posts/:id')
  removePost(@Param('id') id: string) {
    return this.moderationService.removePost(id);
  }
}
