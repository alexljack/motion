import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = join(__dirname, "../data/exercises.js");

export function appendExerciseToSeeder(exercise) {
  const content = readFileSync(DATA_FILE, "utf-8");

  const lines = [
    `  {`,
    `    name: ${JSON.stringify(exercise.name)},`,
    `    category: ${JSON.stringify(exercise.category || "strength")},`,
  ];
  if (exercise.description) {
    lines.push(`    description: ${JSON.stringify(exercise.description)},`);
  }
  lines.push(`    duration: ${exercise.duration || 0},`);
  lines.push(`    difficulty: ${JSON.stringify(exercise.difficulty)},`);
  lines.push(`    equipmentNeeded: ${JSON.stringify(exercise.equipmentNeeded || [])},`);
  lines.push(`    muscleGroups: ${JSON.stringify(exercise.muscleGroups || [])},`);
  lines.push(`    mainTargetMuscle: ${JSON.stringify(exercise.mainTargetMuscle)},`);
  lines.push(`    isCompound: ${exercise.isCompound || false},`);
  lines.push(`  }`);

  const entry = lines.join("\n");

  // Insert the new entry before the closing `];`
  const updated = content.replace(
    /\n\];\n\nexport default exercises;/,
    `\n${entry},\n];\n\nexport default exercises;`
  );

  if (updated === content) {
    throw new Error("Could not locate insertion point in exercises.js");
  }

  writeFileSync(DATA_FILE, updated, "utf-8");
}
