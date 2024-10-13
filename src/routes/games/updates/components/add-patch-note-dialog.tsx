import { useState, useEffect } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { patchNotesApi, gamesApi, appsApi } from "@/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен"),
  content: z.string().min(1, "Содержание обязательно"),
  version: z.string().optional(),
  releaseDate: z.date(),
  appId: z.string().min(1, "Выберите приложение"),
  gameId: z.string().min(1, "Выберите игру"),
});

interface AddPatchNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPatchNoteDialog({
  isOpen,
  onClose,
}: AddPatchNoteDialogProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      version: "",
      releaseDate: new Date(),
      appId: "",
      gameId: "",
    },
  });

  const { data: appsData } = useQuery({
    queryKey: ["apps"],
    queryFn: () => appsApi.getApps({ page: 1, limit: 100 }),
  });

  const { data: gamesData } = useQuery({
    queryKey: ["games", selectedAppId],
    queryFn: () =>
      gamesApi.getGames({ page: 1, limit: 100, appId: selectedAppId }),
    enabled: !!selectedAppId,
  });

  const createPatchNoteMutation = useMutation({
    mutationFn: patchNotesApi.createPatchNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patchNotes"] });
      toast.success("Патч-нот успешно добавлен");
      onClose();
      form.reset();
      setSelectedAppId(null);
    },
    onError: (error) => {
      console.error("Error creating patch note:", error);
      toast.error("Ошибка при добавлении патч-нота");
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await createPatchNoteMutation.mutateAsync(values);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAppId) {
      form.setValue("appId", selectedAppId);
      form.setValue("gameId", "");
    }
  }, [selectedAppId, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить новый патч-нот</DialogTitle>
          <DialogDescription>
            Заполните форму для создания нового патч-нота.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заголовок</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Содержание</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Версия</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="releaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата выпуска</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Приложение</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedAppId(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите приложение" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {appsData?.data.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          {app.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gameId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Игра</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedAppId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите игру" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gamesData?.data.map((game) => (
                        <SelectItem key={game.id} value={game.id}>
                          {game.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Добавление..." : "Добавить"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
