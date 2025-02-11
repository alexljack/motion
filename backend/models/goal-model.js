import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: String, // "Strength", "Fat Loss", "Endurance"
    targetDate: Date,
    targetWeight: Number, // e.g., "Bench press 225 lbs"
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Goal", goalSchema);
