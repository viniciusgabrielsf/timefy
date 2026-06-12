import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/pagination';

type Props = {
  pagination: {
    date: Date;
    goToPreviousPage: () => void;
    goToNextPage: () => void;
  };
};
export const Paginator = ({ pagination: { date, goToPreviousPage, goToNextPage } }: Props) => {
  const localizedMonthYear = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <Pagination className="mx-0 w-auto justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            // className={!pagination.canGoPreviousPage ? 'pointer-events-none opacity-50' : ''}
            onClick={event => {
              event.preventDefault();
              goToPreviousPage();
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <span className="px-2 text-sm">{localizedMonthYear}</span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            // className={!pagination.canGoNextPage ? 'pointer-events-none opacity-50' : ''}
            onClick={event => {
              event.preventDefault();
              goToNextPage();
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
