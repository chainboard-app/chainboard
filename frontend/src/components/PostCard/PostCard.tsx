import React, { useState } from 'react';
import type { Post } from '../../types';
import { CHAIN_CONFIG } from '../../data/mockData';
import { Avatar } from '../Avatar';

interface PostCardProps {
  post: Post;
  isAuthor?: boolean;
}

type ReactionType = 'fire' | 'build' | 'handshake';

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'fire', emoji: '🔥', label: 'Insightful' },
  { type: 'build', emoji: '🛠️', label: 'Building' },
  { type: 'handshake', emoji: '🤝', label: 'Helpful' },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

export const PostCard: React.FC<PostCardProps> = ({ post, isAuthor = false }) => {
  const [upvoted, setUpvoted] = useState(post.hasUpvoted ?? false);
  const [upvoteCount, setUpvoteCount] = useState(post.upvotes);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [userReactions, setUserReactions] = useState<Set<ReactionType>>(new Set());
  const [reactionCounts, setReactionCounts] = useState<Record<ReactionType, number>>({
    fire: 0,
    build: 0,
    handshake: 0,
  });
  const [isPinned, setIsPinned] = useState(post.isPinned ?? false);
  const [isTogglingPin, setIsTogglingPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const chain = CHAIN_CONFIG[post.chainTag];

  const handleUpvote = () => {
    if (upvoted) {
      setUpvoted(false);
      setUpvoteCount((c) => c - 1);
    } else {
      setUpvoted(true);
      setUpvoteCount((c) => c + 1);
    }
  };

  const handleToggleReaction = (type: ReactionType) => {
    const newSet = new Set(userReactions);
    if (newSet.has(type)) {
      newSet.delete(type);
      setReactionCounts(prev => ({ ...prev, [type]: prev[type] - 1 }));
    } else {
      newSet.add(type);
      setReactionCounts(prev => ({ ...prev, [type]: prev[type] + 1 }));
    }
    setUserReactions(newSet);
  };

  const handleTogglePin = async () => {
    setIsTogglingPin(true);
    setPinError(null);
    try {
      const response = await fetch(`/api/posts/${post.id}/pin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: post.author.id }),
      });
      if (!response.ok) throw new Error('Failed to toggle pin');
      setIsPinned(!isPinned);
    } catch (err) {
      setPinError(err instanceof Error ? err.message : 'Failed to toggle pin');
    } finally {
      setIsTogglingPin(false);
    }
  };

  const totalReactions = Object.values(reactionCounts).reduce((sum, val) => sum + val, 0);

  return (
    <article
      id={`post-${post.id}`}
      className={`post-card rounded-2xl p-5 flex flex-col gap-4 transition-colors cursor-default ${
        isPinned 
          ? 'bg-purple-500/10 border border-purple-500/30' 
          : 'bg-white/[0.03] border border-white/[0.07]'
      }`}
    >
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar user={post.author} size="sm" />
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-slate-100">
                {post.author.displayName}
              </span>
              {isPinned && <span className="text-xs text-purple-400">📌</span>}
              {post.author.isVerified && (
                <span className="text-purple-400 text-xs">✓</span>
              )}
            </div>
            <div className="text-xs text-slate-400">
              @{post.author.username} · {formatDate(post.createdAt)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0"
            style={{
              background: chain.bg,
              color: chain.color,
              border: `1px solid ${chain.color}30`,
            }}
          >
            {chain.icon} {chain.label}
          </span>
          {isAuthor && (
            <button
              onClick={handleTogglePin}
              disabled={isTogglingPin}
              className="bg-white/5 border-none rounded-lg p-1.5 cursor-pointer text-purple-400 disabled:opacity-50"
              title={isPinned ? 'Unpin Post' : 'Pin Post'}
            >
              {isTogglingPin ? '⏳' : '📌'}
            </button>
          )}
        </div>
      </div>

      <p className="m-0 text-sm leading-relaxed text-slate-300">
        {post.content}
      </p>

      {pinError && (
        <div className="text-red-400 text-xs">{pinError}</div>
      )}

      {totalReactions > 0 && (
        <div className="flex gap-2 items-center">
          {REACTIONS.filter(r => reactionCounts[r.type] > 0).map(reaction => (
            <button
              key={reaction.type}
              onClick={() => handleToggleReaction(reaction.type)}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 border border-white/10 cursor-pointer text-slate-200 text-sm font-medium transition-all ${
                userReactions.has(reaction.type) ? 'bg-purple-500/15' : 'bg-white/[0.04]'
              }`}
            >
              {reaction.emoji}
              {reactionCounts[reaction.type]}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-6 items-center pt-1 border-t border-white/[0.05] relative">
        <div className="relative">
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="bg-none border-none cursor-pointer flex items-center gap-1.5 text-slate-400 text-sm font-semibold py-1 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="8" cy="12" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="16" cy="12" r="1" />
            </svg>
            React
          </button>

          {showReactionPicker && (
            <div
              className="absolute bottom-full left-0 bg-slate-900/98 border border-white/10 rounded-xl p-2 flex gap-1 mb-2 shadow-xl"
            >
              {REACTIONS.map(reaction => (
                <button
                  key={reaction.type}
                  onClick={() => {
                    handleToggleReaction(reaction.type);
                    setShowReactionPicker(false);
                  }}
                  className={`text-lg px-2.5 py-1.5 rounded-lg border-none cursor-pointer transition-all ${
                    userReactions.has(reaction.type) ? 'bg-purple-500/20' : 'bg-transparent'
                  }`}
                >
                  {reaction.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          id={`upvote-${post.id}`}
          onClick={handleUpvote}
          aria-pressed={upvoted}
          className="bg-none border-none cursor-pointer flex items-center gap-1.5 text-sm font-semibold py-1 transition-colors"
          style={{ color: upvoted ? '#7B61FF' : '#64748B' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={upvoted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2">
            <path d="M12 19V6M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {formatNumber(upvoteCount)}
        </button>

        <button
          id={`comment-${post.id}`}
          className="bg-none border-none cursor-pointer flex items-center gap-1.5 text-slate-400 text-sm font-semibold py-1 transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {formatNumber(post.commentsCount)}
        </button>

        <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold ml-auto">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v12M9 10h6M9 14h6" strokeLinecap="round" />
          </svg>
          ${post.tipsReceived.toFixed(2)} USDC
        </div>
      </div>
    </article>
  );
};
