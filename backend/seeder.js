import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });

import users from "./data/users.js";
import exercises from "./data/exercises.js";
import workouts from "./data/workouts.js";
import templateExercises from "./data/template-exercises.js";
import User from "./models/user-model.js";
import Exercise from "./models/exercise-model.js";
import WorkoutTemplate from "./models/workout-template-model.js";
import TemplateExercise from "./models/template-exercise-model.js";
import connectDB from "./config/db.js";

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Exercise.deleteMany();
    await WorkoutTemplate.deleteMany();
    await TemplateExercise.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const createdExercises = await Exercise.insertMany(exercises);

    const exerciseMap = {};
    createdExercises.forEach((exercise) => {
      exerciseMap[exercise.name] = exercise._id;
    });

    const sampleWorkouts = workouts.map((workout) => {
      return {
        ...workout,
        user: adminUser,
      };
    });

    const createdWorkouts = await WorkoutTemplate.insertMany(sampleWorkouts);

    const workoutMap = {};
    createdWorkouts.forEach((workout) => {
      workoutMap[workout.name] = workout._id;
    });

    const templateExercisesList = [];
    for (const [workoutName, exercises] of Object.entries(templateExercises)) {
      const workoutId = workoutMap[workoutName];
      if (workoutId) {
        exercises.forEach((exercise) => {
          const exerciseId = exerciseMap[exercise.exerciseName];
          if (exerciseId) {
            templateExercisesList.push({
              workoutTemplate: workoutId,
              exercise: exerciseId,
              orderIndex: exercise.orderIndex,
              targetSets: exercise.targetSets,
              targetReps: exercise.targetReps,
              targetWeight: exercise.targetWeight,
              targetDurationSeconds: exercise.targetDurationSeconds,
              restSeconds: exercise.restSeconds,
              notes: exercise.notes,
            });
          }
        });
      }
    }

    await TemplateExercise.insertMany(templateExercisesList);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Exercise.deleteMany();
    await WorkoutTemplate.deleteMany();
    await TemplateExercise.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "--destroy") {
  destroyData();
} else {
  importData();
}
