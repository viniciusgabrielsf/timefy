import { useState } from 'react';
import { toast } from 'sonner';
import { todosStorage } from '../storage/todos-storage';

export const useDeleteTodo = (_teamId: string, onClose?: () => void) => {
  const [isPending, setIsPending] = useState(false);

  const mutate = (todoId: string) => {
    try {
      setIsPending(true);
      toast.loading('Excluindo tarefa...', { id: 'delete-todo-loading' });

      const success = todosStorage.deleteTodo(todoId);

      if (!success) {
        throw new Error('Tarefa não encontrada');
      }

      toast.dismiss('delete-todo-loading');
      toast.success('Tarefa excluída com sucesso!', { id: 'delete-todo-success' });

      // Trigger a custom event to notify other components
      window.dispatchEvent(new Event('todos-updated'));

      onClose?.();
    } catch (error) {
      toast.dismiss('delete-todo-loading');
      toast.error(`Erro ao excluir tarefa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, {
        id: 'delete-todo-error',
      });
    } finally {
      setIsPending(false);
    }
  };

  return {
    deleteTodo: {
      mutate,
      isPending,
    },
  };
};
