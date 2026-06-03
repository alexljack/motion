import mongoose from "mongoose";

const nutritionLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 }, // grams
    carbs: { type: Number, default: 0 },   // grams
    fat: { type: Number, default: 0 },     // grams
    notes: String,
  },
  { timestamps: true }
);

nutritionLogSchema.index({ user: 1, date: -1 });

const NutritionLog = mongoose.model("NutritionLog", nutritionLogSchema);
export default NutritionLog;
