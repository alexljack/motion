import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import useListWorkouts from "../../api/workouts/use-list-workouts";

export const Route = createFileRoute("/workouts/")({
  beforeLoad: async ({ location }) => {
    const user = localStorage.getItem("user");

    if (!user) {
      throw redirect({
        to: "/auth",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: WorkoutIndex,
});

function WorkoutIndex() {
  const { data: workouts } = useListWorkouts();
  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-3">
        <span>Workouts</span>
        <Link
          to="/workouts/new"
          className="px-3 py-1 bg-orange-500 text-black text-sm font-medium rounded hover:bg-orange-400"
        >
          + New workout
        </Link>
      </div>
      <div className="grid grid-cols-3">
        {workouts?.map((workout) => (
          <Link
            to="/workouts/$id"
            params={{ id: workout._id }}
            key={workout._id}
          >
            <div className="h-12 border bg-orange-500 text-center content-center cursor-pointer">
              <h3>{workout.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
