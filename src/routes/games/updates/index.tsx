import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddPatchNoteDialog } from "./components/add-patch-note-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast/use-toast";
import $api from "@/api";

interface PatchNote {
  id: string;
  title: string;
  content: string;
  version?: string | null;
  releaseDate: string;
  gameId: string;
  appId: string;
}

export function GamesUpdatesPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const { data: patchNotesData, isLoading: isPatchNotesLoading } =
    $api.useQuery("get", "/api/patch-notes", {
      queryKey: ["patchNotes", currentPage],
    });

  const { data: gamesData, isLoading: isGamesLoading } = $api.useQuery(
    "get",
    "/api/games",
    {
      queryKey: ["games"],
    },
  );

  const { mutate: deletePatchNote } = $api.useMutation(
    "delete",
    "/api/patch-notes/{id}",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["patchNotes"] });
        toast({
          variant: "default",
          title: "Патч-нот успешно удален",
        });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Ошибка при удалении патч-нота",
        });
      },
    },
  );

  if (isPatchNotesLoading || isGamesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!patchNotesData || !gamesData) return null;

  const getGameName = (gameId: string) => {
    const game = gamesData.data.find((game) => game.id === gameId);
    return game ? game.name : "Неизвестно";
  };

  const handleEdit = (patchNote: PatchNote) => {
    console.log(patchNote);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот патч-нот?")) {
      deletePatchNote({ params: { path: { id } } });
    }
  };

  return (
    <main className="flex flex-col gap-4 p-4 flex-1">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Обновления игр</h1>
        <Button
          size="sm"
          className="gap-2 px-4"
          onClick={() => setIsDialogOpen(true)}
        >
          <span className="hidden md:block">Добавить</span>
          <Plus className="size-4 md:hidden" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        {patchNotesData.data.length > 0 ? (
          patchNotesData.data.map((patchNote) => (
            <Card key={patchNote.id}>
              <CardHeader>
                <CardTitle>{patchNote.title}</CardTitle>
                <CardDescription>
                  Игра: {getGameName(patchNote.gameId)} | Версия:{" "}
                  {patchNote.version || "N/A"} | Дата выпуска:{" "}
                  {patchNote?.releaseDate &&
                    format(new Date(patchNote.releaseDate), "dd.MM.yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{patchNote.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Создано:{" "}
                  {patchNote?.createdAt &&
                    format(new Date(patchNote.createdAt), "dd.MM.yyyy HH:mm")}
                </p>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(patchNote)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Редактировать
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(patchNote.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-lg font-medium">Список обновлений пуст</span>
          </div>
        )}
      </div>
      {patchNotesData && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>
            {[...Array(patchNotesData.pageCount)].map((_, index) => (
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
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, patchNotesData.pageCount),
                  )
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <AddPatchNoteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </main>
  );
}
