import { useState } from 'react';
import { toast } from 'sonner';
import { todosStorage } from '../storage/todos-storage';
import type { EditTodoRequest } from '../api/todos-client';

export const useEditTodo = (_teamId: string, onClose?: () => void) => {
  const [isPending, setIsPending] = useState(false);

  const mutate = (request: EditTodoRequest) => {
    try {
      setIsPending(true);
      toast.loading('Editando tarefa...', { id: 'edit-todo-loading' });

      const result = todosStorage.updateTodo(request.todoId, {
        task: request.task,
        pomodoroCycles: request.pomodoroCycles,
        todoDate: request.todoDate,
      });

      if (!result) {
        throw new Error('Tarefa não encontrada');
      }

      toast.dismiss('edit-todo-loading');
      toast.success('Tarefa editada com sucesso!', { id: 'edit-todo-success' });

      // Trigger a custom event to notify other components
      window.dispatchEvent(new Event('todos-updated'));

      onClose?.();
    } catch (error) {
      toast.dismiss('edit-todo-loading');
      toast.error(`Erro ao editar tarefa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, {
        id: 'edit-todo-error',
      });
    } finally {
      setIsPending(false);
    }
  };

  return {
    editTodo: {
      mutate,
      isPending,
    },
  };
};
