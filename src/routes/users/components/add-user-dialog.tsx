import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/api/users/types";

const formSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  role: z.nativeEnum(Role),
});

type FormValues = z.infer<typeof formSchema>;

export function AddUserDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: Role.GUEST,
    },
    mode: "onChange",
  });

  const createUserMutation = useMutation({
    mutationFn: (values: FormValues) => api.users.createUser(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowSuccessScreen(true);
    },
  });

  const handleSubmit = (values: FormValues) => {
    createUserMutation.mutate(values);
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
    createUserMutation.reset();
    setShowSuccessScreen(false);
    onClose();
  };

  const handleCreateNew = () => {
    form.reset();
    createUserMutation.reset();
    setShowSuccessScreen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {showSuccessScreen
                ? "Пользователь создан"
                : "Добавить нового пользователя"}
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
                <p className="text-center">Пользователь успешно создан!</p>
                <div className="flex gap-4">
                  <Button onClick={handleCreateNew}>Создать еще</Button>
                  <Button variant="outline" onClick={resetAndClose}>
                    Закрыть
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="user-form"
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Введите email"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Пароль</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Введите пароль"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Роль</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите роль" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={Role.GUEST}>Гость</SelectItem>
                              <SelectItem value={Role.USER}>
                                Пользователь
                              </SelectItem>
                              <SelectItem value={Role.ADMIN}>
                                Администратор
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={createUserMutation.isPending}
                      >
                        {createUserMutation.isPending
                          ? "Отправка..."
                          : "Отправить"}
                      </Button>
                    </div>
                    {createUserMutation.isError && (
                      <p className="text-red-500">
                        Ошибка: {(createUserMutation.error as Error).message}
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
