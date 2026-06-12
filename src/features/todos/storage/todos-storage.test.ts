import { describe, it, expect, beforeEach, vi } from 'vitest';
import { todosStorage } from './todos-storage';
import type { Todo } from '../types';

describe('todosStorage', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    // Replace global localStorage with mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Clear localStorage before each test
    localStorageMock.clear();

    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('getTodos', () => {
    it('returns empty array when localStorage is empty', () => {
      const result = todosStorage.getTodos();

      expect(result).toEqual([]);
    });

    it('returns todos from localStorage', () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          task: 'Test task',
          pomodoroCycles: 2,
          todoDate: '2026-06-12',
          completed: false,
        },
      ];
      localStorage.setItem('timefy_todos', JSON.stringify(mockTodos));

      const result = todosStorage.getTodos();

      expect(result).toEqual(mockTodos);
    });

    it('returns empty array on JSON parse error', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('timefy_todos', 'invalid json');

      const result = todosStorage.getTodos();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error reading todos from localStorage:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe('saveTodos', () => {
    it('saves todos to localStorage', () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          task: 'Test task',
          pomodoroCycles: 2,
          todoDate: '2026-06-12',
          completed: false,
        },
      ];

      todosStorage.saveTodos(mockTodos);

      const saved = localStorage.getItem('timefy_todos');
      expect(saved).toBe(JSON.stringify(mockTodos));
    });

    it('throws a custom error when saving fails', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      todosStorage.saveTodos([]);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving todos to localStorage:', expect.any(Error));

      consoleErrorSpy.mockRestore();
      setItemSpy.mockRestore();
    });
  });

  describe('addTodo', () => {
    it('adds a new todo with generated id and completed=false', () => {
      const newTodo = {
        task: 'New task',
        pomodoroCycles: 3,
        todoDate: '2026-06-15',
      };

      const result = todosStorage.addTodo(newTodo);

      expect(result).toMatchObject({
        ...newTodo,
        completed: false,
      });
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
    });

    it('adds todo to existing todos', () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          task: 'Existing task',
          pomodoroCycles: 1,
          todoDate: '2026-06-10',
          completed: false,
        },
      ];
      localStorage.setItem('timefy_todos', JSON.stringify(existingTodos));

      const newTodo = {
        task: 'New task',
        pomodoroCycles: 2,
        todoDate: '2026-06-12',
      };

      todosStorage.addTodo(newTodo);

      const allTodos = todosStorage.getTodos();
      expect(allTodos).toHaveLength(2);
      expect(allTodos[1].task).toBe('New task');
    });

    it('persists todo to localStorage', () => {
      const newTodo = {
        task: 'Persistent task',
        pomodoroCycles: 4,
        todoDate: '2026-06-20',
      };

      todosStorage.addTodo(newTodo);

      const saved = localStorage.getItem('timefy_todos');
      const parsed = JSON.parse(saved!);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].task).toBe('Persistent task');
    });
  });

  describe('updateTodo', () => {
    it('updates an existing todo', () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          task: 'Original task',
          pomodoroCycles: 2,
          todoDate: '2026-06-12',
          completed: false,
        },
      ];
      localStorage.setItem('timefy_todos', JSON.stringify(existingTodos));

      const updates = {
        task: 'Updated task',
        pomodoroCycles: 5,
      };

      const result = todosStorage.updateTodo('1', updates);

      expect(result).toMatchObject({
        id: '1',
        task: 'Updated task',
        pomodoroCycles: 5,
        todoDate: '2026-06-12',
        completed: false,
      });
    });

    it('returns null when todo not found', () => {
      const result = todosStorage.updateTodo('nonexistent', { task: 'Updated' });

      expect(result).toBeNull();
    });

    it('persists updates to localStorage', () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          task: 'Original task',
          pomodoroCycles: 2,
          todoDate: '2026-06-12',
          completed: false,
        },
      ];
      localStorage.setItem('timefy_todos', JSON.stringify(existingTodos));

      todosStorage.updateTodo('1', { task: 'Updated task' });

      const saved = localStorage.getItem('timefy_todos');
      const parsed = JSON.parse(saved!);

      expect(parsed[0].task).toBe('Updated task');
    });

    it('allows partial updates', () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          task: 'Original task',
          pomodoroCycles: 2,
          todoDate: '2026-06-12',
          completed: false,
        },
      ];
      localStorage.setItem('timefy_todos', JSON.stringify(existingTodos));

      const result = todosStorage.updateTodo('1', { completed: true });

      expect(result?.completed).toBe(true);
      expect(result?.task).toBe('Original task');
      expect(result?.pomodoroCycles).toBe(2);
    });
  });

  describe('deleteTodo', () => {
    it('deletes an existing todo', () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          task: 'Task 1',
          pomodoroCycles: 2,
          todoDate: '2026-06-12',
          completed: false,
        },
        {
          id: '2',
          task: 'Task 2',
          pomodoroCycles: 3,
          todoDate: '2026-06-13',
          completed: false,
        },
      ];
      localStorage.setItem('timefy_todos', JSON.stringify(existingTodos));

      const result = todosStorage.deleteTodo('1');

      expect(result).toBe(true);

      const remaining = todosStorage.getTodos();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('2');
    });

    it('returns false when todo not found', () => {
      const result = todosStorage.deleteTodo('nonexistent');

      expect(result).toBe(false);
    });

    it('persists deletion to localStorage', () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          task: 'Task to delete',
          pomodoroCycles: 2,
          todoDate: '2026-06-12',
          completed: false,
        },
      ];
      localStorage.setItem('timefy_todos', JSON.stringify(existingTodos));

      todosStorage.deleteTodo('1');

      const saved = localStorage.getItem('timefy_todos');
      const parsed = JSON.parse(saved!);

      expect(parsed).toHaveLength(0);
    });
  });

  describe('getTodosByDate', () => {
    beforeEach(() => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          task: 'June 2026 task',
          pomodoroCycles: 2,
          todoDate: '2026-06-15',
          completed: false,
        },
        {
          id: '2',
          task: 'July 2026 task',
          pomodoroCycles: 3,
          todoDate: '2026-07-20',
          completed: false,
        },
        {
          id: '3',
          task: 'Another June 2026 task',
          pomodoroCycles: 1,
          todoDate: '2026-06-25',
          completed: true,
        },
        {
          id: '4',
          task: 'June 2025 task',
          pomodoroCycles: 4,
          todoDate: '2025-06-10',
          completed: false,
        },
      ];

      localStorage.setItem('timefy_todos', JSON.stringify(mockTodos));
    });

    it('returns all todos when no date provided', () => {
      const result = todosStorage.getTodosByDate('');

      expect(result).toHaveLength(4);
    });

    it('filters todos by month and year', () => {
      const result = todosStorage.getTodosByDate('2026-06-01');

      expect(result).toHaveLength(2);
      expect(result[0].task).toBe('June 2026 task');
      expect(result[1].task).toBe('Another June 2026 task');
    });

    it('returns empty array when no todos match the date', () => {
      const result = todosStorage.getTodosByDate('2027-01-01');

      expect(result).toHaveLength(0);
    });

    it('matches by month regardless of day', () => {
      const resultStart = todosStorage.getTodosByDate('2026-06-01');
      const resultMid = todosStorage.getTodosByDate('2026-06-15');
      const resultEnd = todosStorage.getTodosByDate('2026-06-30');

      expect(resultStart).toHaveLength(2);
      expect(resultMid).toHaveLength(2);
      expect(resultEnd).toHaveLength(2);
    });

    it('distinguishes between different years', () => {
      const result2026 = todosStorage.getTodosByDate('2026-06-01');
      const result2025 = todosStorage.getTodosByDate('2025-06-01');

      expect(result2026).toHaveLength(2);
      expect(result2025).toHaveLength(1);
      expect(result2025[0].task).toBe('June 2025 task');
    });

    it('handles todos without todoDate', () => {
      const todosWithMissingDate: Todo[] = [
        {
          id: '1',
          task: 'Valid task',
          pomodoroCycles: 2,
          todoDate: '2026-06-15',
          completed: false,
        },
        {
          id: '2',
          task: 'Invalid task',
          pomodoroCycles: 3,
          todoDate: '',
          completed: false,
        },
      ];
      localStorage.setItem('timefy_todos', JSON.stringify(todosWithMissingDate));

      const result = todosStorage.getTodosByDate('2026-06-01');

      expect(result).toHaveLength(1);
      expect(result[0].task).toBe('Valid task');
    });
  });

  describe('toggleComplete', () => {
    it('toggles completed status from false to true', () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          task: 'Task to complete',
          pomodoroCycles: 2,
          todoDate: '2026-06-12',
          completed: false,
        },
      ];
      localStorage.setItem('timefy_todos', JSON.stringify(existingTodos));

      const result = todosStorage.toggleComplete('1');

      expect(result?.completed).toBe(true);
    });

    it('toggles completed status from true to false', () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          task: 'Completed task',
          pomodoroCycles: 2,
          todoDate: '2026-06-12',
          completed: true,
        },
      ];
      localStorage.setItem('timefy_todos', JSON.stringify(existingTodos));

      const result = todosStorage.toggleComplete('1');

      expect(result?.completed).toBe(false);
    });

    it('returns null when todo not found', () => {
      const result = todosStorage.toggleComplete('nonexistent');

      expect(result).toBeNull();
    });

    it('persists toggle to localStorage', () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          task: 'Task to complete',
          pomodoroCycles: 2,
          todoDate: '2026-06-12',
          completed: false,
        },
      ];
      localStorage.setItem('timefy_todos', JSON.stringify(existingTodos));

      todosStorage.toggleComplete('1');

      const saved = localStorage.getItem('timefy_todos');
      const parsed = JSON.parse(saved!);

      expect(parsed[0].completed).toBe(true);
    });

    it('does not modify other fields when toggling', () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          task: 'Original task',
          pomodoroCycles: 5,
          todoDate: '2026-06-12',
          completed: false,
        },
      ];
      localStorage.setItem('timefy_todos', JSON.stringify(existingTodos));

      const result = todosStorage.toggleComplete('1');

      expect(result?.task).toBe('Original task');
      expect(result?.pomodoroCycles).toBe(5);
      expect(result?.todoDate).toBe('2026-06-12');
      expect(result?.id).toBe('1');
    });
  });
});
