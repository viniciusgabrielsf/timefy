import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/field';
import { todoSchema, type TodoSchemaType } from '../../helpers/todo-schema';
import { CardAction } from '@/components/card';

type Props = {
  className?: string;
  onSubmit: (event: TodoSchemaType) => void;
  defaultValues?: Partial<TodoSchemaType>;
};

export const TodoForm = ({
  className = '',
  onSubmit,
  defaultValues = { task: '', pomodoroCycles: 1, todoDate: new Date().toISOString().split('T')[0] },
}: Props) => {
  const form = useForm<TodoSchemaType>({
    resolver: zodResolver(todoSchema),
    defaultValues: defaultValues as TodoSchemaType,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={`flex flex-col gap-6 ${className}`}>
      <FieldGroup>
        <Controller
          name="task"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-todo-task">Tarefa</FieldLabel>
              <Input
                {...field}
                id="form-todo-task"
                aria-invalid={fieldState.invalid}
                placeholder="Digite o nome da tarefa..."
                autoComplete="off"
                type="text"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="pomodoroCycles"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-todo-pomodoro">Ciclos Pomodoro</FieldLabel>
              <Input
                {...field}
                id="form-todo-pomodoro"
                aria-invalid={fieldState.invalid}
                placeholder="1"
                type="number"
                step="1"
                min="1"
                onChange={e => {
                  const value = parseInt(e.target.value) || 1;
                  field.onChange(value);
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="todoDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-todo-date">Data</FieldLabel>
              <Input
                {...field}
                id="form-todo-date"
                aria-invalid={fieldState.invalid}
                type="date"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <CardAction className="w-full flex justify-end">
          <Button type="submit">Salvar</Button>
        </CardAction>
      </FieldGroup>
    </form>
  );
};
