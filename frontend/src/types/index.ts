export type Chain = 'stellar' | 'ethereum' | 'solana' | 'base';

export interface WalletAddress {
  chain: Chain;
  address: string;
  label?: string;
}

export type NotificationType = 'reply' | 'tip' | 'mention';

export const NotificationType = {
  REPLY: 'reply',
  TIP: 'tip',
  MENTION: 'mention',
} as const;

export type NotificationDelivery = 'in_app' | 'email' | 'both';

export const NotificationDelivery = {
  IN_APP: 'in_app',
  EMAIL: 'email',
  BOTH: 'both',
} as const;

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

export type GatingType = 'token' | 'nft';

export const GatingType = {
  TOKEN: 'token',
  NFT: 'nft',
} as const;

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

export interface TipHistoryItem {
  id: string;
  amount: number;
  chain: Chain;
  sender: Pick<UserProfile, 'id' | 'displayName' | 'username' | 'avatarUrl'>;
  receiver: Pick<UserProfile, 'id' | 'displayName' | 'username' | 'avatarUrl'>;
  createdAt: string;
  postId?: string;
}

