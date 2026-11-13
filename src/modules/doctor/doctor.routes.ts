import {
  updateDoctorSchema,
  createDoctorSchema,
  doctorIdParamSchema,
} from "./doctor.validation";
import { Router } from "express";
import * as doctorController from "./doctor.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router.use(authenticate);

router.get("/options", doctorController.getDoctorOptions);
router.get("/", doctorController.getDoctors);
router.post("/", validate(createDoctorSchema), doctorController.createDoctor);
router.get(
  "/:id",
  validate(doctorIdParamSchema),
  doctorController.getDoctorById,
);
router.patch(
  "/:id",
  validate(updateDoctorSchema),
  doctorController.updateDoctor,
);
router.delete(
  "/:id",
  validate(doctorIdParamSchema),
  doctorController.deleteDoctor,
);

export default router;
