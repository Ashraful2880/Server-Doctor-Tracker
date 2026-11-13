import {
  escapeRegex,
  buildPagination,
  buildDateRangeFilter,
} from "../../utils/pagination";
import mongoose from "mongoose";
import { Patient } from "./patient.model";
import { Doctor } from "../doctor/doctor.model";
import { createHttpError } from "../../utils/apiResponse";

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

export const getPatients = async (query: PatientQueryParams) => {
  const { page, limit, skip, sort } = buildPagination(
    query as Record<string, unknown>,
    ["createdAt", "name", "age", "condition"],
  );

  const filter: Record<string, unknown> = {};

  if (query.search && query.search.trim()) {
    const regex = new RegExp(escapeRegex(query.search.trim()), "i");
    filter.$or = [
      { name: regex },
      { phone: regex },
      { email: regex },
      { condition: regex },
    ];
  }

  if (query.condition && query.condition.trim()) {
    filter.condition = new RegExp(
      `^${escapeRegex(query.condition.trim())}$`,
      "i",
    );
  }

  if (query.gender && ["Male", "Female", "Other"].includes(query.gender)) {
    filter.gender = query.gender;
  }

  if (query.doctorId && mongoose.Types.ObjectId.isValid(query.doctorId)) {
    filter.doctorId = new mongoose.Types.ObjectId(query.doctorId);
  }

  const dateRange = buildDateRangeFilter(query.startDate, query.endDate);
  if (dateRange) {
    filter.createdAt = dateRange;
  }

  const [patients, total] = await Promise.all([
    Patient.find(filter)
      .populate("doctorId", "name specialization hospital")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Patient.countDocuments(filter),
  ]);

  return {
    data: patients,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const createPatient = async (payload: {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
  condition: string;
  notes?: string;
  doctorId: string;
}) => {
  const doctorExists = await Doctor.exists({ _id: payload.doctorId });
  if (!doctorExists) {
    throw createHttpError(404, "Assigned doctor not found");
  }

  const patient = await Patient.create({
    ...payload,
    email: payload.email || undefined,
  });

  return Patient.findById(patient._id)
    .populate("doctorId", "name specialization hospital")
    .lean();
};

export const updatePatient = async (
  id: string,
  payload: Partial<{
    name: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    phone: string;
    email?: string;
    condition: string;
    notes?: string;
    doctorId: string;
  }>,
) => {
  if (payload.doctorId) {
    const doctorExists = await Doctor.exists({ _id: payload.doctorId });
    if (!doctorExists) {
      throw createHttpError(404, "Assigned doctor not found");
    }
  }

  const patient = await Patient.findByIdAndUpdate(
    id,
    {
      ...payload,
      ...(payload.email === "" ? { $unset: { email: 1 } } : {}),
    },
    { new: true, runValidators: true },
  )
    .populate("doctorId", "name specialization hospital")
    .lean();

  if (!patient) {
    throw createHttpError(404, "Patient not found");
  }

  return patient;
};

export const deletePatient = async (id: string) => {
  const patient = await Patient.findByIdAndDelete(id).lean();
  if (!patient) {
    throw createHttpError(404, "Patient not found");
  }
  return patient;
};
