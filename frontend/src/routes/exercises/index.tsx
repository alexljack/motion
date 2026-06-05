import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import useUserProfile from "../../api/user/use-user-profile";
import { useApproveExercise } from "../../api/exercises/use-approve-exercise";
import { useDeleteExercise } from "../../api/exercises/use-delete-exercise";
import {
  Exercise,
  useListExercises,
} from "../../api/exercises/use-list-exercises";
import { usePendingExercises } from "../../api/exercises/use-pending-exercises";
import PageWrapper from "../../ui/page-wrapper/page-wrapper";

export const Route = createFileRoute("/exercises/")({
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
  component: ExerciseIndex,
});

function ExerciseIndex() {
  const { data: profile } = useUserProfile();
  const { data: exercises } = useListExercises();
  const { data: pending } = usePendingExercises();
  const approve = useApproveExercise();
  const remove = useDeleteExercise();

  const isAdmin = profile?.isAdmin ?? false;

  return (
    <div className="p-2 flex flex-col gap-6">
      <PageWrapper pageName="Exercises">
        {/* Pending approval — admin only */}
        {isAdmin && pending && pending.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 text-orange-400">
              Pending approval ({pending.length})
            </p>
            <div className="flex flex-col gap-2">
              {pending.map((ex) => (
                <div
                  key={ex._id}
                  className="border rounded p-3 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium capitalize text-sm">{ex.name}</p>
                    <p className="text-xs text-gray-400 capitalize">
                      {ex.category} · {ex.mainTargetMuscle} · {ex.difficulty}
                    </p>
                    <p className="text-xs text-gray-500">
                      Submitted by {ex.user.first_name} {ex.user.last_name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approve.mutate(ex._id)}
                      disabled={approve.isPending}
                      className="px-3 py-1 bg-orange-500 text-black text-xs font-medium rounded hover:bg-orange-400 disabled:opacity-40"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => remove.mutate(ex._id)}
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

        {/* All exercises */}
        <div>
          <div className="flex items-center justify-end mb-3">
            <Link
              to="/exercises/new"
              className="px-3 py-1 bg-orange-500 text-black text-sm font-medium rounded hover:bg-orange-400"
            >
              + New exercise
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {exercises?.map((exercise: Exercise) => (
              <Link
                to="/exercises/$id"
                params={{ id: exercise._id }}
                key={exercise._id}
              >
                <div className="h-12 border rounded-lg bg-orange-500 text-center content-center cursor-pointer font-semibold">
                  {exercise.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}

export default ExerciseIndex;
