import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import $api from "@/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: {
    id: string;
    username: string;
    firstName: string;
    lastName?: string | null;
    languageCode?: string | null;
    isBot?: boolean | null;
    allowsWriteToPm?: boolean | null;
    addedToAttachMenu?: boolean | null;
    role: "ADMIN" | "USER" | "GUEST";
    apiKey: string;
  };
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [retryCount, setRetryCount] = useState(0);
  const { mutate: refreshToken } = $api.useMutation(
    "post",
    "/api/auth/refresh",
    {
      retry: false,
    },
  );

  const {
    isLoading,
    data: user,
    error,
  } = $api.useQuery(
    "get",
    "/api/users/me",
    {},
    {
      retry: false,
      refetchInterval: 1000 * 60 * 5,
    },
  );

  useEffect(() => {
    if (error && error.statusCode === 401 && retryCount === 0) {
      refreshToken({});
      setRetryCount(0);
    }
  }, [error, refreshToken, retryCount]);

  const value = useMemo(() => {
    return {
      isAuthenticated: !!user,
      isLoading,
      user,
    };
  }, [isLoading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
