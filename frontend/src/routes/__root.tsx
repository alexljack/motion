import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Sidebar } from "../ui";

export const Route = createRootRoute({
  component: () => (
    <div className="flex bg-green-500">
      <Sidebar />
      <hr />
      <div className="h-dvh w-full">
        <div className="h-12 bg-red-500 w-full">Topbar</div>
        <div className="h-[calc(100dvh-48px)] bg-gray-200 py-6 px-4">
          <Outlet />
        </div>
      </div>
      <TanStackRouterDevtools />
    </div>
  ),
});
