import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToggleComplete } from './use-toggle-complete';
import { todosStorage } from '../storage/todos-storage';
import { toast } from 'sonner';

vi.mock('../storage/todos-storage', () => ({
  todosStorage: {
    toggleComplete: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useToggleComplete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'dispatchEvent');
  });

  describe('mutate', () => {
    it('toggles todo to completed', () => {
      const todoId = '1';
      const mockCompletedTodo = {
        id: '1',
        task: 'Test task',
        pomodoroCycles: 2,
        todoDate: '2026-06-12',
        completed: true,
      };
      vi.mocked(todosStorage.toggleComplete).mockReturnValue(mockCompletedTodo);

      const { result } = renderHook(() => useToggleComplete());

      act(() => {
        result.current.toggleComplete.mutate(todoId);
      });

      expect(todosStorage.toggleComplete).toHaveBeenCalledWith(todoId);
      expect(toast.success).toHaveBeenCalledWith('Tarefa concluída!', { id: 'toggle-complete-success' });
      expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(Event));
    });

    it('toggles todo to not completed', () => {
      const todoId = '1';
      const mockIncompleteTodo = {
        id: '1',
        task: 'Test task',
        pomodoroCycles: 2,
        todoDate: '2026-06-12',
        completed: false,
      };
      vi.mocked(todosStorage.toggleComplete).mockReturnValue(mockIncompleteTodo);

      const { result } = renderHook(() => useToggleComplete());

      act(() => {
        result.current.toggleComplete.mutate(todoId);
      });

      expect(todosStorage.toggleComplete).toHaveBeenCalledWith(todoId);
      expect(toast.success).toHaveBeenCalledWith('Tarefa reaberta!', { id: 'toggle-complete-success' });
      expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(Event));
    });

    it('sets isPending to true during mutation and false after', () => {
      const todoId = '1';
      const mockTodo = {
        id: '1',
        task: 'Test task',
        pomodoroCycles: 2,
        todoDate: '2026-06-12',
        completed: true,
      };
      vi.mocked(todosStorage.toggleComplete).mockReturnValue(mockTodo);

      const { result } = renderHook(() => useToggleComplete());

      expect(result.current.toggleComplete.isPending).toBe(false);

      act(() => {
        result.current.toggleComplete.mutate(todoId);
      });

      expect(result.current.toggleComplete.isPending).toBe(false);
    });

    it('dispatches todos-updated event', () => {
      const todoId = '1';
      const mockTodo = {
        id: '1',
        task: 'Event test',
        pomodoroCycles: 3,
        todoDate: '2026-06-12',
        completed: true,
      };
      vi.mocked(todosStorage.toggleComplete).mockReturnValue(mockTodo);

      const { result } = renderHook(() => useToggleComplete());

      act(() => {
        result.current.toggleComplete.mutate(todoId);
      });

      const dispatchCall = vi.mocked(window.dispatchEvent).mock.calls[0][0];
      expect(dispatchCall.type).toBe('todos-updated');
    });

    it('throws error when todo is not found', () => {
      const todoId = 'non-existent';
      vi.mocked(todosStorage.toggleComplete).mockReturnValue(null);

      const { result } = renderHook(() => useToggleComplete());

      act(() => {
        result.current.toggleComplete.mutate(todoId);
      });

      expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar tarefa: Tarefa não encontrada', {
        id: 'toggle-complete-error',
      });
    });

    it('handles error when toggleComplete throws', () => {
      const todoId = '1';
      const errorMessage = 'Storage error';
      vi.mocked(todosStorage.toggleComplete).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const { result } = renderHook(() => useToggleComplete());

      act(() => {
        result.current.toggleComplete.mutate(todoId);
      });

      expect(toast.error).toHaveBeenCalledWith(`Erro ao atualizar tarefa: ${errorMessage}`, {
        id: 'toggle-complete-error',
      });
    });

    it('handles non-Error exceptions', () => {
      const todoId = '1';
      vi.mocked(todosStorage.toggleComplete).mockImplementation(() => {
        throw 'String error';
      });

      const { result } = renderHook(() => useToggleComplete());

      act(() => {
        result.current.toggleComplete.mutate(todoId);
      });

      expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar tarefa: Erro desconhecido', {
        id: 'toggle-complete-error',
      });
    });

    it('sets isPending to false even when error occurs', () => {
      const todoId = '1';
      vi.mocked(todosStorage.toggleComplete).mockImplementation(() => {
        throw new Error('Test error');
      });

      const { result } = renderHook(() => useToggleComplete());

      act(() => {
        result.current.toggleComplete.mutate(todoId);
      });

      expect(result.current.toggleComplete.isPending).toBe(false);
    });

    it('does not dispatch event when error occurs', () => {
      const todoId = '1';
      vi.mocked(todosStorage.toggleComplete).mockReturnValue(null);

      const { result } = renderHook(() => useToggleComplete());

      act(() => {
        result.current.toggleComplete.mutate(todoId);
      });

      expect(window.dispatchEvent).not.toHaveBeenCalled();
    });
  });
});
