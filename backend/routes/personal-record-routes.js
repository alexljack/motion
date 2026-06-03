import express from "express";
const router = express.Router();
import asyncHandler from "../middleware/async-handler.js";
import PersonalRecord from "../models/personal-record-model.js";
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
