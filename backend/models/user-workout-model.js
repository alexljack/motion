import mongoose from "mongoose";

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
      repetitions: { type: Number, required: true },
      sets: { type: Number, required: true },
      weight: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  notes: String,
  rating: { type: Number, required: true },
});

const UserWorkout = mongoose.model("UserWorkout", userWorkoutSchema);

export default UserWorkout;
