import { Button } from "./Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  last: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, last, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span className="font-mono text-sm text-ink-400">
        Page {page + 1} of {totalPages}
      </span>
      <Button variant="secondary" size="sm" disabled={last} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
