import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { NotificationType, NotificationDelivery } from '../common/types';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getPreferences(userId: string): Promise<Record<NotificationType, NotificationDelivery>> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      return {
        [NotificationType.REPLY]: NotificationDelivery.IN_APP,
        [NotificationType.TIP]: NotificationDelivery.IN_APP,
        [NotificationType.MENTION]: NotificationDelivery.IN_APP,
      };
    }
    return user.notificationPreferences;
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<Record<NotificationType, NotificationDelivery>>,
  ): Promise<Record<NotificationType, NotificationDelivery>> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    user.notificationPreferences = { ...user.notificationPreferences, ...preferences };
    await this.usersRepository.save(user);
    return user.notificationPreferences;
  }
}
