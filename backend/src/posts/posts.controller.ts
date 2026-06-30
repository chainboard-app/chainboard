import { Controller, Get, Query, Post, Param, Body, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './entities/post.entity';
import { Reaction, ReactionType } from './entities/reaction.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('search')
  search(@Query('q') query: string): Promise<PostEntity[]> {
    return this.postsService.search(query);
  }

  @Get(':id/reactions')
  getReactions(@Param('id') id: string): Promise<{ [key in ReactionType]: number }> {
    return this.postsService.getReactions(id);
  }

  @Post(':id/reactions')
  addReaction(
    @Param('id') id: string,
    @Body() body: { userId: string; type: ReactionType },
  ): Promise<Reaction> {
    return this.postsService.addReaction(id, body.userId, body.type);
  }

  @Delete(':id/reactions')
  removeReaction(
    @Param('id') id: string,
    @Body() body: { userId: string; type: ReactionType },
  ): Promise<void> {
    return this.postsService.removeReaction(id, body.userId, body.type);
  }
}
