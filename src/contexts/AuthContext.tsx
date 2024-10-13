import React, { createContext, ReactNode, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/api";
import { User } from "@/api/users";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: User;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: usersApi.getMe,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
  });

  const isAuthenticated = useMemo(() => {
    return !!user;
  }, [user]);

  const value = useMemo(() => {
    return {
      isAuthenticated,
      isLoading,
      user,
    };
  }, [isAuthenticated, isLoading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
