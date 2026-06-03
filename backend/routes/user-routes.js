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
  getUserPreferences,
  updateUserPreferences,
} from "../controllers/user-controller.js";
import { admin, protect } from "../middleware/auth-middleware.js";

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/logout", logoutUser);
router.post("/auth", authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/preferences")
  .get(protect, getUserPreferences)
  .patch(protect, updateUserPreferences);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
