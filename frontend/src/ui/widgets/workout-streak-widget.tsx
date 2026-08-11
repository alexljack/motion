import { useWorkoutSessions } from "../../api/workouts/use-workout-sessions";

// Max days allowed between workouts before the streak resets.
// Covers common plans like every-other-day (1 rest day) up to 2x/week (3 rest days).
const GAP_THRESHOLD_DAYS = 4;

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function toDayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: Date, b: Date) {
  return Math.round(Math.abs(a.getTime() - b.getTime()) / 86_400_000);
}

function computeStreak(sessions: { startedAt: string }[]) {
  if (sessions.length === 0) return 0;

  // One entry per calendar day, most recent first
  const seen = new Set<string>();
  const uniqueDays: Date[] = [];
  for (const s of sessions) {
    const d = new Date(s.startedAt);
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

// Intensity ramp for a day's cell: 0 sessions -> neutral, 1 -> orange-400, 2+ -> orange-600.
function cellClass(count: number) {
  if (count >= 2) return "bg-orange-600";
  if (count === 1) return "bg-orange-400";
  return "bg-zinc-800";
}

function MonthHeatmap({ sessions }: { sessions: { startedAt: string }[] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const startOfToday = new Date(year, month, now.getDate());

  const countsByDay = new Map<string, number>();
  for (const s of sessions) {
    const d = new Date(s.startedAt);
    if (d.getFullYear() !== year || d.getMonth() !== month) continue;
    const key = toDayKey(d);
    countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1);
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1)
    ),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const activeDays = countsByDay.size;
  const monthLabel = now.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{monthLabel}</p>
        <p className="text-xs text-gray-500">
          {activeDays} day{activeDays !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex gap-1">
        <div className="grid grid-rows-7 gap-1">
          {WEEKDAY_LABELS.map((label, i) => (
            <span
              key={i}
              className="w-3 h-3 text-[8px] leading-3 text-gray-500"
            >
              {i % 2 === 1 ? label : ""}
            </span>
          ))}
        </div>
        <div className="grid grid-rows-7 grid-flow-col gap-1">
          {cells.map((date, i) => {
            if (!date) return <div key={i} className="w-3 h-3" />;

            const key = toDayKey(date);
            const count = countsByDay.get(key) ?? 0;
            const isFuture = date.getTime() > startOfToday.getTime();
            const isToday = key === toDayKey(startOfToday);

            return (
              <div
                key={i}
                title={
                  isFuture
                    ? undefined
                    : `${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}: ${count} workout${count !== 1 ? "s" : ""}`
                }
                className={`w-3 h-3 rounded-sm ${
                  isFuture ? "bg-zinc-900" : cellClass(count)
                } ${isToday ? "ring-1 ring-inset ring-white/70" : ""}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
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
    <div className="border rounded-lg p-4 flex flex-col gap-3 h-full">
      <p className="text-xs text-gray-400 uppercase tracking-wide">Streak</p>
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-orange-400">
              {streak}
            </span>
            <span className="text-gray-400">
              workout{streak !== 1 ? "s" : ""}
            </span>
          </div>
          <MonthHeatmap sessions={sessions} />
        </>
      )}
    </div>
  );
}
