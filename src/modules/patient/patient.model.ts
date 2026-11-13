import mongoose, { Schema } from "mongoose";
import { IPatient } from "../../utils/InterfaceAll";

const patientSchema = new Schema<IPatient>(
  {
    name: {
      trim: true,
      type: String,
      required: [true, "Patient name is required"],
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      required: [true, "Age is required"],
      max: [150, "Age must be realistic"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },
    phone: {
      trim: true,
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      trim: true,
      type: String,
      lowercase: true,
    },
    condition: {
      trim: true,
      type: String,
      required: [true, "Patient condition is required"],
    },
    notes: {
      trim: true,
      type: String,
    },
    doctorId: {
      ref: "Doctor",
      type: Schema.Types.ObjectId,
      required: [true, "Assigned doctor is required"],
    },
  },
  {
    timestamps: true,
  },
);

patientSchema.index({ doctorId: 1, createdAt: -1 });
patientSchema.index({ condition: 1, createdAt: -1 });
patientSchema.index({ createdAt: -1 });

export const Patient = mongoose.model<IPatient>("Patient", patientSchema);
