import express from "express";
const router = express.Router();

import {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  addExerciseToWorkout,
} from "../controllers/workout-controller.js";
import { protect } from "../middleware/auth-middleware.js";

router.route("/").get(getWorkouts).post(protect, createWorkout);
router.route("/:id").get(getWorkoutById);
router.route("/:id/exercises").post(protect, addExerciseToWorkout);

export default router;
