export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface NewTodo {
  title: string;
  completed?: boolean;
}

// Filter-related types
export type TodoStatus = 'all' | 'active' | 'completed';

export type SortOrder = 'newest' | 'oldest';

export interface FilterState {
  status: TodoStatus;
  searchQuery: string;
  sortOrder: SortOrder;
}

export interface FilterOptions {
  onStatusChange: (status: TodoStatus) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (order: SortOrder) => void;
  onClearFilters: () => void;
}
