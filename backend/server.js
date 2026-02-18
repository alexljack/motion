import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/error-middleware.js";
import exerciseRoutes from "./routes/exercise-routes.js";
import userRoutes from "./routes/user-routes.js";
import workoutRoutes from "./routes/workout-routes.js";
import workoutSessionRoutes from "./routes/workout-session-routes.js";
import personalRecordRoutes from "./routes/personal-record-routes.js";
import bodyMeasurementRoutes from "./routes/body-measurement-routes.js";
import fitnessGoalRoutes from "./routes/fitness-goal-routes.js";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const port = process.env.PORT || 8000;
connectDB();

const app = express();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

// console.log("PORT:", process.env.PORT, "ENV:", process.env.NODE_ENV);
app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use("/api/exercises", exerciseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/workout-sessions", workoutSessionRoutes);
app.use("/api/personal-records", personalRecordRoutes);
app.use("/api/body-measurements", bodyMeasurementRoutes);
app.use("/api/goals", fitnessGoalRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
