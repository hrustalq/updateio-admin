import {
  createRouter,
  createRoute,
  createRootRoute,
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
import { UsersPage } from "./routes/users";
import { GamesUpdatesPage } from "./routes/games/updates";
import { BotsPage } from "./routes/bots";
import { GamePage } from "./routes/games/[id]";

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
  pendingComponent: TablePageSkeleton,
});

export const usersRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/users/list",
  component: UsersPage,
});

export const botsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/bots",
  component: BotsPage,
});

export const gameRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/games/$id",
  component: GamePage,
});

export const appsRoute = createRoute({
  getParentRoute: () => gamesRoute,
  path: "apps",
  component: AppsPage,
  pendingComponent: TablePageSkeleton,
});

export const gamesUpdatesRoute = createRoute({
  getParentRoute: () => gamesRoute,
  path: "updates",
  component: GamesUpdatesPage,
  pendingComponent: TablePageSkeleton,
});

export const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedRoute.addChildren([
    indexRoute,
    aboutRoute,
    gameRoute,
    gamesRoute.addChildren([gamesUpdatesRoute, appsRoute]),
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
