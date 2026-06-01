import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { todosClient, type CreateTodoRequest } from '../api/todos-client';

export const useCreateTodo = (teamId: string, onClose?: () => void) => {
  const queryClient = useQueryClient();

  const createTodoMutation = useMutation({
    mutationKey: ['create-todo'],
    mutationFn: async (request: CreateTodoRequest) => {
      toast.loading('Criando todo...', { id: 'create-todo-loading' });

      return todosClient.createTodo(teamId, request);
    },
    onSuccess: () => {
      toast.dismiss('create-todo-loading');
      toast.success('Pagamento criado com sucesso!', { id: 'create-todo-success' });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      onClose?.();
    },
    onError: (error: Error) => {
      toast.dismiss('create-todo-loading');
      toast.error(`Erro ao criar todo: ${error.message}`, { id: 'create-todo-error' });
    },
  });

  return {
    createTodo: createTodoMutation,
  };
};
