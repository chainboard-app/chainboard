import React, { useState } from 'react';

export function ModerationDashboard() {
  const [queue] = useState([
    {
      postId: '1',
      post: {
        id: '1',
        content: 'This is a reported post...',
        author: { displayName: 'User1' },
      },
      count: 5,
      reports: [
        { reason: 'spam' },
        { reason: 'harassment' },
      ],
    },
    {
      postId: '2',
      post: {
        id: '2',
        content: 'Another reported post...',
        author: { displayName: 'User2' },
      },
      count: 3,
      reports: [
        { reason: 'misinformation' },
      ],
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Moderation Queue</h1>

        <div className="space-y-6">
          {queue.map((item) => (
          <div key={item.postId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-900 font-medium">{item.post.content}</p>
                <p className="text-sm text-gray-500">By {item.post.author.displayName}</p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {item.reports.map((report, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                    >
                      {report.reason}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-2xl font-bold text-red-500">
                {item.count}
              </span>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                Dismiss
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Remove Post
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
