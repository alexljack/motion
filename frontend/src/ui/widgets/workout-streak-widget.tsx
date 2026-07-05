import { useWorkoutSessions } from "../../api/workouts/use-workout-sessions";

function computeStreak(sessions: { completedAt: string }[]) {
  const dates = new Set(
    sessions.map((s) => new Date(s.completedAt).toISOString().slice(0, 10))
  );
  let streak = 0;
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  while (dates.has(day.toISOString().slice(0, 10))) {
    streak++;
    day.setDate(day.getDate() - 1);
  }
  return streak;
}

export function WorkoutStreakWidget() {
  const { data, isLoading } = useWorkoutSessions({ status: "completed", limit: 90 });
  const sessions = data?.workoutSessions ?? [];
  const streak = computeStreak(sessions);

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2 h-full">
      <p className="text-xs text-gray-400 uppercase tracking-wide">Streak</p>
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="flex items-end gap-2 mt-1">
          <span className="text-5xl font-bold text-orange-400">{streak}</span>
          <span className="text-gray-400 mb-1.5">day{streak !== 1 ? "s" : ""}</span>
        </div>
      )}
    </div>
  );
}
