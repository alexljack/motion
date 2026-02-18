import mongoose from "mongoose";

const workoutTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    description: String,
    difficultyLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    estimatedDurationMinutes: Number,
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const WorkoutTemplate = mongoose.model(
  "WorkoutTemplate",
  workoutTemplateSchema
);

export default WorkoutTemplate;
