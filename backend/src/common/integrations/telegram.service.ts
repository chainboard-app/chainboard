/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly apiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.botToken = this.configService.get('TELEGRAM_BOT_TOKEN') || '';
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  async sendMessage(chatId: string, text: string, parseMode?: 'Markdown' | 'HTML'): Promise<void> {
    try {
      this.logger.log(`Sending Telegram message to chat ${chatId}`);

      // Placeholder for Telegram bot integration
      // const axios = require('axios');
      // await axios.post(`${this.apiUrl}/sendMessage`, {
      //   chat_id: chatId,
      //   text,
      //   parse_mode: parseMode,
      // });

    } catch (error) {
      this.logger.error(`Failed to send Telegram message to chat ${chatId}`, error);
      throw error;
    }
  }

  async notifyNewPost(postId: string, title: string, author: string): Promise<void> {
    const text = `📝 *New Post Created*\n*Author:* ${author}\n*Title:* ${title}\n*Link:* ${process.env.FRONTEND_URL}/posts/${postId}`;
    const chatId = this.configService.get('TELEGRAM_POSTS_CHAT_ID');
    if (chatId) {
      await this.sendMessage(chatId, text, 'Markdown');
    }
  }

  async notifyTipReceived(toUser: string, amount: number, currency: string): Promise<void> {
    const text = `💰 *Tip Received*\n*User:* ${toUser}\n*Amount:* ${amount} ${currency}`;
    const chatId = this.configService.get('TELEGRAM_TIPS_CHAT_ID');
    if (chatId) {
      await this.sendMessage(chatId, text, 'Markdown');
    }
  }

  async setWebhook(url: string): Promise<void> {
    try {
      this.logger.log(`Setting Telegram webhook to ${url}`);

      // Placeholder for webhook setup
      // await axios.post(`${this.apiUrl}/setWebhook`, { url });

    } catch (error) {
      this.logger.error('Failed to set Telegram webhook', error);
      throw error;
    }
  }

  async getWebhookInfo(): Promise<any> {
    try {
      this.logger.log('Fetching Telegram webhook info');

      // Placeholder for webhook info fetch
      return null;
    } catch (error) {
      this.logger.error('Failed to fetch Telegram webhook info', error);
      throw error;
    }
  }

  async getChat(chatId: string): Promise<any> {
    try {
      this.logger.log(`Fetching Telegram chat info for ${chatId}`);

      // Placeholder for chat info fetch
      return null;
    } catch (error) {
      this.logger.error(`Failed to fetch Telegram chat info for ${chatId}`, error);
      throw error;
    }
  }
}
