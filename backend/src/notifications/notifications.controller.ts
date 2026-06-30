import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationType, NotificationDelivery } from '../common/types';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('preferences/:userId')
  getPreferences(
    @Param('userId') userId: string,
  ): Promise<Record<NotificationType, NotificationDelivery>> {
    return this.notificationsService.getPreferences(userId);
  }

  @Patch('preferences/:userId')
  updatePreferences(
    @Param('userId') userId: string,
    @Body()
    preferences: Partial<Record<NotificationType, NotificationDelivery>>,
  ): Promise<Record<NotificationType, NotificationDelivery>> {
    return this.notificationsService.updatePreferences(userId, preferences);
  }
}
