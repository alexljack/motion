import express from "express";
const router = express.Router();
// import exercises from "..//data/exercises.js";
import asyncHandler from "../middleware/async-handler.js";
import Exercise from "../models/exercise-model.js";

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const exercises = await Exercise.find({});
    res.json(exercises);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const exercise = await Exercise.findById(req.params.id);
    if (exercise) {
      res.json(exercise);
    }
    res.status(404).json({ message: "Exercise not found" });
    // const exercise = exercises.find((w) => w._id === req.params.id);
    res.json(exercise);
  })
);

export default router;
