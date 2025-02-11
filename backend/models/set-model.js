import mongoose from "mongoose";

const setsSchema = new mongoose.Schema({
  repetitions: { type: Number, required: true },
  weight: { type: Number, required: true },
});

const Set = mongoose.model("Set", setsSchema);

export default Set;
