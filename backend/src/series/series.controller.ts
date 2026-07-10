import { Controller, Post, Get, Param, Body, Patch } from '@nestjs/common';
import { SeriesService } from './series.service';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  createSeries(
    @Body('authorId') authorId: string,
    @Body('title') title: string,
    @Body('description') description?: string,
  ) {
    return this.seriesService.createSeries(authorId, title, description);
  }

  @Get(':id')
  getSeriesById(@Param('id') id: string) {
    return this.seriesService.getSeriesById(id);
  }

  @Get('author/:authorId')
  getSeriesByAuthor(@Param('authorId') authorId: string) {
    return this.seriesService.getSeriesByAuthor(authorId);
  }

  @Patch(':seriesId/posts/:postId')
  addPostToSeries(
    @Param('seriesId') seriesId: string,
    @Param('postId') postId: string,
    @Body('order') order: number,
  ) {
    return this.seriesService.addPostToSeries(seriesId, postId, order);
  }
}
