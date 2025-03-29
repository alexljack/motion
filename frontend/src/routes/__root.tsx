import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Sidebar, TopBar } from "../ui";

export const Route = createRootRoute({
  component: () => (
    <div className="flex bg-green-500">
      <Sidebar />
      <hr />
      <div className="h-dvh w-full">
        <TopBar />
        <div className="h-[calc(100dvh-48px)] outline bg-gray-200 py-6 px-4">
          <Outlet />
        </div>
      </div>
      <TanStackRouterDevtools />
    </div>
  ),
});
