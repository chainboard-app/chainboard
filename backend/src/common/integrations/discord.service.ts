/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);
  private readonly botToken: string;
  private readonly clientId: string;

  constructor(private readonly configService: ConfigService) {
    this.botToken = this.configService.get('DISCORD_BOT_TOKEN') || '';
    this.clientId = this.configService.get('DISCORD_CLIENT_ID') || '';
  }

  async sendMessage(channelId: string, content: string): Promise<void> {
    try {
      this.logger.log(`Sending message to Discord channel ${channelId}`);

      // Placeholder for Discord bot integration
      // const { Client, GatewayIntentBits } = require('discord.js');
      // const client = new Client({ intents: [GatewayIntentBits.Guilds] });
      // await client.login(this.botToken);
      // const channel = await client.channels.fetch(channelId);
      // await channel.send(content);

    } catch (error) {
      this.logger.error(`Failed to send Discord message to channel ${channelId}`, error);
      throw error;
    }
  }

  async notifyNewPost(postId: string, title: string, author: string): Promise<void> {
    const content = `📝 **New Post Created**\n**Author:** ${author}\n**Title:** ${title}\n**Link:** ${process.env.FRONTEND_URL}/posts/${postId}`;
    const channelId = this.configService.get('DISCORD_POSTS_CHANNEL_ID');
    if (channelId) {
      await this.sendMessage(channelId, content);
    }
  }

  async notifyTipReceived(toUser: string, amount: number, currency: string): Promise<void> {
    const content = `💰 **Tip Received**\n**User:** ${toUser}\n**Amount:** ${amount} ${currency}`;
    const channelId = this.configService.get('DISCORD_TIPS_CHANNEL_ID');
    if (channelId) {
      await this.sendMessage(channelId, content);
    }
  }

  async getGuildInfo(guildId: string): Promise<any> {
    try {
      this.logger.log(`Fetching Discord guild info for ${guildId}`);

      // Placeholder for guild info fetch
      return null;
    } catch (error) {
      this.logger.error(`Failed to fetch Discord guild info for ${guildId}`, error);
      throw error;
    }
  }

  async createWebhook(channelId: string, name: string): Promise<string> {
    try {
      this.logger.log(`Creating Discord webhook in channel ${channelId}`);

      // Placeholder for webhook creation
      return 'webhook-url';
    } catch (error) {
      this.logger.error(`Failed to create Discord webhook in channel ${channelId}`, error);
      throw error;
    }
  }
}
