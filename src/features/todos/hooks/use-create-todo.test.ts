import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCreateTodo } from './use-create-todo';
import { todosStorage } from '../storage/todos-storage';
import { toast } from 'sonner';

vi.mock('../storage/todos-storage', () => ({
  todosStorage: {
    addTodo: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    loading: vi.fn(),
    dismiss: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useCreateTodo', () => {
  const teamId = 'team-123';
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'dispatchEvent');
  });

  describe('mutate', () => {
    it('creates a todo successfully', () => {
      const request = {
        task: 'New task',
        pomodoroCycles: 3,
        todoDate: '2026-06-12',
      };
      const mockTodo = {
        id: '1',
        task: 'New task',
        pomodoroCycles: 3,
        todoDate: '2026-06-12',
        completed: false,
      };
      vi.mocked(todosStorage.addTodo).mockReturnValue(mockTodo);

      const { result } = renderHook(() => useCreateTodo(teamId, mockOnClose));

      act(() => {
        result.current.createTodo.mutate(request);
      });

      expect(todosStorage.addTodo).toHaveBeenCalledWith(request);
      expect(toast.loading).toHaveBeenCalledWith('Criando tarefa...', { id: 'create-todo-loading' });
      expect(toast.dismiss).toHaveBeenCalledWith('create-todo-loading');
      expect(toast.success).toHaveBeenCalledWith('Tarefa criada com sucesso!', { id: 'create-todo-success' });
      expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(Event));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('sets isPending to true during mutation and false after', () => {
      const request = {
        task: 'Test task',
        pomodoroCycles: 1,
        todoDate: '2026-06-12',
      };
      const mockTodo = {
        id: '1',
        task: 'Test task',
        pomodoroCycles: 1,
        todoDate: '2026-06-12',
        completed: false,
      };
      vi.mocked(todosStorage.addTodo).mockReturnValue(mockTodo);

      const { result } = renderHook(() => useCreateTodo(teamId));

      expect(result.current.createTodo.isPending).toBe(false);

      act(() => {
        result.current.createTodo.mutate(request);
      });

      expect(result.current.createTodo.isPending).toBe(false);
    });

    it('dispatches todos-updated event', () => {
      const request = {
        task: 'Event test',
        pomodoroCycles: 2,
        todoDate: '2026-06-12',
      };
      const mockTodo = {
        id: '1',
        task: 'Event test',
        pomodoroCycles: 2,
        todoDate: '2026-06-12',
        completed: false,
      };
      vi.mocked(todosStorage.addTodo).mockReturnValue(mockTodo);

      const { result } = renderHook(() => useCreateTodo(teamId));

      act(() => {
        result.current.createTodo.mutate(request);
      });

      const dispatchCall = vi.mocked(window.dispatchEvent).mock.calls[0][0];
      expect(dispatchCall.type).toBe('todos-updated');
    });

    it('works without onClose callback', () => {
      const request = {
        task: 'No callback',
        pomodoroCycles: 1,
        todoDate: '2026-06-12',
      };
      const mockTodo = {
        id: '1',
        task: 'No callback',
        pomodoroCycles: 1,
        todoDate: '2026-06-12',
        completed: false,
      };
      vi.mocked(todosStorage.addTodo).mockReturnValue(mockTodo);

      const { result } = renderHook(() => useCreateTodo(teamId));

      act(() => {
        result.current.createTodo.mutate(request);
      });

      expect(todosStorage.addTodo).toHaveBeenCalledWith(request);
      expect(toast.success).toHaveBeenCalled();
    });

    it('handles error when addTodo throws', () => {
      const request = {
        task: 'Error task',
        pomodoroCycles: 1,
        todoDate: '2026-06-12',
      };
      const errorMessage = 'Storage error';
      vi.mocked(todosStorage.addTodo).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const { result } = renderHook(() => useCreateTodo(teamId, mockOnClose));

      act(() => {
        result.current.createTodo.mutate(request);
      });

      expect(toast.dismiss).toHaveBeenCalledWith('create-todo-loading');
      expect(toast.error).toHaveBeenCalledWith(`Erro ao criar tarefa: ${errorMessage}`, {
        id: 'create-todo-error',
      });
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('handles non-Error exceptions', () => {
      const request = {
        task: 'Unknown error',
        pomodoroCycles: 1,
        todoDate: '2026-06-12',
      };
      vi.mocked(todosStorage.addTodo).mockImplementation(() => {
        throw 'String error';
      });

      const { result } = renderHook(() => useCreateTodo(teamId));

      act(() => {
        result.current.createTodo.mutate(request);
      });

      expect(toast.error).toHaveBeenCalledWith('Erro ao criar tarefa: Erro desconhecido', {
        id: 'create-todo-error',
      });
    });

    it('sets isPending to false even when error occurs', () => {
      const request = {
        task: 'Error handling',
        pomodoroCycles: 1,
        todoDate: '2026-06-12',
      };
      vi.mocked(todosStorage.addTodo).mockImplementation(() => {
        throw new Error('Test error');
      });

      const { result } = renderHook(() => useCreateTodo(teamId));

      act(() => {
        result.current.createTodo.mutate(request);
      });

      expect(result.current.createTodo.isPending).toBe(false);
    });
  });
});
