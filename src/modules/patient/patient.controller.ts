import { Request, Response } from "express";
import * as patientService from "./patient.service";
import { sendResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const getPatients = asyncHandler(async (req: Request, res: Response) => {
  const result = await patientService.getPatients(
    req.query as patientService.PatientQueryParams,
  );
  sendResponse(
    res,
    200,
    "Patients fetched successfully",
    result.data,
    result.meta,
  );
});

export const createPatient = asyncHandler(
  async (req: Request, res: Response) => {
    const patient = await patientService.createPatient(req.body);
    sendResponse(res, 201, "Patient created successfully", patient);
  },
);

export const updatePatient = asyncHandler(
  async (req: Request, res: Response) => {
    const patient = await patientService.updatePatient(
      String(req.params.id),
      req.body,
    );
    sendResponse(res, 200, "Patient updated successfully", patient);
  },
);

export const deletePatient = asyncHandler(
  async (req: Request, res: Response) => {
    const patient = await patientService.deletePatient(String(req.params.id));
    sendResponse(res, 200, "Patient deleted successfully", patient);
  },
);
