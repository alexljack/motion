import asyncHandler from "../middleware/async-handler.js";
import Workout from "../models/workout-template-model.js";
import TemplateExercise from "../models/template-exercise-model.js";

// @desc Fetch all workouts
// @route GET /api/workouts
// @access Public
const getWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({});

  const exercises = await TemplateExercise.find({
    workoutTemplate: { $in: workouts.map((w) => w._id) },
  })
    .populate("exercise", "name category mainTargetMuscle")
    .sort({ orderIndex: 1 });

  const workoutsWithExercises = workouts.map((workout) => ({
    ...workout.toObject(),
    exercises: exercises.filter(
      (ex) => ex.workoutTemplate.toString() === workout._id.toString()
    ),
  }));

  res.json(workoutsWithExercises);
});

// @desc Fetch a workout with its exercises
// @route GET /api/workouts/:id
// @access Public
const getWorkoutById = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);
  if (!workout) {
    res.status(404);
    throw new Error("Workout not found");
  }

  const exercises = await TemplateExercise.find({
    workoutTemplate: workout._id,
  })
    .populate(
      "exercise",
      "name category difficulty mainTargetMuscle muscleGroups equipmentNeeded isCompound image"
    )
    .sort({ orderIndex: 1 });

  res.json({ ...workout.toObject(), exercises });
});

// @desc Create a new workout template
// @route POST /api/workouts
// @access Private
const createWorkout = asyncHandler(async (req, res) => {
  const { name, description, difficultyLevel, estimatedDurationMinutes, isPublic } = req.body;

  const workout = await Workout.create({
    user: req.user._id,
    name,
    description,
    difficultyLevel,
    estimatedDurationMinutes,
    isPublic: isPublic || false,
  });

  res.status(201).json({ ...workout.toObject(), exercises: [] });
});

// @desc Add an exercise to a workout template
// @route POST /api/workouts/:id/exercises
// @access Private
const addExerciseToWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);
  if (!workout) {
    res.status(404);
    throw new Error("Workout not found");
  }
  if (workout.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const existingCount = await TemplateExercise.countDocuments({
    workoutTemplate: workout._id,
  });

  const { exerciseId, targetSets, targetReps, targetWeight, targetDurationSeconds, restSeconds, notes } = req.body;

  const templateExercise = await TemplateExercise.create({
    workoutTemplate: workout._id,
    exercise: exerciseId,
    orderIndex: existingCount,
    targetSets,
    targetReps,
    targetWeight,
    targetDurationSeconds,
    restSeconds,
    notes,
  });

  await templateExercise.populate("exercise", "name category mainTargetMuscle");

  res.status(201).json(templateExercise);
});

export { getWorkouts, getWorkoutById, createWorkout, addExerciseToWorkout };
