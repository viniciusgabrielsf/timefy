import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDeleteTodo } from './use-delete-todo';
import { todosStorage } from '../storage/todos-storage';
import { toast } from 'sonner';

vi.mock('../storage/todos-storage', () => ({
  todosStorage: {
    deleteTodo: vi.fn(),
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

describe('useDeleteTodo', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'dispatchEvent');
  });

  describe('mutate', () => {
    it('deletes a todo successfully', () => {
      const todoId = '1';
      vi.mocked(todosStorage.deleteTodo).mockReturnValue(true);

      const { result } = renderHook(() => useDeleteTodo(mockOnClose));

      act(() => {
        result.current.deleteTodo.mutate(todoId);
      });

      expect(todosStorage.deleteTodo).toHaveBeenCalledWith(todoId);
      expect(toast.loading).toHaveBeenCalledWith('Excluindo tarefa...', { id: 'delete-todo-loading' });
      expect(toast.dismiss).toHaveBeenCalledWith('delete-todo-loading');
      expect(toast.success).toHaveBeenCalledWith('Tarefa excluída com sucesso!', { id: 'delete-todo-success' });
      expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(Event));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('sets isPending to true during mutation and false after', () => {
      const todoId = '1';
      vi.mocked(todosStorage.deleteTodo).mockReturnValue(true);

      const { result } = renderHook(() => useDeleteTodo());

      expect(result.current.deleteTodo.isPending).toBe(false);

      act(() => {
        result.current.deleteTodo.mutate(todoId);
      });

      expect(result.current.deleteTodo.isPending).toBe(false);
    });

    it('dispatches todos-updated event', () => {
      const todoId = '1';
      vi.mocked(todosStorage.deleteTodo).mockReturnValue(true);

      const { result } = renderHook(() => useDeleteTodo());

      act(() => {
        result.current.deleteTodo.mutate(todoId);
      });

      const dispatchCall = vi.mocked(window.dispatchEvent).mock.calls[0][0];
      expect(dispatchCall.type).toBe('todos-updated');
    });

    it('works without onClose callback', () => {
      const todoId = '1';
      vi.mocked(todosStorage.deleteTodo).mockReturnValue(true);

      const { result } = renderHook(() => useDeleteTodo());

      act(() => {
        result.current.deleteTodo.mutate(todoId);
      });

      expect(todosStorage.deleteTodo).toHaveBeenCalledWith(todoId);
      expect(toast.success).toHaveBeenCalled();
    });

    it('throws error when todo is not found', () => {
      const todoId = 'non-existent';
      vi.mocked(todosStorage.deleteTodo).mockReturnValue(false);

      const { result } = renderHook(() => useDeleteTodo(mockOnClose));

      act(() => {
        result.current.deleteTodo.mutate(todoId);
      });

      expect(toast.dismiss).toHaveBeenCalledWith('delete-todo-loading');
      expect(toast.error).toHaveBeenCalledWith('Erro ao excluir tarefa: Tarefa não encontrada', {
        id: 'delete-todo-error',
      });
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('handles error when deleteTodo throws', () => {
      const todoId = '1';
      const errorMessage = 'Storage error';
      vi.mocked(todosStorage.deleteTodo).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const { result } = renderHook(() => useDeleteTodo(mockOnClose));

      act(() => {
        result.current.deleteTodo.mutate(todoId);
      });

      expect(toast.dismiss).toHaveBeenCalledWith('delete-todo-loading');
      expect(toast.error).toHaveBeenCalledWith(`Erro ao excluir tarefa: ${errorMessage}`, {
        id: 'delete-todo-error',
      });
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('handles non-Error exceptions', () => {
      const todoId = '1';
      vi.mocked(todosStorage.deleteTodo).mockImplementation(() => {
        throw 'String error';
      });

      const { result } = renderHook(() => useDeleteTodo());

      act(() => {
        result.current.deleteTodo.mutate(todoId);
      });

      expect(toast.error).toHaveBeenCalledWith('Erro ao excluir tarefa: Erro desconhecido', {
        id: 'delete-todo-error',
      });
    });

    it('sets isPending to false even when error occurs', () => {
      const todoId = '1';
      vi.mocked(todosStorage.deleteTodo).mockImplementation(() => {
        throw new Error('Test error');
      });

      const { result } = renderHook(() => useDeleteTodo());

      act(() => {
        result.current.deleteTodo.mutate(todoId);
      });

      expect(result.current.deleteTodo.isPending).toBe(false);
    });
  });
});
