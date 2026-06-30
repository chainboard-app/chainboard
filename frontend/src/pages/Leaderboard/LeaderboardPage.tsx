import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { TimeWindow } from '../../types';
import { mockUser } from '../../data/mockData';

const mockLeaderboard = {
  topTippers: [
    { ...mockUser, amount: 1500.5 },
    { ...mockUser, amount: 1200.0, username: 'johndoe', displayName: 'John Doe' },
    { ...mockUser, amount: 950.25, username: 'janedoe', displayName: 'Jane Doe' },
  ],
  topEarners: [
    { ...mockUser, amount: 2500.0, username: 'satoshi', displayName: 'Satoshi' },
    { ...mockUser, amount: 1800.75 },
    { ...mockUser, amount: 1450.5, username: 'vitalik', displayName: 'Vitalik' },
  ],
};

export function LeaderboardPage() {
  const [window, setWindow] = useState<TimeWindow>('30d');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tip Leaderboard</h1>
        <div className="flex gap-2">
          {(['7d', '30d', 'all'] as TimeWindow[]).map((w) => (
            <button
              key={w}
              onClick={() => setWindow(w)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                window === w
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {w === '7d' ? 'Last 7 Days' : w === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">💸</span> Top Tippers
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {mockLeaderboard.topTippers.map((entry, index) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold">
                  {index + 1}
                </div>
                <Link
                  to={`/users/${entry.username}`}
                  className="flex items-center gap-3 flex-1 hover:opacity-80"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                    {entry.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{entry.displayName}</div>
                    <div className="text-sm text-gray-500">@{entry.username}</div>
                  </div>
                </Link>
                <div className="font-semibold text-green-600">
                  ${entry.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">🏆</span> Top Earners
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {mockLeaderboard.topEarners.map((entry, index) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-bold">
                  {index + 1}
                </div>
                <Link
                  to={`/users/${entry.username}`}
                  className="flex items-center gap-3 flex-1 hover:opacity-80"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                    {entry.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{entry.displayName}</div>
                    <div className="text-sm text-gray-500">@{entry.username}</div>
                  </div>
                </Link>
                <div className="font-semibold text-green-600">
                  ${entry.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
