export type Chain = 'stellar' | 'ethereum' | 'solana' | 'base';

export interface WalletAddress {
  chain: Chain;
  address: string;
  label?: string;
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
}
