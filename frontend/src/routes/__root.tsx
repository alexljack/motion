import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useState } from "react";
import { MobileNav, Sidebar, TopBar } from "../ui";

function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex bg-gray-300">
      <Sidebar />
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <hr />
      <div className="h-dvh w-full">
        <TopBar onMenuOpen={() => setMenuOpen(true)} />
        <div className="h-[calc(100dvh-48px)] bg-white py-6 px-4 overflow-scroll">
          <Outlet />
        </div>
      </div>
      <TanStackRouterDevtools />
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
