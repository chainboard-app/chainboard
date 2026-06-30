import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PostCard } from '../../components/PostCard/PostCard';
import { PostComposer } from '../../components/PostComposer/PostComposer';
import { mockPosts } from '../../data/mockData';
import { CHAIN_CONFIG } from '../../data/mockData';
import type { Chain } from '../../types';

export function FeedPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedChain = ((searchParams.get('chain') as Chain) || 'all') as Chain | 'all';

  const filteredPosts = useMemo(() => {
    if (selectedChain === 'all') {
      return mockPosts;
    }
    return mockPosts.filter((post) => post.chainTag === selectedChain);
  }, [selectedChain]);

  const handleChainSelect = (chain: Chain | 'all') => {
    if (chain === 'all') {
      searchParams.delete('chain');
    } else {
      searchParams.set('chain', chain);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ChainBoard Feed</h1>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleChainSelect('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedChain === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {Object.entries(CHAIN_CONFIG).map(([chain, config]) => (
          <button
            key={chain}
            onClick={() => handleChainSelect(chain as Chain)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedChain === chain
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor: selectedChain === chain ? config.color : undefined,
            }}
          >
            {config.icon} {config.label}
          </button>
        ))}
      </div>

      <PostComposer />

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
