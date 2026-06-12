export type Todo = {
  id: string;
  task: string;
  pomodoroCycles: number;
  todoDate: string;
  completed: boolean;
};

export type CreateTodoRequest = {
  task: string;
  pomodoroCycles: number;
  todoDate: string;
};

export type EditTodoRequest = CreateTodoRequest & {
  todoId: string;
};
