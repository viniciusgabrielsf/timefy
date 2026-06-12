import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditTodo } from './use-edit-todo';
import { todosStorage } from '../storage/todos-storage';
import { toast } from 'sonner';

vi.mock('../storage/todos-storage', () => ({
  todosStorage: {
    updateTodo: vi.fn(),
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

describe('useEditTodo', () => {
  const teamId = 'team-123';
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'dispatchEvent');
  });

  describe('mutate', () => {
    it('edits a todo successfully', () => {
      const request = {
        todoId: '1',
        task: 'Updated task',
        pomodoroCycles: 5,
        todoDate: '2026-06-13',
      };
      const mockUpdatedTodo = {
        id: '1',
        task: 'Updated task',
        pomodoroCycles: 5,
        todoDate: '2026-06-13',
        completed: false,
      };
      vi.mocked(todosStorage.updateTodo).mockReturnValue(mockUpdatedTodo);

      const { result } = renderHook(() => useEditTodo(teamId, mockOnClose));

      act(() => {
        result.current.editTodo.mutate(request);
      });

      expect(todosStorage.updateTodo).toHaveBeenCalledWith('1', {
        task: 'Updated task',
        pomodoroCycles: 5,
        todoDate: '2026-06-13',
      });
      expect(toast.loading).toHaveBeenCalledWith('Editando tarefa...', { id: 'edit-todo-loading' });
      expect(toast.dismiss).toHaveBeenCalledWith('edit-todo-loading');
      expect(toast.success).toHaveBeenCalledWith('Tarefa editada com sucesso!', { id: 'edit-todo-success' });
      expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(Event));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('sets isPending to true during mutation and false after', () => {
      const request = {
        todoId: '1',
        task: 'Test task',
        pomodoroCycles: 2,
        todoDate: '2026-06-12',
      };
      const mockUpdatedTodo = {
        id: '1',
        task: 'Test task',
        pomodoroCycles: 2,
        todoDate: '2026-06-12',
        completed: false,
      };
      vi.mocked(todosStorage.updateTodo).mockReturnValue(mockUpdatedTodo);

      const { result } = renderHook(() => useEditTodo(teamId));

      expect(result.current.editTodo.isPending).toBe(false);

      act(() => {
        result.current.editTodo.mutate(request);
      });

      expect(result.current.editTodo.isPending).toBe(false);
    });

    it('dispatches todos-updated event', () => {
      const request = {
        todoId: '1',
        task: 'Event test',
        pomodoroCycles: 3,
        todoDate: '2026-06-12',
      };
      const mockUpdatedTodo = {
        id: '1',
        task: 'Event test',
        pomodoroCycles: 3,
        todoDate: '2026-06-12',
        completed: false,
      };
      vi.mocked(todosStorage.updateTodo).mockReturnValue(mockUpdatedTodo);

      const { result } = renderHook(() => useEditTodo(teamId));

      act(() => {
        result.current.editTodo.mutate(request);
      });

      const dispatchCall = vi.mocked(window.dispatchEvent).mock.calls[0][0];
      expect(dispatchCall.type).toBe('todos-updated');
    });

    it('works without onClose callback', () => {
      const request = {
        todoId: '1',
        task: 'No callback',
        pomodoroCycles: 1,
        todoDate: '2026-06-12',
      };
      const mockUpdatedTodo = {
        id: '1',
        task: 'No callback',
        pomodoroCycles: 1,
        todoDate: '2026-06-12',
        completed: false,
      };
      vi.mocked(todosStorage.updateTodo).mockReturnValue(mockUpdatedTodo);

      const { result } = renderHook(() => useEditTodo(teamId));

      act(() => {
        result.current.editTodo.mutate(request);
      });

      expect(todosStorage.updateTodo).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });

    it('throws error when todo is not found', () => {
      const request = {
        todoId: 'non-existent',
        task: 'Not found',
        pomodoroCycles: 1,
        todoDate: '2026-06-12',
      };
      vi.mocked(todosStorage.updateTodo).mockReturnValue(null);

      const { result } = renderHook(() => useEditTodo(teamId, mockOnClose));

      act(() => {
        result.current.editTodo.mutate(request);
      });

      expect(toast.dismiss).toHaveBeenCalledWith('edit-todo-loading');
      expect(toast.error).toHaveBeenCalledWith('Erro ao editar tarefa: Tarefa não encontrada', {
        id: 'edit-todo-error',
      });
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('handles error when updateTodo throws', () => {
      const request = {
        todoId: '1',
        task: 'Error task',
        pomodoroCycles: 1,
        todoDate: '2026-06-12',
      };
      const errorMessage = 'Storage error';
      vi.mocked(todosStorage.updateTodo).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const { result } = renderHook(() => useEditTodo(teamId, mockOnClose));

      act(() => {
        result.current.editTodo.mutate(request);
      });

      expect(toast.dismiss).toHaveBeenCalledWith('edit-todo-loading');
      expect(toast.error).toHaveBeenCalledWith(`Erro ao editar tarefa: ${errorMessage}`, {
        id: 'edit-todo-error',
      });
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('handles non-Error exceptions', () => {
      const request = {
        todoId: '1',
        task: 'Unknown error',
        pomodoroCycles: 1,
        todoDate: '2026-06-12',
      };
      vi.mocked(todosStorage.updateTodo).mockImplementation(() => {
        throw 'String error';
      });

      const { result } = renderHook(() => useEditTodo(teamId));

      act(() => {
        result.current.editTodo.mutate(request);
      });

      expect(toast.error).toHaveBeenCalledWith('Erro ao editar tarefa: Erro desconhecido', {
        id: 'edit-todo-error',
      });
    });

    it('sets isPending to false even when error occurs', () => {
      const request = {
        todoId: '1',
        task: 'Error handling',
        pomodoroCycles: 1,
        todoDate: '2026-06-12',
      };
      vi.mocked(todosStorage.updateTodo).mockImplementation(() => {
        throw new Error('Test error');
      });

      const { result } = renderHook(() => useEditTodo(teamId));

      act(() => {
        result.current.editTodo.mutate(request);
      });

      expect(result.current.editTodo.isPending).toBe(false);
    });
  });
});
