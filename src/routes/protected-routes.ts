import { profileRoutes } from '@/features/profile/routes/profile';
import { todosRoutes } from '@/features/todos/routes/todos';
export const protectedRoutes = [...profileRoutes, ...todosRoutes];
