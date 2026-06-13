import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodoSearch } from './use-todo-search';
import type { Todo } from '../types';

// Mock useDebounce to return the value immediately for testing
vi.mock('@/hooks/use-debounce', () => ({
  useDebounce: vi.fn((value: string) => value),
}));

describe('useTodoSearch', () => {
  const mockTodos: Todo[] = [
    {
      id: '1',
      task: 'Buy groceries',
      pomodoroCycles: 2,
      todoDate: '2026-06-12',
      completed: false,
    },
    {
      id: '2',
      task: 'Write code',
      pomodoroCycles: 3,
      todoDate: '2026-06-12',
      completed: false,
    },
    {
      id: '3',
      task: 'Review pull request',
      pomodoroCycles: 1,
      todoDate: '2026-06-12',
      completed: true,
    },
    {
      id: '4',
      task: 'buy coffee',
      pomodoroCycles: 1,
      todoDate: '2026-06-13',
      completed: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('returns empty search string initially', () => {
      const { result } = renderHook(() => useTodoSearch(mockTodos));

      expect(result.current.search).toBe('');
    });

    it('returns all todos when search is empty', () => {
      const { result } = renderHook(() => useTodoSearch(mockTodos));

      expect(result.current.filteredTodos).toEqual(mockTodos);
      expect(result.current.filteredTodos).toHaveLength(4);
    });
  });

  describe('filtering', () => {
    it('filters todos by task name (case-insensitive)', () => {
      const { result } = renderHook(() => useTodoSearch(mockTodos));

      act(() => {
        result.current.setSearch('buy');
      });

      expect(result.current.filteredTodos).toHaveLength(2);
      expect(result.current.filteredTodos).toEqual([
        expect.objectContaining({ task: 'Buy groceries' }),
        expect.objectContaining({ task: 'buy coffee' }),
      ]);
    });

    it('filters with case-insensitive matching', () => {
      const { result } = renderHook(() => useTodoSearch(mockTodos));

      act(() => {
        result.current.setSearch('BUY');
      });

      expect(result.current.filteredTodos).toHaveLength(2);
    });

    it('filters with partial match', () => {
      const { result } = renderHook(() => useTodoSearch(mockTodos));

      act(() => {
        result.current.setSearch('code');
      });

      expect(result.current.filteredTodos).toHaveLength(1);
      expect(result.current.filteredTodos[0].task).toBe('Write code');
    });

    it('returns empty array when no matches found', () => {
      const { result } = renderHook(() => useTodoSearch(mockTodos));

      act(() => {
        result.current.setSearch('nonexistent');
      });

      expect(result.current.filteredTodos).toHaveLength(0);
      expect(result.current.filteredTodos).toEqual([]);
    });

    it('trims whitespace from search query', () => {
      const { result } = renderHook(() => useTodoSearch(mockTodos));

      act(() => {
        result.current.setSearch('  buy  ');
      });

      expect(result.current.filteredTodos).toHaveLength(2);
    });

    it('returns all todos when search is only whitespace', () => {
      const { result } = renderHook(() => useTodoSearch(mockTodos));

      act(() => {
        result.current.setSearch('   ');
      });

      expect(result.current.filteredTodos).toEqual(mockTodos);
      expect(result.current.filteredTodos).toHaveLength(4);
    });
  });

  describe('search state management', () => {
    it('updates search state when setSearch is called', () => {
      const { result } = renderHook(() => useTodoSearch(mockTodos));

      expect(result.current.search).toBe('');

      act(() => {
        result.current.setSearch('groceries');
      });

      expect(result.current.search).toBe('groceries');
    });

    it('handles empty todos array', () => {
      const { result } = renderHook(() => useTodoSearch([]));

      expect(result.current.filteredTodos).toEqual([]);

      act(() => {
        result.current.setSearch('test');
      });

      expect(result.current.filteredTodos).toEqual([]);
    });

    it('updates filtered todos when todos prop changes', () => {
      const { result, rerender } = renderHook(
        ({ todos }) => useTodoSearch(todos),
        { initialProps: { todos: mockTodos } }
      );

      expect(result.current.filteredTodos).toHaveLength(4);

      const newTodos = mockTodos.slice(0, 2);
      rerender({ todos: newTodos });

      expect(result.current.filteredTodos).toHaveLength(2);
    });

    it('maintains search filter when todos prop changes', () => {
      const { result, rerender } = renderHook(
        ({ todos }) => useTodoSearch(todos),
        { initialProps: { todos: mockTodos } }
      );

      act(() => {
        result.current.setSearch('buy');
      });

      expect(result.current.filteredTodos).toHaveLength(2);

      const newTodos = [
        ...mockTodos,
        {
          id: '5',
          task: 'Buy tickets',
          pomodoroCycles: 1,
          todoDate: '2026-06-14',
          completed: false,
        },
      ];
      rerender({ todos: newTodos });

      expect(result.current.filteredTodos).toHaveLength(3);
      expect(result.current.search).toBe('buy');
    });
  });

  describe('clearing search', () => {
    it('returns all todos when search is cleared', () => {
      const { result } = renderHook(() => useTodoSearch(mockTodos));

      act(() => {
        result.current.setSearch('buy');
      });

      expect(result.current.filteredTodos).toHaveLength(2);

      act(() => {
        result.current.setSearch('');
      });

      expect(result.current.filteredTodos).toEqual(mockTodos);
      expect(result.current.filteredTodos).toHaveLength(4);
    });
  });
});
