import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    date_of_birth: Date,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    height: Number,
    weight: Number,
    reset_password_token: String,
    reset_password_expires: Date,
    preferences: {
      units: { type: String, enum: ["kg", "lbs"], default: "kg" },
      measurement_system: {
        type: String,
        enum: ["metric", "imperial"],
        default: "metric",
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      language: {
        type: String,
        enum: [
          "en-GB",
          "en-US",
          "es-ES",
          "fr-FR",
          "de-DE",
          "it-IT",
          "nl-NL",
          "pt-PT",
        ],
        default: "en-GB",
      },
      week_starts_on: {
        type: String,
        enum: ["monday", "sunday"],
        default: "monday",
      },
      height_unit: { type: String, enum: ["cm", "ft_in"], default: "cm" },
      orm_formula: {
        type: String,
        enum: ["epley", "brzycki"],
        default: "epley",
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 'pre' happens before saving to database. 'post' would be after
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  // salt and hash password received in user-controller
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
