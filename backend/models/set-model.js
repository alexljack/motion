import mongoose from "mongoose";

const setsSchema = new mongoose.Schema({
  repetitions: { type: Number, required: true },
  weight: { type: Number, required: true },
});

export default mongoose.model("Set", setsSchema);
