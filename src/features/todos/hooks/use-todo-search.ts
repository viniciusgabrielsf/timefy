import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import type { Todo } from '../types';

export const useTodoSearch = (todos: Todo[]) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), 300);

  const filteredTodos = useMemo(() => {
    if (!debouncedSearch) {
      return todos;
    }

    const searchLower = debouncedSearch.toLowerCase();
    return todos.filter(todo =>
      todo.task.toLowerCase().includes(searchLower)
    );
  }, [todos, debouncedSearch]);

  return {
    search,
    setSearch,
    filteredTodos,
  };
};
