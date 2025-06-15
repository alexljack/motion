import mongoose from "mongoose";

const exerciseSetSchema = new mongoose.Schema({
  workoutSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkoutSession",
    required: true,
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  setNumber: { type: Number, required: true },
  reps: { type: Number, default: 0 },
  weight: { type: Number, default: 0 }, // in lbs or kg
  durationInSeconds: { type: Number, default: 0 }, // in seconds for time-based exercises
  distance: { type: Number, default: 0 }, // for cardio exercises
  rpe: { type: Number, min: 1, max: 10 }, // Rate of Perceived Exertion
  restTime: { type: Number, default: 0 }, // rest time in seconds
  completed: { type: Boolean, default: false },
  notes: String,
});

const ExerciseSet = mongoose.model("ExerciseSet", exerciseSetSchema);
export default ExerciseSet;
