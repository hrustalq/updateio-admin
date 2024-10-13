import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/router";

import "./globals.css";
import { ThemeProvider } from "@/providers/theme.prodiver";
import { QueryProvider } from "@/providers/query.provider";
import { AuthProvider } from "./contexts/AuthContext";

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </StrictMode>,
  );
}
