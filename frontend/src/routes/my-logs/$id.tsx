import {
  createFileRoute,
  redirect,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import {
  useCompleteWorkoutSession,
  useUpdateExerciseSet,
  useWorkoutSession,
} from "../../api/workouts/use-workout-sessions";
import PageWrapper from "../../ui/page-wrapper/page-wrapper";
import type { PopulatedExercise, WorkoutExercise } from "../../api/workout-types";

type SetValues = {
  reps: number;
  weight: number;
  durationInSeconds: number;
};

type FormValues = {
  exercises: { sets: SetValues[] }[];
  rating: number;
  feeling: "terrible" | "bad" | "okay" | "good" | "amazing";
  notes: string;
};

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

  const methods = useForm<FormValues>({
    defaultValues: { exercises: [], rating: 3, feeling: "good", notes: "" },
  });
  const { reset, handleSubmit, watch, setValue } = methods;

  const initialized = useRef(false);
  useEffect(() => {
    if (session && !initialized.current) {
      reset({
        exercises: session.exercises.map((ex) => ({
          sets: (ex.sets ?? []).map((s) => ({
            reps: s.reps,
            weight: s.weight,
            durationInSeconds: s.duration ?? 0,
          })),
        })),
        rating: 3,
        feeling: "good",
        notes: "",
      });
      initialized.current = true;
    }
  }, [session, reset]);

  async function onFinish(data: FormValues) {
    await completeSession.mutateAsync({
      id: sessionId,
      rating: data.rating,
      feeling: data.feeling,
      notes: data.notes || undefined,
    });
    navigate({ to: "/my-logs" });
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

  const rating = watch("rating");
  const feeling = watch("feeling");

  return (
    <FormProvider {...methods}>
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
                  totalSets > 0
                    ? `${(completedSets / totalSets) * 100}%`
                    : "0%",
              }}
            />
          </div>
        </div>

        {/* Exercise list */}
        <div className="flex flex-col gap-6 mb-8">
          {session.exercises.map((exercise, exerciseIndex) => (
            <ExerciseCard
              key={
                (exercise.exercise as PopulatedExercise)._id + exerciseIndex
              }
              exercise={exercise}
              exerciseIndex={exerciseIndex}
              sessionId={sessionId}
              sessionCompleted={session.status === "completed"}
              updateSet={updateSet}
            />
          ))}
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
                <label className="block text-sm text-gray-400 mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setValue("rating", n)}
                      className={`flex-1 py-2 rounded border text-sm font-medium transition-colors ${
                        rating === n
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
                  {(
                    ["terrible", "bad", "okay", "good", "amazing"] as const
                  ).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setValue("feeling", f)}
                      className={`px-3 py-1.5 rounded border text-sm capitalize transition-colors ${
                        feeling === f
                          ? "bg-orange-500 border-orange-500 text-black"
                          : "border-white/20 hover:border-orange-400"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Any notes about this session..."
                  className="w-full p-2 border rounded bg-transparent text-sm resize-none"
                  {...methods.register("notes")}
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
                  onClick={handleSubmit(onFinish)}
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
    </FormProvider>
  );
}

type ExerciseCardProps = {
  exercise: WorkoutExercise;
  exerciseIndex: number;
  sessionId: string;
  sessionCompleted: boolean;
  updateSet: ReturnType<typeof useUpdateExerciseSet>;
};

function ExerciseCard({
  exercise,
  exerciseIndex,
  sessionId,
  sessionCompleted,
  updateSet,
}: ExerciseCardProps) {
  const exerciseData = exercise.exercise as PopulatedExercise;
  const isCardio = exerciseData.category === "cardio";

  const { register, getValues, control } = useFormContext<FormValues>();
  const { fields, append } = useFieldArray({
    control,
    name: `exercises.${exerciseIndex}.sets`,
  });

  async function handleAddSet() {
    const previousSet = exercise.sets?.[exercise.sets.length - 1];
    const newSetValues: SetValues = {
      reps: isCardio ? 0 : previousSet?.reps ?? 10,
      weight: isCardio ? 0 : previousSet?.weight ?? 0,
      durationInSeconds: isCardio ? previousSet?.duration ?? 60 : 0,
    };

    await updateSet.mutateAsync({
      sessionId,
      exerciseIndex,
      setData: {
        setNumber: fields.length + 1,
        ...newSetValues,
        completed: false,
      },
    });

    append(newSetValues);
  }

  async function handleToggleCompleted(
    setIndex: number,
    setNumber: number,
    currentlyCompleted: boolean,
  ) {
    const values = getValues(`exercises.${exerciseIndex}.sets.${setIndex}`);

    await updateSet.mutateAsync({
      sessionId,
      exerciseIndex,
      setData: {
        setNumber,
        ...values,
        completed: !currentlyCompleted,
      },
    });
  }

  return (
    <div className="border rounded p-4">
      <div className="mb-3">
        <h3 className="font-semibold capitalize">{exerciseData.name}</h3>
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
        {fields.map((field, setIndex) => {
          const serverSet = exercise.sets?.[setIndex];
          const setNumber = serverSet?.setNumber ?? setIndex + 1;
          const completed = serverSet?.completed ?? false;

          return (
            <div
              key={field.id}
              className={`grid items-center gap-2 p-1 rounded transition-colors ${
                completed ? "bg-orange-500/10" : ""
              }`}
              style={{
                gridTemplateColumns: isCardio
                  ? "1.5rem 1fr 2rem"
                  : "1.5rem 1fr 1fr 2rem",
              }}
            >
              <span className="text-sm text-gray-400 text-center">
                {setNumber}
              </span>

              {isCardio ? (
                <input
                  type="number"
                  min={0}
                  {...register(
                    `exercises.${exerciseIndex}.sets.${setIndex}.durationInSeconds`,
                    { valueAsNumber: true },
                  )}
                  className="p-1 border rounded bg-transparent text-center text-sm w-full"
                />
              ) : (
                <>
                  <input
                    type="number"
                    min={0}
                    {...register(
                      `exercises.${exerciseIndex}.sets.${setIndex}.reps`,
                      { valueAsNumber: true },
                    )}
                    className="p-1 border rounded bg-transparent text-center text-sm w-full"
                  />
                  <input
                    type="number"
                    min={0}
                    {...register(
                      `exercises.${exerciseIndex}.sets.${setIndex}.weight`,
                      { valueAsNumber: true },
                    )}
                    className="p-1 border rounded bg-transparent text-center text-sm w-full"
                  />
                </>
              )}

              <button
                disabled={sessionCompleted}
                type="button"
                onClick={() =>
                  handleToggleCompleted(setIndex, setNumber, completed)
                }
                className={`w-7 h-7 rounded border text-xs font-bold transition-colors ${
                  completed
                    ? "bg-orange-500 border-orange-500 text-black"
                    : "border-white/30 text-gray-400 hover:border-orange-400"
                }`}
              >
                ✓
              </button>
            </div>
          );
        })}
      </div>

      {!sessionCompleted && (
        <button
          type="button"
          onClick={handleAddSet}
          disabled={updateSet.isPending}
          className="w-full py-2 border border-dashed rounded text-sm text-gray-400 hover:text-white hover:border-orange-400 transition-colors disabled:opacity-40"
        >
          + Add set
        </button>
      )}
    </div>
  );
}
