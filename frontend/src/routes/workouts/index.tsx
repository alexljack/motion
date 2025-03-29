import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/workouts/")({
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
  component: WorkoutIndex,
});

function WorkoutIndex() {
  return <div>Hello "/workouts/"!</div>;
}
