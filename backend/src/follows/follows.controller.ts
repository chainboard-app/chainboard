import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { FollowsService } from './follows.service';

@Controller('users/:id')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post('follow')
  follow(
    @Param('id') followingId: string,
    @Body('followerId') followerId: string,
  ) {
    return this.followsService.follow(followerId, followingId);
  }

  @Delete('follow')
  unfollow(
    @Param('id') followingId: string,
    @Body('followerId') followerId: string,
  ) {
    return this.followsService.unfollow(followerId, followingId);
  }

  @Get('followers')
  getFollowers(@Param('id') userId: string) {
    return this.followsService.getFollowers(userId);
  }

  @Get('following')
  getFollowing(@Param('id') userId: string) {
    return this.followsService.getFollowing(userId);
  }
}
