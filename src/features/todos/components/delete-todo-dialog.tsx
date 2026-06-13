import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/dialog';
import { Button } from '@/components/button';
import type { Todo } from '../types';
import { useDeleteTodo } from '../hooks/use-delete-todo';

type Props = {
  todo: Todo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DeleteTodoDialog = ({ todo, open, onOpenChange }: Props) => {
  const { deleteTodo } = useDeleteTodo(() => onOpenChange(false));

  if (!todo) return null;

  const onSubmitDelete = () => {
    deleteTodo.mutate(todo.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Deletar todo</DialogTitle>
          <DialogDescription className="text-sm">
            Tem certeza que deseja deletar <strong>{todo.task}</strong>? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" disabled={deleteTodo.isPending} onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" disabled={deleteTodo.isPending} onClick={onSubmitDelete}>
            {deleteTodo.isPending ? 'Deletando...' : 'Deletar todo'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
