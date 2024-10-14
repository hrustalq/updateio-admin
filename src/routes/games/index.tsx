import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AddGameDialog } from "./components/add-game-dialog";
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
import { Plus, Pencil, Trash2, ExternalLink, MoreVertical } from "lucide-react";
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
import $api from "@/api";

interface Game {
  id: string;
  name: string;
  image?: string | null;
  version?: number | null;
}

export function GamesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    gameId: string | null;
  }>({ isOpen: false, gameId: null });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [pagination, setPagination] = useState<{ page: number; limit: number }>(
    { page: 1, limit: 10 },
  );

  const { data: games } = $api.useQuery("get", "/api/games", {
    params: {
      query: {
        page: pagination.page,
        limit: pagination.limit,
      },
    },
  });

  const deleteGameMutation = $api.useMutation("delete", "/api/games/{id}", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      toast({
        title: "Игра удалена",
        description: "Игра была успешно удалена.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось удалить игру: ${error}`,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmation({ isOpen: true, gameId: id });
  };

  const confirmDelete = () => {
    if (deleteConfirmation.gameId) {
      deleteGameMutation.mutate({
        params: {
          path: {
            id: deleteConfirmation.gameId,
          },
        },
      });
    }
    setDeleteConfirmation({ isOpen: false, gameId: null });
  };

  if (!games?.data) return null;

  return (
    <main className="flex flex-col gap-4 p-4 flex-1">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Список игр</h1>
        <Button
          size="sm"
          className="gap-2 px-4"
          onClick={() => {
            setEditingGame(null);
            setIsDialogOpen(true);
          }}
        >
          <span className="hidden md:block">Добавить</span>
          <Plus className="size-4 md:hidden" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col">
        {games.data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Изображение</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Версия</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games?.data.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>
                    {game.image ? (
                      <img
                        src={game.image}
                        alt={game.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                        Нет
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{game.id}</TableCell>
                  <TableCell>{game.name}</TableCell>
                  <TableCell>{game.version || "Не указана"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(game)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Редактировать</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(game.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Удалить</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a
                            href={`/games/${game.id}`}
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
            <span className="text-lg font-medium">Список игр пуст</span>
          </div>
        )}
      </div>
      {games?.data && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              />
            </PaginationItem>
            {[...Array(games.pageCount)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: index + 1 }))
                  }
                  isActive={games.page === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <AddGameDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingGame(null);
        }}
        initialData={editingGame}
      />
      <AlertDialog
        open={deleteConfirmation.isOpen}
        onOpenChange={(isOpen) =>
          setDeleteConfirmation({ isOpen, gameId: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Игра будет удалена навсегда.
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
