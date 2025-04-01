import { createFileRoute, redirect } from "@tanstack/react-router";
import useListWorkouts from "../../api/use-list-workouts";

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
  const { data: workouts } = useListWorkouts();
  console.log("workouts", workouts);
  return (
    <div>
      Hello "/workouts/"!
      <p>Select a workout from below</p>
    </div>
  );
}
