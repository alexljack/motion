import mongoose from "mongoose";

const workoutTemplateSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    description: String,
    difficulty_level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    estimated_duration_minutes: Number,
    is_public: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const WorkoutTemplate = mongoose.model(
  "WorkoutTemplate",
  workoutTemplateSchema
);

export default WorkoutTemplate;
