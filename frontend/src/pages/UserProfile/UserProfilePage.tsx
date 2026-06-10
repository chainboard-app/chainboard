import React, { useState, useMemo } from 'react';
import type { Chain } from '../../types';
import { mockUser, mockPosts, CHAIN_CONFIG } from '../../data/mockData';
import { Avatar } from '../../components/Avatar';
import { WalletBadge } from '../../components/WalletBadge/WalletBadge';
import { PostCard } from '../../components/PostCard/PostCard';

type FilterChain = Chain | 'all';

function StatBox({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: accent ?? '#F1F5F9',
          letterSpacing: '-0.5px',
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{label}</span>
    </div>
  );
}

function formatK(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

function formatJoined(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export const UserProfilePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterChain>('all');

  const chainFilters: { key: FilterChain; label: string }[] = [
    { key: 'all', label: 'All posts' },
    ...Object.entries(CHAIN_CONFIG).map(([key, cfg]) => ({
      key: key as Chain,
      label: cfg.label,
    })),
  ];

  const filteredPosts = useMemo(
    () =>
      activeFilter === 'all'
        ? mockPosts
        : mockPosts.filter((p) => p.chainTag === activeFilter),
    [activeFilter],
  );

  return (
    <div
      id="user-profile-page"
      style={{
        minHeight: '100vh',
        background: '#0B0F1A',
        color: '#F1F5F9',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* ─── Top Nav ─────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(11,15,26,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 24px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: 20 }}>⛓️</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: 18,
              background: 'linear-gradient(90deg, #7B61FF, #627EEA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.3px',
            }}
          >
            ChainBoard
          </span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            id="nav-notifications"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#94A3B8',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <Avatar user={mockUser} size="sm" />
        </div>
      </nav>

      {/* ─── Content ──────────────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '40px 24px 80px',
        }}
      >
        {/* ── Profile Header Card ─────────────────────────────────────────── */}
        <section
          id="profile-header"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24,
            padding: 32,
            marginBottom: 32,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle gradient orb */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              background: 'radial-gradient(circle, rgba(123,97,255,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: -40,
              left: -40,
              width: 200,
              height: 200,
              background: 'radial-gradient(circle, rgba(98,126,234,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Top row: Avatar + Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 20,
              marginBottom: 20,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              {/* Avatar with ring */}
              <div
                style={{
                  padding: 3,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7B61FF, #627EEA)',
                }}
              >
                <div
                  style={{
                    padding: 2,
                    borderRadius: '50%',
                    background: '#0B0F1A',
                  }}
                >
                  <Avatar user={mockUser} size="xl" />
                </div>
              </div>

              {/* Name + handle */}
              <div style={{ paddingTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: 26,
                      fontWeight: 800,
                      letterSpacing: '-0.5px',
                      color: '#F1F5F9',
                    }}
                  >
                    {mockUser.displayName}
                  </h1>
                  {mockUser.isVerified && (
                    <span
                      title="Verified builder"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7B61FF, #627EEA)',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748B' }}>
                  @{mockUser.username}
                  {mockUser.githubUsername && (
                    <a
                      href={`https://github.com/${mockUser.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginLeft: 10,
                        color: '#64748B',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        transition: 'color 0.2s',
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.61-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.115 2.51.338 1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#475569' }}>
                  Joined {formatJoined(mockUser.joinedAt)}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                id="profile-tip-button"
                style={{
                  background: 'linear-gradient(135deg, #7B61FF 0%, #627EEA 100%)',
                  border: 'none',
                  borderRadius: 10,
                  padding: '9px 18px',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 14px rgba(123,97,255,0.3)',
                  transition: 'opacity 0.2s, transform 0.15s',
                }}
              >
                💸 Tip
              </button>
              <button
                id="profile-follow-button"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding: '9px 18px',
                  color: '#CBD5E1',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                Follow
              </button>
            </div>
          </div>

          {/* Bio */}
          {mockUser.bio && (
            <p
              style={{
                margin: '0 0 24px',
                fontSize: 15,
                color: '#94A3B8',
                lineHeight: 1.65,
                maxWidth: 580,
              }}
            >
              {mockUser.bio}
            </p>
          )}

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              gap: 32,
              padding: '20px 0',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              marginBottom: 24,
              flexWrap: 'wrap',
            }}
          >
            <StatBox label="Followers" value={formatK(mockUser.followersCount)} />
            <StatBox label="Following" value={formatK(mockUser.followingCount)} />
            <StatBox label="Posts" value={`${mockPosts.length}`} />
            <StatBox
              label="Tips Received"
              value={`$${mockUser.totalTipsReceived.toLocaleString()}`}
              accent="#10B981"
            />
            <StatBox
              label="Total Upvotes"
              value={formatK(mockUser.totalUpvotes)}
              accent="#7B61FF"
            />
          </div>

          {/* Wallet Addresses */}
          <div>
            <h2
              style={{
                margin: '0 0 12px',
                fontSize: 13,
                fontWeight: 700,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}
            >
              Linked Wallets
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockUser.walletAddresses.map((w) => (
                <WalletBadge key={`${w.chain}-${w.address}`} wallet={w} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Post History ─────────────────────────────────────────────────── */}
        <section id="post-history">
          {/* Section header + filter tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>
              Post History
              <span
                style={{
                  marginLeft: 10,
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#475569',
                  verticalAlign: 'middle',
                }}
              >
                {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
              </span>
            </h2>

            {/* Chain filter */}
            <div
              role="tablist"
              aria-label="Filter posts by chain"
              style={{
                display: 'flex',
                gap: 6,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: 4,
              }}
            >
              {chainFilters.map((f) => {
                const isActive = activeFilter === f.key;
                const chainCfg = f.key !== 'all' ? CHAIN_CONFIG[f.key] : null;
                return (
                  <button
                    key={f.key}
                    id={`filter-${f.key}`}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveFilter(f.key)}
                    style={{
                      background: isActive
                        ? chainCfg
                          ? chainCfg.bg
                          : 'rgba(123,97,255,0.15)'
                        : 'none',
                      border: 'none',
                      borderRadius: 8,
                      padding: '5px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: isActive
                        ? chainCfg
                          ? chainCfg.color
                          : '#7B61FF'
                        : '#64748B',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chainCfg && !isActive ? `${chainCfg.icon} ` : ''}{f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Posts list */}
          {filteredPosts.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 0',
                color: '#475569',
                fontSize: 15,
              }}
            >
              No posts on this chain yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
