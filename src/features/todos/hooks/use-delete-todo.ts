import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { todosClient } from '../api/todos-client';

export const useDeleteTodo = (teamId: string, onClose?: () => void) => {
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation({
    mutationKey: ['delete-todo'],
    mutationFn: async (todoId: string) => {
      toast.loading('Excluindo todo...', { id: 'delete-todo-loading' });

      return todosClient.deleteTodo(teamId, todoId);
    },
    onSuccess: () => {
      toast.dismiss('delete-todo-loading');
      toast.success('Pagamento excluído com sucesso!', { id: 'delete-todo-success' });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      onClose?.();
    },
    onError: (error: Error) => {
      toast.dismiss('delete-todo-loading');
      toast.error(`Erro ao excluir todo: ${error.message}`, { id: 'delete-todo-error' });
    },
  });

  return {
    deleteTodo: deleteTodoMutation,
  };
};
