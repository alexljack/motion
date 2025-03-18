import mongoose from "mongoose";
import bcrypt from "bcryptjs";
// import bcrypt from "bcryptjs/dist/bcrypt";

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
