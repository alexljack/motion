import type { Exercise } from "../api/exercises/use-list-exercises";

type Props = { exercises: Exercise[] };

// Renders <optgroup> elements grouped and sorted by mainTargetMuscle.
// Drop this inside any <select> that lists exercises.
const ExerciseOptGroups = ({ exercises }: Props) => {
  const grouped: Record<string, Exercise[]> = {};
  for (const ex of exercises) {
    const key = ex.mainTargetMuscle || "other";
    (grouped[key] ??= []).push(ex);
  }

  const sortedGroups = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  return (
    <>
      {sortedGroups.map((muscle) => (
        <optgroup
          key={muscle}
          label={muscle.charAt(0).toUpperCase() + muscle.slice(1)}
        >
          {grouped[muscle]
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((ex) => (
              <option key={ex._id} value={ex._id} className="capitalize">
                {ex.name}
              </option>
            ))}
        </optgroup>
      ))}
    </>
  );
};

export default ExerciseOptGroups;
