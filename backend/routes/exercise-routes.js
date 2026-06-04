import express from "express";
const router = express.Router();
import {
  getExercises,
  getExerciseById,
  createExercise,
  getPendingExercises,
  approveExercise,
  deleteExercise,
} from "../controllers/exercise-controller.js";
import { protect, admin } from "../middleware/auth-middleware.js";

router.route("/").get(getExercises).post(protect, createExercise);
router.route("/pending").get(protect, admin, getPendingExercises);
router.route("/:id").get(getExerciseById).delete(protect, admin, deleteExercise);
router.route("/:id/approve").put(protect, admin, approveExercise);

export default router;
