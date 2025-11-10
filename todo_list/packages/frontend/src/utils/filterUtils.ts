import { Todo, FilterState } from '../types';

export const filterTodos = (todos: Todo[], filters: FilterState): Todo[] => {
  let filtered = [...todos];

  // Apply status filter
  if (filters.status === 'active') {
    filtered = filtered.filter(todo => !todo.completed);
  } else if (filters.status === 'completed') {
    filtered = filtered.filter(todo => todo.completed);
  }

  // Apply search filter
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(todo =>
      todo.title.toLowerCase().includes(query)
    );
  }

  // Apply sort order
  filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return filters.sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return filtered;
};

export const getFilterSummary = (filters: FilterState): string => {
  const parts: string[] = [];

  if (filters.status !== 'all') {
    parts.push(filters.status);
  }

  if (filters.searchQuery.trim()) {
    parts.push(`"${filters.searchQuery}"`);
  }

  if (parts.length === 0) return 'All todos';
  return parts.join(' matching ');
};
