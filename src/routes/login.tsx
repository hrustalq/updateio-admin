import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link, Navigate, useLocation } from "@tanstack/react-router";
import { Small } from "@/components/ui/typography";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Логин не может быть пустым!" }),
  password: z
    .string({ message: "Пароль не может быть пустым" })
    .min(1, { message: "Пароль не может быть пустым" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const { pathname } = useLocation();

  const [error, setError] = useState<string | null>(null);
  const { login, isLoggingIn, isAuthenticated } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      login(data);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Неверный email или пароль");
    }
  };

  if (pathname === "/login" && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="flex items-center justify-center basis-full flex-grow">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Вход в систему
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Логин</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin"
                        type="text"
                        autoComplete="username"
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
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <Link
                      to="/"
                      className="block text-sm text-muted-foreground hover:opacity-80 text-right transition-opacity"
                    >
                      Забыли пароль?
                    </Link>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full hover:opacity-90 transition-opacity"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Вход..." : "Войти"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <Small className="text-center">
            Нет аккаунта?{" "}
            <Link
              to="/"
              className="underline hover:opacity-80 transition-opacity"
            >
              Зарегистрироваться
            </Link>
          </Small>
        </CardFooter>
      </Card>
    </main>
  );
};
