import { Router } from 'express';
import * as analyticsController from './analytics.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/dashboard', analyticsController.getDashboardAnalytics);

export default router;

