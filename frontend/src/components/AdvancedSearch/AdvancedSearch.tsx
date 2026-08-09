import { useState } from 'react';

interface SearchFilters {
  query: string;
  author?: string;
  community?: string;
  chain?: string;
  dateFrom?: string;
  dateTo?: string;
  minTips?: number;
  hasMedia?: boolean;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  availableCommunities: string[];
  availableChains: string[];
}

export function AdvancedSearch({
  onSearch,
  availableCommunities,
  availableChains,
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({ query: '' });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({ query: '' });
    onSearch({ query: '' });
  };

  return (
    <div className="advanced-search">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search posts..."
          value={filters.query}
          onChange={(e) => handleFilterChange('query', e.target.value)}
          className="search-input"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={() => setIsExpanded(!isExpanded)} className="toggle-filters">
          {isExpanded ? '▲' : '▼'}
        </button>
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {isExpanded && (
        <div className="search-filters">
          <div className="filter-group">
            <label>Author</label>
            <input
              type="text"
              value={filters.author || ''}
              onChange={(e) => handleFilterChange('author', e.target.value)}
              placeholder="Username"
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Community</label>
            <select
              value={filters.community || ''}
              onChange={(e) => handleFilterChange('community', e.target.value)}
              className="filter-select"
            >
              <option value="">All Communities</option>
              {availableCommunities.map((community) => (
                <option key={community} value={community}>
                  {community}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Chain</label>
            <select
              value={filters.chain || ''}
              onChange={(e) => handleFilterChange('chain', e.target.value)}
              className="filter-select"
            >
              <option value="">All Chains</option>
              {availableChains.map((chain) => (
                <option key={chain} value={chain}>
                  {chain}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Date From</label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Date To</label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Min Tips</label>
            <input
              type="number"
              value={filters.minTips || ''}
              onChange={(e) => handleFilterChange('minTips', Number(e.target.value))}
              placeholder="0"
              min="0"
              className="filter-input"
            />
          </div>

          <div className="filter-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={filters.hasMedia || false}
                onChange={(e) => handleFilterChange('hasMedia', e.target.checked)}
              />
              Has Media
            </label>
          </div>

          <div className="filter-actions">
            <button onClick={handleReset} className="btn-secondary">
              Reset
            </button>
            <button onClick={handleSearch} className="btn-primary">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
