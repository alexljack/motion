import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    goals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goal",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
