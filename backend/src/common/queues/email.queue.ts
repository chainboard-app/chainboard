/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Logger } from '@nestjs/common';

export const EMAIL_QUEUE = 'email';

export interface EmailJobData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  type: 'welcome' | 'notification' | 'tip' | 'custom';
}

@Processor(EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(@InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue) {
    super();
  }

  async process(job: Job<EmailJobData>): Promise<any> {
    this.logger.log(`Processing email job ${job.id} for ${job.data.to}`);

    try {
      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.logger.log(`Email sent successfully to ${job.data.to}`);
      return { success: true, messageId: job.id };
    } catch (error) {
      this.logger.error(`Failed to send email to ${job.data.to}`, error);
      throw error;
    }
  }

  async addEmailJob(data: EmailJobData) {
    return this.emailQueue.add(EMAIL_QUEUE, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 100,
      removeOnFail: 50,
    });
  }
}
