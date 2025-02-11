import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import exercises from "./data/exercises.js";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const port = process.env.PORT || 9000;
connectDB();

const app = express();

// console.log("PORT:", process.env.PORT, "ENV:", process.env.NODE_ENV);
app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.get("/api/exercises", (req, res) => {
  res.json(exercises);
});

app.get("/api/exercises/:id", (req, res) => {
  const exercise = exercises.find((w) => w._id === req.params.id);
  res.json(exercise);
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
