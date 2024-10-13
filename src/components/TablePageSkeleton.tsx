import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

export function TablePageSkeleton() {
  return (
    <main className="flex flex-col gap-4 p-4 flex-1 basis-full">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-24" />
      </div>
      <Table className="flex-1 basis-full flex-grow">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-5 w-24" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-24" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-5 w-full max-w-[200px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Skeleton className="h-9 w-9" />
          </PaginationItem>
          {Array.from({ length: 3 }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink>
                <Skeleton className="h-9 w-9" />
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <Skeleton className="h-9 w-9" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
