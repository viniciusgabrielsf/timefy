import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { todosClient, type EditTodoRequest } from '../api/todos-client';

export const useEditTodo = (teamId: string, onClose?: () => void) => {
  const queryClient = useQueryClient();

  const editTodoMutation = useMutation({
    mutationKey: ['edit-todo'],
    mutationFn: async (request: EditTodoRequest) => {
      toast.loading('Editando todo...', { id: 'edit-todo-loading' });

      return todosClient.editTodo(teamId, request);
    },
    onSuccess: () => {
      toast.dismiss('edit-todo-loading');
      toast.success('Pagamento editado com sucesso!', { id: 'edit-todo-success' });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      onClose?.();
    },
    onError: (error: Error) => {
      toast.dismiss('edit-todo-loading');
      toast.error(`Erro ao editar todo: ${error.message}`, { id: 'edit-todo-error' });
    },
  });

  return {
    editTodo: editTodoMutation,
  };
};
