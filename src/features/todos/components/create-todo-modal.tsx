import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/dialog';
import { TodoForm } from './form/todo-form';
import { useCreateTodo } from '../hooks/use-create-todo';
import type { TodoSchemaType } from '../helpers/todo-schema';

type Props = {
  teamId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreateTodoModal = ({ teamId, open, onOpenChange }: Props) => {
  const { createTodo } = useCreateTodo(teamId, () => onOpenChange(false));

  const onSubmit = (value: TodoSchemaType) => {
    createTodo.mutate({
      task: value.task,
      pomodoroCycles: value.pomodoroCycles,
      todoDate: value.todoDate,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar nova tarefa</DialogTitle>
        </DialogHeader>

        <TodoForm
          className="flex flex-col gap-6"
          onSubmit={onSubmit}
          defaultValues={{
            task: '',
            pomodoroCycles: 1,
            todoDate: new Date().toISOString().split('T')[0],
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
