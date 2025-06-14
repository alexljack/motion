import mongoose from "mongoose";

const templateExerciseSchema = new mongoose.Schema({
  workout_template_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkoutTemplate",
    required: true,
  },
  exercise_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  order_index: { type: Number, required: true },
  target_sets: Number,
  target_reps: Number,
  target_weight: Number,
  target_duration_seconds: Number,
  rest_seconds: Number,
  notes: String,
});

const ExerciseTemplate = mongoose.model(
  "ExerciseTemplate",
  templateExerciseSchema
);
export default ExerciseTemplate;
