import express from "express";
const router = express.Router();
import asyncHandler from "../middleware/async-handler.js";
import NutritionLog from "../models/nutrition-log-model.js";
import { protect } from "../middleware/auth-middleware.js";

router.use(protect);

// @desc Log nutrition
// @route POST /api/nutrition-logs
// @access Private
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const log = await NutritionLog.create({ ...req.body, user: req.user._id });
    res.status(201).json(log);
  })
);

// @desc Get user's nutrition logs
// @route GET /api/nutrition-logs
// @access Private
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { startDate, endDate, limit = 30 } = req.query;

    const query = { user: req.user._id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const logs = await NutritionLog.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json(logs);
  })
);

// @desc Get nutrition log by ID
// @route GET /api/nutrition-logs/:id
// @access Private
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const log = await NutritionLog.findById(req.params.id);

    if (!log) {
      res.status(404);
      throw new Error("Nutrition log not found");
    }
    if (log.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized");
    }

    res.json(log);
  })
);

// @desc Update nutrition log
// @route PUT /api/nutrition-logs/:id
// @access Private
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const log = await NutritionLog.findById(req.params.id);

    if (!log) {
      res.status(404);
      throw new Error("Nutrition log not found");
    }
    if (log.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized");
    }

    Object.assign(log, req.body);
    await log.save();
    res.json(log);
  })
);

// @desc Delete nutrition log
// @route DELETE /api/nutrition-logs/:id
// @access Private
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const log = await NutritionLog.findById(req.params.id);

    if (!log) {
      res.status(404);
      throw new Error("Nutrition log not found");
    }
    if (log.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized");
    }

    await NutritionLog.findByIdAndDelete(req.params.id);
    res.json({ message: "Nutrition log deleted" });
  })
);

export default router;
