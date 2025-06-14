import mongoose from "mongoose";

const bodyMeasurementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    measurementType: {
      type: String,
      enum: [
        "weight",
        "body-fat",
        "muscle-mass",
        "chest",
        "waist",
        "hips",
        "bicep",
        "thigh",
        "neck",
        "forearm",
        "calf",
      ],
      required: true,
    },
    value: { type: Number, required: true },
    unit: {
      type: String,
      required: true,
      enum: ["lbs", "kg", "inches", "cm", "percent"],
    },
    measuredDate: { type: Date, default: Date.now },

    // Context
    timeOfDay: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
    },
    conditions: String, // 'fasted', 'post-workout', etc.
    notes: String,

    // Photo reference
    photoUrl: String,

    // Calculated fields
    previousValue: Number,
    change: Number, // difference from previous measurement
    changePercent: Number,
  },
  {
    timestamps: true,
  }
);

bodyMeasurementSchema.index({ user: 1, measurementType: 1, measuredDate: -1 });

// Calculate changes from previous measurement
bodyMeasurementSchema.pre("save", async function (next) {
  if (this.isNew) {
    const previousMeasurement = await this.constructor
      .findOne({
        user: this.user,
        measurementType: this.measurementType,
        measuredDate: { $lt: this.measuredDate },
      })
      .sort({ measuredDate: -1 });

    if (previousMeasurement) {
      this.previousValue = previousMeasurement.value;
      this.change = this.value - previousMeasurement.value;
      this.changePercent = (
        (this.change / previousMeasurement.value) *
        100
      ).toFixed(2);
    }
  }
  next();
});

const BodyMeasurement = mongoose.model(
  "BodyMeasurement",
  bodyMeasurementSchema
);
export default BodyMeasurement;
