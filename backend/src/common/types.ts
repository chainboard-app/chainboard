export type Chain = 'stellar' | 'ethereum' | 'solana' | 'base';

export interface WalletAddress {
  chain: Chain;
  address: string;
  label?: string;
}

export interface NFT {
  id: string;
  chain: Chain;
  name: string;
  collectionName?: string;
  imageUrl?: string;
  tokenId?: string;
  contractAddress?: string;
  assetCode?: string;
  assetIssuer?: string;
}

export interface WalletActivityItem {
  id: string;
  type: 'tip' | 'stellar_payment' | 'ethereum_transfer' | 'stellar_contract' | 'ethereum_contract';
  chain: Chain;
  amount?: number;
  fromAddress?: string;
  toAddress?: string;
  assetCode?: string;
  assetIssuer?: string;
  tokenId?: string;
  contractAddress?: string;
  txHash: string;
  timestamp: Date;
  description?: string;
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
