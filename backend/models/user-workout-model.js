import mongoose, { set } from "mongoose";

const userWorkoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  exercises: [
    {
      exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise" },
      sets: [
        {
          repetitions: { type: Number, required: true },
          weight: { type: Number, required: true },
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("UserWorkout", userWorkoutSchema);
