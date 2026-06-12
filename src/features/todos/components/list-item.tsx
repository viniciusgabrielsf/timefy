import type { Todo } from '../api/todos-client';
import { Button } from '@/components/button';
import { EditIcon, TrashIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown-menu';
import { EllipsisVerticalIcon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Activity } from 'react';

type Props = {
  item: Todo;
  className?: string;
  onEdit: (item: Todo) => void;
  onDelete: (item: Todo) => void;
};

export const ListItem = ({ item, className, onEdit, onDelete }: Props) => {
  // Convert cents to decimal BRL format
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(item.amount / 100);

  const formattedDate = new Date(item.todoDate).toLocaleDateString('pt-BR');
  const textStyle = 'text-sm min-w-0 truncate';
  const mobileWidthMatches = useMediaQuery('(max-width: 640px)');

  return (
    <article
      className={`grid grid-cols-[2fr_3fr_1fr] sm:grid-cols-[5fr_3fr_2fr_1fr] gap-3 sm:gap-4 py-2 sm:py-3 items-center ${className}`}
    >
      <p className={`${textStyle} font-medium`}>{item.title}</p>
      <p className={`${textStyle} font-semibold`}>{formattedAmount}</p>
      <p className={`${textStyle} hidden sm:block`}>{formattedDate}</p>

      <Activity mode={mobileWidthMatches ? 'hidden' : 'visible'}>
        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(item)}
            className="text-foreground hover:text-primary"
            title="Editar todo"
          >
            <EditIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(item)}
            className="text-foreground hover:text-destructive"
            title="Deletar todo"
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
      </Activity>

      <Activity mode={mobileWidthMatches ? 'visible' : 'hidden'}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="shrink-0" onClick={e => e.stopPropagation()}>
              <EllipsisVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(item)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(item)} className="text-destructive">
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Activity>
    </article>
  );
};
