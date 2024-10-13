import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api";
import { useNavigate } from "@tanstack/react-router";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const loginMutation = useMutation<
    void,
    Error,
    { username: string; password: string }
  >({
    mutationFn: (data: { username: string; password: string }) =>
      authApi.login(data.username, data.password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate({ to: "/" });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    ...context,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
