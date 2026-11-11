
import express from 'express';
import upload from '../../utils/ImgUploder.js';
import { logoController } from './logo.controller.js';

const router = express.Router();

// Logo image upload middleware
const logoImageUpload = upload.fields([
  { name: 'headerLogo', maxCount: 1 },
  { name: 'footerLogo', maxCount: 1 },
]);

// Create logo
router.post(
  '/create-logo',
  logoImageUpload,
  logoController.createLogo,
);

// Get all logos
router.get('/', logoController.getAllLogo);

// Update logo
router.patch(
  '/:id',
  logoImageUpload,
  logoController.updateSingleLogo,
);

// Delete logo
router.delete('/:id', logoController.deleteSingleLogo);

export const logoRoutes = router;
