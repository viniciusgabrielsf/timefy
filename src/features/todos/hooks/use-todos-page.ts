import { useState, useEffect } from 'react';
import moment from 'moment';
import { todosStorage } from '../storage/todos-storage';
import type { Todo } from '../api/todos-client';

// Monthly view - user can paginate between months
export const useTodosPage = () => {
  const [date, setDate] = useState(moment().startOf('month'));
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTodos = () => {
    setIsLoading(true);
    const items = todosStorage.getTodosByDate(moment(date).format('YYYY-MM-DD'));
    setTodos(items);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshTodos();
  }, [date]);

  useEffect(() => {
    window.addEventListener('todos-updated', refreshTodos);
    return () => {
      window.removeEventListener('todos-updated', refreshTodos);
    };
  }, [date]);

  return {
    todos: {
      data: {
        items: todos,
        total: todos.length,
        balances: [],
      },
      isPending: isLoading,
      isError: false,
      error: null as Error | null,
    },
    pagination: {
      date,
      goToPreviousPage: () => {
        setDate(date => moment(date).subtract(1, 'month'));
      },
      goToNextPage: () => {
        setDate(date => moment(date).add(1, 'month'));
      },
    },
  };
};
