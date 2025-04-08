import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import useListWorkouts from "../../api/workouts/use-list-workouts";

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
      <div className="grid grid-cols-3">
        {workouts?.map((workout) => (
          <Link
            to="/workouts/$id"
            params={{ id: workout._id }}
            key={workout._id}
          >
            <div
              className="h-12 border bg-orange-500 text-center content-center cursor-pointer"
              key={workout._id}
            >
              <h3>{workout.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
