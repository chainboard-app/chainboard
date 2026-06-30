import React from 'react';
import { CHAIN_CONFIG } from '../../data/mockData';
import { mockUser } from '../../data/mockData';
import type { TipHistoryItem, Chain } from '../../types';

// Mock data
const mockTipHistory: TipHistoryItem[] = [
  {
    id: '1',
    amount: 50,
    chain: 'ethereum',
    sender: { id: 'u2', displayName: 'Bob Builder', username: 'bobbuilder', avatarUrl: undefined },
    receiver: mockUser,
    createdAt: new Date(Date.now() - 86400000 * 2,
  },
  {
    id: '2',
    amount: 25.5,
    chain: 'stellar',
    sender: mockUser,
    receiver: { id: 'u3', displayName: 'Alice Dev', username: 'alicedev', avatarUrl: undefined },
    createdAt: new Date(Date.now() - 86400000 * 5,
  },
  {
    id: '3',
    amount: 100,
    chain: 'base',
    sender: { id: 'u4', displayName: 'Charlie Coder', username: 'charliecoder', avatarUrl: undefined },
    receiver: mockUser,
    createdAt: new Date(Date.now() - 86400000 * 10,
  },
];

function formatDate(iso: Date | string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function TipHistoryPage() {
  // TODO: fetch from API
  const [history] = React.useState<TipHistoryItem[]>(mockTipHistory);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tip History</h1>
      <div className="space-y-4">
        {history.map((tip) => {
          const isSent = tip.sender.id === mockUser.id;
          const config = CHAIN_CONFIG[tip.chain];
          return (
            <div
              key={tip.id}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{ background: config.bg, color: config.color, fontSize: 12, padding: '4px 10px', borderRadius: 999 }}>
                    {config.icon} {config.label}
                  </span>
                  <span style={{ color: '#64748B', fontSize: 14 }}>{formatDate(tip.createdAt)}</span>
                </div>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: isSent ? '#EF4444' : '#10B981',
                  }}
                >
                  {isSent ? '-' : '+'}${tip.amount.toFixed(2)} USDC
                </span>
              </div>
              <div style={{ color: '#E2E8F0', fontSize: 15 }}>
                {isSent ? (
                  <>
                    Sent to <strong>
                      {tip.receiver.displayName} (@{tip.receiver.username})
                    </strong>
                  </>
                ) : (
                  <>
                    Received from <strong>
                      {tip.sender.displayName} (@{tip.sender.username})
                    </strong>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
