import asyncHandler from "../middleware/async-handler.js";
import Workout from "../models/workout-model.js";

// @desc Fetch all workouts
// @route GET /api/workouts
// @access Public
const getWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({});
  res.json(workouts);
});

// @desc Fetch a workout
// @route GET /api/workouts/:id
// @access Public
const getWorkoutById = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);
  if (workout) {
    res.json(workout);
  } else {
    res.status(404);
    throw new Error("Workout not found");
  }
});

export { getWorkouts, getWorkoutById };
