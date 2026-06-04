import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WORKOUTS_FILE = join(__dirname, "../data/workouts.js");
const TEMPLATE_EXERCISES_FILE = join(__dirname, "../data/template-exercises.js");

export function appendWorkoutToSeeder(workout, templateExercises) {
  _appendWorkout(workout);
  _appendTemplateExercises(workout.name, templateExercises);
}

function _appendWorkout(workout) {
  const content = readFileSync(WORKOUTS_FILE, "utf-8");

  const lines = [
    `  {`,
    `    name: ${JSON.stringify(workout.name)},`,
  ];
  if (workout.description) {
    lines.push(`    description: ${JSON.stringify(workout.description)},`);
  }
  if (workout.difficultyLevel) {
    lines.push(`    difficultyLevel: ${JSON.stringify(workout.difficultyLevel)},`);
  }
  if (workout.estimatedDurationMinutes) {
    lines.push(`    estimatedDurationMinutes: ${workout.estimatedDurationMinutes},`);
  }
  lines.push(`    isPublic: ${workout.isPublic || false},`);
  lines.push(`    isApproved: true,`);
  lines.push(`  }`);

  const entry = lines.join("\n");

  const updated = content.replace(
    /\n\];\n\nexport default workouts;/,
    `\n${entry},\n];\n\nexport default workouts;`
  );

  if (updated === content) {
    throw new Error("Could not locate insertion point in workouts.js");
  }

  writeFileSync(WORKOUTS_FILE, updated, "utf-8");
}

function _appendTemplateExercises(workoutName, exercises) {
  if (!exercises || exercises.length === 0) return;

  const content = readFileSync(TEMPLATE_EXERCISES_FILE, "utf-8");

  const exerciseLines = exercises.map((ex) => {
    const parts = [
      `    { exerciseName: ${JSON.stringify(ex.exerciseName)}`,
      `orderIndex: ${ex.orderIndex}`,
    ];
    if (ex.targetSets != null) parts.push(`targetSets: ${ex.targetSets}`);
    if (ex.targetReps != null) parts.push(`targetReps: ${ex.targetReps}`);
    if (ex.targetWeight != null) parts.push(`targetWeight: ${ex.targetWeight}`);
    if (ex.targetDurationSeconds != null) parts.push(`targetDurationSeconds: ${ex.targetDurationSeconds}`);
    if (ex.restSeconds != null) parts.push(`restSeconds: ${ex.restSeconds}`);
    return parts.join(", ") + " }";
  });

  const entry = [
    `  ${JSON.stringify(workoutName)}: [`,
    exerciseLines.join(",\n"),
    `  ]`,
  ].join("\n");

  const updated = content.replace(
    /\n\};\n\nexport default templateExercises;/,
    `\n${entry},\n};\n\nexport default templateExercises;`
  );

  if (updated === content) {
    throw new Error("Could not locate insertion point in template-exercises.js");
  }

  writeFileSync(TEMPLATE_EXERCISES_FILE, updated, "utf-8");
}
