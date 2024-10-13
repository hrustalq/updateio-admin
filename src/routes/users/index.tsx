import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { AddUserDialog } from "./components/add-user-dialog";
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
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { User } from "@/api/users";
import { GetUsersResponse } from "@/api/users";
import { Check, Plus, X } from "lucide-react";
import { useLoaderData } from "@tanstack/react-router";
import { usersRoute } from "@/router";
import { TablePageSkeleton } from "@/components/TablePageSkeleton";

export function UsersPage() {
  const initialData = useLoaderData({ from: usersRoute.id });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery<GetUsersResponse, Error>({
    queryKey: ["users", currentPage],
    queryFn: () => api.users.getUsers({ page: currentPage, limit: 10 }),
    initialData: currentPage === 1 ? initialData : undefined,
  });

  if (isLoading) return <TablePageSkeleton />;
  if (!data) return null;

  return (
    <main className="flex flex-col gap-4 p-4 flex-1">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Список пользователей</h1>
        <Button
          size="sm"
          className="gap-2 px-4"
          onClick={() => setIsDialogOpen(true)}
        >
          <span className="hidden md:block">Добавить</span>
          <Plus className="size-4 md:hidden" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col">
        {data.data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя пользователя</TableHead>
                <TableHead>Логин</TableHead>
                <TableHead>Является ботом</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>API ключ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user?.username}</TableCell>
                  <TableCell>
                    {user?.isBot ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-destructive" />
                    )}
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.apiKey}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-lg font-medium">
              Список пользователей пуст
            </span>
          </div>
        )}
      </div>
      {data && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>
            {[...Array(data.totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, data.totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <AddUserDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </main>
  );
}
