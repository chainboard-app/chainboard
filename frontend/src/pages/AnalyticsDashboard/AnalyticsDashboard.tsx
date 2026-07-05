import React from 'react';

export function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Impressions</h3>
            <p className="text-3xl font-bold text-gray-900">12,450</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Tips Received</h3>
            <p className="text-3xl font-bold text-gray-900">$3,250</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Follower Growth (30d)</h3>
            <p className="text-3xl font-bold text-gray-900">+128</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tips Received Over Time</h2>
          <div className="h-64 flex items-end justify-around">
            {[50, 120, 80, 200, 150, 90, 180].map((amount, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className="w-12 bg-purple-500 rounded-t"
                  style={{ height: `${(amount / 200) * 200}px` }}
                />
                <span className="text-xs text-gray-500">Day {index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Posts</h2>
          <div className="space-y-4">
            {[
              { title: 'My first post!', impressions: 3200, tips: 850, upvotes: 210 },
              { title: 'Check out this project', impressions: 2800, tips: 620, upvotes: 180 },
              { title: 'Building in public', impressions: 2400, tips: 480, upvotes: 150 },
            ].map((post, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{post.title}</h4>
                  <p className="text-sm text-gray-500">
                    {post.impressions.toLocaleString()} impressions • {post.upvotes} upvotes
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${post.tips}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
