import { useState, useEffect, useMemo } from 'react';
import { Todo, FilterState, TodoStatus, SortOrder } from './types';
import { api } from './api';
import { FilterBar } from './components/FilterBar';
import { filterTodos } from './utils/filterUtils';
import { useDebounce } from './hooks/useDebounce';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state with localStorage persistence
  const [filters, setFilters] = useLocalStorage<FilterState>('todoFilters', {
    status: 'all',
    searchQuery: '',
    sortOrder: 'newest',
  });

  // Debounced search query for performance
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTodos();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      setError(null);
      const todo = await api.createTodo({ title: newTodoTitle });
      setTodos([todo, ...todos]);
      setNewTodoTitle('');
    } catch (err) {
      setError('Failed to create todo');
      console.error(err);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      setError(null);
      const updated = await api.updateTodo(todo.id, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setError(null);
      await api.deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  // Apply filters to todos with memoization for performance
  const filteredTodos = useMemo(() => {
    return filterTodos(todos, {
      ...filters,
      searchQuery: debouncedSearchQuery,
    });
  }, [todos, filters.status, debouncedSearchQuery, filters.sortOrder]);

  // Calculate todo counts for filter display
  const todoCount = {
    all: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
    filtered: filteredTodos.length,
  };

  // Filter handlers
  const handleStatusChange = (status: TodoStatus) => {
    setFilters({ ...filters, status });
  };

  const handleSearchChange = (searchQuery: string) => {
    setFilters({ ...filters, searchQuery });
  };

  const handleSortChange = (sortOrder: SortOrder) => {
    setFilters({ ...filters, sortOrder });
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      searchQuery: '',
      sortOrder: 'newest',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Todo List
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <FilterBar
          filters={filters}
          onStatusChange={handleStatusChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
          todoCount={todoCount}
        />

        <form onSubmit={handleCreateTodo} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              Add
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            {todos.length === 0
              ? 'No todos yet. Add one to get started!'
              : 'No todos match your filters.'}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
        className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
      />
      <span
        className={`flex-1 ${
          todo.completed
            ? 'line-through text-gray-500'
            : 'text-gray-900'
        }`}
      >
        {todo.title}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
      >
        Delete
      </button>
    </div>
  );
}

export default App;
