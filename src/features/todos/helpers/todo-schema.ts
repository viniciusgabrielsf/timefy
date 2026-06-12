import { z } from 'zod';

export const todoSchema = z.object({
  title: z.string().min(1, 'Tarefa é obrigatória').max(100, 'Tarefa deve ter até 100 caracteres'),
  amount: z.number().min(1, 'Deve ter pelo menos 1 ciclo Pomodoro'),
  todoDate: z.string().min(1, 'Data é obrigatória'),
});

export type TodoSchemaType = z.infer<typeof todoSchema>;
