import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });

import users from "./data/users.js";
import exercises from "./data/exercises.js";
import workouts from "./data/workouts.js";
import User from "./models/user-model.js";
import Exercise from "./models/exercise-model.js";
import Workout from "./models/workout-model.js";
import connectDB from "./config/db.js";

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Exercise.deleteMany();
    await Workout.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleExercises = exercises.map((exercise) => {
      return { ...exercise, user: adminUser };
    });
    const sampleWorkouts = workouts.map((workout) => {
      return { ...workout, user: adminUser };
    });

    const createdExercises = await Exercise.insertMany(sampleExercises);
    const createdWorkouts = await Workout.insertMany(sampleWorkouts);

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
    await Workout.deleteMany();

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
