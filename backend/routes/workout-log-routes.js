import express from "express";
import {
  logWorkout,
  getUserLogs,
  getLogById,
  updateLog,
  deleteLog,
} from "../controllers/workout-log-controller.js";
import { protect } from "../middleware/auth-middleware.js";

const router = express.Router();

router.route("/").post(protect, logWorkout).get(protect, getUserLogs);

router
  .route("/:id")
  .get(protect, getLogById)
  .put(protect, updateLog)
  .delete(protect, deleteLog);

export default router;
