import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import $api from "@/api";
import { useNavigate } from "@tanstack/react-router";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const loginMutation = $api.useMutation("post", "/api/auth/login", {
    onSuccess: async () => {
      await navigate({ to: "/" });
    },
  });

  const logoutMutation = $api.useMutation("post", "/api/auth/logout");

  return {
    ...context,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
