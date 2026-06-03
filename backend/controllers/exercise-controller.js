import asyncHandler from "../middleware/async-handler.js";
import Exercise from "../models/exercise-model.js";

// @desc Fetch all exercises
// @route GET /api/exercises
// @access Public
const getExercises = asyncHandler(async (req, res) => {
  const exercises = await Exercise.find({});
  res.json(exercises);
});

// @desc Fetch an exercise
// @route GET /api/exercises/:id
// @access Public
const getExerciseById = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);
  if (exercise) {
    res.json(exercise);
  } else {
    res.status(404);
    throw new Error("Exercise not found");
  }
});

export { getExerciseById, getExercises };
