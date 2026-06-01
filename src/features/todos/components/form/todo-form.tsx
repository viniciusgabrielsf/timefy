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
  defaultValues = { title: '', amount: 0, debtors: [] },
}: Props) => {
  const form = useForm<TodoSchemaType>({
    resolver: zodResolver(todoSchema),
    defaultValues: defaultValues as TodoSchemaType,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={`flex flex-col gap-6 ${className}`}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-todo-title">Título</FieldLabel>
              <Input
                {...field}
                id="form-todo-title"
                aria-invalid={fieldState.invalid}
                placeholder="Digite o título do todo..."
                autoComplete="off"
                type="text"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="amount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-todo-amount">Valor (R$)</FieldLabel>
              <Input
                {...field}
                id="form-todo-amount"
                aria-invalid={fieldState.invalid}
                placeholder="0,00"
                type="number"
                step="0.01"
                min="0"
                onChange={e => {
                  const value = parseFloat(e.target.value) || 0;
                  field.onChange(value);
                }}
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
