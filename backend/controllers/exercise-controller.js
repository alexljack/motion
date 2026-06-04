import asyncHandler from "../middleware/async-handler.js";
import Exercise from "../models/exercise-model.js";
import { appendExerciseToSeeder } from "../utils/append-to-exercises-data.js";

// @desc Fetch all approved exercises (system + user-approved)
// @route GET /api/exercises
// @access Public
const getExercises = asyncHandler(async (req, res) => {
  const exercises = await Exercise.find({
    $or: [{ user: null }, { isApproved: true }],
  });
  res.json(exercises);
});

// @desc Fetch exercises pending admin approval
// @route GET /api/exercises/pending
// @access Private/Admin
const getPendingExercises = asyncHandler(async (req, res) => {
  const exercises = await Exercise.find({
    user: { $ne: null },
    isApproved: false,
  }).populate("user", "first_name last_name email");
  res.json(exercises);
});

// @desc Approve a user-submitted exercise and append it to the seeder
// @route PUT /api/exercises/:id/approve
// @access Private/Admin
const approveExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);
  if (!exercise) {
    res.status(404);
    throw new Error("Exercise not found");
  }
  if (!exercise.user) {
    res.status(400);
    throw new Error("Cannot approve a system exercise");
  }

  exercise.isApproved = true;
  await exercise.save();

  try {
    appendExerciseToSeeder(exercise);
  } catch (err) {
    console.error("Warning: could not write to exercises.js —", err.message);
  }

  res.json(exercise);
});

// @desc Delete an exercise (pending or approved user-submitted)
// @route DELETE /api/exercises/:id
// @access Private/Admin
const deleteExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);
  if (!exercise) {
    res.status(404);
    throw new Error("Exercise not found");
  }
  if (!exercise.user) {
    res.status(400);
    throw new Error("Cannot delete a system exercise");
  }

  await exercise.deleteOne();
  res.json({ message: "Exercise removed" });
});

// @desc Create a new exercise
// @route POST /api/exercises
// @access Private
const createExercise = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    difficulty,
    mainTargetMuscle,
    description,
    muscleGroups,
    equipmentNeeded,
    instructions,
    isCompound,
    duration,
  } = req.body;

  const exercise = await Exercise.create({
    user: req.user._id,
    name,
    category,
    difficulty,
    mainTargetMuscle,
    description,
    muscleGroups: muscleGroups || [],
    equipmentNeeded: equipmentNeeded || [],
    instructions,
    isCompound: isCompound || false,
    duration: duration || 0,
  });

  res.status(201).json(exercise);
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

export {
  getExercises,
  getExerciseById,
  createExercise,
  getPendingExercises,
  approveExercise,
  deleteExercise,
};
