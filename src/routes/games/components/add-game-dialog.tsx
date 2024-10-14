import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import $api from "@/api";
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
import { MultiSelect } from "@/components/ui/multi-select";

const formSchema = z.object({
  name: z.string().min(1, "Название игры обязательно"),
  appIds: z.array(z.string()).min(1, "Выберите хотя бы одно приложение"),
  version: z.number().optional().default(1),
  image: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Game {
  id: string;
  name: string;
  image?: string | null;
  version?: number | null;
}

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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      appIds: [],
      version: initialData?.version || 0,
      image: undefined,
    },
    mode: "onChange",
  });

  const { data: apps } = $api.useQuery("get", "/api/apps");

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

  const createGameMutation = $api.useMutation("post", "/api/games");
  const updateGameMutation = $api.useMutation("patch", "/api/games/{id}");

  const handleSubmit = async (values: FormValues) => {
    const image = await values.image?.text();

    if (initialData)
      updateGameMutation.mutate({
        params: {
          path: {
            id: initialData.id,
          },
        },
        body: {
          ...values,
          image: image,
        },
      });
    else
      createGameMutation.mutate({
        body: {
          ...values,
          image: image,
        },
      });
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
    createGameMutation.reset();
    updateGameMutation.reset();
    setShowSuccessScreen(false);
    onClose();
  };

  const handleCreateNew = () => {
    form.reset();
    createGameMutation.reset();
    updateGameMutation.reset();
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
                        disabled={
                          createGameMutation.isPending ||
                          updateGameMutation.isPending
                        }
                      >
                        {createGameMutation.isPending
                          ? "Отправка..."
                          : initialData
                            ? "Обновить"
                            : "Создать"}
                      </Button>
                    </div>
                    {createGameMutation.isError && (
                      <p className="text-red-500">
                        Ошибка: {(createGameMutation.error as Error).message}
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
