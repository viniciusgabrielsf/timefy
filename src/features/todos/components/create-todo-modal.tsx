import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/dialog';
import { TodoForm } from './form/todo-form';
import { useCreateTodo } from '../hooks/use-create-todo';
import { useUserStore } from '@/features/auth/stores/user-store';
import type { TodoSchemaType } from '../helpers/todo-schema';

type Props = {
  teamId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreateTodoModal = ({ teamId, open, onOpenChange }: Props) => {
  const { createTodo } = useCreateTodo(teamId, () => onOpenChange(false));
  const user = useUserStore(state => state.user);

  const onSubmit = (value: TodoSchemaType) => {
    if (!user) return;

    createTodo.mutate({
      payerId: user.id,
      debtorsIds: value.debtors.map(debtor => debtor.id),
      title: value.title,
      amount: Math.round(value.amount * 100), // Convert decimal to cents
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar novo todo</DialogTitle>
        </DialogHeader>

        <TodoForm
          className="flex flex-col gap-6"
          onSubmit={onSubmit}
          defaultValues={{
            title: '',
            amount: 0,
            debtors: [user],
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
