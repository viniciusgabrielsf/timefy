import { useState, useEffect, useCallback } from 'react';
import { todosStorage } from '../storage/todos-storage';
import type { Todo } from '../types';

// Helper functions for date manipulation
const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Monthly view - user can paginate between months
export const useTodosPage = () => {
  const [date, setDate] = useState(getStartOfMonth(new Date()));
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTodos = useCallback(() => {
    setIsLoading(true);
    const filterDate = formatDateToYYYYMMDD(date);
    const items = todosStorage.getTodosByDate(filterDate);
    setTodos(items);
    setIsLoading(false);
  }, [date]);

  useEffect(() => {
    refreshTodos();
  }, [refreshTodos]);

  useEffect(() => {
    window.addEventListener('todos-updated', refreshTodos);
    return () => {
      window.removeEventListener('todos-updated', refreshTodos);
    };
  }, [refreshTodos]);

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
        setDate(currentDate => getStartOfMonth(addMonths(currentDate, -1)));
      },
      goToNextPage: () => {
        setDate(currentDate => getStartOfMonth(addMonths(currentDate, 1)));
      },
    },
  };
};
