import mongoose, { Schema } from "mongoose";
import { IDoctor } from "../../utils/InterfaceAll";

const doctorSchema = new Schema<IDoctor>(
  {
    name: {
      trim: true,
      type: String,
      required: [true, "Doctor name is required"],
    },
    specialization: {
      trim: true,
      type: String,
      required: [true, "Specialization is required"],
    },
    hospital: {
      trim: true,
      type: String,
      required: [true, "Hospital is required"],
    },
    phone: {
      trim: true,
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      trim: true,
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Email is required"],
    },
  },
  {
    timestamps: true,
  },
);

doctorSchema.index({ specialization: 1, createdAt: -1 });
doctorSchema.index({ hospital: 1, createdAt: -1 });
doctorSchema.index({ createdAt: -1 });

export const Doctor = mongoose.model<IDoctor>("Doctor", doctorSchema);
