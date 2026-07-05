import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async sendMessage(
    senderId: string,
    recipientId: string,
    encryptedContent: string,
  ): Promise<Message> {
    const message = this.messagesRepository.create({
      senderId,
      recipientId,
      encryptedContent,
    });
    return this.messagesRepository.save(message);
  }

  async getConversation(
    userId1: string,
    userId2: string,
  ): Promise<Message[]> {
    return this.messagesRepository
      .createQueryBuilder('message')
      .where(
        '(message.senderId = :userId1 AND message.recipientId = :userId2) OR (message.senderId = :userId2 AND message.recipientId = :userId1)',
        { userId1, userId2 },
      )
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.recipient', 'recipient')
      .orderBy('message.createdAt', 'ASC')
      .getMany();
  }

  async getConversations(userId: string): Promise<any[]> {
    const messages = await this.messagesRepository
      .createQueryBuilder('message')
      .where('message.senderId = :userId OR message.recipientId = :userId', { userId })
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.recipient', 'recipient')
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    const conversationsMap = new Map<string, { user: any; lastMessage: Message; unreadCount: number }>();

    for (const message of messages) {
      const otherUserId = message.senderId === userId ? message.recipientId : message.senderId;
      const otherUser = message.senderId === userId ? message.recipient : message.sender;

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          user: otherUser,
          lastMessage: message,
          unreadCount: 0,
        });
      }

      const conv = conversationsMap.get(otherUserId)!;
      if (!message.read && message.recipientId === userId) {
        conv.unreadCount++;
      }
    }

    return Array.from(conversationsMap.values());
  }
}
