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
    // exercises: [
    //   {
    //     name: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise" },
    //     repetitions: { type: Number, required: true },
    //     sets: { type: Number, required: true },
    //     weight: { type: Number, required: true },
    //   },
    // ],
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
    rating: { type: Number, required: true },
    // sets: [setsSchema],
    type: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
