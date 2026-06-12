import { useState } from 'react';
import { toast } from 'sonner';
import { todosStorage } from '../storage/todos-storage';
import type { CreateTodoRequest } from '../api/todos-client';

export const useCreateTodo = (_teamId: string, onClose?: () => void) => {
  const [isPending, setIsPending] = useState(false);

  const mutate = (request: CreateTodoRequest) => {
    try {
      setIsPending(true);
      toast.loading('Criando tarefa...', { id: 'create-todo-loading' });

      todosStorage.addTodo({
        task: request.task,
        pomodoroCycles: request.pomodoroCycles,
        todoDate: request.todoDate,
      });

      toast.dismiss('create-todo-loading');
      toast.success('Tarefa criada com sucesso!', { id: 'create-todo-success' });

      // Trigger a custom event to notify other components
      window.dispatchEvent(new Event('todos-updated'));

      onClose?.();
    } catch (error) {
      toast.dismiss('create-todo-loading');
      toast.error(`Erro ao criar tarefa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, {
        id: 'create-todo-error',
      });
    } finally {
      setIsPending(false);
    }
  };

  return {
    createTodo: {
      mutate,
      isPending,
    },
  };
};
