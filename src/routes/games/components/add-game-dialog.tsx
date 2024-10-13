import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { gamesApi, appsApi } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CheckCircle } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { Game } from "@/api/games";
import { MultiSelect } from "@/components/ui/multi-select";

const formSchema = z.object({
  name: z.string().min(1, "Название игры обязательно"),
  appIds: z.array(z.string()).min(1, "Выберите хотя бы одно приложение"),
  version: z.string().optional().default(""),
  image: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddGameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Game | null;
}

export function AddGameDialog({
  isOpen,
  onClose,
  initialData,
}: AddGameDialogProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      appIds: [],
      version: initialData?.version || "",
      image: undefined,
    },
    mode: "onChange",
  });

  const { data: apps } = useQuery({
    queryKey: ["apps"],
    queryFn: () => appsApi.getApps({ page: 1, limit: 100 }),
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        appIds: [],
        version: initialData.version || undefined,
        image: undefined,
      });
    }
  }, [initialData, form]);

  const createOrUpdateGameMutation = useMutation({
    mutationFn: (values: FormValues) =>
      initialData
        ? gamesApi.updateGame(initialData.id, {
            ...values,
            version: initialData.version || undefined,
          })
        : gamesApi.createGame({
            ...values,
            version: values.version || undefined,
          }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      setShowSuccessScreen(true);
    },
  });

  const handleSubmit = (values: FormValues) => {
    createOrUpdateGameMutation.mutate(values);
  };

  const handleClose = () => {
    if (form.formState.isDirty) {
      setShowConfirmDialog(true);
    } else {
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    form.reset();
    createOrUpdateGameMutation.reset();
    setShowSuccessScreen(false);
    onClose();
  };

  const handleCreateNew = () => {
    form.reset();
    createOrUpdateGameMutation.reset();
    setShowSuccessScreen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Редактировать игру" : "Добавить новую игру"}
            </DialogTitle>
          </DialogHeader>
          <AnimatePresence mode="wait">
            {showSuccessScreen ? (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <CheckCircle className="text-green-500 w-16 h-16" />
                <p className="text-center">
                  {initialData
                    ? "Игра успешно обновлена!"
                    : "Игра успешно создана!"}
                </p>
                <div className="flex gap-4">
                  <Button onClick={handleCreateNew}>Создать еще</Button>
                  <Button variant="outline" onClick={resetAndClose}>
                    Закрыть
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="game-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Название игры</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Введите название игры"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="appIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Приложения</FormLabel>
                          <MultiSelect
                            onValueChange={field.onChange}
                            options={
                              apps?.data.map((app) => ({
                                value: app.id,
                                label: app.name,
                              })) || []
                            }
                            {...field}
                            placeholder="Выберите приложения"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="version"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Версия (необязательно)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Введите версию игры"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUpload
                              label="Изображение (необязательно)"
                              onFileChange={(file) => field.onChange(file)}
                              accept="image/*"
                              maxSize={5 * 1024 * 1024} // 5MB
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={createOrUpdateGameMutation.isPending}
                      >
                        {createOrUpdateGameMutation.isPending
                          ? "Отправка..."
                          : initialData
                            ? "Обновить"
                            : "Создать"}
                      </Button>
                    </div>
                    {createOrUpdateGameMutation.isError && (
                      <p className="text-red-500">
                        Ошибка:{" "}
                        {(createOrUpdateGameMutation.error as Error).message}
                      </p>
                    )}
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены, что хотите закрыть?</AlertDialogTitle>
            <AlertDialogDescription>
              Все несохраненные данные будут потеряны.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction onClick={resetAndClose}>
              Закрыть
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
