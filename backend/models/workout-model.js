import mongoose from "mongoose";

// const setsSchema = new mongoose.Schema({
//   repetitions: { type: Number, required: true },
//   weight: { type: Number, required: true },
// });

const workoutSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: true },
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
    rating: { type: Number, required: true },
    // sets: [setsSchema],
    type: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Workout", workoutSchema);
