
import express from 'express';
import upload from '../../utils/ImgUploder.js';
import { subcategoryController } from './sub-category.controller.js';

const router = express.Router();

const subCategoryImageUpload = upload.single('image');

// Create subcategory
router.post(
  '/create-subcategory',
  subCategoryImageUpload,
  subcategoryController.createSubCategory,
);

// Get all subcategories
router.get('/all', subcategoryController.getAllSubCategoryWithOutBuilder);
router.get('/', subcategoryController.getAllSubCategory);

// Get single subcategory by slug
router.get(
  '/subcategorySlug/:slug',
  subcategoryController.getSingleSubCategoryBySlug,
);

// Get single subcategory by ID
router.get('/:id', subcategoryController.getSingleSubCategory);

// Update subcategory
router.put(
  '/:id',
  subCategoryImageUpload,
  subcategoryController.updateSingleSubCategory,
);

// Delete subcategory
router.delete('/:id', subcategoryController.deleteSingleSubCategory);

export const subcategoryRoutes = router;
