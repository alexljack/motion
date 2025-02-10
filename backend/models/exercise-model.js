import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  equipment: {
    type: String,
    required: true,
  },
  mainTargetMuscle: {
    type: String,
    required: true,
  },
  muscleGroup: {
    type: [String],
    required: true,
  },
});

export default mongoose.model("Exercise", exerciseSchema);
