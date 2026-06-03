import mongoose from "mongoose";

const fitnessGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    goalType: {
      type: String,
      enum: [
        "strength",
        "weight-loss",
        "weight-gain",
        "endurance",
        "body-composition",
        "habit",
        "performance",
      ],
      required: true,
    },

    // Target metrics
    targetValue: Number,
    targetUnit: String,
    currentValue: { type: Number, default: 0 },

    // For exercise-specific goals
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
    },

    // Timeline
    targetDate: Date,
    startDate: { type: Date, default: Date.now },
    completedDate: Date,

    // Progress tracking
    status: {
      type: String,
      enum: ["active", "completed", "paused", "abandoned"],
      default: "active",
    },
    progress: { type: Number, default: 0, min: 0, max: 100 }, // percentage

    // Motivation
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    reward: String, // what they'll do when they achieve it

    // Tracking
    milestones: [
      {
        description: String,
        targetValue: Number,
        achievedDate: Date,
        achieved: { type: Boolean, default: false },
      },
    ],

    notes: String,
    tags: [String],
  },
  {
    timestamps: true,
  }
);

fitnessGoalSchema.index({ user: 1, status: 1 });
fitnessGoalSchema.index({ user: 1, targetDate: 1 });

const FitnessGoal = mongoose.model("FitnessGoal", fitnessGoalSchema);
export default FitnessGoal;
