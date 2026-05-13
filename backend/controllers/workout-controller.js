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

export { getWorkouts, getWorkoutById };
