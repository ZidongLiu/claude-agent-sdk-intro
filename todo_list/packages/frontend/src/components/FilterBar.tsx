import { FilterState, TodoStatus, SortOrder } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onStatusChange: (status: TodoStatus) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (order: SortOrder) => void;
  onClearFilters: () => void;
  todoCount: {
    all: number;
    active: number;
    completed: number;
    filtered: number;
  };
}

export function FilterBar({
  filters,
  onStatusChange,
  onSearchChange,
  onSortChange,
  onClearFilters,
  todoCount,
}: FilterBarProps) {
  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.searchQuery.trim() !== '' ||
    filters.sortOrder !== 'newest';

  return (
    <div className="mb-6 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search todos..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search todos"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {filters.searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Status Filter Buttons */}
        <div
          className="flex rounded-lg border border-gray-300 overflow-hidden"
          role="group"
          aria-label="Filter by status"
        >
          <button
            onClick={() => onStatusChange('all')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filters.status === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-pressed={filters.status === 'all'}
          >
            All
            <span className="ml-1 text-xs">({todoCount.all})</span>
          </button>
          <button
            onClick={() => onStatusChange('active')}
            className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
              filters.status === 'active'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-pressed={filters.status === 'active'}
          >
            Active
            <span className="ml-1 text-xs">({todoCount.active})</span>
          </button>
          <button
            onClick={() => onStatusChange('completed')}
            className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
              filters.status === 'completed'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-pressed={filters.status === 'completed'}
          >
            Completed
            <span className="ml-1 text-xs">({todoCount.completed})</span>
          </button>
        </div>

        {/* Sort Selector */}
        <select
          value={filters.sortOrder}
          onChange={(e) => onSortChange(e.target.value as SortOrder)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Sort order"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        )}

        {/* Results Count */}
        {filters.searchQuery && (
          <span className="text-sm text-gray-600 ml-auto">
            {todoCount.filtered} result{todoCount.filtered !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}
