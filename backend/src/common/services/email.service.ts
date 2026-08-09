/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly apiKey: string;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get('SENDGRID_API_KEY') || '';
    this.fromEmail = this.configService.get('EMAIL_FROM') || 'noreply@chainboard.app';
  }

  async sendEmail(to: string, subject: string, html: string, text?: string) {
    try {
      // Placeholder for SendGrid or similar email service integration
      this.logger.log(`Sending email to ${to} with subject: ${subject}`);
      
      // In production, integrate with SendGrid, AWS SES, or similar
      // Example with SendGrid:
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(this.apiKey);
      // await sgMail.send({
      //   to,
      //   from: this.fromEmail,
      //   subject,
      //   html,
      //   text,
      // });

      return { success: true, messageId: 'mock-message-id' };
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, username: string) {
    const subject = 'Welcome to ChainBoard!';
    const html = `
      <h1>Welcome to ChainBoard, ${username}!</h1>
      <p>We're excited to have you join our community of Web3 builders and enthusiasts.</p>
      <p>Start exploring posts, share your thoughts, and connect with other developers.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard">Get Started</a>
    `;
    return this.sendEmail(email, subject, html);
  }

  async sendNotificationEmail(email: string, notification: any) {
    const subject = `New Notification: ${notification.type}`;
    const html = `
      <h2>${notification.title}</h2>
      <p>${notification.message}</p>
      <a href="${process.env.FRONTEND_URL}${notification.link}">View Details</a>
    `;
    return this.sendEmail(email, subject, html);
  }

  async sendTipReceivedEmail(email: string, tipDetails: any) {
    const subject = 'You received a tip!';
    const html = `
      <h2>You received a tip of ${tipDetails.amount} ${tipDetails.currency}!</h2>
      <p>From: ${tipDetails.fromUser}</p>
      <p>Post: ${tipDetails.postTitle}</p>
      <a href="${process.env.FRONTEND_URL}/posts/${tipDetails.postId}">View Post</a>
    `;
    return this.sendEmail(email, subject, html);
  }
}
