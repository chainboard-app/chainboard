export type Chain = 'stellar' | 'ethereum' | 'solana' | 'base';

export interface WalletAddress {
  chain: Chain;
  address: string;
  label?: string;
}

export enum NotificationType {
  REPLY = 'reply',
  TIP = 'tip',
  MENTION = 'mention',
}

export enum NotificationDelivery {
  IN_APP = 'in_app',
  EMAIL = 'email',
  BOTH = 'both',
}
