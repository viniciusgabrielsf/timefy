import { Card } from '@/components/card';
import type { Todo } from '../types';
import { ListItem } from './list-item';
import { ScrollArea } from '@/components/scroll-area';
import { Paginator } from './pagination/paginator';

type Props = {
  items: Todo[];
  pagination: {
    date: Date;
    goToPreviousPage: () => void;
    goToNextPage: () => void;
  };
  onEdit: (item: Todo) => void;
  onDelete: (item: Todo) => void;
  onToggleComplete: (item: Todo) => void;
};

export const List = ({ items, pagination, onEdit, onDelete, onToggleComplete }: Props) => {
  return (
    <Card className={`flex flex-col h-100 min-w-[max(70%,320px)] p-0 gap-0`}>
      <header className="grid grid-cols-[2fr_3fr_1fr] sm:grid-cols-[5fr_3fr_2fr_1fr] gap-3 sm:gap-4 p-2 sm:p-3 font-bold border-b bg-foreground/9 rounded-t-xl text-xs sm:text-sm">
        <p>Tarefa</p>
        <p>Ciclos Pomodoro</p>
        <p className="hidden sm:block">Data</p>
        <p>Ações</p>
      </header>
      <ScrollArea className={`overflow-y-auto my-auto p-0`}>
        {items.map(item => (
          <ListItem
            key={item.id}
            item={item}
            className="p-2 sm:p-3 border-b border-foreground/20 last:border-b-0"
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        ))}

        {items.length === 0 && (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            Nenhuma tarefa encontrada para{' '}
            {pagination.date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}.
          </div>
        )}
      </ScrollArea>
      <footer className="flex items-center justify-between gap-3 border-t p-2 bg-foreground/9 rounded-b-xl">
        <Paginator pagination={pagination} />
      </footer>
    </Card>
  );
};
