// backend/controllers/workout-session-controller.js
import asyncHandler from "../middleware/async-handler.js";
import WorkoutSession from "../models/workout-session-model.js";
import Exercise from "../models/exercise-model.js";
import PersonalRecord from "../models/personal-record-model.js";

// @desc Create a new workout session
// @route POST /api/workout-sessions
// @access Private
const createWorkoutSession = asyncHandler(async (req, res) => {
  const { name, workoutTemplateId, exercises } = req.body;

  const workoutSession = await WorkoutSession.create({
    user: req.user._id,
    name,
    workoutTemplateId,
    exercises: exercises || [],
    status: "planned",
  });

  await workoutSession.populate(
    "exercises.exercise",
    "name category mainTargetMuscle"
  );

  res.status(201).json(workoutSession);
});

// @desc Start a workout session
// @route PUT /api/workout-sessions/:id/start
// @access Private
const startWorkoutSession = asyncHandler(async (req, res) => {
  const workoutSession = await WorkoutSession.findById(req.params.id);

  if (!workoutSession) {
    res.status(404);
    throw new Error("Workout session not found");
  }

  if (workoutSession.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to modify this workout");
  }

  workoutSession.status = "in-progress";
  workoutSession.startedAt = new Date();

  await workoutSession.save();

  res.json(workoutSession);
});

// @desc Complete a workout session
// @route PUT /api/workout-sessions/:id/complete
// @access Private
const completeWorkoutSession = asyncHandler(async (req, res) => {
  const { rating, feeling, notes } = req.body;

  const workoutSession = await WorkoutSession.findById(req.params.id);

  if (!workoutSession) {
    res.status(404);
    throw new Error("Workout session not found");
  }

  if (workoutSession.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to modify this workout");
  }

  workoutSession.status = "completed";
  workoutSession.completedAt = new Date();
  workoutSession.rating = rating;
  workoutSession.feeling = feeling;
  workoutSession.notes = notes;

  await workoutSession.save();

  // Check for new personal records
  await checkForPersonalRecords(workoutSession);

  res.json(workoutSession);
});

// @desc Add/Update exercise set in workout session
// @route PUT /api/workout-sessions/:id/exercises/:exerciseIndex/sets
// @access Private
const updateExerciseSet = asyncHandler(async (req, res) => {
  const { exerciseIndex } = req.params;
  const { setData } = req.body; // { setNumber, reps, weight, completed, etc. }

  const workoutSession = await WorkoutSession.findById(req.params.id);

  if (!workoutSession) {
    res.status(404);
    throw new Error("Workout session not found");
  }

  if (workoutSession.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to modify this workout");
  }

  const exerciseSet = workoutSession.exercises[exerciseIndex];
  if (!exerciseSet) {
    res.status(404);
    throw new Error("Exercise not found in workout");
  }

  // Find existing set or create new one
  const existingSetIndex = exerciseSet.sets.findIndex(
    (set) => set.setNumber === setData.setNumber
  );

  if (existingSetIndex >= 0) {
    // Update existing set
    Object.assign(exerciseSet.sets[existingSetIndex], setData);
  } else {
    // Add new set
    exerciseSet.sets.push(setData);
  }

  await workoutSession.save();

  res.json(workoutSession);
});

// @desc Get user's workout sessions
// @route GET /api/workout-sessions
// @access Private
const getUserWorkoutSessions = asyncHandler(async (req, res) => {
  const { status, limit = 20, page = 1, startDate, endDate } = req.query;

  const query = { user: req.user._id };

  if (status) {
    query.status = status;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const workoutSessions = await WorkoutSession.find(query)
    .populate("exercises.exercise", "name category mainTargetMuscle")
    .populate("workoutTemplateId", "name")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await WorkoutSession.countDocuments(query);

  res.json({
    workoutSessions,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalWorkouts: total,
    },
  });
});

// @desc Get workout session by ID
// @route GET /api/workout-sessions/:id
// @access Private
const getWorkoutSessionById = asyncHandler(async (req, res) => {
  const workoutSession = await WorkoutSession.findById(req.params.id)
    .populate("exercises.exercise", "name category mainTargetMuscle equipmentNeeded")
    .populate("workoutTemplateId", "name description")
    .populate("user", "first_name last_name email");

  if (!workoutSession) {
    res.status(404);
    throw new Error("Workout session not found");
  }

  if (workoutSession.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to view this workout");
  }

  res.json(workoutSession);
});

// @desc Delete workout session
// @route DELETE /api/workout-sessions/:id
// @access Private
const deleteWorkoutSession = asyncHandler(async (req, res) => {
  const workoutSession = await WorkoutSession.findById(req.params.id);

  if (!workoutSession) {
    res.status(404);
    throw new Error("Workout session not found");
  }

  if (workoutSession.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this workout");
  }

  await WorkoutSession.findByIdAndDelete(req.params.id);

  res.json({ message: "Workout session deleted successfully" });
});

// @desc Get workout statistics
// @route GET /api/workout-sessions/stats
// @access Private
const getWorkoutStats = asyncHandler(async (req, res) => {
  const { period = "30d" } = req.query;

  let dateFilter = {};
  const now = new Date();

  switch (period) {
    case "7d":
      dateFilter = { $gte: new Date(now.setDate(now.getDate() - 7)) };
      break;
    case "30d":
      dateFilter = { $gte: new Date(now.setDate(now.getDate() - 30)) };
      break;
    case "90d":
      dateFilter = { $gte: new Date(now.setDate(now.getDate() - 90)) };
      break;
    case "1y":
      dateFilter = { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
      break;
  }

  const stats = await WorkoutSession.aggregate([
    {
      $match: {
        user: req.user._id,
        status: "completed",
        completedAt: dateFilter,
      },
    },
    {
      $group: {
        _id: null,
        totalWorkouts: { $sum: 1 },
        totalSets: { $sum: "$totalSets" },
        totalReps: { $sum: "$totalReps" },
        totalWeight: { $sum: "$totalWeight" },
        avgDuration: { $avg: "$duration" },
        avgRating: { $avg: "$rating" },
        avgRpe: { $avg: "$avgRpe" },
      },
    },
  ]);

  const result = stats[0] || {
    totalWorkouts: 0,
    totalSets: 0,
    totalReps: 0,
    totalWeight: 0,
    avgDuration: 0,
    avgRating: 0,
    avgRpe: 0,
  };

  res.json(result);
});

// Helper function to check for personal records
const checkForPersonalRecords = async (workoutSession) => {
  for (const exerciseSet of workoutSession.exercises) {
    if (!exerciseSet.sets || exerciseSet.sets.length === 0) continue;

    const completedSets = exerciseSet.sets.filter((set) => set.completed);
    if (completedSets.length === 0) continue;

    const maxWeight = Math.max(...completedSets.map((set) => set.weight || 0));
    const maxReps = Math.max(...completedSets.map((set) => set.reps || 0));
    const totalVolume = completedSets.reduce(
      (sum, set) => sum + (set.weight || 0) * (set.reps || 0),
      0
    );

    // Check for 1RM (estimated using Epley formula: weight * (1 + reps/30))
    const estimated1RM = completedSets.reduce((max, set) => {
      const estimated = (set.weight || 0) * (1 + (set.reps || 0) / 30);
      return Math.max(max, estimated);
    }, 0);

    // Check existing records
    const existing1RM = await PersonalRecord.findOne({
      user: workoutSession.user,
      exercise: exerciseSet.exercise,
      recordType: "1rm",
    });

    const existingMaxWeight = await PersonalRecord.findOne({
      user: workoutSession.user,
      exercise: exerciseSet.exercise,
      recordType: "max-weight",
    });

    const existingMaxVolume = await PersonalRecord.findOne({
      user: workoutSession.user,
      exercise: exerciseSet.exercise,
      recordType: "max-volume",
    });

    // Update or create records if new PRs achieved
    if (!existing1RM || estimated1RM > existing1RM.value) {
      await PersonalRecord.findOneAndUpdate(
        {
          user: workoutSession.user,
          exercise: exerciseSet.exercise,
          recordType: "1rm",
        },
        {
          value: estimated1RM,
          previousRecord: existing1RM
            ? {
                value: existing1RM.value,
                date: existing1RM.achievedDate,
              }
            : null,
          achievedDate: new Date(),
          workoutSession: workoutSession._id,
          improvement: existing1RM
            ? (
                ((estimated1RM - existing1RM.value) / existing1RM.value) *
                100
              ).toFixed(2)
            : 0,
        },
        { upsert: true, new: true }
      );
    }

    if (!existingMaxWeight || maxWeight > existingMaxWeight.value) {
      await PersonalRecord.findOneAndUpdate(
        {
          user: workoutSession.user,
          exercise: exerciseSet.exercise,
          recordType: "max-weight",
        },
        {
          value: maxWeight,
          previousRecord: existingMaxWeight
            ? {
                value: existingMaxWeight.value,
                date: existingMaxWeight.achievedDate,
              }
            : null,
          achievedDate: new Date(),
          workoutSession: workoutSession._id,
          improvement: existingMaxWeight
            ? (
                ((maxWeight - existingMaxWeight.value) /
                  existingMaxWeight.value) *
                100
              ).toFixed(2)
            : 0,
        },
        { upsert: true, new: true }
      );
    }

    if (!existingMaxVolume || totalVolume > existingMaxVolume.value) {
      await PersonalRecord.findOneAndUpdate(
        {
          user: workoutSession.user,
          exercise: exerciseSet.exercise,
          recordType: "max-volume",
        },
        {
          value: totalVolume,
          previousRecord: existingMaxVolume
            ? {
                value: existingMaxVolume.value,
                date: existingMaxVolume.achievedDate,
              }
            : null,
          achievedDate: new Date(),
          workoutSession: workoutSession._id,
          improvement: existingMaxVolume
            ? (
                ((totalVolume - existingMaxVolume.value) /
                  existingMaxVolume.value) *
                100
              ).toFixed(2)
            : 0,
        },
        { upsert: true, new: true }
      );
    }
  }
};

export {
  createWorkoutSession,
  startWorkoutSession,
  completeWorkoutSession,
  updateExerciseSet,
  getUserWorkoutSessions,
  getWorkoutSessionById,
  deleteWorkoutSession,
  getWorkoutStats,
};
