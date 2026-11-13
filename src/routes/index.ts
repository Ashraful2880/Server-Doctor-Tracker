import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import doctorRoutes from '../modules/doctor/doctor.routes';
import patientRoutes from '../modules/patient/patient.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/doctors', doctorRoutes);
router.use('/patients', patientRoutes);
router.use('/analytics', analyticsRoutes);

export default router;

