import { useState } from 'react';
import { toast } from 'sonner';
import { todosStorage } from '../storage/todos-storage';

export const useToggleComplete = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = (todoId: string) => {
    try {
      setIsPending(true);

      const result = todosStorage.toggleComplete(todoId);

      if (!result) {
        throw new Error('Tarefa não encontrada');
      }

      const message = result.completed ? 'Tarefa concluída!' : 'Tarefa reaberta!';
      toast.success(message, { id: 'toggle-complete-success' });

      // Trigger a custom event to notify other components
      window.dispatchEvent(new Event('todos-updated'));
    } catch (error) {
      toast.error(`Erro ao atualizar tarefa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, {
        id: 'toggle-complete-error',
      });
    } finally {
      setIsPending(false);
    }
  };

  return {
    toggleComplete: {
      mutate,
      isPending,
    },
  };
};
