import mongoose, { Document } from "mongoose";

export interface PaginationOptions {
  page: number;
  skip: number;
  limit: number;
  sort: Record<string, 1 | -1>;
}

export interface JwtPayload {
  role: string;
  email: string;
  userId: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ErrorWithStatus extends Error {
  code?: number;
  statusCode?: number;
  keyValue?: Record<string, unknown>;
}

export interface IUser extends Document {
  name: string;
  email: string;
  role: "admin";
  createdAt: Date;
  updatedAt: Date;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IDoctor extends Document {
  name: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  hospital: string;
  specialization: string;
}

export interface PatientQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  gender?: string;
  sortBy?: string;
  endDate?: string;
  doctorId?: string;
  condition?: string;
  startDate?: string;
  sortOrder?: string;
}

export interface IPatient extends Document {
  name: string;
  age: number;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  condition: string;
  doctorId: mongoose.Types.ObjectId;
  gender: "Male" | "Female" | "Other";
}

export interface DoctorQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  endDate?: string;
  hospital?: string;
  startDate?: string;
  sortOrder?: string;
  specialization?: string;
}