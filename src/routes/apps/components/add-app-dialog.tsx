import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appsApi } from "@/api";
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
import { App } from "@/api/apps";

const formSchema = z.object({
  name: z.string().min(1, "Название приложения обязательно"),
  image: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddAppDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: App | null;
}

export function AddAppDialog({
  isOpen,
  onClose,
  initialData,
}: AddAppDialogProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      image: undefined,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        image: undefined,
      });
    }
  }, [initialData, form]);

  const createOrUpdateAppMutation = useMutation({
    mutationFn: (values: FormValues) =>
      initialData
        ? appsApi.updateApp(initialData.id, values)
        : appsApi.createApp(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      setShowSuccessScreen(true);
    },
  });

  const handleSubmit = (values: FormValues) => {
    createOrUpdateAppMutation.mutate(values);
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
    createOrUpdateAppMutation.reset();
    setShowSuccessScreen(false);
    onClose();
  };

  const handleCreateNew = () => {
    form.reset();
    createOrUpdateAppMutation.reset();
    setShowSuccessScreen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {showSuccessScreen
                ? initialData
                  ? "Приложение обновлено"
                  : "Приложение создано"
                : initialData
                  ? "Редактировать приложение"
                  : "Добавить новое приложение"}
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
                    ? "Приложение успешно обновлено!"
                    : "Приложение успешно создано!"}
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
                key="app-form"
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
                          <FormLabel>Название приложения</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Введите название приложения"
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
                        disabled={createOrUpdateAppMutation.isPending}
                      >
                        {createOrUpdateAppMutation.isPending
                          ? "Отправка..."
                          : initialData
                            ? "Обновить"
                            : "Создать"}
                      </Button>
                    </div>
                    {createOrUpdateAppMutation.isError && (
                      <p className="text-red-500">
                        Ошибка:{" "}
                        {(createOrUpdateAppMutation.error as Error).message}
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
