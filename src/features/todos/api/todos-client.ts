import { apiClient } from '@/api/client';
import type { IListOptions } from '@/api/interfaces';

export type TodosFilter = {
  payerId: string;
  date: string;
};

export type TeamMember = {
  id: string;
  fullName: string;
  avatar?: string;
};

export type Todo = {
  id: string;
  task: string;
  pomodoroCycles: number;
  todoDate: string;
  completed: boolean;
};

export type Balance = {
  from: TeamMember;
  to: TeamMember;
  amount: number;
};

export type TodosListResponse = {
  items: Todo[];
  total: number;
  balances: Balance[];
};

export type CreateTodoRequest = {
  task: string;
  pomodoroCycles: number;
  todoDate: string;
};

export type EditTodoRequest = CreateTodoRequest & {
  todoId: string;
};

export const todosEndpoints = {
  GET_PAYMENTS: (teamId: string) => `/teams/${teamId}/todos`,
  CREATE_PAYMENT: (teamId: string) => `/teams/${teamId}/todos`,
  EDIT_PAYMENT: (teamId: string, todoId: string) => `/teams/${teamId}/todos/${todoId}`,
  DELETE_PAYMENT: (teamId: string, todoId: string) => `/teams/${teamId}/todos/${todoId}`,
};

export const todosClient = {
  getMyTodos: async (teamId: string, request: IListOptions<TodosFilter>): Promise<TodosListResponse> =>
    apiClient
      .get<TodosListResponse>(todosEndpoints.GET_PAYMENTS(teamId), { params: request })
      .then(response => response.data),
  createTodo: async (teamId: string, request: CreateTodoRequest): Promise<Todo> =>
    apiClient.post<Todo>(todosEndpoints.CREATE_PAYMENT(teamId), request).then(response => response.data),
  editTodo: async (teamId: string, request: EditTodoRequest): Promise<Todo> =>
    apiClient.patch<Todo>(todosEndpoints.EDIT_PAYMENT(teamId, request.todoId), request).then(response => response.data),
  deleteTodo: async (teamId: string, todoId: string): Promise<void> =>
    apiClient.delete(todosEndpoints.DELETE_PAYMENT(teamId, todoId)).then(() => undefined),
};
