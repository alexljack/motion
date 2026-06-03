import mongoose from "mongoose";

const templateExerciseSchema = new mongoose.Schema({
  workoutTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkoutTemplate",
    required: true,
  },
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  orderIndex: { type: Number, required: true },
  targetSets: Number,
  targetReps: Number,
  targetWeight: Number,
  targetDurationSeconds: Number,
  restSeconds: Number,
  notes: String,
});

const ExerciseTemplate = mongoose.model(
  "ExerciseTemplate",
  templateExerciseSchema
);
export default ExerciseTemplate;
