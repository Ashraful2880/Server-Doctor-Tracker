import { Request, Response } from "express";
import * as doctorService from "./doctor.service";
import { sendResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { DoctorQueryParams } from "../../utils/InterfaceAll";

export const getDoctors = asyncHandler(async (req: Request, res: Response) => {
  const result = await doctorService.getDoctors(req.query as DoctorQueryParams);
  sendResponse(
    res,
    200,
    "Doctors fetched successfully",
    result.data,
    result.meta,
  );
});

export const getDoctorOptions = asyncHandler(
  async (_req: Request, res: Response) => {
    const options = await doctorService.getDoctorOptions();
    sendResponse(res, 200, "Doctor options fetched successfully", options);
  },
);

export const getDoctorById = asyncHandler(
  async (req: Request, res: Response) => {
    const doctor = await doctorService.getDoctorById(String(req.params.id));
    sendResponse(res, 200, "Doctor fetched successfully", doctor);
  },
);

export const createDoctor = asyncHandler(
  async (req: Request, res: Response) => {
    const doctor = await doctorService.createDoctor(req.body);
    sendResponse(res, 201, "Doctor created successfully", doctor);
  },
);

export const updateDoctor = asyncHandler(
  async (req: Request, res: Response) => {
    const doctor = await doctorService.updateDoctor(
      String(req.params.id),
      req.body,
    );
    sendResponse(res, 200, "Doctor updated successfully", doctor);
  },
);

export const deleteDoctor = asyncHandler(
  async (req: Request, res: Response) => {
    const doctor = await doctorService.deleteDoctor(String(req.params.id));
    sendResponse(res, 200, "Doctor deleted successfully", doctor);
  },
);
