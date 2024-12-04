import express from "express";
import dotenv from "dotenv";

import workouts from "./data/workouts.js";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const port = process.env.PORT || 9000;

const app = express();

// console.log("PORT:", process.env.PORT, "ENV:", process.env.NODE_ENV);
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
