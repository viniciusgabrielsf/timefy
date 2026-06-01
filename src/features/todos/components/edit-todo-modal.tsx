import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/dialog';
import { TodoForm } from './form/todo-form';
import { useEditTodo } from '../hooks/use-edit-todo';
import { useUserStore } from '@/features/auth/stores/user-store';
import type { TodoSchemaType } from '../helpers/todo-schema';
import type { Todo } from '../api/todos-client';

type Props = {
  teamId: string;
  todo: Todo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EditTodoModal = ({ teamId, todo, open, onOpenChange }: Props) => {
  const { editTodo } = useEditTodo(teamId, () => onOpenChange(false));
  const user = useUserStore(state => state.user);

  const onSubmit = (value: TodoSchemaType) => {
    if (!user) return;

    editTodo.mutate({
      todoId: todo.id,
      payerId: todo.payerId, // Keep the original payer
      debtorsIds: value.debtors.map(debtor => debtor.id),
      title: value.title,
      amount: Math.round(value.amount * 100), // Convert decimal to cents
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar todo</DialogTitle>
        </DialogHeader>

        <TodoForm
          className="flex flex-col gap-6"
          onSubmit={onSubmit}
          defaultValues={{
            title: todo.title,
            amount: todo.amount / 100, // Convert cents to decimal
            debtors: todo.debtors,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
