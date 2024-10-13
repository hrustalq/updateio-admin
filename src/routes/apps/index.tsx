import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appsApi } from "@/api";
import { Button } from "@/components/ui/button";
import { AddAppDialog } from "./components/add-app-dialog";
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
import { App } from "@/api/apps";
import { GetAppsResponse } from "@/api/apps";
import { Plus, Pencil, Trash2, ExternalLink, MoreVertical } from "lucide-react";
import { useLoaderData } from "@tanstack/react-router";
import { appsRoute } from "@/router";
import { useToast } from "@/components/ui/toast/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AppsPage() {
  const initialData = useLoaderData({ from: appsRoute.id });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    appId: string | null;
  }>({ isOpen: false, appId: null });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data } = useQuery<GetAppsResponse, Error>({
    queryKey: ["apps", currentPage],
    queryFn: () => appsApi.getApps({ page: currentPage, limit: 10 }),
    initialData: currentPage === 1 ? initialData : undefined,
  });

  const deleteAppMutation = useMutation({
    mutationFn: (id: string) => appsApi.deleteApp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      toast({
        title: "Приложение удалено",
        description: "Приложение было успешно удалено.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось удалить приложение: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (app: App) => {
    setEditingApp(app);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmation({ isOpen: true, appId: id });
  };

  const confirmDelete = () => {
    if (deleteConfirmation.appId) {
      deleteAppMutation.mutate(deleteConfirmation.appId);
    }
    setDeleteConfirmation({ isOpen: false, appId: null });
  };

  if (!data) return null;

  return (
    <main className="flex flex-col gap-4 p-4 flex-1">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Список приложений</h1>
        <Button
          size="sm"
          className="gap-2 px-4"
          onClick={() => {
            setEditingApp(null);
            setIsDialogOpen(true);
          }}
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
                <TableHead>Изображение</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((app: App) => (
                <TableRow key={app.id}>
                  <TableCell>
                    {app.image ? (
                      <img
                        src={app.image}
                        alt={app.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                        Нет
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{app.id}</TableCell>
                  <TableCell>{app.name}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(app)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Редактировать</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(app.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Удалить</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a
                            href={`/apps/${app.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            <span>Открыть</span>
                          </a>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-lg font-medium">Список приложений пуст</span>
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
      <AddAppDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingApp(null);
        }}
        initialData={editingApp}
      />
      <AlertDialog
        open={deleteConfirmation.isOpen}
        onOpenChange={(isOpen) =>
          setDeleteConfirmation({ isOpen, appId: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Приложение будет удалено навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
