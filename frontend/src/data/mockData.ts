import type { UserProfile, Post, Chain } from '../types';

// ─── Mock User ───────────────────────────────────────────────────────────────
export const mockUser: UserProfile = {
  id: 'usr_01j9x2m4k8v3n7p',
  displayName: 'Alex Rivera',
  username: 'alexrivera',
  avatarUrl: undefined, // will use generated initials avatar
  bio: 'Full-stack Web3 builder. Stellar ambassador · Ethereum contributor. Building open-source tools for the decentralised future. 🚀',
  walletAddresses: [
    {
      chain: 'stellar',
      address: 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPWZQE2BJPV4CJZJZ4QI6BRPXM',
      label: 'Primary',
    },
    {
      chain: 'ethereum',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      label: 'Main',
    },
  ],
  githubUsername: 'alexrivera',
  joinedAt: '2024-03-12T09:22:00Z',
  followersCount: 1284,
  followingCount: 347,
  totalTipsReceived: 1432.75,
  totalUpvotes: 8921,
  isVerified: true,
};

// ─── Mock Posts ──────────────────────────────────────────────────────────────
const authorBase = {
  id: mockUser.id,
  displayName: mockUser.displayName,
  username: mockUser.username,
  avatarUrl: mockUser.avatarUrl,
  isVerified: mockUser.isVerified,
};

export const mockPosts: Post[] = [
  {
    id: 'post_01',
    author: authorBase,
    content:
      '🔥 Just shipped a major update to our Soroban escrow contract. The new timelock feature lets you schedule conditional releases with sub-second precision. Full audit report attached — this is how Web3 security should look.',
    chainTag: 'stellar',
    upvotes: 342,
    tipsReceived: 88.5,
    commentsCount: 47,
    createdAt: '2025-11-18T14:32:00Z',
    status: 'active',
    hasUpvoted: false,
  },
  {
    id: 'post_02',
    author: authorBase,
    content:
      'Hot take: Account abstraction is the single biggest UX unlock for Ethereum in 2025. Stop talking about L3s and start educating users. If grandma can\'t use it, we failed.',
    chainTag: 'ethereum',
    upvotes: 891,
    tipsReceived: 215.0,
    commentsCount: 128,
    createdAt: '2025-11-14T09:15:00Z',
    status: 'active',
    hasUpvoted: true,
  },
  {
    id: 'post_03',
    author: authorBase,
    content:
      "Stellar's Horizon API now returns federated addresses natively in transaction history — massive for human-readable UX. Tested it in production this morning, no edge cases found. Thread 🧵👇",
    chainTag: 'stellar',
    upvotes: 203,
    tipsReceived: 44.25,
    commentsCount: 31,
    createdAt: '2025-11-08T17:44:00Z',
    status: 'active',
    hasUpvoted: false,
  },
  {
    id: 'post_04',
    author: authorBase,
    content:
      'Open-sourced our multi-sig wallet toolkit for Solidity contracts today. Five audited contracts, 100% test coverage, MIT licensed. The community deserves better tooling. Star it and spread the word ⭐',
    chainTag: 'ethereum',
    upvotes: 512,
    tipsReceived: 330.0,
    commentsCount: 66,
    createdAt: '2025-10-29T20:00:00Z',
    status: 'active',
    hasUpvoted: false,
  },
  {
    id: 'post_05',
    author: authorBase,
    content:
      'Two years into building on Stellar. It still surprises me how low the friction is for cross-border payments. Settled 10,000 txns yesterday under $0.01 total fees. This is the real world use case Web3 promised.',
    chainTag: 'stellar',
    upvotes: 1043,
    tipsReceived: 491.5,
    commentsCount: 94,
    createdAt: '2025-10-22T11:05:00Z',
    status: 'active',
    hasUpvoted: true,
  },
  {
    id: 'post_06',
    author: authorBase,
    content:
      'Base is quietly eating L2 market share. Low fees + Coinbase distribution is a powerful moat. Watching this space very closely.',
    chainTag: 'base',
    upvotes: 678,
    tipsReceived: 163.5,
    commentsCount: 82,
    createdAt: '2025-10-15T08:30:00Z',
    status: 'active',
    hasUpvoted: false,
  },
];

// ─── Chain Config ─────────────────────────────────────────────────────────────
export const CHAIN_CONFIG: Record<Chain, { label: string; color: string; bg: string; icon: string }> = {
  stellar: {
    label: 'Stellar',
    color: '#7B61FF',
    bg: 'rgba(123,97,255,0.12)',
    icon: '✦',
  },
  ethereum: {
    label: 'Ethereum',
    color: '#627EEA',
    bg: 'rgba(98,126,234,0.12)',
    icon: '⬡',
  },
  solana: {
    label: 'Solana',
    color: '#14F195',
    bg: 'rgba(20,241,149,0.12)',
    icon: '◎',
  },
  base: {
    label: 'Base',
    color: '#0052FF',
    bg: 'rgba(0,82,255,0.12)',
    icon: '⬤',
  },
};
