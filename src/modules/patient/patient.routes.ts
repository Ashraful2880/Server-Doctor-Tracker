import {
  createPatientSchema,
  updatePatientSchema,
  patientIdParamSchema,
} from "./patient.validation";
import { Router } from "express";
import * as patientController from "./patient.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router.use(authenticate);

router.get("/", patientController.getPatients);
router.post(
  "/",
  validate(createPatientSchema),
  patientController.createPatient,
);
router.patch(
  "/:id",
  validate(updatePatientSchema),
  patientController.updatePatient,
);
router.delete(
  "/:id",
  validate(patientIdParamSchema),
  patientController.deletePatient,
);

export default router;
