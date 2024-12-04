import express from "express";
import workouts from "./data/workouts.js";

const port = 8000;

const app = express();

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.get("/api/workouts", (req, res) => {
  res.json(workouts);
});

app.get("/api/workouts/:id", (req, res) => {
  const workout = workouts.find((w) => w._id === req.params.id);
  res.json(workout);
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
