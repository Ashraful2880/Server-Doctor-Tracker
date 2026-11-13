import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import { IUser } from "../../utils/InterfaceAll";

const userSchema = new Schema<IUser>(
  {
    name: {
      trim: true,
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      trim: true,
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
