import {
  createFileRoute,
  redirect,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useState } from "react";
import {
  useWorkoutSession,
  useUpdateExerciseSet,
  useCompleteWorkoutSession,
} from "../../api/workouts/use-workout-sessions";
import PageWrapper from "../../ui/page-wrapper/page-wrapper";
import type { PopulatedExercise } from "../../api/workout-types";

export const Route = createFileRoute("/my-logs/$id")({
  beforeLoad: async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      throw redirect({ to: "/auth" });
    }
  },
  component: ActiveLog,
});

function ActiveLog() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const sessionId = id ?? "";

  const { data: session, isLoading, error } = useWorkoutSession(sessionId);
  const updateSet = useUpdateExerciseSet();
  const completeSession = useCompleteWorkoutSession();

  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishData, setFinishData] = useState({
    rating: 3,
    feeling: "good" as "terrible" | "bad" | "okay" | "good" | "amazing",
    notes: "",
  });

  async function handleAddSet(exerciseIndex: number) {
    const exercise = session?.exercises[exerciseIndex];
    if (!exercise) return;

    const nextSetNumber = (exercise.sets?.length || 0) + 1;
    const isCardio =
      (exercise.exercise as PopulatedExercise).category === "cardio";

    // Get previous set data for convenience
    const previousSet = exercise.sets?.[exercise.sets.length - 1];

    await updateSet.mutateAsync({
      sessionId,
      exerciseIndex,
      setData: {
        setNumber: nextSetNumber,
        reps: isCardio ? 0 : previousSet?.reps || 10,
        weight: isCardio ? 0 : previousSet?.weight || 0,
        durationInSeconds: isCardio ? previousSet?.duration || 60 : 0,
        completed: false,
      },
    });
  }

  async function handleUpdateSet(
    exerciseIndex: number,
    setNumber: number,
    field: "reps" | "weight" | "durationInSeconds",
    value: number,
  ) {
    const exercise = session?.exercises[exerciseIndex];
    const set = exercise?.sets?.find((s) => s.setNumber === setNumber);
    if (!set) return;

    await updateSet.mutateAsync({
      sessionId,
      exerciseIndex,
      setData: {
        setNumber,
        reps: field === "reps" ? value : set.reps,
        weight: field === "weight" ? value : set.weight,
        durationInSeconds:
          field === "durationInSeconds" ? value : set.duration || 0,
        completed: set.completed,
      },
    });
  }

  async function handleToggleCompleted(
    exerciseIndex: number,
    setNumber: number,
  ) {
    const exercise = session?.exercises[exerciseIndex];
    const set = exercise?.sets?.find((s) => s.setNumber === setNumber);
    if (!set) return;

    await updateSet.mutateAsync({
      sessionId,
      exerciseIndex,
      setData: {
        setNumber,
        reps: set.reps,
        weight: set.weight,
        durationInSeconds: set.duration || 0,
        completed: !set.completed,
      },
    });
  }

  async function handleFinishWorkout() {
    await completeSession.mutateAsync({
      id: sessionId,
      rating: finishData.rating,
      feeling: finishData.feeling,
      notes: finishData.notes || undefined,
    });
    navigate({ to: "/logs" });
  }

  if (error) {
    return (
      <PageWrapper pageName="Error">
        <p className="text-red-400">
          {(error as Error).message ?? "Failed to load session"}
        </p>
      </PageWrapper>
    );
  }

  if (isLoading || !session) {
    return (
      <PageWrapper pageName="Loading...">
        <p className="text-gray-400">Loading session...</p>
      </PageWrapper>
    );
  }

  const completedSets = session.exercises.reduce(
    (total, ex) => total + (ex.sets?.filter((s) => s.completed).length || 0),
    0,
  );
  const totalSets = session.exercises.reduce(
    (total, ex) => total + (ex.sets?.length || 0),
    0,
  );

  return (
    <PageWrapper pageName={session.name}>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span className="capitalize">{session.status}</span>
          <span>
            {completedSets} / {totalSets} sets
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div
            className="bg-orange-500 h-1.5 rounded-full transition-all"
            style={{
              width:
                totalSets > 0 ? `${(completedSets / totalSets) * 100}%` : "0%",
            }}
          />
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex flex-col gap-6 mb-8">
        {session.exercises.map((exercise, exerciseIndex) => {
          const exerciseData = exercise.exercise as PopulatedExercise;
          const isCardio = exerciseData.category === "cardio";

          return (
            <div
              key={exerciseData._id + exerciseIndex}
              className="border rounded p-4"
            >
              <div className="mb-3">
                <h3 className="font-semibold capitalize">
                  {exerciseData.name}
                </h3>
                <p className="text-xs text-gray-400 capitalize">
                  {exerciseData.mainTargetMuscle}
                </p>
              </div>

              {/* Column headers */}
              <div
                className="grid text-xs text-gray-400 mb-1 px-1 gap-2"
                style={{
                  gridTemplateColumns: isCardio
                    ? "1.5rem 1fr 2rem"
                    : "1.5rem 1fr 1fr 2rem",
                }}
              >
                <span>#</span>
                {isCardio ? (
                  <span>Duration (s)</span>
                ) : (
                  <>
                    <span>Reps</span>
                    <span>Weight (kg)</span>
                  </>
                )}
                <span />
              </div>

              {/* Set rows */}
              <div className="flex flex-col gap-1 mb-3">
                {exercise.sets?.map((set) => (
                  <div
                    key={set.setNumber}
                    className={`grid items-center gap-2 p-1 rounded transition-colors ${
                      set.completed ? "bg-orange-500/10" : ""
                    }`}
                    style={{
                      gridTemplateColumns: isCardio
                        ? "1.5rem 1fr 2rem"
                        : "1.5rem 1fr 1fr 2rem",
                    }}
                  >
                    <span className="text-sm text-gray-400 text-center">
                      {set.setNumber}
                    </span>

                    {isCardio ? (
                      <input
                        type="number"
                        min={0}
                        value={set.duration || 0}
                        onChange={(e) =>
                          handleUpdateSet(
                            exerciseIndex,
                            set.setNumber,
                            "durationInSeconds",
                            Number(e.target.value),
                          )
                        }
                        className="p-1 border rounded bg-transparent text-center text-sm w-full"
                      />
                    ) : (
                      <>
                        <input
                          type="number"
                          min={0}
                          value={set.reps}
                          onChange={(e) =>
                            handleUpdateSet(
                              exerciseIndex,
                              set.setNumber,
                              "reps",
                              Number(e.target.value),
                            )
                          }
                          className="p-1 border rounded bg-transparent text-center text-sm w-full"
                        />
                        <input
                          type="number"
                          min={0}
                          value={set.weight}
                          onChange={(e) =>
                            handleUpdateSet(
                              exerciseIndex,
                              set.setNumber,
                              "weight",
                              Number(e.target.value),
                            )
                          }
                          className="p-1 border rounded bg-transparent text-center text-sm w-full"
                        />
                      </>
                    )}

                    {/* Done toggle */}
                    <button
                      disabled={session.status === "completed"}
                      type="button"
                      onClick={() =>
                        handleToggleCompleted(exerciseIndex, set.setNumber)
                      }
                      className={`w-7 h-7 rounded border text-xs font-bold transition-colors ${
                        set.completed
                          ? "bg-orange-500 border-orange-500 text-black"
                          : "border-white/30 text-gray-400 hover:border-orange-400"
                      }`}
                    >
                      ✓
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Set button */}
              {session.status !== "completed" && (
                <button
                  type="button"
                  onClick={() => handleAddSet(exerciseIndex)}
                  disabled={updateSet.isPending}
                  className="w-full py-2 border border-dashed rounded text-sm text-gray-400 hover:text-white hover:border-orange-400 transition-colors disabled:opacity-40"
                >
                  + Add set
                </button>
              )}
            </div>
          );
        })}
      </div>

      {session.status !== "completed" && (
        <button
          type="button"
          onClick={() => setShowFinishModal(true)}
          className="w-full py-3 bg-orange-500 text-black font-semibold rounded hover:bg-orange-400"
        >
          Finish workout
        </button>
      )}

      {/* Finish modal */}
      {showFinishModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border rounded-lg p-6 w-full max-w-sm flex flex-col gap-4">
            <h2 className="text-lg font-semibold">How was your workout?</h2>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFinishData((d) => ({ ...d, rating: n }))}
                    className={`flex-1 py-2 rounded border text-sm font-medium transition-colors ${
                      finishData.rating === n
                        ? "bg-orange-500 border-orange-500 text-black"
                        : "border-white/20 hover:border-orange-400"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Feeling
              </label>
              <div className="flex gap-1 flex-wrap">
                {(["terrible", "bad", "okay", "good", "amazing"] as const).map(
                  (f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() =>
                        setFinishData((d) => ({ ...d, feeling: f }))
                      }
                      className={`px-3 py-1.5 rounded border text-sm capitalize transition-colors ${
                        finishData.feeling === f
                          ? "bg-orange-500 border-orange-500 text-black"
                          : "border-white/20 hover:border-orange-400"
                      }`}
                    >
                      {f}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Notes</label>
              <textarea
                rows={3}
                placeholder="Any notes about this session..."
                className="w-full p-2 border rounded bg-transparent text-sm resize-none"
                value={finishData.notes}
                onChange={(e) =>
                  setFinishData((d) => ({ ...d, notes: e.target.value }))
                }
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="flex-1 py-2 border rounded text-sm hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinishWorkout}
                disabled={completeSession.isPending}
                className="flex-1 py-2 bg-orange-500 text-black font-semibold rounded text-sm hover:bg-orange-400 disabled:opacity-40"
              >
                {completeSession.isPending ? "Saving..." : "Save & finish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
