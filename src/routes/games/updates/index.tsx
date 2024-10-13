import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { patchNotesApi, gamesApi } from "@/api";
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
import { PatchNote } from "@/api/patch-notes";
import { GetPatchNotesResponse } from "@/api/patch-notes";
import { Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { useLoaderData } from "@tanstack/react-router";
import { gamesUpdatesRoute } from "@/router";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast/use-toast";

export function GamesUpdatesPage() {
  const { toast } = useToast();
  const initialData = useLoaderData({ from: gamesUpdatesRoute.id });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const { data: patchNotesData, isLoading: isPatchNotesLoading } = useQuery<
    GetPatchNotesResponse,
    Error
  >({
    queryKey: ["patchNotes", currentPage],
    queryFn: () =>
      patchNotesApi.getPatchNotes({ page: currentPage, limit: 10 }),
    initialData: currentPage === 1 ? initialData : undefined,
  });

  const { data: gamesData, isLoading: isGamesLoading } = useQuery({
    queryKey: ["games"],
    queryFn: () => gamesApi.getGames({ page: 1, limit: 100 }),
  });

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
      try {
        await patchNotesApi.deletePatchNote(id);
        queryClient.invalidateQueries({ queryKey: ["patchNotes"] });
        toast({
          variant: "default",
          title: "Патч-нот успешно удален",
        });
      } catch (error) {
        console.error("Error deleting patch note:", error);
        toast({
          variant: "destructive",
          title: "Ошибка при удалении патч-нота",
        });
      }
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
          patchNotesData.data.map((patchNote: PatchNote) => (
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
            {[...Array(patchNotesData.totalPages)].map((_, index) => (
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
                    Math.min(prev + 1, patchNotesData.totalPages),
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
