import mongoose from "mongoose";

const sleepLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true }, // the night this sleep belongs to
    bedTime: { type: Date, required: true },
    wakeTime: { type: Date, required: true },
    durationMinutes: { type: Number }, // calculated on save
    quality: {
      type: String,
      enum: ["poor", "fair", "good", "excellent"],
      required: true,
    },
    notes: String,
  },
  { timestamps: true }
);

sleepLogSchema.index({ user: 1, date: -1 });

sleepLogSchema.pre("save", function (next) {
  if (this.bedTime && this.wakeTime) {
    this.durationMinutes = Math.round(
      (this.wakeTime - this.bedTime) / 1000 / 60
    );
  }
  next();
});

const SleepLog = mongoose.model("SleepLog", sleepLogSchema);
export default SleepLog;
