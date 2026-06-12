import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/dialog';
import { TodoForm } from './form/todo-form';
import { useEditTodo } from '../hooks/use-edit-todo';
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

  const onSubmit = (value: TodoSchemaType) => {
    editTodo.mutate({
      todoId: todo.id,
      title: value.title,
      amount: value.amount,
      todoDate: value.todoDate,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar tarefa</DialogTitle>
        </DialogHeader>

        <TodoForm
          className="flex flex-col gap-6"
          onSubmit={onSubmit}
          defaultValues={{
            title: todo.title,
            amount: todo.amount,
            todoDate: todo.todoDate,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
