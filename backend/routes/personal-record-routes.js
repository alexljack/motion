import express from "express";
const router = express.Router();
import asyncHandler from "../middleware/async-handler.js";
import PersonalRecord from "../models/personal-record-model.js";
import Exercise from "../models/exercise-model.js";
import { protect } from "../middleware/auth-middleware.js";

router.use(protect);

// @desc Get user's personal records
// @route GET /api/personal-records
// @access Private
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { exercise, recordType } = req.query;

    const query = { user: req.user._id };
    if (exercise) query.exercise = exercise;
    if (recordType) query.recordType = recordType;

    const records = await PersonalRecord.find(query)
      .populate("exercise", "name category mainTargetMuscle")
      .populate("workoutSession", "name completedAt")
      .sort({ achievedDate: -1 });

    res.json(records);
  })
);

// @desc Get personal records by exercise
// @route GET /api/personal-records/exercise/:exerciseId
// @access Private
router.get(
  "/exercise/:exerciseId",
  asyncHandler(async (req, res) => {
    const records = await PersonalRecord.find({
      user: req.user._id,
      exercise: req.params.exerciseId,
    })
      .populate("exercise", "name category mainTargetMuscle")
      .populate("workoutSession", "name completedAt")
      .sort({ recordType: 1, achievedDate: -1 });

    res.json(records);
  })
);

// @desc Get heaviest (max-weight) PR for the main compound lifts
// @route GET /api/personal-records/main-lifts
// @access Private
router.get(
  "/main-lifts",
  asyncHandler(async (req, res) => {
    const MAIN_LIFTS = [
      { key: "bench-press",       label: "Bench Press",        name: "bench press" },
      { key: "deadlift",          label: "Deadlift",           name: "deadlifts" },
      { key: "squat",             label: "Squat",              name: "squats" },
      { key: "pull-ups",          label: "Pull Ups",           name: "pull ups" },
      { key: "dips",              label: "Dips",                name: "dips" },
      { key: "overhead-press",    label: "Overhead Press",     name: "overhead press" },
      { key: "barbell-row",       label: "Barbell Row",        name: "barbell row" },
      { key: "incline-bench",     label: "Incline Bench Press", name: "incline bench press" },
      { key: "romanian-deadlift", label: "Romanian Deadlift",  name: "romanian deadlift" },
      { key: "front-squat",       label: "Front Squat",        name: "front squat" },
      { key: "leg-press",         label: "Leg Press",          name: "leg press" },
      { key: "lat-pulldown",      label: "Lat Pulldown",       name: "lat pulldown" },
    ];

    const exercises = await Exercise.find({
      name: { $in: MAIN_LIFTS.map((l) => l.name) },
    }).select("_id name");

    const exerciseMap = Object.fromEntries(exercises.map((e) => [e.name, e._id]));

    const exerciseIds = exercises.map((e) => e._id);
    const records = await PersonalRecord.find({
      user: req.user._id,
      exercise: { $in: exerciseIds },
      recordType: "max-weight",
    }).select("exercise value achievedDate");

    const prMap = Object.fromEntries(records.map((r) => [r.exercise.toString(), r.value]));

    const result = MAIN_LIFTS.map((lift) => {
      const exerciseId = exerciseMap[lift.name];
      const weight = exerciseId ? (prMap[exerciseId.toString()] ?? null) : null;
      return { key: lift.key, label: lift.label, weight };
    });

    res.json(result);
  })
);

// @desc Get recent personal records
// @route GET /api/personal-records/recent
// @access Private
router.get(
  "/recent",
  asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;

    const records = await PersonalRecord.find({ user: req.user._id })
      .populate("exercise", "name category mainTargetMuscle")
      .populate("workoutSession", "name completedAt")
      .sort({ achievedDate: -1 })
      .limit(parseInt(limit));

    res.json(records);
  })
);

export default router;
