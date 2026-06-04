import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import useUserProfile from "../../api/user/use-user-profile";
import { useApproveWorkout } from "../../api/workouts/use-approve-workout";
import { useDeleteWorkout } from "../../api/workouts/use-delete-workout";
import useListWorkouts from "../../api/workouts/use-list-workouts";
import { usePendingWorkouts } from "../../api/workouts/use-pending-workouts";

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
  const { data: profile } = useUserProfile();
  const { data: workouts } = useListWorkouts();
  const { data: pending } = usePendingWorkouts();
  const approve = useApproveWorkout();
  const remove = useDeleteWorkout();

  const isAdmin = profile?.isAdmin ?? false;

  return (
    <div className="p-2 flex flex-col gap-6">
      {/* Pending approval — admin only */}
      {isAdmin && pending && pending.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2 text-orange-400">
            Pending approval ({pending.length})
          </p>
          <div className="flex flex-col gap-2">
            {pending.map((workout) => (
              <div
                key={workout._id}
                className="border rounded p-3 flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium capitalize text-sm">{workout.name}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {workout.difficultyLevel} · {workout.estimatedDurationMinutes} mins ·{" "}
                    {workout.exercises.length} exercises
                  </p>
                  <p className="text-xs text-gray-500">
                    Submitted by {workout.user.first_name} {workout.user.last_name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approve.mutate(workout._id)}
                    disabled={approve.isPending}
                    className="px-3 py-1 bg-orange-500 text-black text-xs font-medium rounded hover:bg-orange-400 disabled:opacity-40"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => remove.mutate(workout._id)}
                    disabled={remove.isPending}
                    className="px-3 py-1 border border-red-500 text-red-500 text-xs font-medium rounded hover:bg-red-500 hover:text-black disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All approved workouts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span>Workouts</span>
          <Link
            to="/workouts/new"
            className="px-3 py-1 bg-orange-500 text-black text-sm font-medium rounded hover:bg-orange-400"
          >
            + New workout
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {workouts?.map((workout) => (
            <div key={workout._id} className="relative group">
              <Link to="/workouts/$id" params={{ id: workout._id }}>
                <div className="h-12 border bg-orange-500 text-center content-center cursor-pointer">
                  <h3>{workout.name}</h3>
                </div>
              </Link>
              {isAdmin && (
                <div className="absolute top-0 right-0 hidden group-hover:flex gap-1 p-1">
                  <Link
                    to="/workouts/$id"
                    params={{ id: workout._id }}
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-0.5 bg-black text-white text-xs rounded hover:bg-gray-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (confirm(`Delete "${workout.name}"?`)) {
                        remove.mutate(workout._id);
                      }
                    }}
                    disabled={remove.isPending}
                    className="px-2 py-0.5 bg-red-600 text-white text-xs rounded hover:bg-red-500 disabled:opacity-40"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
