import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/workouts/$id")({
  beforeLoad: async ({ location }) => {
    const user = localStorage.getItem("user");

    if (!user) {
      throw redirect({
        to: "/auth",
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
  },
  component: WorkoutView,
  loader: () => <div>Loading...</div>,
});

function WorkoutView() {
  return <div>Hello "/workouts/$id"!</div>;
}
