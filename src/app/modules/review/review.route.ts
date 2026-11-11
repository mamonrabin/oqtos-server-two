
import express from 'express';
import { reviewController } from './review.controller.js';
import upload from '../../utils/ImgUploder.js';

const router = express.Router();

// Review image upload middleware
const reviewImageUpload = upload.fields([
  { name: 'images', maxCount: 5 },
]);

// Create review
router.post(
  '/create-review',
  reviewImageUpload,
  reviewController.createReview,
);

// Get reviews
router.get('/', reviewController.getReview);
router.get('/all', reviewController.getAllReview);
router.get('/status', reviewController.getReviewbyStatus);

// Get single review
router.get('/:id', reviewController.getSingleReview);

// Update review
router.patch(
  '/:id',
  reviewImageUpload,
  reviewController.updateSingleReview,
);

// Delete review
router.delete('/:id', reviewController.deleteSingleReview);

export const reviewRoutes = router;
