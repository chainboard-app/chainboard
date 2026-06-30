import React, { useState } from 'react';
import type { Post } from '../../types';
import { CHAIN_CONFIG } from '../../data/mockData';
import { Avatar } from '../Avatar';

interface PostCardProps {
  post: Post;
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

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [upvoted, setUpvoted] = useState(post.hasUpvoted ?? false);
  const [upvoteCount, setUpvoteCount] = useState(post.upvotes);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [userReactions, setUserReactions] = useState<Set<ReactionType>>(new Set());
  const [reactionCounts, setReactionCounts] = useState<Record<ReactionType, number>>({
    fire: 0,
    build: 0,
    handshake: 0,
  });
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

  const totalReactions = Object.values(reactionCounts).reduce((sum, val) => sum + val, 0);

  return (
    <article
      id={`post-${post.id}`}
      className="post-card"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'border-color 0.2s, background 0.2s',
        cursor: 'default',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar user={post.author} size="sm" />
          <div style={{ lineHeight: 1.3 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#F1F5F9' }>
              {post.author.displayName}
            </span>
            {post.author.isVerified && (
              <span
                title="Verified"
                style={{ marginLeft: 4, color: '#7B61FF', fontSize: 12 }}
              >
                ✓
              </span>
            )}
            <div style={{ fontSize: 12, color: '#64748B' }>
              @{post.author.username} · {formatDate(post.createdAt)}
            </div>
          </div>
        </div>

        {/* Chain Badge */}
        <span
          style={{
            background: chain.bg,
            color: chain.color,
            fontSize: 11,
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 99,
            border: `1px solid ${chain.color}30`,
            letterSpacing: '0.3px',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}
        >
          {chain.icon} {chain.label}
        </span>
      </div>

      {/* Content */}
      <p
        style={{
          margin: 0,
          fontSize: 15,
          lineHeight: 1.65,
          color: '#CBD5E1',
        }}
      >
        {post.content}
      </p>

      {/* Reactions */}
      {totalReactions > 0 && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {REACTIONS.filter(r => reactionCounts[r.type] > 0).map(reaction => (
            <button
              key={reaction.type}
              onClick={() => handleToggleReaction(reaction.type)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: userReactions.has(reaction.type) ? 'rgba(123, 97, 255, 0.15)' : 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 999,
                padding: '4px 10px',
                cursor: 'pointer',
                color: '#E2E8F0',
                fontSize: 13,
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
            >
              {reaction.emoji}
              {reactionCounts[reaction.type]}
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          paddingTop: 4,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          position: 'relative',
        }}
      >
        {/* Reaction Picker */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#64748B',
              fontSize: 13,
              fontWeight: 600,
              padding: '4px 0',
              transition: 'color 0.2s',
            }}
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
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                background: 'rgba(15, 23, 42, 0.98)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: 8,
                display: 'flex',
                gap: 4,
                marginBottom: 8,
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
            >
              {REACTIONS.map(reaction => (
                <button
                  key={reaction.type}
                  onClick={() => {
                    handleToggleReaction(reaction.type);
                    setShowReactionPicker(false);
                  }}
                  style={{
                    background: userReactions.has(reaction.type) ? 'rgba(123, 97, 255, 0.2)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 20,
                    padding: '6px 10px',
                    borderRadius: 8,
                    transition: 'all 0.2s',
                  }}
                >
                  {reaction.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Upvote */}
        <button
          id={`upvote-${post.id}`}
          onClick={handleUpvote}
          aria-pressed={upvoted}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: upvoted ? '#7B61FF' : '#64748B',
            fontSize: 13,
            fontWeight: 600,
            padding: '4px 0',
            transition: 'color 0.2s',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={upvoted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2">
            <path d="M12 19V6M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {formatNumber(upvoteCount)}
        </button>

        {/* Comments */}
        <button
          id={`comment-${post.id}`}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#64748B',
            fontSize: 13,
            fontWeight: 600,
            padding: '4px 0',
            transition: 'color 0.2s',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {formatNumber(post.commentsCount)}
        </button>

        {/* Tips */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#10B981',
            fontSize: 13,
            fontWeight: 600,
            marginLeft: 'auto',
          }}
        >
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
