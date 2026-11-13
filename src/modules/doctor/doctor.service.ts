import {
  escapeRegex,
  buildPagination,
  buildDateRangeFilter,
} from "../../utils/pagination";
import mongoose from "mongoose";
import { Doctor } from "./doctor.model";
import { Patient } from "../patient/patient.model";
import { createHttpError } from "../../utils/apiResponse";
import { DoctorQueryParams } from "../../utils/InterfaceAll";

export const getDoctors = async (query: DoctorQueryParams) => {
  const { page, limit, skip, sort } = buildPagination(
    query as Record<string, unknown>,
    ["createdAt", "name", "specialization", "hospital"],
  );

  const filter: Record<string, unknown> = {};

  if (query.search && query.search.trim()) {
    const regex = new RegExp(escapeRegex(query.search.trim()), "i");
    filter.$or = [
      { name: regex },
      { specialization: regex },
      { hospital: regex },
      { email: regex },
      { phone: regex },
    ];
  }

  if (query.specialization && query.specialization.trim()) {
    filter.specialization = new RegExp(
      `^${escapeRegex(query.specialization.trim())}$`,
      "i",
    );
  }

  if (query.hospital && query.hospital.trim()) {
    filter.hospital = new RegExp(escapeRegex(query.hospital.trim()), "i");
  }

  const dateRange = buildDateRangeFilter(query.startDate, query.endDate);
  if (dateRange) {
    filter.createdAt = dateRange;
  }

  const [doctors, total] = await Promise.all([
    Doctor.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Doctor.countDocuments(filter),
  ]);

  const doctorIds = doctors.map((doc) => doc._id);
  const patientCounts = doctorIds.length
    ? await Patient.aggregate<{ _id: mongoose.Types.ObjectId; count: number }>([
        { $match: { doctorId: { $in: doctorIds } } },
        { $group: { _id: "$doctorId", count: { $sum: 1 } } },
      ])
    : [];

  const countMap = new Map(
    patientCounts.map((item) => [String(item._id), item.count]),
  );

  const data = doctors.map((doc) => ({
    ...doc,
    patientCount: countMap.get(String(doc._id)) ?? 0,
  }));

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getDoctorOptions = async () => {
  return Doctor.find()
    .select("name specialization hospital")
    .sort({ name: 1 })
    .lean();
};

export const getDoctorById = async (id: string) => {
  const doctor = await Doctor.findById(id).lean();
  if (!doctor) {
    throw createHttpError(404, "Doctor not found");
  }

  const patientCount = await Patient.countDocuments({ doctorId: doctor._id });

  return {
    ...doctor,
    patientCount,
  };
};

export const createDoctor = async (payload: {
  name: string;
  phone: string;
  email: string;
  hospital: string;
  specialization: string;
}) => {
  const doctor = await Doctor.create(payload);
  return {
    ...doctor.toObject(),
    patientCount: 0,
  };
};

export const updateDoctor = async (
  id: string,
  payload: Partial<{
    name: string;
    phone: string;
    email: string;
    hospital: string;
    specialization: string;
  }>,
) => {
  const doctor = await Doctor.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!doctor) {
    throw createHttpError(404, "Doctor not found");
  }

  return doctor;
};

export const deleteDoctor = async (id: string) => {
  const doctor = await Doctor.findByIdAndDelete(id).lean();
  if (!doctor) {
    throw createHttpError(404, "Doctor not found");
  }

  await Patient.deleteMany({ doctorId: doctor._id });
  return doctor;
};
