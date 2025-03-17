import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  getUserProfile,
  getUserById,
  getUsers,
  deleteUser,
  updateUser,
} from "../controllers/user-controller.js";

router.route("/").get(getUsers);
router.route("/").get(getUsers);
router.route("/users").get(getExercises);
router.route("/users/:id").get(getExercises);
router.route("/:id").get(getExerciseById);

export default router;
