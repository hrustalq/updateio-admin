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
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  role: z.enum(["USER", "ADMIN", "GUEST"]),
});

type FormValues = z.infer<typeof formSchema>;

type User = {
  id: string;
  username: string;
  firstName: string;
  role: "ADMIN" | "USER" | "GUEST";
};

export function EditUserDialog({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: user.role,
    },
    mode: "onChange",
  });

  const updateUserMutation = $api.useMutation("patch", `/api/users/{id}`, {
    onSuccess: () => {
      onClose();
    },
  });

  const handleSubmit = (values: FormValues) => {
    updateUserMutation.mutate({
      params: {
        path: {
          id: user.id,
        },
      },
      body: values,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактировать пользователя</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
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
                      <SelectItem value={"GUEST"}>Гость</SelectItem>
                      <SelectItem value={"USER"}>Пользователь</SelectItem>
                      <SelectItem value={"ADMIN"}>Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
            {updateUserMutation.isError && (
              <p className="text-red-500">
                Ошибка: {(updateUserMutation.error as Error).message}
              </p>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
