import express from "express";
const router = express.Router();
import exercises from "..//data/exercises.js";

router.get("/", (req, res) => {
  res.json(exercises);
});

router.get("/:id", (req, res) => {
  const exercise = exercises.find((w) => w._id === req.params.id);
  res.json(exercise);
});

export default router;
