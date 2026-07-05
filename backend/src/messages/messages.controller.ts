import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async sendMessage(
    @Body() body: { senderId: string; recipientId: string; encryptedContent: string },
  ) {
    return this.messagesService.sendMessage(
      body.senderId,
      body.recipientId,
      body.encryptedContent,
    );
  }

  @Get(':userId')
  async getConversation(@Param('userId') userId: string, @Body('currentUserId') currentUserId: string) {
    return this.messagesService.getConversation(currentUserId, userId);
  }

  @Get('conversations')
  async getConversations(@Body('userId') userId: string) {
    return this.messagesService.getConversations(userId);
  }
}
