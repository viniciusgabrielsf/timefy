import type { Todo } from '../api/todos-client';

const TODOS_STORAGE_KEY = 'timefy_todos';

export const todosStorage = {
  getTodos: (): Todo[] => {
    try {
      const stored = localStorage.getItem(TODOS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading todos from localStorage:', error);
      return [];
    }
  },

  saveTodos: (todos: Todo[]): void => {
    try {
      localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  },

  addTodo: (todo: Omit<Todo, 'id'>): Todo => {
    const todos = todosStorage.getTodos();
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
    };
    todos.push(newTodo);
    todosStorage.saveTodos(todos);
    return newTodo;
  },

  updateTodo: (id: string, updates: Partial<Todo>): Todo | null => {
    const todos = todosStorage.getTodos();
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
      return null;
    }

    const updatedTodo = { ...todos[index], ...updates };
    todos[index] = updatedTodo;
    todosStorage.saveTodos(todos);
    return updatedTodo;
  },

  deleteTodo: (id: string): boolean => {
    const todos = todosStorage.getTodos();
    const filtered = todos.filter(t => t.id !== id);

    if (filtered.length === todos.length) {
      return false; // Todo not found
    }

    todosStorage.saveTodos(filtered);
    return true;
  },

  getTodosByDate: (date: string): Todo[] => {
    const todos = todosStorage.getTodos();
    return todos.filter(todo => {
      const todoDate = new Date(todo.todoDate);
      const filterDate = new Date(date);
      return (
        todoDate.getMonth() === filterDate.getMonth() &&
        todoDate.getFullYear() === filterDate.getFullYear()
      );
    });
  },
};
