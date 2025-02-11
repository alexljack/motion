import mongoose from "mongoose";

const workoutLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workout: { type: mongoose.Schema.Types.ObjectId, ref: "UserWorkout" }, // User’s custom workout
  date: { type: Date, default: Date.now },
  exercises: [
    {
      exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise" },
      sets: Number,
      reps: Number,
      weight: Number, // Weight used per exercise
    },
  ],
  notes: String, // User can add workout notes
});

const WorkoutLog = mongoose.model("WorkoutLog", workoutLogSchema);

export default WorkoutLog;
