import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import useListWorkouts from "../../api/workouts/use-list-workouts";
import {
  useCreateWorkoutSession,
  useStartWorkoutSession,
} from "../../api/workouts/use-workout-sessions";
import PageWrapper from "../../ui/page-wrapper/page-wrapper";

export const Route = createFileRoute("/my-logs/new")({
  beforeLoad: async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      throw redirect({ to: "/auth" });
    }
  },
  component: NewLog,
});

type TemplateExercise = {
  id: string;
  exerciseId: string;
  name: string;
  category: string;
  mainTargetMuscle: string;
};

function NewLog() {
  const navigate = useNavigate();

  const { data: workouts } = useListWorkouts();

  const createSession = useCreateWorkoutSession();
  const startSession = useStartWorkoutSession();

  const [sessionName, setSessionName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [templateExercises, setTemplateExercises] = useState<
    TemplateExercise[]
  >([]);
  const [selectedExercises, setSelectedExercises] = useState<
    TemplateExercise[]
  >([]);

  function handleTemplateChange(templateId: string) {
    setSelectedTemplateId(templateId);
    if (!templateId) {
      setTemplateExercises([]);
      setSelectedExercises([]);
      setSessionName("");
      return;
    }
    const template = workouts?.find((w) => w._id === templateId);
    if (!template) return;

    setSessionName(template.name);
    const exercises: TemplateExercise[] = template.exercises
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((te) => ({
        id: crypto.randomUUID(),
        exerciseId: te.exercise._id,
        name: te.exercise.name,
        category: te.exercise.category ?? "strength",
        mainTargetMuscle: te.exercise.mainTargetMuscle,
      }));
    setTemplateExercises(exercises);
    setSelectedExercises([]);
  }

  function handleSelectExercise(id: string) {
    const exercise = templateExercises.find((ex) => ex.id === id);
    if (!exercise) return;
    setSelectedExercises((prev) => [...prev, exercise]);
  }

  function removeExercise(id: string) {
    setSelectedExercises((prev) => prev.filter((ex) => ex.id !== id));
  }

  // Exercises not yet added to the session
  const availableExercises = templateExercises.filter(
    (ex) => !selectedExercises.some((sel) => sel.id === ex.id),
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (selectedExercises.length === 0) return;

    const name = sessionName.trim() || new Date().toLocaleDateString();

    const sessionExercises = selectedExercises.map((se) => ({
      exercise: se.exerciseId,
      sets: [],
    }));

    const session = await createSession.mutateAsync({
      name,
      basedOnWorkout: selectedTemplateId || undefined,
      exercises: sessionExercises,
    });

    await startSession.mutateAsync(session._id);
    navigate({ to: "/logs/$id", params: { id: session._id } });
  }

  const isSubmitting = createSession.isPending || startSession.isPending;
  return (
    <PageWrapper pageName="New workout">
      <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-6">
        {/* Session name */}
        <div>
          <label className="block text-sm font-medium mb-1">Workout name</label>
          <input
            type="text"
            placeholder="e.g. Push Day"
            className="w-full p-2 border rounded bg-transparent"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
        </div>

        {/* Template picker */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Select a workout template
          </label>
          <select
            value={selectedTemplateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full p-2 border rounded bg-transparent capitalize"
          >
            <option value="">— select a template —</option>
            {workouts?.map((w) => (
              <option key={w._id} value={w._id} className="capitalize">
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Exercise picker */}
        {selectedTemplateId && (
          <div className="flex flex-col gap-3">
            <select
              value=""
              onChange={(e) => handleSelectExercise(e.target.value)}
              className="w-full p-2 border rounded bg-transparent capitalize"
              disabled={availableExercises.length === 0}
            >
              <option value="">
                {availableExercises.length === 0
                  ? "— all exercises added —"
                  : "— add an exercise —"}
              </option>
              {availableExercises.map((ex) => (
                <option key={ex.id} value={ex.id} className="capitalize">
                  {ex.name} · {ex.mainTargetMuscle}
                </option>
              ))}
            </select>

            {/* Selected exercises */}
            {selectedExercises.length > 0 && (
              <div className="flex flex-col gap-2">
                {selectedExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="border rounded p-3 flex items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium capitalize text-sm truncate">
                        {exercise.name}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {exercise.mainTargetMuscle}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExercise(exercise.id)}
                      className="text-gray-400 hover:text-red-400 text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedTemplateId && (
          <p className="text-gray-400 text-sm py-8 text-center border rounded">
            Select a workout template to get started
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || selectedExercises.length === 0}
          className="w-full py-3 bg-orange-500 text-black font-semibold rounded hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Starting..." : "Start workout"}
        </button>
      </form>
    </PageWrapper>
  );
}
