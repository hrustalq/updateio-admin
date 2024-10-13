import {
  createRouter,
  createRoute,
  createRootRoute,
  LoaderFnContext,
} from "@tanstack/react-router";
import { Index } from "./routes/index";
import { About } from "./routes/about";
import { Root } from "./routes/__root";
import { Login } from "./routes/login";
import { GamesPage } from "./routes/games";
import { AppsPage } from "./routes/apps";
import { Protected } from "./routes/_protected";
import { TablePageSkeleton } from "@/components/TablePageSkeleton";
import { QueryClient } from "@tanstack/react-query";
import { appsApi, gamesApi } from "./api";
import { UsersPage } from "./routes/users";
import { api } from "./api";
import { GamesUpdatesPage } from "./routes/games/updates";
import { BotsPage } from "./routes/bots";

export const rootRoute = createRootRoute({
  component: Root,
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: Protected,
});

export const indexRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/",
  component: Index,
});

export const aboutRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/about",
  component: About,
});

export const gamesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/games",
  component: GamesPage,
  loader: ({ context: { queryClient } }: LoaderFnContext) => {
    return queryClient.ensureQueryData({
      queryKey: ["games", 1],
      queryFn: () => gamesApi.getGames({ page: 1, limit: 10 }),
    });
  },
  pendingComponent: TablePageSkeleton,
});

export const appsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/games/apps",
  component: AppsPage,
  loader: ({ context: { queryClient } }: LoaderFnContext) => {
    return queryClient.ensureQueryData({
      queryKey: ["apps", 1],
      queryFn: () => appsApi.getApps({ page: 1, limit: 10 }),
    });
  },
  pendingComponent: TablePageSkeleton,
});

export const gamesUpdatesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/games/updates",
  component: GamesUpdatesPage,
  loader: ({ context: { queryClient } }: LoaderFnContext) => {
    return queryClient.ensureQueryData({
      queryKey: ["patchNotes", 1],
      queryFn: () => appsApi.getApps({ page: 1, limit: 10 }),
    });
  },
  pendingComponent: TablePageSkeleton,
});

export const usersRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/users/list",
  component: UsersPage,
  loader: async () => {
    return api.users.getUsers({ page: 1, limit: 10 });
  },
});

export const botsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/bots",
  component: BotsPage,
});

export const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedRoute.addChildren([
    indexRoute,
    aboutRoute,
    gamesRoute,
    gamesUpdatesRoute,
    appsRoute,
    usersRoute,
    botsRoute,
  ]),
]);

const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
