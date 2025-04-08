// backend/controllers/workout-log-controller.js
import asyncHandler from "../middleware/async-handler.js";
import WorkoutLog from "../models/workout-log-model.js";

// @desc    Log a completed workout
// @route   POST /api/logs
// @access  Private
const logWorkout = asyncHandler(async (req, res) => {
  const {
    workoutId,
    date,
    exercises,
    totalDuration,
    notes,
    rating,
    feelingScore,
  } = req.body;

  const workoutLog = new WorkoutLog({
    user: req.user._id,
    workout: workoutId,
    date: date ? new Date(date) : new Date(),
    exercises,
    totalDuration,
    notes,
    rating,
    feelingScore,
  });

  const createdLog = await workoutLog.save();

  // If this workout was part of a schedule, you might want to mark it as completed
  // This could be done here or handled separately

  res.status(201).json(createdLog);
});

// @desc    Get user's workout logs
// @route   GET /api/logs
// @access  Private
const getUserLogs = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  let query = { user: req.user._id };

  // Add date range filter if provided
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const logs = await WorkoutLog.find(query)
    .populate("workout")
    .populate("exercises.exercise")
    .sort("-date");

  res.json(logs);
});

// @desc    Get a specific workout log
// @route   GET /api/logs/:id
// @access  Private
const getLogById = asyncHandler(async (req, res) => {
  const log = await WorkoutLog.findById(req.params.id)
    .populate("workout")
    .populate("exercises.exercise");

  if (!log) {
    res.status(404);
    throw new Error("Workout log not found");
  }

  // Make sure user owns this log
  if (log.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.json(log);
});

// @desc    Update a workout log
// @route   PUT /api/logs/:id
// @access  Private
const updateLog = asyncHandler(async (req, res) => {
  const log = await WorkoutLog.findById(req.params.id);

  if (!log) {
    res.status(404);
    throw new Error("Workout log not found");
  }

  // Make sure user owns this log
  if (log.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const { exercises, totalDuration, notes, rating, feelingScore } = req.body;

  log.exercises = exercises || log.exercises;
  log.totalDuration = totalDuration || log.totalDuration;
  log.notes = notes || log.notes;
  log.rating = rating || log.rating;
  log.feelingScore = feelingScore || log.feelingScore;

  const updatedLog = await log.save();

  res.json(updatedLog);
});

// @desc    Delete a workout log
// @route   DELETE /api/logs/:id
// @access  Private
const deleteLog = asyncHandler(async (req, res) => {
  const log = await WorkoutLog.findById(req.params.id);

  if (!log) {
    res.status(404);
    throw new Error("Workout log not found");
  }

  // Make sure user owns this log
  if (log.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await log.deleteOne();

  res.json({ message: "Workout log removed" });
});

export { logWorkout, getUserLogs, getLogById, updateLog, deleteLog };
