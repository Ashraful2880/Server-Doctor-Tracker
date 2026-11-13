import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createPatientSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    age: z.coerce.number().int().min(0).max(150),
    gender: z.enum(["Male", "Female", "Other"]),
    phone: z.string().min(6, "Valid phone number is required").max(30),
    email: z
      .string()
      .email("Valid email is required")
      .optional()
      .or(z.literal("")),
    condition: z.string().min(2, "Condition is required").max(100),
    notes: z.string().max(500).optional(),
    doctorId: z.string().regex(objectIdRegex, "Valid doctor ID is required"),
  }),
});

export const updatePatientSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid patient ID"),
  }),
  body: z
    .object({
      name: z.string().min(2).max(100).optional(),
      age: z.coerce.number().int().min(0).max(150).optional(),
      gender: z.enum(["Male", "Female", "Other"]).optional(),
      phone: z.string().min(6).max(30).optional(),
      email: z.string().email().optional().or(z.literal("")),
      condition: z.string().min(2).max(100).optional(),
      notes: z.string().max(500).optional(),
      doctorId: z
        .string()
        .regex(objectIdRegex, "Valid doctor ID is required")
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required for update",
    }),
});

export const patientIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid patient ID"),
  }),
});
