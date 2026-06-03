import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { routeTree } from "./routeTree.gen";

import "./index.css";

const router = createRouter({ routeTree });

const queryClient = new QueryClient();

// Render the app with TanStack Router
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
    <TanStackRouterDevtools position="bottom-right" router={router} />
  </StrictMode>
);

// Type registration
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
