import { useWorkoutSessions } from "../../api/workouts/use-workout-sessions";

// Max days allowed between workouts before the streak resets.
// Covers common plans like every-other-day (1 rest day) up to 2x/week (3 rest days).
const GAP_THRESHOLD_DAYS = 4;

function daysBetween(a: Date, b: Date) {
  return Math.round(Math.abs(a.getTime() - b.getTime()) / 86_400_000);
}

function computeStreak(sessions: { completedAt: string }[]) {
  if (sessions.length === 0) return 0;

  // One entry per calendar day, most recent first
  const seen = new Set<string>();
  const uniqueDays: Date[] = [];
  for (const s of sessions) {
    const d = new Date(s.completedAt);
    const key = d.toISOString().slice(0, 10);
    if (!seen.has(key)) {
      seen.add(key);
      uniqueDays.push(d);
    }
  }
  uniqueDays.sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mostRecent = new Date(uniqueDays[0]);
  mostRecent.setHours(0, 0, 0, 0);
  if (daysBetween(today, mostRecent) > GAP_THRESHOLD_DAYS) return 0;

  let streak = 1;
  for (let i = 0; i < uniqueDays.length - 1; i++) {
    const curr = new Date(uniqueDays[i]);
    const next = new Date(uniqueDays[i + 1]);
    curr.setHours(0, 0, 0, 0);
    next.setHours(0, 0, 0, 0);
    if (daysBetween(curr, next) <= GAP_THRESHOLD_DAYS) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function WorkoutStreakWidget() {
  const { data, isLoading } = useWorkoutSessions({
    status: "completed",
    limit: 90,
    populate: "false",
    count: "false",
  });
  const sessions = data?.workoutSessions ?? [];
  const streak = computeStreak(sessions);

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2 h-full">
      <p className="text-xs text-gray-400 uppercase tracking-wide">Streak</p>
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="flex h-full justify-center items-center gap-2 mt-1">
          <span className="text-5xl md:text-9xl font-bold text-orange-400">
            {streak}
          </span>
          <span className="text-gray-400 mb-1.5">
            workout{streak !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
