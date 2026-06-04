import express from "express";
const router = express.Router();

import {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  getPendingWorkouts,
  approveWorkout,
  deleteWorkout,
} from "../controllers/workout-controller.js";
import { protect, admin } from "../middleware/auth-middleware.js";

router.route("/").get(getWorkouts).post(protect, createWorkout);
router.route("/pending").get(protect, admin, getPendingWorkouts);
router.route("/:id").get(getWorkoutById).put(protect, admin, updateWorkout).delete(protect, admin, deleteWorkout);
router.route("/:id/approve").put(protect, admin, approveWorkout);
router.route("/:id/exercises").post(protect, addExerciseToWorkout);
router.route("/:id/exercises/:teId").delete(protect, admin, removeExerciseFromWorkout);

export default router;
