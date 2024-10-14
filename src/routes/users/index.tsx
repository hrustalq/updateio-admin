import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditUserDialog } from "./components/edit-user-dialog";
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
import { Check, Plus, X } from "lucide-react";
import { TablePageSkeleton } from "@/components/TablePageSkeleton";
import $api from "@/api";

interface User {
  id: string;
  username: string;
  firstName: string;
  role: "ADMIN" | "USER" | "GUEST";
}

export function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>();

  const { data: users, isLoading } = $api.useQuery("get", "/api/users", {
    params: {
      query: {
        page: currentPage,
      },
    },
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  if (isLoading) return <TablePageSkeleton />;
  if (!users) return null;

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
        {users.data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя пользователя</TableHead>
                <TableHead>Логин</TableHead>
                <TableHead>Является ботом</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>API ключ</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.data?.map((user) => (
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
                  <TableCell>
                    <Button
                      onClick={() =>
                        handleEditUser({
                          id: user.id,
                          username: user.username,
                          firstName: user.firstName,
                          role: user.role,
                        })
                      }
                    >
                      Редактировать
                    </Button>
                  </TableCell>
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
      {users && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>
            {[...Array(users.pageCount)].map((_, index) => (
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
                  setCurrentPage((prev) => Math.min(prev + 1, users.pageCount))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      {selectedUser && (
        <EditUserDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />
      )}
    </main>
  );
}
