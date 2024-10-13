import { RootHeader } from "@/components/root-header";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ComponentProps, FC } from "react";

export const Root: FC<ComponentProps<"div">> = () => {
  return (
    <>
      <RootHeader />
      <div className="min-h-[calc(100vh-4rem)] container mx-auto max-w-screen-2xl p-4 md:p-5 flex flex-col">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  );
};
