import express from "express";
const router = express.Router();

import { getWorkouts } from "../controllers/workout-controller.js";

router.route("/").get(getWorkouts);

export default router;
