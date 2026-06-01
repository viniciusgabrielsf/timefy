import { TodosPage } from '../pages/todos';

export const TodosPageRoutes = {
  TEAM_PAYMENTS: '/todos',
};

export const todosRoutes = [
  {
    path: TodosPageRoutes.TEAM_PAYMENTS,
    element: <TodosPage />,
  },
];
