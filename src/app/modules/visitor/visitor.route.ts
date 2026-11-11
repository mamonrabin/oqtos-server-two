import express from 'express';
import { visitorController } from './visitor.controller.js';

const router = express.Router();

router.post('/track', visitorController.trackPageView);

router.post('/heartbeat', visitorController.visitorHeartbeat);

router.get(
  '/stats',

  visitorController.getVisitorStats,
);

export const visitorRoutes = router;
