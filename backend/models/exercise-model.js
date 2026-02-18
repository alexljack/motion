import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    image: String,
    category: {
      type: String,
      enum: ["strength", "cardio", "flexibility", "balance", "sports"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
    },
    duration: { type: Number, required: true },
    mainTargetMuscle: { type: String, required: true },
    muscleGroups: [String],
    equipmentNeeded: [String],
    instructions: String,
    isCompound: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
