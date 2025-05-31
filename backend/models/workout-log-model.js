import mongoose from "mongoose";

const exerciseSetSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  // For strength exercises
  sets: [
    {
      reps: Number,
      weight: Number,
      // Optional: you might want to track other metrics
      completed: { type: Boolean, default: true },
    },
  ],
  // For cardio exercises
  duration: Number, // in minutes
  distance: Number, // e.g., in kilometers or miles
  notes: String,
});

const workoutLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    exercises: [exerciseSetSchema],
    totalDuration: Number, // in minutes
    notes: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    }, // Optional: let users rate their workout
    feelingScore: {
      type: Number,
      min: 1,
      max: 10,
    }, // Optional: track how they felt
  },
  {
    timestamps: true,
  }
);

const WorkoutLog = mongoose.model("WorkoutLog", workoutLogSchema);

export default WorkoutLog;
