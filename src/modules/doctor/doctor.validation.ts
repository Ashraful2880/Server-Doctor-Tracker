import { z } from 'zod';

export const createDoctorSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    specialization: z.string().min(2, 'Specialization is required').max(100),
    hospital: z.string().min(2, 'Hospital is required').max(120),
    phone: z.string().min(6, 'Valid phone number is required').max(30),
    email: z.string().email('Valid email is required'),
  }),
});

export const updateDoctorSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid doctor ID'),
  }),
  body: z
    .object({
      name: z.string().min(2).max(100).optional(),
      specialization: z.string().min(2).max(100).optional(),
      hospital: z.string().min(2).max(120).optional(),
      phone: z.string().min(6).max(30).optional(),
      email: z.string().email().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required for update',
    }),
});

export const doctorIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid doctor ID'),
  }),
});

