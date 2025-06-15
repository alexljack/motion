import mongoose from "mongoose";

const personalRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    recordType: {
      type: String,
      enum: ["1rm", "max-reps", "max-weight", "max-volume", "longest-duration"],
      required: true,
    },
    value: { type: Number, required: true },
    unit: { type: String, default: "kg" }, // lbs, kg, seconds, etc.

    // Context of the PR
    achievedDate: { type: Date, default: Date.now },
    workoutSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutSession",
    },
    setDetails: {
      reps: Number,
      weight: Number,
      duration: Number,
    },

    // Previous record for comparison
    previousRecord: {
      value: Number,
      date: Date,
    },
    improvement: { type: Number, default: 0 }, // % improvement

    notes: String,
    verified: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Ensure one record per user/exercise/type combination
personalRecordSchema.index(
  {
    user: 1,
    exercise: 1,
    recordType: 1,
  },
  { unique: true }
);

const PersonalRecord = mongoose.model("PersonalRecord", personalRecordSchema);
export default PersonalRecord;
