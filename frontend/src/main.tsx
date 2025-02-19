import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import App from "./App.tsx";
import Dashboard from "./pages/dashboard.tsx";
// import Exercises from "./pages/exercises.tsx";
// import ExerciseView from "./pages/exercise-view.tsx";
// import GoalsView from "./pages/goals.tsx";
// import Workouts from "./pages/workouts.tsx";

// Define routes with required properties
const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

// const exercisesRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/exercises",
//   component: Exercises,
// });

// const exerciseViewRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/exercises/:id",
//   component: ExerciseView,
// });

// const goalsRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/goals",
//   component: GoalsView,
// });

// const workoutsRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/workouts",
//   component: Workouts,
// });

// Create the router with the root route as the parent
const routeTree = rootRoute.addChildren([
  indexRoute,
  // exercisesRoute,
  // exerciseViewRoute,
  // goalsRoute,
  // workoutsRoute,
  // aboutRoute,
]);

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
