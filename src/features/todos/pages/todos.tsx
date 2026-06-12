import { useTodosPage } from '../hooks/use-todos-page';
import { List } from '../components/list';
import { Page } from '@/components/pages/page';
import { Button } from '@/components/button';
import { PlusIcon } from 'lucide-react';
import { CreateTodoModal } from '../components/create-todo-modal';
import { EditTodoModal } from '../components/edit-todo-modal';
import { DeleteTodoDialog } from '../components/delete-todo-dialog';
import { useState } from 'react';
import type { Todo } from '../api/todos-client';
import { useSearchParams } from 'react-router';

export const TodosPage = () => {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('teamId') || '';
  const { todos, pagination } = useTodosPage();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setEditModalOpen(true);
  };

  const handleDelete = (todo: Todo) => {
    setSelectedTodo(todo);
    setDeleteDialogOpen(true);
  };

  if (todos.isPending) {
    return <p>Carregando todos...</p>;
  }

  if (todos.isError) {
    return <p>Erro ao carregar todos: {todos.error?.message}</p>;
  }

  return (
    <Page className="p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl flex flex-col gap-6 sm:gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Tarefas</h1>

          <Button
            size="default"
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 sm:flex-row w-full sm:w-auto"
          >
            <PlusIcon className="size-4" />
            <span>Nova tarefa</span>
          </Button>
        </div>

        <List items={todos.data.items} pagination={pagination} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      <CreateTodoModal teamId={teamId} open={createModalOpen} onOpenChange={setCreateModalOpen} />
      {selectedTodo && (
        <EditTodoModal teamId={teamId} todo={selectedTodo} open={editModalOpen} onOpenChange={setEditModalOpen} />
      )}
      {selectedTodo && (
        <DeleteTodoDialog
          teamId={teamId}
          todo={selectedTodo}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </Page>
  );
};
