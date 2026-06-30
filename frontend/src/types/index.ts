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

export interface UserProfile {
  id: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  walletAddresses: WalletAddress[];
  githubUsername?: string;
  joinedAt: string;
  followersCount: number;
  followingCount: number;
  totalTipsReceived: number; // in USDC
  totalUpvotes: number;
  isVerified: boolean;
  reputationScore?: number;
}

export type PostStatus = 'active' | 'deleted';

export interface Post {
  id: string;
  author: Pick<UserProfile, 'id' | 'displayName' | 'username' | 'avatarUrl' | 'isVerified'>;
  content: string;
  chainTag: Chain;
  upvotes: number;
  tipsReceived: number; // in USDC
  commentsCount: number;
  createdAt: string;
  status: PostStatus;
  hasUpvoted?: boolean;
  community?: Community;
}

export enum GatingType {
  TOKEN = 'token',
  NFT = 'nft',
}

export interface Community {
  id: string;
  name: string;
  description?: string;
  chain: Chain;
  gatingType: GatingType;
  contractAddress: string;
  minBalance: string;
  memberCount: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  amount: number;
}

export interface LeaderboardResponse {
  topTippers: LeaderboardEntry[];
  topEarners: LeaderboardEntry[];
}

export type TimeWindow = '7d' | '30d' | 'all';

