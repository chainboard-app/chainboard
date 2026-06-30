import React, { useState, useEffect } from 'react';
import type { WalletAddress } from '../../types';
import { CHAIN_CONFIG } from '../../data/mockData';

interface WalletBadgeProps {
  wallet: WalletAddress;
}

function truncateAddress(address: string, chain: string): string {
  if (chain === 'stellar') {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

async function resolveENS(address: string): Promise<string | null> {
  try {
    const response = await fetch('https://api.ensideas.com/ens/resolve/' + address);
    if (response.ok) {
      const data = await response.json();
      return data.name || null;
    }
    return null;
  } catch {
    return null;
  }
}

async function resolveStellarFederation(address: string): Promise<string | null> {
  // Basic Stellar Federation lookup
  try {
    return null;
  } catch {
    return null;
  }
}

export const WalletBadge: React.FC<WalletBadgeProps> = ({ wallet }) => {
  const [copied, setCopied] = useState(false);
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const config = CHAIN_CONFIG[wallet.chain];

  useEffect(() => {
    let mounted = true;
    const resolve = async () => {
      setIsResolving(true);
      let name: string | null = null;
      if (wallet.chain === 'ethereum' || wallet.chain === 'base') {
        name = await resolveENS(wallet.address);
      } else if (wallet.chain === 'stellar') {
        name = await resolveStellarFederation(wallet.address);
      }
      if (mounted) {
        setResolvedName(name);
        setIsResolving(false);
      }
    };
    resolve();
    return () => { mounted = false; };
  }, [wallet.chain, wallet.address]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  const displayName = resolvedName || truncateAddress(wallet.address, wallet.chain);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid rgba(255,255,255,0.08)`,
        borderRadius: 12,
        padding: '10px 14px',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Chain indicator */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: config.bg,
          border: `1px solid ${config.color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          color: config.color,
          flexShrink: 0,
        }}
      >
        {config.icon}
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: config.color }}>
            {config.label}
          </span>
          {wallet.label && (
            <span
              style={{
                fontSize: 10,
                background: 'rgba(255,255,255,0.06)',
                color: '#94A3B8',
                padding: '1px 6px',
                borderRadius: 4,
                fontWeight: 500,
              }}
            >
              {wallet.label}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
          {resolvedName && (
            <span
              style={{
                fontSize: 13,
                color: '#E2E8F0',
                fontWeight: 500,
              }}
            >
              {resolvedName}
            </span>
          )}
          <code
            style={{
              fontSize: 12,
              color: '#64748B',
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {isResolving ? 'Resolving...' : truncateAddress(wallet.address, wallet.chain)}
          </code>
        </div>
      </div>

      {/* Copy button */}
      <button
        id={`copy-wallet-${wallet.chain}`}
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy address'}
        style={{
          background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${copied ? '#10B98130' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 8,
          width: 30,
          height: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: copied ? '#10B981' : '#94A3B8',
          transition: 'all 0.2s',
          flexShrink: 0,
        }}
      >
        {copied ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20,6 9,17 4,12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
};
